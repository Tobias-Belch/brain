---
title: Docs App Concept
---

## Core Idea

`fea-docs` is a plug-and-play CLI that turns existing Markdown and MDX files into a running documentation app with almost no setup.

The user experience is:

1. Run `npx fea-docs start` from any directory.
2. Get a local Starlight-based docs site immediately.
3. Edit docs and see updates live.

The tool abstracts framework setup and configuration so users do not have to manually maintain a standalone docs app.

## Product Goals

- Launch docs quickly from existing repository content.
- Keep configuration optional and minimal.
- Support both `.md` and `.mdx` with a consistent UX.
- Preserve natural docs structure with hierarchical navigation.
- Provide an easy path to GitHub Pages deployment setup.

## Foundation Choice

- Base framework: **Starlight (Astro)**.
- Reasoning:
  - static-first output and MPA-style page delivery,
  - strong markdown and MDX support,
  - multi-framework component support via Astro integrations.

## Key Decisions

### Scope and Discovery

- Scan from **current working directory only**.
- Include all `.md` and `.mdx` files recursively.
- Exclude paths from:
  - `.gitignore`,
  - default ignore set (`.git`, `node_modules`, `build`, `dist`, `output`, `cache`, `vendor`),
  - optional user `ignore` config.

### Navigation and Routing

- Sidebar follows directory hierarchy.
- `README.md` acts as section index page.
- Page label fallback order:
  1. frontmatter `title`,
  2. first H1,
  3. filename.
- URL strategy is hybrid: stable source-derived paths with optional slug overrides.

### Commands

- `start`: run local dev docs server with file watching.
- `build`: produce deployable static site output.
- `setup --gh-pages`: generate GitHub Actions workflow and setup guidance.

### MDX and Components

- MDX support is enabled when `.mdx` files are present.
- Custom component imports support:
  - relative paths,
  - configured alias roots,
  - npm dependencies.
- Additional UI integrations are opt-in via CLI/config (`react`, `vue`, `svelte`, `solid`).

### Validation and Quality

- Dev mode is permissive with warnings.
- `--strict` mode is CI-oriented and fails on:
  - broken internal links,
  - unresolved assets/images,
  - duplicate slugs,
  - frontmatter errors,
  - MDX import resolution errors,
  - missing valid title fallback.

### Runtime and UX Controls

- Port precedence: `--port` > `PORT` env > config > automatic.
- Optional `--open` to launch browser.
- Explicit `--config <path>` supported.
- No implicit repo-root config lookup.

### Performance and Operations

- Use persistent cache/work data between runs for faster startup/build.
- No telemetry in v1.
- Convenience flags:
  - `--tailscale-serve`,
  - `--caffeinate` (macOS-aware),
  - explicit `--expose` for remote visibility safety.

## Out of Scope (v1)

- Full deployment orchestration across hosting providers.
- Plugin marketplace/extension ecosystem.
- Deep versioning and i18n productization beyond baseline composition.
- Telemetry and analytics collection.

## Success Criteria

- A user can run `start` and view discovered docs in minutes.
- Internal links, assets, and images work in both dev and build output.
- Teams can enforce docs integrity using `--strict` in CI.
- GitHub Pages setup is straightforward via `setup --gh-pages`.
