---
title: Obsidian MDX Sources
---

# Source Inventory

| ID | Source | Type | Date | Quality | Contribution | Limitations |
|---|---|---|---|---|---|---|
| S1 | Local `package.json`, `docs/fea-docs.config.mjs`, `docs/tools/docs-app.md` | local | 2026-06-02 | high | Establishes repo baseline: `fea-docs`, Starlight, MD/MDX, React aliases, strict build, ignore concept | Local design note, not external product docs |
| S2 | Obsidian accepted file formats | docs | 2026-06-02 fetch | high | Shows core Obsidian supports `.md`, not `.mdx`, and can be extended by plugins | Does not discuss MDX directly |
| S3 | Obsidian links, embeds, search, callouts, properties docs | docs | 2026-06-02 fetch | high | Defines the advanced Obsidian features relevant to publishing compatibility | Does not test third-party generators |
| S4 | Obsidian Publish docs and limitations | docs | 2026-06-02 fetch | high | Shows first-party publishing is paid, selective, and still limited | Paid service, not target stack |
| S5 | MDX and Astro MDX docs | docs | 2026-06-02 fetch | high | Defines MDX syntax and Astro MDX capabilities/strictness | Does not cover Obsidian syntax |
| S6 | Astro Starlight docs and Context7 `/withastro/starlight` | docs | 2026-06-02 fetch | high | Confirms Starlight MD/MDX, search, frontmatter, draft, sidebar, components, remark/rehype extension | No native Obsidian compatibility claim |
| S7 | Astro GitHub Pages deployment docs | docs | 2026-06-02 fetch | high | Confirms static Astro sites can deploy to GitHub Pages via Actions | Does not cover `fea-docs` specifically |
| S8 | Quartz docs | repo/docs | 2026-06-02 fetch | medium-high | Shows strong free Obsidian static publishing and private-page patterns | Not Starlight/MDX-first |
| S9 | Digital Garden, Flowershow, Enveloppe, Obsidian Publish MkDocs | repo/docs | 2026-06-02 fetch | medium | Surveys free Obsidian publishing options and selective publishing | Feature lists, varied hosting/stacks, not MDX-first |
| S10 | `mdx as md`, Custom File Extensions, Obsidian plugin registry | repo/docs | 2026-06-02 fetch | medium | Establishes `.mdx` can be edited as Markdown in Obsidian via plugins | Does not guarantee full MDX rendering/compilation |
| S11 | Obsidian React Components plugin | repo/docs | 2026-06-02 fetch | medium | Shows React-like rendering is possible in Obsidian but via plugin syntax | Not MDX syntax or deployment-compatible by default |
| S12 | `obsidian-export` README | repo/docs | 2026-06-02 fetch | medium-high | Shows conversion/export of Obsidian Markdown to CommonMark with ignore support | Not a docs app; no MDX claim |
| S13 | `remark-wiki-link` README | repo/docs | 2026-06-02 fetch | medium | Shows remark-based wikilink handling is feasible in Astro/Starlight pipeline | Needs Obsidian-specific behavior/customization |
