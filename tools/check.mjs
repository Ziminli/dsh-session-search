import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = new URL('../', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const manifest = await json('package.json');
assert.equal(manifest.name, 'dsh-session-search');
assert.match(manifest.version, /^\d+\.\d+\.\d+$/);
const changelog = await readFile(new URL('CHANGELOG.md', root), 'utf8');
const headings = [...changelog.matchAll(/^## \[?(\d+\.\d+\.\d+)\]?(?:\s|$)/gm)].map(match => match[1]);
assert.equal(headings[0], manifest.version, 'Newest CHANGELOG.md entry must match package version');
assert.equal(new Set(headings).size, headings.length, 'Changelog versions must be unique');
for (const path of ['README.md', 'README.zh-CN.md']) {
  const readme = await readFile(new URL(path, root), 'utf8');
  assert.ok(readme.includes(manifest.version), `${path} must mention the current version`);
  assert.ok(readme.includes('CHANGELOG.md'), `${path} must link the changelog`);
}
assert.equal(manifest.type, 'module');
assert.equal(manifest.license, 'MIT');
assert.equal(manifest.author, 'Zimin Li');
assert.equal(manifest.engines.node, '>=22');
assert.equal(manifest.engines.dsh, undefined, 'Declare DSH compatibility only after verification');
assert.equal(manifest.private, undefined);
assert.ok(manifest.keywords.includes('dsh-plugin'));
assert.equal(manifest.repository.url, 'git+https://github.com/Ziminli/dsh-session-search.git');
for (const key of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
  assert.ok(!manifest[key] || Object.keys(manifest[key]).length === 0, `${key} must be empty`);
}
assert.deepEqual(manifest.scripts, {check: 'node tools/check.mjs', test: 'node --test search.test.js fuzzy.test.js filters.test.js settings.test.js client-logic.test.js highlight.test.js'});
assert.deepEqual(manifest.exports, {'.': './index.js', './client': './client.js', './locale/*.json': './locale/*.json', './icon': './icon.svg'});
assert.deepEqual(manifest.files, ['index.js', 'settings.js', 'search.js', 'session-catalog.js', 'client.js', 'cordis.patch.yml', 'locale/en.json', 'locale/zh.json', 'icon.svg', 'README.md', 'README.zh-CN.md', 'CHANGELOG.md', 'docs/community-listing.yml', 'LICENSE']);
assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml');
assert.deepEqual(manifest.dsh.client, {platform: 'web', immediately: true, inject: ['@deepseek-ai/dsh-client-ui-conversation', '@deepseek-ai/dsh-client-ui-plugin-manager']});
for (const path of manifest.files) assert.ok((await stat(new URL(path, root))).isFile(), `${path} must exist`);
for (const language of ['en', 'zh']) {
  const {meta} = await json(`locale/${language}.json`);
  assert.ok(meta.title.trim()); assert.ok(meta.description.trim());
}
const icon = await readFile(new URL('icon.svg', root), 'utf8');
assert.match(icon, /<svg\s/); assert.match(icon, /xmlns="http:\/\/www.w3.org\/2000\/svg"/);
assert.ok(Buffer.byteLength(icon) <= 256 * 1024);
assert.match(await readFile(new URL('LICENSE', root), 'utf8'), /Copyright \(c\) 2026 Zimin Li/);
assert.equal((await readFile(new URL('cordis.patch.yml', root), 'utf8')).trim(), '- insert:\n    - id: local-session-search\n      name: dsh-session-search');
const client = await readFile(new URL('client.js', root), 'utf8');
assert.match(client, /id: 'dsh-session-search'/);
assert.doesNotMatch(client, /@local\//);
// Never change the native main key or redeclare its already-owned shell.
assert.doesNotMatch(client, /key: 'conversation'|children:\s*\{'main\.conversation'/);
assert.doesNotMatch(client, /HIGHLIGHT_PANEL|selectPanel\('conversation'\)/);
assert.match(client, /name: 'main\.conversation', priority: -10/);
assert.match(client, /ctx\.layout\.selectPanel\(null\)/);
assert.match(client, /session-search\.highlight\.body/);
assert.match(client, /h\(SessionProvider, \{session: opened\.reference\}/);
assert.match(client, /reference\?\.release\(\)/);
// Sort must remain a theme-token segmented button group, not a native white popup.
assert.doesNotMatch(client, /id: 'dss-order'/);
assert.match(client, /className: 'dss-views dss-sort', role: 'group', 'aria-label': t\('sort'\)/);
assert.match(client, /'aria-pressed': order === value/);
assert.match(client, /stored\.order = value; setOrder\(value\)/);
assert.match(client, /\.dss-page select option\{background:var\(--dsw-alias-bg-base\);color:var\(--dsw-alias-label-primary\)\}/);
for (const path of ['index.js', 'search.js', 'session-catalog.js', 'client.js']) {
  const source = await readFile(new URL(path, root), 'utf8');
  assert.doesNotMatch(source, /(?:from|import)\s*['"][^'"]*-v1\.[0-9]+\.js['"]/);
}
for (const path of ['index.js', 'settings.js', 'search.js', 'session-catalog.js', 'client.js', 'search.test.js', 'fuzzy.test.js', 'filters.test.js', 'settings.test.js', 'client-logic.test.js', 'highlight.test.js', 'tools/check.mjs']) {
  const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(path, root))], {stdio: 'inherit'});
  assert.equal(result.error, undefined, `${path}: ${result.error?.message}`);
  assert.equal(result.status, 0, `${path}: syntax check failed`);
}
console.log('Package metadata, publish allowlist, resources and JavaScript syntax checks passed.');
