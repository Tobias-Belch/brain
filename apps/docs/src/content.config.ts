import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

const docsExtensions = ["markdown", "mdown", "mkdn", "mkd", "mdwn", "md", "mdx"];

export const collections = {
  docs: defineCollection({
    loader: glob({
      base: "src/content/docs",
      pattern: [
        `**/[^_]*.{${docsExtensions.join(",")}}`,
        `!**/node_modules/**`,
      ],
    }),
    schema: docsSchema(),
  }),
};
