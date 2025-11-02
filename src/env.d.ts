/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string; // Provided by Vite
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
