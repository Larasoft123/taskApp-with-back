// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import auth from 'auth-astro';

import node from '@astrojs/node';


import preact from '@astrojs/preact';


// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [auth(), preact()],

  adapter: node({
    mode: 'standalone'
  })
});