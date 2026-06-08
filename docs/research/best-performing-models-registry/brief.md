---
title: Research Brief
---

# Research Brief

## Question
What are the best performing free and paid AI models for research, coding (TypeScript, Python, CSS), thinking and image generation tasks, and how can this process be automated to fetch models and their rankings deterministically?

## Intended Use
Build a maintainable registry of top-performing models across key task categories (research, coding, thinking, image generation) with an automated pipeline to keep rankings current. This supports model selection decisions for an AI agent platform.

## Depth and Checkpoint Mode
- Depth: deep
- Mode: default (will pause for meaningful decisions)

## Scope
- In scope: Publicly benchmarked LLMs, API-accessible models, open-weight models, benchmark methodologies (LMSYS Chatbot Arena, OpenCompass, LiveCodeBench, Arena AI Image Arena, Artificial Analysis Image Arena, etc.), automation approaches for programmatic ranking, image generation models (text-to-image, image editing) with per-image pricing
- Out of scope: Private/enterprise-only models, non-English-only models, multimodal-only models (unless they also perform well on text tasks), video/audio generation models, fine-tuning methodology

## Source Policy
- Preferred source types: web, docs, papers
- Source distrusts / exclusions: Marketing pages without methodology disclosure; benchmark sites with opaque scoring
- Recency constraints: Prioritize sources from 2025-2026; flag any data older than 12 months

## Tool Policy
- Default allowlist: webfetch, websearch, read, write, glob, grep, bash
- Run allow overrides: none
- Run disallow overrides: none

## Evidence Threshold
Corroborated or single-sourced with explicit provenance for ranking claims. Confidence labels required for all key findings.

## Defaults and Assumptions
- "Best performing" means highest quality output
- Free models include open-weight models that can be self-hosted and free-tier API offerings
- Paid models include API-only models with usage-based pricing
- Coding tasks include generation, debugging, refactoring across TypeScript, Python, and CSS
- Research tasks include synthesis, fact-finding, and literature analysis
- Thinking tasks include reasoning, planning, concept extraction, and question generation
- Image generation tasks include text-to-image generation and image editing; evaluated by human preference (Arena Elo), prompt adherence, text rendering, photorealism, and cost-per-image
- Automation should prioritize deterministic, reproducible approaches over subjective evaluation
