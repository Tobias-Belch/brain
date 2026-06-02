---
title: Obsidian Starlight PRD
---

# PRD: Obsidian-Like Publishing on Astro Starlight

## Problem Statement

Authors want to use an Obsidian-style local writing workflow while publishing a free, static, interactive documentation site through Astro Starlight. The current research shows that Obsidian should not become the publishing engine and that Astro Starlight / `fea-docs` should remain the source of deployment truth. The gap is an Obsidian-flavored content intelligence layer that makes common vault behaviors work in Starlight without pretending to support every Obsidian plugin or preview behavior.

The product must support a constrained, reliable subset of Obsidian behavior: wikilinks, aliases, heading links, basic embeds, callouts, backlinks, graph data, search, explicit public/private filtering, safe asset handling, and strict validation. It must preserve MDX and component support because Starlight is the publishing target.

## Goals

1. Let a documentation folder be opened and edited as an Obsidian vault while still building as a Starlight site.
2. Support `.md` and `.mdx` as first-class source formats.
3. Convert common Obsidian syntax into valid Starlight-rendered pages at build time.
4. Generate relationship data for backlinks and graph views without requiring a server.
5. Prevent accidental publication of private notes and private assets.
6. Preserve `fea-docs` simplicity: minimal config, fast local start, static build output, and strict CI validation.
7. Clearly define unsupported Obsidian behavior so authors do not rely on fragile or misleading compatibility.

## Non-Goals

1. Replacing Obsidian Publish.
2. Building a full Obsidian plugin runtime inside Starlight.
3. Supporting arbitrary Dataview queries, embedded search queries, or plugin-rendered code blocks.
4. Making Obsidian preview match deployed MDX exactly.
5. Creating a separate non-Starlight docs platform.
6. Providing hard privacy for files committed to a public source repository.

## Actors

1. **Author**: writes and edits notes locally, optionally in Obsidian.
2. **Publisher**: runs local preview and static builds for deployment.
3. **Maintainer**: configures `fea-docs`, CI validation, and publishing rules.
4. **Reader**: uses the generated Starlight site.

## User Stories

1. As an author, I want to open the docs folder as an Obsidian vault, so that I can use a familiar note-taking UI.
2. As an author, I want `.md` and `.mdx` files to be discovered, so that Markdown notes and MDX component pages can coexist.
3. As an author, I want `[[Note]]` links to resolve in the published site, so that vault-style links work for readers.
4. As an author, I want `[[Note|Alias]]` links to render with alias text, so that natural prose can link to canonical pages.
5. As an author, I want `[[Note#Heading]]` links to resolve to page headings, so that I can link to precise sections.
6. As an author, I want unresolved wikilinks to be visible during development and fail strict builds, so that broken references are caught before publishing.
7. As an author, I want simple note embeds such as `![[Note]]` to render in public pages, so that reusable note fragments can be included.
8. As an author, I want heading embeds such as `![[Note#Heading]]` to render the selected section where feasible, so that content can be reused at section granularity.
9. As an author, I want image and asset embeds such as `![[image.png]]` to render as normal assets, so that Obsidian-style media embeds work.
10. As an author, I want unsupported embeds to fail clearly in strict mode, so that readers do not see broken output.
11. As an author, I want Obsidian callouts such as `> [!info]` to render as Starlight-compatible asides, so that note annotations preserve their meaning.
12. As an author, I want common callout types to map predictably, so that `note`, `info`, `tip`, `warning`, `danger`, `question`, and similar types look consistent.
13. As an author, I want foldable callouts to degrade safely or render as collapsible UI, so that source notes remain usable even when exact parity is not available.
14. As an author, I want nested callouts to render without corrupting page structure, so that complex notes remain readable.
15. As an author, I want backlinks on published pages, so that readers can discover related pages.
16. As a reader, I want backlink labels to use page titles or aliases, so that relationship lists are understandable.
17. As a reader, I want a graph view generated from public pages, so that I can explore note relationships visually.
18. As a maintainer, I want graph data emitted as static JSON, so that the site stays static and deployable to GitHub Pages.
19. As a reader, I want full-text search over public content, so that I can find pages quickly.
20. As a maintainer, I want pages to opt out of search, so that generated helper pages or sensitive public pages can be excluded from Pagefind.
21. As a publisher, I want explicit public allowlisting, so that only intended notes are emitted.
22. As a publisher, I want private notes excluded from site output, navigation, search, backlinks, and graph data, so that generated output does not reveal private content.
23. As a publisher, I want private assets excluded unless reachable from public pages or explicitly public folders, so that attachments are not leaked.
24. As a maintainer, I want strict mode to fail on private-to-public leaks, so that CI blocks unsafe deployments.
25. As a maintainer, I want ignored paths to honor `.gitignore`, default ignores, and user config, so that existing repository hygiene rules apply.
26. As an author, I want frontmatter titles, aliases, slugs, drafts, and publish flags to be understood, so that metadata controls routing and publishing.
27. As an author, I want README or index behavior to remain compatible with Starlight navigation, so that directory hierarchy still drives the sidebar.
28. As an MDX author, I want ESM imports, JSX, and configured component aliases to continue working, so that interactive docs remain possible.
29. As an MDX author, I want Obsidian preprocessing not to break MDX syntax, so that valid MDX remains valid after transformation.
30. As a publisher, I want strict mode to fail on MDX import errors, duplicate slugs, invalid frontmatter, missing titles, missing assets, and broken internal links, so that builds are reliable.
31. As an author, I want development mode to warn instead of fail for recoverable issues, so that I can iterate quickly.
32. As a maintainer, I want a config surface for Obsidian compatibility, so that teams can choose allowed syntax and strictness.
33. As a maintainer, I want clear documentation of supported and unsupported Obsidian syntax, so that authors know what to rely on.
34. As a publisher, I want GitHub Pages-compatible static output, so that publishing remains free and simple.
35. As a maintainer, I want automated tests for parsing, routing, privacy filtering, and build integration, so that compatibility does not regress.

## Functional Requirements

### Source Discovery

1. The system must scan `.md` and `.mdx` files recursively from the configured docs root.
2. The system must honor `.gitignore`, a default ignore set, and user-configured ignore patterns.
3. The system must treat `.md` and `.mdx` as publishable content source files.
4. The system must preserve existing Starlight routing and navigation behavior where no Obsidian-specific syntax is present.
5. The system must support directory-based navigation and README/index section pages.

### Metadata Model

1. The system must parse frontmatter for at least `title`, `aliases`, `slug`, `draft`, `publish`, and `pagefind`.
2. The system must derive a title from frontmatter, first H1, or filename according to the existing `fea-docs` fallback order.
3. The system must support aliases as alternate link targets for wikilink resolution.
4. The system must track headings and generated heading anchors for heading-level links.
5. The system should track tags when present in frontmatter or Markdown text for future graph/search facets.
6. The system should track Obsidian block IDs when present, even if full block transclusion is not part of the first implementation.

### Public and Private Filtering

1. The system must support explicit public allowlisting with `publish: true`.
2. The system must support excluding pages with `draft: true` from production builds.
3. The system must define the precedence between `publish`, `draft`, ignore patterns, and build mode.
4. The system must exclude non-public pages from rendered output.
5. The system must exclude non-public pages from navigation, backlinks, graph data, and search indexes.
6. The system must detect links from public pages to private pages.
7. In strict mode, public-to-private page links must fail the build.
8. In development mode, public-to-private page links must produce clear warnings.
9. The system must document that source privacy is separate from generated-site privacy.

### Wikilinks

1. The system must recognize `[[Note]]` wikilinks in Markdown and MDX prose.
2. The system must recognize `[[Note|Alias]]` wikilinks and render alias text.
3. The system must recognize `[[Note#Heading]]` wikilinks and resolve them to heading anchors.
4. The system must recognize `[[Note#Heading|Alias]]` links.
5. The system must resolve wikilinks by canonical path, page title, and aliases.
6. The system must handle URL generation using Starlight route rules.
7. The system must avoid transforming wikilink-like text inside fenced code blocks, inline code, MDX JSX expressions, or import/export statements.
8. The system must produce diagnostics for ambiguous wikilink targets.
9. In strict mode, unresolved or ambiguous public wikilinks must fail the build.

### Embeds and Transclusion

1. The system must recognize note embeds using `![[Note]]`.
2. The system should recognize heading embeds using `![[Note#Heading]]`.
3. The system must recognize asset embeds using `![[asset.ext]]` for supported image and media assets.
4. The system must render simple note embeds as safe, clearly bounded embedded content.
5. The system must prevent recursive embed loops and report them.
6. The system must respect public/private filtering for embedded notes and assets.
7. In strict mode, unresolved embeds and private embed leaks must fail the build.
8. The system may defer full `![[Note#^block-id]]` block transclusion, but must either preserve diagnostics or fail clearly when unsupported.

### Callouts

1. The system must recognize Obsidian callout syntax beginning with `> [!type]`.
2. The system must map common Obsidian callout types to Starlight asides or equivalent accessible components.
3. The system must preserve custom callout titles where provided.
4. The system must preserve callout body Markdown.
5. The system should support nested callouts without breaking blockquote parsing.
6. The system should support foldable callout indicators by rendering an accessible details/summary UI or by documented graceful degradation.
7. Unknown callout types must render safely with a default style and diagnostic metadata.

### Backlinks

1. The system must build a link graph from Markdown links, wikilinks, and supported embeds.
2. The system must generate backlinks for each public page from public inbound references.
3. Backlink output must exclude private source pages and private-only references.
4. Backlink entries must include source page title, route, and optional excerpt or context when feasible.
5. Backlinks must be renderable as a Starlight page component or injected page section.
6. Backlinks must be disabled or configurable per site or per page.

### Graph Data

1. The system must emit static graph data for public pages.
2. Graph nodes must include at least page ID, title, route, and optional tags.
3. Graph edges must include source, target, and edge type where known.
4. Graph data must exclude private pages, private assets, and unresolved targets.
5. The system should provide a client-side graph component or documented integration point.
6. The graph must remain optional to avoid increasing baseline page weight.

### Search

1. The system must use Starlight/Pagefind for full-text search.
2. The system must ensure only public pages are indexed.
3. The system must honor `pagefind: false` or equivalent search exclusion metadata.
4. The system must ensure embedded private content cannot enter the search index.

### Asset Handling

1. The system must resolve Markdown image links, MDX asset imports, and supported Obsidian asset embeds.
2. The system must copy or reference only assets needed by public pages or explicitly configured public asset directories.
3. The system must fail strict builds on unresolved public assets.
4. The system must fail strict builds when public pages reference private assets.
5. The system must avoid emitting arbitrary non-Markdown files from ignored or private paths.

### MDX and Component Compatibility

1. The system must preserve existing Starlight MDX support.
2. The system must preserve configured framework integrations such as React.
3. The system must preserve configured import aliases.
4. Obsidian syntax transformation must run in a way that does not corrupt MDX ESM, JSX, expressions, or component imports.
5. MDX compilation errors must remain visible and must fail strict builds.

### Validation and Diagnostics

1. Development mode must favor warnings for recoverable content issues.
2. Strict mode must fail on unresolved public links, unresolved public embeds, unresolved public assets, duplicate routes/slugs, invalid frontmatter, missing title fallback, MDX import errors, ambiguous wikilinks, embed cycles, and privacy leaks.
3. Diagnostics must include source file, location where feasible, issue code, severity, and suggested fix.
4. The system must provide a summary of warnings and errors at the end of build/start output.
5. The system should support machine-readable diagnostics for CI or editor integrations.

### Configuration

1. The system must expose an optional Obsidian compatibility config section.
2. The config must allow enabling or disabling wikilinks, callouts, embeds, backlinks, graph output, and explicit publish allowlisting.
3. The config must allow defining public roots, ignored paths, public asset directories, and strictness behavior.
4. Defaults must be safe: private content should not be emitted accidentally when explicit publishing is enabled.
5. Defaults must be simple: existing non-Obsidian Starlight usage should continue with minimal or no config.

### Authoring UX

1. The system must document that Obsidian is an optional editor, not the publishing compiler.
2. The system must document recommended Obsidian settings and plugins for `.mdx` editing.
3. The system must recommend standard Markdown links where possible for portability.
4. The system must provide examples for wikilinks, aliases, callouts, embeds, public flags, and MDX components.
5. The system must document unsupported Obsidian features and their expected diagnostics.

### Deployment

1. The system must produce static output compatible with GitHub Pages.
2. The system must require no runtime server for links, backlinks, graph data, or search.
3. The system must remain compatible with `fea-docs start`, `fea-docs build`, and `fea-docs setup --gh-pages` concepts.

## Non-Functional Requirements

### Privacy and Security

1. Generated output must not include private pages, private-only graph nodes, private-only backlinks, private search content, or private assets.
2. Strict mode must block known private-content leaks.
3. The system must not execute arbitrary Obsidian plugin code.
4. The system must not execute arbitrary note content during parsing beyond normal MDX compilation rules.
5. The documentation must warn that committing private files to a public repository makes them public regardless of build filtering.

### Correctness

1. Link resolution must be deterministic.
2. Ambiguous aliases or titles must be reported instead of resolved silently.
3. Route generation must match Starlight output.
4. Transformations must preserve source intent for supported syntax.
5. Unsupported syntax must degrade clearly or fail with actionable diagnostics.

### Performance

1. Local dev startup must remain fast for small and medium documentation sets.
2. Incremental rebuilds should reuse cached discovery and graph data where feasible.
3. Full builds should scale to thousands of notes without quadratic link-resolution behavior.
4. Optional graph UI code must not load on every page unless enabled and needed.
5. Search indexing must not process private or ignored content.

### Reliability

1. Build output must be reproducible from the same source tree and config.
2. Strict mode must be suitable for CI.
3. Diagnostics must be stable enough for documentation and tests.
4. Failure modes must leave no partially published private assets in the output directory.

### Maintainability

1. Parsing, resolution, privacy filtering, and rendering integration should be separated into testable modules.
2. The public configuration API should remain small and stable.
3. Obsidian compatibility should be implemented as an additive layer over Starlight rather than a fork of Starlight behavior.
4. Tests should focus on observable behavior rather than internal implementation details.

### Accessibility

1. Callouts, backlinks, and graph controls must be keyboard navigable where interactive.
2. Collapsible callouts must use accessible semantics.
3. Graph visualization must have a non-visual fallback such as a link list or table.
4. Generated links must have readable text.

### Compatibility

1. The system must support current Astro Starlight Markdown and MDX behavior.
2. The system must not require paid Obsidian Publish.
3. The system must work in a static hosting environment.
4. The system should remain usable when authors do not use Obsidian at all.

## Implementation Decisions

1. Astro Starlight remains the publishing platform.
2. Obsidian is treated as an optional local editor.
3. The core product is a build-time content intelligence layer: discovery, metadata extraction, graph construction, privacy filtering, syntax transformation, and diagnostics.
4. The initial supported Obsidian subset is wikilinks, aliases, heading links, common callouts, simple note embeds, asset embeds, backlinks, graph data, and public/private filtering.
5. Full Dataview, arbitrary Obsidian plugin rendering, embedded search results, and complete block-reference transclusion are out of scope unless later reintroduced through separate PRDs.
6. Public output should prefer explicit allowlisting for publication-sensitive workflows.
7. Strict mode is the gate for deployment correctness and privacy safety.
8. Development mode prioritizes iteration and should provide actionable warnings.

## Acceptance Criteria

1. A sample docs folder containing `.md`, `.mdx`, wikilinks, aliases, callouts, embeds, public/private notes, and assets can be served locally through Starlight.
2. The same sample can be built to static output compatible with GitHub Pages.
3. Public wikilinks resolve to correct routes and anchors.
4. Public callouts render as accessible Starlight-compatible UI.
5. Public simple embeds render or fail with documented diagnostics.
6. Backlinks render for public inbound links only.
7. Static graph data contains public nodes and edges only.
8. Search indexes public searchable pages only.
9. Strict mode fails on unresolved links, missing assets, duplicate routes, invalid frontmatter, MDX import errors, ambiguous wikilinks, embed cycles, and private-content leaks.
10. Documentation clearly states supported syntax, unsupported syntax, Obsidian authoring limits, and source privacy limits.

## Testing Decisions

1. Unit tests should cover parsing of wikilinks, embeds, callouts, frontmatter, aliases, headings, and block IDs.
2. Unit tests should cover deterministic route and target resolution, including ambiguous targets.
3. Unit tests should cover privacy filtering and asset inclusion rules.
4. Integration tests should build sample vaults and inspect generated routes, HTML, graph JSON, search inclusion, and diagnostics.
5. MDX compatibility tests should include imports, JSX, expressions, and Obsidian-like text in code blocks.
6. Accessibility tests should cover callouts, backlink sections, collapsible UI, and graph fallbacks.
7. Regression fixtures should include unsupported syntax to verify diagnostics remain clear.

## Open Questions

1. Should explicit `publish: true` be the default publishing mode for all Obsidian-compatible projects, or only when configured?
2. Should backlinks be injected into every page automatically or exposed as an opt-in component/layout slot?
3. Should graph visualization ship in the base product or as an optional integration?
4. How much block-reference support is worth implementing before real user examples exist?
5. Should aliases be global across the site, scoped by folder, or configurable?
