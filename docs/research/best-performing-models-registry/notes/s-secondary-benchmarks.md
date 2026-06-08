---
title: 's-secondary-benchmarks'
---

# Source Note: s-secondary-benchmarks

## Metadata
- Source: Scale AI SEAL (labs.scale.com), ARC Prize Foundation (arcprize.org), LiveCodeBench (livecodebench.github.io), cross-referenced with BenchLM.ai, Artificial Analysis
- Date fetched: 2026-06-08
- Type: web (direct and aggregate)
- Quality: high (official primary sources where available; aggregate sources for JS-rendered leaderboards)

---

## 1. Scale AI SEAL Leaderboard — SWE-bench Pro (Public Dataset)

### Source: https://scale.com/leaderboard/swe_bench_pro_public
### Evaluation note: Standardized SWE-Agent scaffold vs. mini-swe-agent harness

**Full dataset:** 731 public tasks across 41 repos (Python, Go, TypeScript, JavaScript).

**Critical methodology distinction:** The leaderboard uses two different scaffolds, and scores are NOT comparable:
- **No asterisk**: Standard SWE-Agent scaffold, uncapped cost, 250-turn limit
- **Asterisk (\*)**: Mini-SWE-Agent harness (different scaffold)
- **Grayed rows**: Capped cost + 50-turn limit

### Standard SWE-Agent scaffold rankings (uncapped, 250 turns)

| Rank | Model | Score | CI |
|------|-------|-------|----|
| 3 | claude-opus-4-5-20251101 | 45.89% | ±3.60 |
| 4 | claude-4-5-Sonnet | 43.60% | ±3.60 |
| 4 | gemini-3-pro-preview | 43.30% | ±3.60 |
| 4 | claude-4-Sonnet | 42.70% | ±3.59 |
| 4 | gpt-5-2025-08-07 (High) | 41.78% | ±3.49 |
| 4 | gpt-5.2-codex | 41.04% | ±3.57 |
| 4 | claude-4-5-haiku | 39.45% | ±3.55 |
| 6 | qwen3-coder-480b-a35b | 38.70% | ±3.55 |
| 6 | minimax-2.1 | 36.81% | ±3.55 |
| 10 | gemini-3-flash | 34.63% | ±3.55 |
| 15 | gpt-5.2 | 29.94% | ±2.15 |
| 15 | kimi-k2-instruct | 27.67% | ±3.25 |
| 17 | qwen3-235b-a22b | 21.41% | ±2.25 |
| 18 | gpt-oss-120b | 16.20% | ±2.67 |
| 18 | deepseek-v3p2 | 15.56% | ±2.63 |
| 20 | gemma-3-27b-it | 11.38% | ±2.15 |
| 21 | llama3-1-405b-instruct | 11.18% | ±2.15 |
| 22 | glm-4.6 | 9.67% | ±2.15 |
| 23 | llama4-maverick-17b-instruct | 5.24% | ±1.24 |
| 25 | codestral-2405 | 1.51% | ±1.51 |

### Mini-SWE-Agent harness (\*) rankings (different scaffold, not comparable)

| Rank | Model | Score | CI |
|------|-------|-------|----|
| 1 | gpt-5.4 (xHigh)* | 59.10% | ±3.56 |
| 1 | Muse Spark* (Meta, NEW) | 55.00% | ±3.60 |
| 2 | claude-opus-4-6 (thinking)* | 51.90% | ±3.61 |
| 3 | gemini-3.1-pro (thinking)* | 46.10% | ±3.60 |

### Comparison with first discovery pass

The first pass (s-coding-benchmarks.md) captured the standard-SWE-Agent scaffold scores correctly (Opus 4.5 at 45.9%, Sonnet 4.5 at 43.6%, etc.) using BenchLM/llm-stats data. **New findings from direct Scale source:**

1. **Mini-SWE-Agent harness scores** (gpt-5.4 xHigh at 59.1%, Muse Spark at 55.0%, Opus 4.6 thinking at 51.9%) were **not captured** in the first pass. These represent newer models evaluated on a different scaffold — scores are ~13-14 points higher than the standard scaffold.

2. **Confidence intervals** are provided (±3.6 for most models) — useful for determining statistical significance of differences.

3. **Muse Spark (Meta)** marked as "NEW" on the leaderboard — Meta's latest model scoring 55.0% on mini-swe-agent.

### Private subset scores

- Claude Opus 4.1: 22.7% public → 17.8% private
- GPT-5: 23.1% public → 14.9% private

### Limitations

- The Scale SEAL board on the direct site appears to lag behind model releases — no Claude Mythos, Claude Opus 4.7/4.8, GPT-5.5, or DeepSeek V4 Pro scores on the standardized scaffold. These newer models report on SWE-bench Pro via **self-reported** leaderboards (Anthropic, OpenAI, BenchLM).
- BenchLM.ai reports Claude Mythos Preview at 77.8%, Claude Opus 4.8 at 69.2%, and Claude Opus 4.7 at 64.3% on SWE-bench Pro, but these use custom agent scaffolding (Anthropic's internal agent), not the standardized Scale SEAL scaffold.
- **Scaffolding confound is severe**: Mythos at 77.8% vs. Opus 4.5 at 45.9% on the same dataset — the gap is primarily scaffold-driven, not model capability alone.

---

## 2. ARC Prize Foundation — ARC-AGI-2 & ARC-AGI-3

### Source: https://arcprize.org/

### ARC-AGI-2 (Static abstract pattern reasoning, released 2025)

**Methodology:** 120 eval tasks (semi-private), calibrated via 400+ human participants. Measures fluid intelligence via novel grid-pattern reasoning. Efficiency (cost/task) is a first-class metric alongside score.

**Top models (June 2026):**

| Rank | Model | Score | Access | Notes |
|------|-------|-------|--------|-------|
| 1 | GPT-5.5 (OpenAI) | 85.0% | Closed | Grand prize threshold is >85% |
| 2 | Gemini 3.1 Pro (Google) | 84.6% | Closed | Deep Think mode |
| 3 | GPT-5.4 Pro (OpenAI) | 83.3% | Closed | |
| 4 | Gemini 3.1 Pro Preview (Google) | 77.1% | Closed | Standard mode |
| 5 | Claude Opus 4.7 Adaptive (Anthropic) | 75.8% | Closed | |
| 6 | GPT-5.4 (OpenAI) | 72.1% | Closed | |
| 7 | Grok 4.20 (xAI) | 53.3% | Closed | |
| 8 | GPT-5.2 (OpenAI) | 52.9% | Closed | |
| 9 | Gemini 3 Pro Deep Think (Google) | 45.1% | Closed | |
| 10 | Claude Opus 4.6 (Anthropic) | 38.0% | Closed | |

**Cost-efficiency note:** Gemini 3 Deep Think reached 84.6% but at ~$77/task vs. Gemini 3 Pro at $0.81/task for 31.1%. The ARC Prize Foundation treats efficiency as a defining metric of intelligence.

**Key comparison with first pass (s-reasoning-benchmarks.md):**
- The first pass had GPT-5.5 at 85.0% (#1) and Gemini 3.1 Pro (Deep Think) at 84.6% — confirmed by direct sources.
- Gemini 3 Pro Deep Think at 45.1% was not in the first pass table (was listed in the text as 84.6%, which is Gemini 3.1 Deep Think, not 3 Pro — this is a potential source of confusion across names).
- Human baseline: ~60-66% individual; 100% panel completion. The grand prize ($1M+) threshold of >85% remains unclaimed.

### ARC-AGI-3 (Interactive agentic reasoning, released March 25, 2026)

**Methodology:** First interactive reasoning benchmark. Agents must explore novel environments, acquire goals, build world models, and act. Score measures action efficiency against human baseline. Action budget: 5x human median.

**Official semi-private leaderboard scores (June 2026):**

| Rank | Model | Score | Cost/task | Date |
|------|-------|-------|-----------|------|
| 1 | Claude Opus 4.8 (High) | 1.52% | ~$10,000 | 2026-06-01 |
| 2 | Claude Opus 4.6 (Max) | 0.51% | ~$8,866 | 2026-06-01 |
| 3 | GPT-5.5 (High) | 0.43% | $10,000 | 2026-06-01 |
| 4 | Gemini 3.1 Pro (Preview) | 0.42% | ~$2,214 | 2026-06-01 |
| 5 | GPT-5.4 (High) | 0.21% | ~$5,187 | 2026-06-01 |
| 6 | Claude Opus 4.7 (High) | 0.18% | $10,000 | 2026-06-01 |
| 7 | Grok 4.20 (Beta Reasoning) | 0.09% | ~$3,775 | 2026-06-01 |

**Comparison with first pass (s-reasoning-benchmarks.md):**
- The first pass only had launch-day scores (Opus 4.6 Max at 0.50%, Gemini 3.1 Pro at 0.40%, GPT-5.4 at 0.20%, Grok 4.20 at 0.10%).
- **New findings:** Claude Opus 4.8 (High) now leads at 1.52% — triple the next best, but still astronomically far from human performance.
- GPT-5.5 (High) at 0.43% and Claude Opus 4.7 (High) at 0.18% were not in the first pass.
- All scores remain below 2% — ARC-AGI-3 is nowhere near saturation.
- Only systems costing <$10,000 to run are shown. The $10,000 cap is itself a limitation — several models hit the boundary.

### Limitations

- ARC-AGI-2 scores are self-reported by model providers via the ARC Prize Foundation's verification process — no independent audit for most results.
- ARC-AGI-3 leaderboard has very few submissions (only 7 models shown) — the benchmark is too new and too expensive to run.
- Community leaderboard exists for harness-driven approaches but is explicitly unverified.
- The $10,000 cap on the official leaderboard biases against approaches that could score higher with more compute.

---

## 3. LiveCodeBench (Official)

### Source: https://livecodebench.github.io/
### Data availability: JS-rendered — no direct scrape. Data sourced from BenchLM.ai, Artificial Analysis, vals.ai.

**Methodology:** Continuous collection of fresh competitive programming problems from LeetCode, AtCoder, Codeforces after model training cutoffs. Evaluates pass@1 code generation across Easy/Medium/Hard splits. Currently 1,000+ problems in v6.

**Official leaderboard data unavailable by direct scrape** — the leaderboard is rendered client-side via JavaScript. Data below from BenchLM.ai and Artificial Analysis, which cross-reference the official LCB API.

### Top models (LiveCodeBench pass@1, June 2026, via BenchLM.ai)

| Rank | Model | Provider | Score | License |
|------|-------|----------|-------|---------|
| 1 | DeepSeek V4 Pro (Max) | DeepSeek | 93.5% | Open (MIT) |
| 2 | Qwen3.7 Max | Alibaba | 91.6% | Proprietary |
| 2 | DeepSeek V4 Flash (Max) | DeepSeek | 91.6% | Open (MIT) |
| 4 | DeepSeek V4 Pro (High) | DeepSeek | 89.8% | Open (MIT) |
| 5 | Kimi K2.6 | Moonshot AI | 89.6% | Open (Modified MIT) |
| 6 | DeepSeek V4 Flash (High) | DeepSeek | 88.4% | Open (MIT) |

### Top models via Artificial Analysis

| Rank | Model | Provider | Score |
|------|-------|----------|-------|
| 1 | Gemini 3 Pro Preview (High) | Google | 91.7% |
| 2 | Gemini 3 Flash Preview (Reasoning) | Google | 90.8% |
| 3 | DeepSeek V3.2 Speciale | DeepSeek | 89.6% |

### Top models via ai-stats.vercel.app (LiveCodeBench V6 specifically)

| Rank | Model | Provider | Score |
|------|-------|----------|-------|
| 1 | Seed 2.0 Pro | — | 87.80% |
| 2 | Qwen 3.6 Plus | Alibaba | 87.10% |
| 3 | Step 3.5 Flash | StepFun | 86.40% |

### Comparison with first pass (s-coding-benchmarks.md)

- **Confirmed:** DeepSeek V4 Pro (Max) leads at 93.5% — this is consistent across multiple sources.
- **Score variance across sources:** Gemini 3.1 Pro ranges from 88.5% (vals.ai) to ~80% (other evals) depending on eval subset and settings. This is a known issue — methodology details matter.
- **LCB V6** (newer version with harder problems) shows lower scores: Seed 2.0 Pro at 87.8%, vs. main LCB where DeepSeek V4 Pro Max scores 93.5%. Different problem sets.
- **New models not in first pass:** Muse Spark (not on LCB), Claude Mythos (not on LCB), GPT-5.5 (not on LCB). LCB appears dominated by open-weight models — frontier closed models underperform or are not evaluated.

### Limitations

- Primary source (livecodebench.github.io) renders via JS — cannot be directly scraped. All tabular data is second-hand.
- Different evaluators (BenchLM, Artificial Analysis, vals.ai, ai-stats) report different scores for the same model due to different eval subsets, pass@k settings, and version (V5 vs V6).
- LCB is primarily Python/LeetCode-focused — not representative of multi-language software engineering.
- The benchmark appears to be approaching saturation at the top (top 3 within 1.9 points).

---

## 4. Cross-Source Comparison Table

| Benchmark | #1 Model | Score | #2 Model | Score | #3 Model | Score |
|-----------|----------|-------|----------|-------|----------|-------|
| SWE-bench Pro (SEAL std scaffold) | claude-opus-4-5 | 45.89% | claude-4-5-Sonnet | 43.60% | gemini-3-pro-preview | 43.30% |
| SWE-bench Pro (SEAL mini-swe-agent) | gpt-5.4 (xHigh) | 59.10% | Muse Spark | 55.00% | claude-opus-4-6 (thinking) | 51.90% |
| SWE-bench Pro (self-reported, any scaffold) | Claude Mythos Preview | 77.8% | Claude Opus 4.8 | 69.2% | Claude Opus 4.7 | 64.3% |
| ARC-AGI-2 | GPT-5.5 | 85.0% | Gemini 3.1 Pro (Deep Think) | 84.6% | GPT-5.4 Pro | 83.3% |
| ARC-AGI-3 | Claude Opus 4.8 (High) | 1.52% | Claude Opus 4.6 (Max) | 0.51% | GPT-5.5 (High) | 0.43% |
| LiveCodeBench (main) | DeepSeek V4 Pro (Max) | 93.5% | Qwen3.7 Max | 91.6% | DeepSeek V4 Flash (Max) | 91.6% |
| LiveCodeBench V6 | Seed 2.0 Pro | 87.80% | Qwen 3.6 Plus | 87.10% | Step 3.5 Flash | 86.40% |

---

## 5. Key Cross-Cutting Observations

1. **SWE-bench Pro is the most fragmented leaderboard** — scores depend entirely on which scaffold is used (SEAL std, mini-swe-agent, or provider-custom). The Mythos 77.8% vs. Opus 4.5 45.9% gap on the same dataset is mostly scaffold, not model.

2. **ARC-AGI-2 and ARC-AGI-3 tell opposite stories** — GPT-5.5 scores 85% on ARC-AGI-2 (near human ceiling) but 0.43% on ARC-AGI-3. These benchmarks measure fundamentally different capabilities (static pattern recognition vs. interactive agentic reasoning).

3. **LiveCodeBench is the most contamination-resistant** of the three, thanks to continuous fresh problems. It's also the most saturated — top open-weight models dominate and the gap is closing.

4. **No single model leads all three benchmarks** — DeepSeek V4 Pro Max leads LCB but isn't on SWE-bench Pro SEAL or ARC-AGI-2. GPT-5.5 leads ARC-AGI-2 and appears on SWE-bench Pro self-reported but isn't on LCB. Claude Opus 4.8 leads ARC-AGI-3.

5. **Cost-efficiency is rarely captured** — ARC-AGI-2/3 are the only benchmarks that factor cost into evaluation. SWE-bench Pro and LiveCodeBench report only quality scores, which can mask expensive brute-force approaches.

---

## 6. Emerging Models / Changes Since First Pass

| Model | First Pass Coverage | This Pass | Significance |
|-------|--------------------|-----------|————|
| Claude Mythos Preview | Noted at 93.9% SWE-bench Verified | Also leads SWE-bench Pro self-reported (77.8%) | Expands SWE dominance across benchmarks |
| Muse Spark (Meta) | Not covered | 55.0% on SEAL mini-swe-agent (NEW tag) | Meta's latest SWE entry |
| Claude Opus 4.8 | Not covered | 69.2% SWE-bench Pro, 1.52% ARC-AGI-3 (#1) | New frontier model from Anthropic |
| GPT-5.5 | Not on LCB or SWE-bench Pro | 85.0% ARC-AGI-2 (#1), 0.43% ARC-AGI-3, 88.7% SWE-bench Verified (self-reported) | Strongest overall reasoning across benchmarks |
| Seed 2.0 Pro | Not covered | 87.8% LCB V6 (#1) | New contender from unknown provenance |
| Step 3.5 Flash | Not covered | 86.4% LCB V6 (#3) | StepFun emerging |

---

## 7. Limitations Summary

- **Scaffolding confound (SWE-bench Pro):** Multiple scaffolds produce incomparable scores. Always check whether a score uses SEAL std, mini-swe-agent, or custom agent.
- **JS-rendered leaderboards (LiveCodeBench, ARC-AGI-3):** Cannot directly scrape; forced to rely on aggregators (BenchLM, Artificial Analysis, BenchmarkList) which may use different methodology.
- **Self-reported vs. verified:** ARC-AGI-2 includes self-reported scores; SWE-bench Pro self-reported scores (Anthropic, OpenAI) use custom scaffolding. Only Scale SEAL provides standardized, independent evaluation.
- **Version drift:** LiveCodeBench V5 vs V6 produces significantly different scores. ARC-AGI-3 scores change as new models are added. All scores are snapshots.
- **Cost ceiling:** ARC-AGI-3's $10,000/task cap excludes high-compute approaches.
- **Sparse coverage:** Many models appear on only one benchmark, making cross-benchmark comparison impossible (e.g., DeepSeek V4 Pro Max dominates LCB but has no ARC-AGI or SWE-bench Pro SEAL scores).
