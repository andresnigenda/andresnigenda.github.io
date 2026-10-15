import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://andresnigenda.github.io/",
  output: "static",
  integrations: [sitemap()],
});
