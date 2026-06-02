---
title: 'Hoses'
---

# Hoses

Date: 2026-05-29  
Source: [Front/Back Multi-Zone Hose Scenario Calculation](../../research/garden-watering-system/4-front-back-scenario-calculation.md)

## Marked Decision

- [x] **Chosen setup: Option 5**
- [ ] Option 1: all 1/2"
- [ ] Option 2: all 3/4"
- [ ] Option 3: all 1"
- [ ] Option 4: mixed (1" mains + 3/4" front long branch)

## Final Proposal (Option 5)

- Back garden: two 20 m runs in **3/4"** (one to each back sprinkler)
- Front feeder: **30 m in 1"** from pump manifold to front split point
- Front split branches:
  - short branch (1 m): **1"**
  - long branch (20 m): **3/4"**

## Why Option 5 Was Selected

- Strong performance increase vs baseline: **79.3 L/min**, about **+39.8%** vs all 1/2"
- Better cost/performance balance than full 1"
- Estimated hose cost: **~130.76 EUR** vs **~174.68 EUR** for full 1"
- Matches the intended architecture: large transport line to front, split locally
- Keeps room for later tuning (valves/nozzles) without overbuying hose diameter now

## Compact Scenario Snapshot (4 Sprinklers Open)

| Scenario | Total flow (L/min) | Gain vs 1/2" | Working pressure (bar) | Est. hose cost (91 m) |
|---|---:|---:|---:|---:|
| Option 1: all 1/2" | 56.7 | baseline | 1.41 | ~76.04 EUR |
| Option 2: all 3/4" | 77.2 | +36.0% | 0.33 | ~108.07 EUR |
| Option 3: all 1" | 81.5 | +43.7% | 0.10 | ~174.68 EUR |
| Option 4: 1" mains + 3/4" front long | 81.5 | +43.7% | 0.10 | ~160.04 EUR |
| **Option 5 (chosen)** | **79.3** | **+39.8%** | **0.21** | **~130.76 EUR** |

## Implementation Notes

- Install simple flow balancing at the front split (for example, small adjustable valves or matched sprinkler nozzles) so both front sprinklers receive a more even share of water.
- Hose-only estimate: fittings/couplers/splitters are not included
- Modeled values are comparative; real-world absolute flow can deviate
  - absolute flow deviation often around +/-20% to +/-35%
  - option-to-option ranking confidence remains high
