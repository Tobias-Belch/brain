---
title: Obsidian Starlight Plan
---

# Implementation Plan: Obsidian-Like Publishing on Astro Starlight

> Source PRD: `docs/research/obsidian-mdx-starlight-publishing/prd.md`

## Architectural Decisions

1. **Publishing platform**: Astro Starlight remains the renderer and static-site output target.
2. **Authoring model**: Obsidian is an optional editor over the docs folder, not the compiler or source of truth.
3. **Core layer**: Build an Obsidian compatibility layer around discovery, metadata extraction, content graph construction, route resolution, privacy filtering, Markdown/MDX transforms, and diagnostics.
4. **Content formats**: `.md` and `.mdx` remain first-class source files.
5. **Privacy model**: Generated-site privacy is enforced at build time; source privacy is the user's repository responsibility. Publication-sensitive projects should use explicit `publish: true` allowlisting.
6. **Strictness model**: Development mode warns where possible. Strict mode fails on content correctness, MDX, and privacy errors.
7. **Static data**: Backlinks and graph data are generated at build time and emitted as static data. No server runtime is required.
8. **Compatibility boundary**: Wikilinks, aliases, heading links, common callouts, simple note embeds, asset embeds, backlinks, graph data, and public/private filtering are in scope. Dataview, arbitrary Obsidian plugins, embedded search results, and full block-reference transclusion are out of scope for the first complete version.

## Phase 1: Compatibility Baseline and Sample Vault

**User stories covered**: 1, 2, 28, 31, 33, 34, 35

### What to Build

Create a representative sample vault and baseline integration path that proves Starlight can build the current docs set with `.md`, `.mdx`, framework components, and no Obsidian transforms enabled. Establish fixtures for public pages, private pages, MDX components, assets, links, callouts, embeds, aliases, duplicate names, and intentionally broken references.

### Acceptance Criteria

- [ ] A sample vault contains `.md`, `.mdx`, assets, public/private metadata, wikilinks, callouts, embeds, backlinks candidates, and MDX component usage.
- [ ] Local dev can serve the sample without Obsidian compatibility transforms enabled.
- [ ] Static build can produce GitHub Pages-compatible output for the baseline sample.
- [ ] Existing MDX imports, JSX, configured aliases, and React integration continue to work.
- [ ] Initial documentation states that Obsidian is an optional editor and Starlight is the compiler.
- [ ] Automated baseline tests exist for successful sample build and MDX compatibility.

## Phase 2: Discovery, Metadata, and Public Filtering

**User stories covered**: 2, 21, 22, 25, 26, 27, 30, 31

### What to Build

Add content discovery and metadata indexing for Markdown and MDX files before rendering. Track title, aliases, slug, draft, publish status, pagefind status, headings, tags, and source path. Apply ignore rules and public/private filtering consistently before navigation, graph, search, and transform work.

### Acceptance Criteria

- [ ] `.md` and `.mdx` files are discovered recursively from the docs root.
- [ ] `.gitignore`, default ignores, and configured ignores are respected.
- [ ] Metadata is extracted for title, aliases, slug, draft, publish, pagefind, headings, and source path.
- [ ] Title fallback order remains frontmatter title, first H1, then filename.
- [ ] Explicit `publish: true` allowlisting can be enabled.
- [ ] Production builds exclude `draft: true` pages.
- [ ] Non-public pages are excluded from output, navigation, search input, backlinks input, and graph input.
- [ ] Development mode reports filtering decisions in a debuggable way.
- [ ] Strict mode fails invalid frontmatter, duplicate routes/slugs, and missing title fallback.

## Phase 3: Route Resolver and Wikilinks

**User stories covered**: 3, 4, 5, 6, 26, 29, 30, 31

### What to Build

Implement deterministic target resolution for Obsidian wikilinks and transform supported wikilinks into Starlight-compatible links. Resolution should use canonical source path, generated route, title, aliases, and headings while preserving MDX syntax safety.

### Acceptance Criteria

- [ ] `[[Note]]` resolves to the correct public page route.
- [ ] `[[Note|Alias]]` renders using alias link text.
- [ ] `[[Note#Heading]]` resolves to the correct heading anchor.
- [ ] `[[Note#Heading|Alias]]` resolves and renders using alias text.
- [ ] Links can resolve by source path, title, and configured aliases.
- [ ] Ambiguous targets produce diagnostics instead of silent resolution.
- [ ] Wikilink-like text inside fenced code, inline code, MDX imports/exports, JSX expressions, and component attributes is not corrupted.
- [ ] Development mode warns on unresolved or ambiguous public wikilinks.
- [ ] Strict mode fails unresolved or ambiguous public wikilinks.
- [ ] Tests cover successful links, heading anchors, aliases, ambiguity, unresolved targets, and MDX safety cases.

## Phase 4: Privacy-Safe Link and Asset Validation

**User stories covered**: 22, 23, 24, 25, 30, 31

### What to Build

Extend validation so public pages cannot reference private pages or private assets. Add asset resolution and inclusion rules for Markdown images, MDX asset references, and Obsidian-style asset references once those are introduced.

### Acceptance Criteria

- [ ] Public-to-private page links produce development warnings and strict build failures.
- [ ] Public-to-private asset references produce development warnings and strict build failures.
- [ ] Unresolved public Markdown images fail strict builds.
- [ ] Unresolved public MDX asset imports remain visible as MDX/build errors.
- [ ] Only assets reachable from public pages or explicitly public asset directories are emitted.
- [ ] Ignored and private asset paths are not emitted accidentally.
- [ ] Diagnostics include source location where feasible and actionable suggested fixes.
- [ ] Tests cover private page leaks, private asset leaks, ignored assets, and allowed public assets.

## Phase 5: Obsidian Callouts

**User stories covered**: 11, 12, 13, 14, 29, 31, 33

### What to Build

Transform common Obsidian callout syntax into accessible Starlight-compatible asides or equivalent components. Preserve titles and body content. Handle nested callouts and foldable indicators using either accessible collapsible UI or documented graceful degradation.

### Acceptance Criteria

- [ ] `> [!note]`, `> [!info]`, `> [!tip]`, `> [!warning]`, `> [!danger]`, and `> [!question]` render with predictable styles.
- [ ] Custom callout titles are preserved.
- [ ] Markdown inside callout bodies renders correctly.
- [ ] Nested callouts do not corrupt the surrounding page structure.
- [ ] Foldable callouts render with accessible semantics or a documented fallback.
- [ ] Unknown callout types render safely with a default style.
- [ ] Callout transforms do not break MDX component usage nearby.
- [ ] Tests cover common types, custom titles, nested cases, foldable markers, unknown types, and MDX-adjacent content.

## Phase 6: Embeds and Transclusion

**User stories covered**: 7, 8, 9, 10, 23, 24, 29, 30, 31

### What to Build

Support Obsidian-style embeds for simple notes, selected headings where feasible, and supported assets. Enforce recursion guards, public/private filtering, and clear diagnostics for unsupported block references or complex embeds.

### Acceptance Criteria

- [ ] `![[Note]]` renders a clearly bounded embedded public note.
- [ ] `![[Note#Heading]]` renders the selected public section where feasible or reports a clear unsupported diagnostic.
- [ ] `![[asset.ext]]` renders supported public image/media assets.
- [ ] Embeds respect public/private filtering for both source notes and assets.
- [ ] Recursive embed loops are detected and reported.
- [ ] Unsupported `![[Note#^block-id]]` block embeds fail strict mode or produce a documented diagnostic.
- [ ] Embedded content cannot cause private content to enter output or search.
- [ ] Tests cover note embeds, heading embeds, asset embeds, unresolved embeds, private embeds, recursive embeds, and unsupported block embeds.

## Phase 7: Backlinks

**User stories covered**: 15, 16, 22, 24, 32

### What to Build

Generate public backlinks from the content graph and render them as an optional page section or component. Include enough metadata for readers to understand the source page and context while never exposing private source pages.

### Acceptance Criteria

- [ ] Backlinks are generated from public Markdown links, wikilinks, and supported embeds.
- [ ] Backlink entries include source title and route.
- [ ] Backlinks exclude private source pages and private-only references.
- [ ] Backlinks can be enabled, disabled, or configured per site.
- [ ] Backlink rendering works in static Starlight output.
- [ ] Strict mode fails if backlink data would expose private content.
- [ ] Tests cover public backlinks, private source exclusion, alias labels, embed-derived backlinks, and disabled backlinks.

## Phase 8: Static Graph Data and Optional Graph UI

**User stories covered**: 17, 18, 22, 24, 32, 34

### What to Build

Emit static graph JSON from the public content graph and provide an optional client-side graph view or documented integration point. Keep graph code optional so baseline pages do not carry unnecessary JavaScript.

### Acceptance Criteria

- [ ] Graph JSON includes public nodes with page ID, title, route, and optional tags.
- [ ] Graph JSON includes public edges with source, target, and edge type where known.
- [ ] Private pages, private assets, unresolved targets, and private-only references are excluded.
- [ ] Graph output is deterministic across builds for the same source and config.
- [ ] Graph UI or integration can be disabled.
- [ ] Graph UI has a non-visual fallback such as a link list or table.
- [ ] Static build requires no runtime server for graph behavior.
- [ ] Tests inspect generated graph JSON and verify private-content exclusion.

## Phase 9: Search Integration and Search Privacy

**User stories covered**: 19, 20, 22, 23, 24, 34

### What to Build

Ensure Pagefind indexes only public, searchable content after Obsidian transformations and embeds. Honor per-page search exclusion and verify private embedded content never enters the index.

### Acceptance Criteria

- [ ] Public pages are included in Pagefind by default.
- [ ] Pages with `pagefind: false` or equivalent metadata are excluded.
- [ ] Private pages are excluded from indexing.
- [ ] Private embedded content cannot enter the search index.
- [ ] Search works in static build output.
- [ ] Tests verify search inclusion and exclusion behavior on sample content.

## Phase 10: Configuration and Author Documentation

**User stories covered**: 1, 21, 25, 32, 33, 34

### What to Build

Expose a small Obsidian compatibility config surface and document supported workflows. Include examples for Obsidian authoring, `.mdx` caveats, public/private publishing, wikilinks, embeds, callouts, backlinks, graph output, search exclusion, and strict mode.

### Acceptance Criteria

- [ ] Config can enable or disable wikilinks, embeds, callouts, backlinks, graph output, and explicit publish allowlisting.
- [ ] Config can define public roots, ignored paths, public asset directories, and strictness behavior.
- [ ] Defaults preserve existing non-Obsidian Starlight usage.
- [ ] Documentation explains recommended Obsidian settings and `.mdx` plugin caveats.
- [ ] Documentation recommends standard Markdown links where possible.
- [ ] Documentation lists supported and unsupported Obsidian syntax.
- [ ] Documentation warns that build filtering does not make a public source repository private.
- [ ] Example content demonstrates each supported feature.

## Phase 11: Strict CI, Diagnostics, and Build Hardening

**User stories covered**: 6, 10, 24, 30, 31, 35

### What to Build

Consolidate diagnostics and strict-mode behavior across all features. Ensure build failures are actionable, stable enough for CI, and optionally machine-readable. Harden output cleanup so failed builds cannot leave private artifacts behind.

### Acceptance Criteria

- [ ] Diagnostics include source file, location where feasible, issue code, severity, and suggested fix.
- [ ] Build/start output ends with a warning/error summary.
- [ ] Strict mode fails on unresolved public links, unresolved public embeds, unresolved public assets, duplicate routes/slugs, invalid frontmatter, missing title fallback, MDX import errors, ambiguous wikilinks, embed cycles, and privacy leaks.
- [ ] Development mode warns for recoverable issues and keeps the local server usable.
- [ ] Machine-readable diagnostics are available for CI or editor integration.
- [ ] Failed strict builds do not leave private generated artifacts in the output directory.
- [ ] End-to-end tests cover strict success, strict failure, dev warnings, and privacy leak prevention.

## Phase 12: Performance, Accessibility, and Release Readiness

**User stories covered**: 17, 18, 19, 33, 34, 35

### What to Build

Optimize and verify the complete feature set against representative vault sizes. Run accessibility checks for callouts, backlinks, graph UI, and generated links. Prepare release notes that accurately describe the constrained Obsidian compatibility boundary.

### Acceptance Criteria

- [ ] Full builds avoid quadratic link-resolution behavior on large sample vaults.
- [ ] Incremental development rebuilds reuse cached discovery or graph data where feasible.
- [ ] Optional graph UI code is not loaded on pages where graph features are disabled.
- [ ] Callouts, backlinks, and graph controls are keyboard accessible.
- [ ] Graph visualization has a non-visual fallback.
- [ ] Generated links have readable text.
- [ ] Release documentation clearly distinguishes supported Obsidian-like behavior from full Obsidian parity.
- [ ] Final sample build passes strict mode and produces static output suitable for GitHub Pages.

## Cross-Cutting Test Matrix

1. **Parser fixtures**: wikilinks, aliases, heading links, callouts, embeds, frontmatter, tags, block IDs, code blocks, and MDX syntax.
2. **Resolver fixtures**: title resolution, alias resolution, path resolution, heading anchors, duplicate aliases, duplicate titles, missing targets, and private targets.
3. **Privacy fixtures**: private notes, private assets, public-to-private links, private embeds, graph leaks, backlink leaks, and search leaks.
4. **Build fixtures**: clean build, strict failure, development warnings, MDX import failure, duplicate routes, invalid frontmatter, and missing title fallback.
5. **Static output fixtures**: generated HTML, generated graph JSON, Pagefind indexing behavior, copied assets, and GitHub Pages-compatible output.
6. **Accessibility fixtures**: callouts, collapsible callouts, backlink sections, graph fallback, and keyboard navigation.

## Delivery Risks

1. MDX and Obsidian syntax can conflict if transforms operate on raw text without respecting MDX AST boundaries.
2. Alias resolution can become confusing unless ambiguity is treated as an error.
3. Embeds can leak private content unless filtering happens before rendering and again during validation.
4. Block references are Obsidian-specific and may consume disproportionate effort compared with value.
5. Graph UI can increase bundle size unless it remains optional.
6. Obsidian preview will remain imperfect for MDX-heavy pages; documentation must set expectations.

## Suggested Milestones

1. **Milestone A: Safe Linking**: Phases 1 through 4. Delivers discovery, metadata, public filtering, wikilinks, and privacy validation.
2. **Milestone B: Obsidian Reading Experience**: Phases 5 through 7. Delivers callouts, embeds, and backlinks.
3. **Milestone C: Exploration and Search**: Phases 8 through 9. Delivers graph data/UI and search privacy.
4. **Milestone D: Productization**: Phases 10 through 12. Delivers config, docs, strict diagnostics, performance, accessibility, and release readiness.
