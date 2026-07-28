import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://cigar-site.vercel.app',
  output: 'hybrid',
  adapter: vercel(),
});
