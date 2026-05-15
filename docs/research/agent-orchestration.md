# Multi-Agent Orchestration: Best Practices

*Synthesised research report*

---

## Executive Summary

Multi-agent orchestration is the discipline of designing, coordinating, and operating systems where multiple AI agents — each with distinct roles, tools, and memory — collaborate to accomplish tasks no single agent can handle efficiently or reliably. Done well, it unlocks parallelism, specialisation, and robustness beyond the reach of single-agent systems. Done poorly, it compounds errors, inflates cost, and produces opaque, fragile systems.

The evidence across practitioner guides and academic literature converges on a short list of durable principles:

1. **Prefer simplicity.** Add agents only when complexity demonstrably improves outcomes. A single, well-prompted LLM with retrieval augmentation frequently outperforms a multi-agent pipeline on cost, latency, and reliability.
2. **Decompose by specialisation, not by size.** Agents should have narrow, well-defined roles — not merely split work by volume.
3. **Design for observability from the start.** Trace every agent decision. Opaque pipelines are nearly impossible to debug or improve.
4. **Human oversight is not optional.** Autonomous agents make irreversible mistakes. Build checkpoints and confirmation gates into any workflow that writes to the world.
5. **Evaluate and test continuously.** Ground-truth datasets, automated evals, regression suites, and A/B testing are the only reliable path to improving agent behaviour over time.
6. **Treat orchestration as a first-class engineering concern** — alongside reliability, security, and scalability — not an afterthought. Organisations that do this consistently achieve higher reliability, lower cost, and faster iteration cycles.

---

## Table of Contents

1. [Research Question & Scope](#1-research-question--scope)
2. [Methodology](#2-methodology)
3. [Key Findings](#3-key-findings)
   - 3.1 [When to Use Multi-Agent Systems](#31-when-to-use-multi-agent-systems)
   - 3.2 [Orchestration Topologies and Patterns](#32-orchestration-topologies-and-patterns)
   - 3.3 [Agent Role Design and Architecture](#33-agent-role-design-and-architecture)
   - 3.4 [Communication and Coordination](#34-communication-and-coordination)
   - 3.5 [Task Decomposition and Planning](#35-task-decomposition-and-planning)
   - 3.6 [Memory and State Management](#36-memory-and-state-management)
   - 3.7 [Tool Design and Agent-Computer Interfaces (ACI)](#37-tool-design-and-agent-computer-interfaces-aci)
   - 3.8 [Reliability, Error Handling, and Recovery](#38-reliability-error-handling-and-recovery)
   - 3.9 [Security and Trust Boundaries](#39-security-and-trust-boundaries)
   - 3.10 [Human-in-the-Loop and Safety Guardrails](#310-human-in-the-loop-and-safety-guardrails)
   - 3.11 [Observability and Debugging](#311-observability-and-debugging)
   - 3.12 [Evaluation and Testing](#312-evaluation-and-testing)
   - 3.13 [Scaling Considerations](#313-scaling-considerations)
   - 3.14 [Common Anti-Patterns](#314-common-anti-patterns)
   - 3.15 [Framework and Tooling Selection](#315-framework-and-tooling-selection)
   - 3.16 [Architectural Patterns from Adjacent Domains](#316-architectural-patterns-from-adjacent-domains)
4. [Source Inventory](#4-source-inventory)
5. [Conflicts & Open Questions](#5-conflicts--open-questions)
6. [Blindspot / Gap Analysis](#6-blindspot--gap-analysis)
7. [Recommended Next Steps](#7-recommended-next-steps)
8. [Summary Checklist](#8-summary-checklist)

---

## 1. Research Question & Scope

```
Research question: What are the best practices for designing and operating multi-agent
                   orchestration systems built on large language models?
Scope constraints: Focus on LLM-based agent systems; practitioner and academic perspectives
                   both weighted; English-language sources; coverage through May 2025.
Out of scope:      Classical (non-LLM) multi-agent systems (JADE, FIPA, etc.) except where
                   patterns transfer directly; narrow reinforcement-learning-only agents;
                   embodied/robotics agents; vendor-specific product tutorials below the
                   architectural principle level.
```

---

## 2. Methodology

- **Resource types consulted:** Web documentation, academic preprints (arXiv), practitioner engineering blogs, framework official documentation, cloud-provider best-practice series.
- **Search strategy:** Targeted retrieval from canonical sources — engineering blogs, arXiv multi-agent surveys (Wang et al. 2023/2025; Guo et al. 2024), major framework documentation (AutoGen, CrewAI, LangGraph), and AWS Bedrock Agents best-practice series.
- **Synthesis method:** A comprehensive synthesis drawn from multiple rigorous evaluation runs, identifying consensus best practices, gaps, and structural refinements.

---

## 3. Key Findings

### 3.1 When to Use Multi-Agent Systems

The single most consistently stated principle across all sources is restraint: **add agents only when simpler solutions demonstrably fail**. A single, well-prompted LLM call with retrieval augmentation frequently outperforms a multi-agent pipeline on cost, latency, and reliability.

**Use a single, well-prompted LLM when:**
- The task fits within a single context window.
- Retrieval-augmented generation (RAG) is sufficient to ground responses.
- The workflow is linear and predictable.
- Latency is the primary constraint — each agent hop adds round-trip time.
- Reliability is paramount and error compounding cannot be tolerated.

**Introduce multiple agents when:**
- **Parallelism is required:** subtasks are independent and can execute concurrently.
- **The task exceeds a single context window:** long-horizon work — extended codebases, document corpora, multi-day research loops — requires distributing state across agents.
- **Specialisation adds verifiable value:** tasks where routing to domain-specific prompts measurably improves quality (coding, legal review, medical triage).
- **Output needs independent checking:** a separate evaluator agent can critique a generator agent without sharing its biases, improving overall quality.
- **The subtask count is unpredictable at design time:** orchestrator-worker architectures handle open-ended decomposition that cannot be hardcoded.
- **Redundancy justifies the cost:** risk from a single point of failure warrants multiple agents for resilience.

---

### 3.2 Orchestration Topologies and Patterns

#### 3.2.1 Prompt Chaining (Sequential Pipeline)

Each agent's output becomes the next agent's input. Intermediate programmatic "gates" validate outputs and halt the chain on failure.

**Use when:** the task decomposes into a fixed, ordered sequence of sub-steps with clear handoff criteria and where trading latency for accuracy is worthwhile.

#### 3.2.2 Routing

A classifier agent (or programmatic router) directs incoming work to one of several specialist agents. 

**Use when:** distinct categories of inputs benefit from distinct prompts, models, or tools.

#### 3.2.3 Parallelisation (Sectioning and Voting)

Independent subtasks execute concurrently; results are aggregated. Two variants:
- **Sectioning:** different subtasks run in parallel (e.g., evaluate security, performance, and readability simultaneously).
- **Voting:** the same task runs multiple times; majority or weighted consensus determines the final output. 

#### 3.2.4 Orchestrator-Workers (Hub-and-Spoke)

A central orchestrator LLM dynamically decomposes a task and dispatches subtasks to worker agents at runtime. The number and nature of subtasks need not be known in advance.

**Strengths:** Clear accountability, easy to trace, single source of task state.
**Weaknesses:** Orchestrator is a single point of failure; can become a bottleneck at scale.

#### 3.2.5 Evaluator-Optimizer (Critic Loop / Reflection)

A generator agent produces output; a separate evaluator agent critiques it and provides structured feedback; the generator revises. Loops until quality threshold or max iterations.

#### 3.2.6 Hierarchical / Layered Networks

For complex goals, a top-level orchestrator delegates to mid-level orchestrators, each managing its own worker pool. Each layer should be able to describe its responsibility in one sentence.

#### 3.2.7 Event-Driven (Pub/Sub)

Agents subscribe to event streams and act when relevant events arrive. The orchestrator becomes an event bus rather than a direct caller.

#### 3.2.8 Peer-to-Peer / Decentralised

Agents communicate directly without a central coordinator. Common in simulation, market-based, and stigmergic systems.

---

### 3.3 Agent Role Design and Architecture

#### 3.3.1 The Four Core Modules

| Module | Purpose | Key design choices |
|--------|---------|-------------------|
| **Profiling** | Defines the agent's role, persona, and constraints | Handcrafted, LLM-generated, or dataset-derived. Roles constrain tool access and communication scope. |
| **Memory** | Stores and retrieves past observations and context | Short-term vs. hybrid. Memory reading prioritises recency, relevance, and importance. |
| **Planning** | Decomposes goals into actionable steps | Without feedback: CoT, Tree of Thoughts. With feedback: ReAct, Reflexion, Voyager-style skill libraries. |
| **Action** | Translates decisions into real-world effects | Tool calls, API invocations, code execution. Actions must be idempotent or reversible where possible. |

#### 3.3.2 Build Small, Focused Agents

Build small, focused agents that interact rather than a single large monolithic agent. A good heuristic is the "three words" test: Can you name the agent in three words or fewer that describe its function? (e.g., *web-searcher*, *code-reviewer*).

#### 3.3.3 Define Interfaces Explicitly (Agent Contracts)

Define what an agent accepts (input schema) and what it produces (output schema) before implementing it. This makes agents composable and independently testable.

```yaml
# Example agent contract
name: web-searcher
input:
  query: string
  max_results: integer (default: 5)
output:
  results:
    - title: string
      url: string
      snippet: string
  source_count: integer
```

#### 3.3.4 Statelessness by Default

Prefer agents that derive all needed context from their input. Stateless agents are trivially restartable, horizontally scalable, and cache-friendly. 

---

### 3.4 Communication and Coordination

#### 3.4.1 Communication Paradigms

| Paradigm | Description | When to use |
|---|---|---|
| **Cooperative** | Agents share context toward a common goal | Most production use cases |
| **Debate** | Agents argue opposing positions; a judge resolves | Improving factuality, avoiding groupthink |
| **Competitive** | Agents pursue conflicting goals | Simulation, adversarial robustness testing |

#### 3.4.2 Trace Context and Reliability in Messages

Every inter-agent message should be structured (JSON/Protobuf/Pydantic) and must carry trace context (`trace_id`, `span_id`, `parent_span_id`, `timestamp`) and an `idempotency_key` to enable deduplication of retried messages.

---

### 3.5 Task Decomposition and Planning

#### 3.5.1 Decomposition Granularity

Subtasks should be atomic enough to assign to a single agent without further runtime decomposition, but coarse enough to offset coordination overhead. **100 ms batching heuristic:** if a subtask takes less than ~100 ms of agent compute, the coordination overhead likely dominates. Consider batching.

#### 3.5.2 Explicit Dependency Graphs

Construct an explicit dependency DAG of subtasks before dispatching. Undeclared dependencies are the leading cause of subtle ordering bugs.

---

### 3.6 Memory and State Management

#### 3.6.1 Canonical Workflow State Store

All persistent workflow state (task status, partial results, metadata) should live in a single, authoritative store — not scattered across agent memory.

Recommended properties:
- **ACID transactions** (or at minimum, compare-and-swap for status updates).
- **Time-stamped audit log** of all state changes.

#### 3.6.2 Optimistic Concurrency Control

When multiple agents may update the same state record, use optimistic concurrency control. Include a version number in the state record and reject updates that present a stale version. This prevents lost updates without requiring distributed locks.

#### 3.6.3 Explicit Task Lifecycle State Machine

Define an explicit, finite state machine for task lifecycle transitions, logging every state change:
```
PENDING → DISPATCHED → IN_PROGRESS → COMPLETED
                    ↘              ↘
                   FAILED       CANCELLED
                    ↓
                  RETRYING
```

---

### 3.7 Tool Design and Agent-Computer Interfaces (ACI)

Invest in ACI as much as HCI. Write tool documentation as if onboarding a junior engineer, poka-yoke (mistake-proof) tool arguments (e.g. typed enums over free strings), and provide enough token budget for the agent to "think" before calling tools.

---

### 3.8 Reliability, Error Handling, and Recovery

#### 3.8.1 Compensating Transactions (Sagas)

For workflows spanning multiple agents and external systems, implement the **saga pattern**: each step has a corresponding compensating action that undoes its effects if a later step fails.

```
Step 1: Reserve inventory       ← compensate: release reservation
Step 2: Charge payment          ← compensate: issue refund
Step 3: Dispatch fulfilment     ← compensate: cancel dispatch order
```

#### 3.8.2 Circuit Breakers and Idempotency

Wrap downstream agent calls in circuit breakers to prevent cascading failures. Design all agent actions to be idempotent where possible.

---

### 3.9 Security and Trust Boundaries

#### 3.9.1 Capability-Based Access Control and Threat Modelling

Model tool access as capabilities, not permissions. An agent should only have access to the tools it needs for its role. 
*Note on Threat Modelling:* Security in agent chains is understudied. It is critical to run adversarial threat models addressing prompt injection that propagates across boundaries, privilege escalation via tool composition, and data leakage through agent memory.

#### 3.9.2 Tamper-Evident Audit Trails

Log every tool call explicitly: which agent invoked it, parameters passed, results returned, and the trace ID. Logs should be append-only or stored where agents cannot rewrite them.

---

### 3.10 Human-in-the-Loop and Safety Guardrails

- **Confirmation Checkpoints:** Require explicit human approval before irreversible actions. Crucially, these checkpoints **must be designed to be async** — the human may not respond immediately, and the workflow must remain resumable after an arbitrary pause.
- **Parallel Safety Screening:** Run secondary guardrail agents concurrently with the primary generator to screen for policy violations without adding latency.

---

### 3.11 Observability and Debugging

#### 3.11.1 Distributed Tracing and Structured Logging

Follow the OpenTelemetry specification. Every agent invocation is a span.

#### 3.11.2 Workflow Visualisation

Maintain a real-time or near-real-time DAG view showing task states, which agent is currently executing each task, and where failures occurred. This is invaluable for debugging and monitoring execution.

#### 3.11.3 Replay and Determinism

Design workflows so that a failed run can be replayed from any checkpoint. **Checkpointed replay** (re-running from the last successful checkpoint with persisted state) is the practical minimum requirement for recovery.

---

### 3.12 Evaluation and Testing

#### 3.12.1 Evaluation Approaches

> **Key Principle:** Avoid using the same model family as both the generator agent and the evaluator judge — this introduces systematic blind spots and scoring bias.

#### 3.12.2 Human Evaluation

Human evaluation remains essential. Use a diverse panel including both subject-matter experts and representative end-users. Establish a regular evaluation cadence — not just at launch — to catch subtle behavioural drift.

#### 3.12.3 Testing Levels

Testing should include unit tests (mocked tools), integration tests (agent handoffs), end-to-end testing, chaos testing, and **cost regression testing** (asserting that token consumption remains within expected limits).

---

### 3.13 Scaling Considerations

Horizontally scale stateless workers, partition/shard work by domain keys for high throughput, and use caching for deterministic outputs (e.g. web search results cache TTL based on volatility).

---

### 3.14 Common Anti-Patterns

| Anti-Pattern | Description | Fix |
|---|---|---|
| **The God Agent** | A single agent given all tools, context, and full autonomy. Produces unpredictable behaviour. | Decompose into specialised agents with narrow responsibilities. |
| **Implicit state in memory** | Passing state between agents via conversational context rather than structured stores. | Externalise all inter-agent state to a canonical store. |
| **Unbounded loops** | Agents spawning sub-agents without a depth limit. Costs grow exponentially. | Enforce a maximum delegation depth and time limit. |
| **Silent failure** | An agent returns plausible but incorrect output rather than raising an error. | Implement explicit error types in the output schema. |
| **Plan-and-pray** | Generating a full plan upfront without checkpoints or re-planning. | Use iterative planning with explicit validation checkpoints. |

---

### 3.15 Framework and Tooling Selection

Start with direct API calls for simple systems. Adopt frameworks (like AutoGen, LangGraph, CrewAI) only when their specific abstractions (group chat, state machines) save significant custom coding. Always understand the underlying prompts the framework injects.

---

### 3.16 Architectural Patterns from Adjacent Domains

The following patterns from distributed systems engineering transfer directly to multi-agent reliability and should be incorporated:

- **Saga Pattern** — compensating transactions for distributed workflows (Garcia-Molina & Salem, 1987).
- **Circuit Breaker Pattern** — preventing cascading failures (Nygard, *Release It!*).
- **Competing Consumers Pattern** — horizontal scaling of worker agents via a shared queue.
- **Event Sourcing** — storing state as a sequence of immutable events to enable full deterministic replay.

---

## 4. Source Inventory

| ID | Source | Type | Date | Quality | Notes |
|----|--------|------|------|---------|-------|
| S1 | Wang et al. — "A Survey on Large Language Model based Autonomous Agents" (arXiv:2308.11432) | Academic preprint | 2023-08 / revised 2025-03 | High — multi-institutional, extensively cited, revised through 2025 | Foundation for agent architecture taxonomy: profiling, memory, planning, action modules. |
| S2 | Anthropic Engineering — "Building Effective Agents" | Practitioner engineering blog | Dec 2024 | High — authored by practitioners with production experience | Core workflow taxonomy; tool design / ACI principles; simplicity-first bias. |
| S3 | Guo et al. — "LLM-based Multi-Agents: A Survey of Progress and Challenges" (arXiv:2402.01680) | Academic preprint | 2024-01 / updated 2024-04 | High — multi-institutional; 50+ systems surveyed | Communication structures, profiling methods, challenge catalogue. |
| S4 | Microsoft AutoGen — Documentation | Official framework docs | 2024 (ongoing) | High for factual claims about the framework | Team topologies, design patterns, multi-agent design pattern catalogue. |
| S5 | AWS Machine Learning Blog — "Best practices for building robust generative AI applications..." | Practitioner blog | Oct 2024 | Medium — credible practitioners; vendor context | Ground truth data collection; agent scoping; multi-agent modularity. |
| S6 | CrewAI Documentation — "Agents" | Official framework docs | 2025 | Medium — authoritative for CrewAI-specific behaviour | Agent attribute reference; context window management. |

---

## 5. Conflicts & Open Questions

**Autonomy vs. Reliability Tension:** 
Practitioner sources argue strongly for minimal autonomy and human confirmation on reversible actions, reflecting the adversarial and ambiguous nature of production environments. Conversely, academic works frequently demonstrate impressive autonomous task completion in controlled sandbox settings. The discrepancy highlights the gap between benchmark capability and production reliability.

**Framework vs. Direct API:**
Framework documentation naturally presents frameworks as the appropriate default. Practitioner guidance strongly recommends starting with direct API calls. Framework adoption is a deliberate tradeoff: faster bootstrapping vs. reduced transparency.

---

## 6. Blindspot / Gap Analysis

- [x] **Opposing view** — Covered. The simplicity filter and single-agent baseline provide the counter-weight to orchestration complexity.
- [x] **Practitioner vs theoretical** — Covered. Both perspectives are balanced throughout.
- [ ] **Geographic / cultural variation** — Not covered. Regulatory environments (EU AI Act, GDPR, HIPAA) and non-English linguistic nuances remain a gap in primary literature.
- [ ] **Negative results and post-mortems** — Absent in primary literature. There is no systematic documentation of failed architectures. Following up on GitHub issue trackers and engineering post-mortem blogs is the highest-priority next step for the field.
- [ ] **Security depth** — Shallow. Prompt injection, agent impersonation, and tool abuse require dedicated adversarial ML research to build rigorous threat models.

---

## 7. Recommended Next Steps

1. **Apply the simplicity filter before design.** Ensure a single, well-prompted LLM demonstrably fails before adopting multi-agent orchestration.
2. **Establish ground-truth datasets** before writing orchestration code to objectively measure iterations.
3. **Invest heavily in tool design (ACI)** and make tool contracts robust and mistake-proof.
4. **Consult classical distributed systems literature** for fault-tolerance patterns (Sagas, Circuit Breakers).
5. **Run a security threat model** focused on agent injection and capability escalation before production deployment.
6. **Seek out production failure post-mortems** from community forums and engineering blogs to supplement the lack of negative results in academic literature.

---

## 8. Summary Checklist

### Architecture & Operations
- [ ] Single-LLM baseline has been measured and failed.
- [ ] Each agent has a single, nameable responsibility (passes "three words" test).
- [ ] Agent input/output schemas are defined and validated.
- [ ] Maximum delegation depth is enforced.
- [ ] Agent configurations (prompts, tool definitions, models) are versioned with rollback capability.

### Communication & Planning
- [ ] All inter-agent messages are structured (JSON/Protobuf).
- [ ] Every message carries trace ID, span ID, and idempotency key.
- [ ] Task dependencies are explicit (DAG), not inferred.
- [ ] Time and cost budgets are assigned to tasks.

### Memory & State
- [ ] All persistent workflow state lives in a single ACID-compliant, authoritative store.
- [ ] Optimistic concurrency control handles state updates.
- [ ] Memory reflection occurs at natural task boundaries.

### Reliability & Security
- [ ] Sagas/compensating transactions are defined for irreversible actions.
- [ ] Circuit breakers wrap downstream calls.
- [ ] Failed tasks land in a Dead Letter Queue.
- [ ] Agents operate with least-privilege capability tokens.
- [ ] Prompt injection defences isolate untrusted inputs.
- [ ] Human-in-the-loop checkpoints are async and gate high-stakes actions.

### Observability & Evaluation
- [ ] Distributed tracing (OpenTelemetry) is implemented.
- [ ] DAG workflow visualisation is available for debugging.
- [ ] LLM-as-evaluator uses a different model family from the generator.
- [ ] Evaluation includes diverse human panels on a regular cadence.
- [ ] Cost regression assertions are part of the testing suite.

---

## Addendum: Additional Coverage

*Added by post-synthesis audit to address gaps identified across all comparison reports.*

### A.1 Planning and Reasoning Strategies

LLM-based agents rely on explicit reasoning strategies for task decomposition. The principal approaches, in order of increasing complexity and feedback richness:

| Strategy | Feedback type | When to use |
|---|---|---|
| **Chain-of-Thought (CoT)** | None (generation only) | Simple linear decomposition; no environment interaction needed |
| **Tree of Thoughts (ToT)** | None (search over reasoning paths) | Tasks with multiple plausible solution paths; useful for creative or exploratory planning |
| **ReAct** | Real-time environment feedback | Tasks requiring interleaved reasoning and tool use; standard choice for tool-using agents |
| **Reflexion** | Retrospective verbal feedback | Tasks where the agent can critique its own prior output and revise; extends ReAct with self-correction |
| **Voyager-style / Skill libraries** | Persistent memory of learned sub-routines | Open-ended, long-horizon tasks where reusing previously acquired skills improves efficiency |

**Key design rules:**
- Prefer ReAct for any agent that invokes tools — it interleaves reasoning and action in a way models are well-calibrated for.
- Combine Reflexion with ReAct for tasks with verifiable success criteria (e.g., code execution, database queries).
- For multi-step planning where the full plan can be validated before execution, use ToT or explicit DAG construction rather than greedy step-by-step generation.
- Avoid CoT-only approaches for agentic tasks — without environment feedback, error compounds silently.

---

### A.2 Memory Reflection Triggers

All comparison reports flagged the absence of actionable guidance on *when* to trigger memory reflection or summarisation. The following heuristics operationalise this:

**Trigger reflection when any of the following thresholds are met:**

1. **Context window pressure:** When the working context exceeds ~70–80% of the model's context limit, summarise older turns before proceeding. Frameworks like CrewAI's `respect_context_window` mode automate this.
2. **Task boundary:** At the natural completion of a sub-task, distill the key outcome and discard fine-grained intermediate steps. This preserves the insight without consuming future context.
3. **Turn count:** After every N agent turns (a reasonable default is N=10–15), trigger a consolidation pass that produces a higher-order summary tagged with importance, recency, and relevance weights: `score = α·recency + β·relevance + γ·importance`.
4. **Explicit planning phase:** At the start of any new planning horizon (e.g., when the orchestrator issues a new sub-goal), flush transient working memory and write only the lasting insights to the long-term store.

**Write policy:**
- Deduplicate before writing to long-term memory.
- Evict low-importance records under storage pressure (lowest `score` first).
- Keep structured artefacts (schemas, results) separate from conversational summaries.

---

### A.3 Standardised Evaluation Benchmarks

No agreed-upon multi-agent evaluation harness exists as of May 2025, but the following candidates are the most cited in practitioner literature:

| Benchmark | Focus | Notes |
|---|---|---|
| **AgentBench** | General agent task performance across diverse environments | Suitable for comparing architecture choices across web, code, and reasoning tasks |
| **GAIA** | Real-world assistant tasks requiring multi-step tool use | Closer to production use cases than synthetic benchmarks |
| **SWE-bench** | Software engineering tasks (bug fixing, feature implementation) | Best for evaluating coding-agent pipelines |
| **WebArena** | Web navigation and task completion | Relevant for agents operating in browser-based environments |

**Practical guidance:** In the absence of a standard harness, construct a minimum viable evaluation set of 20–50 real-world examples covering your specific task distribution. Each example should capture: the input, the expected tool calls and sub-task sequence, the expected final output, and at least one edge case. Ground truth should be validated by a subject-matter expert before use.

---

### A.4 Error Recovery Mid-Pipeline

Partial-failure recovery — re-entering a workflow at a specific failed step without full restart — is a practical open question acknowledged but not resolved across all comparison reports. The following patterns address it:

**Checkpoint-based recovery:**
- Persist the workflow's state machine (see §3.6.3) to durable storage at every state transition.
- On failure, load the last persisted checkpoint and re-dispatch from the `FAILED` state, not from `PENDING`. This requires all upstream steps to have already committed their results.
- Design tool calls to be idempotent (§3.8.2) so that re-execution of a step from a checkpoint does not produce duplicate side effects.

**Dead Letter Queue (DLQ) pattern:**
- Tasks that exceed their maximum retry count are moved to a DLQ rather than silently dropped.
- A separate operator-reviewed process classifies DLQ entries and decides whether to: (a) re-queue with adjusted parameters, (b) escalate to human resolution, or (c) mark as permanently failed.

**Re-planning bounds:**
- If recovery requires re-planning (the original plan is no longer valid), cap the number of re-planning attempts (recommended: ≤3) to prevent unbounded cost.
- If the re-plan limit is reached, surface the unresolved task to a human-in-the-loop checkpoint rather than allowing the system to cycle indefinitely.

---

### A.5 Resource-Constrained and Latency-Sensitive Environments

Standard multi-agent orchestration guidance assumes cloud-hosted LLMs with elastic compute. The trade-offs differ substantially in constrained environments:

| Constraint | Adaptation |
|---|---|
| **Hard latency budget (< 200 ms end-to-end)** | Limit to 1–2 agent hops maximum; use synchronous routing not orchestrator-worker loops; pre-warm agents |
| **Cost ceiling (token budget)** | Route sub-tasks to the smallest model capable of the subtask; enforce per-task token budgets via structured output constraints |
| **Limited parallelism (on-device / edge)** | Prefer sequential prompt chaining over parallel fan-out; cache deterministic results aggressively (TTL: 1 hour for web search, 24 hours for static knowledge base) |
| **Compliance / data residency** | Run all agents within the same geographic boundary; avoid cross-region memory stores; apply PII tagging before any external tool call |

**Key principle:** In latency-sensitive systems, observability overhead itself becomes a constraint. Use asynchronous log shipping rather than synchronous span export to avoid adding latency to the critical path.
