---
title: 'Research Summary'
---

# Research Summary

## Executive Summary

Good research is a disciplined loop: frame the question, define evidence standards, discover diverse sources, evaluate quality, synthesize across sources, surface uncertainty, check blind spots, and report in an auditable format. The strongest general practices are explicit scope, source diversity, lateral verification, claim-level provenance, conflict handling, and clear confidence labels.

AI-agent research inherits almost all of those practices. The main difference is operational: agents can automate retrieval, summarization, clustering, evaluator passes, and draft generation, but humans still need to own framing, scope expansion, conflict resolution, and final sign-off. The best research agent should therefore be a bounded, inspectable workflow with agentic substeps, not an unconstrained autonomous system.

## General Research Best Practices

1. **Start with a written research brief.** Define the decision being supported, the primary question, scope constraints, exclusions, acceptable evidence, and confidence threshold before searching. This is emphasized in [Best Practices: Define the Research Question Before Searching](./1-best-practices.md#31-define-the-research-question-before-searching) and formalized in [Research Template: Best Research Process](./2-template.md#best-research-process-backbone).

2. **Search deliberately, not passively.** Use specific queries, domain vocabulary, search operators, filters, known authoritative domains, and strategy changes when a query fails. Do not treat ranked results as quality-ranked evidence. See [Best Practices: Search Strategy and Query Formulation](./1-best-practices.md#32-search-strategy-and-query-formulation).

3. **Use diverse, independent sources.** A serious research pass should gather multiple independent sources, preferably 4-8 credible seeds before deep synthesis. Prefer primary documents, standards, official data, and expert or institutional sources over derivative commentary. See [Best Practices: Source Selection and Diversity](./1-best-practices.md#33-source-selection-and-diversity) and [Research Template: Discover Sources Broadly](./2-template.md#best-research-process-backbone).

4. **Evaluate sources with a consistent rubric.** Assess currency, relevance, authority, accuracy, purpose, authorship, evidence base, transparency, corroboration, and bias. A weak source is not automatically useless, but anonymous authorship plus weak evidence plus no corroboration should lower confidence sharply. See [Best Practices: Source Evaluation Frameworks](./1-best-practices.md#34-source-evaluation-frameworks).

5. **Read laterally before trusting.** For unfamiliar sources, investigate what other credible sources say about the author, publisher, evidence, and claim. Trace important quotes, numbers, images, and charts back to their original context. See [Best Practices: Lateral Reading and Verification](./1-best-practices.md#35-lateral-reading-and-verification).

6. **Match evidence to the claim.** Use qualitative material for explanation and mechanism, quantitative evidence for prevalence or magnitude, and mixed evidence when decisions matter. Avoid using a single method to answer a question it cannot support. See [Best Practices: Match Methods to the Kind of Question](./1-best-practices.md#36-match-methods-to-the-kind-of-question).

7. **Separate evidence, interpretation, recommendations, and uncertainty.** Research value comes from synthesis, not source collection. Important claims should be labeled as corroborated, single-sourced, contradicted, or unresolved. See [Best Practices: Synthesis and Documentation](./1-best-practices.md#39-synthesis-and-documentation) and [Research Template: Universal Most-Useful Result Template](./2-template.md#universal-most-useful-result-template).

8. **Preserve auditability.** Every durable report should include methodology, source inventory, conflicts and open questions, and blindspot analysis. These sections should rarely be removed because they prevent false certainty and make the work extendable. See [Research Template: What To Customize vs Keep](./2-template.md#what-to-customize-vs-keep).

9. **Run a blindspot pass.** Check opposing views, recency, practitioner vs. theoretical balance, geographic or cultural variation, adjacent domains, negative results, and missing stakeholders. See [Research Template: Blindspot / Gap Analysis](./2-template.md#universal-most-useful-result-template) and [Best Practices: Blindspot / Gap Analysis](./1-best-practices.md#6-blindspot--gap-analysis).

10. **Stop based on saturation and required confidence.** Stop when new sources add little, major claims are corroborated, conflicts are documented, and the answer is good enough for the intended use. Seek expert review when evidence is conflicting, high-stakes, domain-specific, or all sources trace back to one claim. See [Best Practices: Iterative Research and Knowing When to Stop](./1-best-practices.md#310-iterative-research-and-knowing-when-to-stop).

## What Carries Over to AI-Agent Research

Most fundamentals carry over directly. An AI research agent should still begin from a scoped brief, retrieve diverse sources, evaluate evidence quality, cite claims, preserve conflicts, and produce an auditable report. The agent does not remove the need for method; it makes the method more important because automation can scale both rigor and mistakes.

The durable template also carries over. Agent-produced reports should still include an executive summary, research question and scope, methodology, key findings, source inventory, conflicts, blindspots, and next steps, as described in [Research Template: Universal Most-Useful Result Template](./2-template.md#universal-most-useful-result-template). The agentic report should add operational metadata where useful: tools used, retrieval budget, model or agent roles, approval checkpoints, and unresolved verification needs.

The same source-quality principles also carry over. Agentic systems need explicit source diversity, primary-source preference, lateral verification, confidence labels, and claim-source traceability. These practices appear in general research guidance in [Best Practices: Source Selection and Diversity](./1-best-practices.md#33-source-selection-and-diversity), [Best Practices: Source Evaluation Frameworks](./1-best-practices.md#34-source-evaluation-frameworks), and agent-specific guidance in [Automating Research: Prompting Techniques](./3-agentic.md#36-prompting-techniques-that-optimise-research-quality).

## What Distinguishes AI-Agent Research

1. **The middle of the workflow can be automated.** Agents can generate subquestions, search, crawl, summarize, rank sources, cluster themes, draft outlines, run evaluator passes, and produce reports. These steps are generally safe to run unattended when they only create reversible draft artifacts. See [Automating Research: What Automated Research Means in Practice](./3-agentic.md#31-what-automated-research-means-in-practice) and [Automating Research: Where Humans Can Be AFK](./3-agentic.md#34-where-humans-can-be-afk).

2. **Human involvement moves to checkpoints.** Humans should be present for initial framing, approval of consequential tool actions, secondary-source or scope expansion, weak or conflicting evidence, and final validation. These can be compressed into pre-run, mid-run, and final-review checkpoints. See [Automating Research: Where Humans Must Be Present](./3-agentic.md#33-where-humans-must-be-present).

3. **Bounded workflows beat open-ended autonomy for most research.** Structured workflows are usually more reliable than fully autonomous agents because they are easier to inspect, pause, resume, and evaluate. Open-ended agency is useful when the order of steps cannot be predicted or recursive subtopic exploration is genuinely needed. See [Automating Research: What Automated Research Means in Practice](./3-agentic.md#31-what-automated-research-means-in-practice) and [Automating Research: Best Practices](./3-agentic.md#310-best-practices).

4. **Grounding must be stricter, not looser.** Agent synthesis can hallucinate, blend claims, overstate weak evidence, or drift from citations. Every factual claim should trace to a retrieved source, and unsupported claims should be flagged rather than polished into prose. See [Automating Research: Trustworthiness Depends on Provenance](./3-agentic.md#38-trustworthiness-depends-on-provenance-not-just-answer-quality).

5. **Observability is part of quality.** A dependable research agent should log searches, source choices, tool calls, extraction notes, evaluator feedback, and human interventions. Without traces, subtle failures such as missed perspectives or citation drift are hard to diagnose. See [Automating Research: Existing Tools and Frameworks](./3-agentic.md#35-existing-tools-and-frameworks) and [Automating Research: Best Practices](./3-agentic.md#310-best-practices).

6. **Interrupts are better than chat monitoring.** Human-in-the-loop design works best as structured pause/resume checkpoints with persisted state, not ad hoc supervision. See [Automating Research: Human-in-the-Loop as Interrupts](./3-agentic.md#37-human-in-the-loop-as-interrupts-not-ad-hoc-chat).

## Proposal: Building the Best Research Agent

Build a research agent as a **bounded, auditable research workflow with agentic workers**, not as a fully autonomous chatbot. The system should optimize for evidence quality, provenance, and effective human checkpoints.

### Core Architecture

1. **Brief intake module.** Capture the question, decision being informed, scope, exclusions, source preferences, evidence threshold, output format, and risk level. This operationalizes the framing guidance from [Best Practices: Define the Research Question Before Searching](./1-best-practices.md#31-define-the-research-question-before-searching).

2. **Planner.** Convert the brief into subquestions, search strategies, source classes, quality criteria, and stopping conditions. Use multi-perspective question generation for broad topics, following [Automating Research: Prompting Techniques](./3-agentic.md#36-prompting-techniques-that-optimise-research-quality).

3. **Retrieval workers.** Run parallel searches across source types and, where possible, multiple retrieval providers. Enforce diversity by domain, author, date, geography, and viewpoint. Prefer primary and official sources.

4. **Source analyzer.** For each source, extract key claims, evidence, limitations, date, author or publisher, and quality annotation. Store source-level notes before synthesis.

5. **Synthesis engine.** Group findings by theme or subquestion, not by source order. Require citations for factual claims and label confidence as corroborated, single-sourced, contradicted, or unresolved.

6. **Evaluator loop.** Run a separate critique pass for citation faithfulness, unsupported claims, stale sources, missing opposing views, weak source diversity, scope drift, and unanswered subquestions. Limit the loop with explicit stopping conditions.

7. **Human checkpoint layer.** Pause for approval when the agent wants to expand scope, follow secondary leads, use expensive or high-latency tools, resolve consequential conflicts, or finalize a decision-grade output. This follows [Automating Research: A Practical Operating Model](./3-agentic.md#39-a-practical-operating-model).

8. **Report generator.** Emit the stable research template: summary, scope, methodology, findings, source inventory, conflicts, blindspots, and next steps. Add run metadata and review status.

9. **Observability and archive.** Persist tool traces, source inventory, notes, prompts or instruction versions, intermediate drafts, evaluator findings, and final output so the research can be audited or resumed.

### Operating Rules

1. Start simple: one orchestrator, retrieval tools, source analyzer, synthesizer, and evaluator. Add more agents only when a specific failure mode requires specialization.

2. Make every important claim source-backed. If a claim cannot be cited, either remove it or mark it as hypothesis or interpretation.

3. Optimize tool quality before model complexity. Search, scraping, document parsing, deduplication, and citation handling will often matter more than adding another model.

4. Treat final outputs as reviewable drafts unless a qualified human has signed off.

5. Scale depth by stakes. Low-stakes orientation can use a fast pass; decision-quality or high-risk research should require deeper retrieval, stricter source quality, stronger evaluator passes, and human review.

## How To Use A Research Agent Most Effectively

1. Provide a crisp brief: question, decision, scope, exclusions, source preferences, time range, and confidence threshold.

2. Tell the agent what would change your mind. This forces it to look for counterevidence instead of only supporting evidence.

3. Require a source inventory and confidence labels. Do not accept uncited narrative synthesis for important claims.

4. Let the agent run unattended only during reversible work: searching, crawling, summarizing, clustering, drafting, and evaluator passes.

5. Stay involved at decision points: scope changes, secondary-source expansion, weak/conflicting evidence, and final sign-off.

6. Spot-check citations in the final report, especially claims that are surprising, consequential, quantitative, or central to the recommendation.

7. Re-run or deepen research when the source set is narrow, recent developments are likely, stakeholders are missing, or major claims remain single-sourced.

## Bottom Line

The best research agent is not the most autonomous one. It is the one that most reliably applies sound research method at scale: explicit framing, diverse retrieval, source-quality scoring, grounded synthesis, conflict handling, gap analysis, durable logs, and well-placed human checkpoints.
