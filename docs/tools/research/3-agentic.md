---
title: 'Automating Research with LLMs and Agents'
---

# Automating Research with LLMs and Agents

## Executive Summary

Research can be substantially automated with LLMs and agents, but the dependable target is not full autonomy. The best current pattern is an explicit workflow: humans frame the question and constraints, agents handle the repetitive middle of the process, and humans review the final synthesis before it informs decisions. In practice, people can usually be AFK during source discovery, retrieval, summarisation, clustering, outlining, drafting, and non-destructive evaluator loops. They should not be AFK when the system is defining scope, escalating to secondary leads, taking consequential external actions, resolving weak or conflicting evidence, or approving the final answer.

Existing tools and patterns already support this operating model. Purpose-built research systems can run asynchronous, citation-heavy research passes; orchestration frameworks can pause at approval checkpoints; MCP can standardise tool access; and structured instructions, rubrics, and source inventories materially improve output quality. Best results come from simple, inspectable workflows with grounded generation, source diversity, explicit stopping conditions, durable logs, and human review thresholds tied to risk and reversibility.

---

## Table of Contents

1. [Research Question & Scope](#1-research-question--scope)
2. [Methodology](#2-methodology)
3. [Key Findings](#3-key-findings)
   - 3.1 [What automated research means in practice](#31-what-automated-research-means-in-practice)
   - 3.2 [Foundational agent patterns](#32-foundational-agent-patterns)
   - 3.3 [Where humans must be present](#33-where-humans-must-be-present)
   - 3.4 [Where humans can be AFK](#34-where-humans-can-be-afk)
   - 3.5 [Existing tools and frameworks](#35-existing-tools-and-frameworks)
   - 3.6 [Prompting techniques that optimise research quality](#36-prompting-techniques-that-optimise-research-quality)
   - 3.7 [Human-in-the-loop as interrupts, not ad hoc chat](#37-human-in-the-loop-as-interrupts-not-ad-hoc-chat)
   - 3.8 [Trustworthiness depends on provenance, not just answer quality](#38-trustworthiness-depends-on-provenance-not-just-answer-quality)
   - 3.9 [A practical operating model](#39-a-practical-operating-model)
   - 3.10 [Best practices](#310-best-practices)
4. [Source Inventory](#4-source-inventory)
5. [Conflicts & Open Questions](#5-conflicts--open-questions)
6. [Blindspot / Gap Analysis](#6-blindspot--gap-analysis)
7. [Recommended Next Steps](#7-recommended-next-steps)

---

## 1. Research Question & Scope

```
Research question: How to automate research using LLMs and Agents?
  Where does the human have to be involved, where can they be AFK?
  Are there existing tools, skills, and instructions that optimise
  research results? What are best practices?

Scope constraints: No time range restriction; focus on practical,
  actionable guidance. English-language sources only.

Out of scope: Non-text research modalities (e.g. laboratory science
  automation); proprietary enterprise tools with no public documentation;
  detailed benchmark replication; domain-specific compliance analysis
  for a single regulated industry.
```

---

## 2. Methodology

- **Resource types consulted:** Academic papers (arXiv), practitioner blog posts, official product and engineering documentation, standards/governance pages, open-source code repositories, and orchestration framework docs.
- **Search strategy:** Targeted arXiv IDs for foundational papers (CoT, ReAct, STORM, RAG survey, autonomous agents survey); direct fetch of practitioner agent guides; GitHub repository for GPT Researcher; Lilian Weng's canonical LLM-agent overview; official MCP documentation; LangGraph human-in-the-loop docs; NIST AI RMF overview.
- **Depth:** Primary sources only (no interactive secondary source approval stage).
- **Synthesis approach:** Merged from two independent research sessions covering academic, practitioner, governance, and framework sources. Preserved all non-overlapping insights, resolved wording conflicts, and retained full source inventory and bibliographic detail.

---

## 3. Key Findings

### 3.1 What automated research means in practice

Automated research using LLMs is not a single step but a pipeline of subtasks. The standard architecture decomposes into:

1. **Question / sub-query generation** — Given a broad topic, a planner LLM generates specific research questions that collectively address the topic.
2. **Parallel web retrieval** — For each question, a crawler agent searches the web, scrapes pages, and extracts relevant passages.
3. **Source summarisation and ranking** — Each retrieved source is summarised with citation tracking; low-quality sources are filtered.
4. **Cross-source synthesis** — Findings from multiple sources are merged, contradictions are flagged, and a coherent narrative is formed.
5. **Gap and evaluator pass** — A second pass checks for unsupported claims, missing perspectives, stale sources, and contradictory evidence.
6. **Report generation** — A final structured document is produced, with citations linking every claim to its source.

This pipeline mirrors human research methodology but executes steps 2–5 in parallel across tens of sources in minutes.

The key distinction is between **workflows** (predefined sequences with LLM calls at each step) and **agents** (LLMs that dynamically determine their own next steps). For most research tasks, structured workflows deliver more reliable, reproducible results than fully autonomous agents. Open-ended agents are most useful when the number and order of steps genuinely cannot be predicted in advance, or when the system needs to recurse into new subtopics discovered during the run.

---

### 3.2 Foundational agent patterns

**Chain-of-Thought (CoT) prompting:** Instructing an LLM to reason step-by-step before producing an answer dramatically improves performance on complex, multi-step reasoning tasks. In a research context, CoT is used to break a research question into sub-questions, evaluate source credibility, and synthesise conflicting evidence. CoT is a prerequisite for reliable research automation.

**ReAct (Reason + Act):** ReAct interleaves LLM reasoning traces with concrete actions (e.g. web search, document retrieval). The pattern is:
```
Thought: I need to find X.
Action: search("X key terms")
Observation: [search results]
Thought: Source Y is relevant because...
Action: fetch("URL of Y")
...
```
ReAct outperforms pure chain-of-thought on knowledge-intensive tasks and reduces hallucination by grounding each reasoning step in retrieved evidence. It is the dominant pattern inside purpose-built research tools.

**Retrieval-Augmented Generation (RAG):** RAG extends a static LLM with dynamic retrieval of up-to-date external information. The retrieval step determines what goes into the LLM's context; the generation step produces the final output. RAG is the foundational technique for keeping research outputs grounded in real sources rather than model-internal (potentially outdated or hallucinated) knowledge.

**Orchestrator-workers:** A central orchestrator LLM breaks down a research task into subtasks and delegates them to specialised worker LLMs or tools. Workers run in parallel. The orchestrator aggregates results.

**Evaluator-optimizer loop:** One LLM generates a research draft; a second LLM evaluates it against quality criteria (citation coverage, missing angles, contradictory claims) and provides feedback; the first LLM revises. This loop can run autonomously for a fixed number of iterations or until quality thresholds are met.

**Prompt chaining with routing and parallelisation:** The full research workflow can be composed from:
- *Prompt chaining:* question refinement → search plan → source analysis → synthesis → final report
- *Routing:* send different source types or sub-questions to specialised prompts/tools
- *Parallelisation:* run multiple source analyses or multiple critique passes simultaneously

**Progressive-Hint Prompting (PHP):** Previously generated answers are reused as hints in subsequent prompts, iteratively steering the LLM toward more accurate and complete conclusions. This is orthogonal to CoT and can be combined with it; yields measurable accuracy gains on quantitative analysis tasks.

---

### 3.3 Where humans must be present

Based on practitioner evidence and published research, five intervention points require human judgment and cannot be reliably delegated:

**1. Question framing and constraint setting (before the agent starts)**

The quality of automated research is bounded by the quality of the initial question. If the question is ambiguous, the agent will pursue a plausible-but-wrong interpretation. Humans must:
- State the research question precisely.
- Specify scope constraints (time range, geography, source types, acceptable uncertainty).
- Identify what success looks like (quick orientation vs. decision-quality report).
- Exclude known irrelevant angles.

No amount of agent sophistication compensates for a poorly framed question.

**2. Approval before consequential tool actions (mid-research)**

If the agent will send emails, execute transactions, modify databases, file tickets, or otherwise affect external systems, approval gates are essential.

**3. Secondary source approval or scope expansion (mid-research)**

After primary sources are analysed, agents identify secondary leads (cited papers, related repositories, adjacent topics). Approving these decides whether research broadens in depth or breadth. Skipping this checkpoint allows the agent to drift into tangential topics, accumulate noise, or recycle the same small cluster of sources.

**4. Review of weak or conflicting evidence (mid-research, when flagged)**

Current systems can synthesise well but still hallucinate, overweight recent or available content, or fail to calibrate uncertainty accurately. Resolving ambiguity, prioritising conflicting sources, and making interpretive judgements remain human work on consequential tasks.

**5. Final output validation and sign-off (after the agent finishes)**

Automated research systems can produce fluent, well-structured reports that contain subtle factual errors, misattributed claims, or biased source selection. Humans must:
- Verify key claims against cited sources (spot-check, not full re-research).
- Check that the synthesis fairly represents conflicting evidence.
- Assess fitness-for-purpose: is this report decision-quality, or only a starting point?
- Identify domain-specific errors that the agent could not detect.
- Approve the final answer before distribution or downstream action when research will inform decisions with legal, financial, security, or reputational impact.

LLM-based self-evaluation of domain-specific correctness is unreliable. Human or expert review is irreplaceable for consequential outputs.

These five moments can be compressed into three major checkpoints if needed: before the run, during escalation or scope change, and before final use.

---

### 3.4 Where humans can be AFK

Between the checkpoints above, the following steps are reliably automatable with current tools. The common rule is **reversibility**: if the step only creates draft artefacts or intermediate analysis, the user can safely step away.

| Step | Automation status | Why AFK is usually safe |
|------|------------------|--------------------------|
| Sub-question generation | Fully automatable | Output is reviewable and easy to revise later |
| Web search and crawling | Fully automatable | No external state change if confined to retrieval |
| Source quality filtering | Largely automatable | Heuristics and relevance scoring can reject obvious noise |
| Per-source summarisation | Fully automatable | Intermediate notes are reversible draft artefacts |
| Theme clustering and outlining | Largely automatable | Structural drafts can be corrected cheaply |
| Cross-source synthesis | Largely automatable | Useful as a first-pass synthesis, especially with citations |
| First-draft report writing | Fully automatable | First drafts are low-cost to review and revise |
| Iterative self-refinement | Fully automatable | Safe if they only critique or improve drafts |
| Long-running async research jobs | Fully automatable | Safe when runs are checkpointed and resumable |

The total unattended execution time for a medium-complexity task is typically 5–10 minutes for standard research and up to 30 minutes for deep recursive research.

---

### 3.5 Existing tools and frameworks

**GPT Researcher** is the most mature open-source tool purpose-built for automated research:
- Architecture: planner agent generates questions → parallel crawler agents retrieve sources → publisher aggregates findings.
- Scrapes 20+ sources per task; filters for relevance; produces reports exceeding 2,000 words with inline citations.
- Supports local document research (PDF, Word, CSV, etc.).
- Deep Research mode: recursive tree-like exploration of subtopics (~5 minutes per run).
- MCP server integration enables use as a tool inside other agent systems.
- 27,400+ GitHub stars; actively maintained.

**STORM (Stanford)** focuses on the pre-writing phase of long-form research articles:
- Discovers diverse perspectives on a topic.
- Simulates multi-perspective question-asking conversations with a "topic expert" LLM grounded on internet sources.
- Produces structured outlines; articles are judged 25% more organised and 10% broader in coverage than RAG-only baselines.
- Best for Wikipedia-style structured overviews rather than decision-support reports.

**LangGraph** is a multi-agent orchestration framework with explicit support for human-in-the-loop workflows: pause/resume behaviour, state checkpointing, approval nodes, and review/edit flows. Execution pauses at a review node, state is persisted, and the run resumes with human input — supporting long-running research sessions, asynchronous review, and auditable handoffs.

**AutoGen (AG2)** is a conversational multi-agent framework supporting human/tool combinations and operational design tradeoffs. More conversational than LangGraph; suitable for exploratory workflows.

**Model Context Protocol (MCP)** provides a standardised way to connect models to external tools, data sources, and workflows, reducing bespoke integration work. This is the connectivity layer that lets research agents access search APIs, local files, internal documentation, and ticketing systems without custom glue for each tool. Research quality depends heavily on the quality and ergonomics of the tools available to the agent.

**LangSmith** provides observability for multi-agent research pipelines: traces each LLM call, tool invocation, and agent interaction. Recommended from the start; research agent failures are often subtle and invisible without traces.

**Skills and instruction templates** are not cosmetic. Explicit research instructions, source rubrics, checklists, and output templates function as lightweight operating procedures for agents: what sources to prefer, when to ask for approval, how to rate evidence, and how to structure output. They materially improve output quality by constraining the workflow and forcing gap analysis before finalisation. In practice, good instructions often improve outputs more than adding another agent.

**Commercial products** (productised deep-research assistants from major labs) demonstrate the asynchronous research pattern — browse many sources, synthesise, produce citations, expose progress — but are closed-source. Their stated limitations (hallucinations, weak confidence calibration, authority discrimination) are consistent with the open-source evidence.

---

### 3.6 Prompting techniques that optimise research quality

**Multi-perspective question generation (STORM approach):** Rather than asking a single broad question, generate N questions from N distinct perspectives (e.g. practitioner, critic, historian, newcomer). This prevents the agent from anchoring on a single framing and produces broader coverage.

**Plan-and-solve decomposition:** Explicitly prompt the agent to first create a plan (list of steps) before executing. This reduces errors caused by premature commitment.

**Self-consistency / voting:** Run the same synthesis step N times with slight prompt variation; take the majority answer or the union of non-contradictory findings. This reduces variance in sensitive synthesis steps.

**Source diversity enforcement:** Explicitly instruct the agent to retrieve sources from diverse domains, publication dates, and author perspectives. Left unconstrained, agents tend to retrieve semantically similar pages, producing an echo chamber.

**Grounded generation:** At every synthesis step, require the LLM to cite a specific source for every factual claim. Claims without citations are flagged for human review. This is RAG applied at the sentence level, not just the document level.

**Stopping conditions:** Define explicit stopping criteria (e.g. N sources retrieved, or evaluator score exceeds threshold). Without stopping conditions, evaluator-optimizer loops can continue indefinitely or converge on locally optimal but globally poor outputs.

**Progressive-Hint Prompting:** Feed prior answers back as hints in subsequent prompts. On quantitative analysis, this yields accuracy improvement with no additional API cost.

---

### 3.7 Human-in-the-loop as interrupts, not ad hoc chat

Concrete human oversight works best when the workflow can **pause, persist state, and resume deterministically**. LangGraph's interrupt model is the canonical example: execution pauses at an approval or review node, the state is checkpointed, and the run is resumed later with human input.

Interrupt-based designs are better than ad hoc chat because they support long-running sessions, auditability, and selective escalation instead of forcing a person to monitor every step. Recommended interrupt points:

- Approve or reject expensive or high-risk tool calls.
- Approve scope expansion to secondary sources.
- Review and edit extracted claims before they enter the final synthesis.
- Request clarification when the evidence does not answer the original question.
- Escalate only unresolved conflicts to a human instead of reviewing every low-risk step.

This is the practical answer to where humans can be AFK: they can step away during the long middle of the run if the workflow has durable checkpoints and only interrupts them when a real decision is needed.

---

### 3.8 Trustworthiness depends on provenance, not just answer quality

Governance frameworks reinforce that trustworthy use requires governance, measurement, and management practices, not just capable models. For research automation, that translates into:

- Source provenance and traceable citations on every claim.
- Explicit acknowledgement of uncertainty and unresolved questions.
- Risk-based human review thresholds calibrated to the impact of the decision being informed.
- Logs or transcripts of steps taken and tools used.
- Evaluation against task-specific criteria: factuality, citation accuracy, coverage of opposing views, and harmful omission.

If a system cannot show where a claim came from, why it selected a source, and where human review occurred, it is producing automated drafting, not dependable research.

---

### 3.9 A practical operating model

The most effective practical setup for research automation:

1. **Human sets brief:** question, decision to inform, source constraints, deadline, acceptable uncertainty.
2. **Agent creates research plan:** sub-questions, source classes, search terms, stopping criteria.
3. **Agent runs asynchronously:** collects sources, extracts notes, clusters themes, drafts synthesis. *(Human can be AFK.)*
4. **Evaluator pass:** checks unsupported claims, stale sources, contradictory evidence, and missing stakeholder views. *(Automated.)*
5. **Human checkpoint:** reviews scope drift, secondary leads, key sources, conflicts, and consequential recommendations.
6. **Agent revises:** integrates feedback and produces a final report with citations, source inventory, open questions, and blind spots. *(Human can be AFK.)*
7. **Human sign-off:** required before distribution or execution of downstream actions.

This gives the user the main benefit of being AFK for the expensive middle of the process while retaining control over the parts where models still fail most often.

---

### 3.10 Best practices

Synthesising across all sources, the following practices consistently distinguish successful research automation from failed attempts:

1. **Start simpler than you think necessary.** Single LLM calls with good retrieval context often outperform complex multi-agent setups. Add orchestration only when single calls demonstrably fail.

2. **Automate labour, not accountability.** Let agents gather and structure evidence; keep people responsible for trust decisions and final claims.

3. **Define quality criteria before running.** What makes a good output? Specify it in the prompt (e.g. "cite at least 5 independent sources", "represent at least two opposing views"). Without criteria, evaluator-optimizer loops have nothing to optimise against.

4. **Invest heavily in tool design.** The interface between the agent and its tools (search API, scraper, vector store) determines output quality more than the model itself. Treat tool descriptions like API documentation written for a careful junior developer.

5. **Use grounded generation everywhere.** Every factual claim in the output should trace to a retrieved source. Hallucination risk is highest when the agent synthesises across many sources or when the topic is niche.

6. **Enforce source diversity.** Parallelise retrieval across multiple search providers and explicitly instruct the agent to diversify. Monoculture sourcing is the most common cause of biased research outputs.

7. **Implement human checkpoints as structured interrupts, not chat messages.** Pause/resume workflows with persisted state support asynchronous review and produce auditable handoffs.

8. **Standardise a source-quality rubric.** Require every report to include citations, a source inventory, and a gap analysis. Skills and instruction templates that enforce this improve quality measurably.

9. **Log everything.** Use observability tooling from the start. Research agent failures are often subtle — wrong source selection, missed perspective — and are invisible without traces.

10. **Treat output as a starting point, not a final answer.** Even the best automated research systems produce drafts. The human checkpoint at the end is non-optional for decision-quality work.

11. **Budget for deep research when breadth matters.** Standard RAG-based research (parallel retrieval, one pass) misses niche subtopics. Recursive, multi-pass approaches produce measurably better coverage.

12. **For high-stakes domains, write a policy.** Define explicitly where humans must review and where they may be AFK, based on reversibility and impact. General guidance exists; risk-tier definitions must be organisation-specific.

---

## 4. Source Inventory

| ID | Source | Type | Date | Quality | Notes |
|----|--------|------|------|---------|-------|
| S1 | Huang & Huang, "A Survey on Retrieval-Augmented Text Generation for Large Language Models" (arXiv:2404.10981) | Academic | 2024-08 (v2; ACM Computing Surveys 2026) | High — peer-reviewed, comprehensive survey | Core reference for RAG architecture and retrieval stages |
| S2 | Wei et al., "Chain-of-Thought Prompting Elicits Reasoning in Large Language Models" (arXiv:2201.11903) | Academic | 2022-01 (NeurIPS 2022) | High — peer-reviewed, highly cited foundational paper | Establishes CoT as the baseline reasoning technique |
| S3 | "Building Effective Agents" (practitioner guide from production engineers based on dozens of real deployments) | Web / Practitioner | 2024-12 | High — authored by production engineers, primary source for workflow patterns | Definitive practitioner guide; workflow vs agent distinction, evaluator loops, simplicity, human-in-the-loop guidance |
| S4 | Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models" (arXiv:2210.03629) | Academic | 2023-03 (ICLR 2023) | High — peer-reviewed, widely cited | Establishes the Thought/Action/Observation loop; reduces hallucination on knowledge-intensive tasks |
| S5 | assafelovic/gpt-researcher (GitHub) | Code repo | 2026-05 (v3.5.0) | High — 27.4k stars, actively maintained, Apache 2.0, comprehensive docs | Primary reference for existing tools; planner/crawler/publisher architecture in production |
| S6 | Shao et al., "Assisting in Writing Wikipedia-like Articles From Scratch with LLMs" / STORM (arXiv:2402.14207) | Academic | 2024-04 (NAACL 2024) | High — peer-reviewed, Stanford, quantitative evaluation | Key evidence for multi-perspective research automation and structured long-form research |
| S7 | Weng, Lilian. "LLM Powered Autonomous Agents" (lilianweng.github.io) | Web / Expert blog | 2023-06 | Medium — highly credible author, comprehensive but ~2 years old | Authoritative taxonomy of agent components; ChemCrow case study on limits of LLM self-evaluation |
| S8 | Zheng et al., "Progressive-Hint Prompting Improves Reasoning in Large Language Models" (arXiv:2304.09797) | Academic | 2024-10 (v6, ICML AI4MATH 2024) | Medium — peer-reviewed workshop paper | Iterative hint reuse technique; orthogonal to CoT |
| S9 | Deep-research product documentation (major vendor) | Web | 2025-02, updated 2026-02 | Medium — official product source, vendor framing | Asynchronous research behaviour, citations, progress tracking, stated limitations |
| S10 | NIST AI Risk Management Framework and GenAI profile | Web | 2023-01 with 2024–2026 updates | High — authoritative standards body, governance-focused | Trustworthiness, governance, and risk-based human review thresholds |
| S11 | Wang et al., "A Survey on Large Language Model based Autonomous Agents" (arXiv) | Academic | 2025-03 | Medium — comprehensive recent survey, broad scope | Agent architecture components, evaluation, challenges |
| S12 | Model Context Protocol introduction (official docs) | Web | Current | High — official protocol documentation | Standardised tool/data/workflow connectivity layer |
| S13 | LangGraph documentation, "Interrupts" and HITL examples | Web | Current | High — official framework docs with concrete mechanics | Pause/resume, checkpointing, approval gates, review/edit flows |
| S14 | AutoGen / AG2 project page (Microsoft Research) | Web / Academic | 2024-08 | Medium — credible organisation, partly promotional | Multi-agent orchestration patterns, human/tool combinations |

---

## 5. Conflicts & Open Questions

- **Conflict — framework use:** Practitioner guidance advises against orchestration frameworks in production and recommends building directly on LLM APIs, while GPT Researcher (70+ releases, 27k stars) is built on LangGraph successfully. Neither is clearly superior; the gap likely reflects task type (exploratory vs. production-hardened) and team familiarity. Simple systems are best first; frameworks become useful once persistence, checkpointing, or multi-worker coordination are necessary.

- **Conflict — autonomy level:** Practitioner guidance favours structured workflows (predefined paths) over fully autonomous agents for predictability. Agent survey literature focuses on autonomous agents with memory and self-reflection. For research specifically, the evidence favours bounded workflows with selective agentic behaviour over unconstrained autonomy.

- **Conflict — vendor framing vs. independent evidence:** Vendor materials emphasise their own systems or frameworks, while independent cross-framework evidence for "best" research stacks remains limited. Broad agreement exists on patterns, not on one winning toolset.

- **Unresolved — hallucination measurement:** No source provides a reliable benchmark for hallucination rates specifically in automated research outputs. LLM self-evaluation of domain-specific correctness is unreliable, and there is no general benchmark for cross-source synthesis accuracy or citation drift.

- **Unresolved — cost vs. quality curve:** No source provides a systematic comparison of cost vs. coverage quality across model sizes, retrieval budgets, or recursion depth.

- **Unresolved — mandatory review threshold:** There is no widely accepted benchmark focused on citation-faithful, enterprise-grade research automation. The threshold for mandatory human review varies by domain; risk-tier definitions are organisation-specific.

- **Requires expertise:** In regulated contexts, the difference between "reviewable draft" and "decision-grade research" depends on legal, compliance, and domain-specific evidence standards. Detecting source-bias transfer (where bias from a retrieved source propagates into the final article) also requires domain expertise.

---

## 6. Blindspot / Gap Analysis

- [x] **Opposing view** — Represented. Minimal-complexity practitioner view (structured workflows over agents) conflicts with multi-agent enthusiasm. Both views are covered. A stronger sceptical view: most "research automation" is still high-quality drafting plus retrieval, not dependable reasoning.
- [x] **Recency** — Covered reasonably well with 2022–2026 sources. Reasoning-model advances may change when manual CoT prompting is needed vs. built-in.
- [x] **Practitioner vs. theoretical** — Both represented: engineering/product guidance and academic papers.
- [ ] **Geographic / cultural variation** — Not adequately addressed. All primary sources are from US institutions. Research norms, acceptable source types, and language considerations vary by domain and region.
- [ ] **Adjacent domains** — Lightly addressed. Information retrieval research, library science, and systematic review methodology in medicine and social science all have mature frameworks for automated literature analysis. None were consulted in depth.
- [ ] **Negative results** — Lightly addressed. More evidence is needed on failure cases, especially silent citation drift, source-authority errors, and failure modes in production deployments.
- [x] **Stakeholder perspectives** — Practitioners, researchers, and open-source builders are represented. End-user (non-technical researchers), compliance, and domain-expert perspectives are less developed.
- [ ] **Skill/instruction templates as concrete artefacts** — Both source documents mention that skills and instruction templates improve output quality, but neither provides a concrete example template or checkpoint rubric.

Specific gaps that still matter:

- multilingual and region-specific source handling
- rigorous measurement of citation faithfulness and source bias transfer
- failure analysis for long-running research agents in real operations
- better guidance for when automated synthesis becomes decision-grade evidence
- implications of reasoning-model advances for manual CoT prompt engineering

---

## 7. Recommended Next Steps

1. **Run a purpose-built research tool on a real task first.** Install GPT Researcher, set up a search API key, and run a 5-minute test on a known topic to calibrate quality against your standards before investing in customisation.

2. **Implement the five human checkpoints explicitly.** For any pipeline you build or adopt, hardcode pauses at: (a) question framing, (b) consequential tool action approval, (c) secondary source or scope approval, (d) flagged evidence conflicts, (e) final output review. Do not skip checkpoint (e) even on "low stakes" research.

3. **Invest in tool documentation, not model selection.** Evidence consistently shows that the quality of the search tool, scraper, and retrieval interface matters more than which model is used. Start with the model you have; optimise tooling first.

4. **Use MCP or equivalent standardised connectors** so the research agent can access search, local files, internal docs, and ticketing systems without custom glue for each tool.

5. **Implement human checkpoints as structured interrupts** (LangGraph-style pause/resume with checkpointed state), not ad hoc chat messages. This supports asynchronous review and produces an auditable log.

6. **Standardise a source-quality rubric.** Require every report to include citations, a source inventory, and a gap analysis. Encode this as a skill or instruction template the agent receives on every run.

7. **For high-stakes domains, write a policy.** Define explicitly where humans must review and where they may be AFK, based on reversibility and impact.

8. **Evaluate the pipeline on known topics.** Use a rubric for factual accuracy, citation faithfulness, coverage of opposing views, and usefulness for decision-making before deploying on consequential research.

9. **Run a follow-up research pass on reasoning-model implications.** The latest generation of reasoning models may change when CoT prompting is needed and how much prompt engineering is required. This is flagged as an open gap.

10. **Consult information retrieval or library science literature** before designing research pipelines for regulated domains (law, medicine, finance). Those fields have established systematic review and evidence synthesis standards that should inform what automated research outputs are acceptable as inputs to decisions.

---

*Report generated: 2026-05-29*
*Research session depth: primary sources; final synthesis from two independent research sessions covering academic, practitioner, governance, and framework sources*

## Addendum: Additional Coverage

### A compact decision matrix for human presence vs. AFK

The most reliable rule in practice is to combine **reversibility**, **impact**, and **evidence quality**:

| Situation | Reversible? | Impact if wrong | Evidence quality | Human required? |
|-----------|-------------|-----------------|------------------|-----------------|
| Search, crawling, note extraction, draft summarisation | Yes | Low | Mixed or improving | No |
| Theme clustering, outline generation, first-draft synthesis | Yes | Low to medium | Usually mixed | No, unless the topic is high stakes |
| Adding new source branches, changing scope, increasing budget or runtime materially | Partly | Medium | Often uncertain | Yes |
| Resolving contradictory evidence, sparse evidence, or ambiguous claims | Partly | Medium to high | Weak or conflicting | Yes |
| Publishing conclusions, sending recommendations, or triggering downstream actions | No | High | Must be decision-grade | Yes |

If a step is reversible and only creates intermediate artefacts, people can usually be AFK. If it changes the meaning, scope, cost, or consequences of the work, a human should be present.

### A minimal instruction pack / checkpoint rubric

One practical way to improve research quality is to give the agent the same compact instruction pack on every run:

```text
Research brief:
- Question to answer:
- Decision this research will inform:
- Scope constraints: time range, geography, language, source types
- Minimum source diversity: at least X independent sources across Y source classes
- Required output sections: summary, key findings, source inventory, conflicts, gaps, next steps

Agent rules:
- Cite a source for every factual claim.
- Flag claims with weak or conflicting evidence instead of smoothing them over.
- Ask for approval before expanding scope, using paid/high-latency tools, or taking external actions.
- Prefer primary and official sources before commentary.
- End with unresolved questions and likely blind spots.

Checkpoint rubric:
- Fidelity: does the draft answer the original question directly?
- Coverage: are major stakeholder views and opposing evidence represented?
- Grounding: does each important claim trace to a source?
- Evidence quality: are key sources credible and recent enough?
- Risk: is this only a reviewable draft, or is a human sign-off required before use?
```

This kind of reusable instruction pack is often more valuable than adding another agent, because it standardises expectations across runs and makes evaluator passes more consistent.
