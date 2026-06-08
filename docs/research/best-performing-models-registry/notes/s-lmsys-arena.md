---
title: 's-lmsys-arena'
---

# Source Note: s-lmsys-arena

## Metadata
- Source: LMSYS Chatbot Arena / LMArena (https://arena.ai/, formerly https://chat.lmsys.org)
- Date: 2026-06-08 (multiple snapshots cited: May 14, Apr 6, Jun 2)
- Type: web (crowdsourced human-preference benchmark aggregator)
- Quality: high

## Key Claims

1. **Overall Text Leaderboard (May–Jun 2026):** Claude Opus 4.x Thinking variants dominate the top, with Claude Opus 4.8 at ~1512 Elo, followed by Gemini 3.1 Pro (~1505), GPT-5.5-high (~1506), and Claude Opus 4.7/4.6 variants in the 1490–1505 band. Anthropic holds 4 of the top 5 slots. The 1500 Elo barrier was crossed for the first time in early 2026.

2. **Coding Leaderboard (Apr 2026):** Claude Opus 4.6 leads at 1549 Elo, ahead of Claude Opus 4.7 (1531), GPT-5.4 High (1518), Gemini 3.1 Pro (1501), and DeepSeek V4 Pro (1488). "Coding lift" — the Elo delta between coding and general boards — is strongest for Claude (+45) and DeepSeek (+40); Gemini's coding Elo is slightly below its general (inverted delta of -5).

3. **Hard Prompts category:** Defined by prompts scoring 6+ on 7 hardness criteria (specificity, domain knowledge, complexity, problem-solving, creativity, technical accuracy, real-world application). Hard prompts leaders tend to be the frontier models: Claude Opus 4.x Thinking, GPT-5.x-high, Gemini 3.x Pro. The category was introduced in May 2024.

4. **Long-Context:** Gemini 3.x Pro leads with up to 2M token context window. Claude Opus 4.x (1M context) and GPT-5.x (400K-1M) follow. No separate long-context Elo board is published as a standalone leaderboard; this capability is inferred from context window specs and the "longer query" sub-leaderboard.

5. **Methodology:** Bradley-Terry model (not online Elo) fitted on ~6M+ cumulative blind pairwise human votes since May 2023. Scores reported with 95% confidence intervals. Leaderboard refreshes weekly. Categories are defined by filtering votes where the user's prompt matches that category (e.g., code-related prompts feed the coding sub-rating). Hard Prompts uses a Llama-3-70B-Instruct classifier to label prompts against 7 criteria; prompts with score >= 6 are included.

6. **Elo bands (Jun 2026):** 1510+ = Frontier #1 (Claude Opus 4.8), 1500 = Frontier (Gemini 3.1 Pro, GPT-5.5 Pro), 1450 = Frontier-adjacent (DeepSeek V4 Pro, Qwen 3.7 Max), 1400 = Strong (GPT-4.1, Claude Sonnet 4), 1300 = Capable (Llama 4 Maverick, Mistral Large 3). A 100-Elo gap means ~64% head-to-head win rate; 200-Elo gap means ~76%.

7. **Open-vs-closed gap narrowing:** Best open model (DeepSeek V4 Pro, 1462 Elo) trails top closed model (1504) by 42 Elo, down from 138 Elo in Q4 2024. At current rates, parity is plausibly a 2027 event.

8. **All-time Elo progression:** Top Elo has increased from ~1253 (GPT-4 Turbo, Q4 2023) → ~1340 (GPT-4o, Q4 2024) → ~1462 (Claude 4.5 Opus, Q4 2025) → ~1512 (Claude Opus 4.8, Q2 2026). Annualized gain ~100 Elo/year.

## Evidence Extracts

1. **Top 25 Text Leaderboard (May 14, 2026)** from Presenc AI / arena.ai:
   - #1 Claude Opus 4.6 Thinking: 1502 ± 5 (24,925 votes)
   - #2 Claude Opus 4.7 Thinking: 1501 ± 6 (10,413 votes)
   - #3 Claude Opus 4.6: 1498 ± 4 (26,459 votes)
   - #4 Claude Opus 4.7: 1492 ± 6 (11,006 votes)
   - #5 Muse Spark (Meta): 1491 ± ? (Preliminary)
   - #6 Gemini 3.1 Pro Preview: 1490 ± 4 (31,012 votes)
   - #7 Gemini 3 Pro: 1486 ± 4 (41,339 votes)
   - #8 GPT-5.5-high: 1484 ± 7 (7,877 votes)
   - #9 Grok 4.20 β1: 1479 ± 5 (20,258 votes)
   - #10 GPT-5.4-high: 1479 ± 5 (18,521 votes)

2. **Coding Leaderboard (Apr 6, 2026)** from Swfte AI / lmarena-ai:
   - #1 Claude Opus 4.6: 1549 ± 6-7 (41.2K votes)
   - #2 Claude Opus 4.7 (preview): 1531 ± 9-10 (18.4K votes)
   - #3 GPT-5.4 High: 1518 ± 5 (52.7K votes)
   - #4 Gemini 3.1 Pro: 1501 ± 6 (38.9K votes)
   - #5 DeepSeek V4 Pro: 1488 ± 7 (22.1K votes)
   - #6 Grok 4.20: 1465 ± 8-9 (14.6K votes)

3. **Coding vs General delta (Apr 6, 2026):** Claude Opus 4.6 Thinking: +45 (1504→1549), GPT-5.4 High: +37 (1484→1521), Gemini 3.1 Pro: -5 (1493→1488), DeepSeek V4 Pro: +40 (1462→1502), Grok 4.20: -15 (1471→1456).

4. **Historical top Elo trajectory** (Swfte AI):
   - Q4 2023: GPT-4 Turbo 1253
   - Q2 2024: Claude 3 Opus 1253 / GPT-4o 1287
   - Q4 2024: GPT-4o 1340
   - Q2 2025: Gemini 2.5 Pro 1411
   - Q4 2025: Claude 4.5 Opus 1462
   - Q2 2026: Claude Opus 4.6 Thinking 1504

5. **OpenLM.ai aggregated table (Jun 1, 2026):** GPT-5.5-high: 1506 overall / 1562 coding; Claude Opus 4.7 Thinking: 1505 / 1565; Gemini 3.1 Pro: 1505 / 1531; Gemini 3.5 Flash: 1504 / 1535; Claude Opus 4.7: 1503 / 1554.

6. **Elo bands (Jun 2026)** from Swfte AI: 1510+ frontier #1, 1500 frontier, 1450 frontier-adjacent, 1400 strong, 1300 capable, 1200 solid daily, 1100 light tasks, <1100 legacy.

7. **Bradley-Terry methodology** (LMSYS org, OpenLM.ai): "Bradley–Terry model is also based on pairwise comparison to derive ratings of players to estimate win rate between each other. The core difference vs the online Elo system is the assumption that player's performance does not change and the computation takes place in a centralized fashion." Elo computed via bootstrap-like technique shuffling data and sampling scores from 1000 permutations.

8. **Hard Prompts methodology** (LMSYS blog, May 2024): Seven criteria evaluated by Llama-3-70B-Instruct classifier — specificity, domain knowledge, complexity, problem-solving, creativity, technical accuracy, real-world application. Hardness score = count of criteria satisfied. Prompt with score >= 6 included (~20% of all prompts).

## Limitations

1. **Vote distribution skew:** The leaderboard reflects what *Arena users* ask, not necessarily what enterprise workloads look like. Simple/greeting prompts are down-sampled but still present. Categories (coding, hard prompts) filter by user-declared or inferred prompt type, which is noisy.

2. **Confidence intervals matter for close comparisons:** Many top-10 models have overlapping 95% CIs. A 3-5 Elo difference between adjacent ranks is often statistically insignificant. The CI shrinks with vote count (Claude Opus 4.5 at 56K votes has ±3 Elo; GPT-5.5-instant at 4.9K votes has ±8 Elo).

3. **Category definitions are imprecise:** "Coding" sub-board relies on users classifying their prompt as code-related, or system inference. No formal benchmark suite; real-world but uncontrolled. "Hard prompts" uses LLM-judged criteria which may have its own biases.

4. **No official API:** Arena AI (arena.ai) does not provide a public API. Data must be scraped or obtained via third-party archives (oolong-tea GitHub, Apify scraper, OpenLM.ai mirror).

5. **Elo inflation:** Scores are not comparable across time periods. A 1300 Elo model in early 2026 is "mid-tier" whereas 1300 in 2023 was top-tier. The top Elo has risen ~260 points from Q4 2023 to Q2 2026.

6. **Single human-preference metric:** Arena measures what users prefer, not task-specific correctness, safety, reliability, or latency. A model that writes more fluent but factually wrong answers may outrank a more accurate but drier model. Cross-reference with benchmarks (MMLU-Pro, SWE-bench, GPQA) recommended.

7. **Preliminary scores:** New models (e.g., Muse Spark at #5, GPT-5.5 variants) have low vote counts and wide CIs. Ranks for models with <10K votes should be treated as provisional.

8. **Partial snapshot coverage:** Different sources report different snapshots (May 14, Apr 6, Jun 2). The leaderboard refreshes weekly, so any single snapshot is stale within days.

## Secondary Leads

1. **Official live board:** https://arena.ai/leaderboard/text/ — the authoritative source
2. **HF Space (lmarena-ai):** https://huggingface.co/spaces/lmarena-ai/arena-leaderboard — official mirror with same data
3. **Programmatic API (community):** https://github.com/oolong-tea-2026/arena-ai-leaderboards — daily JSON snapshots + REST API at https://api.wulong.dev/arena-ai-leaderboards/v1/leaderboard?name=text (no auth, free)
4. **Apify scraper:** https://apify.com/jungle_synthesizer/lmarena-llm-leaderboard-scraper — structured JSON output via API
5. **OpenLM.ai aggregated table:** https://openlm.ai/chatbot-arena/ — combines Arena Elo with AAII, MMLU-Pro, ARC-AGI
6. **Swfte AI analysis (coding deep dive):** https://www.swfte.com/blog/lmsys-coding-leaderboard-2026-deep-dive — coding leaderboard with SWE-bench/Terminal-Bench crosswalk
7. **Historical tracker (CSV):** https://github.com/AgileWoW/lmsys-arena-leaderboard-tracker — 2026 historical Elo data as CSV
8. **Hugging Face dataset (lmsys):** https://huggingface.co/datasets/lmsys/chatbot_arena_conversations — 33K cleaned conversations with pairwise human preferences (Apr–Jun 2023)
9. **LMSYS methodology paper:** https://arxiv.org/abs/2406.19042 — "Chatbot Arena: An Open Platform for Evaluating LLMs by Human Preference" (2024)
10. **LMArenaBridge (stealth model access):** https://github.com/CloudWaddie/LMArenaBridge — OpenAI-compatible proxy to query LMArena models programmatically (requires auth token)
