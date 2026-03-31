---
title: "Research: Web Framework Performance & Developer Complexity"
---

**Frameworks compared:** Astro.js · Next.js (App Router + RSC) · QwikCity · SvelteKit · Nuxt · SolidStart  
**Dimensions:** Web Vitals (LCP, INP, CLS, TTFB, TBT, FCP) · Developer Complexity · Rendering Modes (SSG, SSR, ISR, CSR)

---

## Table of Contents

1. [Research Question & Scope](#1-research-question--scope)
2. [Methodology](#2-methodology)
3. [Key Findings](#3-key-findings)
4. [Source Inventory](#4-source-inventory)
5. [Conflicts & Open Questions](#5-conflicts--open-questions)
6. [Blindspot / Gap Analysis](#6-blindspot--gap-analysis)
7. [Recommended Next Steps](#7-recommended-next-steps)

---

## 1. Research Question & Scope

```
Research question:
  Which full-stack web framework — Astro.js, Next.js (App Router + RSC),
  QwikCity, SvelteKit, Nuxt, or SolidStart — delivers the best Web Vitals
  performance (LCP, INP, CLS, TTFB, TBT, FCP) across all rendering modes,
  and how do they compare on developer complexity?

Scope constraints:
  - Empirical/measured data only; no marketing material or vendor claims
  - All rendering modes compared in their optimised form (SSG, SSR, ISR, CSR)
  - Next.js evaluated using App Router + React Server Components (not Pages Router)
  - Meta-framework form only: SvelteKit, Nuxt, SolidStart, QwikCity
  - Sources accepted through March 2026

Out of scope:
  - Angular, Remix (merged into React Router 7), Vanilla JS, non-JS frameworks
  - Mobile-native frameworks
  - Backend-only or API-only performance (except as it affects TTFB)
  - Paid/enterprise tooling not available in OSS form
```

---

## 2. Methodology

- **Resource types consulted:** Web (benchmarks, academic papers, CrUX/RUM data, developer surveys, post-mortems, expert analysis)
- **Search strategy:** Searched for framework-specific Lighthouse benchmarks, HTTP Archive Web Almanac, CrUX field data, academic e-commerce prototype studies, developer survey results (State of JS 2024, Stack Overflow), expert performance engineering analyses (Alex Russell), and practitioner blog post-mortems
- **Depth:** Primary sources directly analysed; secondary leads followed with user approval (Alex Russell 2023/2026, "If Not React, Then What?", State of JS 2024 meta-frameworks + front-end frameworks pages)
- **Secondary sources approved by user:** Yes — 7 sources approved; 5 successfully added to NotebookLM; 2 failed (404 / JS-rendered only)
- **Tools used:** NotebookLM (notebook ID: `30d710b2-7e3f-42b9-95d5-2720ebbcce62`) as co-analyst with ~58 sources indexed; WebFetch; Read; RAG via `notebooklm ask`; data tables and briefing doc generated as NLM artifacts
- **Session history saved:** NLM note `Research Session 2026-03-31 - framework-performance gap retrospective` (ID: `94455526`)

---

## 3. Key Findings

### 3.1 Real-World Core Web Vitals Pass Rates (Field Data)

The most authoritative indicator of end-user performance is the Chrome User Experience Report (CrUX), which measures real devices and real networks — not lab simulations.

| Framework | CWV Pass Rate (all three) | INP Pass Rate | Source |
|---|---|---|---|
| **Astro** | ~50–63% | ~68.8% | S2, S3 |
| **SvelteKit** | ~40–45% | below 80% (better than SPA avg) | S2, S3 |
| Internet average | ~40.5% | ~60.9% | S3 |
| **Nuxt** | ~20% | below 80% | S2, S3 |
| **Next.js** | ~25–27% | well below 80% | S2, S3 |

Astro sites pass CWV at roughly 2× the rate of Next.js sites [S2, S3]. This gap widened significantly in March 2024 when INP replaced FID as the interactivity metric: Next.js saw a ~10% drop in passing scores, second-worst after 1C-Bitrix [S3]. SvelteKit also saw declines but fared better because its compiler eliminates virtual DOM overhead. **Conflicting evidence: see Section 5.1.**

### 3.2 Controlled Lab Benchmarks (LCP, FCP, TBT by Rendering Mode)

**CSR-only benchmark (Lissy93, identical app, real device):**

| Framework | Lighthouse | Bundle (gzip) | LCP | FCP | TBT |
|---|---|---|---|---|---|
| **SolidJS** | 100% | 9.0 KB | 1601ms | 1254ms | 0ms |
| **Vue** | 99% | 28.7 KB | 1932ms | 1572ms | 3ms |
| **Svelte** | 98% | 37.4 KB | 2034ms | 1711ms | 0ms |
| **Qwik** | 98% | 33.8 KB | 2375ms | 1498ms | 28ms |
| **React** | 96% | 49.1 KB | 2230ms | 1922ms | 148.5ms |

SolidJS wins CSR bundle size and LCP decisively [S1]. React's TBT (148.5ms) is 50× worse than SolidJS and Svelte's 0ms [S1]. Note: this benchmark tests bare frameworks, not meta-frameworks under SSR/SSG.

**E-commerce prototype study (academic, SSG/SSR/CSR comparison):**

| Framework | Mode | FCP | LCP |
|---|---|---|---|
| **Astro** | CSR | 0.303s | 0.303s |
| **Astro** | SSG | 0.349s | 0.483s |
| **SvelteKit** | SSG | 0.315s | 0.428s |
| **SvelteKit** | CSR | 0.525s | 0.525s |
| **Astro** | SSR | 0.368s | 1.007s |
| **Next.js** | CSR | 0.512s | 0.716s |
| **Next.js** | SSG | 0.554s | 0.833s |
| **SvelteKit** | SSR | 0.822s | 1.015s |
| **Next.js** | SSR | 1.212s | 1.413s |

Astro SSG and SvelteKit SSG are the fastest rendering modes across all measured frameworks [S4]. Next.js SSR produces the slowest FCP and LCP of any combination tested — a direct contradiction of the common claim that Next.js "excels at SSR." **Conflicting evidence: see Section 5.2.**

### 3.3 JavaScript Payload & Bundle Size (Real-World)

JavaScript payload is the primary driver of INP failure on budget Android devices [S7, S8]:

| Framework | Typical JS shipped (marketing site) | Notes |
|---|---|---|
| **Astro** | ~0–8 KB | Islands architecture; JS only where opted in [S2, S9] |
| **SvelteKit** | ~15–25 KB | Compiler eliminates VDOM runtime [S1, S9] |
| **Nuxt** | ~50–150 KB | Varies heavily by module usage [S9] |
| **Next.js** | ~70–180 KB | Base React runtime + hydration overhead [S2, S9] |

Alex Russell's 2026 budget for P75 global users: ~300–350 KB gzip total JS [S7, S8]. A Next.js marketing site begins at 70–90 KB of framework JS alone — before a single line of application code.

### 3.4 Server Throughput (TTFB under load)

Benchmarks are contradictory by workload type (see Section 5.2), but the general pattern [S5, S6]:

- **Next.js**: ~2,570 req/s for simple static-like pages (SSR with no DB)
- **Nuxt**: ~1,376 req/s simple pages; ~947 req/s with API fetch vs Next.js's ~388 req/s in same workload
- Nuxt's Nitro runtime outperforms Next.js once backend API calls are involved [S5]
- SvelteKit uses lean adapters with minimal overhead; competitive at simple SSR [S6]

TTFB stagnation is a systemic problem: HTTP Archive 2024 shows ~42% of pages have "good" TTFB, unchanged for 5 years [S3].

### 3.5 INP & Interactivity

INP is where the SPA tax is most visible. Key data points [S3, S7, S8]:

- SPAs average **only ~1 soft navigation per hard page load** (RUM Archive + Chrome data) — the core justification for heavy upfront JS collapses [S8]
- Multi-page architectures (Astro, SvelteKit with SSG/SSR) handle INP better because they avoid client-side navigation hydration chains
- Qwik's resumability model eliminates hydration entirely — the browser "resumes" from serialised state rather than re-executing component trees [S9]
- React/Next.js main-thread blocking under INP is structurally worsened by the Virtual DOM reconciler and synthetic event system [S7]

### 3.6 Developer Complexity

Synthesised from survey data, academic LoC comparisons, onboarding studies, and community post-mortems:

| Framework | Learning Curve | Boilerplate | Ecosystem Churn | Time to Proficiency |
|---|---|---|---|---|
| **SvelteKit** | Easy | Extremely low; 174 LoC vs React's 216 for same MVP | Low | 1–2 weeks [S1, S10] |
| **Nuxt** | Easy–Moderate | Very low (auto-imports, conventions) | Low | 4–8 hrs for basics [S9, S10] |
| **Astro** | Easy | Minimal; HTML-first, component islands opt-in | Very low | Fast [S2, S9] |
| **SolidStart** | Moderate | Lower than React; signals not hooks | Low | Moderate [S1, S9] |
| **QwikCity** | Moderate–Steep | Low boilerplate but resumability mental model is non-trivial | Moderate | Steep [S9, S10] |
| **Next.js** | Moderate–Steep | High; RSC/Client Component split, hydration mismatches, ISR config | High (breaking changes, App Router migration) | 1–2 months [S10, S11] |

State of JS 2024 developer pain points for Next.js [S11]: excessive complexity (242 mentions), breaking changes (210 mentions), choice overload. SvelteKit and Astro lead on retention and developer happiness. Next.js has near-lowest retention of any major framework despite highest usage — only Gatsby is worse [S11].

### 3.7 The Performance Tax / Velocity Dividend Trade-Off

Next.js's market dominance despite poor CWV performance is explained by rational business decisions [S9, S11, S12]:

- **Hiring liquidity**: ~25× more open roles for Next.js than Remix + Astro + Svelte combined [S12]
- **AI integration**: Vercel AI SDK holds ~74% market share for AI applications; Streaming UI for LLM responses is Next.js-native [S9]
- **Vendor safety**: Enterprise accountability via Vercel support; NuxtLabs acquired by Vercel in July 2025 accelerates consolidation [S9]
- **Full-stack consolidation**: Server Actions allow backend logic in UI components, cutting feature cycle times significantly [S9, S12]

This trade-off is explicitly characterised as "willingly paying the Performance Tax to gain the Velocity Dividend" [S12]. The decision is rational for enterprises but irrational for content sites, SEO-critical properties, or products targeting global/emerging-market users.

### 3.8 Stakeholder Decision Matrix

| Stakeholder | Recommended Framework | Primary Driver |
|---|---|---|
| **Content site / SEO** | Astro | CWV pass rate, zero-JS default, free CDN hosting |
| **E-commerce (performance-critical)** | Astro + SvelteKit | Lab + field data both favour these |
| **Startup / MVP (small team)** | SvelteKit or Nuxt | Low boilerplate, high retention, fast onboarding |
| **Enterprise app (large team)** | Next.js | Hiring pool, AI SDK, vendor accountability |
| **Performance-critical analytics / interactivity** | SolidStart or QwikCity | DOM speed, resumability, fine-grained reactivity |
| **Global / emerging-market users** | Astro or SvelteKit (SSG) | Budget device JS constraints (P75: ~300 KB budget) |

### 3.9 Emerging Developments (2024–2026) That Change the Picture

- **Core Web Vitals 2.0** (2026): Google shifting to session-based evaluation with Visual Stability Index (VSI) — expands scope beyond initial page load [S9]
- **Svelte 5 Runes**, **Vue 3.6 Vapor Mode**, **Angular 21 Signals**: all converging on fine-grained reactivity, bypassing VDOM; components mount 2.5× faster [S9]
- **Next.js Turbopack** now default bundler; App Router stable (was unstable in 2023); RSC cuts server render times up to 67% [S9]
- **Remix → React Router 7**: Remix as standalone framework is retired; merged into React Router [S9]
- **Nuxt's Nitro runtime**: deploy to Node.js, Cloudflare Workers, AWS Lambda with zero code changes [S9]
- **AI as primary framework selector** (2026): ~90% of teams use AI tools; Vercel AI SDK's streaming architecture gives Next.js structural advantage in AI product development [S9, S12]

---

## 4. Source Inventory

| ID | Source | Type | Date | Quality | Notes |
|----|--------|------|------|---------|-------|
| S1 | Lissy93 framework benchmarks (GitHub) — CSR comparison: SolidJS, Svelte, Vue, Qwik, React | Web / Code repo | 2023 | Medium — open benchmark, reproducible methodology, CSR only, not updated for meta-frameworks | Primary LCP/FCP/TBT/bundle data per framework |
| S2 | Astro CrUX analysis (2023 web.dev / astro.build community report) | Web | 2023 | High — CrUX is real-user field data; corroborated by HTTP Archive | CWV pass rates per framework from Google field data |
| S3 | HTTP Archive Web Almanac 2024 — Performance chapter | Web | 2024 | High — large-scale empirical dataset, independent publisher | INP transition impact, TTFB stagnation, CSR content vs LCP correlation |
| S4 | E-commerce prototype performance study (diva-portal.org, academic) | Academic | 2023 | Medium-High — controlled methodology, identical MVP; single lab study, n=1 implementation per framework | FCP/LCP by rendering mode; Astro SSG and SvelteKit SSG fastest |
| S5 | Next.js vs Nuxt throughput benchmark (independent blog/engineering report) | Web | 2023–2024 | Medium — reproducible setup described; single-lab conditions; workload dependency matters | req/s comparison by workload type |
| S6 | SvelteKit performance analysis / adapter benchmarks | Web | 2023–2024 | Medium — corroborated by other sources on bundle size claims | SSR TTFB and adapter overhead |
| S7 | Alex Russell — "Performance Inequality Gap 2023" (infrequently.org) | Web | 2023 | High — named expert (browser standards, Chromium), primary data (CrUX, RUM Archive), independently corroborated | P75 device/network baseline; JS budget; "privilege bubble" framing |
| S8 | Alex Russell — "Performance Inequality Gap 2026" + "If Not React, Then What?" (infrequently.org) | Web | 2024–2026 | High — same author; 2026 piece updates P75 baseline with new RUM Archive data | SPA soft-navigation frequency = 1; React as legacy; Astro/11ty recommendations |
| S9 | NotebookLM Briefing Document (Artifact A) — synthesised from ~58 indexed sources | Secondary synthesis | 2026-03-31 | Medium — NLM RAG synthesis, not a primary source; grounded in ~58 indexed primary/secondary sources | Executive summary, emerging trends, developer complexity synthesis, enterprise paradox |
| S10 | Developer complexity synthesis (NLM RAG query over multiple indexed sources) | Secondary synthesis | 2026-03-31 | Medium — NLM RAG; reflects consensus across State of JS, Stack Overflow, academic LoC studies | Onboarding time, boilerplate, learning curve per framework |
| S11 | State of JS 2024 — Meta-Frameworks + Front-End Frameworks pages | Web | 2024 | High — annual developer survey, large sample (8,500+ respondents), independent publisher | Usage, retention, satisfaction, pain points; Next.js retention paradox; Astro/SvelteKit happiness leaders |
| S12 | Enterprise adoption analysis (NLM synthesis: Ciphernutz migration report, hiring data sources, Vercel AI SDK market share data) | Secondary synthesis | 2024–2026 | Medium — business-case claims partially corroborated; hiring ratio is approximation; AI SDK market share from Vercel-adjacent source (potential funding bias) | "Performance Tax / Velocity Dividend" framing; 25× hiring ratio; 74% AI SDK market share |

---

## 5. Conflicts & Open Questions

### 5.1 Next.js CWV Pass Rate: 25% vs "superior SSR"

- **[S2, S3]** show ~25–27% CWV pass rate for Next.js in real-world CrUX field data
- **[S5]** and vendor documentation claim "superior SSR performance" and cite lab Lighthouse scores of 99–100 when optimised
- **Resolution**: Both are true but measure different things. Lab Lighthouse on a powerful machine with optimised config ≠ real-world P75 device. The 27% pass rate is from *all* Next.js sites in the wild, including unoptimised ones. The lab scores show the ceiling, not the median. CrUX is more representative for decision-making.

### 5.2 Next.js SSR vs Nuxt SSR Throughput: Contradictory by Workload

- **[S5]**: Next.js wins at simple SSR pages (~2,570 vs ~1,376 req/s for Nuxt)
- **[S5]**: Nuxt wins in API-fetch workloads (~947 vs ~388 req/s for Next.js)
- **[S4]**: Next.js SSR produces slowest FCP/LCP of any framework/mode combination (1.212s FCP, 1.413s LCP) — worse than SvelteKit SSR (0.822s FCP)
- **Unresolved**: The apparent contradiction between raw throughput and user-perceived latency metrics (LCP/FCP) suggests that Next.js SSR throughput advantages do not translate to faster perceived load times. Workload choice and server infrastructure heavily affect which metric "wins."

### 5.3 "Fastest Framework" Depends Entirely on Metric

Different benchmarks award the crown to different frameworks:
- DOM manipulation speed: SolidJS (fine-grained reactivity, virtual DOM eliminated) [S1]
- FCP/LCP under SSG: SvelteKit and Astro [S4]
- Real-world CWV: Astro [S2, S3]
- Raw SSR throughput (simple pages): Next.js [S5]
- Bundle size: SolidJS (9 KB gzip), Astro (0 KB default) [S1, S2]
- Time-to-ship / developer velocity: Next.js (hiring, ecosystem, AI integration) [S11, S12]

**No single framework is fastest on all dimensions.** Claims of "the fastest framework" should always specify the metric.

### 5.4 QwikCity CWV Data Gap

- There is no CrUX field data for QwikCity/Qwik at scale in the sources. The CSR benchmark [S1] shows Qwik with the worst LCP (2375ms) of the group despite its resumability architecture — suggesting the resumability advantage is primarily for subsequent interactions (INP), not initial load (LCP/FCP). Lab data only; no real-world validation at scale available.

### 5.5 SolidStart Real-World Data Gap

- SolidStart's State of JS 2024 "used at work" count is only 116 (vs Next.js's 5,147) [S11]. All SolidJS performance data in sources is from CSR benchmarks, not production SolidStart deployments. Real-world CWV data essentially does not exist in the source set.

### 5.6 NuxtLabs / Vercel Consolidation Impact

- Vercel acquired NuxtLabs in July 2025 [S9]. No sources yet capture how this affects Nuxt's independent governance, pricing, or architectural direction. Could represent either strengthening (investment, infrastructure) or weakening (vendor lock-in, divergence from Vue ecosystem priorities) for Nuxt.

---

## 6. Blindspot / Gap Analysis

**Retrospective checklist:**

- [x] **Opposing view** — Covered: strong steelman for Next.js via "Velocity Dividend" framing [S9, S12]; enterprise hiring-liquidity argument is well-documented and legitimate
- [x] **Recency** — Covered: sources span through 2026; key recency updates documented (INP transition, Turbopack, Runes/Vapor/Signals, NuxtLabs acquisition, AI SDK market share, RUM Archive SPA data)
- [x] **Practitioner vs theoretical** — Covered: controlled academic benchmarks [S4] vs real-world CrUX [S2, S3] vs developer survey sentiment [S11] vs engineering post-mortems; divergences documented in Section 5
- [x] **Geographic / cultural variation** — Covered: Performance Inequality Gap establishes P75 global baseline; Vue/Nuxt European and Asian market strength; enterprise Next.js/Angular US dominance; emerging-market JS budget constraints
- [x] **Adjacent domains** — Partially covered via NLM gap query: GraphQL over-fetch backfires, serverless cold-start latency, micro-frontend N+1 anti-patterns, edge compute without data gravity — all documented in sources [S9]
- [x] **Negative results** — Covered: SPA mathematical failure (1 soft nav per hard load); Next.js "move fast" illusion leading to remediation phases; unconstrained GraphQL degrading tail latency; naive serverless increasing p95 by 7%; micro-frontend latency penalty
- [x] **Stakeholder perspectives** — Covered: CTO (hiring, velocity), solo developer (boilerplate, DX), performance engineer (P75 device constraints), UX designer (INP, CLS, fine-grained reactivity)

**Remaining gaps (not fully resolved):**

1. **QwikCity at production scale**: No CrUX field data for Qwik-built sites. The resumability architecture is theoretically superior for INP, but this is unvalidated in real-world data at scale. Matters because it's the primary differentiated claim for Qwik.
2. **SolidStart production deployments**: Only 116 "used at work" responses in State of JS 2024; no CrUX cohort exists. All SolidJS performance data comes from CSR microbenchmarks. Real-world SSR/SSG performance of SolidStart is uncharted.
3. **Post-Nuxt/Vercel acquisition data**: No sources capture the strategic or technical impact of the July 2025 acquisition. Matters for teams choosing Nuxt on the basis of Vue ecosystem independence.
4. **ISR (Incremental Static Regeneration) comparison**: No controlled comparison of ISR mode across frameworks exists in the source set. Next.js ISR is a major differentiating feature; Nuxt and SvelteKit have equivalents. This mode is uncompared.
5. **AI-workload-specific performance**: All benchmarks measure traditional data fetching. LLM streaming responses introduce different latency profiles (TTFB matters more; chunked transfer changes perceived performance). No framework comparison data exists for this rapidly-growing workload type.

---

## 7. Recommended Next Steps

1. **For content / SEO projects: choose Astro.** The CWV field data is unambiguous. Astro's 50–63% pass rate vs Next.js's 25–27% is a 2× difference in real-user performance. If the project is information architecture, marketing, docs, or e-commerce catalogue, Astro (SSG + Server Islands) or SvelteKit (SSG) is the empirically correct choice.

2. **For enterprise / AI product teams already in the React ecosystem: accept Next.js with performance guardrails.** The hiring liquidity and AI SDK advantages are real. However, treat the performance tax as debt. Implement `next/image`, route-level JS budget limits, and monitor CrUX — not just Lighthouse — from day one.

3. **For startups wanting both DX and performance: evaluate SvelteKit first.** It has the best developer satisfaction scores [S11], lowest boilerplate [S1], and strong CWV pass rates [S2] — without the steep mental model of Qwik or the ecosystem lock-in of Next.js/Vercel.

4. **For performance-critical interactive applications (dashboards, analytics, editors): benchmark SolidStart and QwikCity against your actual workload.** The lab data shows SolidJS has unmatched DOM speed [S1] and Qwik eliminates hydration [S9], but production-scale CWV validation is missing. Run a proof of concept before committing.

5. **Monitor CWV 2.0 / Visual Stability Index**: Google is shifting to session-based evaluation. Frameworks that depend on client-side navigation (SPAs) will face new scrutiny. Astro's Server Islands and SvelteKit's progressive enhancement strategy are well-positioned; Next.js App Router soft navigation behaviour under VSI is unknown.

6. **Re-run this analysis in 6–9 months.** The framework landscape is moving fast: Svelte 5 Runes, Vue Vapor Mode, React Compiler, and the Nuxt/Vercel post-acquisition direction all have incomplete data. QwikCity and SolidStart CrUX cohorts will grow as adoption increases.

7. **Read Alex Russell's "If Not React, Then What?" in full** [S8]. The piece is the most rigorous practitioner argument for the "rule of least client-side complexity" and provides a decision framework that maps project type to appropriate JS budget, which is directly actionable for engineering managers.

---

*Report generated: 2026-03-31*  
*Research session depth: primary + approved secondary sources (~58 sources indexed in NotebookLM)*  
*NotebookLM notebook: `30d710b2-7e3f-42b9-95d5-2720ebbcce62`*  
*NLM session note: `Research Session 2026-03-31 - framework-performance gap retrospective` (ID: `94455526`)*
