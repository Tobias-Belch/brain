---
generated: 2026-03-31
updated: 2026-03-31
note: "WtNC (hidden) and 3077 (Wabbajack-only, Discord-hosted) are both unavailable via standard Vortex/Nexus flow. Skip modpacks entirely — install the 10 core mods individually via Vortex. This is the primary recommended path."
title: Cyberpunk 2077 Replay — Approach Comparison & Synthesis
original_prompt: "What mods and strategies will make a full PC replay of Cyberpunk 2077 (including Phantom Liberty, first time) feel fresh and immersive — not like a chore?"
sources:
  - notebooklm_guide: /Users/tobiasbelch/workspaces/fea/brain/docs/games/cyberpunk-2077-replay-guide.md
  - chatgpt_conversation: https://chatgpt.com/share/69cbc0af-6370-832e-b38a-1d2729619714
---

## Table of Contents

1. [Overview of Both Approaches](#1-overview-of-both-approaches)
2. [Side-by-Side Comparison](#2-side-by-side-comparison)
3. [Where They Agree](#3-where-they-agree)
4. [Where They Diverge](#4-where-they-diverge)
5. [Quality Assessment](#5-quality-assessment)
6. [Synthesised Best Approach](#6-synthesised-best-approach)
7. [Step-by-Step Installation Walkthrough (GOG Galaxy)](#7-step-by-step-installation-walkthrough-gog-galaxy)
   - [Phase 1 — Install Vortex](#phase-1--install-vortex)
   - [Phase 2 — Set Up Vortex for Cyberpunk 2077](#phase-2--set-up-vortex-for-cyberpunk-2077)
   - [Phase 3 — Framework Layer](#phase-3--install-the-framework-layer-required-before-anything-else)
   - [Phase 4 — Mod Settings UI](#phase-4--install-mod-settings-ui-for-in-game-configuration)
   - [Phase 5 — Core Immersion Mods](#phase-5--install-priority-mods-no-modpack-available--install-individually)
   - [Phase 6 — Visual Mods](#phase-6--visual-mods-optional--pick-carefully)
   - [Phase 7 — Final Checks](#phase-7--final-checks-before-playing)
   - [Phase 8 — Romance Mods](#phase-8--romance-immersion-mods-optional)
   - [Phase 9 — Nightlife Mods](#phase-9--nightlife-immersion-mods-optional)
   - [Phase 10 — Launch and Verify](#phase-10--launch-and-verify)
8. [Personalised Build Recommendation](#8-personalised-build-recommendation)

---

## 1. Overview of Both Approaches

### NotebookLM Research Guide (Artifact A)

A structured research report produced by a deep-research workflow: 49 sources (Reddit, PCGamesN, IGN, ScreenRant, GameSpot, GamesRadar, Steam Community), synthesised via NotebookLM RAG, with a 24-mod comparison table, mind map, and a curated conflict/gap analysis. The guide is explicitly **PC/Steam, post-2.0 only**, and names specific mods with version caveats, known-broken mods, and modpack entry points.

**Tone:** Clinical, sourced, hedged. Every claim traceable to a source ID. Conflicts documented explicitly.

**Scope:** Comprehensive modding setup + roleplay strategy + Phantom Liberty timing.

### ChatGPT Conversation (Turns 1 & 2)

An interactive Q&A — the user asked the original question, then revealed their prior run was stealth netrunner. ChatGPT gave a philosophy-first, mods-second response, then tailored a personalised recommendation for the mechanical and roleplay pivot away from netrunning.

**Tone:** Conversational, opinionated, persuasive. No source citations. Reasoning-by-analogy rather than research.

**Scope:** Mod philosophy + playstyle identity + a concrete personalised build direction. Less installation depth.

---

## 2. Side-by-Side Comparison

| Dimension | NotebookLM Guide | ChatGPT Conversation |
|---|---|---|
| **Method** | 49-source RAG synthesis | Reasoning from LLM priors; no cited sources |
| **Mod specificity** | Named mods with Nexus Mods context, known-broken list, version caveats | Named category mods; some exact names, some vague ("melee responsiveness mods") |
| **Framework layer** | CET + Red4Ext + Redscript + ArchiveXL + TweakXL + Codeware | CET + REDmod/Native Settings (simplified) |
| **Top immersion mods** | LHUD, They Will Remember, Dark Future, Immersive Gigs, Night City Alive, Wannabe Edgerunner, Immersive Bartenders | LHUD, They Will Remember, Night City Alive, Immersive Gigs, Immersive First Person |
| **Mods to avoid** | Explicit list (Let There Be Flight, old Enemies of Night City, Survival System, etc.) | No avoid list — only general warning against 100+ collections and power-creep mods |
| **Modpack entry point** | ~~Welcome to Night City~~ (hidden), 3077: Ultimate Vanilla+ | Warns against large modpacks; recommends 5–10 curated mods instead |
| **Visual mods** | Nova LUT (with conflict noted), Realistic Map | HD Reworked Project, "pick one reshade" |
| **Phantom Liberty timing** | Start late (after all companion arcs, right before PONR) — strongly sourced | "Treat it as a spy thriller arc, not DLC"; reframe mentally + change loadout when entering Dogtown |
| **Roleplay rules** | Specific personas (Judge Dredd, Pacifist AI, Traditionalist Nomad, Corpo Elitist) | Specific personas (Corpo Netrunner, Streetkid Assassin, Nomad Driver); harder pivot from prior run |
| **Post-netrunner guidance** | Not personalised — no prior-run context | Fully personalised: Sandevistan katana + no quickhacks recommended; anti-powerup warnings |
| **Self-imposed rules** | "Single biggest driver of replayability — more than any mod" | "That tiny shift is what makes the replay stick" — same conclusion, different framing |
| **Conflict documentation** | Explicit (LUT debate, REDmod stability, PL timing, patch 2.3 compatibility) | None |
| **Patch compatibility** | Explicit gap: patch 2.3/2.31 broke some mods; verify Nexus before installing | Not addressed |
| **Installation order** | Detailed: framework first → individual mods (no modpack available) | Not addressed |
| **Depth** | Deep (nexus-level detail, known-broken mods, Discord references) | Shallow-to-medium (principles + named mods; no install guidance) |
| **Personalisation** | None — no prior run context available | High — tailored to post-stealth-netrunner pivot |

---

## 3. Where They Agree

These are the claims both sources reach independently, which gives them the highest confidence:

1. **Roleplay identity over mod count.** Both sources conclude — independently and emphatically — that self-imposed character rules matter more than any mod. This is the single most important finding.

2. **LHUD (Limited HUD) is essential.** Named explicitly by both as a top-tier immersion upgrade with unusually high impact for zero complexity.

3. **They Will Remember + Night City Alive + Immersive Gigs** — all three appear in both mod lists, validating them as a stable "world feels alive" core.

4. **Equipment-EX** — named by both for separating fashion from armour stats.

5. **Do not install 100+ mods.** Both warn against large, unmanaged collections. NotebookLM recommends curated modpacks as a controlled entry point; ChatGPT recommends hand-picking 5–10. Both arrive at the same outcome via different routes.

6. **Power-creep is the enemy of a fresh replay.** Both identify overpowered builds as the primary replay-killer and warn against gear/perk maximisation.

7. **No fast travel / driving everywhere** — listed as a self-imposed rule in both sources as one of the highest-ROI "feel" changes.

8. **Phantom Liberty should feel different, not just bigger.** NotebookLM recommends delaying it for narrative weight; ChatGPT recommends a mid-game build pivot and mental reframe. Both agree it should not be treated as standard map content.

---

## 4. Where They Diverge

| Topic | NotebookLM Guide | ChatGPT | Assessment |
|---|---|---|---|
| **Modpacks** | ~~Both WtNC and 3077 are now unavailable~~ (WtNC hidden; 3077 is Wabbajack-only) | Warns against large collections | Skip modpacks — install the 10 validated mods individually. Simpler, faster, full control. |
| **REDmod** | Warns against REDmod-specific mods for long saves (community anecdote) | Lists REDmod as a core required framework | NotebookLM's caveat is worth noting but unquantified. Don't build around REDmod-specific mods. |
| **Visual mods** | Nova LUT (subtle colour correction; zero performance cost) | HD Reworked Project + reshade | Different categories. Nova LUT addresses colour grading; HD Reworked addresses texture fidelity. Both can coexist. |
| **Dark Future (survival needs)** | Strongly recommended with tuning notes | Not mentioned by name — covered loosely under "survival mods (optional/spice)" | NotebookLM gives better guidance here: install it but tune it immediately. |
| **Wannabe Edgerunner** | Specifically recommended with prominent tuning warning | Not mentioned by name | Worth adding; matches ChatGPT's spirit of "let the game stay dangerous." |
| **PL timing mechanism** | Delay the Voodoo Boys "Transmission" quest until post-companion arcs | Mental reframe + loadout swap entering Dogtown | These are complementary, not contradictory. Do both. |
| **Post-netrunner pivot** | Not addressed | Central to Turn 2: Sandevistan katana / no quickhacks | ChatGPT wins here by design — it had the prior-run context. |

---

## 5. Quality Assessment

### NotebookLM Guide — Strengths

- **Verifiability.** Every claim has a source ID. Conflicts and open questions are documented. You know what is certain vs. anecdotal.
- **Installation safety.** Explicit broken-mod list and patch 2.3 compatibility warning are uniquely valuable — ChatGPT cannot know current patch status.
- **Operational detail.** Framework layer, load order, individual mod Nexus links — actionable from day one. Note: both major modpacks (WtNC, 3077) are now unavailable.
- **Phantom Liberty timing** is specific and mechanically grounded (which quest triggers the DLC unlock).

### NotebookLM Guide — Weaknesses

- **No personalisation.** The prior run context (stealth netrunner) never entered the research workflow, so the roleplay pivot section is generic.
- **Bureaucratic.** The source table and gap analysis are thorough but verbose for a practical "what do I do?" question.

### ChatGPT Conversation — Strengths

- **Personalisation.** The most valuable content is in Turn 2, which only exists because the user provided their prior run. The Sandevistan/no-quickhacks direction is concrete and well-reasoned.
- **Mindset framing.** "Don't optimise the fun away," "ask what version of V you're living," and "the Ubisoft checklist feeling" are memorable framings that function as durable heuristics.
- **Pacing advice.** The "TV episodes" approach (1 main quest + 1–2 gigs + 1 exploration per session) is not covered in the research guide and is genuinely useful for preventing burnout.

### ChatGPT Conversation — Weaknesses

- **No source verification.** Mod recommendations cannot be validated against patch version. "Better melee responsiveness mods" and "finisher/takedown expansion mods" are categories, not installable mod names.
- **No avoid list.** A player following only ChatGPT's advice might install Let There Be Flight or the old Enemies of Night City and brick a save.
- **REDmod misguidance.** Listing REDmod as a core required framework when the modding community has moved away from it is potentially problematic.
- **Modpack stance is overcorrected.** Telling all players to avoid large collections misses the fact that curated modpacks are the safest entry point for non-expert modders. Note: both WtNC (hidden) and 3077 (Wabbajack-only) are now unavailable — the individual-mod approach has become the primary path by default.

---

## 6. Synthesised Best Approach

The following synthesises the most reliable findings from both sources. Use this as your primary reference.

### Foundational principle

> **Identity first, mods second.** Decide who V is this run before you install anything. The persona shapes which mods are relevant. Both sources agree on this — it is the single most important variable.

---

### Step 1 — Define your persona (before launching the game)

Coming from a stealth netrunner run, the sharpest possible pivot is:

**Sandevistan Katana Solo — "The Psycho Merc"**

Rules:
- No quickhacks. No cyberdeck. Sandevistan only.
- Primary weapons: Katana + Shotgun (or Mantis Blades).
- If spotted, fight it out — never reload to "preserve stealth."
- Stats: Reflexes + Body. No Intelligence investment.
- Dialogue: impulsive, emotional, mercenary — not the optimal choice.
- Take gigs even when underpaid. V needs the work.

Why this works: It inverts every mechanic you mastered on the netrunner run. Enemy AI becomes dangerous again. Positioning matters. The game's level design becomes visible.

---

### Step 2 — Install the framework layer (from NotebookLM Guide)

In this order:

1. **Cyber Engine Tweaks (CET)**
2. **Red4Ext**
3. **Redscript**
4. **ArchiveXL + TweakXL**
5. **Codeware**
6. **Mod Settings / Native Settings UI**
7. **ConflictChecker**

Do not skip ConflictChecker. Do not use REDmod-specific mods for primary content.

---

### Step 3 — Core immersion mods (both sources agree)

Install one at a time. Test after each. Stop if anything breaks.

| Mod | What it does | Priority |
|---|---|---|
| **Limited HUD (LHUD)** | Contextual UI — minimap/markers only when needed | Essential |
| **They Will Remember** | Gangs track and retaliate for violence on their turf | Essential |
| **Night City Alive** | More ambient gang activity and world events | High |
| **Immersive Gigs** | You must contact fixers for work — no automatic pings | High |
| **No More Duplicate NPCs** | Randomises NPC clothing; removes clone army | High |
| **Equipment-EX** | Unlimited outfit slots; separates fashion from armour | High |
| **Dark Future** | Survival needs (hunger, thirst, sleep). **Tune immediately in Mod Settings — defaults are punishing** | Medium |
| **Wannabe Edgerunner** | Cyberpsychosis system tied to cyberware. **Read config options before installing** | Medium |
| **Night City Interactions** | Sit at bars; drink properly | Low |
| **Immersive Bartenders / Vendors / Rippers** | Animated NPC interactions | Low |

---

### Step 4 — Visual mods (pick one from each category, not multiples)

- **Nova LUT** ("Classic" variant) — removes the warm-yellow stock tint. Zero performance cost. Try it for one session; revert if it feels wrong. *(From NotebookLM; contested by purists.)*
- **Realistic Map** — high-res 2D map instead of stylised 3D; better for indoor navigation.
- If you want texture upgrades: **HD Reworked Project** is safe. *(From ChatGPT.)*

Do not stack multiple reshades or LUTs.

---

### Step 5 — Self-imposed rules (no mods required, high impact)

Drawn from both sources:

- **No fast travel.** Drive or walk everywhere.
- **No minimap** — use LHUD's contextual mode and In-World Navigation instead.
- **Play in sessions, not marathons.** 1 main quest + 1–2 gigs + 1 unscripted moment per session. Prevents the checklist feeling.
- **Sleep at the apartment** between missions (with Dark Future installed this becomes mechanical, not just flavour).
- **Pick abrasive/mercenary dialogue** — opposite of your first run's empathetic defaults.
- **Do not loot everything.** Only take what your character would carry.
- **First-person driving at night.** Use the in-game radio. Let the city breathe.

---

### Step 6 — Phantom Liberty timing

Combine both sources' advice:

1. **Do not trigger "Transmission"** (the Voodoo Boys quest) until you have completed Panam's, Judy's, River's, and Kerry's full storylines.
2. When you do enter Dogtown: **change your outfit and weapon loadout to signal a tonal shift.** You are now in espionage territory — feel free to play it more cautiously, more expensively, more paranoid.
3. Frame it internally as *the final arc, not DLC content.* It hits hardest when V is desperate.

---

### Step 7 — Before you install anything

- **Check every mod's Nexus Mods page for patch 2.3/2.31 compatibility** before installing. The research guide identified this as an unresolved gap — some mods from this list may have been broken by the vehicle customisation changes in 2.3.
- **Use the 3077: Ultimate Vanilla+ collection** instead of WtNC (which is hidden). Check its comments and changelog for community support and current compatibility notes.
- **Avoid:** Let There Be Flight, old Enemies of Night City, Outfit Unlocker, Survival System (original), Material and Texture Override.

---

## 7. Step-by-Step Installation Walkthrough (GOG Galaxy)

This section is GOG-specific but the process is identical to Steam. Every step is actionable with direct links.

---

### Before You Start

- **Windows 10 or higher required.**
- **Install the latest [Microsoft Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe)** — required by CET.
- **Close GOG Galaxy** before installing mods. Keep it closed until deployment is complete.
- **Run the game in Windowed Borderless** once it is installed (required by CET console).
- **Disable overlay software** that conflicts with CET: Steam Overlay, Discord overlay, GOG Overlay, GeForce Experience, Windows Game Bar, RivaTuner, Fraps. Disable them all before launching.
- Your game install path will be something like `C:\GOG Games\Cyberpunk 2077\` or wherever GOG installed it. Note this path — you will need it.

---

### Phase 1 — Install Vortex

Vortex is the mod manager. It handles all the copying and folder placement automatically. Download it from [nexusmods.com](https://www.nexusmods.com/site/mods/1) → click **Manual Download**. Install it to the default location or anywhere you like. Free, no GOG account needed.

> If you have used Vortex for other games before: Cyberpunk 2077's Vortex integration is significantly better than Skyrim's. Do not let old trauma affect your expectations here.

---

### Phase 2 — Set Up Vortex for Cyberpunk 2077

#### 2a. Link your Nexus account (optional but recommended)

1. Open Vortex → click the red circle (top right) → log in with your Nexus account (free registration at [nexusmods.com](https://users.nexusmods.com/register)). This enables one-click mod downloads.

#### 2b. Add Cyberpunk 2077 to Vortex

1. Click **Games** in the left sidebar → search "Cyberpunk" → hover over the thumbnail → click **Manage**.
2. A popup will appear: *"Game support not installed."* This is expected. Click **Continue**.
3. Vortex will prompt you to locate the game. Navigate to the `bin\x64` subfolder of your Cyberpunk install directory. GOG installs to a custom path (e.g. `C:\GOG Games\Cyberpunk 2077\bin\x64` or wherever you chose). The key folder is the one containing the `Cyberpunk2077.exe` file — that is `bin\x64`. Click **Select Folder**.

#### 2c. Install the Cyberpunk Vortex Extension

> **Important (January 2026):** Vortex will not automatically download the latest Cyberpunk extension. You must do this manually or it will install an outdated version with a known bug.

1. Download the extension manually: [nexusmods.com/site/mods/196](https://www.nexusmods.com/site/mods/196) → **FILES** tab → click **Manual Download** on the top file.
2. In Vortex, go to the **Extensions** tab (left sidebar).
3. Drag the downloaded `.zip` file into the **Drop File(s)** box at the bottom.
4. Confirm the version shows `0.12.1`. If it shows `0.12.0`, drag the new zip in again, click **Remove** on the old version, and restart Vortex.
5. After restart, go to the **V2077** settings and confirm the **"Automatic REDmod Conversion"** toggle is **OFF**. If it is on (a known bug in 0.12.0), switch it off.

#### 2d. Recommended Vortex settings

Go to **Settings** → **Automation** and set:

| Setting | Value |
|---|---|
| Deploy mods when Enabled | **On** |
| Install Mods when downloaded | **Off** |
| Enable Mods when installed | **On** |

The first setting auto-deploys each mod as you enable it (saves a click). The second lets you handle one mod at a time without popup stacking. The third auto-enables after install.

Go to **Settings** → **Mods** → **Staging**. The staging folder **must be on the same drive** as your game install. Default (`%APPDATA%\Vortex\cyberpunk2077\mods`) is fine. Do not put it inside the game install directory.

On the **Dashboard**, click the three dots next to **"Launch Game with REDmods Enabled"** and set it as **Primary**. This makes Vortex use the correct launch option when you click the game icon.

---

### Phase 3 — Install the Framework Layer (required before anything else)

These six mods are the foundation. Every other mod depends on them. Install them in this order, using the one-click **Mod manager download** button on each Nexus page. Vortex will download, install, enable, and deploy automatically.

**If a mod has no Mod manager download button** — click **Manual Download**, then in Vortex go to the **Downloads** tab and drag the zip file into the drop zone. Or use **Mods** → **Install From File**.

| # | Mod | Nexus Link | What it does |
|---|---|---|---|
| 1 | Cyber Engine Tweaks (CET) | [nexusmods.com/cyberpunk2077/mods/107](https://www.nexusmods.com/cyberpunk2077/mods/107) | Base framework; enables scripting and console |
| 2 | RED4ext | [nexusmods.com/cyberpunk2077/mods/2380](https://www.nexusmods.com/cyberpunk2077/mods/2380) | Script extension layer |
| 3 | redscript | [nexusmods.com/cyberpunk2077/mods/1511](https://www.nexusmods.com/cyberpunk2077/mods/1511) | Custom script compiler |
| 4 | ArchiveXL | [nexusmods.com/cyberpunk2077/mods/4198](https://www.nexusmods.com/cyberpunk2077/mods/4198) | Asset/Archive extension |
| 5 | TweakXL | [nexusmods.com/cyberpunk2077/mods/4197](https://www.nexusmods.com/cyberpunk2077/mods/4197) | TweakEXT replacement |
| 6 | Codeware | [nexusmods.com/cyberpunk2077/mods/7780](https://www.nexusmods.com/cyberpunk2077/mods/7780) | Code-related extensions |

After installing all six, **verify CET is working** before continuing:

1. Click the **Launch Game** button in Vortex.
2. On first launch, CET will prompt you to choose a **hotkey for the overlay**. Pick any key (e.g. `~` or `F1`). Save it.
3. Open the game, press your chosen key — the CET overlay should appear. If it does, the framework is correctly installed.
4. Check the CET log at `<game install>\bin\x64\plugins\cyber_engine_tweaks\cyber_engine_tweaks.log` if anything looks wrong.

> **REDmod note:** Do not use REDmod-specific mods for primary content. They load through a different pipeline and have reported stability issues on long save files. The community frameworks above are what you want.

---

### Phase 4 — Install Mod Settings UI (for in-game configuration)

| Mod | Nexus Link | Why |
|---|---|---|
| Native Settings UI | [nexusmods.com/cyberpunk2077/mods/6161](https://www.nexusmods.com/cyberpunk2077/mods/6161) | Configure installed mods' settings in-game instead of editing `.ini` files by hand. Required for Dark Future and Wannabe Edgerunner tuning. |

After installing, launch the game once and confirm the settings menu appears under the in-game System menu.

---

### Phase 5 — Install Priority Mods (No Modpack Available — Install Individually)

> **Updated March 2026:** Both major modpacks are now unavailable via standard install: WtNC has been hidden since July 2023, and 3077 is now Wabbajack-only (Discord-hosted, not on Nexus). The path below installs everything you need individually via Vortex — it takes 30–45 minutes and gives you full control.
>
> **⚠️ Nexus Mod IDs change frequently.** The IDs listed below were verified live on Nexus as of March 2026. If any link returns "removed" or "hidden", search for the mod by name on [nexusmods.com/cyberpunk2077/mods](https://www.nexusmods.com/cyberpunk2077/mods) — mod authors regularly reupload under new IDs. Always search by name rather than relying on fixed IDs.

Since no modpack is available, install the 10 core mods individually. Each one downloads, installs, and deploys in under a minute via Vortex. Work through them in the order below — this is the exact core that both the NotebookLM guide and ChatGPT independently validated.

Install one, launch the game briefly, confirm it works, then move to the next.

| # | Mod | Nexus Link | Priority | Notes |
|---|---|---|---|---|
| 1 | **Streamlined HUD** (LHUD replacement) | [nexusmods.com/cyberpunk2077/mods/10759](https://www.nexusmods.com/cyberpunk2077/mods/10759) | **Essential** | Install first. Configures via CET overlay. Limited HUD was removed — Streamlined HUD is the community-standard replacement (564 endorsements). |
| 2 | **They Will Remember** | [nexusmods.com/cyberpunk2077/mods/19747](https://www.nexusmods.com/cyberpunk2077/mods/19747) | **Essential** | Requires redscript (installed in Phase 3). 2,123 endorsements, v2.2. |
| 3 | **Night City Alive** | [nexusmods.com/cyberpunk2077/mods/10395](https://www.nexusmods.com/cyberpunk2077/mods/10395) | High | Ambient world events. 8,307 endorsements, v2.2 — one of the most endorsed Cyberpunk mods. |
| 4 | **Immersive Gigs** | [nexusmods.com/cyberpunk2077/mods/24604](https://www.nexusmods.com/cyberpunk2077/mods/24604) | High | Contact fixers manually for work. |
| 5 | **No More Duplicate NPCs** | [nexusmods.com/cyberpunk2077/mods/15585](https://www.nexusmods.com/cyberpunk2077/mods/15585) | High | Randomises NPC clothing. 2,396 endorsements. |
| 6 | **Equipment-EX** | [nexusmods.com/cyberpunk2077/mods/6945](https://www.nexusmods.com/cyberpunk2077/mods/6945) | High | Unlimited outfit slots. 45,789 endorsements — one of the top-rated CP2077 mods. |
| 7 | **Dark Future** | [nexusmods.com/cyberpunk2077/mods/16300](https://www.nexusmods.com/cyberpunk2077/mods/16300) | Medium | Survival needs. **Tune defaults immediately** in Mod Settings UI before playing. |
| 8 | **Wannabe Edgerunner** | [nexusmods.com/cyberpunk2077/mods/5646](https://www.nexusmods.com/cyberpunk2077/mods/5646) | Medium | Cyberpsychosis system. **Read config options first.** |
| 9 | **Night City Interactions** | [nexusmods.com/cyberpunk2077/mods/5519](https://www.nexusmods.com/cyberpunk2077/mods/5519) | Low | Sit, drink at bars. 14,567 endorsements. |
| 10 | **Realistic Map** | [nexusmods.com/cyberpunk2077/mods/17811](https://www.nexusmods.com/cyberpunk2077/mods/17811) | Low | High-res 2D map. Better indoor navigation. |

**Installation method:** Click **Mod manager download** on each Nexus page → Vortex handles everything automatically. No manual file copying needed.

**After each install:** Launch the game, press your CET hotkey, check the notifications bell in Vortex for red warnings. If something breaks, remove the last mod before adding the next.

---

### Phase 6 — Visual Mods (Optional — pick carefully)

Do not stack multiple reshades. Pick one and test it for a session before deciding.

| Mod | Nexus Link | Notes |
|---|---|---|
| **Nova LUT** ("Classic") | [nexusmods.com/cyberpunk2077/mods/1915](https://www.nexusmods.com/cyberpunk2077/mods/1915) | Removes the warm-yellow stock tint. Zero performance cost. Purists consider this controversial — try one session and revert if it feels wrong. |
| **HD Reworked Project** | [nexusmods.com/cyberpunk2077/mods/92](https://www.nexusmods.com/cyberpunk2077/mods/92) | Sharper textures. More performance cost than LUT. Compatible with Nova LUT but do not combine them blindly. |

If using both: test in order — Nova LUT first, then HD Reworked. Check the notifications bell in Vortex after each.

---

### Phase 7 — Final Checks Before Playing

1. **Check the notifications bell** (top right of Vortex, next to your profile). Any red or orange warnings must be resolved before launching.
2. **Check each mod's Nexus page** for patch 2.3/2.31 compatibility. The research guide identified this as an unresolved gap — some mods may have been broken by the vehicle customisation changes in patch 2.3.
3. **Run ConflictChecker** — a Vortex plugin that identifies conflicting load orders. Search for it on Nexus and install it to check your mod order before playing.
4. **Make your "master save"** immediately after The Heist, with 0 spent attribute points, before you do anything else. Store it externally. This is your replay starting point for future runs.

---

### Phase 8 — Romance Immersion Mods (Optional — fits the Psycho Merc persona)

These mods make romanced partners feel present in V's life between missions. They add dialogue and messages — no mechanical changes. Fits the persona if V has someone they care about while they're out burning Night City down.

| # | Mod | Nexus Link | What it does | Fit for Psycho Merc |
|---|---|---|---|---|
| 1 | **Romance Messages Extended — Panam** | [nexusmods.com/cyberpunk2077/mods/4228](https://www.nexusmods.com/cyberpunk2077/mods/4228) | Daily texts and voicemails from Panam after romance | High — Panam is the warmest romance; her messages land well against the merc lifestyle |
| 2 | **Romance Messages Extended — Judy** | [nexusmods.com/cyberpunk2077/mods/4465](https://www.nexusmods.com/cyberpunk2077/mods/4465) | Daily texts and voicemails from Judy after romance | Medium — works well if Judy is your V's type |
| 3 | **Romance Hangouts Enhanced** | [nexusmods.com/cyberpunk2077/mods/11590](https://www.nexusmods.com/cyberpunk2077/mods/11590) | Extended date activities and scenes with romanced partners | High — adds actual time-spent-with-partner content the base game lacks |
| 4 | **Romance Voicemail** | [nexusmods.com/cyberpunk2077/mods/26377](https://www.nexusmods.com/cyberpunk2077/mods/26377) | Immersive voicemails from romance partners (new, March 2026) | Check for compatibility with Messages Extended before installing both |

**Skip:** Romance Everyone (lets you romance every NPC — breaks tone), Non-Canon Romances Enhanced (adds romance options that don't exist in the story).

---

### Phase 9 — Nightlife Immersion Mods (Optional)

These mods let V actually inhabit Night City's social spaces — sit in bars, dance at clubs, interact with bartenders. They turn dead set dressing into usable locations and are a natural fit for the no-fast-travel, no-minimap, live-in-the-city playstyle.

| # | Mod | Nexus Link | What it does | Notes |
|---|---|---|---|---|
| 1 | **Dance Off** | [nexusmods.com/cyberpunk2077/mods/10615](https://www.nexusmods.com/cyberpunk2077/mods/10615) | Dance at clubs (Gomorrah, Atlantis, etc.) — 3,459 endorsements | One of the highest-endorsed gameplay mods. Dancing is actually fun. |
| 2 | **Interact with Lizzie's Bar** | [nexusmods.com/cyberpunk2077/mods/21842](https://www.nexusmods.com/cyberpunk2077/mods/21842) | Actually interact with Lizzie's, the iconic club from the Johnny Silverhand memories | Great for Nomad lifepath; ties to lore |
| 3 | **Immersive Bartenders** | [nexusmods.com/cyberpunk2077/mods/7203](https://www.nexusmods.com/cyberpunk2077/mods/7203) | Animated bartender interactions at bars citywide | |
| 4 | **Immersive Bartenders — Dogtown** | [nexusmods.com/cyberpunk2077/mods/10372](https://www.nexusmods.com/cyberpunk2077/mods/10372) | Same as above, for Phantom Liberty Dogtown locations | Required if you want bartender immersion in PL areas |
| 5 | **Gomorrah Night Club** | [nexusmods.com/cyberpunk2077/mods/23350](https://www.nexusmods.com/cyberpunk2077/mods/23350) | Expanded Gomorrah club interior and atmosphere | Pairs well with Dance Off |
| 6 | **45.2 Night Club Band** | [nexusmods.com/cyberpunk2077/mods/13526](https://www.nexusmods.com/cyberpunk2077/mods/13526) | Adds a live band radio station inside clubs (requires RadioExt) | Requires RadioExt framework — check mod page for dependencies |
| 7 | **Atlantis Club Expanded** | [nexusmods.com/cyberpunk2077/mods/19960](https://www.nexusmods.com/cyberpunk2077/mods/19960) | Expanded Atlantis club area and atmosphere | |
| 8 | **IZAKAYA — Bar and Street Food Location** | [nexusmods.com/cyberpunk2077/mods/16192](https://www.nexusmods.com/cyberpunk2077/mods/16192) | Adds a new Japanese izakaya bar location with food vendors | A quiet contrast to the loud clubs — good for the "let the city breathe" rule |
| 9 | **iMMERSIVE INTERACTION** | [nexusmods.com/cyberpunk2077/mods/15891](https://www.nexusmods.com/cyberpunk2077/mods/15891) | General immersive interaction improvements — adds contextual animations for world objects | General-purpose immersion boost |

**Installation order for nightlife mods:** Install Dance Off and Interact with Lizzie's Bar first — they are the highest impact. Add Immersive Bartenders + Dogtown add-on next. Then the club expansions as desired.

**Note on Night City Interactions (already in Phase 5):** The base Night City Interactions mod (mods/5519) already covers sitting at bars and drinking properly. The bartender mods above are a deeper layer on top of that.

---

### Phase 10 — Launch and Verify

From Vortex, use the **Launch Game with REDmods Enabled** button (set as primary in Phase 2d). Confirm:

- [ ] CET overlay opens with your chosen hotkey
- [ ] In-game settings menu has a Mod Settings / Native UI section
- [ ] LHUD minimap changes when you enter combat vs. exploration
- [ ] No crash on the title screen

If all good: start a new game, pick **Street Kid or Nomad** lifepath, and begin as **Sandevistan Katana — Psycho Merc**.

---

### Mods to Avoid

| Mod | Why |
|---|---|
| **Let There Be Flight** | Not updated since 2022. Broken on patch 2.0+. |
| **Enemies of Night City** (old version) | Can brick saves. New test version exists but is unverified. |
| **Outfit Unlocker** | Outdated post-2.0. |
| **Survival System** (original) | Superseded by Dark Future. |
| **Material and Texture Override** | Known crash source on current patch. |

---

### Troubleshooting Quick Reference

| Problem | Fix |
|---|---|
| CET overlay does not appear | Confirm Visual C++ Redistributable is installed. Check `<game>\bin\x64\plugins\cyber_engine_tweaks\cyber_engine_tweaks.log` for errors. Disable all overlay software. |
| Mod not appearing in game | Click **Deploy** (linked-chain icon) in Vortex. Confirm the mod is **Enabled**. Check Vortex notifications bell for red warnings. |
| Game crashes on launch | Remove mods one at a time until crash stops. Identify the culprit. Check the mod's Nexus page for known issues and patch compatibility. |
| REDmod toggle auto-enabled | Go to Vortex **Settings → V2077** and turn off "Automatic REDmod Conversion." Reinstall affected mods via **Ctrl+A → Reinstall** on the Mods page. |
| Vortex cannot detect game | Manually point to `bin\x64` subfolder, not the root Cyberpunk directory. |

Full troubleshooting: [wiki.redmodding.org](https://wiki.redmodding.org/cyberpunk-2077-modding/user-guide-troubleshooting)

---

## 8. Personalised Build Recommendation

*(Synthesised from ChatGPT Turn 2, calibrated against NotebookLM mechanical context)*

**Build: Sandevistan Katana — "Psycho Merc V"**

| Category | Choice | Notes |
|---|---|---|
| **Lifepath** | Street Kid or Nomad | Corpo conflicts with the impulsive persona |
| **Primary cyberware** | Sandevistan (slow-time) | Do not install a cyberdeck at all |
| **Stats focus** | Reflexes → Body → Cool | Intelligence: zero or minimal |
| **Primary weapon** | Katana (monowire as backup) | Mantis Blades as an alternative |
| **Secondary weapon** | Shotgun (loud, deliberate) | Contrasts the precision of the prior netrunner run |
| **No-hack rule** | No quickhacks, ever | The single hardest rule; also the most impactful |
| **Stealth** | Permitted for positioning only | Once spotted: commit to the fight, no reload |
| **Cyberware pace** | Delay legendary tier until Act 3 | Staying fragile keeps encounters meaningful |
| **Phantom Liberty pivot** | Transition to pistol precision in Dogtown | Mirrors the spy-thriller tone shift |

---

*Report generated: 2026-03-31*
