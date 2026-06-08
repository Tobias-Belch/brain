---
title: 'Free Models API Access'
---

# Free Models API Access: Provider Landscape and Agent Access

## Executive Summary

There are **22+ API providers** offering free LLM model access in 2026, ranging from frontier labs (Google Gemini, Mistral) to open-model inference platforms (Groq, Cerebras) to AI gateways (OpenRouter). No credit card is required for most. For coding agents, **OpenCode** ships with **6 built-in free models** and supports 75+ providers; **PI** (via the `pi-free` extension) provides access to **4 immediate free providers** and **7+ more with free account signup**.

## Research Question and Scope

1. Which API provides access to which free models?
2. Which free models do the agents OpenCode and PI give access to?

Scope: Public API free tiers, agent-accessible free models. Depth: standard.

## Methodology

Web search for current (2026) free LLM API comparisons, official documentation sites, GitHub repositories, and third-party guides. 12 sources analyzed with quality ratings.

## Key Findings

### Part 1: Free LLM API Provider Landscape

#### Top Free Tiers (No Credit Card Required)

| Provider | Free Models | Rate Limits | Best For |
|---|---|---|---|
| **Google Gemini API** | Gemini 2.5 Flash, 2.5 Flash-Lite, 3.x Flash | 1,500 req/day, 10-15 RPM, 1M TPM | Long context (1M tokens), general purpose |
| **Groq** | Llama 3.3 70B, Llama 4 Scout 17B, Qwen3 32B | ~30 RPM, 100K-500K tokens/day | Fastest inference (300+ tok/s on LPU) |
| **Mistral AI** (Experiment) | Mistral Large, Codestral, Pixtral | 2 RPM, 1B tokens/month | Broadest model access on free tier |
| **Cerebras** | Llama 3.1 8B, Qwen 3 235B | 10-30 RPM, 1M tokens/day | Highest daily token quota |
| **OpenRouter** | ~30 free models (DeepSeek R1, Llama 3.3, Qwen3, Gemma 3) | 20 RPM, 50 req/day free | One API key for many models |
| **Hugging Face** | 200+ open source models via Inference Providers | ~$0.10/mo free credits | Research, niche models |
| **Cloudflare Workers AI** | 47+ models (Llama 3.3, Qwen QwQ 32B) | 10,000 neurons/day | Edge inference, low latency |
| **GitHub Models** | 100+ models (GPT-4o, Llama, Mistral, Phi) | 10-15 RPM, 50-150 req/day | Widest selection |
| **NVIDIA NIM** | Llama 3.1, Mistral, DeepSeek R1 | ~40 RPM, 1,000 free credits | Enterprise-grade inference |
| **Together AI** | Llama 3.3 70B Turbo, DeepSeek | $25 free credits, 6 RPM on free endpoints | Starting credits |
| **SambaNova Cloud** | Llama 3.3 70B, DeepSeek-V3/R1, Llama 4 | 20-480 RPM free | RDU-accelerated inference |

#### Limited Free Tiers / Trial Credits

| Provider | Free Offering |
|---|---|
| **OpenAI** | GPT-3.5 Turbo only (3 RPM). Free trial credits discontinued mid-2025. |
| **xAI (Grok)** | $25 free API credits on signup; $150/mo via data sharing program. |
| **Anthropic** | No ongoing free tier. Limited console access with rate limits. |
| **Cohere** | Trial key: 1,000 API calls/month (non-commercial). |
| **DeepSeek** | Generous free tier with API key. |
| **ApiFreeLLM** | 200B+ models, unlimited messages, forever free. |
| **DeepInfra** | $5 one-time trial credit, no credit card. |
| **Replicate** | Free runs on curated model collection, no credit card to start. |

#### Key Distinctions
- **Truly free (no credit card ever)**: Google, Groq, Cerebras, OpenRouter, Hugging Face, Cloudflare, NVIDIA NIM, GitHub Models, SambaNova, ApiFreeLLM
- **Free trial (credits expire)**: Together AI ($25), DeepInfra ($5), xAI ($25), Replicate
- **Fake free (GPT-3.5 only, limited)**: OpenAI
- **No free tier**: Anthropic (console rate limits only)

### Part 2: Agent-Specific Free Model Access

#### OpenCode Free Models

OpenCode ships with **6 built-in free models** that require no API key (source: S3, verified 2026-06-04):

| Model ID | Description |
|---|---|
| `opencode/big-pickle` | General purpose model |
| `opencode/gpt-5-nano` | Lightweight and fast |
| `opencode/mimo-v2-omni-free` | Multimodal capable |
| `opencode/mimo-v2-pro-free` | Enhanced multimodal |
| `opencode/minimax-m2.5-free` | Fast responses |
| `opencode/nemotron-3-super-free` | NVIDIA's open model |

Additionally, OpenCode supports **75+ LLM providers** (S4, S7) through Models.dev integration. When you connect your own API keys, you can access free tiers of:
- Google Gemini (via Google AI Studio)
- Groq
- OpenRouter
- GitHub Models (via GitHub login)
- Together AI
- Local models via Ollama, LM Studio

#### PI Agent Free Models

PI's built-in provider support (via `@earendil-works/pi-ai`) includes: Anthropic, OpenAI, Google, xAI, Groq, Cerebras, OpenRouter (S8, S11). The community `pi-free` extension (S5) is the primary way to access free models:

**Immediate free models (no API key, no payment):**
- `kilo/` — Kilo models (200 req/hr, OAuth login)
- `openrouter/` — OpenRouter free models (free account, API key optional)
- `cline/` — Cline models (free account via OAuth)
- `llm7/` — LLM7 gateway (100 req/hr, 20 req/min, free token)

**Freemium (free tier with limits, then credits):**
- `nvidia/` — NVIDIA NIM (1,000 free requests/month)
- `ollama-cloud/` — Ollama Cloud (usage-based, resets every 5 hours)
- `sambanova/` — SambaNova Cloud (20-480 RPM free)

**With free API key signup:**
- `mistral/` — Mistral (free Experiment plan)
- `groq/` — Groq (free tier)
- `cerebras/` — Cerebras (1M tokens/day free)
- `xai/` — xAI ($25 free credits)
- `huggingface/` — Hugging Face (free inference)
- `codestral/` — Codestral via Mistral (2 req/min, 1B tokens/month)
- `deepinfra/` — DeepInfra ($5 trial credit)
- `together/` — Together AI ($1 trial credit)

## Source Inventory

See `source-inventory.md` for full source list (12 sources, S1-S12).

## Conflicts and Open Questions

- **Rate limit variance**: Google Gemini free tier RPM reported as 60 (S1), 10-15 (S2), 15 (S12). This reflects Google's late-2025 quota reductions. The lower figures (S2, S12) are likely more current.
- **OpenCode free model list**: Only confirmed from third-party guide (S3). Official docs (S4) recommend running `opencode models` to see the current list.
- **PI built-in free models**: PI's `@earendil-works/pi-ai` supports providers but doesn't explicitly document which free models are accessible without pi-free extension. The extension is the de facto reference.
- **ApiFreeLLM**: Claims "unlimited forever free" with 200B+ models; source quality is lower (single website). Verify before depending on it.

## Blindspot / Gap Analysis

- **OpenCode `opencode models` CLI output**: Not captured here; should be verified locally.
- **PI without pi-free extension**: The exact set of models available through PI's built-in auth system (vs. community extension) is unclear.
- **Free tier stability**: Multiple sources (S2, S12) note that free tiers are being reduced (Google Gemini) or removed (OpenAI free credits discontinued). This landscape is volatile.
- **Geographic restrictions**: Some free tiers may be region-locked. Not verified.

## Recommendations and Next Steps

1. **For agent configuration**: Use `opencode models` locally to get the definitive current free model list.
2. **For maximum free capacity**: Stack Google Gemini (context) + Groq (speed) + OpenRouter (fallback) — all no-credit-card, all OpenAI-compatible.
3. **For PI users**: Install `pi install git:github.com/apmantza/pi-free` to unlock free models, then run `/login kilo` and `/login cline` for OAuth-based free access.
4. **Verify before depending**: Run `opencode models` and check PI's model picker (`Ctrl+L`) to confirm current offerings.

## Confidence and Limits

- **API provider landscape**: High confidence (corroborated across 6+ sources)
- **OpenCode free models**: Medium-high confidence (single detailed source, but recent and specific)
- **PI free models**: Medium confidence (relies on community extension doc; PI core docs don't explicitly list free models)
- Rate limits are approximate and subject to change. All data sourced from 2026 publications.
