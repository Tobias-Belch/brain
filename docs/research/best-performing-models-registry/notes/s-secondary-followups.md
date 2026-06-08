---
title: 'Secondary Followups'
---

# Source Note: s-secondary-followups

## Arena-AI Leaderboard API (`api.wulong.dev`)

Two endpoints queried: `?name=text` and `?name=code`.

**Response structure:**
```json
{
  "meta": {
    "leaderboard": "text",            // or "code"
    "source_url": "https://arena.ai/leaderboard/text",
    "fetched_at": "2026-06-07T06:06:03.259999+00:00",
    "last_updated": "Jun 5, 2026",
    "model_count": 20
  },
  "models": [
    {
      "rank": 1,
      "model": "claude-opus-4-6-thinking",   // model slug
      "vendor": "Anthropic",
      "license": "proprietary",              // or "open"
      "score": 1504,                         // Elo-style rating (~1500 baseline)
      "ci": 4,                               // 95% confidence interval
      "votes": 39015                         // number of human preference votes
    }
  ]
}
```

Data is as of **Jun 5, 2026** (fetched 2026-06-07). Returns **top 20** per category. Scores are **Elo ratings** from blind pairwise human preference votes.

### Text Leaderboard — Top 5
| Rank | Model | Score | CI | Votes |
|------|-------|-------|----|-------|
| 1 | Claude Opus 4.6 Thinking | 1504 | 4 | 39,015 |
| 2 | Claude Opus 4.7 Thinking | 1501 | 5 | 24,871 |
| 3 | Claude Opus 4.6 | 1498 | 4 | 41,661 |
| 4 | Claude Opus 4.7 | 1493 | 5 | 25,814 |
| 5 | Muse Spark (Meta) | 1489 | 6 | 13,026 |

### Code Leaderboard — Top 5
| Rank | Model | Score | CI | Votes |
|------|-------|-------|----|-------|
| 1 | Claude Opus 4.7 Thinking | 1567 | 9 | 6,234 |
| 2 | Claude Opus 4.7 | 1557 | 9 | 5,788 |
| 3 | Claude Opus 4.8 Thinking | 1552 | 16 | 1,578 |
| 4 | Claude Opus 4.8 | 1545 | 14 | 2,011 |
| 5 | Claude Opus 4.6 Thinking | 1543 | 7 | 8,881 |

### Notable open models on arena-ai
- **GLM-5.1** (Z.ai): #14 text (1475), #8 code (1532) — top open model on both
- **Kimi K2.6** (Moonshot): #11 code (1516, open)
- **MiMo-V2.5-Pro** (Xiaomi): #19 code (1466, open)
- **Qwen3.7 Max**: #7 code (1537), #17 text (1474) — proprietary (Alibaba)

---

## Artificial Analysis Intelligence Index

Source: `artificialanalysis.ai/leaderboards/models` (fetched 2026-06-08).

**Methodology (v4.0):** Composite of 10 benchmarks across 4 equally-weighted categories (25% each):
- **Agents:** GDPval-AA, τ²-Bench Telecom
- **Coding:** Terminal-Bench Hard, SciCode
- **General:** AA-LCR (long context reasoning), AA-Omniscience (knowledge/hallucination), IFBench (instruction following)
- **Scientific Reasoning:** HLE, GPQA Diamond, CritPt

Score range: **0–100**. 533 models evaluated, 396 with published scores.

### Top 15 by Intelligence Index
| Rank | Model | Score |
|------|-------|-------|
| 1 | Claude Opus 4.8 (max) | 61 |
| 2 | GPT-5.5 (xhigh) | 60 |
| 3 | GPT-5.5 (high) | 59 |
| 4 | Claude Opus 4.7 (max) | 57 |
| 5 | Gemini 3.1 Pro Preview | 57 |
| 6 | GPT-5.5 (medium) | 57 |
| 7 | Qwen3.7 Max | 57 |
| 8 | Gemini 3.5 Flash | 55 |
| 9 | Gemini 3.5 Flash (medium) | 55 |
| 10 | MiniMax-M3 | 55 |
| 11 | Kimi K2.6 | 54 |
| 12 | MiMo-V2.5-Pro | 54 |
| 13 | GPT-5.3 Codex (xhigh) | 54 |
| 14 | Qwen3.7 Plus | 53 |
| 15 | Grok 4.3 (high) | 53 |

- **Top open-weight:** Kimi K2.6 (54) / MiMo-V2.5-Pro (54) / DeepSeek V4 Pro Max (52)
- **Top proprietary:** Claude Opus 4.8 max (61) / GPT-5.5 xhigh (60)

---

## OpenRouter Free Models

Source: `openrouter.ai/collections/free-models` (fetched 2026-06-08).

**Top free-tier models available (all $0/M tokens):**
1. **Owl Alpha** (OpenRouter) — 2.03T tokens usage, agentic, 1.05M context
2. **Poolside Laguna M.1 (free)** — coding agent, 262K context
3. **NVIDIA Nemotron 3 Super (free)** — 120B MoE (12B active), 1M context
4. **NVIDIA Nemotron 3 Ultra (free)** — 550B MoE (55B active), 1M context
5. **OpenAI gpt-oss-120b (free)** — 117B MoE (5.1B active), 131K context
6. **Z.ai GLM 4.5 Air (free)** — MoE with thinking mode, 131K context
7. **Poolside Laguna XS.2 (free)** — coding, 262K context
8. **OpenAI gpt-oss-20b (free)** — 21B MoE (3.6B active), 131K context
9. **NVIDIA Nemotron 3 Nano 30B A3B (free)** — 256K context
10. **Google Gemma 4 31B (free)** — 256K, multimodal, Apache 2.0
11. **MoonshotAI Kimi K2.6 (free)** — 262K, coding/agents
12. **Google Gemma 4 26B A4B (free)** — 256K, MoE, Apache 2.0
- Plus NVIDIA Nemotron Nano variants, ByteDance Seedream 4.5 (image)

---

## Discrepancies Between Sources

| Dimension | Arena-AI | Artificial Analysis | OpenRouter |
|-----------|----------|--------------------|------------|
| **Scoring** | Elo (~1500 baseline) from human pairwise votes | Composite 0–100 from automated benchmarks | Usage-based ranking (tokens consumed) |
| **#1 Text** | Claude Opus 4.6 Thinking (1504) | Claude Opus 4.8 max (61) | Owl Alpha (2.03T tokens) |
| **#1 Code** | Claude Opus 4.7 Thinking (1567) | (same scale, GPT-5.5 xhigh) | Poolside Laguna M.1 (589B tokens) |
| **Open-weight leader** | GLM-5.1 (#14 text, #8 code) | Kimi K2.6 / MiMo-V2.5-Pro (54) | Owl Alpha (free tier) |
| **Anthropic dominance** | Opus 4.6/4.7 sweep top spots | Opus 4.8 #1, but GPT-5.5 close | No Claude free tier |
| **Gemini showing** | 3.1 Pro #6 text, 3.5 Flash #12 text | 3.1 Pro #5 (57), 3.5 Flash #8 (55) | Gemma 4 models available free |

**Key discrepancies:**
1. **Arena-AI #1 text is Opus 4.6 Thinking; AA #1 is Opus 4.8 max** — AA includes newer 4.8 models in its suite; Arena-AI ranks 4.8 lower (#8 text, #3 code) possibly due to fewer votes (5,911 vs 39,015 for 4.6)
2. **GPT-5.5 ranks lower on Arena-AI text** (#9 high, #16 standard) than on AA (#2 xhigh, #3 high) — AA's benchmark suite may favor OpenAI's reasoning configuration
3. **Gemini 3.5 Flash** performs well on both (AA: 55 score #8; Arena: #12 text) — strong value proposition
4. **OpenRouter free models don't overlap with top-tier** — the best free models (Owl Alpha, Nemotron 3 Ultra, gpt-oss) are not ranked by either leaderboard at the top; they're mid-tier performers at best
5. **Kimi K2.6** is consistently strong across all three: #11 code on Arena (1516), 54 on AA (top open), and available free on OpenRouter

---

## Key Takeaways

1. **Claude Opus 4.x series** is the consensus #1 across both major leaderboards for both text and code. The thinking/reasoning variants consistently outperform base.
2. **GPT-5.5** is the closest competitor, particularly on AA where its xhigh/high configs hit 59-60. On Arena-AI, GPT-5.5 variants cluster around #9-16.
3. **GLM-5.1 (Z.ai)** is the surprise open-model contender — ranks #14 text and #8 code on Arena-AI, outperforming many proprietary models. AA gives it 51.
4. **Kimi K2.6** is the most consistently strong open model across all three sources: #11 code on Arena, 54 on AA (top open), and free on OpenRouter.
5. **Methodology matters enormously:** Arena-AI measures human preference (Elo); AA measures benchmark performance (composite). They correlate but diverge on specific models. For coding specifically, both rank Claude Opus 4.x thinking variants at the top.
6. **Free tier on OpenRouter** offers capable mid-tier models (Nemotron 3 Ultra, gpt-oss-120b, Kimi K2.6) but none of the top-5 proprietary leaders. Good for prototyping, not frontier work.
7. **No single model dominates all categories.** Claude leads text/code conversation; AA shows a tighter cluster at the top (Opus 4.8 at 61 vs GPT-5.5 at 60).
