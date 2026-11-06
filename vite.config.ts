import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import content from './src/portfolio/content.json';

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// We'll export a function config so Vite passes mode, allowing reading env via loadEnv if needed later.
// For now keep base='/'; user can set BASE_PATH via manual edit if deploying to Pages under repo subpath.
export default defineConfig(({ mode }) => {
  // Placeholder: can extend to use loadEnv(mode, process.cwd()) when @types/node added.
  return {
    plugins: [
      react(),
      {
        name: 'portfolio-content-metadata',
        transformIndexHtml: {
          order: 'pre',
          handler: (html: string) => {
            const values: Record<string, string> = {
              TITLE: `${content.profile.name} | Portfolio`,
              DESCRIPTION: content.profile.bio,
              OG_TITLE: `${content.profile.name} | ${content.profile.role}`,
              OG_DESCRIPTION: content.profile.headline
            };
            return html.replace(/%PORTFOLIO_(TITLE|DESCRIPTION|OG_TITLE|OG_DESCRIPTION)%/g,
              (_, key: string) => escapeHtml(values[key]));
          }
        }
      }
    ],
    // If hosted at https://ahmedosamaali.github.io/Portfolio/ we need base set to '/Portfolio/'.
    base: '/Portfolio/',
    server: { port: 5173 }
  };
});
