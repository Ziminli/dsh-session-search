import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Test actual date/identity/loading helpers without loading or emulating React/the DOM.
const source = readFileSync(new URL('./client.js', import.meta.url), 'utf8');
const begin = source.indexOf('    function localDay(');
const end = source.indexOf('    return {\n      inject:', begin);
assert.ok(begin > 0 && end > begin);
const {localDay, timeBounds, selectedChatNodeKeys, loadSelectedMessage} = Function(`${source.slice(begin, end)}; return {localDay, timeBounds, selectedChatNodeKeys, loadSelectedMessage};`)();

test('custom calendar dates validate, allow open bounds and include the entire end day', () => {
  assert.equal(localDay('2026-02-30'), NaN);
  assert.equal(localDay('2026-13-01'), NaN);
  assert.equal(localDay('bad'), NaN);
  assert.equal(timeBounds('custom', '2026-10-29', '2026-10-28', 0), null);
  assert.equal(timeBounds('custom', '2026-02-30', '', 0), null);
  assert.deepEqual(timeBounds('custom', '', '', 0), {after: undefined, before: undefined});
  const bounds = timeBounds('custom', '2026-10-28', '2026-10-28', 0);
  assert.equal(bounds.after, new Date(2026, 9, 28).getTime());
  assert.equal(bounds.before, new Date(2026, 9, 29).getTime());
  assert.deepEqual(timeBounds('custom', '', '2026-10-28', 0), {after: undefined, before: bounds.before});
  assert.equal(new Date(localDay('0099-01-01')).getFullYear(), 99);
});

test('relative and calendar presets resolve from the provided clock, not render-time reads', () => {
  const now = new Date(2026, 9, 28, 12, 34, 56).getTime();
  assert.deepEqual(timeBounds('all', '', '', now), {});
  assert.deepEqual(timeBounds('24h', '', '', now), {after: now - 86400000, before: now});
  assert.deepEqual(timeBounds('7d', '', '', now), {after: now - 7 * 86400000, before: now});
  assert.deepEqual(timeBounds('today', '', '', now), {after: new Date(2026, 9, 28).getTime(), before: now});
  assert.deepEqual(timeBounds('month', '', '', now), {after: new Date(2026, 9, 1).getTime(), before: now});
});

test('selected events use exact Chat identities, including settled replies and tool results', () => {
  const nodes = new Map([
    ['user', {anchorSeq: 5, data: {seq: 5}}],
    ['assistant', {anchorSeq: 8, data: {finalNode: {seq: 12}}}],
    ['tool', {anchorSeq: 14, data: {root: {seq: 17}}}],
    ['next', {anchorSeq: 21, data: {seq: 21}}]
  ]);
  const chat = {order: [...nodes.keys()], nodes};
  assert.deepEqual(selectedChatNodeKeys(chat, 12), ['assistant']);
  assert.deepEqual(selectedChatNodeKeys(chat, 17), ['tool']);
  assert.deepEqual(selectedChatNodeKeys(chat, 5), ['user']);
  assert.deepEqual(selectedChatNodeKeys(chat, 10), [], 'Never choose a numerically nearby unrelated message');
  assert.deepEqual(selectedChatNodeKeys(chat, undefined), []);
  assert.deepEqual(selectedChatNodeKeys(null, 5), []);
});

test('history loads through the selected event only after binding is ready', async () => {
  let ready, finishLoad;
  const calls = [];
  const reference = {ready: new Promise(resolve => {ready = resolve;}), binding: {session: {loadThrough: seq => {
    calls.push(seq); return new Promise(resolve => {finishLoad = resolve;});
  }}}};
  const opened = loadSelectedMessage(reference, {seq: 152}, () => true);
  assert.deepEqual(calls, []);
  ready(); await Promise.resolve();
  assert.deepEqual(calls, [152]);
  finishLoad(); assert.equal(await opened, true);
});

test('stale or cleared navigation never opens or loads a different result', async () => {
  let current = false;
  const calls = [];
  const reference = {ready: Promise.resolve(), binding: {session: {loadThrough: async seq => {calls.push(seq); current = false;}}}};
  assert.equal(await loadSelectedMessage(reference, {seq: 2}, () => current), false);
  assert.deepEqual(calls, []);
  current = true;
  assert.equal(await loadSelectedMessage(reference, {seq: 2}, () => current), false);
  assert.deepEqual(calls, [2]);
  current = true;
  assert.equal(await loadSelectedMessage(reference, {}, () => current), true);
  assert.deepEqual(calls, [2]);
});

test('history load failures surface instead of silently opening the latest page', async () => {
  const reference = {ready: Promise.resolve(), binding: {session: {loadThrough: async () => {throw new Error('history unavailable');}}}};
  await assert.rejects(loadSelectedMessage(reference, {seq: 3}, () => true), /history unavailable/);
});

test('custom inclusive end date advances a calendar day across daylight-saving transitions', () => {
  const original = process.env.TZ;
  try {
    process.env.TZ = 'America/New_York';
    const spring = timeBounds('custom', '2026-03-08', '2026-03-08', 0);
    const fall = timeBounds('custom', '2026-11-01', '2026-11-01', 0);
    assert.equal(spring.before - spring.after, 23 * 3600000);
    assert.equal(fall.before - fall.after, 25 * 3600000);
    assert.equal(new Date(spring.before).getHours(), 0);
    assert.equal(new Date(fall.before).getHours(), 0);
  } finally {
    if (original === undefined) delete process.env.TZ; else process.env.TZ = original;
  }
});
