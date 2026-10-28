import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Test the actual pure date helpers without loading or emulating React/the DOM.
const source = readFileSync(new URL('./client.js', import.meta.url), 'utf8');
const begin = source.indexOf('    function localDay(');
const end = source.indexOf('    return {\n      inject:', begin);
assert.ok(begin > 0 && end > begin);
const {localDay, timeBounds} = Function(`${source.slice(begin, end)}; return {localDay, timeBounds};`)();

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
