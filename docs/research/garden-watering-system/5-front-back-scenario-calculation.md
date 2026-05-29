---
title: 'Front/Back Multi-Zone Hose Scenario Calculation'
---

# Front/Back Multi-Zone Hose Scenario Calculation

Date: 2026-05-29
Pump: TIP GP 5000 INOX (modeled with Qmax ~5,000 L/h, Hmax ~45 m)

## Layout Used for the Calculation

- Back garden: 2 sprinklers, each via 20 m hose from the pump manifold.
- Front garden: 30 m feeder from pump to front split point.
- Front split point:
  - Sprinkler A: short 1 m branch.
  - Sprinkler B: long 20 m branch (for full front-garden reach).

Operating mode used for comparison:
- 4 sprinklers open (2 back + front A + front B)

## Scenarios Compared

1. All hoses 1/2"
2. All hoses 3/4"
3. All hoses 1"
4. Mixed: all main runs 1", but front long branch (Sprinkler B, 20 m) is 3/4"
5. Back 3/4" + front feeder 1" + front long branch 3/4" (front short branch stays 1")

## Unified Comparison Table (Flow + Improvement + Pressure + Price)

Price basis from the same Amazon hose family used in the main report (snapshot 2026-05):
- 1/2": 20.89 EUR per 25 m (approx. 0.84 EUR/m)
- 3/4": 29.69 EUR per 25 m (approx. 1.19 EUR/m)
- 1": 47.99 EUR per 25 m (approx. 1.92 EUR/m)

Assumed hose lengths:
- Full 4-sprinkler layout installed: 91 m total (adds front long 20 m branch)

| Scenario | 4-sprinkler flow (L/min) | Gain vs all 1/2" | Working pressure (bar) | Full layout cost (91 m) | Flow per euro (L/min per EUR) |
|---|---:|---:|---:|---:|---:|
| All 1/2" | 56.7 | baseline | 1.41 | ~76.04 EUR | ~0.75 |
| All 3/4" | 77.2 | +36.0% | 0.33 | ~108.07 EUR | ~0.71 |
| All 1" | 81.5 | +43.7% | 0.10 | ~174.68 EUR | ~0.47 |
| Mixed (1" mains + 3/4" front long branch) | 81.5 | +43.7% | 0.10 | ~160.04 EUR | ~0.51 |
| Back 3/4" + front feeder 1" + front long 3/4" | 79.3 | +39.8% | 0.21 | ~130.76 EUR | ~0.61 |

Notes:
- These are linearized estimates by meter, for comparison only; real basket prices depend on available roll lengths (for example 20 m, 25 m, 30 m, 50 m).
- Fittings/couplers/splitters are not included here; this is hose material cost only.
- Scenario 5 interpretation: this uses 3/4" for both back 20 m runs and for the front long 20 m branch, with 1" only on the 30 m front feeder and the 1 m short front branch.
- Pressure values are modeled working pressure at the manifold/split level during operation (pump head at operating point, converted to bar).
- Flow per euro is calculated as modeled 4-sprinkler total flow divided by full layout hose cost.

## Modeling Assumptions

- Darcy-Weisbach pressure-loss model for water at ~20 C.
- Smooth hose inner wall approximation.
- Pump curve approximated linearly between shut-off head and max free flow.
- Only hose friction is modeled (no extra losses for valves, click couplers, filters, sprinkler internals, elbows, manifold internals).

Numbers are best used as relative comparison between scenarios, not exact field guarantees.

## Results: Per-Sprinkler Flow Split (4 sprinklers open)

| Scenario | Back 1 (20 m) | Back 2 (20 m) | Front A (short) | Front B (long 20 m) | Front total |
|---|---:|---:|---:|---:|---:|
| All 1/2" | 20.4 | 20.4 | 13.6 | 2.4 | 16.0 |
| All 3/4" | 27.7 | 27.7 | 18.5 | 3.2 | 21.7 |
| All 1" | 29.3 | 29.3 | 19.5 | 3.4 | 22.9 |
| Mixed (1" mains + 3/4" front long branch) | 29.3 | 29.3 | 20.8 | 2.1 | 22.9 |
| Back 3/4" + front feeder 1" + front long 3/4" | 21.8 | 21.8 | 33.0 | 2.7 | 35.8 |

## Practical Interpretation for Your Plan

- Upgrading from 1/2" to 3/4" gives the biggest practical jump for price/performance.
- 1" everywhere gives the highest total flow, but only modestly above all-3/4" at this pump size.
- Your mixed setup (1" transport + 3/4" only on long front branch) keeps almost the same total system flow as full 1" while reducing cost.
- Scenario 5 is a strong middle option: cheaper than full 1", with higher total flow than all-3/4".
- In 4-sprinkler operation, a narrower long branch shifts more front flow to the short branch.

## Recommendation From This Calculation

### Confidence and expected deviation

- Confidence in ranking (which option is stronger/weaker): high, around 75-85%.
- Confidence in absolute L/min values: medium, around 60-70%.
- Expected deviation for absolute flow in real operation: typically +/-20% to +/-35%.
- In difficult real setups (extra couplers, restrictive rainers, dirty filter, non-ideal pump curve), deviation can reach about -40% versus modeled L/min.
- Expected deviation for relative comparison between options (percent gains): usually much tighter, about +/-8% to +/-15%.

### Final proposal (selected option)

If I had to choose one setup for your goals (good front transport, acceptable cost, flexible expansion), I would choose:

- Option 5: back 3/4" + front feeder 1" (30 m) + front long branch 3/4".

Why this is my preferred choice:

- It keeps most of the performance gain (+39.8% vs all 1/2") without paying for full 1" everywhere.
- It is significantly cheaper than full 1" (about 130.76 EUR vs 174.68 EUR in this estimate).
- It matches your intended architecture: transport in 1" to the front, then split there.
- It leaves room to tune branch behavior later with valves/nozzles instead of over-investing in hose diameter now.

Practical note for front split behavior:

- To avoid one front sprinkler taking too much share, add simple balancing at the split (small ball valves/flow control or matched sprinkler nozzles). This matters more than another diameter upgrade once the 1" feeder is in place.
