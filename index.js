import {search} from './search.js';
export const inject = ['sessionQuery', 'sessionController', 'workspaceController', 'connection', 'webServer', 'tools'];
export function apply(ctx) {
  const operation = (input, signal) => search(ctx, input, signal);
  ctx.effect(() => ctx.provide('localSessionSearch', {search: operation}));
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
      sessionId: {type: 'string', description: 'Restrict to this conversation ID within the workspace scope; omit for all eligible sessions.'},
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
