import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://h1sort.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [
    // Decks mounted verbatim under public/ are not Astro pages, so list them here.
    sitemap({
      // AI Tank is a private judging tool (pages are noindex too).
      filter: (page) => !page.includes('/ai-tank/'),
      customPages: ['https://h1sort.com/gbm-ai/', 'https://h1sort.com/claude4aieng/', 'https://h1sort.com/datapub/', 'https://h1sort.com/cide/', 'https://h1sort.com/ai4data/', 'https://h1sort.com/ai4data/01/', 'https://h1sort.com/udlap/'],
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
