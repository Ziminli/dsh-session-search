import assert from 'node:assert/strict';
import {readFile, stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root = new URL('../', import.meta.url);
const json = async path => JSON.parse(await readFile(new URL(path, root), 'utf8'));
const manifest = await json('package.json');
assert.equal(manifest.name, 'dsh-session-search');
assert.equal(manifest.version, '1.2.2');
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
assert.deepEqual(manifest.scripts, {check: 'node tools/check.mjs', test: 'node --test search.test.js fuzzy.test.js'});
assert.deepEqual(manifest.exports, {'.': './index.js', './client': './client.js', './locale/*.json': './locale/*.json', './icon': './icon.svg'});
assert.deepEqual(manifest.files, ['index.js', 'search.js', 'session-catalog.js', 'client.js', 'cordis.patch.yml', 'locale/en.json', 'locale/zh.json', 'icon.svg', 'README.md', 'README.zh-CN.md', 'LICENSE']);
assert.equal(manifest.dsh.bundle.patch, './cordis.patch.yml');
assert.deepEqual(manifest.dsh.client, {platform: 'web', immediately: true, inject: ['@deepseek-ai/dsh-client-ui-conversation']});
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
for (const path of ['index.js', 'search.js', 'session-catalog.js', 'client.js']) {
  const source = await readFile(new URL(path, root), 'utf8');
  assert.doesNotMatch(source, /(?:from|import)\s*['"][^'"]*-v1\.[0-9]+\.js['"]/);
}
for (const path of ['index.js', 'search.js', 'session-catalog.js', 'client.js', 'search.test.js', 'fuzzy.test.js', 'tools/check.mjs']) {
  const result = spawnSync(process.execPath, ['--check', fileURLToPath(new URL(path, root))], {stdio: 'inherit'});
  assert.equal(result.error, undefined, `${path}: ${result.error?.message}`);
  assert.equal(result.status, 0, `${path}: syntax check failed`);
}
console.log('Package metadata, publish allowlist, resources and JavaScript syntax checks passed.');
