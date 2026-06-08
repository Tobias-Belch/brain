---
title: 'Source Inventory'
---

# Source Inventory

| ID | Source | Type | Date | Quality | Contribution | Limitations |
|---|---|---|---|---|---|---|
| S1 | LMSYS Chatbot Arena / LMArena (arena.ai) | web | 2026-06 | high | Human-preference Elo rankings for overall text, coding, hard prompts, long-context. Methodology: Bradley-Terry on ~6M votes, 95% CIs, weekly refresh. | No official API; vote distribution skew; category definitions imprecise; Elo inflation over time |
| S2 | arena-ai-leaderboards (oolong-tea GitHub + api.wulong.dev) | web | 2026-06 | high | Structured JSON snapshots of Arena AI leaderboards. Free REST API, no auth, daily updates via GitHub Actions. | Unofficial/third-party project, no SLA |
| S3 | Artificial Analysis Intelligence Index v4.0 (artificialanalysis.ai) | web | 2026-06 | high | Composite of 10 benchmarks across Agents/Coding/General/Scientific Reasoning. Independent benchmarking, 533 models evaluated. | Free tier 1,000 req/day; custom composite index methodology may change |
| S4 | BenchLM.ai API | web | 2026-06 | medium | 248+ LLMs across 225 benchmarks with pricing. Category filtering. | 3s free-tier delay; proprietary composite score; no historical snapshots |
| S5 | LiveCodeBench (livecodebench.github.io + aggregators) | web | 2026-06 | high | Continuous fresh coding problems (LeetCode/AtCoder/Codeforces, 1000+ problems v6). Contamination-resistant. DeepSeek V4 Pro Max leads at 93.5%. | JS-rendered site; primarily Python; approaching saturation |
| S6 | SWE-bench Verified / Pro | web | 2026-06 | medium | Real GitHub issue patching. Verified (500 Python issues, contaminated) and Pro (1865 tasks, 41 repos, multi-language). | Contamination (Verified); scaffolding confound (Pro); Python monoculture issues |
| S7 | Scale AI SEAL Leaderboard (SWE-bench Pro) | web | 2026-06 | high | Standardized SWE-Agent scaffold vs. mini-swe-agent harness. Confidence intervals published. | Lags behind newest models; different scaffolds produce incomparable scores |
| S8 | Aider Polyglot Benchmark (aider.chat) | web | 2026-06 | high | 225 Exercism exercises across 6 languages. 2-attempt format. GPT-5 leads at 88.0%. | No CSS-specific tasks; Claude models underperform on this benchmark |
| S9 | HumanEval / HumanEval+ (EvalPlus) | web | 2026-06 | medium | 164 Python function benchmarks. Saturated (top 10 >95%). HumanEval+ has 80x more tests. | Fully saturated; Python-only; limited differentiation |
| S10 | ARC Prize Foundation (arcprize.org) | web | 2026-06 | high | ARC-AGI-2 (static pattern reasoning) and ARC-AGI-3 (interactive agentic reasoning). Cost-efficiency as first-class metric. | Self-reported scores; ARC-AGI-3 has only 7 submissions; $10K cost cap |
| S11 | GPQA Diamond, MATH-500, MMLU-Pro | web | 2026-06 | high | Graduate-level Q&A (94.6% top), competition math (99.4% top), enhanced MMLU (91.0% top). All near saturation. | Approaching ceiling for frontier models; limited differentiation |
| S12 | HLE (Humanity's Last Exam) | web | 2026-01 | high | 2500 expert-vetted questions. Claude Mythos leads at 64.7%. Published in Nature. | Still far from human baseline (~85%); expensive to evaluate |
| S13 | Arena AI Text-to-Image Arena | web | 2026-06 | high | Human-preference Elo for image generation. GPT-Image-2 swept all categories at +242 Elo gap. | Preliminary scores for new models; Elo varies by methodology |
| S14 | Artificial Analysis T2I and Editing Arenas | web | 2026-06 | high | Independent T2I and editing leaderboards with pricing data. | Different Elo scales than Arena AI; fewer models evaluated |
| S15 | ImagenWorld (arxiv 2603.27862) | paper | 2026 | high | Academic benchmark: 3.6K condition sets, 20K annotations, 6 tasks. GPT-Image-1 strongest overall. | Evaluated GPT-Image-1, not GPT-Image-2; 14 models tested |
| S16 | OpenRouter Free Models (openrouter.ai) | web | 2026-06 | high | 15+ free-tier models (Owl Alpha, Nemotron 3 Ultra, gpt-oss-120b, Kimi K2.6). | Free model roster rotates; mid-tier performers only |
| S17 | HuggingFace Leaderboard API / OpenEvals | web | 2026-06 | high | Programmatic access to benchmark leaderboards. OpenEvals/leaderboard-data Parquet file. | Gated datasets need auth; schema may change |
| S18 | OpenCompass / CompassAcademic | web | 2026-05 | medium | Full evaluation framework and biweekly leaderboard. Chinese-centric. | No programmatic API; requires GPU for self-evaluation |
| S19 | Papers with Code API | web | 2026 | medium | Academic SOTA tracking across ML benchmarks. Data dumps daily. | Community-contributed, not independently verified; LLM coverage less comprehensive |
| S20 | EvalScope (modelscope) | web | 2026 | medium | Evaluation framework with HTTP API service mode. Self-hosted. | Requires deploying target model; results are local files |
| S21 | DeepSeek V4 Pro Max / V4 Flash official | web | 2026-04 | high | MIT-licensed open-weight models. LCB 93.5%, SWE-bench 80.6%, 1.6T/49B active MoE. | Vendor-reported scores on some benchmarks |
| S22 | Qwen 3.5/3.6 Family (Alibaba) | web | 2026-02 | high | Apache 2.0. GPQA Diamond 88.4% (best-in-class open). 201 languages. | Some benchmarks vendor-reported |
| S23 | GLM-5/5.1 (Zhipu AI) | web | 2026-04 | high | MIT-licensed. SWE-Bench Pro 58.4% (beats GPT-5.4). Trained on Huawei Ascend chips. | Chinese-centric benchmarks |
| S24 | Kimi K2.6 (Moonshot AI) | web | 2026-05 | high | Modified MIT license. AA Intelligence Index #4 overall (54), tied with Anthropic/Google/OpenAI. | Modified license terms |
| S25 | Gemma 4 (Google DeepMind) | web | 2026-04 | high | Apache 2.0. 31B dense runs on consumer GPU. | Smaller model scale |
| S26 | Midjourney, DALL-E 3, FLUX pricing analysis | web | 2026-05 | medium | Per-image pricing data from multiple aggregators (ToolHalla, Digital Applied, TokenMix). | Pricing changes frequently; GPT-Image-2 pricing not confirmed |
