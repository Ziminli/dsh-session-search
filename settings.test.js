import test from 'node:test';
import assert from 'node:assert/strict';
import {Readable} from 'node:stream';
import {EventEmitter} from 'node:events';
import {apply} from './index.js';
import {Config, validateSettings, createSettingsOperation} from './settings.js';
function fixture(admission = {peer: {principal: {kind: 'owner'}}}) {
  const routes = new Map(), tools = new Map(); let service;
  const entry = {options: {id: 'search', name: '@lizimin/dsh-session-search'}, fiber: {uid: 7, config: {searchMode: 'live'}}};
  const state = {writes: 0, fail: false};
  const ctx = {fiber: {uid: 7}, configEditor: {entries: () => [entry], async edit(current, change) {
    assert.equal(current, entry);
    if (state.fail) throw new Error('Settings are read-only');
    const next = change(entry.fiber.config, {}); entry.fiber = {uid: 8, config: validateSettings(next)}; state.writes++;
  }}, effect: fn => fn(), provide: (_key, value) => {service = value; return () => {};},
  connection: {admit: () => admission}, webServer: {register: route => {routes.set(route.path, route); return () => {};}}, tools: {register: tool => {tools.set(tool.name, tool); return () => {};}}};
  apply(ctx, {searchMode: 'live'});
  return {routes, tools, service, state, entry, ctx};
}
async function request(f, {method = 'GET', body, headers = {}} = {}) {
  const req = Readable.from(body === undefined ? [] : [body]); Object.assign(req, {method, headers});
  const res = new EventEmitter(); Object.assign(res, {headers: {}, destroyed: false, setHeader(key, value) {this.headers[key] = value;}, writeHead(code) {this.code = code;}, end(text) {this.body = JSON.parse(text);}});
  await f.routes.get('/api/local-session-search-settings').handler(req, res); return res;
}
test('settings Standard Schema defaults and rejects malformed config', () => {
  assert.deepEqual(Config['~standard'].validate(undefined), {value: {searchMode: 'live'}});
  for (const searchMode of ['live', 'submit']) assert.deepEqual(validateSettings({searchMode}), {searchMode});
  for (const value of [null, false, [], '', {searchMode: 'bad'}, {searchMode: null}, {unknown: 1}]) assert.ok(Config['~standard'].validate(value).issues);
  assert.equal(Config['~standard-json-schema'].input().properties.searchMode.default, 'live');
});
test('settings UI HTTP, tool and service share persisted values across fiber replacement and return failures', async () => {
  const f = fixture(), tool = f.tools.get('session_search_settings');
  assert.deepEqual((await request(f)).body, {searchMode: 'live'});
  const saved = await request(f, {method: 'POST', headers: {'content-type': 'application/json; charset=utf-8'}, body: '{"searchMode":"submit"}'});
  assert.equal(saved.code, 200); assert.deepEqual(saved.body, {searchMode: 'submit'});
  assert.deepEqual(await tool.execute({}), saved.body); assert.deepEqual(await f.service.settings(), saved.body);
  assert.deepEqual(await tool.execute({searchMode: 'live'}), {searchMode: 'live'}); assert.equal(f.state.writes, 2);
  assert.deepEqual((await request(f)).body, {searchMode: 'live'});
  assert.equal(tool.isConcurrencySafe({}), true); assert.equal(tool.isConcurrencySafe({searchMode: 'live'}), false);
  f.state.fail = true;
  const failed = await request(f, {method: 'POST', headers: {'content-type': 'application/json'}, body: '{"searchMode":"submit"}'});
  assert.equal(failed.code, 400); assert.equal(failed.body.error, 'Settings are read-only');
  await assert.rejects(tool.execute({searchMode: 'submit'}), {message: failed.body.error});
  assert.deepEqual(await f.service.settings(), {searchMode: 'live'});
});
test('settings route protects owner writes, methods, JSON type/body/size and disables caching', async () => {
  for (const [admission, expected] of [[{rejection: 401}, 401], [{rejection: 403}, 403], [{peer: {principal: {kind: 'api'}}}, 403]]) {
    const f = fixture(admission);
    for (const method of ['GET', 'POST']) assert.equal((await request(f, {method})).code, expected);
    assert.equal(f.state.writes, 0);
  }
  const f = fixture();
  const get = await request(f); assert.equal(get.headers['Cache-Control'], 'no-store');
  assert.equal((await request(f, {method: 'DELETE'})).code, 405);
  assert.equal((await request(f, {method: 'POST', body: '{}'})).code, 415);
  for (const body of ['', '{', 'null', '{"searchMode":"bad"}', '{"extra":1}', ' '.repeat(1025)]) {
    assert.equal((await request(f, {method: 'POST', body, headers: {'content-type': 'application/json'}})).code, 400);
  }
  assert.equal(f.state.writes, 0);
});
test('settings lookup is lazy and fails explicitly for a removed plugin entry', async () => {
  const ctx = {fiber: {uid: 1}, configEditor: {entries: () => []}};
  await assert.rejects(createSettingsOperation(ctx, {})(), /configuration is unavailable/);
});
