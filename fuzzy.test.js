import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {performance} from 'node:perf_hooks';
import {search, LIMIT, MATCH_TIMEOUT_MS, MAX_SNIPPET, MAX_RANGES, UNGROUPED_WORKSPACE_ID} from './search.js';
import {apply} from './index.js';

// Keep this fixture independent of search.test.js: importing that file would
// register and run its tests again rather than just importing its helpers.
const text = value => ({type: 'text', text: value});
const event = (type, seq, data, time = seq) => ({type, seq, time, data});
function turn(n, value = 'needle', time = n * 10) {
  return [event('turn/start', n * 4, {turn: n}),
    event('assistant/message', n * 4 + 1, {turn: n, message: {content: [text(value)]}}, time),
    event('turn/end', n * 4 + 2, {turn: n, reason: {kind: 'completed'}})];
}
const row = (sessionId, updatedAt, extra = {}) => ({sessionId, updatedAt, blank: false, projections: {values: {title: `Title ${sessionId}`}}, ...extra});
const workspace = (workspaceId, sessionIds = []) => ({workspaceId, sessionIds, path: `/work/${workspaceId}`, title: `Workspace ${workspaceId}`, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z'});
function fixture(rows = [row('s', 20)], logs = {s: turn(1)}, archives = [], workspaces = []) {
  const state = {closed: 0, disposed: 0, reads: [], catalogs: 0, snapshots: 0, listings: 0, titles: 0};
  return {state,
    sessionController: {list: async (_input, signal) => {state.catalogs++; signal.throwIfAborted(); return {items: rows};}},
    workspaceController: {async *follow() {state.snapshots++; try {yield {type: 'baseline', value: {items: workspaces, archivedSessionIds: archives, pinnedSessionIds: []}};} finally {state.closed++;}}},
    sessionQuery: {
      listSessions: async () => {state.listings++; return [];},
      readTitleSnapshots: async ids => {state.titles++; return ids.map(sessionId => ({sessionId, status: 'fulfilled', value: {}}));},
      observeSession: async id => {state.reads.push(id); if (logs[id] instanceof Error) throw logs[id]; return {events: logs[id] || [], [Symbol.dispose]: () => state.disposed++};},
    }};
}
const ids = result => result.items.map(item => item.sessionId);
const marked = hit => hit.ranges.map(range => hit.snippet.slice(range.start, range.end));
const markedText = hit => marked(hit).join('');
const sample = (value, input) => search(fixture(undefined, {s: turn(1, value)}), input);
function assertUnread(f) {
  assert.deepEqual(f.state, {closed: 0, disposed: 0, reads: [], catalogs: 0, snapshots: 0, listings: 0, titles: 0});
}
async function allPages(services, input) {
  const items = [];
  let cursor;
  do {const page = await search(services, {...input, ...(cursor ? {cursor} : {})}); items.push(...page.items); cursor = page.nextCursor;} while (cursor);
  return items;
}
function routeFixture(services = fixture()) {
  let route, tool, service;
  apply({...services, effect: fn => fn(), provide: (_name, value) => {service = value; return () => {};},
    connection: {admit: () => ({peer: {principal: {kind: 'owner'}}})},
    webServer: {register: value => {route = value; return () => {};}}, tools: {register: value => {tool = value; return () => {};}}});
  return {route, tool, service};
}
async function request(route, input) {
  const res = new EventEmitter(); res.headers = {}; res.destroyed = false;
  res.setHeader = (key, value) => {res.headers[key] = value;}; res.writeHead = code => {res.code = code;}; res.end = value => {res.body = JSON.parse(value);};
  await route.handler({method: 'GET', url: `/api/local-session-search?${new URLSearchParams(input)}`, headers: {}}, res);
  return res;
}

for (const fuzzy of ['off', 'typo', 'subsequence']) {
  test(`fuzzy=${fuzzy} echoes normalized options for search, groups and catalogs`, async () => {
    for (const action of ['search', 'groups', 'sessions']) {
      const f = fixture();
      const result = await search(f, {action, ...(action === 'sessions' ? {} : {query: 'needle'}), fuzzy});
      assert.equal(result.fuzzy, fuzzy);
      for (const flag of ['matchCase', 'wholeWord', 'useRegex', 'includeArchived', 'includeSubagents']) assert.equal(result[flag], false);
      if (action === 'sessions') assert.deepEqual(f.state.reads, []);
    }
  });
}

test('omitted fuzzy equals explicit off and exact matching, regex and chronological ordering stay unchanged', async () => {
  const f = fixture([row('a', 999), row('b', 1)], {
    a: [...turn(1, 'AA literal.*\n text needle', 10), ...turn(2, 'needel', 90)],
    b: turn(1, 'literal.* text needle', 50),
  });
  for (const action of ['search', 'groups', 'sessions']) for (const order of ['newest', 'oldest']) {
    const input = {action, query: 'LITERAL.* text', order};
    const result = await search(f, input);
    assert.equal(result.fuzzy, 'off');
    assert.deepEqual(result, await search(f, {...input, fuzzy: 'off'}));
    if (action === 'search') assert.deepEqual(result.items.map(hit => hit.time), order === 'newest' ? [50, 10] : [10, 50]);
  }
  assert.equal((await search(f, {query: 'needle'})).total, 2);
  assert.equal((await search(f, {query: 'needl.'})).total, 0);
  assert.equal((await search(f, {query: 'needl.', useRegex: true, fuzzy: 'off'})).total, 2);
});

test('typo accepts insertion, deletion, substitution and adjacent transposition and highlights complete candidate words', async () => {
  for (const [query, value] of [['plane', 'planer'], ['plane', 'plan'], ['plane', 'plone'], ['plane', 'palne'], ['needle', 'needel']]) {
    const result = await sample(`😀 ${value}!`, {query, fuzzy: 'typo'});
    assert.equal(result.total, 1, `${query} / ${value}`);
    assert.deepEqual(result.items[0].ranges, [{start: 3, end: 3 + value.length}]);
    assert.deepEqual(marked(result.items[0]), [value]);
  }
});

test('typo budgets apply independently to every ordered query word, not to the whole phrase', async () => {
  const result = await sample('needel\n  plnaet', {query: 'needle planet', fuzzy: 'typo'});
  assert.equal(result.total, 1);
  assert.equal(markedText(result.items[0]).replace(/\s/gu, ''), 'needelplnaet');
  assert.equal((await sample('cot needel', {query: 'cat needle', fuzzy: 'typo'})).total, 0, 'the longer term cannot lend its edit allowance to a short term');
});

test('typo edit budgets use query word lengths at 3/4/7/8 boundaries and do not fall back to substring matching', async () => {
  const cases = [
    ['cat', 'cat', true], ['cat', 'cot', false], ['cat', 'cart', false], ['cat', 'at', false], ['cat', 'cats', false],
    ['plan', 'plon', true], ['plan', 'pxon', false], ['abcdefg', 'abxdefg', true], ['abcdefg', 'abxdexg', false],
    ['abcdefgh', 'abxdeygh', true], ['abcdefgh', 'abxyezgh', false], ['abcdefgh', 'abcfgh', true],
    ['𐐀ab', '𐐀ac', false], ['𐐀abc', '𐐀abd', true],
  ];
  for (const [query, value, expected] of cases) assert.equal((await sample(value, {query, fuzzy: 'typo'})).total, Number(expected), `${query} / ${value}`);
  // Unrestricted Damerau-Levenshtein can transpose CA -> AC then insert B;
  // optimal-string-alignment cannot edit that same substring twice (distance 3).
  assert.equal((await sample('abcdefABC', {query: 'abcdefCA', fuzzy: 'typo'})).total, 0);
});

for (const fuzzy of ['typo', 'subsequence']) {
  test(`${fuzzy} phrases require contiguous ordered words, literal punctuation and flexible whitespace`, async () => {
    const query = fuzzy === 'typo' ? 'needle planet' : 'ndl plnt';
    for (const value of ['needle planet', 'needle\n\t  planet']) {
      assert.equal((await sample(value, {query, fuzzy})).total, 1, value);
    }
    for (const value of ['planet needle', 'needle extra planet', 'needle, planet', 'needleplanet']) {
      assert.equal((await sample(value, {query, fuzzy})).total, 0, value);
    }
    const punctuated = fuzzy === 'typo' ? 'needel.*\n  (planet)+?' : 'nXeXeXdXlXe.*\n  (pXlXaXnXeXt)+?';
    const literal = await sample(punctuated, {query: 'needle.* (planet)+?', fuzzy});
    assert.equal(literal.total, 1);
    assert.equal((await sample(punctuated.replace('.*', 'ZZ'), {query: 'needle.* (planet)+?', fuzzy})).total, 0);
    assert.equal((await sample(punctuated.replace('+?', '+!'), {query: 'needle.* (planet)+?', fuzzy})).total, 0);
    assert.equal((await sample('.*\n  +?', {query: '.* +?', fuzzy})).total, 1, 'punctuation-only queries stay literal');
    assert.equal((await sample('anything', {query: '.*', fuzzy})).total, 0);
  });

  test(`${fuzzy} never scatters query terms across messages or joins separated document words`, async () => {
    const query = fuzzy === 'typo' ? 'needle planet' : 'ndl plnt';
    const events = [...turn(1, 'needle'), ...turn(2, 'planet'),
      event('user/message', 99, {content: [text('ndl')]}), event('user/message', 100, {content: [text('plnt')]})];
    for (const content of ['final', 'all']) assert.equal((await search(fixture(undefined, {s: events}), {query, fuzzy, content})).total, 0);
    assert.equal((await sample('a b c', {query: 'abc', fuzzy})).total, 0);
  });

  test(`${fuzzy} supports Unicode letters, numbers, underscores and case folding with original UTF-16 offsets`, async () => {
    const value = '😀 𐐀foo Kelvin ſample foo_٣';
    const query = '𐐨FOO kelvin sample FOO_٣';
    const result = await sample(value, {query, fuzzy});
    assert.equal(result.total, 1);
    assert.equal(markedText(result.items[0]).replace(/\s/gu, ''), '𐐀fooKelvinſamplefoo_٣');
    assert.equal(result.items[0].ranges[0].start, 3);
    assert.equal((await sample(value, {query, fuzzy, matchCase: true})).total, 0);
    assert.equal((await sample(value, {query: '𐐀foo Kelvin ſample foo_٣', fuzzy, matchCase: true})).total, 1);
    assert.equal((await sample('foo_٣', {query: fuzzy === 'typo' ? 'foo_٤' : 'f_٣', fuzzy})).total, 1);
    assert.equal((await sample('İ', {query: 'i', fuzzy})).total, 0, 'Unicode simple folding must not expand dotted capital I');
    assert.equal((await sample('i', {query: 'İ', fuzzy})).total, 0);
  });

  test(`${fuzzy} ordering remains chronological, never fuzzy relevance, with deterministic ties`, async () => {
    const f = fixture([row('a', 9999), row('b', 1)], {
      a: [...turn(1, 'needle', 10), ...turn(2, fuzzy === 'typo' ? 'needel' : 'nXeXeXdXlXe', 90)],
      b: turn(1, 'needle', 90),
    });
    for (const order of ['newest', 'oldest']) {
      const result = await search(f, {query: 'needle', fuzzy, order});
      assert.deepEqual(result.items.map(hit => [hit.sessionId, hit.time]), order === 'newest' ? [['a', 90], ['b', 90], ['a', 10]] : [['a', 10], ['a', 90], ['b', 90]]);
    }
  });
}

test('subsequence highlights only selected characters with UTF-16 astral offsets', async () => {
  const hit = (await sample('😀 axbxc', {query: 'abc', fuzzy: 'subsequence'})).items[0];
  assert.deepEqual(hit.ranges, [{start: 3, end: 4}, {start: 5, end: 6}, {start: 7, end: 8}]);
  assert.deepEqual(marked(hit), ['a', 'b', 'c']);
  const astral = (await sample('😀 𐐀x𐐁', {query: '𐐨𐐩', fuzzy: 'subsequence'})).items[0];
  assert.deepEqual(astral.ranges, [{start: 3, end: 5}, {start: 6, end: 8}]);
  assert.deepEqual(marked(astral), ['𐐀', '𐐁']);
});

test('subsequence chooses the tight span rather than a greedy early wide span', async () => {
  const hit = (await sample('axbxcabc', {query: 'abc', fuzzy: 'subsequence'})).items[0];
  assert.equal(markedText(hit), 'abc');
  assert.equal(hit.ranges[0].start, 5);
  assert.equal(hit.ranges.at(-1).end, 8);
});

test('subsequence candidate length cap is inclusive, counted in code points, and includes unmatched prefix/suffix', async () => {
  const cases = [
    ['ab', `a${'x'.repeat(14)}b`, true], ['ab', `a${'x'.repeat(15)}b`, false],
    ['ab', `${'x'.repeat(14)}ab`, true], ['ab', `${'x'.repeat(15)}ab`, false],
    ['a', `${'x'.repeat(11)}a`, true], ['a', `${'x'.repeat(12)}a`, false],
    ['𐐀', `${'𐐁'.repeat(11)}𐐀`, true], ['𐐀', `${'𐐁'.repeat(12)}𐐀`, false],
    ['abc', 'acb', false], ['abc', 'ab-c', false], ['abc', 'ab c', false], ['aaa', 'aa', false],
  ];
  for (const [query, value, expected] of cases) assert.equal((await sample(value, {query, fuzzy: 'subsequence'})).total, Number(expected), `${query} / ${value}`);
});

test('wholeWord applies to the full fuzzy span, not independently to the words or each highlighted character', async () => {
  for (const fuzzy of ['typo', 'subsequence']) {
    assert.equal((await sample('(plane)', {query: '(plane)', fuzzy, wholeWord: true})).total, 1);
    assert.equal((await sample('x(plane)y', {query: '(plane)', fuzzy, wholeWord: true})).total, 0);
    assert.equal((await sample('𐐀(plane)٣', {query: '(plane)', fuzzy, wholeWord: true})).total, 0);
    assert.equal((await sample('_(plane)_', {query: '(plane)', fuzzy, wholeWord: true})).total, 0);
    assert.equal((await sample('😀(plane)😀', {query: '(plane)', fuzzy, wholeWord: true})).total, 1);
  }
  assert.equal((await sample('axbxc', {query: 'abc', fuzzy: 'subsequence', wholeWord: true})).total, 1);
  // Fuzzy spans include complete candidate words, not just highlighted letters.
  // Whole Word guards the phrase edges; it does not require edge letters selected.
  assert.equal((await sample('xaxbxc', {query: 'abc', fuzzy: 'subsequence', wholeWord: true})).total, 1);
  assert.equal((await sample('axbxcx', {query: 'abc', fuzzy: 'subsequence', wholeWord: true})).total, 1);
  assert.equal((await sample('xaxbxc', {query: 'abc', fuzzy: 'subsequence'})).total, 1);
});

for (const fuzzy of ['typo', 'subsequence']) {
  test(`${fuzzy} snippet edges and highlights respect UTF-16 boundaries, ellipses and range caps`, async () => {
    const candidate = fuzzy === 'typo' ? 'needel' : 'nXeXdXl';
    const query = fuzzy === 'typo' ? 'needle' : 'ndl';
    const value = `${'😀'.repeat(140)} ${candidate} ${'z'.repeat(1000)}`;
    const hit = (await sample(value, {query, fuzzy})).items[0];
    assert.ok(hit.snippet.startsWith('…')); assert.ok(hit.snippet.endsWith('…'));
    assert.ok(hit.snippet.length <= MAX_SNIPPET);
    assert.equal(markedText(hit), fuzzy === 'typo' ? candidate : 'ndl');
    assert.doesNotMatch(hit.snippet, /(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])/u);
    for (const range of hit.ranges) {
      assert.ok(range.start > 0 && range.start < range.end && range.end < hit.snippet.length);
      assert.ok(!hit.snippet.slice(range.start, range.end).includes('…'));
    }
    const many = (await sample('a '.repeat(MAX_RANGES + 100), {query: 'a', fuzzy})).items[0];
    assert.equal(many.ranges.length, MAX_RANGES);
    assert.equal(many.rangesTruncated, true);
    assert.ok(many.snippet.length <= MAX_SNIPPET);
    assert.ok(many.ranges.every(range => range.start >= 0 && range.end <= many.snippet.length));
  });
}

test('subsequence phrase highlights clip to visible snippet and exclude trailing ellipsis', async () => {
  const query = Array(16).fill('aaaaaaa').join(' ');
  // Each 36-code-point candidate is exactly the 4*qLen+8 ceiling, but
  // astral prefixes make the full phrase exceed MAX_SNIPPET UTF-16 units.
  const candidate = `${'𐐀'.repeat(29)}aaaaaaa`;
  const hit = (await sample(Array(16).fill(candidate).join(' '), {query, fuzzy: 'subsequence'})).items[0];
  assert.ok(hit.snippet.length <= MAX_SNIPPET);
  assert.ok(hit.snippet.endsWith('…'));
  assert.equal(hit.rangesTruncated, true);
  assert.ok(hit.ranges.length > 0 && hit.ranges.length <= MAX_RANGES);
  assert.ok(hit.ranges.every(range => range.start >= 0 && range.start < range.end && range.end < hit.snippet.length));
  assert.match(markedText(hit), /^[a\s]+$/u, 'unmatched astral prefix and ellipsis must never be highlighted');
});

test('typo long-word highlights preserve complete candidate and UTF-16 prefix offsets', async () => {
  const query = `${'a'.repeat(63)}b`;
  const candidate = `${'a'.repeat(62)}cb`;
  const hit = (await sample(`😀 ${candidate} ${'z'.repeat(2000)}`, {query, fuzzy: 'typo'})).items[0];
  assert.equal(hit.ranges[0].start, 3);
  assert.equal(markedText(hit), candidate);
  assert.ok(hit.snippet.length <= MAX_SNIPPET);
});

for (const fuzzy of ['typo', 'subsequence']) {
  test(`${fuzzy} global/scoped/groups share workspace, archive and cold-subagent filtering and counts`, async () => {
    const candidate = fuzzy === 'typo' ? 'needel' : 'nXeXeXdXlXe';
    const f = fixture([row('parent', 1), row('other', 2), row('archive', 3), row('child', 4, {origin: 'subagent', parentSessionId: 'parent'}), row('loose', 5)], {
      parent: [...turn(1, candidate, 10), ...turn(2, candidate, 20)], other: turn(1, candidate, 30), archive: turn(1, candidate, 40),
      child: turn(1, candidate, 50), cold: turn(1, candidate, 60), loose: turn(1, candidate, 70),
    }, ['archive', 'cold'], [workspace('one', ['parent', 'archive']), workspace('two', ['other'])]);
    f.sessionQuery.listSessions = async () => [{header: {id: 'cold', createdAt: 6, origin: 'subagent', parentSession: 'child'}}];
    const input = {query: 'needle', fuzzy};
    assert.deepEqual(new Set(ids(await search(f, input))), new Set(['parent', 'other', 'loose']));
    for (const order of ['newest', 'oldest']) {
      const included = {...input, order, includeArchived: true, includeSubagents: true};
      const global = await allPages(f, included);
      assert.equal(global.length, 7);
      for (const sessionId of ['parent', 'other', 'archive', 'child', 'cold', 'loose']) {
        assert.deepEqual(global.filter(hit => hit.sessionId === sessionId), await allPages(f, {...included, sessionId}));
      }
      for (const workspaceId of ['one', 'two', UNGROUPED_WORKSPACE_ID]) {
        const scoped = await search(f, {...included, workspaceId});
        assert.deepEqual(scoped.items, global.filter(hit => hit.workspaceId === workspaceId));
        const groups = await search(f, {...included, workspaceId, action: 'groups'});
        assert.equal(groups.totalMatches, scoped.total);
        assert.equal(groups.items.reduce((sum, group) => sum + group.count, 0), scoped.total);
        for (const group of groups.items) {
          const hits = scoped.items.filter(hit => hit.sessionId === group.sessionId);
          assert.equal(group.count, hits.length); assert.equal(group.time, hits[0].time);
        }
      }
      const one = await search(f, {...included, action: 'groups', workspaceId: 'one'});
      assert.equal(one.totalMatches, 5);
      assert.equal(one.items.find(item => item.sessionId === 'cold').archived, true);
      assert.equal(one.items.find(item => item.sessionId === 'child').subagent, true);
    }
    for (const sessionId of ['archive', 'child', 'cold']) await assert.rejects(search(f, {...input, sessionId}), /excluded/);
    await assert.rejects(search(f, {...input, workspaceId: 'one', sessionId: 'other'}), /does not belong/);
  });

  test(`${fuzzy} pagination counts every document/group and binds cursor to fuzzy mode and all scopes/options`, async () => {
    const rows = Array.from({length: LIMIT + 1}, (_, i) => row(`s${String(i).padStart(3, '0')}`, i));
    const logs = Object.fromEntries(rows.map((r, i) => [r.sessionId, [...turn(1, 'needle', i), ...turn(2, 'needle', i + 100)]]));
    const f = fixture(rows, logs, [], [workspace('one', rows.map(r => r.sessionId)), workspace('two')]);
    for (const action of ['search', 'groups']) {
      const input = {action, query: 'needle', fuzzy, workspaceId: 'one'};
      const first = await search(f, input);
      assert.ok(first.nextCursor);
      assert.equal(first.items.length, LIMIT);
      assert.equal(first.total, action === 'groups' ? rows.length : rows.length * 2);
      if (action === 'groups') assert.equal(first.totalMatches, rows.length * 2);
      const all = await allPages(f, input);
      assert.equal(all.length, first.total);
      if (action === 'groups') assert.ok(all.every(item => item.count === 2));
      for (const change of [{fuzzy: 'off'}, {fuzzy: fuzzy === 'typo' ? 'subsequence' : 'typo'}, {fuzzy: undefined},
        {workspaceId: undefined}, {workspaceId: 'two'}, {sessionId: rows[0].sessionId}, {action: action === 'groups' ? 'search' : 'groups'},
        {query: 'needles'}, {matchCase: true}, {wholeWord: true}, {includeArchived: true}, {includeSubagents: true}, {content: 'all'}, {order: 'oldest'}]) {
        const before = f.state.catalogs;
        await assert.rejects(search(f, {...input, ...change, cursor: first.nextCursor}), /Invalid search cursor/);
        assert.equal(f.state.catalogs, before, 'mismatched cursor must fail before catalog reads');
      }
      assert.ok((await search(f, {...input, matchCase: 'false', wholeWord: false, useRegex: 'false', cursor: first.nextCursor})).items.length > 0);
      logs[rows[0].sessionId][1].data.message.content[0].text = 'needle changed';
      await assert.rejects(search(f, {...input, cursor: first.nextCursor}), /History changed/);
      logs[rows[0].sessionId][1].data.message.content[0].text = 'needle';
    }
    const exact = await search(f, {query: 'needle'});
    assert.deepEqual(await search(f, {query: 'needle', cursor: exact.nextCursor}), await search(f, {query: 'needle', fuzzy: 'off', cursor: exact.nextCursor}));
  });
}

test('invalid fuzzy modes and regex conflicts reject before any service read, including catalog actions', async () => {
  for (const action of ['search', 'groups', 'sessions']) {
    for (const fuzzy of ['', 'near', 'TYPO', null, false, 1, {}, []]) {
      const f = fixture();
      await assert.rejects(search(f, {action, query: 'needle', fuzzy}), /fuzzy/i, `${action}: invalid fuzzy=${JSON.stringify(fuzzy)}`);
      assertUnread(f);
    }
    for (const fuzzy of ['typo', 'subsequence']) for (const useRegex of [true, 'true']) {
      const f = fixture();
      await assert.rejects(search(f, {action, query: '[', fuzzy, useRegex}), /fuzzy|regex/i);
      assertUnread(f);
    }
  }
});

test('fuzzy query limits are 128 Unicode code points and 16 word terms and reject before reads', async () => {
  for (const fuzzy of ['typo', 'subsequence']) for (const action of ['search', 'groups']) {
    for (const query of ['a'.repeat(129), '𐐀'.repeat(129), Array(17).fill('a').join(' '), Array(17).fill('a').join('.')]) {
      const f = fixture();
      await assert.rejects(search(f, {query, fuzzy, action}), /128|16|limit|word|term/i);
      assertUnread(f);
    }
    for (const query of ['a'.repeat(128), '𐐀'.repeat(128), Array(16).fill('a').join(' '), Array(16).fill('a').join('.')]) {
      const f = fixture([], {});
      const result = await search(f, {query, fuzzy, action});
      assert.equal(result.total, 0, 'inclusive limits must be accepted even when UTF-16 length exceeds 128');
      assert.equal(result.fuzzy, fuzzy);
    }
  }
  assert.equal((await sample('a'.repeat(129), {query: 'a'.repeat(129), fuzzy: 'off'})).total, 1, 'fuzzy limits do not shrink the exact API');
});

test('HTTP, tool and service expose equivalent fuzzy schema, defaults, normalized options and UTF-16 results', async () => {
  const {route, tool, service} = routeFixture(fixture(undefined, {s: turn(1, '😀 needle needel nXeXeXdXlXe')}));
  assert.equal(tool.parameters.properties.fuzzy.type, 'string');
  assert.deepEqual(tool.parameters.properties.fuzzy.enum, ['off', 'typo', 'subsequence']);
  const signal = new AbortController().signal;
  for (const fuzzy of [undefined, 'off', 'typo', 'subsequence']) for (const action of ['sessions', 'search', 'groups']) {
    const input = {action, query: 'needle', ...(fuzzy === undefined ? {} : {fuzzy}), matchCase: false, wholeWord: false, useRegex: false};
    const response = await request(route, input);
    assert.equal(response.code, 200); assert.equal(response.headers['Cache-Control'], 'no-store'); assert.equal(response.listenerCount('close'), 0);
    assert.equal(response.body.fuzzy, fuzzy ?? 'off');
    assert.deepEqual(response.body, await tool.execute(input, {signal}));
    assert.deepEqual(response.body, await service.search(input, signal));
  }
});

test('HTTP and tool reject invalid modes, conflicts and fuzzy limits identically before service reads', async () => {
  for (const input of [{query: 'needle', fuzzy: 'invalid'}, {query: '[', fuzzy: 'typo', useRegex: true},
    {action: 'sessions', fuzzy: 'subsequence', useRegex: true}, {query: '𐐀'.repeat(129), fuzzy: 'typo'},
    {query: Array(17).fill('a').join(' '), fuzzy: 'subsequence'}]) {
    const f = fixture();
    const {route, tool} = routeFixture(f);
    const response = await request(route, input);
    assert.equal(response.code, 400); assert.equal(response.body.items, undefined);
    await assert.rejects(tool.execute(input, {signal: new AbortController().signal}), error => error.message === response.body.error && error.code === response.body.code);
    assertUnread(f);
  }
});

test('fuzzy deadline covers the whole session document list rather than resetting for each word or message', async () => {
  const query = `${'a'.repeat(125)}bbb`;
  const events = Array.from({length: 60000}, (_, i) => event('user/message', i, {content: [text('a'.repeat(128))]}));
  for (const fuzzy of ['typo', 'subsequence']) {
    const f = fixture(undefined, {s: events});
    const start = performance.now();
    await assert.rejects(search(f, {query, fuzzy, content: 'all'}), error => error.code === 'SEARCH_MATCH_TIMEOUT' && /No partial results/.test(error.message));
    assert.ok(performance.now() - start < 5000);
    assert.equal(f.state.disposed, 1);
  }
});

test('pathological fuzzy input has one hard 100ms per-session VM deadline, rejects explicitly and never returns partial results', async () => {
  assert.equal(MATCH_TIMEOUT_MS, 100);
  const query = `${'a'.repeat(125)}bbb`;
  // No word qualifies: OSA distance is 3 (>2), and the subsequence lacks b.
  // The large nonmatching corpus forces scanning beyond any highlight cap.
  const pathological = `${'a'.repeat(128)} `.repeat(200000);
  for (const fuzzy of ['typo', 'subsequence']) for (const scoped of [false, true]) {
    const f = fixture([row('ok', 3), row('bad', 2), row('after', 1)], {ok: turn(1, query), bad: turn(1, pathological), after: turn(1, query)});
    const start = performance.now();
    await assert.rejects(search(f, {query, fuzzy, ...(scoped ? {sessionId: 'bad', action: 'groups'} : {})}), error => error.code === 'SEARCH_MATCH_TIMEOUT' && /No partial results/.test(error.message));
    assert.ok(performance.now() - start < 5000, 'VM must interrupt fuzzy matching rather than leave it unbounded');
    assert.equal(f.state.disposed, scoped ? 1 : 2);
    assert.ok(!f.state.reads.includes('after'));
  }
});
