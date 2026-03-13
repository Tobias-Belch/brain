---
title: "Streaming Wrapper Feasability"
---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [1. Research Question \& Scope](#1-research-question--scope)
- [2. Methodology](#2-methodology)
- [3. Key Findings](#3-key-findings)
  - [3.1 putlocker.best Technical Architecture](#31-putlockerbest-technical-architecture)
  - [3.2 Stream Extraction Feasibility](#32-stream-extraction-feasibility)
  - [3.3 The 3-Layer Piracy Site Architecture](#33-the-3-layer-piracy-site-architecture)
  - [3.4 Netflix, Disney+, and Amazon Prime Video APIs](#34-netflix-disney-and-amazon-prime-video-apis)
  - [3.5 Personal Tracking Feature Implementation](#35-personal-tracking-feature-implementation)
  - [3.6 Prior Art: vidsrc-api](#36-prior-art-vidsrc-api)
- [4. Source Inventory](#4-source-inventory)
- [5. Conflicts \& Open Questions](#5-conflicts--open-questions)
- [6. Blindspot / Gap Analysis](#6-blindspot--gap-analysis)
- [7. Recommended Next Steps](#7-recommended-next-steps)

---

## 1. Research Question & Scope

```
Research question:
  (a) Is it technically feasible to build a personal web app that wraps
      putlocker.best — extracting video streams for playback in a custom
      player and adding personal tracking features (watch progress,
      watchlists, continue-watching)?
  (b) Do Netflix, Disney+, or Amazon Prime Video offer any public or
      developer APIs for catalogue data, authentication, or playback?

Scope constraints:
  - Personal/hobbyist project context (not commercial deployment)
  - Focus on technical feasibility; legal risk noted but not the primary lens
  - No geographic restriction; English-language sources preferred
  - Research window: content through early 2026

Out of scope:
  - Commercial deployment or monetisation
  - Deep legal analysis (copyright/DMCA) — flagged but not researched thoroughly
  - Mobile native app wrappers
```

---

## 2. Methodology

- **Resource types consulted:** Web pages, JavaScript source files (live site), GitHub repositories, developer API documentation, Reddit threads, academic/trade articles (via NotebookLM deep research)
- **Search strategy:** Live reverse-engineering of `putlocker.best/watching/severance-tv-series-77419` player JS; targeted web fetches for Netflix/Disney+/Prime developer portals; TMDB and Trakt API documentation; 71 sources imported into NotebookLM notebook `5e28c69a-7361-4816-a505-dc7d48500a4d` via `notebooklm source add-research --mode deep`
- **Depth:** Primary sources (live JS, official docs) + approved secondary leads (Reddit practitioner threads, GitHub repos, trade press on anti-piracy)
- **Secondary sources approved by user:** Yes
- **Tools used:** WebFetch, Bash (live site requests), NotebookLM synthesis queries (themes, agreements/conflicts, evidence, applications, streaming platform APIs), NLM briefing doc generation

---

## 3. Key Findings

### 3.1 putlocker.best Technical Architecture

The player is controlled entirely by a single minified file (proxied path: `/js/player.movie.min.js`). Full reverse engineering confirmed the following [S1]:

**Two distinct playback pathways exist:**

**Pathway A — Server/Embed:**
1. `GET /ajax/movie/episode/servers/{movie_id}_{season}_full` — returns HTML fragment listing available servers and episode metadata, injected into `#list-eps`
2. `GET /ajax/movie/episode/server/sources/{movie_id}_{server_id}` — returns `{src: "url"}` pointing to a third-party embed (VidCloud, Channel, etc.)
3. The embed URL is set as `#iframe-embed.src`; communication back to the parent page uses `postMessage`

**Pathway B — Direct Play (JW Player):**
1. `GET /ajax/movie_token?eid={eid}&mid={mid}` — returns *executable JavaScript* (not JSON); loaded via `$.getScript()`, which sets `window._x` and `window._y` as globals client-side
2. `GET /ajax/movie_sources/{eid}?x={_x}&y={_y}` — returns either `{embed:"url"}` (another iframe embed) or `{playlist:[...]}` (a JW Player playlist array with direct `.m3u8` segment URLs)

**Key authentication detail:** The token endpoint deliberately returns JS, not data. This means the auth tokens **cannot be obtained without executing JavaScript**. Plain HTTP scrapers fail here [S1][S2].

**Other confirmed endpoints:**

| Endpoint | Purpose |
|---|---|
| `GET /ajax/movie/e/seasons/{id}` | Season list |
| `GET /ajax/continue_watch` | Server-side continue-watching |
| `POST /ajax/movie_view` | Track view (10-min cookie dedup) |

**localStorage schema:** Continue-watching stored under `_watching.{movie_id}` as RC4-encrypted JSON. Encryption key: `vI8auolS4a2F3Xv@` [S1].

**Sample data (Severance):** Movie ID `77419`, type `2` (TV), server IDs `[8, 7, 10]`, default embed server `14`, 10 episodes, JW Player v7.10.2, image CDN `images.hdmz.co`.

---

### 3.2 Stream Extraction Feasibility

**Verdict: Technically feasible, but requires a headless browser with stealth capabilities.** [S1][S2][S3][S4]

The core obstacle is the JS-executed token flow (Pathway B). A plain `fetch`/`axios`/`requests` scraper cannot obtain `_x`/`_y`. A full browser runtime is required.

**Recommended toolchain (2025–2026):**

| Tool | Role | Status |
|---|---|---|
| `Nodriver` | Headless Chrome via CDP, native stealth | Active ✓ |
| `Camoufox` | Firefox-based anti-detect browser | Active ✓ |
| `SeleniumBase UC Mode` | Stealth + built-in CAPTCHA helpers | Active ✓ |
| `puppeteer-extra-stealth` | Legacy stealth | **Deprecated Feb 2025** ✗ |

**Stream extraction flow:**
1. Headless browser loads the watching page
2. Intercept XHR network traffic — specifically the `movie_sources` response — to capture `.m3u8` URL
3. Pass `.m3u8` URL + required `Referer` header to a custom HLS player (e.g., HLS.js, Video.js) or downloader (`yt-dlp`, `N_m3u8DL-RE`)

**Known failure modes:**
- Direct `.m3u8` URL copy without valid `Referer` → 403 (Referer checks enforced at CDN level) [S3][S5]
- Short-lived signed tokens → URL expires quickly; must be consumed near-immediately [S3]
- Cloudflare protection on the parent site → requires stealth browser; JA3 TLS fingerprint must match a real browser [S4]
- Cloudflare error 1010 (AutomationControlled flag detected) is the most common failure point [S4]

**Once the `.m3u8` is captured with correct headers:** `yt-dlp --add-headers "Referer:..."` or `N_m3u8DL-RE` can handle heavily protected HLS including AES-128 encrypted segments [S6].

---

### 3.3 The 3-Layer Piracy Site Architecture

Modern piracy sites operate as a layered ecosystem [S7][S8]:

```
[Indexing site (putlocker)] → [Cyberlocker embed (VidCloud, etc.)] → [Video hosting CDN]
```

- The indexing site holds no video files itself — it only links to embeds
- The embed iframes are served from separate domains (often with separate Cloudflare instances)
- Actual video segments sit on anonymous CDN nodes, often hosted via bulletproof providers in Romania (M247) or Netherlands (Cogent) [S8]
- **Implication:** Extracting a stream requires defeating Cloudflare on *both* the indexing site and the embed iframe

---

### 3.4 Netflix, Disney+, and Amazon Prime Video APIs

**All three major platforms have no public developer API for catalogue data, playback, or authentication.** [S9][S10][S11]

| Platform | API Status | Notes |
|---|---|---|
| **Netflix** | None — shut down public API in 2014 | No developer portal; no authentication API; no playback API |
| **Disney+** | None — no developer portal exists | Connection refused when portal URL accessed directly |
| **Amazon Prime Video** | None — Amazon Video Direct is a *distribution* program, not an API | No consumer-facing playback or catalogue API |

**Viable open alternatives for metadata/tracking:**

| Service | What it offers | Cost | Quality |
|---|---|---|---|
| **TMDB (The Movie Database)** | Full catalogue (movies + TV), cast, ratings, images, recommendations, watch provider data (which platform has what), user watchlists/favorites/ratings via OAuth | Free (generous rate limit) | High [S12] |
| **Trakt.tv** | Watch history tracking, ratings, lists, scrobbling, OAuth | Free tier + paid | Medium [S13] |
| **JustWatch (unofficial)** | Aggregates streaming availability across all platforms | Unofficial, undocumented | Low [S14] |
| **IMDb API** | Full IMDb data | Paid (AWS Data Exchange) | High |

**Recommendation:** TMDB fully replaces the need for a Netflix/Disney/Prime API for metadata purposes. Trakt.tv is the standard tool for the "personal tracking" use case [S12][S13].

---

### 3.5 Personal Tracking Feature Implementation

Since putlocker.best already exposes `/ajax/continue_watch` and localStorage-based progress (RC4-encoded), a wrapper app could:
- Intercept the `_watching.{movie_id}` localStorage writes and decode them (key known: `vI8auolS4a2F3Xv@`)
- Build a local database of watch progress, watchlists, ratings
- Augment with TMDB metadata for richer display (posters, descriptions, cast)
- Use Trakt.tv API to sync watch history to a portable format [S1][S12][S13]

---

### 3.6 Prior Art: vidsrc-api

An open-source project (`vidsrc-api` on GitHub) implements exactly this pattern — a FastAPI backend that scrapes streaming sites to produce clean video source URLs, consumed by a custom frontend [S15]. Demonstrates the pattern is achievable and has working precedent.

---

## 4. Source Inventory

| ID | Source | Type | Date | Quality | Notes |
|----|--------|------|------|---------|-------|
| S1 | putlocker.best `/js/player.movie.min.js` — live reverse engineering | Primary (direct observation) | 2026-03 | High — primary source, direct analysis of live production JS | All API endpoints, auth flow, localStorage schema |
| S2 | Reddit r/webscraping — "JS-executed token flows require browser" practitioner threads | Web (forum) | 2025–2026 | Medium — practitioner consensus, multiple corroborating posts | Confirms plain HTTP scrapers fail on `$.getScript()` auth patterns |
| S3 | CDN tokenization & signed URL documentation (Cloudflare, AWS CloudFront) | Web (official docs) | 2025 | High — official documentation | Explains Referer checks and short-lived token expiry |
| S4 | NLM Briefing Doc — Anti-Bot Detection and Mitigation (Cloudflare) | Synthesis | 2026-03 | High — synthesized from 71 sources via NotebookLM | Cloudflare error codes, Turnstile modes, JA3 fingerprinting |
| S5 | HLS Referer protection — practitioner blog posts and GitHub issues | Web (blog/forum) | 2024–2025 | Medium — corroborated across multiple sources | Referer enforcement at CDN causing 403 on raw URL copy |
| S6 | yt-dlp GitHub repo & documentation | Code repo (official) | 2025–2026 | High — primary source, actively maintained | `--add-headers` flag for Referer; HLS AES-128 support |
| S7 | NLM synthesis — piracy site architecture themes | Synthesis | 2026-03 | High — synthesized from 71 sources | 3-layer ecosystem (indexer → embed → CDN) confirmed |
| S8 | Irdeto / Digital TV Europe trade press — anti-piracy infrastructure reporting | Web (trade press) | 2024–2025 | Medium — credible trade press, some advocacy bias (vendor) | Bulletproof hosting geography, CDN leeching mechanism |
| S9 | Netflix developer blog / API deprecation notices | Web | 2014 (event), confirmed 2025 | High — official, widely corroborated | Netflix public API shut down 2014; no replacement |
| S10 | Disney+ developer portal direct fetch | Web (official, connection refused) | 2026-03 | High — primary access attempt | No developer portal exists |
| S11 | Amazon Video Direct documentation | Web (official) | 2025 | High — official documentation | Video Direct = distribution program, not consumer API |
| S12 | TMDB API documentation (`developer.themoviedb.org/reference`) | Web (official docs) | 2026-03 | High — official, comprehensive, active | Full catalogue, watch providers, user tracking via OAuth |
| S13 | Trakt.tv API documentation | Web (official docs) | 2025–2026 | High — official, actively maintained | Watch history, scrobbling, lists — standard in the space |
| S14 | JustWatch unofficial API (community-documented) | Web (community) | 2024–2025 | Low — unofficial, undocumented, may break | Streaming availability aggregation; use TMDB watch providers instead |
| S15 | `vidsrc-api` GitHub repository | Code repo | 2024–2025 | Medium — open source, working precedent, but unmaintained risk | FastAPI scraping pattern as prior art for this exact use case |

---

## 5. Conflicts & Open Questions

- **Conflict — embed vs. direct play reliability:** [S1] shows two pathways exist (embed iframe vs. JW Player playlist). It is unclear which pathway is more stable over time. The embed path bypasses the JS token problem but lands inside a third-party iframe with its own Cloudflare instance. The direct play path gives raw `.m3u8` URLs but requires the JS token flow. Neither path's reliability has been tested longitudinally.

- **Conflict — stealth tool viability:** [S2][S4] recommend `Nodriver` and `Camoufox` as current best-in-class stealth tools. However, this is a rapidly evolving arms race — Cloudflare has historically broken stealth tools within weeks of updates. No source confirmed these tools are *currently* passing Cloudflare on putlocker.best specifically.

- **Unresolved — embed iframe Cloudflare bypass:** Defeating the parent-site Cloudflare is only half the problem. The embed iframe (VidCloud etc.) is served from a separate domain, possibly with its own Cloudflare challenge. No source directly addresses this two-stage bypass requirement.

- **Unresolved — AES-128 key retrieval:** For encrypted HLS segments, the AES-128 key URI is in the `.m3u8` playlist. Whether that key endpoint enforces the same Referer/token checks as the segments is untested in this research.

- **Requires expertise:** Legal risk assessment (DMCA, ToS violations) was flagged as out of scope but is material for even personal deployment. Accessing and re-serving copyrighted streams without authorisation is illegal in most jurisdictions regardless of personal use framing.

---

## 6. Blindspot / Gap Analysis

- [x] **Opposing view** — Covered: the NLM briefing doc and practitioner sources include failure modes and the arms-race argument. Anti-piracy vendors (Irdeto) provide the content-owner perspective.
- [ ] **Recency** — **Gap:** The specific embed providers used by putlocker.best (VidCloud, etc.) were not individually reverse-engineered. These change frequently and may have different protection profiles than the parent site. This is the most critical missing piece for a working implementation.
- [x] **Practitioner vs theoretical** — Covered: both official docs (TMDB, Trakt, yt-dlp) and practitioner Reddit/GitHub sources consulted.
- [ ] **Geographic / cultural variation** — **Minor gap:** Cloudflare Bot Management behaviour may differ by geography. Not researched. Likely low impact for a personal project.
- [x] **Adjacent domains** — Covered: prior art (`vidsrc-api`) from adjacent open-source scraper ecosystem surfaced.
- [x] **Negative results** — Covered: deprecated tools (`puppeteer-extra-stealth`) and known failure modes (plain HTTP, raw URL copy, JA3 mismatch) documented.
- [ ] **Stakeholder perspectives** — **Gap:** No perspective from putlocker.best operators (how they would respond to automated access) or from their embed providers. Site may rate-limit or block programmatic access patterns even without full bot detection.

**Critical gap:** The embed iframe layer (VidCloud and equivalents) was not reverse-engineered. In practice, getting through the parent site may only be step one — the embed may require a completely separate bypass strategy. This should be investigated before committing to the direct-play pathway.

---

## 7. Recommended Next Steps

1. **Test the direct-play pathway end-to-end first.** Use `Nodriver` or `Camoufox` to load a putlocker.best watching page, intercept the `movie_sources` XHR response, and verify you receive a `{playlist:[...]}` response with `.m3u8` URLs. This is the fastest way to validate whether the headless approach works in practice before building anything.

2. **Reverse-engineer the embed iframe separately.** If the direct-play pathway fails or is unreliable, open the embed URL (e.g., VidCloud) in a browser with DevTools, intercept its network traffic, and map its own source API. Many embed providers have their own documented or community-reversed APIs.

3. **Use TMDB as your metadata backbone, not any major platform API.** Register at `https://developer.themoviedb.org` — free, generous rate limits, and covers everything needed: posters, descriptions, cast, episode lists, watch availability across platforms, and user tracking via OAuth. No need to touch Netflix/Disney/Prime APIs (which don't exist publicly anyway).

4. **Use Trakt.tv for portable watch history.** Their developer API is the standard for personal watch tracking and gives you an exportable, platform-independent record. Pair with TMDB for enriched metadata display.

5. **Do not attempt to build a long-lived production scraper without addressing the embed layer.** The site's architecture (indexer → embed → CDN) means stream URLs are double-protected. A working personal tool needs to handle both layers, and the embed layer changes as providers rotate.

6. **Consult a lawyer before any deployment beyond your own machine.** Even for personal use, intercepting and re-serving DRM-free HLS streams from copyrighted content is legally risky in most jurisdictions. The technical feasibility established here does not imply legal clearance.

7. **Watch the `vidsrc-api` repo and similar projects** (`github.com/search?q=vidsrc+api`) for implementation patterns and to detect when specific provider integrations break. The open-source streaming-scraper community surfaces breakage quickly.

---

*Report generated: 2026-03-06*
*Research session depth: primary (live JS reverse engineering, official API docs) + approved secondary (practitioner forums, trade press, GitHub repos)*
*NotebookLM notebook: `5e28c69a-7361-4816-a505-dc7d48500a4d` | 72 sources*
