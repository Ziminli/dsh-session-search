import {createHash} from 'node:crypto';
import {Script} from 'node:vm';
import {catalog, finalDocuments, processDocuments, LIMIT} from './session-catalog.js';
export {catalog, workspaceCatalog, finalDocuments, processDocuments, workspaceSnapshot, LIMIT, UNGROUPED_WORKSPACE_ID} from './session-catalog.js';

export const MATCH_TIMEOUT_MS = 100;
export const MAX_SNIPPET = 640;
export const MAX_RANGES = 64;
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
function string(value, name, max = 1024) {
  if (typeof value !== 'string' || !value.trim() || value.length > max) throw new Error(`${name} must be nonempty text of at most ${max} characters`);
  return value;
}
function flag(value, name) {
  if (value === undefined || value === false || value === 'false') return false;
  if (value === true || value === 'true') return true;
  throw new Error(`${name} must be a boolean`);
}
function choice(value, fallback, values, name) {
  const result = value ?? fallback;
  if (!values.includes(result)) throw new Error(`Invalid ${name}`);
  return result;
}
export class SearchMatchError extends Error {
  constructor(message, code) {super(message); this.name = 'SearchMatchError'; this.code = code;}
}

// This entire function runs INSIDE the timed VM, including compilation,
// iteration, snippet construction and serialization. User input is data only;
// it is never interpolated into JavaScript source or evaluated as JavaScript.
function matchDocumentList(documents, spec, maxSnippet, maxRanges) {
  const source = spec.useRegex ? spec.query : spec.query.trim().split(/\s+/u)
    .map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+');
  // Noncapturing wrapping preserves numbered backreferences. Putting boundaries
  // in the pattern permits alternatives/backtracking to find a whole match.
  const flags = spec.matchCase ? 'gu' : 'giu';
  // Validate the source in its own right: an unmatched parenthesis must not
  // become valid by accidentally closing our whole-word wrapper.
  const rawPattern = new RegExp(source, flags);
  const bounded = spec.wholeWord ? `(?<![\\p{L}\\p{N}_])(?:${source})(?![\\p{L}\\p{N}_])` : source;
  const pattern = spec.wholeWord ? new RegExp(bounded, flags) : rawPattern;
  const hits = [];
  for (const doc of documents) {
    const text = doc.text;
    pattern.lastIndex = 0;
    let match = pattern.exec(text);
    if (!match) continue;
    let start = Math.max(0, match.index - 100);
    // Keep snippet edges between code points, while offsets remain UTF-16.
    if (start > 0 && /[\uDC00-\uDFFF]/u.test(text[start]) && /[\uD800-\uDBFF]/u.test(text[start - 1])) start--;
    let end = Math.min(text.length, start + Math.min(maxSnippet - 2, Math.max(360, match[0].length + 140)));
    if (end < text.length && /[\uDC00-\uDFFF]/u.test(text[end]) && /[\uD800-\uDBFF]/u.test(text[end - 1])) end--;
    const prefix = start ? '…' : '';
    const ranges = [];
    let rangesTruncated = false;
    do {
      const from = match.index;
      const to = from + match[0].length;
      if (from > end || (from === end && to !== from)) break;
      if (to >= start) {
        ranges.push({start: Math.max(start, from) - start + prefix.length, end: Math.min(end, to) - start + prefix.length});
        if (to > end) rangesTruncated = true;
      }
      // Only the highlight list is capped; the document itself is still a hit.
      if (ranges.length >= maxRanges) {rangesTruncated = true; break;}
      if (!match[0].length) {
        if (pattern.lastIndex >= text.length) break;
        pattern.lastIndex += text.codePointAt(pattern.lastIndex) > 0xffff ? 2 : 1;
      }
      if (pattern.lastIndex > end) break;
      // Always match against the original full text, never a sliced snippet:
      // anchors, lookbehind/lookahead and whole-word context must stay intact.
      match = pattern.exec(text);
    } while (match);
    hits.push({seq: doc.seq, time: doc.time, type: doc.type,
      snippet: prefix + text.slice(start, end) + (end < text.length ? '…' : ''), ranges,
      ...(rangesTruncated ? {rangesTruncated: true} : {})});
  }
  return JSON.stringify(hits);
}
const matchingScript = new Script(`(${matchDocumentList.toString()})(documents, spec, maxSnippet, maxRanges)`, {filename: 'session-search-matcher-v1.5.vm.js'});
function matchDocuments(documents, spec) {
  try {
    // One deadline covers the complete per-session document list, NOT one
    // budget per candidate or exec call. No regex executes outside this VM.
    return JSON.parse(matchingScript.runInNewContext({documents, spec, maxSnippet: MAX_SNIPPET, maxRanges: MAX_RANGES},
      {timeout: MATCH_TIMEOUT_MS, contextCodeGeneration: {strings: false, wasm: false}}));
  } catch (error) {
    if (error?.code === 'ERR_SCRIPT_EXECUTION_TIMEOUT') {
      throw new SearchMatchError(`Search matching timed out after ${MATCH_TIMEOUT_MS}ms for one session. Simplify the expression or narrow the scope. No partial results returned.`, 'SEARCH_MATCH_TIMEOUT');
    }
    if (error?.name === 'SyntaxError') throw new SearchMatchError(`Invalid regular expression: ${error.message}`, 'INVALID_REGEX');
    throw new SearchMatchError(`Search matching failed: ${error instanceof Error ? error.message : String(error)}`, 'SEARCH_MATCH_FAILED');
  }
}

export async function search(services, input, signal = new AbortController().signal) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Expected a search request');
  signal.throwIfAborted();
  const action = choice(input.action, 'search', ['sessions', 'search', 'groups'], 'action');
  const includeSubagents = flag(input.includeSubagents, 'includeSubagents');
  const includeArchived = flag(input.includeArchived, 'includeArchived');
  const matchCase = flag(input.matchCase, 'matchCase');
  const wholeWord = flag(input.wholeWord, 'wholeWord');
  const useRegex = flag(input.useRegex, 'useRegex');
  const content = choice(input.content, 'final', ['final', 'all'], 'content mode');
  const order = choice(input.order, 'newest', ['newest', 'oldest'], 'result order');
  const options = {includeSubagents, includeArchived, content, order, matchCase, wholeWord, useRegex};
  const query = action !== 'sessions' ? string(input.query, 'query') : undefined;
  const sessionId = input.sessionId === undefined ? undefined : string(input.sessionId, 'sessionId', 512);
  const workspaceId = input.workspaceId === undefined ? undefined : string(input.workspaceId, 'workspaceId', 512);
  const key = digest(['v1.6', action, query, sessionId, workspaceId, options]);
  let cursor;
  if (input.cursor !== undefined) {
    try {
      cursor = JSON.parse(Buffer.from(string(input.cursor, 'cursor', 16384), 'base64url').toString());
      if (cursor.key !== key || !Number.isSafeInteger(cursor.offset) || cursor.offset < 0 || typeof cursor.version !== 'string') throw new Error();
    } catch {throw new Error('Invalid search cursor. Search again.');}
  }
  const spec = {query, matchCase, wholeWord, useRegex};
  // Validate even with an empty/excluded corpus, before any service reads.
  if (action !== 'sessions') matchDocuments([], spec);
  const {items: rows, workspaces} = await catalog(services, options, signal);
  const workspace = workspaceId === undefined ? undefined : workspaces.find(item => item.workspaceId === workspaceId);
  if (workspaceId !== undefined && !workspace) throw new Error('Workspace is unavailable. Refresh the workspace list and search again.');
  const selected = sessionId ? rows.find(row => row.sessionId === sessionId) : undefined;
  if (sessionId && !selected) throw new Error('Session is unavailable or excluded. Refresh the list or enable its archive/subagent scope.');
  if (selected && workspaceId !== undefined && selected.workspaceId !== workspaceId) throw new Error('Session does not belong to the selected workspace. Choose a session in that workspace or clear the session scope.');
  const eligible = rows.filter(row => (!sessionId || row.sessionId === sessionId) && (workspaceId === undefined || row.workspaceId === workspaceId));
  const scope = {scope: sessionId || 'all', workspaceId: workspaceId ?? null, workspaceTitle: workspace?.title || '', workspacePath: workspace?.path || '', workspaces};
  if (action === 'sessions') return {...scope, ...options, items: eligible};
  const items = [], warnings = [];
  for (const row of eligible) {
    signal.throwIfAborted();
    try {
      const observation = await services.sessionQuery.observeSession(row.sessionId, {signal, projectionMode: 'none'});
      try {
        const project = content === 'final' ? finalDocuments : processDocuments;
        for (const hit of matchDocuments(project(observation.events, row.sessionId), spec)) items.push({...row, ...hit});
      } finally {observation[Symbol.dispose]();}
      signal.throwIfAborted();
    } catch (error) {
      signal.throwIfAborted();
      // A pathological expression must stop ALL scopes, never silently hide
      // the affected session behind an ordinary read-failure warning.
      if (error instanceof SearchMatchError || sessionId) throw error;
      warnings.push({sessionId: row.sessionId, error: error instanceof Error ? error.message : String(error)});
    }
  }
  // Search retains every matching reply/event. Groups aggregate this complete
  // set BEFORE presentation pagination, never counts from a page of hits.
  items.sort((a, b) => (order === 'newest' ? b.time - a.time : a.time - b.time) || a.sessionId.localeCompare(b.sessionId) || (order === 'newest' ? b.seq - a.seq : a.seq - b.seq));
  // Bind group cursors to the full hits too: changing a non-extremal matching
  // reply must invalidate a page even when its group's count/time is unchanged.
  const version = digest([items, warnings]);
  if (cursor && cursor.version !== version) throw new Error('History changed. Search again to refresh results.');
  let results = items;
  if (action === 'groups') {
    const metadata = new Map(eligible.map(row => [row.sessionId, row]));
    const groups = new Map();
    for (const hit of items) {
      let group = groups.get(hit.sessionId);
      if (!group) {
        // First hit in chronological result order supplies the requested
        // newest/oldest matching time, NOT the catalog's latest activity.
        group = {...metadata.get(hit.sessionId), count: 0, time: hit.time};
        groups.set(hit.sessionId, group);
      }
      group.count++;
    }
    results = [...groups.values()];
  }
  const offset = cursor?.offset ?? 0;
  if (offset > results.length) throw new Error('Invalid search cursor. Search again.');
  const end = offset + LIMIT;
  return {...scope, query, ...options, items: results.slice(offset, end), total: results.length, scanned: eligible.length,
    ...(action === 'groups' ? {totalMatches: items.length} : {}),
    ...(warnings.length ? {warnings} : {}),
    ...(end < results.length ? {nextCursor: Buffer.from(JSON.stringify({key, version, offset: end})).toString('base64url')} : {})};
}
