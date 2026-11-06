# Ahmed Osama Portfolio

A modern, responsive portfolio built with React + Vite + TypeScript showcasing experience, internships, education, skills, achievements, and projects.

## Features

- Structured resume content in JSON with shared TypeScript types
- Responsive layout and light/dark theme toggle (light default)
- Baby blue hero gradient with subtle animated blob background
- Floating, animated programming icons (reduced when prefers-reduced-motion)
- Projects & achievements with external links
- Accessible semantics & color contrast (WCAG AA target)
- Favicon with gradient AO code motif

## Development

```pwsh
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build production bundle
npm run build

# Preview build
npm run preview
```

## Structure

- `src/portfolio/content.json` – Profile, experience, skills, achievements, and projects
- `src/portfolio/data.ts` – Typed content exports
- `src/portfolio/Portfolio.tsx` – Main portfolio component
- `src/portfolio/portfolio.css` – Component-specific styles
- `index.html` – Root HTML shell

## Updating Content

Edit [`src/portfolio/content.json`](./src/portfolio/content.json) to update content. The original UI, colors, layout, portrait, and animations are unchanged. Profile content also updates the existing hero, contact links, and search/share metadata.

New skills are marked **Listed** rather than assigned an invented proficiency level. Project dates are omitted when the source does not provide them. Existing manually entered ratings and older projects are preserved.

## Review-first content updates

[`scripts/sync.config.json`](./scripts/sync.config.json) selects the GitHub owner and Drive document. The supplied Drive document is a **text-based PDF**. Replace that same file through Drive's **Manage versions** to preserve its ID; a new upload needs a new ID. Native Google Docs are supported using `"format": "google-doc"`.

The workflow checks sources daily at 06:20 UTC or through **Actions → Propose portfolio updates → Run workflow**. Only public repositories with the `portfolio-ready` topic are automatically selected. GitHub activity alone is not treated as proof of completion.

1. Read the selected resume and project documentation.
2. Draft factual content updates using a pinned local CPU model inside the Actions runner.
3. Validate output, preserve later manual edits, and run tests, type-check, and build.
4. Open a pull request for review. An existing open proposal pauses new proposals.

Unchanged sources skip model downloads and proposal creation. Raw resume text and quoted evidence stay in memory; only portfolio fields and source fingerprints are committed. The model is not a cloud AI API. Missing quotes, unsupported numbers, and invalid content fail explicitly.

**Impact:** local checks and proposal branches do not change the live site. **Merging into `master` triggers the existing production deployment.** The updater never approves or merges pull requests.

### Setup and local checks

Use Node.js 22.19 or newer. Under repository **Settings → Actions → General**, allow GitHub Actions to create pull requests while leaving the default token permission read-only. The updater declares only its required write permissions.

```pwsh
# Read-only source inspection
npm run sync:inspect

# Tests, type-check, and build; local only
npm run ci

# Download the pinned CPU runtime and ~2.1 GB model
npm run ai:setup

# Local AI dry run: generates an ignored review report, without changing content
node scripts/setup-local-ai.mjs --run-sync

# Explicitly write draft content locally; this still does not deploy
node scripts/setup-local-ai.mjs --run-sync --write
```

Windows model caches are stored outside OneDrive under `%LOCALAPPDATA%\PortfolioAI`. Dry-run reports go to `.cache/portfolio-sync-review.md`, or a path supplied with `--report`.

For a private Drive document, set `"access": "private"`, share only that file with a Google service account as Viewer, and store its credentials in the GitHub secret `GOOGLE_SERVICE_ACCOUNT_JSON`. Never commit credentials. The service account uses Drive read-only access.

**Privacy:** this repository is public, so proposed portfolio fields are public in a PR before merging. Do not feed confidential material into a public-repository workflow. Use a private repository or local-only drafting for confidential resumes.

GitHub does not launch new workflows for PRs created with `GITHUB_TOKEN`. The updater runs CI before pushing and attaches a **Portfolio validation** status linking to that successful run.

## Deployment

### 1. Production build

```pwsh
npm run build
```

Outputs static assets in `dist/`.

### 2. GitHub Pages (automatic)

Workflow file at `.github/workflows/deploy.yml` builds on pushes to `master` and publishes to production Pages. Steps:

1. Push repo to GitHub.
2. In repo settings → Pages: choose "GitHub Actions" as source.
3. Merge/Push to `master`; workflow deploys.

The configured base is `/Portfolio/`, matching the existing GitHub Pages URL.

### 3. Vercel

Import the repository in Vercel dashboard. Build command: `npm run build`; Output: `dist`. Framework preset: Vite.

### 4. Netlify

Drag-drop `dist/` folder or connect repo.
Build command: `npm run build`
Publish directory: `dist`

### 5. Azure Static Web Apps

Create a Static Web App pointing to your GitHub repo:

- App location: `/` (root)
- Build command: `npm run build`
- Output location: `dist`

### 6. Manual hosting

Upload contents of `dist/` to any static server (Nginx, Apache, S3 + CloudFront, etc.). Ensure fallback to `index.html` for client routing (not needed here since no SPA routes).

## Next Enhancements (optional)

- Add blog / writing section
- Add Open Graph image / social preview card
- Performance budget & Lighthouse CI
- Add PWA manifest + icons & offline caching
- Parallax or subtle mouse-reactive hero layer (respect reduced motion)

## License

Content © Ahmed Osama. Code MIT.
