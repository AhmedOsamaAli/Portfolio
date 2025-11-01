import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// We'll export a function config so Vite passes mode, allowing reading env via loadEnv if needed later.
// For now keep base='/'; user can set BASE_PATH via manual edit if deploying to Pages under repo subpath.
export default defineConfig(({ mode }) => {
  // Placeholder: can extend to use loadEnv(mode, process.cwd()) when @types/node added.
  return {
    plugins: [react()],
    // If hosted at https://ahmedosamaali.github.io/Portfolio/ we need base set to '/Portfolio/'.
    base: '/Portfolio/',
    server: { port: 5173 }
  };
});
