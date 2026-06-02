---
title: Obsidian MDX Publishing Brief
---

# Research Brief

## Question

Given the user's context and requirements, determine:

1. Is it possible to integrate MDX docs in an Obsidian vault?
2. Can an Obsidian vault, including MDX docs, be published as an interactive docs MPA to GitHub Pages, without breaking because of Obsidian's advanced capabilities and for free?
3. Can private files be ignored while publishing, even though they are treated just like regular files locally?
4. If that does not work, how can we come close to Obsidian's capabilities with an Astro Starlight based setup, what key features would be needed, and would that be possible?

## Intended Use

Inform whether to revive Obsidian as the authoring layer for this repository's Markdown/MDX documentation, or instead invest in a `fea-docs` / Astro Starlight-compatible workflow that approximates Obsidian's useful authoring and linking capabilities.

## Depth and Checkpoint Mode

- Depth: deep
- Mode: default

## Scope

- In scope: Obsidian vault behavior, MDX compatibility, Obsidian publish/static-site alternatives, GitHub Pages feasibility, private/public filtering patterns, Obsidian-flavored Markdown features, Astro Starlight and `fea-docs` alignment, local repository context.
- Out of scope: Paid-only Obsidian Publish details except as a comparison point, proprietary private vault plugins without public documentation, building a full implementation, non-Markdown note apps.

## Source Policy

- Preferred source types: official documentation, plugin/project documentation, local repository files, active open-source project documentation, relevant issue/discussion pages when they reveal practical compatibility limits.
- Source distrusts / exclusions: marketing-only claims without implementation details; stale forum posts unless corroborated by current docs or project state.
- Recency constraints: Prefer current docs and actively maintained projects. For Obsidian core syntax, stable older documentation is acceptable if still reflected in current help docs.

## Tool Policy

- Default allowlist: local file reads/searches, web fetches, Context7 documentation lookup where useful.
- Run allow overrides: none.
- Run disallow overrides: none.

## Evidence Threshold

Use corroborated evidence for final architectural recommendations. Label claims as single-sourced or interpretive where source coverage is thin, especially around MDX-in-Obsidian workflows and plugin compatibility.

## Defaults and Assumptions

- The deployed docs app should be based on `fea-docs`, which is locally documented as a Starlight-based CLI.
- GitHub Pages static deployment is required or strongly preferred.
- Local authoring should remain comfortable for private and public files in one repository/vault.
- The user values Obsidian's authoring UX and graph/linking model, but deployment correctness and MDX support are hard requirements.
