import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.james-kendall.co.uk',
  integrations: [sitemap()],
  image: {
    // Local image optimisation via sharp. Responsive AVIF/WebP generated at build.
  },
  build: {
    inlineStylesheets: 'auto',
  },
  // Same sandbox constraint as VITE_CACHE_DIR below: unset locally, no effect.
  ...(process.env.ASTRO_OUT_DIR ? { outDir: process.env.ASTRO_OUT_DIR } : {}),
  vite: {
    // Claude's sandbox cannot delete cache files created by earlier sessions.
    // VITE_CACHE_DIR relocates the cache there; unset locally, so no effect
    // on builds run on James's machine.
    ...(process.env.VITE_CACHE_DIR ? { cacheDir: process.env.VITE_CACHE_DIR } : {}),
  },
});
