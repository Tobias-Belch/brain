---
title: 's-reasoning-benchmarks'
---

# Source Note: s-reasoning-benchmarks

## Metadata
- Source: Multiple (Artificial Analysis, BenchLM.ai, AI Stats, ARC Prize Foundation, Easy Benchmarks, LLM Stats, Scale Labs, PricePerToken, BenchmarkList, AgentMarketCap, TeamAI, Presenc AI)
- Date: 2026-06-08 (compilation); individual sources span 2025-2026
- Type: web (aggregate)
- Quality: high (multiple consistent sources; official benchmark publishers)

---

## 1. GPQA Diamond (Graduate-level Google-Proof Q&A)

**Status: Approaching saturation.** Top models clustered within ~1 point.

| Rank | Model | Score | Access | Date Reported |
|------|-------|-------|--------|---------------|
| 1 | Claude Mythos Preview (Anthropic) | 94.6% | Closed | 2026-04-07 |
| 2 | GPT-5.5 Pro (OpenAI) | 94.4% | Closed | 2026-04-23 |
| 3 | GPT-5.4 Pro (OpenAI) | 94.4% | Closed | 2026-03-05 |
| 4 | Gemini 3.1 Pro Preview (Google) | 94.3% | Closed | 2026-02-19 |
| 5 | Claude Opus 4.7 Adaptive (Anthropic) | 94.2% | Closed | 2026-04-16 |
| 6 | Gemini 3 Pro Deep Think (Google) | 93.8% | Closed | 2025-11-18 |
| 7 | GPT-5.5 (OpenAI) | 93.6% | Closed | 2026-04-23 |
| 8 | GPT-5.2 Pro (OpenAI) | 93.2% | Closed | 2025-12-11 |
| 9 | GPT-5.4 (OpenAI) | 92.8% | Closed | 2026-03-05 |
| 10 | GPT-5.2 (OpenAI) | 92.4% | Closed | 2025-12-11 |

**Top open-weight models:**
- DeepSeek V4 Pro Max (DeepSeek, MIT): 90.1%
- DeepSeek V4 Pro High (DeepSeek, MIT): 89.1%
- Qwen3.6 Max (Alibaba): 90.4%
- DeepSeek V4 Flash Max (DeepSeek, MIT): 88.1%
- Moonshot AI Kimi K2.5 (open weights): 87.6%

**Key Claims:**
- GPQA Diamond tests 198 PhD-level multiple-choice questions in physics, chemistry, biology. Human experts score ~65%; non-experts with web access score ~34%.
- The benchmark is largely saturated for frontier models. Multiple sources (vals.ai, BenchLM, TeamAI) note the diminishing utility of further hill-climbing.
- Extended thinking adds ~17 points vs. standard inference on the same model (Claude Opus 4.6: ~72% standard → 89.6% extended thinking).

---

## 2. MATH-500

**Status: Near saturation at 99%+ for top reasoning models.**

| Rank | Model | Score | Access | Date |
|------|-------|-------|--------|------|
| 1 | GPT-5 (high) (OpenAI) | 99.4% | Closed | 2026-05 |
| 2 | o3 (OpenAI) | 99.2% | Closed | 2026-05 |
| 3 | Grok 3 mini Reasoning (high) (xAI) | 99.2% | Closed | 2026-05 |
| 4 | o4 Mini (OpenAI) | 98.9% | Closed | 2026-05 |
| 5 | DeepSeek R1 (DeepSeek) | 98.3% | Open (MIT) | 2026-05 |
| 6 | MiniMax M1 (MiniMax) | 98.0% | Closed | 2026-05 |
| 7 | GLM-4.5 (Z.AI) | 97.9% | Open | 2026-05 |
| 8 | Qwen3 (Alibaba) | 97.5% | Open (Apache 2.0) | 2026-05 |
| 9 | o3 Mini (OpenAI) | 97.3% | Closed | 2026-05 |
| 10 | Kimi K2 (Moonshot AI) | 97.1% | Open | 2026-05 |

**Key Claims:**
- 500-problem subset of the MATH dataset, competition-level math across 6 domains.
- Average score across 110+ models: 82.5%; std dev 16.9 — wide spread despite top saturation.
- "Thinking" variants consistently outperform base models by 5-15 points on the same model family.
- Many open-weight models (DeepSeek R1, Qwen3, GLM-4.5) reach 97%+, close to closed frontier.

---

## 3. MMLU-Pro

**Status: Saturated at ~90%.**

| Rank | Model | Score | Access | Date |
|------|-------|-------|--------|------|
| 1 | Gemini 3.1 Pro Preview (Google) | 91.0% | Closed | 2026-02 |
| 2 | Gemini 3 Pro Preview high (Google) | 89.8% | Closed | 2025-11 |
| 3 | Qwen3.7 Max (Alibaba) | 89.6% | Closed | 2026-05 |
| 4 | Claude Opus 4.5 Thinking (Anthropic) | 89.5% | Closed | 2025-11 |
| 5 | Gemini 3 Flash Preview Thinking (Google) | 89.0% | Closed | 2025-12 |
| 6 | Qwen3.6 Plus (Alibaba) | 88.5% | Closed | 2026-04 |
| 7 | DeepSeek V4 Pro Max (DeepSeek) | 87.5% | Open (MIT) | 2026-05 |

**Key Claims:**
- Enhanced MMLU: 12,000 graduate-level questions across 14 subjects, 10 answer options.
- Vals.ai notes this benchmark is "largely saturated — diminishing utility to model providers continuing to hill climb."
- 195+ models evaluated; average score 74.7%.
- Models with extended thinking score 2-5% higher than base variants on same architecture.

---

## 4. ARC-AGI-2 (Abstract Pattern Reasoning)

**Status: The most differentiating benchmark for frontier reasoning models.** Top scores still well below human panel (~60% individual, 100% panel).

| Rank | Model | Score | Access | Date |
|------|-------|-------|--------|------|
| 1 | GPT-5.5 (OpenAI) | 85.0% | Closed | 2026-05 |
| 2 | Gemini 3.1 Pro (Google) | 84.6% | Closed | 2026-02 |
| 3 | GPT-5.4 Pro (OpenAI) | 83.3% | Closed | 2026-03 |
| 4 | Gemini 3.1 Pro Preview (Google) | 77.1% | Closed | 2026-02 |
| 5 | Claude Opus 4.7 Adaptive (Anthropic) | 75.8% | Closed | 2026-04 |
| 6 | GPT-5.4 (OpenAI) | 72.1% | Closed | 2026-03 |
| 7 | Grok 4.20 (xAI) | 53.3% | Closed | 2026-02 |
| 8 | GPT-5.2 (OpenAI) | 52.9% | Closed | 2025-12 |
| 9 | Gemini 3 Pro Deep Think (Google) | 45.1% | Closed | 2025-11 |
| 10 | Claude Opus 4.6 (Anthropic) | 38.0% | Closed | 2026-02 |

**Key Claims:**
- Designed to resist pattern memorization; tests genuine fluid intelligence.
- Human panel completion rate: 100%; average individual human performance: ~60-66%.
- Pure LLMs without task-specific training score near 0%. Even frontier reasoning models score 13-85%.
- ARC-AGI-3 (released 2026) is interactive — first benchmark requiring agents to act in dynamic environments. Frontier models at launch: Claude Opus 4.6 Max 0.50%, Gemini 3.1 Pro 0.40%, GPT-5.4 0.20%, Grok 4.20 0.10%.
- Grand prize ($1M+) remains unclaimed. $2M total prize pool for 2026 (ARC-AGI-2 + ARC-AGI-3 tracks).

---

## 5. AIME 2025 & 2026 (American Invitational Mathematics Examination)

**Status: AIME 2025 nearing saturation (100% possible). AIME 2026 still differentiating.**

### AIME 2025

| Rank | Model | Score | Access |
|------|-------|-------|--------|
| 1 | GPT-5.2 Pro (OpenAI) | 100.0% | Closed |
| 2 | GPT-5 Codex high (OpenAI) | 100.0% | Closed |
| 3 | Gemini 3 Flash Preview Reasoning (Google) | 100.0% | Closed |
| - | *Multiple models tied at 100%* | | |
| 6 | Gemini 3 Pro Preview high (Google) | 99.8% | Closed |
| 7 | Qwen3.6 Plus (Alibaba) | 99.7% | Closed |
| 8 | DeepSeek V3.2 Speciale (DeepSeek) | 99.6% | Open |
| 9 | Qwen3-32B Thinking (Alibaba) | 99.2% | Open |
| 10 | Claude Sonnet 4.6 (Anthropic) | 99.0% | Closed |

### AIME 2026

| Rank | Model | Score | Access |
|------|-------|-------|--------|
| 1 | Kimi K2.6 (Moonshot AI) | 96.4% | Open |
| 2 | Qwen3.6 Plus (Alibaba) | 95.3% | Closed |
| 3 | GLM-5.1 (Z.AI) | 95.3% | Open |
| 4 | DeepSeek V3.2 (DeepSeek) | 94.2% | Open |
| 5 | Qwen3.6 27B (Alibaba) | 94.1% | Open |

**Key Claims:**
- AIME tests 30 olympiad-level math problems (integer answers 000-999).
- AIME 2025 is nearly saturated at the top, but spread across 171 models is large (mean 53.2%, std 30.9).
- Open-weight models Kimi K2.6 (96.4%) and Qwen3.6 Plus (95.3%) lead AIME 2026 — a notable shift toward Chinese labs producing top open-weight math reasoning.

---

## 6. HLE (Humanity's Last Exam)

**Status: The hardest closed-ended academic benchmark; still low ceiling (~65%).**

| Rank | Model | Score | Access | Date |
|------|-------|-------|--------|------|
| 1 | Claude Mythos Preview w/ tools (Anthropic) | 64.7% | Closed | 2026-04 |
| 2 | GPT-5.4 Pro w/ tools (OpenAI) | 58.7% | Closed | 2026-03 |
| 3 | Muse Spark Contemplating (Meta) | 58.4% | Closed | 2026-04 |
| 4 | GPT-5.5 Pro w/ tools (OpenAI) | 57.2% | Closed | 2026-04 |
| 5 | Claude Opus 4.7 w/ tools (Anthropic) | 54.7% | Closed | 2026-04 |
| 6 | Claude Opus 4.6 (Anthropic) | 53.1% | Closed | 2026-02 |
| 7 | GLM-5.1 w/ tools (Z.AI) | 52.3% | Open | 2026-05 |
| 8 | GPT-5.5 w/ tools (OpenAI) | 52.2% | Closed | 2026-04 |
| 9 | GPT-5.4 w/ tools (OpenAI) | 52.1% | Closed | 2026-03 |
| 10 | Gemini 3.1 Pro Preview (Google) | 51.4% | Closed | 2026-02 |

**Key Claims:**
- 2,500 expert-vetted questions across math, sciences, humanities. Designed to be the final closed-ended academic benchmark.
- Human expert baseline ≈ 85%. Top model (Claude Mythos Preview, 64.7%) is still 20 points below expert human.
- Published in Nature (Jan 2026); rolling additions to prevent overfitting.
- Tools/search access significantly boosts scores (e.g., Claude Opus 4.6: 53% with tools vs ~19% without).
- Open-weight leader: GLM-5.1 at 52.3%. DeepSeek V4 Pro Max at 37.7%.

---

## 7. Thinking / Extended Reasoning Mode Comparisons

**Key finding: Enabling chain-of-thought / extended thinking adds 5-17 points on reasoning benchmarks on the same model.**

### GPQA Diamond: Thinking vs. Non-Thinking

| Model | Standard Mode | Extended Thinking | Delta |
|-------|--------------|-------------------|-------|
| Claude Opus 4.6 | ~72% | 89.6% | +17.6 pts |
| Claude Opus 4.7 | ~88.5% (non-reasoning high) | 94.2% (adaptive) | +5.7 pts |
| DeepSeek V3.1 | 74.9% (non-thinking) | 80.1% (thinking) | +5.2 pts |

### MATH-500: Top Thinking Variants

| Model | Score | Mode |
|-------|-------|------|
| Claude Sonnet 4 Thinking | 99.0% | Thinking |
| Qwen3 235B A22B Thinking 2507 | 98.4% | Thinking |
| Claude Opus 4 Thinking | 98.0% | Thinking |
| Gemini 2.5 Flash Thinking | ~97% | Thinking |

### Key Claims on Thinking Modes:

- **Claude (Anthropic):** "Hybrid reasoning" — up to 128K thinking tokens with token budget control. Extended thinking most effective at 8K-16K tokens; diminishing returns beyond that.
- **o3 (OpenAI):** Private chain-of-thought with compute settings (low/medium/high). Less transparent but achieves best results on math (AIME 2025 96.7% high compute).
- **Gemini Deep Think (Google):** "Consider multiple hypotheses before responding." Leads ARC-AGI-2 (84.6%) and AIME 2025 (99.2%) in Deep Think mode.
- **DeepSeek R1:** Open-weight explicit CoT. Competitive with closed models on math/code at ~1/20th cost.
- **Logarithmic returns:** First 8K-16K thinking tokens capture most accuracy gain; beyond that, diminishing returns.

---

## 8. Open-Weight vs Closed-Source Summary

### Open-Weight Leaders (by benchmark)
- **GPQA Diamond:** DeepSeek V4 Pro Max 90.1%, Qwen3.6 Max 90.4%
- **MATH-500:** DeepSeek R1 98.3%, GLM-4.5 97.9%, Qwen3 97.5%
- **MMLU-Pro:** DeepSeek V4 Pro Max 87.5%, Qwen3.5 397B 87.8%
- **AIME 2026:** Kimi K2.6 96.4%, GLM-5 95.8%, DeepSeek V3.2 94.2%
- **HLE:** GLM-5.1 52.3%, Kimi K2.6 36.4%, DeepSeek V4 Pro Max 37.7%
- **ARC-AGI-2:** Only closed models have reported scores.

### Cost Comparison (per 1M tokens, input/output)
- **DeepSeek V3.2:** $0.28 / $0.42 — ~20-50x cheaper than frontier closed models
- **Gemini 3.1 Pro:** $2.00 / $12.00
- **GPT-5.4:** $2.50 / $15.00-$20.00
- **Claude Opus 4.7:** $15.00 / $60.00 (highest premium)

### Cost-Performance Frontier Observations
- DeepSeek V4 Pro achieved highest BenchLM composite score (85) vs GPT-5.5 (82) and Claude Opus 4.7 (73), driven by price-to-performance weighting.
- Sources agree: no single model dominates all benchmarks. Gemini 3.1 Pro leads aggregate benchmark count; GPT-5.4/5.5 leads knowledge work & browsing; Claude Opus 4.6/4.7 leads HLE and reasoning depth; DeepSeek V3.2/V4 leads cost-adjusted math.

---

## Limitations

- **Benchmark saturation:** GPQA Diamond, MMLU-Pro, MATH-500, and AIME 2025 are approaching or at ceiling for frontier models. They no longer differentiate meaningfully.
- **Mixed evaluation conditions:** Scores vary significantly based on tool use, search access, CoT budget, pass@k vs pass@1, and whether thinking mode is enabled. Cross-source comparisons must account for methodology differences.
- **Self-reported vs. verified:** Many scores on community leaderboards (LLM Stats, pricepertoken) are self-reported without independent verification.
- **BenchLM.ai composite:** Uses a proprietary weighting formula that includes price/performance, which may skew rankings toward cheaper models.
- **ARC-AGI-3 is too new** for reliable cross-model comparison (only 4 frontier models reported at launch).
- **AIME 2026 has limited data** (only 12 models reported on some leaderboards), making rankings provisional.
- **Open-weight models may be underrepresented** on certain benchmarks (especially ARC-AGI-2 and HLE) due to API access costs for evaluation.

---

## Secondary Leads

1. **AgentMarketCap** (agentmarketcap.ai) — regular extended thinking benchmark comparisons with latency and cost analysis
2. **Artificial Analysis** (artificialanalysis.ai) — standardized benchmark evaluations across 500+ models with speed/price data
3. **ARC Prize Foundation** (arcprize.org) — ARC-AGI-3 official leaderboard and competition updates
4. **Scale Labs Leaderboard** (labs.scale.com) — HLE with confidence intervals and calibration error
5. **BenchLM.ai** (benchlm.ai) — composite reasoning leaderboard with MuSR, LongBench v2, MRCRv2, Graphwalks
6. **Presenc AI** (presenc.ai) — open-weight reasoning model leaderboard with deployment guidance
7. **Easy Benchmarks** (easy-benchmarks.com) — aggregate benchmark data with speed and price blended scores
8. **AgentMarketCap Routing Analysis** — R2-Reasoner framework for cost-optimized model routing (84.46% cost reduction)
