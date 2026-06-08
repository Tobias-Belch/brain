---
title: 's-coding-benchmarks'
---

# Source Note: s-coding-benchmarks

## Metadata
- Source: multiple (see per-section)
- Date: 2026-06-08
- Type: web (aggregate)
- Quality: high — scores cross-referenced across BenchLM.ai, llm-stats.com, Morph, Artificial Analysis, Scale AI SEAL, and official model cards

---

## 1. LiveCodeBench

### Source: BenchLM.ai, llm-stats.com, vals.ai, Artificial Analysis
### Date range: May–June 2026

**Methodology:** Continuously updated benchmark sourcing fresh competitive programming problems from LeetCode, AtCoder, and CodeForces after each model's training cutoff. Evaluates code generation (pass@1), self-repair, code execution, and test output prediction. v6 now has 1000+ problems.

### Top Models (LiveCodeBench pass@1, June 2026)

| Rank | Model | Provider | Score | License |
|------|-------|----------|-------|---------|
| 1 | DeepSeek V4 Pro (Max) | DeepSeek | 93.5% | Open (MIT) |
| 2 | Qwen3.7 Max | Alibaba | 91.6% | Proprietary |
| 2 | DeepSeek V4 Flash (Max) | DeepSeek | 91.6% | Open (MIT) |
| 4 | DeepSeek V4 Pro (High) | DeepSeek | 89.8% | Open (MIT) |
| 5 | Kimi K2.6 | Moonshot AI | 89.6% | Open (Modified MIT) |
| 6 | DeepSeek V4 Flash (High) | DeepSeek | 88.4% | Open (MIT) |
| 7 | Kimi K2.5 | Moonshot AI | 85.0% | Open |
| 8 | GLM-4.7 | Z.AI | 84.9% | Open (MIT) |
| 9 | Qwen3.6-27B | Alibaba | 83.9% | Open |
| 10 | Gemini 3.1 Pro Preview | Google | 88.5%* | Proprietary |

*Note: vals.ai reports Gemini 3.1 Pro Preview at 88.48% in their independent eval; BenchLM and Artificial Analysis show different numbers due to different evaluation subsets/settings.

**Key Claims:**
- DeepSeek V4 Pro (Max) leads at 93.5% — the highest LiveCodeBench score ever recorded
- The top 3 are within 1.9 points, suggesting the benchmark is nearing saturation for frontier models
- 14 models on BenchLM; 71 tracked by llm-stats.com; 194 tracked by Artificial Analysis
- V4-Flash (Max) at $0.14/$0.28 per 1M tokens offers best price-performance ratio among top 3

### LiveCodeBench Pro (harder subset)

| Rank | Model | Score | License |
|------|-------|-------|---------|
| 1 | GPT-5.4 | 87.5% | Proprietary |
| 2 | Gemini 3.1 Pro | 82.9% | Proprietary |
| 3 | Muse Spark (Meta) | 80.0% | Open |

Source: BenchLM.ai, June 2, 2026. Only 6 models evaluated. Excludes LeetCode, uses Codeforces/ICPC/IOI problems.

### LiveCodeBench by platform (qualitative from vals.ai data)
- Models generally score higher on LeetCode problems, lower on Codeforces
- Hard problems show wider spread — DeepSeek V4 Pro Max separates from pack on hardest Codeforces problems
- No official per-language breakdown published, but problems are primarily Python solutions

---

## 2. SWE-bench Verified

### Source: SWE-bench.com, Scale AI SEAL, Vals.ai, CodeAnt.ai, OpenLM.ai
### Date range: April–June 2026

**Methodology:** 500 human-validated real GitHub issues from Python repos (Django, Flask, scikit-learn, etc.). Models must write patches that pass unit tests. Standard scaffold (mini-SWE-agent) used by most; SWE-bench Verified is now considered contaminated.

### Top Models (SWE-bench Verified, mini-SWE-agent scaffold)

| Rank | Model | Score | License | Date |
|------|-------|-------|---------|------|
| 1 | Claude Mythos Preview | 93.9% | Proprietary | Apr 2026 |
| 2 | Claude Opus 4.8 | 88.6% | Proprietary | May 2026 |
| 3 | Claude Opus 4.7 | 87.6% | Proprietary | Apr 2026 |
| 4 | GPT-5.5 | 82.6% | Proprietary | Apr 2026 |
| 5 | Claude Opus 4.5 | 80.9% | Proprietary | Nov 2025 |
| 5 | Claude Opus 4.6 | 80.8% | Proprietary | Feb 2026 |
| 5 | DeepSeek V4 Pro Max | 80.6% | Open (MIT) | Apr 2026 |
| 5 | Gemini 3.1 Pro | 80.6% | Proprietary | Feb 2026 |
| 6 | MiniMax M2.5 | 80.2% | Open | Feb 2026 |
| 7 | GPT-5.4 | 79.2% | Proprietary | Mar 2026 |
| 8 | Kimi K2.6 | 80.0%+ | Open (Modified MIT) | Apr 2026 |

### Top Models (SWE-bench Pro / SEAL — 731 public tasks, multi-language)

| Rank | Model | Score | CI |
|------|-------|-------|----|
| 1 | Claude Opus 4.5 | 45.9% | ±3.60 |
| 2 | Claude Sonnet 4.5 | 43.6% | ±3.60 |
| 3 | Gemini 3 Pro | 43.3% | ±3.60 |
| 4 | Claude Sonnet 4 | 42.7% | ±3.59 |
| 5 | GPT-5 (High) | 41.8% | ±3.49 |

**Key Claims:**
- SWE-bench Verified is widely considered contaminated — OpenAI publicly stated they stopped evaluating on it
- SWE-bench Pro has 1,865 tasks across 41 repos in Python, Go, TypeScript, JavaScript — better language coverage
- Mythos Preview (93.9%) uses custom scaffolding — not directly comparable to standard scaffold scores
- Six frontier models are within 1.3% of each other on Verified (80.2–80.9%), making harness/agent the differentiating factor

---

## 3. Aider Polyglot Benchmark

### Source: aider.chat, llm-stats.com, BenchGecko, AgentMarketCap
### Date range: Dec 2024 – June 2026

**Methodology:** 225 challenging Exercism exercises across 6 languages (JS 49, Java 47, Go 39, Python 34, Rust 30, C++ 26). Two-attempt format: model gets test error feedback after first attempt. Tests code generation + editing.

### Top Models

| Rank | Model | Score | License | Cost (total run) |
|------|-------|-------|---------|-----------------|
| 1 | GPT-5 (high) | 88.0% | Proprietary | $29.08 |
| 2 | GPT-5 (medium) | 86.7% | Proprietary | $17.69 |
| 3 | o3-pro (high) | 84.9% | Proprietary | $146.32 |
| 4 | Gemini 2.5 Pro Preview 06-05 | 82.2% | Proprietary | — |
| 5 | o3 | 81.3% | Proprietary | — |
| 6 | Grok 4 | 79.6% | Proprietary | — |
| 7 | Gemini 2.5 Pro | 76.5% | Proprietary | $1.25/$10 |
| 8 | DeepSeek V3.2 | 74.5% | Open | — |
| 9 | DeepSeek R1-0528 | 71.6% | Open | $0.55/$2.19 |
| 10 | o4-mini | 68.9% | Proprietary | — |

**Key Claims:**
- GPT-5 leads with 88.0% — only 12 points from saturation
- Python has the fewest problems (34/225) — deliberately designed to test multi-language ability
- Strong JavaScript and Java performance correlates with enterprise coding needs
- DeepSeek V3.2 (74.5%) is best open-weight option; Kimi K2 (60.0%) also strong
- Claude models notably absent from top 10 on this benchmark — Opus 4 scores 72.0%, 3.7 Sonnet at 64.9%
- 53 models evaluated total per BenchGecko

---

## 4. Codeforces Ratings (Competitive Programming)

### Source: DeepInfra (DeepSeek V4 Pro Max), Codersera, DesignforOnline
### Date range: April–June 2026

**Methodology:** AI models participate in Codeforces contests and receive standard Elo ratings. Measures algorithmic problem-solving under time pressure on problems rated 800–2400 difficulty.

### Top Models (Codeforces Elo)

| Model | Codeforces Rating | License |
|-------|------------------|---------|
| DeepSeek V4 Pro Max | 3206 | Open (MIT) |
| GPT-5.5 | 3168 | Proprietary |
| Gemini 3.1 Pro High | ~3100 (estimated) | Proprietary |
| Claude Opus 4.6 | ~2900 (estimated) | Proprietary |

**Key Claims:**
- DeepSeek V4 Pro Max achieves 3206 Codeforces rating — competitive with top human Grandmasters
- GPT-5.5 at 3168 per cross-referenced reports
- Open-weight models are now competitive or superior on competitive programming vs proprietary
- Evaluation methodology has known biases (per arXiv 2602.05891 — "When Elo Lies")
- Only 4 models with verified Codeforces ratings per BenchLM.ai

---

## 5. HumanEval / HumanEval+

### Source: lmmarketcap.com, llm-stats.com, EvalPlus paper
### Date range: May–June 2026

**Methodology:** HumanEval: 164 Python function-generation problems (pass@1). Widely considered saturated — frontier models all score 90%+. HumanEval+: same 164 problems with 80x more test cases (EvalPlus extension). Much wider spread.

### HumanEval Top Scores (pass@1)

| Rank | Model | Score | License |
|------|-------|-------|---------|
| 1 | GPT-5.4 | 97.5% | Proprietary |
| 2 | o3 | 97.0% | Proprietary |
| 2 | GPT-5.2 | 97.0% | Proprietary |
| 4 | GPT-5.1 | 96.8% | Proprietary |
| 5 | GPT-5 | 96.5% | Proprietary |
| 6 | Claude Opus 4.6 | 96.0% | Proprietary |
| 6 | Gemini 3 Pro | 96.0% | Proprietary |
| 8 | Grok 4 | 95.5% | Proprietary |
| 9 | Claude Opus 4.5 | 95.2% | Proprietary |
| 10 | Claude Sonnet 4.6 | 95.2% | Proprietary |

### HumanEval+ Top Scores

| Rank | Model | Score | License |
|------|-------|-------|---------|
| 1 | Phi 4 Reasoning (Microsoft) | 92.9% | Open |
| 2 | Phi 4 Reasoning Plus | 92.3% | Open |
| 3 | Granite 3.3 8B (IBM) | 86.1% | Open |
| 4 | Phi 4 | 82.8% | Open |

**Key Claims:**
- HumanEval saturated — top 10 models all above 95%, no longer differentiates frontier models
- 51 models tracked on lmmarketcap, average 88.2%
- HumanEval+ shows much wider spread and catches "semantically wrong" code that passes HumanEval
- GPT-4 score drops from 88.4% on HumanEval to 76.2% on HumanEval+ (per EmergentMind analysis)
- OpenAI, Anthropic, and Google frontier models omit HumanEval from recent model cards — considered obsolete

---

## 6. Cross-Benchmark Summary

| Model | License | SWE-bench Verified | SWE-bench Pro (SEAL) | LiveCodeBench | Aider Polyglot | HumanEval |
|-------|---------|-------------------|---------------------|---------------|----------------|-----------|
| Claude Opus 4.6 | Proprietary | 80.8% | — | ~88.8% | ~72% | 96.0% |
| GPT-5.4 | Proprietary | 79.2% | — | ~89.4% | 88.0% | 97.5% |
| Gemini 3.1 Pro | Proprietary | 80.6% | 43.3% | 88.5% | ~78% | ~96% |
| DeepSeek V4 Pro Max | **Open (MIT)** | 80.6% | — | **93.5%** | — | — |
| DeepSeek V4 Flash Max | **Open (MIT)** | — | — | 91.6% | — | — |
| DeepSeek V3.2 | **Open** | ~73% | 15.6% | 83.3% | 74.5% | — |
| Kimi K2.6 | **Open** | ~80% | — | 89.6% | — | — |
| Qwen3.7 Max | Proprietary | — | — | 91.6% | — | — |

Prices for reference (input/output per 1M tokens):
- Claude Opus 4.6: $5/$25
- GPT-5.4: $2.50/$15
- Gemini 3.1 Pro: $2/$12
- DeepSeek V4 Pro Max: $1.74/$3.48
- DeepSeek V4 Flash Max: $0.14/$0.28
- Kimi K2.6: free / open-source self-host

---

## 7. TypeScript / JavaScript / CSS Coding Tasks

### Findings on language-specific breakdowns

**Aider Polyglot** is the best source for language-level detail. Problem distribution:
- JavaScript: 49 problems (largest category)
- Java: 47
- Go: 39
- Python: 34
- Rust: 30
- C++: 26

No CSS-specific benchmark identified in the Aider suite. However:

**SWE-bench Pro** includes TypeScript and JavaScript repos among its 41 repositories across 4 languages (Python, Go, TypeScript, JavaScript). CSS tasks would appear as part of web framework issues in those repos, but no separate CSS benchmark was found.

**Notable observations:**
- Models tend to score higher on JavaScript than on Rust/C++ in Aider (GPT-5 is strongest across all languages)
- Java and JavaScript are the largest language categories by problem count — deliberately designed to test enterprise-relevant languages
- SWE-bench Pro (Scale AI) has the best multi-language coverage among real-world bug-fixing benchmarks

---

## 8. Free / Open-Weight Model Summary

| Model | Key Benchmarks | Best Score | Cost (1M in/out) |
|-------|---------------|-----------|------------------|
| **DeepSeek V4 Pro Max** | LiveCodeBench 93.5%, SWE-bench 80.6% | LCB #1 | $1.74/$3.48 |
| **DeepSeek V4 Flash Max** | LiveCodeBench 91.6% | LCB #2 | $0.14/$0.28 |
| **Kimi K2.6** | LiveCodeBench 89.6%, SWE-bench ~80% | Competitive with GPT-5.4 | Free / self-host |
| **DeepSeek V3.2** | LiveCodeBench 83.3%, Aider 74.5% | Strong value | ~$0.27/$0.41 |
| **GLM-4.7** | LiveCodeBench 84.9% | Top Chinese open model | $0.40/$1.75 |
| **Kimi K2.5** | LiveCodeBench 85% | Good all-rounder | Free / self-host |
| **Qwen3.6-27B** | LiveCodeBench 83.9% | Strong small model | $0.00 self-host |
| **MiniMax M2.5** | SWE-bench 80.2% | Open-weight SWE leader | $0.30/$1.20 |

### Key Takeaways on Open vs Closed
- DeepSeek V4 Pro Max challenges proprietary models on LiveCodeBench — leads all models at 93.5%
- Open-weight models are now within 1% of proprietary on SWE-bench Verified (80.6% vs 80.8%)
- DeepSeek V4 Flash Max offers the best price-performance ratio in coding at $0.14/$0.28 per 1M tokens
- All top open-weight models are MIT or Modified MIT licensed
- No open-weight model yet matches Claude Mythos (93.9% SWE-bench) but that uses custom agent scaffolding, not comparable

---

## Limitations

- **Benchmark contamination:** SWE-bench Verified widely considered contaminated — OpenAI has stopped evaluating on it. LiveCodeBench is most contamination-resistant due to continuous fresh problems.
- **Scaffolding confounds:** SWE-bench scores depend heavily on agent scaffolding (mini-SWE-agent, SWE-agent, OpenHands). Mythos at 93.9% uses custom scaffolding, making direct comparison misleading.
- **Python monoculture:** SWE-bench Verified is 100% Python; Django alone is ~42% of issues. Aider Polyglot is corrective but not a full solution.
- **Cost differences:** Most leaderboards don't normalize for cost per task. DeepSeek V4 Flash Max achieves 91.6% LiveCodeBench at 1/12th the cost of Claude Opus 4.6.
- **Semantic errors:** ~19.78% of "solved" SWE-bench cases are semantically incorrect (pass tests by coincidence) per arXiv 2603.00520.
- **Static nature of some benchmarks:** HumanEval is fully saturated; MATH-500 nearing saturation for frontier models.
- **No CSS-specific benchmark:** CSS coding tasks are not independently benchmarked in any major evaluation suite.
- **Regional provider skew:** Different evaluators report different scores for same models (e.g., Gemini 3.1 Pro ranges 88.5% to 80.6% on LiveCodeBench depending on evaluator). Methodology details matter.

---

## Secondary Leads

- Scale AI SEAL Leaderboard (SWE-bench Pro standardized scaffold): https://scale.com/leaderboard/swe_bench_pro_public
- Aider Polyglot official leaderboard: https://aider.chat/docs/leaderboards/
- LiveCodeBench official: https://livecodebench.github.io/
- Artificial Analysis LiveCodeBench: https://artificialanalysis.ai/evaluations/livecodebench
- Vals.ai SWE-bench Verified: https://vals.ai/benchmarks/swebench
- OpenLM.ai SWE-bench leaderboard: https://openlm.ai/swe-bench/
- EvalPlus (HumanEval+): https://github.com/evalplus/evalplus
- Codeforces AI rating paper: https://arxiv.org/abs/2501.01257
- "When Elo Lies" (Codeforces bias analysis): https://arxiv.org/abs/2602.05891
- Semantic errors in SWE-bench: https://arxiv.org/pdf/2603.00520
