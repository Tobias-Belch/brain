---
title: 'Final Report: 1" GEKA Piping Systems'
---

# Final Report: Piping Systems Compatible with 1" GEKA Connectors

**Research date**: 2026-05-29
**Installation context**: TIP GP INOX 5000 pump (G1" IG output), pipe through 27cm wall, 4 faucets with GEKA quick-coupling outlets, Berlin 12619.
**Scope**: Amazon.de pricing (Berlin delivery confirmed), assembly difficulty, durability, parts list.

---

## Background: The GEKA Standard

GEKA (also written Geka) is a DIN-compatible industrial/agricultural quick-coupling system, widely used in German garden irrigation since the 1950s. The 1" variant uses a 40mm claw ("Klauenkupplung / Bajonettverschluss") and 25mm bore. Compatible couplings from VARIOSAN, Poppstar, MegaHaustechnik, Agora-Tec, and the original Geka GmbH are interchangeable.

**GEKA coupling adapter prices (1" thread):**
- 1" AG → GEKA: 5,17–7,25 € ([VARIOSAN 12340](https://www.amazon.de/s?k=VARIOSAN+Schnellkupplung+Aussengewinde+12340+1+AG+Messing+Geka): 7,25 €; [MegaHaustechnik drehbar 1" AG](https://www.amazon.de/s?k=MegaHaustechnik+Schnellkupplung+drehbar+1+Zoll+AG+GEKA+Messing): 5,17 €)
- 1" IG → GEKA: 5,65–7,88 € ([Agora-Tec 1" IG](https://www.amazon.de/s?k=Agora-Tec+Schnellkupplung+1+Zoll+Innengewinde+GEKA): 5,65 €; [VARIOSAN 12272](https://www.amazon.de/s?k=VARIOSAN+Schnellkupplung+Innengewinde+12272+1+IG+Messing+Geka): 7,70 €)
- Integrated wall faucet 1" AG + GEKA outlet: 8,57–10,97 € ([MegaHaustechnik Auslaufhahn Messing 1" AG + GEKA](https://www.amazon.de/s?k=MegaHaustechnik+Auslaufhahn+Messing+1+Zoll+AG+GEKA+Kugelhahn): 10,97 €)

**For 4 faucets**: Use [MegaHaustechnik Auslaufhahn Messing 1" AG + GEKA](https://www.amazon.de/s?k=MegaHaustechnik+Auslaufhahn+Messing+1+Zoll+AG+GEKA+Kugelhahn) (integrated GEKA outlet, Kugelhahn): **4 × 10,97 € = 43,88 €**. This is the largest cost item and is identical across all systems.

### Availability Check: 1" GEKA + 1" Hoses

Yes, both are available in Germany:
- 1" GEKA-compatible couplings (threaded and hose-tail variants): [GEKA 1 Zoll Schnellkupplung Suche](https://www.amazon.de/s?k=GEKA+1+Zoll+Schnellkupplung+Messing)
- 1" hose-tail GEKA couplings: [GEKA 1 Zoll Schlauchtuelle Suche](https://www.amazon.de/s?k=GEKA+1+Zoll+Schlauchtuelle)
- 1" garden/pressure/suction hoses: [1 Zoll Gartenschlauch Suche](https://www.amazon.de/s?k=1+Zoll+Gartenschlauch)

Typical Amazon.de price level (2026-05):

| Hose size | Typical 25m price | Relative vs 3/4" |
|---|---:|---:|
| 3/4" (19mm) | ~35-80 € | 1.0x |
| 1" (25mm) | ~70-160 € | ~1.7x-2.2x |

In practice, 1" GEKA connectors are only slightly more expensive than 3/4" connectors; the main price jump comes from the hose itself.

## Hose Diameter Rules (When to Use 1", 3/4", 1/2")

Use this quick rule set for garden lines fed from your pump/distributor setup.

### Practical Selection Rules

- **Use 1" (25mm)** when you want maximum throughput, longer runs, or multiple outlets open at once.
  - Typical case: main trunk from pump to manifold and high-flow branches
  - Good default if 2-4 taps may run in parallel
  - Best for reducing pressure loss over distance

- **Use 3/4" (19mm)** as a balanced standard for most garden usage.
  - Typical case: medium branch lines with 1-2 taps open
  - Good compromise of cost, weight, and flow
  - Usually sufficient for sprinklers and normal hand watering

- **Use 1/2" (13mm)** only for short, low-flow branches.
  - Typical case: short hose to hand lance/drip section/single low-flow endpoint
  - Not recommended as a long main line in a multi-tap system
  - Highest pressure drop per meter of the three sizes

### Rule-of-Thumb Matrix

| Condition | Recommended hose ID |
|---|---|
| Pump to manifold backbone | 1" |
| 2-4 outlets active in parallel | 1" (or at least 3/4" for short runs) |
| Single outlet, medium run (~10-25m) | 3/4" |
| Single outlet, short run (<10-15m), low-flow nozzle | 1/2" |
| If unsure for this project | 1" backbone + 3/4" or 1/2" only at final short branch |

### Concrete Amazon Comparison (One Product Family)

The following STRUBER hose family is available across all three diameters, enabling direct comparison.

| Hose size | Length | Product | Amazon link | Visible price* |
|---|---:|---|---|---:|
| 1" (25mm) | 25m | STRUBER 4-layer garden hose, carbon | [STRUBER 1" 25m](https://www.amazon.de/dp/B09ZJ3V237) | 47,99 EUR |
| 3/4" (19mm) | 25m | STRUBER 4-layer garden hose, carbon | [STRUBER 3/4" 25m](https://www.amazon.de/dp/B09ZJ3V8CH) | 29,69 EUR |
| 1/2" (13mm) | 25m | STRUBER 4-layer garden hose, carbon | [STRUBER 1/2" 25m](https://www.amazon.de/dp/B09ZJ3NJTD) | 20,89 EUR |

Price deltas within this family (25m):
- 1" vs 3/4": +18,30 EUR (~1,62x)
- 1" vs 1/2": +27,10 EUR (~2,30x)
- 3/4" vs 1/2": +8,80 EUR (~1,42x)

*Prices are Amazon snapshots from 2026-05 and can change by seller, day, and delivery option.

### Throughput Gain vs Hose Diameter (Modeled)

To quantify diameter impact, throughput was modeled with Darcy-Weisbach for water at ~20 C, straight hose only, smooth inner wall, and a fixed pressure-drop budget of 1 bar across the hose (no fittings/nozzle losses).

| Length | 3/4" vs 1/2" | 1" vs 1/2" | 1" vs 3/4" |
|---:|---:|---:|---:|
| 10 m | +207.5% | +539.7% | +108.1% |
| 20 m | +208.8% | +544.1% | +108.6% |
| 30 m | +209.6% | +546.8% | +108.9% |
| 40 m | +210.3% | +548.9% | +109.1% |
| 50 m | +210.8% | +550.5% | +109.3% |

Modeled reference flows under the same assumptions:

| Length | 1/2" (13mm) | 3/4" (19mm) | 1" (25mm) |
|---:|---:|---:|---:|
| 10 m | 24.8 L/min | 76.3 L/min | 158.8 L/min |
| 20 m | 16.8 L/min | 51.9 L/min | 108.2 L/min |
| 30 m | 13.4 L/min | 41.4 L/min | 86.4 L/min |
| 40 m | 11.3 L/min | 35.2 L/min | 73.6 L/min |
| 50 m | 10.0 L/min | 31.0 L/min | 65.0 L/min |

Interpretation:
- For equal pressure budget, 3/4" carries about 3.1x the flow of 1/2" (about +210%).
- 1" carries about 6.5x the flow of 1/2" (about +545%).
- 1" carries about 2.1x the flow of 3/4" (about +109%).
- Percent gains stay almost constant from 10 m to 50 m because all sizes scale similarly with length in this regime.

### Throughput Gain in a Pump-Limited Scenario (TIP GP 5000 INOX)

To approximate real-world behavior with your pump, a second model uses the pump operating envelope from retail specs visible in Amazon listings for GP 5000 INOX:
- Qmax approx. 5,000 L/h
- Hmax approx. 45 m (approx. 4.5 bar shut-off)

Model assumptions:
- Linearized pump curve between (Q=0, H=45 m) and (Q=5,000 L/h, H=0)
- Same hose assumptions as above (water ~20 C, straight hose, no fittings/nozzle losses)

Relative throughput gains under this pump-limited model:

| Length | 3/4" vs 1/2" | 1" vs 1/2" | 1" vs 3/4" |
|---:|---:|---:|---:|
| 10 m | +71.7% | +97.2% | +14.9% |
| 20 m | +97.3% | +145.6% | +24.5% |
| 30 m | +112.3% | +179.2% | +31.5% |
| 40 m | +122.6% | +204.9% | +37.0% |
| 50 m | +130.2% | +225.6% | +41.4% |

Modeled operating-point flows with this pump approximation:

| Length | 1/2" (13mm) | 3/4" (19mm) | 1" (25mm) |
|---:|---:|---:|---:|
| 10 m | 39.6 L/min | 68.0 L/min | 78.1 L/min |
| 20 m | 30.1 L/min | 59.3 L/min | 73.8 L/min |
| 30 m | 25.2 L/min | 53.4 L/min | 70.3 L/min |
| 40 m | 22.1 L/min | 49.1 L/min | 67.2 L/min |
| 50 m | 19.8 L/min | 45.7 L/min | 64.6 L/min |

Interpretation for your build:
- On shorter runs, the pump is already near its flow ceiling, so 1" gives smaller gains over 3/4".
- On longer runs, line losses dominate more, and larger diameters gain more strongly.
- 3/4" is a major upgrade over 1/2" at every tested length; 1" is best for minimizing loss in longer/high-demand runs.

---

## Common Component: 4-Way Distributor

**TAVLIT PP Swivel Multi-T-Verteiler 1" 4-fach: 16,45 €**
- 1" threaded inlet and 4× 1" threaded outlets
- Rated 10 bar; compatible with all three piping systems below
- GRATIS delivery, Berlin confirmed

Alternative: Rain Bird PVC 4-fach Verteiler 1" (38,90 €) — overkill for this use.

---

## Construction Plan: 4-Way Distributor (Wiltec Brass Block)

If you prefer a brass manifold body, use the Wiltec 4-way block: [Wiltec brass distributor block (Amazon)](https://amzn.eu/d/0dvnAcQX).

### Port Layout (based on listing geometry)
- 3x large ports: G1" female thread (IG)
- 1x large port: G1" male thread (AG)
- 1x small service port: G1/4" male thread (AG) at top

This is therefore a "3+1" main layout plus one service/instrument port, not four identical G1" branches.

### Recommended Use in This Project
1. Use one G1" side as the inlet from the wall/pump line
2. Use three G1" ports as outlets to three GEKA wall faucets
3. Add one additional outlet using the remaining G1" port with the correct AG/IG adapter chain
4. Close the G1/4" service port with a blind cap unless you need a pressure gauge or drain point

### Blind Cap / Plug Selection

For the small top service port (confirmed G1/4" AG):
- Use a brass blind cap with female thread: [Messing Blindkappe G1/4 IG](https://www.amazon.de/s?k=Messing+Blindkappe+G1%2F4+IG)

If you need to close a G1" female-thread port (G1" IG port):
- Use a brass male plug: [Messing Blindstopfen G1 AG](https://www.amazon.de/s?k=Messing+Blindstopfen+G1+AG)

If you need to close a G1" male-thread port (G1" AG port):
- Use a brass female cap: [Messing Blindkappe G1 IG](https://www.amazon.de/s?k=Messing+Blindkappe+G1+IG)

Sealing notes:
- Flat-gasket sealing preferred when cap/plug design supports it
- Otherwise use PTFE tape on tapered/thread-seal joints

---

## System A: Galvanized Steel — The Budget Choice

**Recommended for**: Above-ground or covered installations, cost-sensitive builds.

### How It Works
1" G threaded galvanized steel pipe (Gewinderohr verzinkt, 33,7mm OD) with malleable cast iron (Temperguss feuerverzinkt) fittings. All joints sealed with PTFE tape. Pump G1" IG → reducer/adapter → 2× 90° elbows → 300mm wall nipple → distributor → 4× GEKA faucets.

### Parts List (Amazon.de, Berlin 12619)

| # | Component | Product | Qty | Unit € | Total € |
|---|---|---|---|---|---|
| 1 | 90° elbow 1" IG/AG, verzinkt | [Temperguss Bogen 90° 1"](https://www.amazon.de/s?k=Temperguss+Bogen+90+Grad+1+Zoll+verzinkt+IG+AG) | 2 | 2,48 | 4,96 |
| 2 | Pipe nipple 1" × 300mm, verzinkt | [Rohrnippel verzinkt 1"×300mm](https://www.amazon.de/s?k=Rohrnippel+verzinkt+1+Zoll+300mm) | 1 | 4,46 | 4,46 |
| 3 | 4-way distributor 1" | [TAVLIT PP Multi-T-Verteiler 1" 4-fach](https://www.amazon.de/s?k=TAVLIT+PP+Verteiler+1+Zoll+4-fach+Multi-T) | 1 | 16,45 | 16,45 |
| 4 | Wall faucet 1" AG + GEKA outlet | [MegaHaustechnik Auslaufhahn Messing 1" AG GEKA](https://www.amazon.de/s?k=MegaHaustechnik+Auslaufhahn+Messing+1+Zoll+AG+GEKA+Kugelhahn) | 4 | 10,97 | 43,88 |
| | PTFE tape (Dichtungsband) | [PTFE Dichtungsband 12mm](https://www.amazon.de/s?k=PTFE+Dichtungsband+12mm+Gewinde) | 1 | ~1,00 | 1,00 |
| | **Total** | | | | **~70,75 €** |

### Assembly
1. Wrap PTFE tape on all male threads (3–4 turns)
2. Screw elbows onto pump outlet (1" IG on pump → elbow 1" IG/AG)
3. Thread 300mm nipple through pre-drilled 35mm wall bore
4. Connect 4-way distributor; mount to wall
5. Screw GEKA wall faucets (1" AG) into distributor outlets
6. Test for leaks; re-tighten as needed

**Tools**: Pipe wrench (Rohrzange) 1"+ span; PTFE tape. Skill level: basic DIY.

### Durability
Galvanized zinc coating: 10–20 years in outdoor/damp conditions. Suitable for above-ground, covered location. Re-sealable if joints weep.

---

## System B: PE 32mm + PP Compression Fittings — Best Long-Term Value

**Recommended for**: Buried, in-wall, or permanent outdoor installations; tool-light assembly.

### How It Works
HDPE pipe (32mm OD, PN16) with PP compression (Klemmverbinder) fittings. Push pipe into fitting, hand-tighten nut — no wrench needed. Transitions to 1" G threads at pump and distributor via PP transition fittings.

### Parts List (Amazon.de, Berlin 12619)

| # | Component | Product | Qty | Unit € | Total € |
|---|---|---|---|---|---|
| 1 | PE pipe 32mm × 1m (wall segment) | [PE Rohr 32mm PN16 (1m Stück)](https://www.amazon.de/s?k=PE+Rohr+32mm+PN16+1m+HDPE) | 1 | 8,60 | 8,60 |
| 2 | PP elbow 90° 32mm × 1" AG, 2-pack | [PP Klemmverbinder Winkel 90° 32mm×1" AG DVGW](https://www.amazon.de/s?k=PP+Klemmverbinder+Winkel+90+32mm+1+Zoll+AG+DVGW) | 1 pack | 10,95 | 10,95 |
| 3 | PP coupling 32mm × 1" IG | [PP Kupplung 32mm×1" IG MDPE](https://www.amazon.de/s?k=PP+Kupplung+32mm+1+Zoll+IG+MDPE+Klemmverbinder) | 1 (use 1) | 10,95 | 5,48* |
| 4 | PP elbow 90° 32×32mm (interior) | [MegaHaustechnik PP Winkel 32×32mm](https://www.amazon.de/s?k=MegaHaustechnik+PP+Winkel+32mm+Klemmverbinder) | 1 | 5,47 | 5,47 |
| 5 | 4-way distributor 1" | [TAVLIT PP Multi-T-Verteiler 1" 4-fach](https://www.amazon.de/s?k=TAVLIT+PP+Verteiler+1+Zoll+4-fach+Multi-T) | 1 | 16,45 | 16,45 |
| 6 | Wall faucet 1" AG + GEKA outlet | [MegaHaustechnik Auslaufhahn Messing 1" AG GEKA](https://www.amazon.de/s?k=MegaHaustechnik+Auslaufhahn+Messing+1+Zoll+AG+GEKA+Kugelhahn) | 4 | 10,97 | 43,88 |
| | **Total** | | | | **~90,83 €** |

*2-pack; half the pack price counted

### Assembly
1. Cut PE pipe square to required lengths (pipe cutter or sharp knife)
2. Push pipe into PP elbow/coupling; hand-tighten compression nut
3. Thread 32mm PE pipe through 35mm+ wall bore (flexible — easy to maneuver)
4. Transition to 1" at distributor using PP coupling 32mm×1"
5. Screw distributor to wall; connect GEKA faucets

**Tools**: Pipe cutter or sharp knife; no wrench needed. Skill level: beginner-friendly.

### Durability
PE100 + PP fittings: 50+ year lifespan; no corrosion; DVGW certified. Best for buried or wall-embedded runs. UV-stable (black pipe).

---

## System C: Brass + Stainless Steel Threaded — Premium Zero-Corrosion

**Recommended for**: Permanent install, food-safe, corrosion-free, traditional plumbing aesthetic.

### How It Works
Same as System A (threaded G1" pipe) but using brass (Messing CW617N) elbows and stainless steel nipple instead of galvanized iron. All joints PTFE-sealed.

### Parts List (Amazon.de, Berlin 12619)

| # | Component | Product | Qty | Unit € | Total € |
|---|---|---|---|---|---|
| 1 | 90° elbow 1" IG/AG, Messing | [Messing Winkel 90° G1" IG/AG](https://www.amazon.de/s?k=Messing+Winkel+90+Grad+1+Zoll+IG+AG+G1) | 2 | 9,59 | 19,18 |
| 2 | Pipe nipple 1" × 300mm, Edelstahl | [MegaHaustechnik Edelstahl Langnippel 1"×300mm](https://www.amazon.de/s?k=MegaHaustechnik+Edelstahl+Langnippel+1+Zoll+300mm) | 1 | 11,27 | 11,27 |
| 3 | 4-way distributor 1" | [TAVLIT PP Multi-T-Verteiler 1" 4-fach](https://www.amazon.de/s?k=TAVLIT+PP+Verteiler+1+Zoll+4-fach+Multi-T) | 1 | 16,45 | 16,45 |
| 4 | Wall faucet 1" AG + GEKA outlet | [MegaHaustechnik Auslaufhahn Messing 1" AG GEKA](https://www.amazon.de/s?k=MegaHaustechnik+Auslaufhahn+Messing+1+Zoll+AG+GEKA+Kugelhahn) | 4 | 10,97 | 43,88 |
| | PTFE tape | [PTFE Dichtungsband 12mm](https://www.amazon.de/s?k=PTFE+Dichtungsband+12mm+Gewinde) | 1 | ~1,00 | 1,00 |
| | **Total** | | | | **~91,78 €** |

### Assembly
Identical to System A. PTFE tape + pipe wrench.

### Durability
Brass + stainless: 50+ years; no rust; DIN 50930-6 (Trinkwasserverordnung). Ideal for in-wall permanent installation.

---

## ❌ Excluded: Copper Solder/Press-Fit

Copper 28mm (EN 1057) solder or press-fit fittings at 1" are 15–30 €/elbow on Amazon.de and require soldering torch or press-fit tool (>100 €). Total system cost would exceed 150–200 €. Not justified for garden watering. **Eliminated.**

---

## Decision Matrix

| | A: Galvanized | B: PE+PP | C: Brass/SS |
|---|---|---|---|
| **Total cost** | **~70,75 €** | ~90,83 € | ~91,78 € |
| **Assembly ease** | Medium | **Easy** | Medium |
| **Outdoor durability** | Good | **Excellent** | **Excellent** |
| **Buried/in-wall** | Acceptable | **Best** | Excellent |
| **Reversible** | Yes | Yes | Yes |
| **Corrosion** | Low risk | **None** | **None** |
| **Tool requirement** | Pipe wrench | None | Pipe wrench |

---

## Recommendation

**Best overall for most users: System A (Galvanized Steel)** — cheapest, widely available, proven technology. If the installation is above ground and accessible, this is the right choice.

**Best for buried or permanent in-wall**: System B (PE + PP) — tool-free, corrosion-proof, easier to run through wall bore. The ~20 € premium is well justified.

**System C** is equivalent in price to System B but requires a pipe wrench. Choose it if you prefer traditional threaded plumbing aesthetics or already own the tools.

---

## Where to Buy (Berlin 12619)

All products available on Amazon.de with confirmed delivery to Berlin 12619.
- TAVLIT distributor: GRATIS delivery within 1–2 days
- VARIOSAN, MegaHaustechnik, Poppstar: Prime/standard delivery 1–3 days
- Large PE pipe rolls (25m+): 2–3 day delivery, additional shipping fee (~5,90 €)

> **Note**: Pump spec page (tip-online.de) was unreachable during this research. G1" IG output on the TIP GP INOX 5000 is based on product documentation commonly referenced in German retail listings. Verify the thread type (G1" = BSP, not NPT) before purchasing — all products listed here use G/BSP threads.
