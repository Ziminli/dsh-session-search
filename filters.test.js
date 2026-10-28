import test from 'node:test';
import assert from 'node:assert/strict';
import {search, LIMIT, UNGROUPED_WORKSPACE_ID} from './search.js';
import {apply} from './index.js';
import {EventEmitter} from 'node:events';

// Same public-service fixture shape as search.test.js; keep it independent so
// importing fixtures never registers another test suite or loads the plugin.
const text = text => ({type: 'text', text});
const event = (type, seq, data, time = seq) => ({type, seq, time, data});
function turn(n, value = 'needle', time = n * 10) {
  return [event('turn/start', n * 4, {turn: n}),
    event('assistant/message', n * 4 + 1, {turn: n, message: {content: [text(value)]}}, time),
    event('turn/end', n * 4 + 2, {turn: n, reason: {kind: 'completed'}})];
}
const row = (sessionId, updatedAt, extra = {}) => ({sessionId, updatedAt, blank: false, projections: {values: {title: `Title ${sessionId}`}}, ...extra});
const workspace = (workspaceId, sessionIds = []) => ({workspaceId, sessionIds, path: `/work/${workspaceId}`, title: `Workspace ${workspaceId}`});
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
const ids = result => result.items.map(item => item.sessionId);
function scopedFixture() {
  return fixture([row('a', 4), row('b', 3), row('c', 2), row('loose', 1)],
    {a: turn(1), b: turn(2), c: turn(3), loose: turn(4)}, [], [workspace('one', ['a', 'b']), workspace('two', ['c']), workspace('empty')]);
}

test('plural scopes OR within lists, AND between lists, support JSON and normalize metadata for every action', async () => {
  for (const action of ['sessions', 'search', 'groups']) {
    const f = scopedFixture(), input = {action, query: 'needle'};
    const result = await search(f, {...input, sessionIds: ['c', 'a', 'a'], workspaceIds: '["two","one","two"]'});
    assert.deepEqual(new Set(ids(result)), new Set(['a', 'c']));
    assert.deepEqual(result.sessionIds, ['a', 'c']); assert.deepEqual(result.workspaceIds, ['one', 'two']);
    assert.equal(result.scope, 'all'); assert.equal(result.workspaceId, null);
    assert.equal(result.workspaceTitle, ''); assert.equal(result.workspacePath, '');
    assert.equal(result.after, null); assert.equal(result.before, null);
    assert.deepEqual(new Set(ids(await search(f, {...input, workspaceIds: ['one', 'two']}))), new Set(['a', 'b', 'c']));
    assert.deepEqual(ids(await search(f, {...input, workspaceIds: [UNGROUPED_WORKSPACE_ID]})), ['loose']);
    assert.deepEqual(ids(await search(f, {...input, workspaceIds: ['empty']})), []);
    const all = await search(f, input);
    assert.deepEqual(await search(f, {...input, sessionIds: [], workspaceIds: '[]'}), all);
    assert.deepEqual(await search(f, {...input, sessionId: 'a', workspaceId: 'one'}), await search(f, {...input, sessionIds: ['a'], workspaceIds: ['one']}));
    const legacy = await search(f, {...input, sessionId: 'a', workspaceId: 'one', sessionIds: [], workspaceIds: []});
    assert.equal(legacy.scope, 'a'); assert.equal(legacy.workspaceId, 'one');
    assert.equal(legacy.workspaceTitle, 'Workspace one'); assert.equal(legacy.workspacePath, '/work/one');
    assert.deepEqual(legacy.workspaces, all.workspaces);
    if (action === 'sessions') assert.deepEqual(f.state.reads, []);
  }
});

test('selected sessions must all be available and in a selected workspace; no silent broadening or partial reads', async () => {
  for (const action of ['sessions', 'search', 'groups']) {
    const f = scopedFixture(), base = {action, query: 'needle'};
    for (const change of [
      {sessionIds: ['a', 'missing']}, {workspaceIds: ['one', 'missing']},
      {sessionIds: ['a', 'c'], workspaceIds: ['one']},
      {sessionId: 'c', workspaceIds: ['one', 'empty']},
      {sessionIds: ['c'], workspaceId: 'one'},
    ]) await assert.rejects(search(f, {...base, ...change}), /unavailable|does not belong/);
    assert.deepEqual(f.state.reads, []);
  }
  const f = fixture([row('ok', 3), row('archive', 2), row('child', 1, {origin: 'subagent'})],
    {ok: turn(1), archive: turn(2), child: turn(3)}, ['archive']);
  for (const sessionId of ['archive', 'child']) await assert.rejects(search(f, {query: 'needle', sessionIds: ['ok', sessionId]}), /excluded/);
  assert.equal((await search(f, {query: 'needle', sessionIds: ['archive', 'child'], includeArchived: true, includeSubagents: true})).total, 2);
  const broken = fixture([row('ok', 2), row('bad', 1)], {ok: turn(1), bad: new Error('corrupt selected session')});
  await assert.rejects(search(broken, {query: 'needle', sessionIds: ['ok', 'bad']}), /corrupt selected session/);
  assert.deepEqual((await search(broken, {query: 'needle'})).warnings, [{sessionId: 'bad', error: 'corrupt selected session'}]);
});

test('invalid plural arrays, entries, limits, and singular/plural ambiguity fail before service reads', async () => {
  for (const name of ['sessionIds', 'workspaceIds']) {
    for (const value of [null, true, 3, {}, 's', '[', '{}', 'null', '"s"', [null], [1], [[]], [{}], Array(1), [''], [' '], ['x'.repeat(513)]]) {
      const f = fixture();
      await assert.rejects(search(f, {query: 'needle', [name]: value}), new RegExp(name));
      assert.equal(f.state.catalogs, 0);
    }
    const singular = name === 'sessionIds' ? 'sessionId' : 'workspaceId';
    for (const value of [['s'], '["s"]']) await assert.rejects(search(fixture(), {query: 'needle', [singular]: 's', [name]: value}), /cannot be combined/);
    const max = name === 'sessionIds' ? 1000 : 200;
    await assert.rejects(search(fixture(), {query: 'needle', [name]: Array(max + 1).fill('s')}), /at most/);
    const f = fixture();
    const accepted = {[name]: Array(max).fill(name === 'sessionIds' ? 's' : UNGROUPED_WORKSPACE_ID)};
    assert.equal((await search(f, {query: 'needle', ...accepted})).total, 1);
  }
});

test('message timestamps are after-inclusive and before-exclusive in final and all projections', async () => {
  const logs = {s: [-1, 0, 9, 10, 19, 20, 21].flatMap((time, i) => turn(i + 1, 'needle', time))};
  logs.s.push(event('user/message', 100, {content: [text('needle user')]}, 10), event('tool/result', 101, {message: {content: [text('needle tool')]}}, 20));
  const f = fixture(undefined, logs);
  for (const content of ['final', 'all']) {
    const result = await search(f, {query: 'needle', after: '10', before: 20, content, order: 'oldest'});
    assert.deepEqual(result.items.map(x => x.time), content === 'final' ? [10, 19] : [10, 10, 19]);
    assert.equal(result.after, 10); assert.equal(result.before, 20);
    const after = await search(f, {query: 'needle', after: 20, content});
    assert.deepEqual(after.items.map(x => x.time), content === 'final' ? [21, 20] : [21, 20, 20]);
    assert.equal(after.before, null);
    const before = await search(f, {query: 'needle', before: '0', content});
    assert.deepEqual(before.items.map(x => x.time), [-1]); assert.equal(before.after, null);
  }
  // Completion lies outside the selected range, but the final message is inside.
  const events = turn(1, 'needle', 1000); events[0].time = -1000; events[2].time = 9999;
  assert.equal((await search(fixture(undefined, {s: events}), {query: 'needle', after: 1000, before: 1001})).total, 1);
  // Earlier progress must never be promoted when the real final is outside.
  events.splice(2, 0, event('assistant/message', 99, {turn: 1, message: {content: [text('needle')]}}, 2000));
  assert.equal((await search(fixture(undefined, {s: events}), {query: 'needle', after: 1000, before: 1001})).total, 0);
});

test('bounded searches exclude unknown/invalid timestamps, retain valid zero and extreme dates, and catalog ignores time', async () => {
  const times = [undefined, null, NaN, Infinity, '10', 10.5, 8640000000000001, -8640000000000000, 0, 8640000000000000];
  const logs = {s: times.flatMap((time, i) => {const events = turn(i + 1); events[1].time = time; return events;})};
  const f = fixture(undefined, logs);
  assert.equal((await search(f, {query: 'needle'})).total, times.length);
  assert.deepEqual((await search(f, {query: 'needle', after: -8640000000000000, order: 'oldest'})).items.map(x => x.time), [-8640000000000000, 0, 8640000000000000]);
  const catalog = await search(f, {action: 'sessions', after: 9999, before: 10000});
  assert.deepEqual(ids(catalog), ['s']); assert.equal(catalog.after, 9999); assert.equal(catalog.before, 10000);
  assert.deepEqual(ids(await search(scopedFixture(), {action: 'sessions', workspaceIds: ['one', 'two'], sessionIds: ['a', 'c'], after: 9999})), ['a', 'c']);
});

test('time range validates safe integers, Date range, numeric HTTP strings and ordering consistently for all actions', async () => {
  const invalid = [null, false, true, [], {}, '', ' ', 'NaN', 'Infinity', '0x10', '2026-01-01', '1ms', 0.5, '1.5', NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER, -8640000000000001, 8640000000000001];
  for (const action of ['sessions', 'search', 'groups']) {
    for (const name of ['after', 'before']) for (const value of invalid) {
      const f = fixture();
      await assert.rejects(search(f, {action, query: 'needle', [name]: value}), new RegExp(name));
      assert.equal(f.state.catalogs, 0);
    }
    for (const [after, before] of [[0, 0], [20, 10], ['10', '10']]) await assert.rejects(search(fixture(), {action, query: 'needle', after, before}), /after must be less/);
    const accepted = await search(fixture(), {action, query: 'needle', after: '-8640000000000000', before: '8640000000000000'});
    assert.equal(accepted.after, -8640000000000000); assert.equal(accepted.before, 8640000000000000);
  }
});

test('groups aggregate only time/scoped matching documents before pagination and use matching message times', async () => {
  const rows = Array.from({length: LIMIT + 2}, (_, i) => row(`s${i}`, i));
  const logs = Object.fromEntries(rows.map((r, i) => [r.sessionId, [...turn(1, 'needle', 0), ...turn(2, 'needle', 100 + i), ...turn(3, 'needle', 200 + i), ...turn(4, 'unrelated', 999999)]]));
  const f = fixture(rows, logs, [], [workspace('one', rows.map(x => x.sessionId)), workspace('two')]);
  for (const order of ['newest', 'oldest']) {
    const input = {action: 'groups', query: 'needle', workspaceIds: ['one'], sessionIds: rows.map(x => x.sessionId), after: 100, before: 300, order};
    const first = await search(f, input), last = await search(f, {...input,
      sessionIds: JSON.stringify([...input.sessionIds].reverse()), workspaceIds: ['one', 'one'], after: '100', before: '300', cursor: first.nextCursor});
    for (const change of [{after: 101}, {before: 299}, {sessionIds: input.sessionIds.slice(1)}, {workspaceIds: []}]) {
      await assert.rejects(search(f, {...input, ...change, cursor: first.nextCursor}), /Invalid search cursor/);
    }
    assert.equal(first.total, rows.length); assert.equal(first.totalMatches, rows.length * 2);
    assert.equal(first.items.length, LIMIT); assert.equal(last.items.length, 2);
    assert.ok([...first.items, ...last.items].every(x => x.count === 2 && x.time >= 100 && x.time < 300));
    assert.equal(first.items[0].time, order === 'newest' ? 200 + rows.length - 1 : 100);
    assert.equal(last.nextCursor, undefined);
  }
});

test('fuzzy exact-presence metadata and hits only inspect selected workspaces, sessions and time bounds', async () => {
  const f = fixture([row('a', 3), row('b', 2), row('c', 1)], {
    a: [...turn(1, 'needle', 9), ...turn(2, 'needel', 10), ...turn(3, 'needle', 20)],
    b: turn(1, 'needle', 15), c: turn(1, 'needle', 15),
  }, [], [workspace('one', ['a', 'b']), workspace('two', ['c'])]);
  for (const action of ['search', 'groups']) for (const fuzzy of ['typo', 'subsequence']) {
    const approximate = fuzzy === 'typo' ? 'needel' : 'nxeedle';
    f.sessionQuery.observeSession = async id => ({events: id === 'a' ? [...turn(1, 'needle', 9), ...turn(2, approximate, 10), ...turn(3, 'needle', 20)] : turn(1, 'needle', 15), [Symbol.dispose]() {}});
    const input = {action, fuzzy, query: 'needle', workspaceIds: ['one'], sessionIds: ['a'], after: 10, before: 20};
    const result = await search(f, input);
    assert.equal(result.hasExactMatches, false); assert.equal(result.total, 1); assert.deepEqual(ids(result), ['a']);
    assert.equal((await search(f, {...input, after: 9})).hasExactMatches, true);
    assert.equal((await search(f, {...input, before: 21})).hasExactMatches, true);
    assert.equal((await search(f, {...input, sessionIds: ['a', 'b']})).hasExactMatches, true);
    const empty = await search(f, {...input, after: 11});
    assert.equal(empty.hasExactMatches, false); assert.equal(empty.total, 0);
  }
});

test('time exclusion occurs before regex matching, avoiding out-of-range catastrophic expressions', async () => {
  const f = fixture(undefined, {s: [...turn(1, `${'a'.repeat(50000)}!`, 9), ...turn(2, 'a', 10)]});
  assert.equal((await search(f, {query: '(a+)+$', useRegex: true, after: 10})).total, 1);
});

test('cursors normalize scope order/duplicates/JSON, legacy singleton and numeric ranges, and reject changed filters', async () => {
  const logs = {a: Array.from({length: LIMIT + 2}, (_, i) => turn(i + 1, 'needle', 100 + i)).flat(), b: turn(1, 'needle', 150)};
  const f = fixture([row('a', 2), row('b', 1)], logs, [], [workspace('one', ['a']), workspace('two', ['b'])]);
  const input = {query: 'needle', sessionIds: ['b', 'a', 'b'], workspaceIds: ['two', 'one'], after: '100', before: '200'};
  const first = await search(f, input);
  const last = await search(f, {...input, sessionIds: '["a","b"]', workspaceIds: ['one', 'two', 'one'], after: 100, before: 200, cursor: first.nextCursor});
  assert.equal(last.items.length, 3);
  for (const change of [{sessionIds: ['a']}, {workspaceIds: []}, {after: 101}, {before: 199}, {after: undefined}, {before: undefined}]) await assert.rejects(search(f, {...input, ...change, cursor: first.nextCursor}), /Invalid search cursor/);
  const singleton = await search(f, {query: 'needle', sessionId: 'a', workspaceId: 'one'});
  assert.equal((await search(f, {query: 'needle', sessionIds: ['a', 'a'], workspaceIds: '["one"]', cursor: singleton.nextCursor})).items.length, 2);
  const all = await search(f, {query: 'needle'});
  assert.equal((await search(f, {query: 'needle', sessionIds: '[]', workspaceIds: [], cursor: all.nextCursor})).items.length, 3);
  // Changes outside time scope cannot invalidate an otherwise identical page.
  logs.a.push(...turn(999, 'needle', 99999));
  assert.equal((await search(f, {...input, cursor: first.nextCursor})).items.length, 3);
  logs.a.push(...turn(1000, 'needle', 151));
  await assert.rejects(search(f, {...input, cursor: first.nextCursor}), /History changed/);
});

test('plural scopes and time bounds have HTTP, agent tool and service parity including validation errors', async () => {
  const f = scopedFixture(), routes = new Map(), tools = new Map(); let service;
  Object.assign(f, {effect: fn => fn(), provide: (_key, value) => {service = value; return () => {};},
    webServer: {register: route => {routes.set(route.path, route); return () => {};}},
    connection: {admit: () => ({peer: {principal: {kind: 'owner'}}})},
    tools: {register: tool => {tools.set(tool.name, tool); return () => {};}}});
  apply(f, {});
  const tool = tools.get('search_session_text');
  assert.equal(tool.parameters.properties.sessionIds.maxItems, 1000);
  assert.equal(tool.parameters.properties.workspaceIds.maxItems, 200);
  for (const key of ['after', 'before']) assert.equal(tool.parameters.properties[key].type, 'integer');
  const http = async input => {
    const params = new URLSearchParams(Object.entries(input).map(([key, value]) => [key, Array.isArray(value) ? JSON.stringify(value) : value]));
    const req = {method: 'GET', headers: {}, url: `/api/local-session-search?${params}`};
    const res = new EventEmitter(); Object.assign(res, {destroyed: false, setHeader() {}, writeHead(code) {this.code = code;}, end(value) {this.body = JSON.parse(value);}});
    await routes.get('/api/local-session-search').handler(req, res); return res;
  };
  for (const action of ['search', 'groups', 'sessions']) {
    const input = {action, query: 'needle', workspaceIds: ['one', 'two'], sessionIds: ['a', 'c'], after: 10, before: 30};
    const expected = await service.search(input);
    assert.deepEqual(await tool.execute(input, {}), expected);
    const response = await http(input); assert.equal(response.code, 200); assert.deepEqual(response.body, JSON.parse(JSON.stringify(expected)));
  }
  for (const change of [{workspaceIds: ['missing']}, {sessionIds: ['c'], workspaceIds: ['one']}, {after: 20, before: 10}, {after: 1.5}, {sessionId: 'a', sessionIds: ['c']}]) {
    const input = {query: 'needle', ...change}, response = await http(input);
    assert.equal(response.code, 400);
    await assert.rejects(service.search(input), {message: response.body.error});
    await assert.rejects(tool.execute(input, {}), {message: response.body.error});
  }
});
