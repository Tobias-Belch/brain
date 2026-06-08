---
title: 'Best-Performing AI Models'
---

# Best-Performing AI Models Registry: Research Report

## Executive Summary

This report identifies the best-performing free and paid AI models across research, coding (TypeScript, Python, CSS), thinking/reasoning, and image generation tasks as of mid-2026, and provides a concrete architecture for automating model ranking fetch. The research synthesizes 26 sources including human-preference arenas, automated benchmarks, composite indexes, and programmatic data APIs.

**Key findings:**
- **General purpose**: Claude Opus 4.x (Anthropic) leads across both human-preference (Arena Elo 1504) and composite benchmarks (AA Intelligence Index 61). The thinking/reasoning variants consistently outperform base by 5-17 points.
- **Coding**: DeepSeek V4 Pro Max (MIT, open-weight) leads LiveCodeBench at 93.5% — the highest ever recorded. Claude Opus 4.x leads Arena coding (1543-1567 Elo) and SWE-bench. CSS has no standalone benchmark.
- **Reasoning/thinking**: GPT-5.5 leads ARC-AGI-2 (85.0%, near human ceiling). Claude Mythos leads GPQA Diamond (94.6%) and HLE (64.7%). Thinking mode adds 5-17 points on the same model.
- **Image generation**: GPT-Image-2 (OpenAI) swept all categories with a historic +242 Elo gap. Open-weight best: Cosmos3-Super (1240 T2I), HunyuanImage 3.0 Instruct (1225 editing).
- **Free/open-weight**: Kimi K2.6, DeepSeek V4 Pro Max, and GLM-5.1 approach proprietary performance. Artificial Analysis shows the open vs closed gap has shrunk to 3 points (57 vs 54 on Intelligence Index).
- **Automation**: Arena AI data available via free REST API (api.wulong.dev, no auth), Artificial Analysis API (1K req/day free), and HuggingFace Parquet downloads. A cron-based pipeline with daily validation is feasible.

## Research Question and Scope

**Question:** What are the best performing free and paid AI models for research, coding (TypeScript, Python, CSS), thinking and image generation tasks, and how can this process be automated to fetch models and their rankings deterministically?

**Scope:** Publicly benchmarked LLMs, API-accessible models, open-weight models, benchmark methodologies across LMSYS Arena, LiveCodeBench, SWE-bench, GPQA, MMLU-Pro, ARC-AGI, T2I/Image Editing Arenas, and automation approaches for programmatic ranking.

**Out of scope:** Private/enterprise-only models, non-English-only, multimodal-only, video/audio generation, fine-tuning methodology.

## Methodology

Two-phase research design:
1. **Discovery (6 parallel branches)**: Independent investigation of LMSYS Arena, coding benchmarks, reasoning benchmarks, image generation benchmarks, free/open-weight models, and automation approaches.
2. **Secondary followup (2 parallel branches)**: Direct API fetches (arena-ai-leaderboards, Artificial Analysis) and primary-source verification (Scale SEAL, ARC Prize Foundation, LiveCodeBench official).

Evidence labeled with confidence: corroborated (multiple independent sources), single-sourced, contradicted, unresolved, or interpretive.

## Key Findings

### 1. General-Purpose / Research Models

| Tiers | Model | Arena Elo (Text) | AA Intelligence Index | Price (in/out per 1M tok) | Access |
|---|---|---|---|---|---|
| **Frontier #1** | Claude Opus 4.6-4.8 Thinking | 1504-1512 | 57-61 | $15/$60 | Proprietary |
| **Frontier** | GPT-5.5 (high/xhigh) | 1484-1506 | 59-60 | $2.50/$15 | Proprietary |
| **Frontier** | Gemini 3.1 Pro Preview | 1490-1505 | 57 | $2/$12 | Proprietary |
| **Frontier-adjacent** | DeepSeek V4 Pro Max | 1462 | 52 | $1.74/$3.48 | Open (MIT) |
| **Frontier-adjacent** | Qwen3.7 Max | 1474 | 57 | N/A | Proprietary |
| **Frontier-adjacent** | Kimi K2.6 | ~1470 | 54 | Free / self-host | Open (Modified MIT) |
| **Strong** | Claude Sonnet 4.5 | ~1420 | ~50 | $3/$15 | Proprietary |
| **Strong** | GPT-4.1 | ~1400 | ~48 | $2/$10 | Proprietary |
| **Capable** | Llama 4 Maverick (Meta) | ~1380 | ~45 | Free / self-host | Community License |
| **Capable** | Mistral Large 3 | ~1350 | ~44 | $2/$6 | Apache 2.0 |

**Confidence: corroborated** — consistent ordering across Arena AI (human preference) and AA Intelligence Index (benchmark composite). Elo differences under 10 points are often within confidence intervals.

### 2. Coding Models

| Model | LiveCodeBench pass@1 | SWE-bench Verified | SWE-bench Pro (SEAL) | Aider Polyglot | Codeforces Elo | Access |
|---|---|---|---|---|---|---|
| DeepSeek V4 Pro Max | **93.5%** | 80.6% | — | — | **3206** | Open (MIT) |
| Qwen3.7 Max | 91.6% | — | — | — | — | Proprietary |
| DeepSeek V4 Flash Max | 91.6% | — | — | — | — | Open (MIT) |
| Kimi K2.6 | 89.6% | ~80% | — | — | — | Open |
| Gemini 3.1 Pro Pre. | 88.5% | 80.6% | 43.3% | ~78% | ~3100 | Proprietary |
| GPT-5.4/5.5 | — | 79.2-82.6% | 59.1%* | 88.0% | 3168 | Proprietary |
| Claude Opus 4.6-4.8 | ~88.8% | 80.8-88.6% | 45.9-51.9%* | ~72% | ~2900 | Proprietary |
| GLM-5.1 | ~85% | — | **58.4%** (self-rep.) | — | — | Open (MIT) |

*\*SWE-bench Pro scores use different scaffolds — not comparable across rows.*

**Key findings:**
- DeepSeek V4 Pro Max is the top coding model on LiveCodeBench (93.5%) and Codeforces (3206 Elo) — both open-weight
- Claude Mythos leads SWE-bench Verified (93.9%) and SWE-bench Pro self-reported (77.8%), but uses custom scaffolding
- On standardized SEAL scaffold, Claude Opus 4.5 leads at 45.9% on SWE-bench Pro
- Open-weight models are within 1% of proprietary on SWE-bench Verified
- **CSS-specific benchmark does not exist as a standalone evaluation**

**Confidence: corroborated** for LiveCodeBench and SWE-bench Verified. SWE-bench Pro has scaffolding confound (see Conflicts).

### 3. Thinking / Reasoning Models

| Benchmark | #1 Model | Score | #2 Model | Score | #3 Model | Score | Saturation |
|---|---|---|---|---|---|---|---|
| GPQA Diamond | Claude Mythos Preview | 94.6% | GPT-5.5 Pro | 94.4% | Gemini 3.1 Pro | 94.3% | Near ceiling |
| MATH-500 | GPT-5 (high) | 99.4% | o3 | 99.2% | Grok 3 mini Reas. | 99.2% | Near ceiling |
| MMLU-Pro | Gemini 3.1 Pro Pre. | 91.0% | Gemini 3 Pro | 89.8% | Qwen3.7 Max | 89.6% | Near ceiling |
| ARC-AGI-2 | GPT-5.5 | 85.0% | Gemini 3.1 Pro (DT) | 84.6% | GPT-5.4 Pro | 83.3% | Human ceiling ~85% |
| ARC-AGI-3 | Claude Opus 4.8 (High) | 1.52% | Claude Opus 4.6 (Max) | 0.51% | GPT-5.5 (High) | 0.43% | Very low |
| HLE | Claude Mythos Pre. | 64.7% | GPT-5.4 Pro | 58.7% | Muse Spark Cont. | 58.4% | Low (human 85%) |
| AIME 2025 | GPT-5.2 Pro | 100% | GPT-5 Codex | 100% | Gemini 3 Flash | 100% | Saturated |

**Thinking mode effectiveness:** Enabling extended chain-of-thought adds 5-17 points on the same model. First 8K-16K thinking tokens capture most gain; returns diminish beyond that.

**Confidence: corroborated** for saturated benchmarks (GPQA, MATH, MMLU). ARC-AGI-2 and HLE have fewer independent cross-validations → labeled single-sourced with interpretive confidence.

### 4. Image Generation Models

| Tier | Text-to-Image | Image Editing | Price/Image | Access |
|---|---|---|---|---|
| **Premium** | GPT-Image-2 (1512 Elo) | GPT-Image-2 (1513 Elo) | ~$0.05-0.20 (est.) | Proprietary |
| **Strong** | GPT-Image-1.5 (1264 Elo) | GPT-Image-1.5 (1390 Elo) | $0.034-0.20 | Proprietary |
| **Strong** | nano-banana-2 / Gemini 3.1 Flash (1270-1288 Elo) | Nano Banana Pro (1241-1400 Elo) | $0.02-0.06 | Proprietary |
| **Best open-weight** | Cosmos3-Super-Text2Image (1240 Elo) | HunyuanImage 3.0 Instruct (1225 Elo) | $0.003-0.03 | Community license |
| **Best Apache 2.0** | Qwen-Image 2512 (1138 Elo) | FLUX.2 Klein 4B (1026 Elo) | $0.003-0.014 | Apache 2.0 |
| **Value** | FLUX.2 Pro (1169 Elo) | FLUX.2 Max | $0.03 | Commercial |
| **Budget** | FLUX Schnell / SDXL self-hosted | — | $0.001-0.003 | Apache 2.0 / OpenRAIL |

**Key finding:** GPT-Image-2's +242 Elo gap over #2 is the largest margin ever on Image Arena. Text rendering accuracy jumped from ~90-95% to >99%. The market has converged on reasoning-native architectures for image generation.

**Confidence: corroborated** for top rankings. Pricing is a snapshot — market sees 30-40% YoY deflation.

### 5. Free / Open-Weight Models Summary

| Model | Key Strength | Best Benchmark | License | Hardware Requirement |
|---|---|---|---|---|
| DeepSeek V4 Pro Max (1.6T/49B MoE) | Coding + reasoning | LiveCodeBench 93.5% | MIT | Multi-GPU |
| DeepSeek V4 Flash Max | Price-performance | LiveCodeBench 91.6% | MIT | $0.14/$0.28 per 1M tok |
| Kimi K2.6 (Moonshot) | Composite best open | AA Index 54 | Modified MIT | Self-host or free API |
| GLM-5.1 (Zhipu) | SWE-bench Pro | 58.4% (beats GPT-5.4) | MIT | 744B/40B MoE |
| Qwen 3.5-397B (Alibaba) | Scientific reasoning | GPQA Diamond 88.4% | Apache 2.0 | 397B/17B MoE |
| Gemma 4 31B (Google) | Consumer GPU feasible | LiveCodeBench 80%, AIME 89.2% | Apache 2.0 | 20-24GB VRAM (Q4) |
| FLUX.2 Klein 4B | Image generation | 1026 Elo | Apache 2.0 | ~8GB VRAM |
| Qwen-Image 2512 | Text rendering | 1138 Elo | Apache 2.0 | Self-host |

**Free API access:** OpenRouter (15+ free models, 20 RPM), Groq (30 RPM, 600-840 tok/s), DeepInfra/Together (signup credits), Cloudflare Workers AI (10K neurons/day free).

**Confidence: corroborated** — multiple sources confirm DeepSeek V4, Kimi K2.6, and GLM-5.1 as the top three open-weight models.

### 6. Automation Pipeline Design

#### Recommended Data Sources

| Source | What It Provides | Access | Cadence | Deterministic? |
|---|---|---|---|---|
| arena-ai-leaderboards (api.wulong.dev) | Arena AI Elo rankings (text, code, image, etc.) | Free REST API, no auth | Daily (auto via GHA) | Yes — versioned JSON snapshots |
| Artificial Analysis API | AA Intelligence Index, per-benchmark scores, pricing | REST API, free key, 1K req/day | Daily | Yes — documented methodology |
| HuggingFace OpenEvals Parquet | Aggregated cross-benchmark scores | hf:// path | Weekly | Yes — versioned datasets |
| BenchLM API | 248+ models, 225 benchmarks, pricing | REST API, 3s delay free tier | Weekly | Medium — composite score methodology |

#### Minimal Pipeline Architecture

```
cron trigger → fetch_data.py
  ├── arena-ai-leaderboards (REST API + GitHub raw fallback)
  ├── Artificial Analysis (REST API with API key)
  ├── HuggingFace OpenEvals Parquet (hf:// path)
  └── BenchLM (REST API, accept 3s delay)

validate.py → validates schema, normalizes fields, timestamps
  └── JSON Schema or Pydantic validation

merge.py → merges into unified registry DB (SQLite or Parquet)
  └── Per-model: Arena Elo, AA Intelligence Index, per-benchmark scores, pricing

persist → commit to data/YYYY-MM-DD/ + update latest.json
```

#### Provenance Strategy

Adopt the ALL-Bench confidence system: tag each datapoint as `cross-verified` (2+ independent sources), `single-source`, or `self-reported`. Cross-validate Elo scores across Arena AI API and Artificial Analysis.

#### Update Cadence

| Source | Cadence | Rationale |
|---|---|---|
| arena-ai-leaderboards | Daily | Arena updates continuously |
| Artificial Analysis | Daily | Benchmark scores change infrequently; pricing changes more often |
| HuggingFace leaderboards | Weekly | Batch-processed updates |
| BenchLM API | Weekly | 1-3 updates/week |

**Confidence: corroborated** — multiple independent data sources confirm the availability and reliability of each API. The arena-ai-leaderboards API was tested and returned valid structured data.

## Source Inventory

See [source-inventory.md](source-inventory.md) for full source table (26 sources).

## Conflicts and Open Questions

1. **SWE-bench scaffolding confound**: Claude Mythos scores 93.9% (custom agent) vs 45.9% (standard SEAL scaffold) on different variants of the same benchmark. These are not comparable. Any registry must specify scaffold type alongside score.

2. **LiveCodeBench version drift**: V5 vs V6 produce significantly different scores (e.g., Seed 2.0 Pro at 87.8% on V6 vs DeepSeek V4 Pro at 93.5% on main). The registry must pin version.

3. **Arena Elo vs benchmark scores**: Human preference (Elo) and automated benchmarks (pass@1, accuracy) measure different things. A model that scores #1 on Arena coding may be #5 on LiveCodeBench. The registry must present them separately and never average.

4. **GPT-Image-2 pricing unknown**: OpenAI has not published per-image pricing for GPT-Image-2 as of mid-2026. The model dominates quality metrics but cost assessment is provisional.

5. **New models without independent verification**: Seed 2.0 Pro, Step 3.5 Flash, and Owl Alpha have limited third-party verification. Rankings for these should carry lower confidence.

6. **CSS coding not independently benchmarked**: No major evaluation suite includes CSS-specific tasks. This is a known blindspot for web development use cases.

## Blindspot / Gap Analysis

1. **No CSS benchmark** → Cannot recommend a best model for CSS specifically. Must infer from general coding or JavaScript performance.
2. **Self-reported scores dominate open-weight evaluation** → Vendor tech reports are the source for DeepSeek V4, Qwen 3.6, and GLM-5.1 benchmarks. Third-party verification (AA, Arena) covers fewer open models.
3. **Enterprise workloads vs benchmark performance** → Arena measures what users ask in chat, which may not reflect enterprise development patterns.
4. **Latency and throughput** → Not covered by this scope. Critical for production deployment decisions.
5. **Regional model availability** → Chinese models (GLM, Qwen, Kimi) may have different data governance, availability, and censorship profiles not captured here.
6. **Safety and alignment** → Not in scope. A model's benchmark score does not reflect safety, factuality, or bias characteristics.

## Recommendations and Next Steps

1. **For the registry**: Use the pipeline architecture above with daily arena-ai-leaderboards fetch + weekly AA/HuggingFace updates. Store data in versioned JSON snapshots with source provenance tags.

2. **For model selection**:
   - **Research**: Claude Opus 4.x Thinking or GPT-5.5 high
   - **Coding**: DeepSeek V4 Pro Max (best quality/$), Claude Opus 4.x (best on real-world GitHub issues)
   - **Thinking/reasoning**: GPT-5.5 (ARC-AGI-2 best), Claude Mythos/Opus 4.x (HLE/GPQA best), DeepSeek R1 (best open-weight math)
   - **Image generation**: GPT-Image-2 (best quality), FLUX Schnell or SDXL (best free), Qwen-Image 2512 (best Apache 2.0)
   - **Free API**: Kimi K2.6 via OpenRouter (best composite), DeepSeek V4 Flash (best coding/$)

3. **Key gap to address**: Add CSS coding evaluation via custom benchmark or contribution to Aider Polyglot's language coverage. Without this, CSS model quality is inferred from general coding benchmarks.

4. **Periodic review**: The field is evolving monthly. Automation pipeline should regenerate the registry at least weekly, with a manual review of new model additions.

## Confidence and Limits

- **High confidence**: General ranking tiers, top-3 models per category, availability of automation APIs, pricing ranges
- **Medium confidence**: Specific Elo margins between adjacent ranks, SWE-bench Pro comparisons across scaffolds, open-weight model rankings on Chinese benchmarks
- **Low confidence**: ARC-AGI-3 model hierarchy (too new), GPT-Image-2 pricing, CSS task performance, free API model roster stability

All scores are snapshots as of June 2026. The registry automation pipeline is designed to keep them current.
