import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import {
  addSkills, applyProjectProposal, applyResumeProposal, askLocalEditor, createHttpClient,
  createInitialState, hash, listReadyRepositories, readDriveResume, recordKey,
  reportMarkdown, skillsFromRepository, skillsFromResume, validateContent, verifyEvidence,
} from './content-sync.mjs';

const baseline = JSON.parse(await readFile(new URL('../src/portfolio/content.json', import.meta.url), 'utf8'));
function fixture() {
  const content = structuredClone(baseline);
  return { content, state: createInitialState(content), report: { changes: [], warnings: [] } };
}
const resumeChange = (value, quote = value) => ({
  changes: [{
    section: 'profile', key: 'profile', field: 'bio', value,
    evidence: [{ source: 'resume', quote }],
  }],
  warnings: [],
});

test('canonical content has the required typed shape', () => {
  assert.equal(validateContent(baseline), baseline);
  assert.throws(() => validateContent({ ...baseline, projects: [{ name: 'Incomplete' }] }), /Invalid portfolio/);
});

test('resume change updates only its proposed field', () => {
  const { content, state, report } = fixture();
  const before = structuredClone(content);
  const sentence = 'Builds accessible interfaces and reliable systems.';
  applyResumeProposal(content, state, resumeChange(sentence), sentence, report);
  assert.equal(content.profile.bio, sentence);
  assert.deepEqual(content.projects, before.projects);
  assert.equal(content.profile.headline, before.profile.headline);
  assert.equal(report.changes.length, 1);
});

test('identical proposals are idempotent', () => {
  const { content, state, report } = fixture();
  applyResumeProposal(content, state, {
    changes: [{
      section: 'profile', key: 'profile', field: 'bio', value: content.profile.bio,
      evidence: [{ source: 'portfolio', quote: content.profile.bio }],
    }], warnings: [],
  }, 'A valid resume', report);
  assert.equal(report.changes.length, 0);
});

test('manual edits win over a new source suggestion', () => {
  const { content, state, report } = fixture();
  content.profile.bio = 'My hand-edited introduction.';
  const sentence = 'Builds accessible interfaces and reliable systems.';
  applyResumeProposal(content, state, resumeChange(sentence), sentence, report);
  assert.equal(content.profile.bio, 'My hand-edited introduction.');
  assert.match(report.warnings[0], /manual edit/);
  assert.equal(report.changes.length, 0);
});

test('invented evidence and metrics are rejected', () => {
  assert.throws(() => verifyEvidence('Reduced latency by 90%.', [
    { source: 'resume', quote: 'Reduced latency by 20%.' },
  ], { resume: 'Reduced latency by 20%.' }), /unsupported number/);
  assert.throws(() => verifyEvidence('Built an interface.', [
    { source: 'resume', quote: 'Built an interface.' },
  ], { resume: 'Worked on backend systems.' }), /not present/);
});

test('identity edits do not break later changes or their ownership', () => {
  const { content, state, report } = fixture();
  const oldKey = recordKey('experiences', content.experiences[0]);
  applyResumeProposal(content, state, {
    changes: [
      { section: 'experiences', key: oldKey, field: 'role', value: 'Frontend Engineer', evidence: [{ source: 'resume', quote: 'Frontend Engineer' }] },
      { section: 'experiences', key: oldKey, field: 'location', value: 'Remote', evidence: [{ source: 'resume', quote: 'Remote' }] },
    ], warnings: [],
  }, 'Frontend Engineer, Remote', report);
  assert.equal(content.experiences[0].location, 'Remote');
  const newKey = recordKey('experiences', content.experiences[0]);
  assert.equal(state.managed[`experiences:${newKey}:role`], hash('Frontend Engineer'));
  assert.equal(state.managed[`experiences:${oldKey}:role`], undefined);
});

test('new resume records require complete facts and cannot add unselected projects', () => {
  const { content, state, report } = fixture();
  assert.throws(() => applyResumeProposal(content, state, {
    changes: [{
      section: 'projects', key: '', field: '$new',
      value: { title: 'Unselected project', description: 'Unselected project' },
      evidence: [{ source: 'resume', quote: 'Unselected project' }],
    }], warnings: [],
  }, 'Unselected project', report), /New resume records/);
  assert.throws(() => applyResumeProposal(content, state, {
    changes: [{
      section: 'experiences', key: '', field: '$new',
      value: { title: 'Example company', description: 'Example company' },
      evidence: [{ source: 'resume', quote: 'Example company' }],
    }], warnings: [],
  }, 'Example company', report), /Incomplete/);
});

test('skill detection respects word boundaries and never estimates proficiency', () => {
  const { content, state, report } = fixture();
  const names = skillsFromResume(content, 'Go, React.js, PostgreSQL, JavaScript, TypeScript');
  assert.ok(names.includes('Go'));
  assert.ok(!names.includes('Java'));
  const count = content.skills.frameworks.filter((item) => item.name === 'React').length;
  addSkills(content, state, names, report);
  assert.equal(content.skills.languages.find((item) => item.name === 'Go').level, undefined);
  assert.equal(content.skills.frameworks.filter((item) => item.name === 'React').length, count);
  assert.equal(content.skills.frameworks.find((item) => item.name === 'React').level,
    baseline.skills.frameworks.find((item) => item.name === 'React').level);
});

test('repository skills come from languages and dependencies, not arbitrary README claims', () => {
  const names = skillsFromRepository(baseline, ['Go', 'TypeScript'], {
    'web/package.json': '{"dependencies":{"react":"18","three":"0.183","@playwright/test":"1"}}',
  });
  assert.ok(names.includes('Go'));
  assert.ok(names.includes('React'));
  assert.ok(names.includes('Three.js'));
  assert.ok(!names.includes('AWS'));
  assert.throws(() => skillsFromRepository(baseline, [], { 'package.json': 'bad JSON' }), /Invalid dependency/);
});

test('unknown official GitHub languages remain usable without guessed proficiency', () => {
  const { content, state, report } = fixture();
  const names = skillsFromRepository(content, ['Elixir'], {});
  assert.deepEqual(names, ['Elixir']);
  addSkills(content, state, names, report, { Elixir: 'languages' });
  assert.equal(content.skills.languages.find((item) => item.name === 'Elixir').level, undefined);
});

test('explicit unfamiliar resume technologies can be added with literal evidence', () => {
  const { content, state, report } = fixture();
  applyResumeProposal(content, state, {
    changes: [], skills: [{ name: 'Elixir', group: 'languages', quote: 'Elixir' }], warnings: [],
  }, 'Languages: Elixir.', report);
  assert.equal(content.skills.languages.find((item) => item.name === 'Elixir').level, undefined);
  assert.throws(() => applyResumeProposal(content, state, {
    changes: [], skills: [{ name: 'Rust', group: 'languages', quote: 'Elixir' }], warnings: [],
  }, 'Languages: Elixir.', report), /explicitly listed/);
});

test('new projects use the verified repository URL and do not invent dates', () => {
  const { content, state, report } = fixture();
  const source = 'A Go service that processes background tasks.';
  applyProjectProposal(content, state, {
    name: 'Task service', bullets: [{ text: source, quote: source }], warnings: [],
  }, { name: 'task-service', html_url: 'https://github.com/example/task-service' },
  source, ['Go'], report);
  assert.equal(content.projects[0].url, 'https://github.com/example/task-service');
  assert.equal(content.projects[0].start, undefined);
  assert.equal(content.projects[0].end, undefined);
  assert.match(report.warnings[0], /dates were not inferred/);
});

test('a reviewed project update preserves hand-edited descriptions and source omissions', () => {
  const { content, state, report } = fixture();
  const current = content.projects[0];
  current.name = 'My curated project name';
  applyProjectProposal(content, state, {
    name: 'Source project', bullets: [{ text: 'A documented interface.', quote: 'A documented interface.' }],
    warnings: [],
  }, { name: 'source-project', html_url: current.url }, 'A documented interface.', ['React'], report);
  assert.equal(current.name, 'My curated project name');
  assert.equal(current.bullets.length, baseline.projects[0].bullets.length);
  assert.ok(report.warnings.some((entry) => entry.includes('omitted')));
});

test('manually removed projects and skills are not re-added', () => {
  const { content, state, report } = fixture();
  const removed = content.projects.shift();
  const source = 'A documented interface.';
  applyProjectProposal(content, state, {
    name: removed.name, bullets: [{ text: source, quote: source }], warnings: [],
  }, { name: 'removed', html_url: removed.url }, source, ['React'], report);
  assert.ok(!content.projects.some((item) => item.url === removed.url));
  content.skills.languages = content.skills.languages.filter((item) => item.name !== 'Python');
  addSkills(content, state, ['Python'], report);
  assert.ok(!content.skills.languages.some((item) => item.name === 'Python'));
});

test('GitHub discovery paginates and only includes explicitly selected public owner repositories', async () => {
  const base = { owner: { login: 'example' }, topics: [], private: false };
  const first = Array.from({ length: 100 }, (_, index) => ({
    ...base, name: `repo-${index}`, full_name: `example/repo-${index}`,
  }));
  const selected = { ...base, name: 'ready', full_name: 'example/ready', topics: ['portfolio-ready'] };
  let calls = 0;
  const http = async (address) => {
    calls++;
    return Buffer.from(JSON.stringify(address.endsWith('page=1') ? first : [
      selected, { ...selected, name: 'excluded' }, { ...selected, private: true },
      { ...selected, owner: { login: 'someone-else' } },
    ]));
  };
  const repos = await listReadyRepositories({
    owner: 'example', topic: 'portfolio-ready', exclude: ['excluded'],
  }, http, {});
  assert.deepEqual(repos.map((repo) => repo.name), ['ready']);
  assert.equal(calls, 2);
});

test('optional missing files differ from authentication and rate-limit failures', async () => {
  assert.equal(await createHttpClient(async () => new Response('', { status: 404 }))(
    'https://api.github.com/missing', { optional: true },
  ), null);
  await assert.rejects(() => createHttpClient(async () => new Response('', {
    status: 403, headers: { 'x-ratelimit-remaining': '0' },
  }))('https://api.github.com/repos'), /rate limit reached/);
  await assert.rejects(() => createHttpClient(async () => new Response('', { status: 401 }))(
    'https://api.github.com/repos', { optional: true },
  ), /HTTP 401/);
});

test('long local requests use the bounded inference transport and close it', async () => {
  const server = createServer((incoming, response) => {
    setTimeout(() => {
      response.setHeader('Content-Type', 'application/json');
      response.end('{"ok":true}');
    }, 30);
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const bytes = await createHttpClient()(`http://127.0.0.1:${server.address().port}/generate`, {
      timeout: 1200000, method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
    });
    assert.deepEqual(JSON.parse(bytes.toString()), { ok: true });
  } finally {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
});

test('the AI client cannot send resume content to a cloud endpoint', async () => {
  await assert.rejects(() => askLocalEditor({
    endpoint: 'https://third-party.example/chat', model: 'editor',
  }, {}, 'Private resume', async () => { assert.fail('No network call is allowed.'); }), /must be local/);
});

test('the AI client requests schema-constrained local output and rejects truncation', async () => {
  const http = async (address, options) => {
    assert.equal(address, 'http://127.0.0.1:8087/v1/chat/completions');
    const request = JSON.parse(options.body);
    assert.equal(request.response_format.type, 'json_schema');
    assert.equal(request.response_format.json_schema.name, 'portfolio_update');
    assert.equal(request.response_format.json_schema.strict, true);
    assert.deepEqual(request.response_format.json_schema.schema, {});
    assert.equal(request.temperature, 0);
    return Buffer.from(JSON.stringify({
      choices: [{ finish_reason: 'length', message: { content: '{"changes":[]}' } }],
    }));
  };
  await assert.rejects(() => askLocalEditor({
    endpoint: 'http://127.0.0.1:8087/v1/chat/completions', model: 'editor',
  }, {}, 'Facts', http), /complete proposal/);
});

test('private Drive access fails explicitly without credentials', async () => {
  await assert.rejects(() => readDriveResume({
    fileId: 'example-file-id', format: 'pdf', access: 'private',
  }, async () => { assert.fail('Do not fetch without credentials.'); }, ''), /requires GOOGLE_SERVICE_ACCOUNT_JSON/);
});

test('malformed private credentials are rejected without exposing their contents', async () => {
  const secret = 'SECRET-THAT-MUST-NOT-APPEAR';
  await assert.rejects(() => readDriveResume({
    fileId: 'example-file-id', format: 'pdf', access: 'private',
  }, async () => { assert.fail('No request is allowed.'); }, secret), (error) => {
    assert.match(error.message, /not valid JSON/);
    assert.ok(!error.message.includes(secret));
    return true;
  });
});

test('public Drive sharing pages cannot masquerade as a successfully parsed PDF', async (context) => {
  context.mock.method(globalThis, 'fetch', async () => {
    const response = new Response('<!doctype html><html>Sign in</html>');
    Object.defineProperty(response, 'url', { value: 'https://drive.usercontent.google.com/download' });
    return response;
  });
  await assert.rejects(() => readDriveResume({
    fileId: 'example-file-id', format: 'pdf', access: 'public',
  }, createHttpClient()), /did not return a PDF/);
});

test('Google Doc exports are read as text and changes alter the fingerprint', async (context) => {
  let revision = 'First';
  context.mock.method(globalThis, 'fetch', async (address) => {
    assert.match(address, /^https:\/\/docs.google.com\/document\/d\/example-file-id\/export\?format=txt$/);
    const response = new Response(`${revision} resume version. Builds accessible software and reliable interfaces. This is synthetic test content.`);
    Object.defineProperty(response, 'url', { value: address });
    return response;
  });
  const config = { fileId: 'example-file-id', format: 'google-doc', access: 'public' };
  const first = await readDriveResume(config, createHttpClient());
  revision = 'Second';
  const second = await readDriveResume(config, createHttpClient());
  assert.ok(first.text.startsWith('First'));
  assert.notEqual(first.hash, second.hash);
});

test('review reports never include raw resume quotes or secret data', () => {
  const report = reportMarkdown({
    changes: ['Updated profile / bio.'], warnings: ['Preserved a manual edit: profile / bio.'],
  }, true);
  assert.match(report, /Dry run only/);
  assert.match(report, /No raw resume/);
  assert.ok(!report.includes('Private resume'));
});

test('the sync workflow only pushes proposal branches and never merges or dispatches deployment', async () => {
  const workflow = await readFile(new URL('../.github/workflows/sync-content.yml', import.meta.url), 'utf8');
  assert.match(workflow, /automation\/portfolio-content-\$GITHUB_RUN_ID/);
  assert.match(workflow, /gh pr create/);
  assert.match(workflow, /persist-credentials: false/);
  assert.ok(!workflow.includes('gh pr merge'));
  assert.ok(!workflow.includes('deploy-pages'));
  assert.ok(!/git push[^\n]*HEAD:master/.test(workflow));
  assert.match(workflow, /Waiting for the existing content proposal/);
});
