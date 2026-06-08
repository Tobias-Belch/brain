---
title: Evaluation
---

# Evaluation

## Gate Results
- Brief fidelity: pass
- Source diversity: pass
- Citation coverage: pass
- Recency adequacy: pass
- Conflict visibility: pass
- Blindspot coverage: warn
- Evaluator verdict: pass

## Notes
- **Brief fidelity**: Report directly answers both research questions. All sources from 2026.
- **Source diversity**: 12 sources across web articles, docs, and repositories. Adequate for standard depth (6-12 sources target).
- **Citation coverage**: Key claims traceable to specific source IDs. Rate limits and model names cite specific sources.
- **Recency adequacy**: All sources dated 2026 (Feb-Jun). Appropriate for fast-moving LLM API space.
- **Conflict visibility**: Minor discrepancies in rate limit numbers across sources (e.g., Google Gemini RPM varies by source) — flagged in report.
- **Blindspot coverage (warn)**:
  - No direct access to PI's built-in provider list (distinct from pi-free extension). PI's own `@earendil-works/pi-ai` package supports Anthropic, OpenAI, Google, xAI, Groq, Cerebras, OpenRouter — but the exact free-model subset is not documented separately from the pi-free extension.
  - OpenCode's free model list comes from a third-party guide, not the official `opencode models` command output. The official docs recommend using `opencode models` to see the current list.
  - Some API free tiers may have changed between source publication and today.
- **Evaluator verdict**: Research is adequate for decision-support. Confidence is high for the API provider landscape, medium-high for agent-specific free models (due to reliance on third-party extension for PI). Quality gates pass with one warning.

## Unresolved Issues
- PI's official built-in free model list (without pi-free extension) is not explicitly documented. The pi-free extension is the clearest source but is third-party.
- Exact latest free model list for OpenCode should be verified via `opencode models` CLI command.
- API free tier limits are subject to change; rate limits in report are from mid-2026 sources.
