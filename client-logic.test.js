import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// Test actual date/identity/loading and navigation logic without loading or emulating React/the DOM.
const source = readFileSync(new URL('./client.js', import.meta.url), 'utf8');
const begin = source.indexOf('    function localDay(');
const end = source.indexOf('    return {\n      inject:', begin);
assert.ok(begin > 0 && end > begin);
const {localDay, timeBounds, selectedChatNodeKeys, loadSelectedMessage} = Function(`${source.slice(begin, end)}; return {localDay, timeBounds, selectedChatNodeKeys, loadSelectedMessage};`)();

// Exercise the actual navigation operations with service spies, not a rendered UI.
const navigationStart = source.indexOf('        function openHighlightedConversation(');
const navigationEnd = source.indexOf('        // Keep pages mounted', navigationStart);
assert.ok(navigationStart > 0 && navigationEnd > navigationStart);
const makeNavigation = Function('ctx', 'setHighlightIntent', 'getIntent', `${source.slice(navigationStart, navigationEnd).replace('const previous = highlightIntent;', 'const previous = getIntent();')}; return openHighlightedConversation;`);

// Exercise the actual focus-dismiss handler, without React/DOM emulation.
const pickerBlurStart = source.indexOf('onBlur: event => {', source.indexOf('        function MultiPicker('));
const pickerBlurEnd = source.indexOf('}, onKeyDown:', pickerBlurStart);
assert.ok(pickerBlurStart > 0 && pickerBlurEnd > pickerBlurStart);
const pickerBlur = Function('event', 'setOpen', source.slice(pickerBlurStart + 'onBlur: event => {'.length, pickerBlurEnd));

test('multiselect blur without a focus target leaves native label activation intact', () => {
  const closed = [];
  pickerBlur({relatedTarget: null, currentTarget: {contains: () => assert.fail('No destination to inspect')}}, value => closed.push(value));
  assert.deepEqual(closed, [], 'Clicking nonfocusable row text/padding must not unmount the checkbox before label activation');
});

test('multiselect keeps internal focus open and closes on definite outside focus', () => {
  for (const inside of [true, false]) {
    const target = {};
    const closed = [];
    pickerBlur({relatedTarget: target, currentTarget: {contains: value => {assert.equal(value, target); return inside;}}}, value => closed.push(value));
    assert.deepEqual(closed, inside ? [] : [false]);
  }
});

test('both scope pickers retain native whole-row labels and one checkbox change handler', () => {
  const picker = source.slice(source.indexOf('        function MultiPicker('), source.indexOf('        // Opaque warn fill'));
  assert.match(picker, /visible\.map\(option => h\('label', \{key: option\.id, className: 'dss-picker-option'/);
  assert.match(picker, /h\('input', \{type: 'checkbox', checked: selected\.has\(option\.id\), onChange:/);
  const rows = picker.slice(picker.indexOf("h('div', {className: 'dss-picker-list'"));
  assert.doesNotMatch(rows, /onClick:|preventDefault\(/, 'Native label activation must not be cancelled or double-toggled');
  assert.match(picker, /document\.addEventListener\('pointerdown', outside\)/);
  assert.match(picker, /event\.key === 'Escape' && open/);
  assert.equal((source.match(/h\(MultiPicker, \{label: t\('(workspace|session)'\)/g) || []).length, 2);
});

test('opening a highlighted result preserves native Conversation mode and matching options', () => {
  const calls = [];
  let intent = null;
  const navigate = makeNavigation({uiWorkspace: {openSession: id => calls.push(['open', id])}, layout: {selectPanel: id => calls.push(['panel', id])}}, value => {intent = value;}, () => intent);
  navigate({sessionId: 'selected-session', seq: 152}, {query: 'market', fuzzy: 'typo', matchCase: true, wholeWord: false, useRegex: false});
  assert.deepEqual(calls, [['open', 'selected-session'], ['panel', null]]);
  assert.deepEqual(intent, {sessionId: 'selected-session', seq: 152, spec: {query: 'market', fuzzy: 'typo', matchCase: true, wholeWord: false, useRegex: false}});
});

test('synchronous native-navigation failure restores the previous highlight intent', () => {
  const previous = {sessionId: 'previous'};
  let intent = previous;
  const navigate = makeNavigation({uiWorkspace: {openSession: () => {throw new Error('navigation unavailable');}}, layout: {selectPanel: () => assert.fail('No panel change after failure')}}, value => {intent = value;}, () => intent);
  assert.throws(() => navigate({sessionId: 'next', seq: 9}, {query: 'market'}), /navigation unavailable/);
  assert.equal(intent, previous);
});

test('clearing highlights restores null native mode, never the conversation string panel', () => {
  const start = source.indexOf('        const clearHighlights = () => {');
  const end = source.indexOf('        ctx.effect(', start);
  const clearCode = source.slice(start, end);
  for (const mounted of [false, true]) {
    const calls = [];
    const clear = Function('ctx', 'setHighlightIntent', 'highlightPanelMounted', `${clearCode}; return clearHighlights;`)({layout: {selectPanel: id => calls.push(['panel', id])}}, value => calls.push(['intent', value]), mounted);
    clear();
    assert.deepEqual(calls, mounted ? [['intent', null], ['panel', null]] : [['intent', null]]);
  }
});

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
