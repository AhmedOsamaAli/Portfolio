import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import { fileURLToPath } from 'node:url';
import { localEditorEndpoint, runSync } from './content-sync.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(await readFile(join(root, 'scripts', 'sync.config.json'), 'utf8'));
const endpoint = localEditorEndpoint(config.ai);
const cache = process.env.AI_CACHE_DIR ? resolve(process.env.AI_CACHE_DIR)
  : process.platform === 'win32' && process.env.LOCALAPPDATA
    ? join(process.env.LOCALAPPDATA, 'PortfolioAI', config.ai.modelSha256.slice(0, 12))
    : join(root, '.cache', 'portfolio-ai');
const runtime = config.ai.runtime[process.platform];
if (!runtime || process.arch !== 'x64') throw new Error('The pinned local editor supports Windows x64 and Linux x64.');

async function digest(path) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest('hex');
}

async function download(address, path, expectedHash, expectedBytes) {
  let existing;
  try { existing = await stat(path); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  if (existing && await digest(path) === expectedHash) return;
  if (existing) console.warn(`Replacing an invalid local AI cache file: ${path}.`);
  const response = await fetch(address, { signal: AbortSignal.timeout(1_200_000) });
  if (!response.ok || !response.body) throw new Error(`AI download returned HTTP ${response.status}.`);
  const hash = createHash('sha256');
  let bytes = 0;
  const temporary = `${path}.part`;
  try {
    await pipeline(response.body, new Transform({
      transform(chunk, encoding, callback) {
        bytes += chunk.length;
        hash.update(chunk);
        callback(null, chunk);
      },
    }), createWriteStream(temporary, { mode: 0o600 }));
    if (hash.digest('hex') !== expectedHash || expectedBytes && bytes !== expectedBytes) {
      throw new Error('AI download failed its pinned checksum or size check; nothing will be executed.');
    }
    await rename(temporary, path);
  } finally {
    await rm(temporary, { force: true });
  }
}

async function findServer(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isFile() && entry.name === (process.platform === 'win32' ? 'llama-server.exe' : 'llama-server')) return path;
    if (entry.isDirectory()) {
      const found = await findServer(path);
      if (found) return found;
    }
  }
}

await mkdir(cache, { recursive: true });
const archive = join(cache, process.platform === 'win32' ? 'runtime.zip' : 'runtime.tar.gz');
const model = join(cache, 'portfolio-editor.gguf');
await download(runtime.url, archive, runtime.sha256);
await download(config.ai.modelUrl, model, config.ai.modelSha256, config.ai.modelBytes);
const bin = join(cache, 'bin');
await mkdir(bin, { recursive: true });
const extraction = process.platform === 'win32'
  ? spawnSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
    `Expand-Archive -LiteralPath '${archive.replace(/'/g, "''")}' -DestinationPath '${bin.replace(/'/g, "''")}' -Force`], { stdio: 'inherit' })
  : spawnSync('tar', ['-xzf', archive, '-C', bin], { stdio: 'inherit' });
if (extraction.error) throw extraction.error;
if (extraction.status !== 0) throw new Error('The verified AI runtime archive could not be extracted.');
const server = await findServer(bin);
if (!server) throw new Error('The verified archive does not contain llama-server.');
await writeFile(join(cache, 'runtime.json'), JSON.stringify({ server, model }) + '\n');
console.log('Pinned CPU editor and model are ready. No resume content was downloaded or shared by setup.');

if (process.argv.includes('--run-sync')) {
  const child = spawn(server, [
    '-m', model, '--alias', config.ai.model, '--host', '127.0.0.1',
    '--port', endpoint.port, '-c', String(config.ai.contextSize), '-t', '4',
    '--parallel', '1', '--no-webui',
  ], { stdio: 'ignore' });
  let processError;
  child.on('error', (error) => { processError = error; });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 180; attempt++) {
      if (processError) throw processError;
      if (child.exitCode !== null) throw new Error(`The local editor exited with code ${child.exitCode}.`);
      try {
        const response = await fetch(new URL('/health', endpoint), { signal: AbortSignal.timeout(2000) });
        if (response.ok) { ready = true; break; }
      } catch (error) {
        if (!(error instanceof TypeError) && error.name !== 'TimeoutError') throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    if (!ready) throw new Error('The local editor was not responsive within three minutes.');
    const reportIndex = process.argv.indexOf('--report');
    await runSync({
      write: process.argv.includes('--write'),
      reportPath: reportIndex >= 0 ? process.argv[reportIndex + 1] : undefined,
    });
  } finally {
    child.kill();
  }
}
