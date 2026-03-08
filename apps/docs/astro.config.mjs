// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import starlightThemeSix from "@six-tech/starlight-theme-six";
import mermaid from "astro-mermaid";
import remarkRewriteMdLinks from "./remark-rewrite-md-links.mjs";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

config({ path: resolve(process.cwd(), "../../.env") });

const isProd = process.env.NODE_ENV === "production";
const tailscaleHostname = process.env.TAILSCALE_HOSTNAME;
const docsPort = parseInt(process.env.DOCS_PORT ?? "4001");

// https://astro.build/config
export default defineConfig({
  base: isProd ? "/brain" : undefined,
  server: {
    port: docsPort,
    allowedHosts: tailscaleHostname ? [tailscaleHostname] : [],
  },
  vite: {
    resolve: {
      alias: [
        // Local source aliases (non-npm)
        { find: "@charts", replacement: resolve(__dirname, "src/charts") },
        { find: "@components", replacement: resolve(__dirname, "src/components") },
        { find: "@pocs", replacement: resolve(__dirname, "src/pocs") },
        { find: "@types", replacement: resolve(__dirname, "src/types") },
        { find: "@utils", replacement: resolve(__dirname, "src/utils") },
        // @jscad/* — only redirect the local files; npm packages like
        // @jscad/modeling and @jscad/stl-serializer must NOT be aliased.
        { find: /^@jscad\/(types|downloadModel|jscadToThree|components)(\/.*)?$/, replacement: resolve(__dirname, "src/@jscad/$1$2") },
      ],
      preserveSymlinks: true,
    },
    server: {
      fs: {
        allow: [__dirname, resolve(__dirname, "../../docs")],
      },
    },
  },
  markdown: {
    remarkPlugins: [remarkRewriteMdLinks],
  },
  integrations: [
    react(),
    mermaid({ autoTheme: true }),
    starlight({
      plugins: [starlightThemeSix({})],
      title: "@Tobias-belch/brain",
      favicon: "/icons/icon-16x16.svg",
      logo: {
        dark: "./src/assets/logo-dark.svg",
        light: "./src/assets/logo-light.svg",
      },
      customCss: ["./src/styles/theme.css"],
      head: [
        { tag: "link", attrs: { rel: "manifest", href: "/site.webmanifest" } },
        { tag: "meta", attrs: { name: "theme-color", content: "#26c6da" } },
        {
          tag: "link",
          attrs: {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/icons/icon-180x180.svg",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/svg+xml",
            sizes: "32x32",
            href: "/icons/icon-32x32.svg",
          },
        },
        {
          tag: "link",
          attrs: {
            rel: "icon",
            type: "image/svg+xml",
            sizes: "16x16",
            href: "/icons/icon-16x16.svg",
          },
        },
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/Tobias-Belch/brain",
        },
      ],
    }),
  ],
});
