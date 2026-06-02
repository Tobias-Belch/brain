---
title: Obsidian MDX Publishing Report
---

# Obsidian, MDX, and Starlight Publishing

## Executive Summary

The strongest path is not to make Obsidian the publishing platform. It is to keep `fea-docs` / Astro Starlight as the publishing platform and optionally use Obsidian as a local authoring UI for a carefully constrained subset of syntax.

Direct answers:

1. **MDX in an Obsidian vault is possible, but only as a local editing compromise.** Obsidian core recognizes Markdown as `.md`, not `.mdx`, but community plugins such as `mdx as md` or generic extension mapping can make `.mdx` files editable as Markdown. This does not make Obsidian an MDX compiler or reliable MDX previewer. S2, S10.
2. **A free, GitHub Pages, Obsidian-vault-to-interactive-docs-MPA workflow that also supports MDX and preserves Obsidian advanced capabilities is not available as a turnkey safe path.** Existing free Obsidian publishers cover Obsidian Markdown well, but are generally not MDX/Starlight-first. Astro/Starlight handles MDX and GitHub Pages well, but does not natively understand all Obsidian syntax. S5, S6, S7, S8, S9.
3. **Private files can be excluded from generated output, but that is not the same as privacy if the source repository is public.** Publish filters, draft flags, explicit publish flags, ignore patterns, and `.gitignore`-style exclusion all exist. If private files are committed to a public repo, they are still public even if the generated site ignores them. S4, S6, S8, S9, S12.
4. **A Starlight/`fea-docs` setup can get close to the Obsidian experience, but the key work is building an Obsidian-flavored preprocessing and relationship layer.** The feasible feature set is wikilinks, backlinks, graph data, transclusion, callout conversion, search, public/private filtering, asset handling, strict link validation, and MDX component support. S1, S3, S6, S13.

## Research Question and Scope

The user wants to know whether Obsidian can again serve as the document management layer while still supporting free static deployment, GitHub Pages, public/private filtering, full-text search, Obsidian-style extras, and MDX/React components. The local repository requirement is that `fea-docs`, already documented as a Starlight-based CLI, should be treated as the docs-app basis. S1.

## Methodology

Sources included official Obsidian docs, official Astro/Starlight/MDX docs, local repo files, and representative open-source Obsidian publishing tools. I weighted official docs highest for platform capabilities, and open-source READMEs as medium-quality evidence for available workflows.

## Key Findings

### 1. MDX Inside Obsidian

Obsidian core is Markdown-first. Its accepted file formats list Markdown as `.md` and does not list `.mdx`; it says support for other file formats can be extended through community plugins. S2.

There are community paths:

- `mdx as md` says it allows editing `.mdx` files as if they were Markdown. S10.
- Generic custom extension mapping can associate arbitrary extensions with Obsidian views, including the Markdown view. S10.
- Obsidian React Components can render JSX-like snippets in notes, but through code-block and inline plugin syntax, not standard MDX. S11.

This means MDX can live in a vault and be edited, but the workflow is brittle if you expect Obsidian to behave like an MDX IDE. MDX supports JSX, ESM imports/exports, and JavaScript expressions, and it is less forgiving than Markdown. S5. Obsidian's link parser, backlinks, and preview behavior are not equivalent to Astro's MDX compiler.

### 2. Publishing an Obsidian Vault with MDX and Obsidian Extras for Free

There are good free Obsidian publishing options, but they solve a different problem:

- Quartz is explicitly Obsidian-compatible and supports wikilinks, frontmatter, link crawling, Mermaid, filters, explicit publish, and ignore patterns. S8.
- Digital Garden supports selective publishing, backlinks, local/global graph, filetree, search, transclusions, callouts, Dataview, Mermaid, and other Obsidian-style features. S9.
- Flowershow, Enveloppe, and MkDocs templates publish Obsidian notes and support various conversions, excludes, GitHub publishing, or custom templates. S9.
- `obsidian-export` can convert Obsidian Markdown toward CommonMark with ignore handling. S12.

But none of these is the same as a `fea-docs`/Starlight-based MDX docs MPA. MkDocs is not MDX-first. Quartz and Digital Garden are Obsidian/digital-garden oriented rather than Astro Starlight oriented. Enveloppe can publish into arbitrary templates, but that still leaves MDX/Starlight compatibility as custom integration work. S8, S9.

Obsidian Publish itself is paid and still limited: plugin-rendered blocks such as Dataview do not work by default, graph support is reduced, search is basic, and embedded search results are unsupported. S4. That is important because it shows even the first-party publisher does not perfectly reproduce all in-app Obsidian capabilities.

Conclusion: a fully free, turnkey, non-fragile, Obsidian-vault-with-MDX-to-GitHub-Pages-docs-MPA path is **not currently supported by the evidence**. A constrained custom pipeline is possible.

### 3. Public/Private Filtering

Build output filtering is feasible:

- Obsidian Publish has `publish: true`, `publish: false`, included folders, and excluded folders. S4.
- Starlight has `draft: true` to exclude pages from production builds and `pagefind: false` to exclude pages from search. S6.
- Quartz has `RemoveDrafts`, `ExplicitPublish`, and `ignorePatterns`. S8.
- Digital Garden publishes only notes with `dg-publish: true`. S9.
- Flowershow has exclude patterns. S9.
- `obsidian-export` supports `.export-ignore`, Git ignores, skipped tags, and only-tags. S12.
- Local `fea-docs` design already includes `.gitignore`, default ignores, and optional user ignore config. S1.

The important distinction is **generated-site privacy vs source privacy**. If private files are in a public GitHub repository, they are public even if the docs build excludes them. Quartz explicitly warns about this. S8. For real privacy, use one of these patterns:

- Keep the source repository private and publish only generated output.
- Keep private files uncommitted or in a separate private repository/vault.
- Use explicit `publish: true` allowlists for public output rather than blocklists.
- Ensure attachments and non-Markdown assets follow the same public/private rules as notes.

### 4. Starlight/`fea-docs` Approximation of Obsidian

Starlight already covers the deployment and MDX side very well:

- Markdown and MDX pages are supported with no configuration. S6.
- MDX can import Astro and framework components, including React through Astro integrations. S5, S6.
- Static GitHub Pages deployment is officially supported for Astro. S7.
- Pagefind full-text search is built in. S6.
- Frontmatter supports titles, drafts, sidebar metadata, slug overrides, and search exclusion. S6.
- Remark/rehype plugins can extend Markdown/MDX processing. S6.

The missing Obsidian-like layer is build-time content intelligence. The key features to implement in or around `fea-docs` are:

| Feature | Needed Behavior | Feasibility |
|---|---|---|
| Wikilinks | Convert `[[Note]]`, `[[Note#Heading]]`, `[[Note\|Alias]]` to routed links | High with custom remark plugin; generic plugins exist but need Obsidian syntax tuning. S13 |
| Embeds/transclusion | Convert `![[Note]]`, `![[Note#Heading]]`, `![[Note#^block]]`, and asset embeds to rendered content | Medium; headings/assets are easier than block references |
| Block references | Preserve `^block-id` targets and links | Medium-low; Obsidian-specific and explicitly non-standard. S3 |
| Callouts | Convert `> [!info]`, foldable callouts, nested callouts to Starlight asides or custom components | High for common callouts; medium for foldable/nested parity. S3, S6 |
| Backlinks | Build graph from parsed links and render backlinks per page | High at build time |
| Graph view | Emit graph JSON and render client-side graph component | Medium; needs UI work but no server required |
| Search | Use Starlight Pagefind; optionally exclude private/search-hidden pages | High. S6 |
| Private/public filtering | Prefer allowlist frontmatter such as `publish: true` plus ignore patterns | High; local `fea-docs` already points this way. S1 |
| Asset privacy | Include only assets reachable from public pages or explicitly public folders | Medium; must avoid Quartz-like non-Markdown leakage. S8 |
| Strict validation | Fail CI on unresolved links/assets/MDX imports/private leaks | High; local concept already includes strict mode. S1 |
| Obsidian authoring UX | Allow opening docs folder as vault, use Markdown links where possible, optionally install `.mdx` Markdown-view plugin | Medium; local UX good, preview fidelity limited |

## Recommendation

Use `fea-docs` / Starlight as the source of deployment truth. Treat Obsidian as an optional editor over the docs folder, not as the semantic source of truth for publishing.

Recommended direction:

1. **Keep `.mdx` files as real `.mdx` files** for Astro/Starlight correctness.
2. **Use standard Markdown links where possible** because Obsidian can generate Markdown links and they are more portable. S3.
3. **Support a constrained Obsidian-flavored subset** in `fea-docs`: wikilinks, aliases, heading links, callouts, simple note embeds, image embeds, and backlinks.
4. **Do not promise full Obsidian plugin parity**, especially Dataview, arbitrary plugin codeblocks, embedded search, and live app graph behavior. S4.
5. **Use explicit public allowlisting** for deployment, e.g. `publish: true` or a public root, plus strict checking that private pages and private assets are not emitted.
6. **Keep private content source-private too** if the repository is public or might become public.

## Practical Architecture for This Repo

A plausible `fea-docs`-compatible design:

1. Discovery scans `.md` and `.mdx` from `docs/` using `.gitignore`, default ignores, and config ignores. S1.
2. Public filter selects only `publish: true` or non-draft files depending on mode.
3. Parser builds a content graph of paths, titles, aliases, headings, block IDs, links, embeds, tags, and assets.
4. Markdown/MDX pipeline applies remark plugins for Obsidian syntax before Starlight rendering.
5. Route resolver converts Obsidian-ish references to Starlight URLs.
6. Backlink and graph data are emitted as static JSON.
7. Pagefind indexes only public pages.
8. Strict build fails on unresolved public links, private link leaks, unresolved embeds, missing titles, and MDX import errors.

## Conflicts and Open Questions

- **MDX vs Obsidian Markdown are not the same language.** MDX's JSX/ESM syntax and Obsidian's wikilink/embed/block syntax both require parser support. S3, S5.
- **Obsidian authoring preview will not match deployed MDX exactly.** Plugins can improve editing, but Astro remains the compiler. S5, S10.
- **Full Obsidian plugin compatibility is not realistic for static Starlight.** Some plugins render dynamically inside Obsidian or require plugin codeblock execution. S4.
- **Private attachments are easy to leak if asset rules are not explicit.** Quartz warns that non-Markdown files may be emitted unless ignored. S8.

## Blindspot / Gap Analysis

- I did not run a live compatibility test with a sample vault containing `.mdx`, wikilinks, embeds, and Starlight builds.
- I did not inspect `fea-docs` source code because this repo uses it via `npx` and only local concept/config files were present.
- Community plugin maintenance status was assessed from public docs/README availability, not from release cadence or issue health.
- GitHub Pages source-repository privacy details can depend on GitHub account/org settings; the safe recommendation remains to avoid committing secrets/private notes to public repos.

## Confidence and Limits

Confidence is high for the main recommendation: use Starlight/`fea-docs` as the publishing basis and only selectively emulate Obsidian features. Confidence is medium for exact implementation effort because it depends on how much `fea-docs` can currently customize the Starlight Markdown/MDX pipeline.
