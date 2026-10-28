// Standard Schema keeps this plugin dependency-free while validating Loader config.
const schema = {type: 'object', properties: {searchMode: {type: 'string', enum: ['live', 'submit'], default: 'live'}}, additionalProperties: false};
export function validateSettings(input) {
  const value = input === undefined ? {} : input;
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => key !== 'searchMode')) throw new Error('Expected settings with only searchMode');
  const searchMode = value.searchMode === undefined ? 'live' : value.searchMode;
  if (!['live', 'submit'].includes(searchMode)) throw new Error('searchMode must be live or submit');
  return {searchMode};
}
export const Config = {
  '~standard': {version: 1, vendor: 'dsh-session-search', validate(input) {
    try {return {value: validateSettings(input)};} catch (error) {return {issues: [{message: error.message}]};}
  }},
  '~standard-json-schema': {version: 1, vendor: 'dsh-session-search', input: () => schema, output: () => schema}
};
export function createSettingsOperation(ctx, config) {
  let entryId;
  const entry = () => {
    const entries = ctx.configEditor.entries();
    entryId ??= entries.find(item => item.fiber?.uid === ctx.fiber.uid)?.options.id;
    const found = entries.find(item => item.options.id === entryId && item.options.name === 'dsh-session-search');
    if (!found) throw new Error('Session Search configuration is unavailable');
    return found;
  };
  return async function settings(input) {
    if (input !== undefined) {
      const next = validateSettings(input);
      await ctx.configEditor.edit(entry(), current => ({...current, ...next}));
    }
    return validateSettings(entry().fiber?.config ?? config);
  };
}
export async function readSettingsBody(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > 1024) throw new Error('Settings body exceeds 1024 bytes');
    chunks.push(Buffer.from(chunk));
  }
  try {return validateSettings(JSON.parse(Buffer.concat(chunks).toString('utf8')));} catch (error) {throw new Error(`Invalid settings: ${error.message}`);}
}
