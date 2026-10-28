import {search, highlightText} from './search.js';
import {createSettingsOperation, readSettingsBody} from './settings.js';
export {Config} from './settings.js';
export const inject = ['sessionQuery', 'sessionController', 'workspaceController', 'connection', 'webServer', 'tools', 'configEditor'];
const MAX_HIGHLIGHT_BODY_BYTES = 2 * 1024 * 1024;
async function readHighlightBody(req) {
  const declared = req.headers['content-length'];
  if (declared !== undefined && (!/^\d+$/u.test(declared) || Number(declared) > MAX_HIGHLIGHT_BODY_BYTES)) throw new Error('Highlight body exceeds 2 MiB or has invalid Content-Length');
  let size = 0;
  const chunks = [];
  // Do not destroy IncomingMessage (and its socket) on an oversized body:
  // the handler still owes the caller an honest JSON 400 response.
  for await (const chunk of req.iterator({destroyOnReturn: false})) {
    size += Buffer.byteLength(chunk);
    if (size > MAX_HIGHLIGHT_BODY_BYTES) throw new Error('Highlight body exceeds 2 MiB');
    chunks.push(Buffer.from(chunk));
  }
  try {return JSON.parse(Buffer.concat(chunks).toString('utf8'));} catch {throw new Error('Invalid highlight JSON');}
}
export function apply(ctx, config) {
  const operation = (input, signal) => search(ctx, input, signal);
  const settings = createSettingsOperation(ctx, config);
  ctx.effect(() => ctx.provide('localSessionSearch', {search: operation, settings}));
  ctx.effect(() => ctx.webServer.register({kind: 'exact', path: '/api/local-session-search-settings', async handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const admission = ctx.connection.admit({headers: req.headers});
    if ('rejection' in admission) {res.writeHead(admission.rejection); res.end(JSON.stringify({error: 'Authentication required'})); return;}
    if (admission.peer.principal.kind !== 'owner') {res.writeHead(403); res.end(JSON.stringify({error: 'Owner access required'})); return;}
    if (!['GET', 'POST'].includes(req.method)) {res.setHeader('Allow', 'GET, POST'); res.writeHead(405); res.end(JSON.stringify({error: 'GET or POST required'})); return;}
    if (req.method === 'POST' && !/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {res.writeHead(415); res.end(JSON.stringify({error: 'JSON content type required'})); return;}
    try {
      const result = await settings(req.method === 'POST' ? await readSettingsBody(req) : undefined);
      if (!res.destroyed) {res.writeHead(200); res.end(JSON.stringify(result));}
    } catch (error) {
      if (!res.destroyed) {res.writeHead(400); res.end(JSON.stringify({error: error instanceof Error ? error.message : String(error)}));}
    }
  }}));
  ctx.effect(() => ctx.tools.register({
    name: 'session_search_settings',
    description: 'Read or save the profile-wide Session Search timing preference. Live searches as you type; submit waits for Enter or Search.',
    parameters: {type: 'object', properties: {searchMode: {type: 'string', enum: ['live', 'submit'], description: 'Omit to read. Set to save this timing mode in plugin settings.'}}, additionalProperties: false},
    output: {schema: {type: 'object'}, render: (_args, value) => [{type: 'text', text: JSON.stringify(value)}]},
    isConcurrencySafe: input => input.searchMode === undefined,
    async execute(input) {return settings(input.searchMode === undefined ? undefined : input);}
  }));
  ctx.effect(() => ctx.webServer.register({kind: 'exact', path: '/api/local-session-search-highlight', async handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    const admission = ctx.connection.admit({headers: req.headers});
    if ('rejection' in admission) {res.writeHead(admission.rejection); res.end(JSON.stringify({error: 'Authentication required'})); return;}
    if (admission.peer.principal.kind !== 'owner') {res.writeHead(403); res.end(JSON.stringify({error: 'Owner access required'})); return;}
    if (req.method !== 'POST') {res.setHeader('Allow', 'POST'); res.writeHead(405); res.end(JSON.stringify({error: 'POST required'})); return;}
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {res.writeHead(415); res.end(JSON.stringify({error: 'JSON content type required'})); return;}
    try {
      const input = await readHighlightBody(req);
      if (res.destroyed) return;
      const result = highlightText(input);
      if (!res.destroyed) {res.writeHead(200); res.end(JSON.stringify(result));}
    } catch (error) {
      if (!res.destroyed) {res.writeHead(400); res.end(JSON.stringify({error: error instanceof Error ? error.message : String(error), ...(error?.code ? {code: error.code} : {})}));}
    }
  }}));
  ctx.effect(() => ctx.webServer.register({kind: 'exact', path: '/api/local-session-search', async handler(req, res) {
    const admission = ctx.connection.admit({headers: req.headers});
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    if ('rejection' in admission) {res.writeHead(admission.rejection); res.end(JSON.stringify({error: 'Authentication required'})); return;}
    if (admission.peer.principal.kind !== 'owner') {res.writeHead(403); res.end(JSON.stringify({error: 'Owner access required'})); return;}
    if (req.method !== 'GET') {res.setHeader('Allow', 'GET'); res.writeHead(405); res.end(JSON.stringify({error: 'GET required'})); return;}
    const controller = new AbortController();
    const cancel = () => controller.abort();
    res.once('close', cancel);
    try {
      const url = new URL(req.url, 'http://localhost');
      const result = await operation(Object.fromEntries(url.searchParams), controller.signal);
      if (!res.destroyed) {res.writeHead(200); res.end(JSON.stringify(result));}
    } catch (error) {
      if (!res.destroyed) {res.writeHead(400); res.end(JSON.stringify({error: error instanceof Error ? error.message : String(error), ...(error?.code ? {code: error.code} : {})}));}
    } finally {res.off('close', cancel);}
  }}));
  ctx.effect(() => ctx.tools.register({
    name: 'search_session_text',
    description: 'Search DSH history: every matching reply/event with snippets and UTF-16 ranges, or complete per-session match counts. Results are paged. Read-only.',
    parameters: {type: 'object', properties: {
      action: {type: 'string', enum: ['search', 'sessions', 'groups'], description: 'Default search: matching replies/events. groups: session rows with complete event counts (total=groups, totalMatches=events). sessions: catalog without text matching.'},
      query: {type: 'string', description: 'Required for search/groups, 1–1024 characters. Default: escaped literal substring with flexible whitespace. Regex mode: JavaScript Unicode pattern source, no /delimiters/ or trailing flags. Invalid or timed-out expressions fail the entire search.'},
      sessionId: {type: 'string', description: 'Legacy single conversation ID; cannot combine with nonempty sessionIds.'},
      sessionIds: {type: 'array', items: {type: 'string'}, maxItems: 1000, description: 'Search any of these conversation IDs, intersected with workspace scope. Empty/omitted means all. Do not combine with sessionId.'},
      workspaceIds: {type: 'array', items: {type: 'string'}, maxItems: 200, description: 'Search any of these workspace IDs; empty/omitted means all. Use __ungrouped__ for unregistered workspaces. Discover IDs via action sessions. Do not combine with workspaceId.'},
      after: {type: 'integer', description: 'Inclusive message timestamp lower bound, Unix epoch milliseconds. Missing timestamps are excluded when bounded.'},
      before: {type: 'integer', description: 'Exclusive message timestamp upper bound, Unix epoch milliseconds; must exceed after. Applies before matching/grouping, not to session activity.'},
      workspaceId: {type: 'string', description: 'Restrict to this workspace ID; omit for all workspaces. Discover IDs from action sessions → workspaces. Use __ungrouped__ for sessions without a registered workspace. A selected session must belong to this workspace.'},
      includeSubagents: {type: 'boolean', description: 'Include subagent conversations. Default false.'},
      includeArchived: {type: 'boolean', description: 'Include archived conversations. Default false.'},
      matchCase: {type: 'boolean', description: 'Match case exactly. Default false (Unicode case-insensitive).'},
      wholeWord: {type: 'boolean', description: 'Require no adjacent Unicode letter, number or underscore around the complete match. Default false; combines with exact, regex or fuzzy modes.'},
      useRegex: {type: 'boolean', description: 'Interpret query as a JavaScript Unicode regular expression instead of literal text. Default false; incompatible with fuzzy modes.'},
      fuzzy: {type: 'string', enum: ['off', 'typo', 'subsequence'], description: 'Default off: exact text. typo: whole words within 0 edits for 1–3 characters, 1 for 4–7, 2 for 8+; includes adjacent transpositions. subsequence: ordered characters within each word (candidate length ≤4×query-word length+8). Fuzzy phrases keep words contiguous/in order, punctuation literal, whitespace flexible; max 128 Unicode characters / 16 words. Compatible with matchCase/wholeWord, not useRegex.'},
      content: {type: 'string', enum: ['final', 'all'], description: 'Default final: text of the last assistant reply in each completed turn. all: also inputs, intermediate outputs, tool text and stored reasoning.'},
      order: {type: 'string', enum: ['newest', 'oldest'], description: 'Default newest. Search sorts matching messages; groups sorts each session by its newest/oldest matching message, then ID. Catalog uses latest user activity.'},
      cursor: {type: 'string', description: 'nextCursor from the previous page with identical action, query, scope and flags; changed history requires restarting search.'}
    }, additionalProperties: false},
    output: {schema: {type: 'object'}, render: (_args, value) => [{type: 'text', text: JSON.stringify(value)}]},
    isConcurrencySafe: () => true,
    async execute(input, exec) {return operation(input, exec.signal);}
  }));
}
