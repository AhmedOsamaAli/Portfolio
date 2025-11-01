# Ahmed Osama Portfolio

A modern, responsive portfolio built with React + Vite + TypeScript showcasing experience, internships, education, skills, achievements, and projects.

## Features

- Structured resume data in TypeScript
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

- `src/portfolio/data.ts` – Resume data definitions
- `src/portfolio/Portfolio.tsx` – Main portfolio component
- `src/portfolio/portfolio.css` – Component-specific styles
- `index.html` – Root HTML shell

## Updating Content

Edit `src/portfolio/data.ts` to update experience, internships, education, skills, achievements, or projects. Re-run build.

## Deployment

### 1. Production build

```pwsh
npm run build
```

Outputs static assets in `dist/`.

### 2. GitHub Pages (automatic)

Workflow file at `.github/workflows/deploy.yml` builds on pushes to `main` and publishes to Pages. Steps:

1. Push repo to GitHub.
2. In repo settings → Pages: choose "GitHub Actions" as source.
3. Merge/Push to `main`; workflow deploys.

If using a project page (e.g. `username.github.io/portfolio`), set a custom base path by editing `vite.config.ts` `base: '/portfolio/'` and rebuild. (Current config uses root `/`.)

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
