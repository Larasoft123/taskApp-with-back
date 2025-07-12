// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import auth from "auth-astro";

import node from "@astrojs/node";

import preact from "@astrojs/preact";

// https://astro.build/config
export default defineConfig({
  output: "server",
  vite: {
    ssr: {
      noExternal: ["react-hook-form"],
    },
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat", // Must be below test-utils
        "react/jsx-runtime": "preact/jsx-runtime",
      },
    },
  },

  integrations: [auth(), preact({ compat: true, include: ["**/preact/*"] })],

  adapter: node({
    mode: "standalone",
  }),
});
