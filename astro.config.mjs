import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://h1sort.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    // Decks mounted verbatim under public/ are not Astro pages, so list them here.
    sitemap({ customPages: ['https://h1sort.com/gbm-ai/'] }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
