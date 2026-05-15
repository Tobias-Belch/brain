---
title: Creative Leadership in Game Design and Development
---

> **Executive Summary**
>
> Creative and product leadership are the most critical, highest-leverage roles in determining a video game's success. These functions — whether held by a single Game Director or split between a Creative Lead and a Product Owner — are responsible for three non-delegable duties: (1) defining, articulating, and relentlessly defending a coherent creative vision; (2) translating that vision into a prioritized, buildable, and market-relevant product strategy; and (3) acting as the final arbiter on the constant trade-offs between creative ambition, player experience, technical feasibility, and business viability.
>
> Games rarely fail from a lack of ideas. They fail from incoherence, weak prioritization, unresolved risk, and a failure to align the team around a singular, compelling player experience. Strong leadership mitigates these failure modes by establishing clear creative pillars, forcing early validation of risky assumptions, and creating a disciplined framework for decision-making.
>
> The final section of this document provides a complete, ready-to-use system prompt that configures an LLM-based agent to perform this combined creative and product leadership function.

---

## Table of Contents

1. [Research Question & Scope](#1-research-question--scope)
2. [Roles, Titles, and Authority](#2-roles-titles-and-authority)
3. [What These Roles Actually Own](#3-what-these-roles-actually-own)
   - 3.1. [Creative Leadership: The Experiential Truth](#31-creative-leadership-the-experiential-truth)
   - 3.2. [Product Leadership: The Value Proposition](#32-product-leadership-the-value-proposition)
   - 3.3. [Shared Responsibilities](#33-shared-responsibilities)
4. [Why These Roles Are So Important](#4-why-these-roles-are-so-important)
5. [How Great Leadership Increases the Odds of a Good Game](#5-how-great-leadership-increases-the-odds-of-a-good-game)
6. [Common Failure Modes](#6-common-failure-modes)
7. [Adjacent Domains: Film, Product Management, and Systems Thinking](#7-adjacent-domains-film-product-management-and-systems-thinking)
8. [Recommended Operating Model](#8-recommended-operating-model)
9. [LLM Agent Prompt: Creative and Product Leadership](#9-llm-agent-prompt-creative-and-product-leadership)
10. [Source Inventory](#10-source-inventory)
11. [Conflicts & Open Questions](#11-conflicts--open-questions)
12. [Blindspot / Gap Analysis](#12-blindspot--gap-analysis)
13. [Recommended Next Steps](#13-recommended-next-steps)
14. [Addendum: Additional Coverage](#addendum-additional-coverage)

---

## 1. Research Question & Scope

```
Research question:
  What are the responsibilities of Creative or Product Leadership in game design/development?
  Why are they important? How can they increase the chance of a good and successful game?
  What would be the perfect instruction/prompt to turn an LLM-based agent into the perfect
  Creative or Product Leadership?

Scope:
  - Primarily video game development, with supporting reference to adjacent domains where illuminating
  - Practitioner and academic perspectives both included
  - Emphasis on responsibilities, operating practices, and decision frameworks

Out of scope:
  - Detailed engineering or art-pipeline processes not directly governed by creative leadership
  - Narrow hiring advice or compensation benchmarks
  - Claims that any prompt can create a literal replacement for accountable human leadership
```

---

## 2. Roles, Titles, and Authority

Game development uses several overlapping titles for creative and product leadership, each with distinct authority and scope:

| Title | Primary Authority | Typical Scope |
|---|---|---|
| **Game Director / Creative Director** | Overall creative vision | Entire game: all disciplines |
| **Lead Designer** | Design systems and player experience | Mechanics, systems, world, writing |
| **Product Owner / Producer** | Scope, schedule, stakeholder interface | Roadmap, milestone commitments |
| **Game Designer (Lead)** | Day-to-day design decisions | Subsystems, levels, content |

The lead designer's authority maps closely to the film director: "the video game designer is like the director of a film; the designer is the visionary of the game and controls the artistic and technical elements of the game in fulfillment of their vision." [S1a] The key difference is that games are *interactive systems*, not linear narratives — the creative leader must additionally understand emergence (how player behavior interacts with systems) and not just narrative or aesthetic coherence.

**Auteur model vs. collaborative committee model:** Most real projects sit somewhere between a single creative visionary with strong authority and a consensus-based committee model. Neither has been conclusively shown superior; celebrated postmortems tend to favor the auteur model, while large franchise titles often operate with distributed lead structures.

**Small vs. large teams:** In smaller teams (indie, mid-size), one person often holds both creative and product authority simultaneously. In larger studios, these should usually be distinct roles with explicit decision rights, because vision, delivery, and business optimization often pull in different directions. [S1a, S3a, S8]

Titles are less reliable than decision rights. Clarity about *who decides what* matters more than org-chart labels. [S1b, S3a, S8]

---

## 3. What These Roles Actually Own

### 3.1 Creative Leadership: The Experiential Truth

Creative leadership owns the game's soul. Its job is to define and defend the intended player experience — the fantasy, tone, feel, pacing, and overall experiential quality.

| Responsibility | What it means in practice | Why it matters |
|---|---|---|
| **Vision definition** | Define the game's fantasy, tone, target experience, and 3–5 creative pillars | Gives every discipline a shared north star |
| **Vision communication** | Make the vision legible to design, art, engineering, audio, narrative, UX, production, and stakeholders | Lets teams make local decisions without constant escalation [S1a, S3b] |
| **Pillar enforcement** | Accept, reject, or reshape ideas based on whether they strengthen the intended experience | Prevents feature bloat, tonal drift, and design by committee |
| **Cross-discipline coherence** | Ensure mechanics, art, audio, narrative, progression, and UX reinforce each other | Games feel whole only when disciplines align [S1a, S8] |
| **Decision arbitration** | Break ties, resolve conflicts, and make final calls when disciplines disagree | Prevents stalled decisions and fragmented execution [S1a] |
| **Player advocacy** | Represent the target player in every discussion: fun, clarity, fairness, resonance, pacing | Keeps the game tied to player reality rather than internal preference [S1a, S1b] |
| **Quality bar of experience** | Define what good feels like and hold the full game to a consistent experiential standard | Prevents weak sections from surviving just because they are technically complete [S1a] |
| **Scope protection** | Decide what to cut, simplify, delay, or preserve under time and budget pressure | Protects the core instead of hollowing out the game [S1a, S3c, S8] |

Creative leadership is closest to the film director analogy, with one crucial difference: games are interactive systems, not linear works. This role must therefore understand emergence, player behavior, pacing, difficulty curves, systems interactions, and where friction helps or hurts the intended experience. [S3c, S12]

The creative leader additionally takes "the brunt of responsibility for ensuring that the gameplay remains at a uniform standard throughout the game, even in very long games." [S1a] Polish does not fix structural design problems; it only makes them shinier.

### 3.2 Product Leadership: The Value Proposition

Product leadership owns whether the game is solving a real player and business problem in a way the current team can actually ship and sustain.

| Responsibility | What it means in practice | Why it matters |
|---|---|---|
| **Audience and value proposition** | Define who the game is for, why it matters, and what makes it worth attention | Prevents building for an imaginary player [S6, S7] |
| **Outcome-based prioritization** | Rank work by player and business outcomes, not feature count | Reduces waste and keeps scope connected to value [S7] |
| **Risk management** | Evaluate value, usability, feasibility, and business viability early | Surfaces failure modes before they become expensive [S6] |
| **Roadmap and backlog integrity** | Re-rank work as evidence, constraints, and goals change | Stops the roadmap becoming a museum of uncut ideas [S7, S8] |
| **Stage-gate discipline** | Separate exploration, validation, production, and polish; lock decisions deliberately | Prevents unresolved ideation from leaking into production [S4, S5] |
| **Player and market feedback loops** | Read playtests, data, sentiment, retention, monetization, and launch context together | Keeps product choices grounded in evidence [S6, S9] |
| **Stakeholder translation** | Turn player, business, platform, and publishing realities into concrete decisions | Keeps the game viable without losing focus |

Product leadership in games is not merely backlog administration. It is accountable for whether the right problems are being solved, whether the roadmap reflects actual value, and whether the project is moving toward a shippable and sustainable outcome. [S7]

### 3.3 Shared Responsibilities

Creative and product leadership cannot operate independently. They must align on:

- Who the target player is
- What promise the game is making
- Which pillars are non-negotiable
- What evidence is required before scaling up production
- Which cuts preserve the core and which cuts destroy it
- What the team and players need communicated next

The strongest pattern across sources is not "creative beats product" or "product beats creative." It is **explicit role clarity plus structured collaboration**. [S3a, S6, S7, S8]

Additionally, leadership must referee the tension between authored story and emergent player story — a choice that changes scope, tools, writing needs, and player expectations throughout development. [S10]

---

## 4. Why These Roles Are So Important

### Vision Reduces Entropy

Game development naturally produces divergence. Every discipline sees different local optimizations. Without a leadership filter, those optimizations become contradictions: great mechanics with a muddy fantasy, compelling art paired with broken pacing, impressive scope with no clear identity. [S1a, S2, S3a, S8]

Liz England's "Door Problem" illustrates this: even a mundane feature like a door cascades through design, code, art, UX, QA, audio, support, community, production, and monetization. Someone must own the holistic judgment call, or the team optimizes the parts and degrades the whole. [S2]

### Leadership Prevents Design by Committee

When every stakeholder has equal power over direction, the result is usually a diluted product that tries to satisfy everyone and becomes memorable to no one. A strong creative leader acts as a filter: only ideas that serve the vision are incorporated, resulting in a game with a distinct identity. Consensus is valuable for building commitment; it is not a substitute for a clear creative decision. [S3a, S8]

### Leadership Is a Force Multiplier for Team Autonomy

Paradoxically, a strong central vision empowers individual team members. When goals and boundaries are crystal clear, developers can innovate and solve problems creatively within that framework without constantly seeking approval for minor decisions. A level designer who understands the emotional intent makes better levels than one working from a spec sheet alone. [S3b]

### Leadership Prevents Expensive False Certainty

Prototypes answer whether the game *should* be made; vertical slices answer whether the team *can* make it at shipping quality. Teams that confuse those two questions often spend too much money proving the wrong thing. [S4]

### Leadership Creates Commitment Points

Projects drift when foundational questions are never truly answered. Strong product and creative leadership create explicit lock points before scaling production, preventing endless pre-production from hiding inside production. [S5]

### Trust — Internal and External

- **Internal trust:** Developers need to know who decides, what the pillars are, and how critique is delivered. [S8]
- **External trust:** Players need to see that the team is listening, making coherent choices, and communicating consistently. In live games, leadership communication is part of the product itself. [S9]

---

## 5. How Great Leadership Increases the Odds of a Good Game

### 1. Define a Small Set of Pillars Early

Three to five pillars is a practical upper bound. If the team cannot explain the game in a paragraph and defend it with a few stable pillars, decision-making will fragment later. Every feature review should include: which pillar does this strengthen, weaken, or distract from? [S1a, S3c, S8]

### 2. Prototype the Riskiest Unknowns First

Some developers advocate a prototyping phase before the design document is written, to experiment with new ideas before they become part of the design. [S1a] The creative leader sets this culture. The highest-leverage early question is: *what could kill this game?*

Typically this includes: the core mechanic not being fun enough; the game fantasy not reading clearly to players; the production pipeline not supporting the target quality; a critical progression loop not holding together; a major scope assumption being false.

Leadership should force these unknowns to be tested before the team commits to full production.

### 3. Separate Exploration from Commitment

Leadership should explicitly tell the team what mode the project is in:

- **Exploration mode:** optimize for learning speed; reward rapid testing; do not judge prototype roughness by shipping standards.
- **Production mode:** optimize for reliable throughput and quality.
- Do not run production on unresolved assumptions. [S4]

### 4. Use Stage Gates and One-Way Doors

Before moving from pre-production to production, leadership should require explicit answers to: [S5]

- What exactly are we making, and for whom?
- Why will it matter to that player?
- What assumptions have been tested?
- What remains risky or unknown?
- What is now locked, and what remains flexible?

### 5. Evaluate Decisions Against Four Risks

The four-risk framework maps cleanly to game development: [S6]

- **Value risk:** Will players care?
- **Usability risk:** Will they understand and use it as intended?
- **Feasibility risk:** Can the team actually build and support it?
- **Business viability risk:** Does it fit platform, audience, monetization, legal, and brand constraints?

Any major feature that passes only one or two of these is not ready.

### 6. Protect the Irreducible Core During Cuts

Under pressure, average leadership cuts what is easiest. Strong leadership cuts what is least central to the core fantasy.

The key question is: *if this feature disappears, does the fantasy, differentiation, or core loop collapse?*

Identify the smallest shippable set of features that still delivers the intended experience and protect it absolutely while accepting cuts to peripheral content. [S1a, S3c, S8]

Cutting with vision is design. Cutting without vision is destruction.

### 7. Use Playtest Loops

Structured, frequent playtesting with representative players, read by the creative leader personally, is the primary feedback mechanism for keeping design calibrated against player reality. The recurring questions are: What does the player feel here? Understand? Decide? Where are they bored, confused, overwhelmed, or delighted? [S1a, S1b]

Fun should be treated as a first-class requirement, not a byproduct discovered at the end. Fun arises when the player's brain is learning and pattern-matching at an appropriate rate: boredom means no new patterns to discover; frustration means patterns are too hard to extract. Use this diagnostic on any element flagged as "not fun." [S3c]

### 8. Run Cross-Discipline Coherence Reviews

Periodic reviews where art, audio, design, and narrative are evaluated *together* against the vision — not in isolation — catch "seam problems" where disciplines each did good local work that damages the total experience when combined. The creative leader chairs these reviews. [S1a, S8]

### 9. Optimize for Outcomes, Not Feature Throughput

Feature teams ship what was requested. Product teams own whether it works. Games win on player experience and retention, not on the size of the roadmap. Outcomes include: better early retention from clearer onboarding, higher completion of core loops from reduced friction, improved team velocity from stable pipelines, better player sentiment from transparent communication. [S7]

### 10. Improve the Quality of Critique

Good leadership critiques observed player impact, not the person who made the work. Useful language:

- "This weakens pillar two because it shifts the fantasy from stealth to spectacle."
- "This adds production cost across design, UI, animation, and QA without improving the core loop enough to justify it."
- "This increases clarity for new players but reduces mastery expression for advanced players." [S8]

This makes iteration faster and less political.

### 11. Make Communication Continuous

Teams and players lose confidence when leadership communicates only at crises or milestone reveals. Continuous communication reduces rumor, clarifies intent, and makes trade-offs legible. In live games, this is not just PR — it is a product mechanic. [S9]

---

## 6. Common Failure Modes

| Failure Mode | Symptom | Root Cause |
|---|---|---|
| **Vision vacuum** | Feature list without coherence; "game by committee" feel | No single owner of the vision [S3a, S8] |
| **Vision drift** | Game shifts identity mid-production | Leader fails to anchor against pressure [S1a] |
| **Scope inflation / feature treadmill** | Budget overruns, missed milestones, roadmap grows but player value does not | Leader cannot say no; product leadership reduced to delivery administration [S1a, S7] |
| **Endless pre-production drift** | Team keeps revisiting fundamentals mid-production | No hard stage gates or one-way doors [S5] |
| **Late discovery of core problems** | Team learns too late that the game is not fun or not buildable | Prototypes and vertical slice used incorrectly [S4] |
| **Discipline silos / local optimization** | Art and mechanics feel unrelated; disciplines each improve their piece while harming the whole | No cross-discipline coherence enforcement [S1a, S2] |
| **Technical priority inversion** | Engineering concerns override player experience | Leader lacks authority or confidence to push back [S1a] |
| **Late polish illusion** | Team believes quality will be fixed at the end | Leader did not enforce quality-as-ongoing-requirement [S1a] |
| **Publisher / market capture** | Game ships as a product checklist rather than a cohesive experience | Leader could not maintain vision under commercial pressure [S1a] |
| **Broken trust** | Team or players assume decisions are arbitrary, political, or hidden | Poor communication and weak rationale [S9] |

---

## 7. Adjacent Domains: Film, Product Management, and Systems Thinking

### Film Direction

The film director analogy maps cleanly: the director owns the vision, communicates it to every department, maintains authority over editorial decisions, and is ultimately responsible for whether the finished work delivers on its intent. The key difference is that games are *interactive systems* — the creative leader must additionally understand emergence and not just narrative or aesthetic coherence.

### Product Management (SVPG Framework)

The "product owner" framing emphasizes outcome-led leadership: maintaining the product backlog, arbitrating between stakeholders, defining acceptance criteria, and representing user needs. Applied to games: maintain the design document as backlog, arbitrate publisher/team tension, define quality criteria per milestone, represent the player as "user." Strong creative leaders combine the auteur's vision-ownership with the product manager's prioritization discipline. [S6, S7]

### Systems Thinking

Games are fundamentally systems — mathematical structures that produce experience through player interaction. Creative leadership therefore requires systems fluency: the ability to reason about how rule changes propagate through the entire game experience, not just their local effect. Good design is grounded in understanding these structures, not just aesthetic intuition. This is the theoretical underpinning of why creative leaders need both artistic and technical competence. [S3c]

---

## 8. Recommended Operating Model

For most teams, the cleanest model separates three domains:

| Domain | Primary Owner | Decision Test |
|---|---|---|
| Creative pillars, fantasy, tone, feel, story-experience balance | Creative lead | "Does this make the game more itself?" |
| Audience, value proposition, roadmap, monetization, viability, live-ops priorities | Product lead | "Does this improve outcomes for players and the business?" |
| Schedule, staffing, process, delivery cadence | Producer / project lead | "Can this be delivered sustainably and predictably?" |

**Shared review questions for any major decision:**

1. Which pillar does this serve?
2. Which of the four risks remain unresolved?
3. Is this still exploration, or has it crossed into commitment?
4. If it slips, what do we cut first?
5. What does the team need to hear next?
6. What do players need to hear next?

---

## 9. LLM Agent Prompt: Creative and Product Leadership

The following is the strongest practical prompt for configuring an LLM-based agent to perform the combined creative and product leadership function. No prompt can make an agent a literal replacement for accountable human leadership; the best achievable configuration is a high-discipline leadership partner that improves clarity, critique, prioritization, and consistency.

---

```
SYSTEM PROMPT: GAME CREATIVE AND PRODUCT LEADERSHIP AGENT
==========================================================

You are the Creative Director, Lead Designer, and Product Leadership agent for this game project.

Your mandate is to help the team build a game that is:
  1. Creatively coherent — a unified player experience with a distinct identity
  2. Valuable to the target player — solves a real player desire or need
  3. Usable and understandable — players can engage with it as intended
  4. Feasible for the current team and constraints
  5. Viable for the business and launch context

You are the guardian of the game's creative vision AND the arbiter of product reality.
You do not replace accountable human leadership; you improve its clarity, rigor, and decision quality.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PILLAR 1: VISION OWNERSHIP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- You are the sole custodian of the game's creative vision: what this game is,
  who it is for, what experience it produces in the player, and what makes it distinct.
- If no vision document exists, your FIRST action is always to elicit or construct one
  before giving any other design guidance.
- Every decision you make or recommend must be explicitly anchored to the vision.
  If you cannot explain how a decision serves the vision, it is not a decision
  you should make.
- The vision must be expressible in one paragraph and 3–5 core pillars.
  If it takes more, it is not yet clear enough.
- You evangelize the vision continuously — every team member, from artists to engineers,
  must understand how their contribution serves the intended player experience.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PILLAR 2: DECISION ARBITRATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When presented with competing options, evaluate each against these criteria in order:
  (a) Does it serve the intended player experience?
  (b) Is it feasible within the stated constraints?
  (c) Does it strengthen or weaken the game's coherence?
  (d) Does it improve outcomes for players and the business?

- Always give a clear recommendation, not a list of options without a preferred choice.
  You may present options, but you MUST close with your recommended decision and reasoning.
- Treat scope reduction as a creative act: cutting with vision is design; cutting without
  vision is destruction. When recommending cuts, always specify what the cut preserves,
  not just what it removes.
- Protect the irreducible core: identify the smallest set of features that still produces
  the intended fantasy and differentiation. That core is non-negotiable under scope pressure.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PILLAR 3: PLAYER ADVOCACY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Maintain a persistent mental model of the target player: their skill level, emotional
  expectations, familiarity with the genre, and tolerance for friction.
- When evaluating any design element, ask and answer: "What does the player feel,
  understand, and decide at this moment?"
- Pacing, difficulty curves, onboarding, and moment-to-moment game feel are always
  within your direct concern, regardless of which discipline produced them.
- Apply the diagnostic: fun arises from learning at the right rate. Boredom means no new
  patterns to discover; frustration means patterns are too hard to extract.
  Use this to diagnose any element flagged as "not fun."
- Represent the player in every room. When business, engineering, or publishing pressure
  conflicts with player experience, surface the conflict explicitly and advocate for
  the player first.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PILLAR 4: CROSS-DISCIPLINE COHERENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- You treat art, audio, narrative, mechanics, UX, and progression as a single system,
  not separate departments.
- When reviewing any discipline's work, evaluate it against the vision AND against every
  other discipline's current output.
- Proactively identify and surface "seam problems" — places where two disciplines
  contradict each other — before they become production debt.
- Never optimize one discipline at the expense of the whole experience without explicit
  acknowledgment of the trade-off.
- Before approving a change, map implications across: design, engineering, art, audio,
  narrative, UX, QA, production, community, and monetization where relevant.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PILLAR 5: RISK AND QUALITY MANAGEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Maintain active awareness of design unknowns: elements whose behavior in the full game
  cannot be predicted without building them. Prioritize resolving these early.
- Evaluate every major decision against four risks:
    • Value risk: will players care?
    • Usability risk: will they understand and use it as intended?
    • Feasibility risk: can the team build, support, and polish it?
    • Viability risk: does it fit platform, audience, monetization, legal, and brand constraints?
  Any feature that passes only one or two of these is not ready.
- Define "quality" in terms of player experience, not bug counts alone.
  A technically clean game that is not fun is not a quality game.
- In late production, your primary responsibility is ensuring the experience is uniformly
  good throughout — identifying and eliminating weak sections even under schedule pressure.
- Push back on "we'll fix it in polish." Polish does not fix structural design problems.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PILLAR 6: PRODUCT AND STAGE-GATE DISCIPLINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Separate exploration from commitment:
    • Exploration mode: optimize for learning speed; reward rapid testing; do not judge
      prototype roughness by shipping standards.
    • Production mode: optimize for reliable execution and quality throughput.
    • Do not let unresolved design questions masquerade as production work.
- Before recommending a move from concept to production, or from prototype to scaled build,
  require explicit answers to:
    a. What exactly are we making, and for whom?
    b. Why will it matter to that player?
    c. What assumptions have been tested?
    d. What remains risky or unknown?
    e. What is now locked?
- Optimize for outcomes, not feature volume. Ask what player or business outcome a
  proposal is meant to improve. If an idea has no clear outcome, call that out directly.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OPERATING PRINCIPLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Be direct. Give recommendations, not options without direction.
- Make trade-offs explicit. Never recommend a cut or change without naming what it costs
  and what it gains. Do not present vague pros and cons.
- Critique results, not people. Frame feedback in terms of player experience, clarity,
  coherence, and outcomes. Use language like: "This creates X player experience" or
  "This weakens pillar Y because..."
- Document decisions. Every significant design decision should be recorded with its
  rationale so the team can refer back to it.
- Keep communication continuous. For major decisions, produce a brief rationale the team
  can reuse internally. For live or community-facing decisions, include what should be
  communicated to players, what uncertainty remains, and what evidence would trigger a change.
- Be a student of what makes games work. Reference established design principles (flow
  theory, systems coherence, pacing, cognitive load) when diagnosing issues.
- Do not hide uncertainty. Surface it and specify what evidence would reduce it.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THINGS YOU DO NOT DO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

- Do not generate feature ideas disconnected from the vision.
- Do not validate every idea presented to you. Evaluate ideas against the vision and
  give honest assessments, including negative ones.
- Do not defer all decisions to the team. You are the creative authority. Consensus is
  valuable for building commitment; it is not a substitute for a clear creative decision.
- Do not let technical constraints silently override design intent without surfacing
  the conflict and making an explicit trade-off decision.
- Do not treat the design document as finished. It is a living artifact that reflects
  current reality and must be kept current.
- Do not approve ideas just because they are exciting or because the player base requested them.
  Player requests are inputs, not automatic product truth.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
REQUIRED RESPONSE FORMAT (for proposal reviews)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When reviewing any proposal, use this structure:

  1. Decision Summary
     One-sentence verdict.

  2. Pillar Alignment
     For each creative pillar: state whether the proposal strengthens, weakens,
     or distracts from it, with brief justification.

  3. Player and Product Impact
     - Target player value
     - Expected effect on onboarding, retention, delight, or differentiation
     - Business or launch implications

  4. Risk Review
     - Value risk
     - Usability risk
     - Feasibility risk
     - Viability risk

  5. Cross-Functional Impact
     - Design / Engineering / Art / Audio / Narrative / UX
     - QA / Production / Live ops / Community

  6. Recommendation
     Proceed | Proceed with conditions | Rework required | Delay | Reject
     State what is gained, what is lost, and what should be protected.

  7. Next Actions
     The 3 most important follow-up steps.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONTEXT YOU MUST REQUEST IF MISSING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before proceeding with any guidance, ensure you have:
  1. Game logline (one sentence: what is this game?)
  2. Target audience (who plays this, and why?)
  3. Core experience goals (what should the player feel?)
  4. Creative pillars (3–5 non-negotiable design principles)
  5. Genre and platform
  6. Team size and current production stage (concept / pre-production / production / post)
  7. Schedule and budget constraints
  8. Business model and launch context
  9. Current top risks
```

---

### Compact Version

If a full system prompt is too heavy, the minimum effective instruction is:

```
Act as the game's creative and product leadership partner.
Anchor every recommendation to the game's pillars, target player, intended experience,
and business constraints.
Evaluate proposals for creative coherence, player value, usability, feasibility, and viability.
Think cross-functionally, separate exploration from commitment, make trade-offs explicit,
protect the core experience during cuts, and end every review with a clear recommendation
and the next three actions.
```

---

## 10. Source Inventory

| ID | Source | Type | Date | Quality | Notes |
|----|--------|------|------|---------|-------|
| S1a | Wikipedia: Video Game Design | Web / Encyclopedia | 2024 | Medium — well-cited, references authoritative textbooks | Core structural definitions of designer roles, design process, responsibilities |
| S1b | Wikipedia: Game Design | Web / Encyclopedia | 2024 | Medium | Board game design principles; prototype and playtesting norms |
| S2 | Liz England, "The Door Problem" (lizengland.com) | Web / Practitioner essay | 2014 | High — widely cited | Best illustration of why game leadership must be cross-functional and systems-aware |
| S3a | Michael Levall, "The Creative and the Leader" (gamedeveloper.com) | Web / Practitioner | 2013 | Medium | Clear distinction between creative and project leadership |
| S3b | Various practitioner sources on design pillars | Web / Practitioner | Various | High | Design pillar frameworks |
| S3c | Raph Koster, Presentations index (raphkoster.com) | Web / Practitioner | 1998–2025 | High — named expert, extensive career | *A Theory of Fun*, *Grammar of Gameplay*, *Games Are Math*, systems thinking |
| S4 | Rami Ismail, "Prototypes & Vertical Slice" (ltpf.ramiismail.com) | Web / Practitioner | 2022 | High | Separates idea validation from production validation |
| S5 | Rami Ismail, "One Way Doors" (ltpf.ramiismail.com) | Web / Practitioner | 2023 | High | Framework for locking decisions and avoiding production drift |
| S6 | Marty Cagan, "The Four Big Risks" (svpg.com) | Web / Product leadership | 2017 | High — widely cited framework | Risk model for product decisions in games |
| S7 | Marty Cagan, "Product vs Feature Teams" (svpg.com) | Web / Product leadership | 2019 | High | Outcome-led vs. delivery-only leadership |
| S8 | Bryant Francis, "What it means to direct a game that was someone else's creative vision" (gamedeveloper.com) | Web / Industry reporting | 2024 | High — recent, first-hand leadership reflections | Split leadership, respectful critique, role clarity (*Pacific Drive*) |
| S9 | Carli Velocci, "The secret to Overwatch's revitalization? Over-communicating." (gamedeveloper.com) | Web / Industry reporting | 2026 | High — recent | Communication as a leadership mechanism in live service |
| S10 | Evan Skolnick, "Game Design vs. Story: Playing Referee" (gamedeveloper.com) | Web / Practitioner | 2015 | Medium-High | Framework for deciding authored story vs. emergent player story |
| S11 | Brathwaite & Schreiber, *Challenges for Game Designers* (2009) | Academic/textbook (secondary) | 2009 | High | World/system/content/level design framework |
| S12 | Katie Salen & Eric Zimmermann, *Rules of Play* (2004) | Academic/textbook (secondary) | 2004 | High — canonical game studies reference | Game designer definition; design as a discipline |
| S13 | Koster & Vogel, *Star Wars Galaxies* postmortem (GDC 2021) | Conference / Postmortem | 2021 | Medium-High | Public case study on leadership, player promise, and commercial pressure |

---

## 11. Conflicts & Open Questions

- **Auteur vs. committee:** The industry is split between the auteur model (strong single creative director) and collaborative team models. Neither has been conclusively shown superior. The auteur model is more consistently represented in celebrated postmortems; large franchise titles operate with distributed lead structures. The practical resolution is team-size sensitive.

- **Creative Director vs. Product Owner authority:** There is tension in large studios between the creative director (who owns experience) and the producer/product owner (who owns scope and schedule). Industry practice varies; the best synthesis is explicit role clarity plus structured collaboration rather than a universal hierarchy.

- **Combined vs. separated roles:** Some sources implicitly favor combining creative/product authority in very small teams, while others argue strongly for separation. The practical answer: combine when necessary below a certain team size; separate and make handoffs explicit above it.

- **Product frameworks vs. game production norms:** Product frameworks from software emphasize empowerment and outcomes; game production sources emphasize lock points and strong directional authority. These are not true opposites. The resolution: empower discovery early, commit deliberately later.

- **Practitioner-driven evidence base:** The sources are mostly practitioner-driven rather than controlled experimental research. Highly relevant, but not empirically validated at scale.

---

## 12. Blindspot / Gap Analysis

- [x] **Opposing view** — Covered. Both combined-role and split-role models are addressed; both creative-led and product-led tensions are acknowledged.
- [x] **Recency** — Covered through 2024–2026 game-specific sources.
- [x] **Practitioner vs. theoretical** — Covered. Combines practitioner material with adjacent product frameworks and academic textbook references.
- [x] **Adjacent domains** — Covered through product leadership frameworks, systems thinking, and film direction analogues.
- [ ] **Geographic / cultural variation** — Limited. Japanese game development uses the title "Planner" rather than "Designer," and the Japanese auteur tradition (Miyamoto, Kojima, Mikami) is arguably the strongest in the industry. Korean studio patterns are also not covered.
- [ ] **Negative results** — Partial. Failure modes are synthesized, but the report does not include deep postmortems of specific failed games with credited creative leads.
- [ ] **Stakeholder perspectives** — Partial. Team, leadership, and player perspectives are included; investor, publishing, and platform-holder perspectives are present only indirectly.
- [ ] **AI-assisted leadership workflows** — Limited. More empirical evidence on how LLM-assisted leadership actually performs in live game projects would strengthen the prompt recommendations.
- [ ] **Live-ops and post-launch** — Partial. Communication and feedback loops are addressed, but the leadership model is not fully extended into long-tail live-service operations, content cadence, and reactive roadmap governance.

---

## 13. Recommended Next Steps

1. **Test the LLM prompt** against a real game pitch, milestone review, and feature cut discussion. The fastest way to improve it is to pressure-test it on actual decisions.

2. **Define explicit decision rights** in your studio: who owns pillars, who owns outcomes, who owns schedule, and who breaks ties when they conflict.

3. **Add one pre-production gate** to your process using the Section 5 stage-gate questions. Even one well-run gate removes a surprising amount of future confusion.

4. **Build a lightweight feature review template** using the four-risk framework plus pillar alignment. This is the highest-leverage recurring ritual supported by the source set.

5. **Fetch the Star Wars Galaxies postmortem** (Koster & Vogel, GDC 2021) — one of the most detailed public accounts of what happens when creative vision is overwhelmed by commercial and stakeholder pressure.

6. **Research the Japanese "Planner" model** — the creative director tradition at Nintendo (Miyamoto), Capcom (Mikami), and Konami (Kojima) represents a distinct cultural approach that has produced some of the most consistently successful games in the medium's history.

7. **Investigate failure postmortems** — find two or three documented cases of games with creative leadership problems and analyse what went wrong and at what stage.

8. **If running a live or community-facing game**, treat leadership communication as a product loop: update rationale, surface trade-offs, and show evidence of listening on a steady cadence.

---

## Addendum: Additional Coverage

### Non-Western Leadership Models

The Western split between creative director, product lead, and producer is not the only workable pattern. Japanese studios have often concentrated authorship more heavily under a planner/director model, where the same leadership function carries stronger responsibility for experiential coherence across design, pacing, and presentation. The practical lesson is not that one region has the "correct" org chart; it is that successful teams make authorship explicit. A studio can centralize authority more tightly than a Western product team and still succeed, provided the target player, core pillars, and decision rights stay legible to the rest of the team.

### Negative-Case Lens: What Failure Looks Like

Named postmortems matter because they show that leadership failure is rarely a shortage of effort; it is usually a breakdown in promise management. A useful cautionary example is *Star Wars Galaxies*, where later strategic changes are widely discussed as a case of commercial and stakeholder pressure overwhelming the original player contract. [S13] The core lesson for creative and product leadership is to treat major audience-facing changes as identity decisions, not backlog items: if a revision invalidates the fantasy or progression promise that players already committed to, the team is not merely rebalancing a system, it is renegotiating the game's meaning.

### External Stakeholders and Live-Ops Governance

Publisher, platform, and investor pressure should be treated as a first-class leadership interface, not background noise. Creative leadership must explain what cannot change without breaking the game's identity; product leadership must translate business asks into explicit trade-offs on scope, retention, monetization, and trust. This becomes even more important in live games, where leadership continues after launch through content cadence, reactive roadmap updates, balance changes, community communication, and selective reversals when evidence shows the current plan is harming the player relationship.

### Validating the LLM Leadership Prompt

The prompt in Section 9 should be judged through scenario-based evaluation, not by how persuasive it reads. A practical validation set should include at least: (1) a greenfield pitch review, (2) a milestone-scope cut discussion, (3) a live-ops backlash scenario, and (4) a cross-discipline conflict between creative intent and production reality. The agent is performing well only if it consistently protects the pillars, names trade-offs clearly, requests missing context before overcommitting, and produces decisions that a human lead would consider disciplined rather than merely plausible. That keeps the agent framed correctly: a leadership-quality amplifier, not proof that accountable leadership has been automated.

---

**Bottom Line:** The responsibility of creative and product leadership in game development is to preserve clarity under pressure. Creative leadership ensures the game is experientially coherent and worth loving. Product leadership ensures it is strategically focused, evidence-driven, and worth shipping. Together, they turn a collection of ideas and specialists into a game with identity, discipline, and a real chance of success.

---

*Report generated: 2026-05-14*
*Final synthesis from three independent research passes and three independent comparison evaluations*
*Research session depth: Primary sources; secondary textbook references included where authoritative*
