/**
 * Remark plugin that rewrites relative Markdown links so they work in the
 * deployed Starlight site.
 *
 * Problem: Starlight serves each page at a path *without* the .md extension
 * and with a trailing slash, e.g.
 *   docs/src/content/docs/odyssey/2-motivation.md → /hoop/odyssey/2-motivation/
 *
 * A relative link like `1-inspiration.md#anchor` in that page would resolve to
 *   /hoop/odyssey/2-motivation/1-inspiration.md   ← broken
 *
 * This plugin rewrites any href that:
 *   - ends with `.md` (optionally followed by `#anchor`)
 *   - is not an absolute URL (http/https)
 *
 * …by stripping the `.md` extension and prepending `../` so it becomes a
 * sibling-page reference that Starlight resolves correctly:
 *   1-inspiration.md#anchor  →  ../1-inspiration/#anchor
 *
 * The source files are left unchanged, so GitHub's markdown preview continues
 * to resolve the `.md` links relative to the file location.
 */

import { visit } from "unist-util-visit";

/** @returns {import('unified').Plugin} */
export default function remarkRewriteMdLinks() {
  return (tree) => {
    visit(tree, "link", (node) => {
      const href = node.url;

      // Skip absolute URLs and anchor-only links
      if (/^https?:\/\//i.test(href) || href.startsWith("#")) return;

      // Match optional leading slash + path ending in .md + optional #anchor
      // e.g.  "1-inspiration.md#foo"  or  "/1-inspiration.md#foo"
      const match = href.match(/^(\/?)(.+?)\.md(#.*)?$/);
      if (!match) return;

      const [, leadingSlash, pathWithoutExt, anchor = ""] = match;

      if (leadingSlash) {
        // Absolute-style path like /1-inspiration.md  → keep as-is but strip .md
        node.url = `/${pathWithoutExt}/${anchor}`;
      } else {
        // Relative path like 1-inspiration.md  → ../1-inspiration/
        node.url = `../${pathWithoutExt}/${anchor}`;
      }
    });
  };
}
