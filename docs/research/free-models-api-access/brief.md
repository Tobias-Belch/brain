---
title: Research Brief
---

# Research Brief

## Question
1. Which API provides access to which free models?
2. Which free models do the agents OpenCode and PI give access to?

## Intended Use
Decision-support research for finding capable free models and understanding how to programmatically access them. Informs agent configuration and capability assessment.

## Depth and Checkpoint Mode
- Depth: standard
- Mode: default

## Scope
- In scope:
  - Public API providers offering free LLM model tiers
  - Free models accessible through OpenCode agent configuration
  - Free models accessible through PI agent configuration
  - API endpoints, rate limits, and authentication for free tiers
- Out of scope:
  - Paid-only models and enterprise pricing
  - Local-only models (ollama, llama.cpp)
  - Social media sources

## Source Policy
- Preferred source types: web, docs
- Source distrusts / exclusions: unmaintained blog posts >1 year old (LLM space moves fast)
- Recency constraints: prefer sources from 2025-2026

## Tool Policy
- Default allowlist: websearch, webfetch
- Run allow overrides: none
- Run disallow overrides: none

## Evidence Threshold
Corroborated or single-sourced with clear source attribution; flag any unresolved claims.

## Defaults and Assumptions
- "Free models" means models accessible via API without upfront payment, possibly with rate limits
- OpenCode refers to the opencode.ai agent platform
- PI likely refers to the PI agent or platform (will verify)
- Web search is the primary discovery mechanism for current API offerings
