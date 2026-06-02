---
title: Custom 1" Manifold
---

## Goal

Build a custom brass 1-inlet / 3-outlet manifold using standard threaded fittings. No soldering or welding. Outdoor use. GEKA couplings on all outlets. True 1" (DN25) bore throughout — no restrictions.

## Construction Plan

The rail is built from four AG/AG/AG brass tees chained inline vertically, with all tee inline ports (top and bottom) facing down. The three outer tees each have a branch port (the perpendicular side port) connecting to a ball valve and GEKA adapter for one outlet. The centre tee (Tee 3) has its branch port connected to a 20 cm intake extension. The three IG/IG flat-sealing unions between adjacent AG tees allow free rotation before tightening so all branch ports can be aligned to the same plane. Both ends of the chain are closed with female-threaded blanking caps.

```
   [Blanking plug]
        |
    [Tee 1]   → Ball valve → GEKA adapter → outlet 1
        |
    [Union 1] ← alignment-friendly, flat-sealing
        |
    [Tee 2]   → Ball valve → GEKA adapter → outlet 2
        |
    [Union 2] ← alignment-friendly, flat-sealing
        |
    [Tee 3]   → 20 cm double nipple → intake
        |
    [Union 3] ← alignment-friendly, flat-sealing
        |
    [Tee 4]   → Ball valve → GEKA adapter → outlet 3
        |
   [Blanking plug]
```

All tee inline ports (top and bottom of each tee in the chain) face downward. The three unions between tees are the only joints that require angular alignment freedom. All other joints (intake extension, ball valves, GEKA adapters, blanking caps) are fixed threaded joints sealed with hemp/paste or sealing cord.

### Key Design Rules

- Use **BSP / G-thread (parallel)** fittings throughout — not tapered R/NPT.
- Use **flat-sealing unions** (flachdichtend, Überwurfmutter) for the tee-to-tee joints — these allow free rotation of each tee before tightening, so all branch ports can be aligned to the same plane.
- Use **sealing cord or hemp + paste** for adjustable threaded joints; PTFE tape alone is less forgiving for alignment.
- Mount the finished rail rigidly with pipe clamps so hose torque is not carried by the threaded joints.
- Do **not** use conical-sealing (konisch) unions — they lock rotation at final thread depth.

## Parts List

| # | Qty | Part | Thread | Notes |
|---|-----|------|--------|-------|
| 1 | 4 | Brass T-piece AG/AG/AG 1" | G1" BSP | Rail body. All three tee ports are male-threaded |
| 2 | 3 | 3-piece flat-sealing union 1" IG/IG | G1" BSP | Tee-to-tee alignment joints. Connects directly between male-threaded tees |
| 3 | 3 | Ball valve 1" IG/IG | G1" BSP | One per outlet branch, between male tee branch and GEKA adapter |
| 4 | 3 | GEKA adapter AG 1" | G1" AG | Screws into ball valve outlet, one per outlet |
| 5 | 1 | Intake extension 1" ~20 cm | G1" BSP | Prefer IG/AG extension for direct connection to Tee 3; alternatively use AG/AG double nipple plus one IG/IG sleeve |
| 6 | 2 | Blanking cap IG 1" | G1" IG | Closes both male-threaded ends of the tee chain |
| 7 | — | Sealing cord or hemp + paste | — | For all fixed threaded joints |
| 8 | 2–4 | Pipe clamps 1" (DN25) | — | Wall-mount the finished rail |

### Notes on Part 2 (unions)

With AG/AG/AG tees, IG×IG flat-sealing unions are the preferred tee-to-tee connector. They connect directly to the male-threaded tee ends and do not need extra nipples. Avoid plain IG/IG sleeves without a union nut because they do not provide alignment freedom.

### If union bore is uncertain

The union must not restrict flow below ~DN20 (20 mm internal diameter = 314 mm²). A true G1" union should pass DN25 (25 mm, 491 mm²). Always verify the stated internal bore before ordering — "1 inch" on the label does not guarantee a full-bore passage.

## Candidate Parts (verified or shortlisted)

| Part | Product | Price | Status |
|------|---------|-------|--------|
| T-piece 1" AG/AG/AG | User-selected all-male brass tee | TBD | Selected geometry; verify all three ports are AG/G1" |
| Union 1" IG×IG flat-seal | MegaHaustechnik [B0G6L7PQ4G](https://www.amazon.de/dp/B0G6L7PQ4G) | €6.67 | Verified: flat-sealing, brass, DN25, 30 mm stated bore |
| Union 1" AG×AG conical | Beatific [B0FHPNR432](https://www.amazon.de/dp/B0FHPNR432) | €11/pc | Rejected — conical sealing, no union nut |

## Estimated Total Cost

| Item | Qty | Unit | Subtotal |
|------|-----|------|----------|
| T-pieces AG/AG/AG | 4 | TBD | TBD |
| IG/IG flat-sealing unions | 3 | €6.67 | €20 |
| Ball valves 1" | 3 | ~€6 | ~€18 |
| GEKA adapters 1" AG | 3 | ~€4 | ~€12 |
| Intake extension 20 cm | 1 | ~€5 | ~€5 |
| Blanking caps IG | 2 | ~€2 | ~€4 |
| Pipe clamps | 3 | ~€2 | ~€6 |
| Sealant / cord | — | — | ~€3 |
| **Total** | | | **~€98** |

Actual cost depends primarily on union and ball valve sourcing.
