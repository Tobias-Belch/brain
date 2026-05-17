---
title: German Elementary School Math App Educational Plan Alignment
---

# German Elementary School Math App: Educational Plan Alignment

## Executive Summary

A math learning app for German elementary school children can be credibly aligned with the German educational plan. In practice, this means aligning to two layers simultaneously:

1. The national **KMK Bildungsstandards für Mathematik im Primarbereich (2022)** as the cross-state baseline — defining what pupils should achieve by end of grade 4.
2. The **state curriculum (Lehrplan/Bildungsplan/Rahmenlehrplan)** of each target Land, which determines grade-level sequencing, local terminology, and implementation details.

For a Berlin-focused launch, the most practical second layer is the **Berlin-Brandenburg Rahmenlehrplan 1–10**, updated in 2023 to align with the revised KMK standards. It operationalizes the national standards through *Niveaustufen* A–H and makes explicit the curriculum expectations around diagnosis, differentiation, language-sensitive tasks, and multiple mathematical representations.

The strongest product position:

1. Use the KMK 2022 standards as the national reference frame (five *Leitideen*, five process competences).
2. Use each target state's curriculum as the actual sequencing and classroom alignment map.
3. Tag all tasks by *Leitidee*, process competence, difficulty/proficiency level, *Niveaustufe*, and state-relevant grade band.
4. Make diagnostics, strategy explanation, representation work, and differentiated progression first-class features — not add-ons.
5. For a cross-state product: cover the full KMK standard and maintain per-state grade-level mappings, since no single national grade-by-grade sequence document exists.

---

## Table of Contents

1. [Research Question & Scope](#1-research-question--scope)
2. [Methodology](#2-methodology)
3. [Direct Answer](#3-direct-answer)
4. [Key Findings](#4-key-findings)
   - 4.1 [The Regulatory Architecture](#41-the-regulatory-architecture)
   - 4.2 [KMK Bildungsstandards Mathematik Primarbereich 2022](#42-kmk-bildungsstandards-mathematik-primarbereich-2022)
   - 4.3 [Content Domains (Leitideen)](#43-content-domains-leitideen)
   - 4.4 [Process Competences (Mathematische Kompetenzen)](#44-process-competences-mathematische-kompetenzen)
   - 4.5 [Competence Levels and Minimum Standards](#45-competence-levels-and-minimum-standards)
   - 4.6 [Assessment: VERA-3 and IQB-Bildungstrend](#46-assessment-vera-3-and-iqb-bildungstrend)
   - 4.7 [State-Level Curricula: Relationship to KMK Standards](#47-state-level-curricula-relationship-to-kmk-standards)
   - 4.8 [Berlin Focus: Designing to Niveaustufen, Not Just Grades](#48-berlin-focus-designing-to-niveaustufen-not-just-grades)
   - 4.9 [Elementary Content Priorities](#49-elementary-content-priorities)
   - 4.10 [Language-Sensitive, Context-Rich Design](#410-language-sensitive-context-rich-design)
   - 4.11 [Diagnosis and Differentiation](#411-diagnosis-and-differentiation)
   - 4.12 [Digital Education Policy and App-Relevant Infrastructure](#412-digital-education-policy-and-app-relevant-infrastructure)
5. [App Alignment Blueprint](#5-app-alignment-blueprint)
   - 5.1 [Minimum Viable Alignment Model](#51-minimum-viable-alignment-model)
   - 5.2 [Recommended Content Metadata](#52-recommended-content-metadata)
   - 5.3 [Concrete Example: Better vs. Worse Alignment](#53-concrete-example-better-vs-worse-alignment)
   - 5.4 [What the App Should Avoid](#54-what-the-app-should-avoid)
6. [Source Inventory](#6-source-inventory)
7. [Conflicts & Open Questions](#7-conflicts--open-questions)
8. [Blindspot / Gap Analysis](#8-blindspot--gap-analysis)
9. [Recommended Next Steps](#9-recommended-next-steps)

---

## 1. Research Question & Scope

```
Research question: How should a math learning app for German elementary school children
(grades 1–4) align with the German educational plan (Bildungsplan/Lehrplan) and
national standards? What does this mean concretely for a Berlin-focused product?

Scope constraints:
  - Primary focus: national KMK standards for mathematics, Primarbereich (grade 4 endpoint)
  - Secondary: Berlin-Brandenburg state curriculum implementation, assessment
    infrastructure, digital policy
  - Geographic scope: Federal Republic of Germany (all 16 Bundesländer for national
    layer); Berlin-Brandenburg for state-level detail
  - Temporal scope: Current standards (2022 KMK revision; 2023 Berlin-Brandenburg
    math update) and active digital policy

Out of scope:
  - Sekundarstufe I/II content
  - Deep-dive into all 16 state curricula (Berlin-Brandenburg covered in depth;
    structural level for others)
  - Commercial benchmarking or school procurement legal review
```

---

## 2. Methodology

- **Resource types consulted:** Official web pages (KMK, IQB, Bildungsserver Berlin-Brandenburg, government portals); official secondary support materials from LISUM/Bildungsserver Berlin-Brandenburg
- **Search strategy:** Direct navigation to authoritative sources — KMK Bildungsstandards page, IQB Primarstufe pages, KMK digital education strategy page, Berlin-Brandenburg curriculum portal (mathematics subject pages for *Kompetenzentwicklung*, *Kompetenzen und Standards*, *Themen und Inhalte*)
- **Depth:** Primary sources plus limited official secondary support materials
- **Emphasis:** Regulatory and curricular alignment rather than generic pedagogy

---

## 3. Direct Answer

A German elementary-school math app should be aligned in the following way:

1. **Nationally:** map content and outcomes to the **KMK Bildungsstandards Mathematik Primarbereich (2022)**, which define what pupils should achieve by end of grade 4.
2. **Per state:** map the same content to the target state's curriculum, because each Land decides when and how topics are introduced across grades 1–4.
3. **Instructionally:** cover both **content domains** and **process competences**. A drill-only arithmetic app is not fully aligned.
4. **Operationally:** provide teacher-facing diagnostic and reporting views in curriculum language, ideally by domain, competence, and proficiency band.

If the app is intended for use across Germany, the minimum credible claim is: "aligned to KMK 2022 primary math standards, with state-specific sequencing layers where provided." If intended for Berlin schools specifically, the strongest claim is: "aligned to the KMK standards as implemented through the Berlin-Brandenburg mathematics curriculum for the relevant *Niveaustufen*."

---

## 4. Key Findings

### 4.1 The Regulatory Architecture

Germany's education system operates under the sovereignty (*Kulturhoheit*) of the 16 individual states. However, since 2004 the **Kultusministerkonferenz (KMK)** has issued nationally binding *Bildungsstandards* that all states must implement [S1]. These standards define **what** students should be able to do at key transition points (end of grade 4 for Primarbereich), but leave **how** and **when** to each state's own curriculum (*Lehrplan* or *Bildungsplan*).

The **Institut zur Qualitätsentwicklung im Bildungswesen (IQB)** at Humboldt-Universität Berlin is the scientific body that develops competence-level models, assessment tasks, and monitors achievement nationally via VERA tests and IQB-Bildungstrend studies [S2].

For app design purposes:

- `KMK alignment only` is too abstract for classroom use.
- `State alignment only` is too narrow for a nationwide claim.
- The strongest approach is **KMK baseline + state implementation map**. [S1][S3]

### 4.2 KMK Bildungsstandards Mathematik Primarbereich 2022

The current standards were revised and adopted on **23 June 2022** (replacing the 2004 version) [S1, S4]. The revision introduced more explicit competence descriptions, updated the five *Leitideen* with minor terminological changes, and strengthened the articulation between content and process dimensions. The Berlin-Brandenburg curriculum confirms its 2023 mathematics update was made specifically to align with the revised KMK standard [S3].

Key structural features:
- **Endpoint:** End of grade 4 (Jahrgangsstufe 4)
- **Standard type:** *Regelstandards* — expected by most pupils "on average"; supplemented by *Mindeststandards* (minimum thresholds all pupils must reach) and *Optimalstandards* (advanced targets) [S2]
- **Two-dimensional model:** Content (*Was*) × Process (*Wie*)

**Product implication:** The `Regelstandard` is the default alignment target. `Mindeststandard` coverage is especially important for diagnosis and targeted support.

### 4.3 Content Domains (Leitideen)

The 2022 standards organize mathematics content around five *Leitideen*. VERA-3 (grade 3 diagnostic tests) covers all five domains. The Berlin-Brandenburg curriculum uses the same five strands [S4][S5][S6][S7]:

| Leitidee | Core topics in Primarbereich | Product implication |
|---|---|---|
| **Zahl und Operation** | Natural numbers to 1 000 000; four operations; mental arithmetic; written algorithms; estimation; place value; number line; additive decomposition; fact strategies | Core arithmetic path, strategy work, mental and written calculation |
| **Raum und Form** | 2D and 3D shapes; symmetry; perspective; orientation in space; spatial reasoning | Shape reasoning, transformations, visual tasks |
| **Muster, Strukturen und funktionaler Zusammenhang** | Number patterns; arithmetic laws; proportional reasoning; early functional thinking; pictographs | Pattern rules, relations, generalization, simple function-like reasoning |
| **Größen und Messen** | Length, weight, volume, time, money; unit conversion; estimation | Measuring, comparison, estimation, unit reasoning |
| **Daten und Zufall** | Reading/interpreting tables and charts; simple data collection and display; simple probability concepts | Data reading, class surveys, simple uncertainty tasks |

*Note: The 2022 KMK revision renamed "Muster und Strukturen" to "Muster, Strukturen und funktionaler Zusammenhang", explicitly adding early functional thinking. Berlin's curriculum labels this strand "Gleichungen und Funktionen" but covers equivalent content [S1][S4].*

An elementary app should not collapse into *Zahlen und Operationen* alone. All five *Leitideen* must remain active across the elementary phase [S5][S7].

### 4.4 Process Competences (Mathematische Kompetenzen)

Alongside content, both the KMK and Berlin curricula define **process competences** that students must develop across all content domains. These describe *how* pupils engage with mathematics.

KMK defines five; Berlin's curriculum adds media-specific competences:

1. **Mathematisch argumentieren** — Formulating and evaluating mathematical arguments; explaining and justifying results
2. **Probleme mathematisch lösen** — Applying mathematics to solve problems; choosing and using strategies; comparing solution paths
3. **Mathematisch modellieren** — Translating real-world situations into mathematical representations; interpreting results
4. **Mathematische Darstellungen verwenden** — Working with symbolic, graphical, physical, and virtual representations; choosing between representations
5. **Mit symbolischen, formalen und technischen Elementen der Mathematik umgehen** — Fluency with mathematical notation, procedures, and tools
6. **Mathematisch kommunizieren** (Berlin) — Communicating reasoning in speech, text, or structured response
7. **Mit Medien mathematisch arbeiten** (Berlin) — Using digital tools for exploration, representation, and data work, under the primacy of pedagogy [S5][S6]

**Product implication:** Tasks should not be limited to procedural drill. Items and activities must also ask learners to explain or justify a result, choose a representation, interpret a real-world situation mathematically, and communicate reasoning. Allow pupils to move between concrete, visual, verbal, and symbolic forms.

### 4.5 Competence Levels and Minimum Standards

The IQB has developed **Kompetenzstufenmodelle** for each content domain [S2]. These empirically validated models describe typically five levels of achievement, from below minimum standard to optimal standard:

- **Mindeststandard:** The floor below which a pupil is considered at risk and must receive targeted support — the diagnostic priority for apps aimed at inclusion and differentiated learning.
- **Regelstandard:** The expected average; the primary alignment target for a mainstream app.
- **Optimalstandard:** For enrichment/extension content.

Berlin's curriculum uses *Niveaustufen* A–H across years 1–10, which provide a finer-grained progression model compatible with the IQB competence levels. For elementary use:
- School entry phase: **A–B**, with parts of C
- Grades 3–4: **C**, with parts of D
- Orientation rule: roughly B by end of year 2, C by end of year 4, D by end of year 6 [S6]

The IQB makes competence level descriptions publicly available through its task browser (*Aufgabenbrowser*), which is a valuable reference for calibrating task difficulty [S2].

### 4.6 Assessment: VERA-3 and IQB-Bildungstrend

**VERA-3** (Vergleichsarbeiten Jahrgangsstufe 3) are mandatory annual written tests administered by all 16 states in grade 3 [S8]. In mathematics, VERA-3 tests cover all five *Leitideen*. Results are returned to teachers to identify where pupils have not yet reached the grade-3 trajectory toward the grade-4 *Bildungsstandards*.

Key implications for app developers:
- VERA-3 serves as a *formative early-warning system* for teachers. An app that reports results mapped to the same *Leitideen* as VERA-3 produces teacher-usable diagnostic data.
- States increasingly offer VERA-3 as an online test; the IQB's **TBA** infrastructure provides open-source online testing components.
- The **IQB-Bildungstrend** provides population-level data on competence achievement across states and over time — useful as a benchmark for expected difficulty levels.
- Grade 3 is a key diagnostic stage on the path to grade-4 standard attainment.

**Product implication:** Reporting learner performance by *Leitidee* and supporting early identification of below-standard learners is one of the clearest ways for an app to become teacher-usable rather than merely child-usable.

### 4.7 State-Level Curricula: Relationship to KMK Standards

All 16 Bundesländer are required to implement the KMK Bildungsstandards in their own state curricula [S1][S2]. In practice:
- Each state issues its own *Lehrplan* or *Bildungsplan* specifying grade-by-grade content progression, topics, and pedagogical notes.
- States may differ in sequencing (e.g., when written multiplication is introduced) and in which state-specific topics receive emphasis.
- The curriculum explicitly leaves exact yearly implementation details to the *schulinternes Curriculum*, so no external app can claim a single exact year-by-year sequence for all schools in any given state [S6][S7].
- The **SODIX/MUNDO** platform aggregates licensed educational media across states with curriculum-linked metadata, using AI to map materials to individual state educational plans [S9].

**Practical guidance for a cross-state app:**
1. Implement full KMK 2022 coverage — the non-negotiable baseline.
2. For go-to-market in a specific state, map content to that state's *Lehrplan* and document the mapping for school administrators.
3. For content discoverability across states, apply for SODIX/MUNDO integration (requires FWU quality review).

### 4.8 Berlin Focus: Designing to Niveaustufen, Not Just Grades

Berlin's curriculum does not frame progression only as grade-by-grade topics. The *Niveaustufen* model has two major consequences for an elementary app:

1. The core learning path should center on **A–B–C**, with C being the primary end-of-grade-4 target.
2. Advanced extension should preview **D**, but D should not dominate the elementary core.

This is especially important because a grade-locked experience fits the official model poorly. The curriculum explicitly assumes differentiated offers and acknowledges that learners may reach levels at different times [S6][S7]. A *Niveaustufen*-aware app can serve both struggling and advanced learners within the same grade cohort without artificial grade walls.

### 4.9 Elementary Content Priorities

The strongest visible content anchor for early elementary is **Zahlen und Operationen**, including:
- Structured quantity recognition
- Counting and comparing quantities
- Number representations and place value (bundling/unbundling)
- Number line use
- Additive decomposition and parity
- Core addition and multiplication fact strategies
- Moving between story, action, picture, and notation

At the next elementary step, the curriculum expands toward:
- Numbers up to larger place-value systems; rounding; divisibility
- Written methods; flexible strategy use
- Word-problem solving tied to all four operations

All five *Leitideen* must remain active. At minimum, the elementary product should also include:
- Measuring and units (*Größen und Messen*)
- Spatial reasoning and shape work (*Raum und Form*)
- Simple pattern/functional thinking (*Muster, Strukturen und funktionaler Zusammenhang*)
- Simple data collection, display, and interpretation (*Daten und Zufall*) [S5][S7]

### 4.10 Language-Sensitive, Context-Rich Design

The Berlin-Brandenburg *Kompetenzentwicklung* page explicitly stresses real-world contexts, support for *Sprachbildung*, reading strategies for context-heavy tasks, mathematically meaningful discussion, and movement from everyday language toward mathematical language [S5].

**Product implications:**
- Clean German task language with age-appropriate phrasing
- Optional audio / read-aloud support
- Highlighted vocabulary and visual scaffolds
- Tasks that ask learners to explain, compare, and describe
- Contexts familiar to children in Germany rather than generic globalized prompts
- Language and media curricula visible in teacher-facing materials [S5][S7]
- Avoid loading difficulty onto text complexity when the math target is elsewhere

This is not optional: official documents list language-sensitive design as a core curriculum requirement, not a UX enhancement.

### 4.11 Diagnosis and Differentiation

Official Berlin-Brandenburg materials repeatedly emphasize diagnosis, differentiated tasks, and targeted support. The LISUM support portal on mathematical basic competencies provides diagnostic and remediation materials organized by *Leitideen*, framed as tools to identify strengths, weaknesses, and misconceptions [S5][S7][S8].

**Product implications:**
- Diagnostic start or recurring micro-diagnostics
- Tagging of errors by misconception category where possible
- Teacher dashboards or reports by *Leitidee* and competency (mirrors VERA-3 reporting structure)
- Differentiated task routing rather than one fixed sequence
- Remediation loops focused on core representations and strategies
- Mindeststandard-aligned tasks for at-risk support (differentiator for schools with high proportions of struggling learners)

### 4.12 Digital Education Policy and App-Relevant Infrastructure

The **KMK Strategie "Bildung in der digitalen Welt" (2016, updated 2021)** establishes a cross-state competence framework for digital learning. Key policy facts:
- The **Digitalpakt Schule (2019–2024)** invested €6.5 billion across ~30,000 German schools; near-universal WLAN coverage achieved.
- **Digitalpakt 2.0 (to 2030)** extends with €5 billion, emphasizing teacher professional development and research into effective digital instruction [S9].
- Digital tools are expected to integrate into subject instruction and must support understanding and exploration under the primacy of pedagogy — not gamification or speed as primary learning signals [S5][S9].

Relevant cross-state projects for math app developers:

| Project | Relevance |
|---|---|
| **SMART** (Specific Mathematics Assessments that Reveal Thinking) | Online diagnostic tool for conceptual understanding; 5–15 min tests revealing student thinking patterns — direct model for app diagnostic design |
| **TBA I/II/III** | Open-source online test infrastructure (IQB); TBA II introduces adaptive and formative testing in grades 2–3 — apps can integrate via open interfaces |
| **AIS / telli** | AI-powered adaptive learning environment with individual learning paths; Chatbot "telli" available from spring 2025; FWU-led; all states participating — flagship national project for AI-driven personalized learning |
| **SODIX / MUNDO** | Cross-state media platform with curriculum-linked metadata; AI maps content to state educational plans; quality review required for inclusion |
| **DigLu** | Online LMS for travelling children; includes offline app with sync — model for cross-state content portability |

**Product implication:** Standards-linked diagnostics are strategically well aligned with system direction. Metadata matters, especially if content distribution through state-facing channels is a goal. Pedagogy, privacy, and accessibility still matter more than novelty.

---

## 5. App Alignment Blueprint

### 5.1 Minimum Viable Alignment Model

| Product layer | What to implement | Why it matters / Standard |
|---|---|---|
| **Content coverage** | All five *Leitideen* addressed by end of grade 4 | KMK 2022 [S1] |
| **Competence breadth** | Tasks span all process competences, not just procedural calculation | KMK 2022 / Berlin [S1][S5] |
| **Difficulty calibration** | Task levels mapped to IQB Kompetenzstufenmodelle and Berlin *Niveaustufen*; Mindeststandard tasks included | IQB [S2] / Berlin [S6] |
| **Elementary core path** | Focus on A–B–C *Niveaustufen*; D bridge content for advanced grade 3–4 learners | Berlin [S6][S7] |
| **Diagnostic output** | Results reportable by *Leitidee* (maps to VERA-3 reporting structure) | IQB/VERA [S8] |
| **Grade sequencing** | Minimum: KMK endpoint by grade 4; Ideal: per-state grade-level curriculum mapping | State Lehrpläne |
| **Language support** | Read-aloud, vocabulary support, short contextual texts, explanation prompts | Berlin [S5][S7] |
| **Task design** | Include explanation, modeling, and representation tasks, not only answer entry | KMK 2022 / Berlin [S1][S5] |
| **Digital tools** | Interactive representations, virtual manipulatives, dynamic number lines — under pedagogical primacy | Berlin [S5] |
| **Formative assessment** | Adaptive task routing based on learner performance (aligned with TBA II model) | TBA II [S9] |
| **Teacher evidence** | Exportable curriculum maps and reports by competency/content strand | [S1][S3][S6] |
| **Metadata standard** | Tag content with *Leitidee*, competence level, *Niveaustufe*, and grade for SODIX/MUNDO compatibility | SODIX [S9] |
| **Data privacy** | DSGVO (GDPR) compliance mandatory for German schools; no tracking without explicit consent | German/EU law |
| **Accessibility** | WCAG 2.1 AA increasingly expected | Digitalpakt LÜV [S9] |

### 5.2 Recommended Content Metadata

Every activity should ideally be tagged with:

- `Leitidee`
- process competence(s)
- difficulty/proficiency band (Mindeststandard / Regelstandard / Optimalstandard)
- grade band or state curriculum level
- misconception or support focus where relevant
- representation type used in the task

For Berlin specifically, add:

- `Niveaustufe` (A–H)
- whether the activity targets core elementary progression (`A–B–C`) or stretch (`D` bridge)

### 5.3 Concrete Example: Better vs. Worse Alignment

**Feature: Addition and subtraction to 100**

**Weak alignment:**
- 40 timed calculation items; right/wrong feedback only; no representations; no explanation prompt; no teacher-facing curriculum metadata

**Strong alignment:**
- Quantity image, base-ten blocks, number line, and symbolic notation for the same task
- Prompt to choose a strategy: jump by tens, split, near-double, or compensation
- Short oral or written explanation: "How did you know?"
- Contextual word problem and pure number problem paired together
- Teacher report tagging the activity to *Zahlen und Operationen*, representation use, problem solving, and communication [S5][S6][S7]

### 5.4 What the App Should Avoid

- Claiming full "German curriculum alignment" without a state-specific mapping layer
- Reducing elementary math to arithmetic speed and fact recall
- Omitting teacher-visible curriculum metadata
- Treating all learners in one grade as identical in level (ignores *Niveaustufen* differentiation)
- Using word problems without language support or explanation scaffolds
- Ignoring measurement, geometry, data, and early functional thinking
- Treating gamification or speed as the primary signal of learning quality [S1][S5][S6][S7]

---

## 6. Source Inventory

| ID | Source | Type | Date | Quality | Notes |
|----|--------|------|------|---------|-------|
| S1 | KMK Bildungsstandards page — kmk.org | Web | 2022 (standards); page accessed 2026 | High — official government body, authoritative for all national standards | Listed all Primarbereich math standard documents and implementation brochures |
| S2 | IQB Definition of Bildungsstandards — iqb.hu-berlin.de | Web | Current | High — academic institution mandated by all 16 Länder; corroborates S1 | Defines Regelstandard, Mindeststandard, Optimalstandard; describes IQB role in test development and Bildungstrend |
| S3 | Bildungsserver Berlin-Brandenburg, *Jahrgangsstufen 1–10* | Web | 2024/2025 snapshot | High — official regional curriculum portal; primary source | Confirms current Berlin-Brandenburg curriculum structure and 2023 math update to reflect revised KMK standards |
| S4 | KMK Implementationsbroschüre Mathematik 2022 (PDF) — kmk.org | Official document | 2023 | High — KMK official; supplements S1 | PDF content informed by IQB/KMK web summaries and known structure of 2022 revision |
| S5 | Bildungsserver Berlin-Brandenburg, *Kompetenzentwicklung* | Web | Current portal version | High — official curriculum text; primary source | Defines math goals, process/content dimensions, language support, contexts, diagnostics, and digital tools |
| S6 | Bildungsserver Berlin-Brandenburg, *Kompetenzen und Standards* | Web | Current portal version | High — official curriculum text; primary source | Provides *Niveaustufen*, school-phase expectations, and detailed process-standard examples |
| S7 | Bildungsserver Berlin-Brandenburg, *Themen und Inhalte* | Web | Current portal version | High — official curriculum text; primary source | Provides cumulative content structure and concrete mathematics content progression |
| S8 | IQB VERA-3 page — iqb.hu-berlin.de | Web | Current (2026 test windows listed) | High — IQB official | Specifies five math *Leitideen* tested; mandatory annual testing; VERA-3 as early warning system |
| S9 | KMK "Bildung in der digitalen Welt" — kmk.org | Web | 2016 strategy; page updated 2025/2026 | High — official KMK policy page | Describes digital competence strategy, Digitalpakt 1.0 and 2.0, SMART, TBA, AIS/telli, SODIX/MUNDO |
| S10 | Bildungsserver Berlin-Brandenburg, *Entwicklung mathematischer Basiskompetenzen* | Web | 2021-plus resource portal snapshot | High — official state support portal; secondary but authoritative | Shows how Berlin-Brandenburg operationalizes diagnosis and support for core mathematical competencies |

---

## 7. Conflicts & Open Questions

- **State vs. national standards granularity:** The KMK Bildungsstandards define a grade-4 endpoint but not grade-by-grade progression. State curricula vary in when specific topics are taught (e.g., written long division: some states introduce in grade 3, others grade 4). A cross-state app must either be agnostic about grade sequencing within the primary cycle, or maintain per-state mappings. No single authoritative cross-state sequencing document exists. Berlin additionally delegates exact yearly sequencing to the *schulinternes Curriculum*, so no app can claim a universal Berlin year-by-year sequence [S6][S7].

- **2022 standard vs. ongoing implementation:** The 2022 revised KMK standards are currently being implemented by states; normative testing against the new standards has not yet been fully published. Some states may still reference the 2004 version in operational materials during transition. The degree to which transition lag affects specific schools is not publicly quantified.

- **Functional thinking in early grades:** The explicit addition of "funktionaler Zusammenhang" to the *Muster und Strukturen Leitidee* in 2022 is a notable curricular shift. How primary teachers operationalize this is not yet well-documented in publicly accessible practitioner guidance.

- **AI/adaptive learning evidence base in German primary math:** The SMART and AIS projects demonstrate state-level appetite for adaptive math diagnostics, but outcome data for German primary students using adaptive platforms is sparse. TBA II explicitly notes that formative assessment is not yet systematically practiced in Germany, despite research evidence for its effectiveness.

- **Assessment specification boundary:** Official curriculum pages define the structure of alignment but do not by themselves define an app-ready assessment specification, scoring model, or reporting format.

- **Teacher adoption reality:** Formal alignment is necessary, but adoption may still depend heavily on teacher workflow, classroom fit, and local expectations beyond what curriculum documents capture.

---

## 8. Blindspot / Gap Analysis

- [x] **Official standards and curriculum structure** are well covered at the national and Berlin-Brandenburg level.
- [x] **Berlin is covered** as a concrete implementation example with *Niveaustufen* detail.
- [x] **Assessment and digital infrastructure** are covered at the strategic level (VERA-3, IQB, Digitalpakt, SMART, TBA, AIS/telli, SODIX/MUNDO, DigLu).
- [x] **Competing view acknowledged** — The KMK's competence-based approach has critics who argue it has not resolved Germany's significant achievement gaps (visible in IQB-Bildungstrend and IGLU/TIMSS data). A credible counter-position argues that schools care more about local textbook fit and teacher workflow than formal standards mapping.
- [ ] **Full per-state comparison** is not included. Significant variation exists between states in achievement levels and curriculum pacing. City-states (Berlin, Hamburg, Bremen) show different demographic profiles from large *Flächenländer* (Bayern, NRW). Bavaria in particular has a relatively demanding primary curriculum pace.
- [ ] **Direct stakeholder evidence** from teachers, school leaders, parents, and pupils is not included. Curriculum authors and system-level guidance are represented; buyer and classroom workflow realities remain underexplored.
- [ ] **Empirical achievement data:** Neither variant synthesizes the most recent IQB-Bildungstrend report data on which specific competences are most frequently unmet by German primary pupils — relevant for difficulty calibration and product priority decisions.
- [ ] **DSGVO detail:** Data privacy is flagged as a requirement but no substantive analysis of what specific DSGVO requirements apply to school-facing apps in Germany, or which state-level restrictions are most constraining.
- [ ] **Competitor and adoption failure examples:** No coverage of EdTech products that failed adoption in German schools due to curriculum misalignment or privacy compliance failures (e.g., Google Classroom usage was banned in some states), which would strengthen product risk analysis.
- [ ] **Learning science synthesis:** The relevant adaptive learning and ITS literature (e.g., Bloom's 2-sigma problem, spaced retrieval in arithmetic) is not synthesized, which would support evidence-based feature choices.
- [ ] **Metadata field specification:** Content metadata requirements are described at the conceptual level; no formal data model or example JSON/CSV that an engineering team could implement directly is provided.

---

## 9. Recommended Next Steps

1. **Download and read the KMK Bildungsstandards Mathematik Primarbereich 2022 PDF** directly from `kmk.org`. This is the authoritative source document; all app content should be mapped against its competence descriptions verbatim. The implementation brochure (*ImplBroschuere_BiSta_MATHEMATIK_2023-03-23.pdf*) provides worked examples and is strongly recommended.

2. **Build a curriculum crosswalk spreadsheet** that maps every planned feature and activity to KMK *Leitidee*, process competency, IQB competence level, Berlin *Niveaustufe*, and grade band. This is the foundational teacher-facing evidence artifact.

3. **Obtain the IQB Kompetenzstufenmodelle for Primarbereich mathematics** from `iqb.hu-berlin.de/bista/ksm`. Use these to calibrate task difficulty bands, ensuring Mindeststandard coverage for at-risk learners and Optimalstandard material for advanced learners.

4. **Define the elementary MVP around A–B–C *Niveaustufen*** (Berlin model), with D used only for stretch and transition content. Add product requirements for multi-representation tasks, explanation prompts, and diagnostic routing before designing the content library.

5. **Consult 2–3 state Lehrpläne** (recommended: Bayern, Nordrhein-Westfalen, and Hamburg for geographic/demographic diversity) to understand grade-level content sequencing. All state Lehrpläne are publicly available via `kmk.org`.

6. **Study the SMART project** (`smart.dzlm.de`) as a design reference for diagnostics: its 5–15 minute "revealing thinking" approach is the model for assessment within a math app. Contact DZLM Duisburg-Essen for research findings from the German adaptation.

7. **Engage with the SODIX/MUNDO process** (`mundo.schule`) if school-channel distribution is a goal. FWU quality review is required but provides access to all state media portals with curriculum-linked metadata.

8. **Commission a DSGVO legal review** before any school-facing deployment. Review against the stricter school-specific requirements in each target state.

9. **Monitor TBA II outcomes** (IQB, FSU Jena) — this project is testing adaptive and formative online assessment in grades 2–3 in the primary math domain. Its published findings will provide German-specific evidence for adaptive task routing design.

10. **Run a follow-up research pass** on direct school implementation materials in Berlin, especially teacher *Handreichungen* and any available assessment exemplars tied to primary mathematics.

---

*Report generated: 2026-05-17*
*Research synthesis: two-source merge from round-2 documents and cross-evaluator comparison reports*
