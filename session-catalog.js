export const LIMIT = 40;
// Read one public Workspace baseline and close the follower immediately.
export async function workspaceSnapshot(controller, signal) {
  const stream = controller.follow(signal);
  try {
    const frame = await stream.next();
    if (frame.done || frame.value.type !== 'baseline') throw new Error('Workspace catalog unavailable');
    return frame.value.value;
  } finally {await stream.return();}
}
export async function catalog(services, input, signal) {
  const [list, workspaces] = await Promise.all([
    services.sessionController.list({}, signal), workspaceSnapshot(services.workspaceController, signal),
  ]);
  signal.throwIfAborted();
  const archived = new Set(workspaces.archivedSessionIds);
  const seen = new Set();
  const rows = list.items.filter(row => {
    if (seen.has(row.sessionId)) return false;
    seen.add(row.sessionId);
    return !row.blank && (input.includeSubagents || row.origin !== 'subagent') && (input.includeArchived || !archived.has(row.sessionId));
  });
  // Cold subagents need not have a cwd, so the ordinary sidebar catalog may
  // omit them. Supplement only explicit subagent origins when opted in.
  if (input.includeSubagents) {
    const records = await services.sessionQuery.listSessions(signal);
    for (const {header} of records) {
      if (header.origin !== 'subagent' || seen.has(header.id) || (!input.includeArchived && archived.has(header.id))) continue;
      seen.add(header.id);
      rows.push({sessionId: header.id, updatedAt: header.createdAt, origin: header.origin, parentSessionId: header.parentSession, cwd: header.cwd});
    }
  }
  const titles = new Map();
  const missing = rows.filter(row => row.projections?.values?.title === undefined).map(row => row.sessionId);
  if (missing.length) {
    for (const result of await services.sessionQuery.readTitleSnapshots(missing, signal)) {
      if (result.status === 'fulfilled') titles.set(result.sessionId, result.value.title?.title);
    }
  }
  rows.sort((a, b) => b.updatedAt - a.updatedAt || (a.sessionId < b.sessionId ? -1 : a.sessionId > b.sessionId ? 1 : 0));
  return rows.map(row => ({sessionId: row.sessionId, title: (row.projections?.values?.title ?? titles.get(row.sessionId))?.trim() || '', updatedAt: row.updatedAt,
    cwd: row.cwd || '', archived: archived.has(row.sessionId), subagent: row.origin === 'subagent',
    ...(row.parentSessionId ? {parentSession: row.parentSessionId} : {})}));
}
// A final reply is the last successful text-only assistant response in a
// completed turn, not commentary before tools or an abandoned partial attempt.
export function finalDocuments(events, sessionId) {
  const documents = [];
  let candidate;
  let turn;
  for (const event of events) {
    if (event.type === 'turn/start') {turn = event.data.turn; candidate = undefined;}
    if (event.type === 'assistant/message' && event.data.turn === turn) candidate = event;
    if (event.type !== 'turn/end' || event.data.turn !== turn) continue;
    if (event.data.reason.kind === 'completed' && candidate && !candidate.data.interrupted) {
      const content = candidate.data.message.content;
      if (!content.some(block => block.type === 'tool-call')) {
        const text = content.filter(block => block.type === 'text').map(block => block.text).join('\n').trim();
        if (text) documents.push({sessionId, seq: candidate.seq, time: candidate.time, type: candidate.type, text});
      }
    }
    candidate = undefined; turn = undefined;
  }
  return documents;
}
export function processDocuments(events, sessionId) {
  const blockText = blocks => (blocks || []).flatMap(block => {
    if (block.type === 'text' || block.type === 'reasoning') return [block.text];
    if (block.type === 'tool-call') return [block.name, block.arguments];
    return [];
  }).join('\n');
  return events.flatMap(event => {
    let text = '';
    if (event.type === 'user/message') text = blockText(event.data.content);
    else if (['assistant/message', 'tool/result', 'developer/message', 'system/message'].includes(event.type)) text = blockText(event.data.message.content);
    else if (event.type === 'tool/call') text = `${event.data.name}\n${event.data.arguments}`;
    else if (event.type === 'assistant/attempt') text = (event.data.stream || []).flatMap(record => {
      if (record.type === 'text-chunks' || record.type === 'reasoning-chunks') return record.texts;
      if (record.type === 'chunk' && ['text-delta', 'reasoning-delta'].includes(record.chunk.type)) return [record.chunk.text];
      return [];
    }).join('');
    return text.trim() ? [{sessionId, seq: event.seq, time: event.time, type: event.type, text}] : [];
  });
}
