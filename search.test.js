import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {performance} from 'node:perf_hooks';
import {createHash} from 'node:crypto';
import {search, workspaceCatalog, UNGROUPED_WORKSPACE_ID, finalDocuments, processDocuments, LIMIT, MATCH_TIMEOUT_MS, MAX_SNIPPET, MAX_RANGES} from './search.js';
import {apply} from './index.js';
const text = text => ({type: 'text', text});
const event = (type, seq, data, time = seq) => ({type, seq, time, data});
function turn(n, value = 'needle', time = n * 10) {
  return [event('turn/start', n * 4, {turn: n}),
    event('assistant/message', n * 4 + 1, {turn: n, message: {content: [text(value), {type: 'reasoning', text: 'secret reasoning'}]}}, time),
    event('turn/end', n * 4 + 2, {turn: n, reason: {kind: 'completed'}})];
}
const row = (sessionId, updatedAt, extra = {}) => ({sessionId, updatedAt, blank: false, projections: {values: {title: `Title ${sessionId}`}}, ...extra});
function fixture(rows = [row('s', 20)], logs = {s: turn(1)}, archives = [], workspaces = []) {
  const state = {closed: 0, disposed: 0, reads: [], catalogs: 0};
  return {state,
    sessionController: {list: async (_input, signal) => {state.catalogs++; signal.throwIfAborted(); return {items: rows};}},
    workspaceController: {async *follow() {try {yield {type: 'baseline', value: {items: workspaces, archivedSessionIds: archives, pinnedSessionIds: []}};} finally {state.closed++;}}},
    sessionQuery: {
      listSessions: async () => [],
      readTitleSnapshots: async ids => ids.map(sessionId => ({sessionId, status: 'fulfilled', value: {}})),
      observeSession: async id => {state.reads.push(id); if (logs[id] instanceof Error) throw logs[id]; return {events: logs[id] || [], [Symbol.dispose]: () => state.disposed++};},
    }};
}
const workspace = (workspaceId, sessionIds = [], path = `/work/${workspaceId}`) => ({workspaceId, sessionIds, path, title: `Workspace ${workspaceId}`, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z'});
const ids = result => result.items.map(item => item.sessionId);
const marked = hit => hit.ranges.map(range => hit.snippet.slice(range.start, range.end));
async function allPages(services, input) {
  const items = [];
  let cursor;
  do {const page = await search(services, {...input, ...(cursor ? {cursor} : {})}); items.push(...page.items); cursor = page.nextCursor;} while (cursor);
  return items;
}
test('catalog keeps sidebar eligibility, titles, chronology, archive/subagent labels without reading logs', async () => {
  const f = fixture([row('old', 500), row('new', 1000), row('b', 700), row('a', 700), row('blank', 10000, {blank: true}), row('fork', 600, {parentSessionId: 'missing'}), row('new', 1000), row('archive', 1100), row('child', 1200, {origin: 'subagent'})], {}, ['archive']);
  assert.deepEqual(ids(await search(f, {action: 'sessions'})), ['new', 'a', 'b', 'fork', 'old']);
  const included = await search(f, {action: 'sessions', includeArchived: true, includeSubagents: true});
  assert.equal(included.items.find(x => x.sessionId === 'archive').archived, true);
  assert.equal(included.items.find(x => x.sessionId === 'child').subagent, true);
  assert.equal(f.state.closed, 2); assert.equal(f.state.reads.length, 0);
  const untitled = fixture([row('raw-id', 5, {projections: undefined})]);
  assert.equal((await search(untitled, {action: 'sessions'})).items[0].title, '');
});
test('cold subagent supplement remains opt-in and excluded scopes reject', async () => {
  const f = fixture([row('s', 20), row('child', 30, {origin: 'subagent'}), row('archive', 40)], {s: turn(1), child: turn(2), cold: turn(3), archive: turn(4)}, ['archive']);
  f.sessionQuery.listSessions = async () => [{header: {id: 'cold', createdAt: 50, origin: 'subagent'}}, {header: {id: 'internal', createdAt: 999}}];
  assert.deepEqual(ids(await search(f, {query: 'needle'})), ['s']);
  assert.deepEqual(ids(await search(f, {query: 'needle', includeArchived: true, includeSubagents: true})), ['archive', 'cold', 'child', 's']);
  await assert.rejects(search(f, {query: 'needle', sessionId: 'child'}), /excluded/);
  await assert.rejects(search(f, {query: 'needle', sessionId: 'archive'}), /excluded/);
});
test('workspace catalog and every action default to all workspaces and expose metadata in scoped responses', async () => {
  const workspaces = [workspace('one', ['a']), workspace('two', ['b']), workspace('empty')];
  const f = fixture([row('a', 30, {cwd: '/work/two'}), row('b', 20), row('loose', 10)], {a: [...turn(1), ...turn(2)], b: turn(3), loose: turn(4)}, [], workspaces);
  assert.deepEqual(workspaceCatalog({items: workspaces}).map(x => x.workspaceId), ['one', 'two', 'empty', UNGROUPED_WORKSPACE_ID]);
  for (const action of ['sessions', 'search', 'groups']) {
    const input = {action, ...(action === 'sessions' ? {} : {query: 'needle'})};
    const all = await search(f, input);
    assert.equal(all.workspaceId, null); assert.equal(all.scope, 'all');
    assert.deepEqual(new Set(ids(all)), new Set(['a', 'b', 'loose']));
    assert.deepEqual(all.workspaces.map(x => [x.workspaceId, x.sessionCount]), [['one', 1], ['two', 1], ['empty', 0], [UNGROUPED_WORKSPACE_ID, 1]]);
    for (const workspaceId of ['one', 'two', 'empty', UNGROUPED_WORKSPACE_ID]) {
      const before = f.state.reads.length;
      const scoped = await search(f, {...input, workspaceId});
      assert.deepEqual(scoped.items, all.items.filter(item => item.workspaceId === workspaceId));
      assert.deepEqual(scoped.workspaces, all.workspaces);
      assert.equal(scoped.workspaceId, workspaceId);
      assert.equal(scoped.workspaceTitle, all.workspaces.find(x => x.workspaceId === workspaceId).title);
      assert.equal(scoped.workspacePath, all.workspaces.find(x => x.workspaceId === workspaceId).path);
      if (action === 'sessions') assert.equal(f.state.reads.length, before);
      else {
        assert.deepEqual(f.state.reads.slice(before), workspaceId === 'one' ? ['a'] : workspaceId === 'two' ? ['b'] : workspaceId === UNGROUPED_WORKSPACE_ID ? ['loose'] : []);
        assert.equal(scoped.scanned, workspaceId === 'empty' ? 0 : 1);
        if (action === 'groups') assert.equal(scoped.totalMatches, workspaceId === 'one' ? 2 : workspaceId === 'empty' ? 0 : 1);
      }
    }
    const a = all.items.find(x => x.sessionId === 'a');
    assert.equal(a.workspaceId, 'one'); assert.equal(a.workspaceTitle, 'Workspace one'); assert.equal(a.workspacePath, '/work/one');
    assert.equal(all.items.find(x => x.sessionId === 'loose').workspaceTitle, 'Ungrouped sessions');
  }
});
test('workspace scopes reject stale IDs and conflicting sessions for all actions without reading logs', async () => {
  for (const action of ['sessions', 'search', 'groups']) {
    const f = fixture([row('a', 2), row('b', 1)], {a: turn(1), b: turn(2)}, [], [workspace('one', ['a']), workspace('two', ['b'])]);
    const input = {action, query: 'needle'};
    await assert.rejects(search(f, {...input, workspaceId: 'deleted'}), /Workspace is unavailable/);
    await assert.rejects(search(f, {...input, workspaceId: 'one', sessionId: 'b'}), /does not belong to the selected workspace/);
    await assert.rejects(search(f, {...input, workspaceId: 'one', sessionId: 'missing'}), /unavailable or excluded/);
    assert.deepEqual(f.state.reads, []);
    const result = await search(f, {...input, workspaceId: 'one', sessionId: 'a'});
    assert.deepEqual(ids(result), ['a']); assert.equal(result.scope, 'a'); assert.equal(result.workspaceId, 'one');
  }
  for (const workspaceId of ['', ' ', 10, null, 'w'.repeat(513)]) await assert.rejects(search(fixture(), {action: 'sessions', workspaceId}), /workspaceId/);
});
test('workspace assignment uses registry then unique exact roots, never descendants or ambiguous membership', async () => {
  const workspaces = [workspace('one', ['registered', 'ambiguous'], 'C:\\Work\\One\\'), workspace('two', ['ambiguous'], 'C:/Work/Two'), workspace('duplicate', [], 'c:/work/two/'), workspace('posix', [], '/Case'), workspace('root', [], 'C:/')];
  const rows = [row('registered', 1, {cwd: 'C:/Work/Two'}), row('exact', 2, {cwd: 'c:/work/ONE/'}), row('nested', 3, {cwd: 'C:/Work/One/child'}), row('ambiguous', 4, {cwd: 'C:/Work/One'}), row('duplicate-root', 5, {cwd: 'C:/Work/Two'}), row('case-sensitive', 6, {cwd: '/case'}), row('posix-exact', 7, {cwd: '/Case/'}), row('root', 8, {cwd: 'c:\\'}), row('unknown', 9)];
  const result = await search(fixture(rows, {}, [], workspaces), {action: 'sessions'});
  const assigned = Object.fromEntries(result.items.map(x => [x.sessionId, x.workspaceId]));
  assert.deepEqual(assigned, {unknown: UNGROUPED_WORKSPACE_ID, root: 'root', 'posix-exact': 'posix', 'case-sensitive': UNGROUPED_WORKSPACE_ID, 'duplicate-root': UNGROUPED_WORKSPACE_ID, ambiguous: UNGROUPED_WORKSPACE_ID, nested: UNGROUPED_WORKSPACE_ID, exact: 'one', registered: 'one'});
});
test('workspace assignment follows cold nested subagent parents including excluded parents, overrides cwd and stops cycles', async () => {
  const workspaces = [workspace('one', ['parent', 'cold-parent']), workspace('two', ['explicit-child'])];
  const rows = [row('parent', 1, {blank: true}), row('child', 2, {origin: 'subagent', parentSessionId: 'parent', cwd: '/work/two'}), row('explicit-child', 3, {origin: 'subagent', parentSessionId: 'parent'}), row('cycle-a', 4, {origin: 'subagent', parentSessionId: 'cycle-b', cwd: '/work/two'}), row('missing-parent', 5, {origin: 'subagent', parentSessionId: 'missing', cwd: '/work/two'})];
  const f = fixture(rows, Object.fromEntries(['child', 'explicit-child', 'cycle-a', 'missing-parent', 'cold-parent', 'nested', 'cycle-b'].map((id, i) => [id, turn(i + 1)])), ['parent', 'cold-parent', 'nested'], workspaces);
  f.sessionQuery.listSessions = async () => [
    {header: {id: 'cold-parent', createdAt: 6, origin: 'subagent', parentSession: 'parent'}},
    {header: {id: 'nested', createdAt: 7, origin: 'subagent', parentSession: 'cold-parent', cwd: '/work/two'}},
    {header: {id: 'cycle-b', createdAt: 8, origin: 'subagent', parentSession: 'cycle-a', cwd: '/work/two'}},
  ];
  for (const action of ['sessions', 'search', 'groups']) {
    const input = {action, query: 'needle', includeSubagents: true};
    const visible = await search(f, {...input, workspaceId: 'one'});
    assert.deepEqual(ids(visible), ['child']);
    const included = await search(f, {...input, includeArchived: true, workspaceId: 'one'});
    assert.deepEqual(new Set(ids(included)), new Set(['child', 'cold-parent', 'nested']));
    assert.equal(included.items.find(x => x.sessionId === 'nested').archived, true);
    assert.equal(included.items.find(x => x.sessionId === 'nested').parentSession, 'cold-parent');
    const other = await search(f, {...input, workspaceId: 'two'});
    assert.deepEqual(ids(other), ['explicit-child']);
    const ungrouped = await search(f, {...input, workspaceId: UNGROUPED_WORKSPACE_ID});
    assert.deepEqual(new Set(ids(ungrouped)), new Set(['cycle-a', 'cycle-b', 'missing-parent']));
  }
  assert.deepEqual(ids(await search(f, {action: 'sessions', workspaceId: 'one'})), []);
});
test('workspace search and group pagination isolate cursors and invalidate changed membership', async () => {
  const rows = Array.from({length: LIMIT + 2}, (_, i) => row(`s${i}`, i));
  const logs = Object.fromEntries(rows.map((r, i) => [r.sessionId, [...turn(1, 'needle', i), ...turn(2, 'needle', i + 100)]]));
  const workspaces = [workspace('one', rows.map(r => r.sessionId)), workspace('two')];
  const f = fixture(rows, logs, [], workspaces);
  for (const action of ['search', 'groups']) {
    const input = {action, query: 'needle', workspaceId: 'one'};
    const first = await search(f, input);
    for (const workspaceId of [undefined, 'two', UNGROUPED_WORKSPACE_ID]) await assert.rejects(search(f, {...input, workspaceId, cursor: first.nextCursor}), /Invalid search cursor/);
    const all = await search(f, {action, query: 'needle'});
    await assert.rejects(search(f, {...input, cursor: all.nextCursor}), /Invalid search cursor/);
    assert.equal((await allPages(f, input)).length, action === 'groups' ? rows.length : rows.length * 2);
    assert.ok((await allPages(f, input)).every(item => item.workspaceId === 'one'));
    workspaces[0].sessionIds.pop(); workspaces[1].sessionIds.push(rows.at(-1).sessionId);
    await assert.rejects(search(f, {...input, cursor: first.nextCursor}), /History changed/);
    workspaces[0].sessionIds.push(workspaces[1].sessionIds.pop());
  }
});
test('final projection selects only final successful text response and all preserves process documents', async () => {
  const events = [event('user/message', 0, {content: [text('user needle')]}),
    event('turn/start', 1, {turn: 1}), event('assistant/message', 2, {turn: 1, message: {content: [text('progress needle')]}}),
    event('assistant/message', 3, {turn: 1, message: {content: [text('final reply'), {type: 'reasoning', text: 'hidden needle'}]}}),
    event('turn/end', 4, {turn: 1, reason: {kind: 'completed'}}),
    event('turn/start', 5, {turn: 2}), event('assistant/message', 6, {turn: 2, message: {content: [text('tool needle'), {type: 'tool-call', name: 'finish', arguments: 'needle'}]}}),
    event('turn/end', 7, {turn: 2, reason: {kind: 'completed'}}),
    event('turn/start', 8, {turn: 3}), event('assistant/message', 9, {turn: 3, interrupted: true, message: {content: [text('partial needle')]}}),
    event('turn/end', 10, {turn: 3, reason: {kind: 'aborted'}}),
    event('turn/start', 11, {turn: 4}), event('assistant/message', 12, {turn: 4, message: {content: [text('unfinished needle')]}})];
  assert.deepEqual(finalDocuments(events, 's').map(doc => doc.text), ['final reply']);
  const f = fixture(undefined, {s: events});
  assert.equal((await search(f, {query: 'needle'})).total, 0);
  assert.equal((await search(f, {query: 'needle', content: 'all'})).total, 6);
  assert.equal(f.state.disposed, 2);
  assert.deepEqual(processDocuments([event('assistant/attempt', 1, {stream: [{type: 'reasoning-chunks', texts: ['attempt reasoning']}]}), event('tool/call', 2, {name: 'run', arguments: 'args'}), event('tool/result', 3, {message: {content: [text('result')]}})], 's').map(d => d.text), ['attempt reasoning', 'run\nargs', 'result']);
});
test('global search no longer groups: sidebar two documents equal all-scope two documents', async () => {
  const f = fixture(undefined, {s: [...turn(1), ...turn(2)]});
  const global = await search(f, {query: 'needle'}), scoped = await search(f, {query: 'needle', sessionId: 's'});
  assert.equal(global.total, 2); assert.equal(scoped.total, 2); assert.deepEqual(global.items, scoped.items);
});
test('all docs globally sort by matching-message time, then deterministic ID/sequence ties', async () => {
  const f = fixture([row('a', 5000), row('b', 1)], {a: [...turn(1, 'needle', 10), ...turn(2, 'needle', 90)], b: turn(1, 'needle', 50)});
  assert.deepEqual((await search(f, {query: 'needle'})).items.map(d => [d.sessionId, d.time]), [['a', 90], ['b', 50], ['a', 10]]);
  assert.deepEqual((await search(f, {query: 'needle', order: 'oldest'})).items.map(d => [d.sessionId, d.time]), [['a', 10], ['b', 50], ['a', 90]]);
});
test('default literal matching escapes metacharacters, folds case, flexes whitespace and echoes false flags', async () => {
  const f = fixture(undefined, {s: turn(1, 'AA literal.*\n  text')});
  const result = await search(f, {query: 'LITERAL.* text'});
  assert.equal(result.total, 1); assert.deepEqual(marked(result.items[0]), ['literal.*\n  text']);
  for (const flag of ['matchCase', 'wholeWord', 'useRegex']) assert.equal(result[flag], false);
  assert.equal((await search(f, {query: 'literalZZ'})).total, 0);
  assert.equal((await search(f, {query: 'LITERAL.* text', matchCase: true})).total, 0);
});
test('all eight match-case/whole-word/regex combinations compose', async () => {
  const f = fixture(undefined, {s: turn(1, 'prefix Cat Catapult CAT cat')});
  for (const matchCase of [false, true]) for (const wholeWord of [false, true]) for (const useRegex of [false, true]) {
    const result = await search(f, {query: useRegex ? 'C[a]t' : 'Cat', matchCase, wholeWord, useRegex});
    assert.equal(result.total, 1);
    assert.deepEqual(marked(result.items[0]), matchCase ? wholeWord ? ['Cat'] : ['Cat', 'Cat'] : wholeWord ? ['Cat', 'CAT', 'cat'] : ['Cat', 'Cat', 'CAT', 'cat']);
    assert.equal(result.matchCase, matchCase); assert.equal(result.wholeWord, wholeWord); assert.equal(result.useRegex, useRegex);
  }
});
test('whole word tests adjacent Unicode letters/numbers/underscore, including astral letters, not ASCII b', async () => {
  const cases = [['éfoo', 'foo', false], ['foo中', 'foo', false], ['foo٣', 'foo', false], ['_foo', 'foo', false], ['foo_', 'foo', false], ['𐐀foo', 'foo', false], ['foo𐐀', 'foo', false], ['😀foo😀', 'foo', true], ['(你好)', '你好', true], ['你好吗', '你好', false], ['aé', 'é', false], ['é!', 'é', true]];
  for (const [value, query, expected] of cases) for (const useRegex of [false, true]) {
    assert.equal((await search(fixture(undefined, {s: turn(1, value)}), {query, wholeWord: true, useRegex})).total, Number(expected), `${value} / ${query}`);
  }
  const alternative = await search(fixture(undefined, {s: turn(1, 'foobar')}), {query: 'foo|foobar', wholeWord: true, useRegex: true});
  assert.deepEqual(marked(alternative.items[0]), ['foobar']);
  const backref = await search(fixture(undefined, {s: turn(1, 'foofoo')}), {query: '(foo)\\1', wholeWord: true, useRegex: true});
  assert.deepEqual(marked(backref.items[0]), ['foofoo']);
});
test('regex is Unicode source, honors conditional case, and never parses slash delimiters', async () => {
  const f = fixture(undefined, {s: turn(1, 'Écho /foo/i foo １２3')});
  assert.deepEqual(marked((await search(f, {query: '\\p{L}+', useRegex: true})).items[0]), ['Écho', 'foo', 'i', 'foo']);
  assert.equal((await search(f, {query: '^écho', useRegex: true})).total, 1);
  assert.equal((await search(f, {query: '^écho', useRegex: true, matchCase: true})).total, 0);
  assert.deepEqual(marked((await search(f, {query: '/foo/i', useRegex: true})).items[0]), ['/foo/i']);
  assert.equal((await search(fixture(undefined, {s: turn(1, 'foo')}), {query: '/foo/i', useRegex: true})).total, 0);
});
test('invalid regular expressions fail before catalog or session reads, even on empty corpus', async () => {
  for (const query of ['[', '(?<x>', '\\q', '(?=', ')(?:']) for (const wholeWord of [false, true]) {
    const f = fixture([]);
    await assert.rejects(search(f, {query, useRegex: true, wholeWord}), error => error.code === 'INVALID_REGEX' && /Invalid regular expression/.test(error.message));
    assert.equal(f.state.catalogs, 0); assert.equal(f.state.reads.length, 0);
  }
});
test('pathological regex deadline rejects entire global/scoped search, disposes lease and does not scan later sessions', async () => {
  for (const sessionId of [undefined, 'bad']) {
    const f = fixture([row('ok', 3), row('bad', 2), row('after', 1)], {ok: turn(1, 'a'), bad: turn(1, `${'a'.repeat(50000)}!`), after: turn(1, 'a')});
    const start = performance.now();
    await assert.rejects(search(f, {query: '(a+)+$', useRegex: true, ...(sessionId ? {sessionId} : {})}), error => error.code === 'SEARCH_MATCH_TIMEOUT' && /No partial results/.test(error.message));
    assert.ok(performance.now() - start < 3000, 'deadline must interrupt catastrophic backtracking');
    assert.equal(f.state.disposed, sessionId ? 1 : 2); assert.ok(!f.state.reads.includes('after'));
  }
  assert.equal(MATCH_TIMEOUT_MS, 100);
});
test('one hard deadline covers the complete session, not a fresh budget per candidate', async () => {
  const events = Array.from({length: 5000}, (_, i) => event('user/message', i, {content: [text(`${'a'.repeat(16)}!`)]}));
  const f = fixture(undefined, {s: events});
  const start = performance.now();
  await assert.rejects(search(f, {query: '(a+)+$', useRegex: true, content: 'all'}), error => error.code === 'SEARCH_MATCH_TIMEOUT');
  assert.ok(performance.now() - start < 3000); assert.equal(f.state.disposed, 1);
});
test('zero-width matches advance by Unicode code point, retain zero-size ranges, and terminate at end', async () => {
  const f = fixture(undefined, {s: turn(1, '😀x')});
  assert.deepEqual((await search(f, {query: '(?:)', useRegex: true})).items[0].ranges, [{start: 0, end: 0}, {start: 2, end: 2}, {start: 3, end: 3}]);
  assert.deepEqual((await search(f, {query: '$', useRegex: true})).items[0].ranges, [{start: 3, end: 3}]);
});
test('snippet ranges retain original full-document anchors/lookbehind/lookahead and whole-word context', async () => {
  const value = `BEGIN ${'x'.repeat(240)} context-target-end ${'z'.repeat(700)} END`;
  const f = fixture(undefined, {s: turn(1, value)});
  const behind = (await search(f, {query: '(?<=BEGIN x{240} context-)target(?=-end z{700} END$)', useRegex: true})).items[0];
  assert.ok(behind.snippet.startsWith('…')); assert.deepEqual(marked(behind), ['target']);
  assert.ok(!behind.snippet.includes('BEGIN')); assert.ok(!behind.snippet.includes('END'));
  const anchor = (await search(f, {query: '^BEGIN|END$', useRegex: true})).items[0];
  assert.deepEqual(marked(anchor), ['BEGIN']);
  const endAnchor = (await search(f, {query: 'END$', useRegex: true})).items[0];
  assert.deepEqual(marked(endAnchor), ['END']); assert.ok(!endAnchor.snippet.endsWith('…'));
  const word = (await search(fixture(undefined, {s: turn(1, `x${'a'.repeat(99)}foo foo`)}), {query: 'foo', wholeWord: true})).items[0];
  assert.deepEqual(marked(word), ['foo']);
});
test('snippet and UTF-16 ranges are bounded, clipped to visible text, and exclude ellipses', async () => {
  const f = fixture(undefined, {s: turn(1, `😀 ${'x'.repeat(2000)}`)});
  const hit = (await search(f, {query: 'x+', useRegex: true})).items[0];
  assert.ok(hit.snippet.length <= MAX_SNIPPET); assert.equal(hit.rangesTruncated, true);
  assert.equal(hit.ranges[0].start, 3); assert.equal(hit.snippet.slice(hit.ranges[0].end), '…');
  const many = (await search(fixture(undefined, {s: turn(1, 'a'.repeat(1000))}), {query: '(?=a)', useRegex: true})).items[0];
  assert.equal(many.ranges.length, MAX_RANGES); assert.equal(many.rangesTruncated, true);
  for (const range of [...hit.ranges, ...many.ranges]) assert.ok(range.start >= 0 && range.start <= range.end && range.end <= MAX_SNIPPET);
});
test('global/scoped full-result equality survives both orders and multiple pages with many documents per session', async () => {
  const logs = {a: Array.from({length: LIMIT + 3}, (_, i) => turn(i + 1, 'needle', i * 2)).flat(), b: Array.from({length: LIMIT + 2}, (_, i) => turn(i + 1, 'needle', i * 2 + 1)).flat()};
  const f = fixture([row('a', 99), row('b', 1)], logs);
  for (const order of ['newest', 'oldest']) {
    const input = {query: 'needle', order, matchCase: true, wholeWord: true, useRegex: true};
    const global = await allPages(f, input);
    assert.equal(global.length, LIMIT * 2 + 5);
    for (const sessionId of ['a', 'b']) assert.deepEqual(global.filter(doc => doc.sessionId === sessionId), await allPages(f, {...input, sessionId}));
    assert.deepEqual(global.map(d => d.time), Array.from({length: global.length}, (_, i) => order === 'oldest' ? i : global.length - i - 1));
  }
});
test('cursor binds query, session, scope, content, order and all three flags; default/explicit false are equivalent', async () => {
  const logs = {s: Array.from({length: LIMIT + 1}, (_, i) => turn(i)).flat()};
  const f = fixture(undefined, logs);
  const input = {query: 'needle', sessionId: 's'};
  const first = await search(f, input);
  for (const change of [{includeArchived: true}, {includeSubagents: true}, {content: 'all'}, {order: 'oldest'}, {query: 'different'}, {sessionId: undefined}, {matchCase: true}, {wholeWord: true}, {useRegex: true}]) {
    await assert.rejects(search(f, {...input, ...change, cursor: first.nextCursor}), /Invalid search cursor/);
  }
  const last = await search(f, {...input, matchCase: false, wholeWord: 'false', useRegex: false, cursor: first.nextCursor});
  assert.equal(last.items.length, 1); assert.equal(last.nextCursor, undefined);
  const decoded = JSON.parse(Buffer.from(first.nextCursor, 'base64url').toString());
  decoded.offset = Number.MAX_SAFE_INTEGER;
  await assert.rejects(search(f, {...input, cursor: Buffer.from(JSON.stringify(decoded)).toString('base64url')}), /Invalid search cursor/);
  logs.s.push(...turn(100));
  await assert.rejects(search(f, {...input, cursor: first.nextCursor}), /History changed/);
});
test('validation, cancellation, and ordinary partial read failures remain explicit', async () => {
  for (const input of [null, [], {}, {query: '  '}, {query: 'x'.repeat(1025)}, {query: 'x', includeArchived: 'yes'}, {query: 'x', order: 'bad'}, {action: 'delete'}, ...['matchCase', 'wholeWord', 'useRegex'].map(flag => ({query: 'x', [flag]: 1}))]) await assert.rejects(search(fixture(), input));
  const controller = new AbortController(); controller.abort();
  await assert.rejects(search(fixture(), {query: 'needle'}, controller.signal), {name: 'AbortError'});
  const f = fixture(undefined, {s: new Error('corrupt')});
  assert.equal((await search(f, {query: 'needle'})).warnings[0].error, 'corrupt');
  await assert.rejects(search(f, {query: 'needle', sessionId: 's'}), /corrupt/);
});
test('groups count every matching reply beyond LIMIT, not occurrences or the first result page', async () => {
  const many = LIMIT * 2 + 7;
  const f = fixture([row('busy', 1), row('quiet', 9000), row('empty', 10000)], {
    busy: Array.from({length: many}, (_, i) => turn(i + 1, 'needle needle needle', i)).flat(),
    quiet: turn(1, 'needle needle', many + 1), empty: turn(1, 'unrelated', 99999),
  });
  const result = await search(f, {action: 'groups', query: 'needle'});
  assert.equal(result.total, 2); assert.equal(result.totalMatches, many + 1); assert.equal(result.scanned, 3);
  assert.deepEqual(result.items.map(({sessionId, count, time}) => ({sessionId, count, time})), [
    {sessionId: 'quiet', count: 1, time: many + 1}, {sessionId: 'busy', count: many, time: many - 1},
  ]);
  assert.equal(result.nextCursor, undefined);
  assert.equal((await search(f, {query: 'needle'})).items.length, LIMIT);
  const scoped = await search(f, {action: 'groups', query: 'needle', sessionId: 'busy'});
  assert.equal(scoped.scope, 'busy'); assert.equal(scoped.total, 1); assert.equal(scoped.totalMatches, many);
  assert.equal(scoped.items[0].count, many);
});
test('group time/order use matching messages, not catalog activity or newer nonmatching replies', async () => {
  const f = fixture([row('b', 10000), row('a', 1), row('c', 9000)], {
    a: [...turn(1, 'needle', 10), ...turn(2, 'needle', 90), ...turn(3, 'unrelated', 99999)],
    b: [...turn(1, 'needle', 50), ...turn(2, 'unrelated', 999999)], c: turn(1, 'needle', 90),
  });
  const newest = await search(f, {action: 'groups', query: 'needle'});
  assert.deepEqual(newest.items.map(x => [x.sessionId, x.count, x.time]), [['a', 2, 90], ['c', 1, 90], ['b', 1, 50]]);
  const oldest = await search(f, {action: 'groups', query: 'needle', order: 'oldest'});
  assert.deepEqual(oldest.items.map(x => [x.sessionId, x.count, x.time]), [['a', 2, 10], ['b', 1, 50], ['c', 1, 90]]);
  f.sessionQuery.observeSession = async id => ({events: turn(1, 'needle', 50), [Symbol.dispose]() {}});
  for (const order of ['newest', 'oldest']) assert.deepEqual(ids(await search(f, {action: 'groups', query: 'needle', order})), ['a', 'b', 'c']);
});
test('groups retain title/archive/subagent badges, scopes and cold subagents; omit zero-match sessions', async () => {
  const f = fixture([row('normal', 5), row('archive', 4), row('child', 3, {origin: 'subagent', parentSessionId: 'normal'}), row('blank', 2, {blank: true}), row('empty', 1)],
    {normal: turn(1), archive: turn(2), child: turn(3), cold: turn(4), blank: turn(5), empty: turn(6, 'unrelated')}, ['archive', 'cold']);
  f.sessionQuery.listSessions = async () => [{header: {id: 'cold', createdAt: 9, origin: 'subagent', parentSession: 'normal'}}];
  assert.deepEqual(ids(await search(f, {action: 'groups', query: 'needle'})), ['normal']);
  assert.deepEqual(ids(await search(f, {action: 'groups', query: 'needle', includeArchived: true})), ['archive', 'normal']);
  assert.deepEqual(ids(await search(f, {action: 'groups', query: 'needle', includeSubagents: true})), ['child', 'normal']);
  const included = await search(f, {action: 'groups', query: 'needle', includeArchived: true, includeSubagents: true});
  assert.deepEqual(ids(included), ['cold', 'child', 'archive', 'normal']);
  assert.equal(included.totalMatches, 4);
  const child = included.items.find(x => x.sessionId === 'child');
  assert.equal(child.title, 'Title child'); assert.equal(child.subagent, true); assert.equal(child.archived, false); assert.equal(child.parentSession, 'normal');
  assert.equal(included.items.find(x => x.sessionId === 'archive').archived, true);
  assert.equal(included.items[0].archived, true); assert.equal(included.items[0].subagent, true);
  for (const sessionId of ['child', 'archive', 'blank']) await assert.rejects(search(f, {action: 'groups', query: 'needle', sessionId}), /excluded/);
  const empty = await search(f, {action: 'groups', query: 'missing'});
  assert.deepEqual(empty.items, []); assert.equal(empty.total, 0); assert.equal(empty.totalMatches, 0); assert.equal(empty.nextCursor, undefined);
});
test('groups share all query flags and count final replies versus all process events exactly', async () => {
  const events = [...turn(1, 'Cat Cat Catapult'), ...turn(2, 'cat cat'), ...turn(3, 'Catapult'), ...turn(4, 'CAT')];
  events.push(event('user/message', 100, {content: [text('Cat Cat')]}, 100), event('tool/result', 101, {message: {content: [text('Cat Cat')]}}, 101));
  const f = fixture(undefined, {s: events});
  for (const matchCase of [false, true]) for (const wholeWord of [false, true]) for (const useRegex of [false, true]) {
    const input = {action: 'groups', query: useRegex ? 'C[a]t' : 'Cat', matchCase, wholeWord, useRegex};
    const expected = (matchCase ? wholeWord ? 1 : 2 : wholeWord ? 3 : 4);
    for (const content of ['final', 'all']) {
      const result = await search(f, {...input, content});
      assert.equal(result.total, 1); assert.equal(result.totalMatches, expected + (content === 'all' ? 2 : 0));
      assert.equal(result.items[0].count, result.totalMatches);
      for (const flag of ['matchCase', 'wholeWord', 'useRegex']) assert.equal(result[flag], input[flag]);
      assert.equal(result.totalMatches, (await search(f, {...input, action: 'search', content})).total);
    }
  }
  const literal = fixture(undefined, {s: turn(1, 'literal.*\n text literal.* text')});
  assert.equal((await search(literal, {action: 'groups', query: 'LITERAL.* text'})).items[0].count, 1);
  assert.equal((await search(literal, {action: 'groups', query: 'literalZZ'})).totalMatches, 0);
});
test('group pagination counts and totals include every group and all events across both orders', async () => {
  const rows = Array.from({length: LIMIT + 3}, (_, i) => row(`s${String(i).padStart(3, '0')}`, 1000 - i));
  const logs = Object.fromEntries(rows.map((r, i) => [r.sessionId, [...turn(1, 'needle needle', i), ...turn(2, 'needle', i + 100)]]));
  const f = fixture(rows, logs);
  for (const order of ['newest', 'oldest']) {
    const input = {action: 'groups', query: 'needle', order};
    const first = await search(f, input), last = await search(f, {...input, cursor: first.nextCursor});
    assert.equal(first.items.length, LIMIT); assert.equal(last.items.length, 3); assert.equal(last.nextCursor, undefined);
    for (const page of [first, last]) {assert.equal(page.total, rows.length); assert.equal(page.totalMatches, rows.length * 2); assert.ok(page.items.every(x => x.count === 2));}
    const expected = rows.map(x => x.sessionId); if (order === 'newest') expected.reverse();
    assert.deepEqual([...ids(first), ...ids(last)], expected);
  }
});
test('group cursors bind action/version/query/scope/content/order/flags and reject changed history', async () => {
  const rows = Array.from({length: LIMIT + 1}, (_, i) => row(`s${i}`, i));
  const logs = Object.fromEntries(rows.map((r, i) => [r.sessionId, [...turn(1, 'needle', i), ...turn(2, 'needle', i + 100)]]));
  const f = fixture(rows, logs), input = {action: 'groups', query: 'needle'};
  const first = await search(f, input);
  for (const change of [{action: 'search'}, {action: 'sessions'}, {query: 'different'}, {sessionId: 's0'}, {includeArchived: true}, {includeSubagents: true}, {content: 'all'}, {order: 'oldest'}, {matchCase: true}, {wholeWord: true}, {useRegex: true}]) {
    await assert.rejects(search(f, {...input, ...change, cursor: first.nextCursor}), /Invalid search cursor/);
  }
  const last = await search(f, {...input, matchCase: 'false', wholeWord: false, useRegex: false, cursor: first.nextCursor});
  assert.equal(last.items.length, 1);
  const hitPage = await search(f, {query: 'needle'});
  const legacyKey = createHash('sha256').update(JSON.stringify(['v1.4', 'search', 'needle', undefined, {includeSubagents: false, includeArchived: false, content: 'final', order: 'newest', matchCase: false, wholeWord: false, useRegex: false}])).digest('hex');
  const legacyCursor = {...JSON.parse(Buffer.from(hitPage.nextCursor, 'base64url')), key: legacyKey};
  await assert.rejects(search(f, {query: 'needle', cursor: Buffer.from(JSON.stringify(legacyCursor)).toString('base64url')}), /Invalid search cursor/);
  await assert.rejects(search(f, {...input, cursor: hitPage.nextCursor}), /Invalid search cursor/);
  for (const cursor of ['bad', '', Buffer.from(JSON.stringify({...JSON.parse(Buffer.from(first.nextCursor, 'base64url')), offset: Number.MAX_SAFE_INTEGER})).toString('base64url')]) {
    await assert.rejects(search(f, {...input, cursor}), /Invalid search cursor/);
  }
  // Non-extremal matching text changes without changing any group count/time.
  logs.s0[1].data.message.content[0].text = 'needle changed';
  await assert.rejects(search(f, {...input, cursor: first.nextCursor}), /History changed/);
});
test('groups preserve validation, VM deadlines, cancellation and partial-read warnings', async () => {
  for (const query of [undefined, '', '  ', 'x'.repeat(1025)]) await assert.rejects(search(fixture(), {action: 'groups', query}));
  const empty = fixture([]);
  await assert.rejects(search(empty, {action: 'groups', query: '[', useRegex: true}), error => error.code === 'INVALID_REGEX');
  assert.equal(empty.state.catalogs, 0);
  for (const sessionId of [undefined, 'bad']) {
    const f = fixture([row('bad', 2), row('after', 1)], {bad: turn(1, `${'a'.repeat(50000)}!`), after: turn(1)});
    await assert.rejects(search(f, {action: 'groups', query: '(a+)+$', useRegex: true, ...(sessionId ? {sessionId} : {})}), error => error.code === 'SEARCH_MATCH_TIMEOUT');
    assert.equal(f.state.disposed, 1); assert.ok(!f.state.reads.includes('after'));
  }
  const controller = new AbortController(); controller.abort();
  await assert.rejects(search(fixture(), {action: 'groups', query: 'needle'}, controller.signal), {name: 'AbortError'});
  const f = fixture([row('s', 1), row('broken', 2)], {s: turn(1), broken: new Error('corrupt')});
  const result = await search(f, {action: 'groups', query: 'needle'});
  assert.equal(result.total, 1); assert.equal(result.totalMatches, 1); assert.deepEqual(result.warnings, [{sessionId: 'broken', error: 'corrupt'}]);
  await assert.rejects(search(f, {action: 'groups', query: 'needle', sessionId: 'broken'}), /corrupt/);
});
function routeFixture(admission, services = fixture()) {
  let route, tool, service;
  apply({...services, effect: fn => fn(), provide: (_name, value) => {service = value; return () => {};}, connection: {admit: () => admission},
    webServer: {register: value => {route = value; return () => {};}}, tools: {register: value => {tool = value; return () => {};}}});
  return {route, tool, service};
}
async function request(route, method = 'GET', url = '/api/local-session-search?query=needle') {
  const res = new EventEmitter(); res.headers = {}; res.destroyed = false;
  res.setHeader = (key, value) => {res.headers[key] = value;}; res.writeHead = code => {res.code = code;}; res.end = text => {res.body = JSON.parse(text);};
  await route.handler({method, url, headers: {}}, res); return res;
}
const owner = {peer: {principal: {kind: 'owner'}}};
test('signed-owner HTTP guard and tool/service share flags, defaults, results and schemas', async () => {
  for (const [admission, code] of [[{rejection: 401}, 401], [{peer: {principal: {kind: 'api'}}}, 403]]) assert.equal((await request(routeFixture(admission).route)).code, code);
  const {route, tool, service} = routeFixture(owner);
  assert.equal((await request(route, 'POST')).code, 405);
  assert.equal((await request(route, 'GET', '/api/local-session-search?query=needle&matchCase=bad')).code, 400);
  const signal = new AbortController().signal;
  for (const action of ['search', 'groups']) for (const matchCase of [false, true]) for (const wholeWord of [false, true]) for (const useRegex of [false, true]) {
    const input = {action, query: 'needle', matchCase, wholeWord, useRegex};
    const res = await request(route, 'GET', `/api/local-session-search?${new URLSearchParams(input)}`);
    assert.equal(res.code, 200); assert.equal(res.headers['Cache-Control'], 'no-store'); assert.equal(res.listenerCount('close'), 0);
    assert.deepEqual(res.body, await tool.execute(input, {signal})); assert.deepEqual(res.body, await service.search(input, signal));
  }
  for (const flag of ['includeArchived', 'includeSubagents', 'matchCase', 'wholeWord', 'useRegex']) assert.equal(tool.parameters.properties[flag].type, 'boolean');
  assert.match(tool.description, /every matching/); assert.doesNotMatch(tool.description, /one snippet per conversation/);
  assert.deepEqual(tool.parameters.properties.action.enum, ['search', 'sessions', 'groups']);
  assert.match(tool.parameters.properties.action.description, /totalMatches/);
  assert.match(tool.parameters.properties.query.description, /search\/groups/);
});
test('HTTP and tool workspace scope agree for catalogs, search and groups and expose workspace schema', async () => {
  const f = fixture([row('a', 2), row('b', 1)], {a: [...turn(1), ...turn(2)], b: turn(3)}, [], [workspace('one', ['a']), workspace('two', ['b'])]);
  const {route, tool, service} = routeFixture(owner, f);
  assert.equal(tool.parameters.properties.workspaceId.type, 'string');
  assert.match(tool.parameters.properties.workspaceId.description, /all workspace/i);
  for (const action of ['sessions', 'search', 'groups']) {
    const input = {action, query: 'needle', workspaceId: 'one'};
    const res = await request(route, 'GET', `/api/local-session-search?${new URLSearchParams(input)}`);
    assert.equal(res.code, 200); assert.ok(res.body.items.every(item => item.workspaceId === 'one'));
    const signal = new AbortController().signal;
    assert.deepEqual(res.body, await tool.execute(input, {signal})); assert.deepEqual(res.body, await service.search(input, signal));
    const conflict = {...input, sessionId: 'b'};
    const invalid = await request(route, 'GET', `/api/local-session-search?${new URLSearchParams(conflict)}`);
    assert.equal(invalid.code, 400); assert.match(invalid.body.error, /does not belong/);
    await assert.rejects(tool.execute(conflict, {signal}), {message: invalid.body.error});
  }
});
test('HTTP/tool syntax and timeout errors have parity and never return partial hits', async () => {
  const {route, tool} = routeFixture(owner);
  const invalid = await request(route, 'GET', '/api/local-session-search?query=%5B&useRegex=true');
  assert.equal(invalid.code, 400); assert.equal(invalid.body.code, 'INVALID_REGEX');
  await assert.rejects(tool.execute({query: '[', useRegex: true}, {signal: new AbortController().signal}), error => error.code === invalid.body.code && error.message === invalid.body.error);
  const bad = routeFixture(owner, fixture(undefined, {s: turn(1, `${'a'.repeat(50000)}!`)}));
  const timeout = await request(bad.route, 'GET', `/api/local-session-search?${new URLSearchParams({query: '(a+)+$', useRegex: true})}`);
  assert.equal(timeout.code, 400); assert.equal(timeout.body.code, 'SEARCH_MATCH_TIMEOUT'); assert.equal(timeout.body.items, undefined);
  await assert.rejects(bad.tool.execute({query: '(a+)+$', useRegex: true}, {signal: new AbortController().signal}), error => error.code === timeout.body.code);
});
