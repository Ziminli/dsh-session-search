import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {EventEmitter} from 'node:events';
import {performance} from 'node:perf_hooks';
import {highlightText, MATCH_TIMEOUT_MS, MAX_HIGHLIGHT_TEXTS, MAX_HIGHLIGHT_TEXT,
  MAX_HIGHLIGHT_RANGES, MAX_HIGHLIGHT_TOTAL_RANGES} from './search.js';
import {apply} from './index.js';

const sample = (texts, options = {}) => highlightText({query: 'needle', texts, ...options});
const marked = (texts, result) => result.items.map(item => item.ranges.map(range => texts[item.index].slice(range.start, range.end)));

function routes(admission = {peer: {principal: {kind: 'owner'}}}) {
  const registered = [], tools = [];
  const unexpected = () => {throw new Error('Highlight must not access stored sessions or settings');};
  apply({effect: fn => fn(), provide: () => () => {},
    connection: {admit: () => admission},
    webServer: {register: route => {registered.push(route); return () => {};}},
    tools: {register: tool => {tools.push(tool); return () => {};}},
    sessionQuery: new Proxy({}, {get: unexpected}), sessionController: new Proxy({}, {get: unexpected}),
    workspaceController: new Proxy({}, {get: unexpected}), configEditor: new Proxy({}, {get: unexpected})});
  return {route: registered.find(route => route.path === '/api/local-session-search-highlight'), registered, tools};
}
async function request(route, input = {query: 'needle', texts: ['needle']}, options = {}) {
  const chunks = options.chunks ?? [Buffer.from(options.raw ?? JSON.stringify(input))];
  const req = Readable.from(chunks);
  req.method = options.method ?? 'POST';
  req.headers = {'content-type': 'application/json; charset=utf-8', ...options.headers};
  const res = new EventEmitter();
  res.request = req;
  res.destroyed = false; res.headers = {};
  res.setHeader = (name, value) => {res.headers[name] = value;};
  res.writeHead = code => {res.code = code;};
  res.end = value => {res.body = JSON.parse(value);};
  await route.handler(req, res);
  return res;
}

test('full-document literal highlights retain block indexes and absolute UTF-16 offsets beyond snippets', () => {
  const texts = ['nothing', `😀 needle ${'x'.repeat(1500)} NEEDLE`, '', 'needle'];
  const result = sample(texts);
  assert.deepEqual(result, {items: [
    {index: 1, ranges: [{start: 3, end: 9}, {start: 1511, end: 1517}]},
    {index: 3, ranges: [{start: 0, end: 6}]}]});
  assert.deepEqual(marked(texts, result), [['needle', 'NEEDLE'], ['needle']]);
  assert.deepEqual(sample(['needle', 'planet'], {query: 'needle planet'}), {items: []});
});

test('literal whitespace, escaping, case and Unicode whole-word behavior match search', () => {
  const texts = ['😀 LITERAL.*\n\t text', 'literalZZ text', '𐐀needle٣ _needle_ needle😀'];
  assert.deepEqual(marked(texts, sample(texts, {query: ' literal.* text '})), [['LITERAL.*\n\t text']]);
  assert.deepEqual(sample(texts, {query: 'literal.* text', matchCase: true}), {items: []});
  assert.deepEqual(marked(texts, sample(texts, {wholeWord: true})), [['needle']]);
  assert.deepEqual(marked(['K ſ İ'], sample(['K ſ İ'], {query: 'k s'})), [['K ſ']]);
  assert.deepEqual(sample(['İ'], {query: 'i'}), {items: []});
});

test('regex keeps original anchors, lookarounds, backreferences and Unicode code-point offsets', () => {
  const texts = ['😀 𐐀a 𐐀a', 'prefix needle suffix', 'needle'];
  assert.deepEqual(marked(texts, sample(texts, {query: '(𐐨a) \\1$', useRegex: true})), [['𐐀a 𐐀a']]);
  assert.deepEqual(sample(texts, {query: '(?<=prefix )needle(?= suffix)', useRegex: true}), {
    items: [{index: 1, ranges: [{start: 7, end: 13}]}]});
  assert.deepEqual(sample(texts, {query: '^needle$', useRegex: true}), {
    items: [{index: 2, ranges: [{start: 0, end: 6}]}]});
  assert.deepEqual(sample(['😀𐐀'], {query: '(?:)', useRegex: true}), {
    items: [{index: 0, ranges: [{start: 0, end: 0}, {start: 2, end: 2}, {start: 4, end: 4}]}]});
});

test('typo reuses per-word edit budgets, transpositions and contiguous phrase highlights over full text', () => {
  const texts = [`😀 needel\n plnaet ${'!'.repeat(800)} needle planet`, 'needle extra planet', 'planet needle'];
  const result = sample(texts, {query: 'needle planet', fuzzy: 'typo'});
  assert.deepEqual(marked(texts, result), [['needel\n plnaet', 'needle planet']]);
  assert.deepEqual(sample(['cot needel'], {query: 'cat needle', fuzzy: 'typo'}), {items: []});
  assert.deepEqual(sample(['cat cart'], {query: 'cat', fuzzy: 'typo'}), {items: [{index: 0, ranges: [{start: 0, end: 3}]}]});
});

test('subsequence highlights only tightest selected Unicode code points in every full-document match', () => {
  const texts = [`😀 𐐀x𐐁 ${'!'.repeat(800)} 𐐀x𐐁`, 'axbxcabc'];
  const result = sample(texts, {query: '𐐨𐐩', fuzzy: 'subsequence'});
  assert.deepEqual(result, {items: [{index: 0, ranges: [
    {start: 3, end: 5}, {start: 6, end: 8}, {start: 810, end: 812}, {start: 813, end: 815}]}]});
  assert.deepEqual(sample(texts, {query: 'abc', fuzzy: 'subsequence'}), {items: [{index: 1, ranges: [{start: 5, end: 8}]}]});
  assert.deepEqual(sample(['a' + 'x'.repeat(15) + 'b'], {query: 'ab', fuzzy: 'subsequence'}), {items: []});
});

for (const fuzzy of ['typo', 'subsequence']) test(`${fuzzy} preserves punctuation and full-span Unicode whole-word semantics`, () => {
  const texts = ['x(plane)y', '😀(plane)😀', 'planeZZ (plane)'];
  assert.deepEqual(marked(texts, sample(texts, {query: '(plane)', fuzzy, wholeWord: true})), [['(plane)'], ['(plane)']]);
  assert.deepEqual(sample(['needle, planet'], {query: 'needle planet', fuzzy}), {items: []});
  assert.deepEqual(sample(['İ'], {query: 'i', fuzzy}), {items: []});
});

test('highlight validates query, all flags and fuzzy restrictions exactly like search', () => {
  for (const query of [undefined, null, '', '  ', 1, 'a'.repeat(1025)]) assert.throws(() => sample([], {query}), /query/);
  for (const key of ['matchCase', 'wholeWord', 'useRegex']) {
    for (const value of [null, 0, 1, 'yes', [], {}]) assert.throws(() => sample([], {[key]: value}), /boolean/);
    assert.deepEqual(sample(['needle'], {[key]: 'false'}), sample(['needle'], {[key]: false}));
    assert.deepEqual(sample(['needle'], {[key]: 'true'}), sample(['needle'], {[key]: true}));
  }
  for (const fuzzy of [null, '', 'near', false, 1, [], {}]) assert.throws(() => sample([], {fuzzy}), /fuzzy/i);
  for (const fuzzy of ['typo', 'subsequence']) {
    assert.throws(() => sample([], {fuzzy, useRegex: true}), /cannot be combined/);
    for (const query of ['𐐀'.repeat(129), 'a'.repeat(129), Array(17).fill('a').join('.')]) assert.throws(() => sample([], {query, fuzzy}), /128|16/);
    for (const query of ['𐐀'.repeat(128), Array(16).fill('a').join('.')]) assert.deepEqual(sample([], {query, fuzzy}), {items: []});
  }
  assert.deepEqual(sample([], {query: 'a'.repeat(1024)}), {items: []});
  for (const input of [undefined, null, [], 'needle']) assert.throws(() => highlightText(input), /request/);
});

test('input caps count all blocks together in UTF-16 units, reject non-string and sparse blocks', () => {
  assert.equal(MAX_HIGHLIGHT_TEXTS, 500); assert.equal(MAX_HIGHLIGHT_TEXT, 200000);
  assert.deepEqual(sample(Array(500).fill('')), {items: []});
  assert.deepEqual(sample(['😀'.repeat(100000)]), {items: []});
  for (const texts of [undefined, 'needle', Array(501).fill(''), ['x'.repeat(100000), 'x'.repeat(100001)],
    ['😀'.repeat(100001)], [null], [1], new Array(1)]) assert.throws(() => sample(texts), /texts|block|UTF-16/);
});

for (const fuzzy of ['off', 'typo', 'subsequence']) test(`${fuzzy} enforces per-block and entire-batch output caps with explicit truncation`, () => {
  assert.equal(MAX_HIGHLIGHT_RANGES, 256); assert.equal(MAX_HIGHLIGHT_TOTAL_RANGES, 2048);
  const result = sample(Array(12).fill('needle '.repeat(300)), {fuzzy});
  assert.equal(result.truncated, true);
  assert.equal(result.items.length, 8);
  assert.equal(result.items.reduce((sum, item) => sum + item.ranges.length, 0), 2048);
  assert.ok(result.items.every(item => item.ranges.length === 256 && item.rangesTruncated));
  const inclusive = sample(['needle '.repeat(256)], {fuzzy});
  assert.equal(inclusive.items[0].ranges.length, 256);
  assert.equal(inclusive.truncated, undefined);
  assert.equal(inclusive.items[0].rangesTruncated, undefined);
});

test('invalid regex is rejected inside VM even with no text blocks', () => {
  for (const query of ['[', ')', '(?<name>x)(?<name>y)']) assert.throws(() => sample([], {query, useRegex: true}), error => error.code === 'INVALID_REGEX');
  assert.deepEqual(sample(['anything'], {query: '.*'}), {items: []}, 'literal mode never evaluates regex syntax');
});

test('catastrophic regex aborts the one 100ms batch with no partial results', () => {
  assert.equal(MATCH_TIMEOUT_MS, 100);
  const start = performance.now();
  assert.throws(() => sample(['aaa', `${'a'.repeat(40000)}!`], {query: '(a+)+$', useRegex: true}),
    error => error.code === 'SEARCH_MATCH_TIMEOUT' && /highlight batch.*No partial results/.test(error.message));
  assert.ok(performance.now() - start < 5000);
});

test('one VM deadline spans all 500 fuzzy blocks instead of resetting per block', () => {
  const texts = Array(500).fill(`${'a'.repeat(128)} `.repeat(3));
  assert.ok(texts.reduce((sum, text) => sum + text.length, 0) <= MAX_HIGHLIGHT_TEXT);
  for (const fuzzy of ['typo', 'subsequence']) {
    const start = performance.now();
    assert.throws(() => sample(texts, {query: `${'a'.repeat(125)}bbb`, fuzzy}),
      error => error.code === 'SEARCH_MATCH_TIMEOUT' && /No partial results/.test(error.message));
    assert.ok(performance.now() - start < 5000);
  }
});

test('highlight registers before existing search route without a tool or stored-data capability', async () => {
  const {route, registered, tools} = routes();
  assert.ok(route);
  assert.ok(registered.indexOf(route) < registered.findIndex(value => value.path === '/api/local-session-search'));
  assert.equal(registered.at(-1).path, '/api/local-session-search');
  assert.deepEqual(tools.map(tool => tool.name), ['session_search_settings', 'search_session_text']);
  const input = {query: 'ndl', fuzzy: 'subsequence', texts: ['😀 needle']};
  const res = await request(route, input);
  assert.equal(res.code, 200); assert.deepEqual(res.body, highlightText(input));
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(res.headers['X-Content-Type-Options'], 'nosniff');
  assert.match(res.headers['Content-Type'], /application\/json/);
});

test('HTTP authentication and owner admission reject before reading attacker-controlled body', async () => {
  for (const [admission, code] of [[{rejection: 401}, 401], [{rejection: 403}, 403], [{peer: {principal: {kind: 'api'}}}, 403]]) {
    const {route} = routes(admission);
    const res = await request(route, undefined, {chunks: [Buffer.alloc(2 * 1024 * 1024 + 1)]});
    assert.equal(res.code, code); assert.equal(res.body.items, undefined);
    assert.equal(res.headers['Cache-Control'], 'no-store');
  }
});

test('HTTP methods and JSON content type are enforced', async () => {
  const {route} = routes();
  for (const method of ['GET', 'PUT', 'DELETE']) {
    const res = await request(route, undefined, {method});
    assert.equal(res.code, 405); assert.equal(res.headers.Allow, 'POST');
  }
  for (const contentType of ['', 'text/plain', 'application/jsonp']) assert.equal((await request(route, undefined, {headers: {'content-type': contentType}})).code, 415);
});

test('HTTP body limits apply to declared and streaming byte lengths and return honest JSON 400', async () => {
  const {route} = routes();
  for (const options of [{raw: '{'}, {raw: 'null'}, {raw: '[]'},
    {headers: {'content-length': String(2 * 1024 * 1024 + 1)}},
    {chunks: [Buffer.alloc(1024 * 1024), Buffer.alloc(1024 * 1024), Buffer.from('x')]},
    {raw: JSON.stringify({query: 'a', texts: ['a'.repeat(200001)]})}]) {
    const res = await request(route, undefined, options);
    assert.equal(res.code, 400); assert.equal(typeof res.body.error, 'string'); assert.equal(res.body.items, undefined);
    if (options.chunks) assert.equal(res.request.destroyed, false, 'oversized body must not destroy socket before the JSON error');
  }
  const res = await request(route, {query: 'needle', texts: ['needle']}, {chunks: [Buffer.from('{"query":"needle",'), Buffer.from('"texts":["needle"]}') ]});
  assert.equal(res.code, 200);
});

test('HTTP surfaces invalid-regex and timeout codes without partial highlights', async () => {
  const {route} = routes();
  for (const [query, texts, code] of [['[', [], 'INVALID_REGEX'], ['(a+)+$', ['aaa', `${'a'.repeat(40000)}!`], 'SEARCH_MATCH_TIMEOUT']]) {
    const res = await request(route, {query, texts, useRegex: true});
    assert.equal(res.code, 400); assert.equal(res.body.code, code); assert.equal(res.body.items, undefined);
  }
});
