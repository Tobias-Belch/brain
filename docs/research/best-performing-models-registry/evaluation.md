---
title: 'Evaluation'
---

# Evaluation

## Gate Results

- **Brief fidelity**: pass
- **Source diversity**: pass
- **Citation coverage**: pass
- **Recency adequacy**: pass
- **Conflict visibility**: pass
- **Blindspot coverage**: warn
- **Evaluator verdict**: pass

## Notes

### Brief fidelity (pass)
The report directly answers both parts of the research question: (1) best-performing free and paid models across research, coding, thinking, and image generation tasks, and (2) automation approaches for deterministic ranking fetch. All scope boundaries from the brief are respected.

### Source diversity (pass)
26 sources catalogued across web, documentation, papers, and API sources. Coverage spans human-preference arenas (LMSYS, T2I Arena), automated benchmarks (LiveCodeBench, SWE-bench, GPQA, MMLU-Pro, ARC-AGI), composite indexes (AA Intelligence Index, BenchLM), academic papers (ImagenWorld), and data APIs. Exceeds deep budget (12-30 sources).

### Citation coverage (pass)
Key ranking claims are backed by source IDs with Elo scores, benchmark percentages, confidence intervals, and dates. Per-source notes include evidence extracts with precise quotes/paraphrases.

### Recency adequacy (pass)
All primary sources dated 2025-2026; majority are Q1-Q2 2026. Recency constraints from brief (prioritize 2025-2026, flag older than 12 months) fully satisfied. The oldest source (LMSYS methodology paper, 2024) is correctly flagged as contextual.

### Conflict visibility (pass)
Cross-source discrepancies are explicitly surfaced:
- Arena AI vs Artificial Analysis ranking order for #1 text model (Opus 4.6 Thinking vs Opus 4.8)
- GPT-5.5 rank divergence between Arena AI and AA
- SWE-bench Pro scaffolding confound (standard scaffold vs mini-swe-agent vs custom)
- LiveCodeBench score variance across evaluators (Gemini 3.1 Pro: 88.5% to 80.6%)
- ARC-AGI-2 vs ARC-AGI-3 telling opposite stories (GPT-5.5 at 85% vs 0.43%)

### Blindspot coverage (warn)
**Identified gaps:**
1. **CSS-specific coding benchmark**: Separate CSS benchmark does not exist in any major evaluation suite. CSS tasks appear only as part of web framework issues in SWE-bench Pro. This is explicitly noted.
2. **Opaque model architectures**: Several new models (Seed 2.0 Pro, Step 3.5 Flash, Owl Alpha) have unknown or non-standard architectures with limited independent verification.
3. **Self-reported scores**: Many open-weight model scores (DeepSeek V4, Qwen 3.6) come from vendor tech reports, not third-party verification. Flagged per-source.
4. **Geographic variation**: Chinese models (GLM, Qwen, Kimi) dominate open-weight leaderboards but may have training data biases not captured by current benchmarks.
5. **Enterprise vs research vs coding specialisation**: No single model leads all categories — model routing is the emerging pattern but not benchmarked.
6. **Cost-efficiency coverage**: Only ARC-AGI factors cost into scoring. Other benchmarks report only quality, masking brute-force approaches.

### Evaluator verdict (pass)
All quality gates passed or explicitly documented. Evidence is sufficient for decision-support quality with explicit uncertainty labels. Gaps are surfaced rather than hidden. Confidence levels applied to all key findings.

## Unresolved Issues

1. **GPT-Image-2 pricing**: Not confirmed as of mid-2026. Pricing projections are based on GPT-Image-1.5 tiers.
2. **SWE-bench Pro self-reported scores**: Claude Mythos (77.8%), Opus 4.8 (69.2%), and Opus 4.7 (64.3%) use custom scaffolding — not comparable to standardized SEAL scaffold scores.
3. **ARC-AGI-3 is too new**: Only 7 models submitted; scores change weekly. Rankings are provisional.
4. **LiveCodeBench V5 vs V6**: Different versions produce significantly different scores. The community has not converged on which version to cite.
5. **OpenRouter free roster**: The set of free models rotates as upstream providers change policies. The inventory here is a snapshot.
6. **Self-hosted cost variability**: GPU costs vary significantly by provider, region, and scale. Per-image/text-generation costs for open models are approximate.
