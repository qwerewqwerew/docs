// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import vercel from "@astrojs/vercel";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  output: 'server',

  integrations: [
    starlight({
      title: "코알라코딩",
      customCss: ["./src/styles/custom.css", "./src/styles/global.css"],
      social: [{ icon: "github", label: "GitHub", href: "https://coalacoding.com" }],
    }),
  ],

  adapter: vercel(),

  vite: {
    plugins: [tailwindcss()],
  },
});
