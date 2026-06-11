---
title: 'videocrawl'
---

# videocrawl — Automated Video Stream Crawler & Downloader

## Problem Statement

Manually checking video streaming sites for new content and downloading it is tedious, error-prone, and doesn't scale. There is no single tool that combines scheduled crawling of streaming sites, intelligent stream detection across multiple embedding layers, deduplicated downloads, and cross-platform support (Linux + Windows). Each streaming site has a different player, embed chain, and delivery protocol, making it hard to build a simple one-off scraper that works reliably over time.

The user wants to follow specific content on sites like `basketballreplays.net` (NBA full-game replays) and have new videos automatically detected and downloaded to a configurable local directory, without manual intervention.

## Solution

**videocrawl** is a Python CLI tool and optional daemon that:

1. Reads a YAML configuration file listing one or more sources (URLs, target directories, schedules)
2. For each source, attempts to discover and download the video stream using a three-tier strategy:
   - **Tier 1**: yt-dlp extractor — works for many common streaming platforms out of the box
   - **Tier 2**: Iframe embed extraction — follows embed chains to find the actual video host
   - **Tier 3**: Playwright browser automation — loads the page in a headless browser, intercepts network traffic for HLS/DASH manifests
3. Downloads the best-quality stream (auto-selected) to the configured target directory
4. Tracks what has been downloaded in a flat-file archive (JSON), skipping already-downloaded content
5. Runs in two modes:
   - **CLI mode**: one-off run for a specific source or all sources
   - **Daemon mode**: long-running background process with a built-in scheduler and a lightweight HTTP health/status endpoint

## User Stories

1. As a user, I want to configure one or more streaming pages as sources in a YAML config file, so that I can define which content to follow.
2. As a user, I want each source to have a configurable target download directory, so that downloads are organized where I want them.
3. As a user, I want each source to have an optional schedule (e.g., every 6 hours), so that crawling happens automatically without my intervention.
4. As a user, I want to run `videocrawl run` to check all sources once and download any new content immediately.
5. As a user, I want to run `videocrawl run <source-name>` to check and download only a specific source.
6. As a user, I want to run `videocrawl daemon` to start the background scheduler process.
7. As a user, I want `videocrawl list` to show all configured sources, their schedules, and when they were last checked.
8. As a user, I want `videocrawl status` to show the daemon's current state: running/idle, last run times, recent downloads.
9. As a user, I want the tool to automatically detect the video stream from a source URL using the most appropriate method (yt-dlp first, iframe extraction second, browser automation last).
10. As a user, I want the tool to always download the best available quality of the stream.
11. As a user, I want downloaded content to be tracked so that the same video is never downloaded twice.
12. As a user, I want the archive to be a simple JSON file, so that I can inspect or manually edit it if needed.
13. As a user, I want the tool to work on both Linux and Windows, so that I can run it on my home server or desktop.
14. As a user, I want the daemon to expose a simple HTTP health endpoint (e.g., `GET /health` returning JSON), so that I can monitor it with Uptime Kuma, Home Assistant, or similar.
15. As a user, I want meaningful log output (structured, to file and stdout) so that I can diagnose failures.
16. As a user, I want the tool to handle network errors gracefully: retry on transient failures, report permanent failures clearly.
17. As a user, I want the tool to detect when a video is still live/in-progress (e.g., a game that hasn't finished yet) and skip it until the next run.
18. As a user, I want source pages that have multiple videos (e.g., a playlist) to download all new videos, not just the primary one.
19. As a user, I want per-source config options to limit how deep the crawler follows links (e.g., only the current page, or follow "next game" links).
20. As a user, I want `videocrawl --version` to print the current version.
21. As a user, I want `videocrawl --help` to print usage information for all subcommands.

## Implementation Decisions

### Language & Runtime
- **Python 3.11+** for native yt-dlp integration, rich ecosystem, and cross-platform support via pyinstaller or pipx.

### Modules

1. **Config Module** — Loads, validates, and provides typed access to the YAML configuration.
   - Interface: `load_config(path: Path) -> Config`
   - `Config.sources: List[SourceConfig]`
   - `Config.global: GlobalConfig` (archive path, log level, daemon port)
   - Validation on load with clear error messages for missing or malformed fields.

2. **Source Registry** — In-memory representation of all configured sources after config load.
   - Interface: built from `Config`, not a separate public module.
   - Each `SourceConfig` has: name, url, target_dir, schedule_interval (optional), crawl_depth (optional).

3. **Extractor Pipeline** — Three-tier stream discovery strategy with automatic fallback.
   - Interface: `Extractor.extract(url: str) -> Optional[StreamResult]`
   - `StreamResult` contains: manifest_url, stream_format (hls/dash), title, duration, metadata dict.
   - **Tier 1 (yt-dlp)**: Runs yt-dlp info extraction on the URL. Returns stream info if yt-dlp recognizes the site.
   - **Tier 2 (iframe)**: Parses the page HTML for iframe/video tags, follows embed chains recursively up to a configurable depth, detecting manifest URLs at each level.
   - **Tier 3 (Playwright)**: Launches headless Chromium, navigates to the URL, intercepts network requests for `.m3u8` and `.mpd` patterns, captures the manifest URL.
   - Each tier is a separate class implementing a common `ExtractionStrategy` protocol for testability.

4. **Download Manager** — Handles stream download using ffmpeg or yt-dlp as the download backend.
   - Interface: `download(stream: StreamResult, target_path: Path) -> DownloadResult`
   - `DownloadResult` contains: success, file_path, file_size, duration, format, checksum.
   - Always selects the best quality stream (highest resolution/bitrate).
   - Handles temporary files, resume on interrupt, cleanup on failure.
   - Uses subprocess calls to yt-dlp (or ffmpeg for raw manifest URLs).

5. **Archive Tracker** — Deduplication and history tracking via flat JSON file.
   - Interface:
     - `is_downloaded(source_name: str, content_id: str) -> bool`
     - `mark_downloaded(source_name: str, content_id: str, metadata: dict)`
     - `get_downloads(source_name: str) -> List[DownloadRecord]`
     - `get_all_downloads() -> Dict[str, List[DownloadRecord]]`
   - `content_id` is derived from the stream title or a content hash from the manifest.
   - JSON file is atomically written (write to temp, rename) to prevent corruption.

6. **Scheduler** — Internal scheduler for daemon mode.
   - Interface: `Scheduler(config: Config)`
   - Methods: `start()`, `stop()`, `run_once(source_name: str)`
   - Uses `apscheduler` or a simple `asyncio`-based loop with configurable intervals.
   - Runs each source on its configured schedule; sources without a schedule are skipped in daemon mode.
   - Thread-safe status access for the HTTP endpoint.

7. **CLI** — Entry point using `click` or `argparse`.
   - Subcommands:
     - `run [source-name]` — on-demand crawl and download
     - `daemon` — start background scheduler + HTTP status server
     - `list` — list configured sources
     - `status` — show daemon status (if running) and archive summary
     - `--version` — print version
   - Config path via `--config` flag with fallback to `./videocrawl.yaml` and `~/.config/videocrawl/config.yaml`.

8. **HTTP Server** — Lightweight health/status server for daemon mode.
   - Interface: started on a configurable port (default 8721).
   - Endpoints:
     - `GET /health` — returns `{"status": "ok", "uptime": "..."}`
     - `GET /status` — returns detailed status with sources, last runs, recent downloads
     - `GET /status/<source-name>` — status for a specific source
   - Implemented with a minimal HTTP server (standard library `http.server` or aiohttp) — no heavy framework dependency.

9. **Logger** — Structured logging to file and stdout.
   - Configurable log level per-source or globally.
   - Log file path configurable (default: `./videocrawl.log` or platform-appropriate location).

### Configuration Format (YAML)

```yaml
global:
  archive_path: ~/.local/share/videocrawl/archive.json
  log_level: info
  log_file: ~/.local/share/videocrawl/videocrawl.log
  daemon_port: 8721

sources:
  - name: spurs-knicks-replays
    url: https://basketballreplays.net/san-antonio-spurs-new-york-knicks-8-june-2026-nba-playoffs-full-game-replay
    target_dir: ~/Videos/NBA/2026-Playoffs/Spurs-vs-Knicks
    schedule: every 6 hours
    crawl_depth: 0

  - name: nba-playoff-replays
    url: https://basketballreplays.net/nba-2025-26
    target_dir: ~/Videos/NBA/2026-Playoffs
    schedule: every 12 hours
    crawl_depth: 1
```

### Cross-Platform Strategy
- All dependencies must be cross-platform (Windows + Linux).
- File paths use `pathlib` throughout for OS-agnostic path handling.
- Platform-appropriate default config and data directories via `platformdirs` or manual XDG/APPDATA detection.
- Playwright browser installation handled via `playwright install chromium` (works on both platforms).
- ffmpeg required as an external dependency (documented in README; Windows users can use `winget` or manual install).
- Testing on both platforms via CI matrix.

## Testing Decisions

### Testing Philosophy
- Tests should validate external behavior (what goes in, what comes out), not internal implementation details.
- External dependencies (yt-dlp, Playwright, network) should be mocked or used in integration test suites with fixture data.
- The extractor pipeline's fallback logic is the highest-value testing target.

### Modules to Test
1. **Config Module** — Full coverage: valid config, missing fields, bad types, file not found. Prior art: existing TypeScript tests in `libs/fea-lib/*/__tests__/`.
2. **Archive Tracker** — Full coverage: mark, check, dedup, concurrent writes, corrupted file recovery. Easy to unit test against temp files.
3. **Extractor Pipeline** — Unit test each strategy in isolation with mock/fixture responses. Integration test the pipeline fallback logic with controlled mocks.
4. **Download Manager** — Unit test with fake stream results; integration test with a known-good test stream (e.g., a public DASH test manifest).
5. **CLI** — Snapshot/approval tests for output; functional tests for each subcommand exit codes.
6. **Scheduler** — Unit test scheduling logic with mock sources and a mock clock.

### Prior Art
The project uses **vitest** for TypeScript tests in `libs/fea-lib/`. For this Python project, **pytest** is the appropriate equivalent. Tests should follow similar patterns: one test file per module, descriptive test function names, assertions against return values rather than internal state.

## Out of Scope

- **DRM circumvention**: Widevine, PlayReady, or other DRM-protected streams are explicitly out of scope.
- **YouTube channel downloading**: yt-dlp already handles this well; videocrawl focuses on non-YouTube streaming sites.
- **GUI**: No graphical interface. CLI and daemon only.
- **Authentication**: No built-in login/oauth support per-source. If a site requires login, the user is expected to provide a cookie file or session token via config (future enhancement).
- **Transcoding**: No re-encoding or format conversion. Downloads are stored in the original stream format.
- **Cloud storage upload**: No built-in upload to S3, Google Drive, etc. The tool downloads to local disk only.
- **Notification systems**: No email, Slack, Discord, or push notification integration (though adding a post-download hook script is a possible future enhancement).

## Further Notes

- The tool's name **videocrawl** is intentionally generic. It is pronounced "video-crawl."
- The three-tier extraction strategy is inspired by how yt-dlp itself works but extends it with browser automation for sites yt-dlp doesn't cover.
- **basketballreplays.net** is the primary target for initial development. The site embeds third-party video iframes, making it an ideal test case for the iframe-extraction tier.
- The yt-dlp fallback to iframe extraction to Playwright pipeline means that as yt-dlp's coverage grows over time, videocrawl automatically becomes more capable without code changes.
- ffmpeg is a required system dependency (documented in README). yt-dlp is bundled as a Python dependency.
- The daemon HTTP endpoint intentionally uses no auth — it binds to localhost only and exposes read-only status information.

## Implementation Plan

> Source PRD: `docs/tools/videocrawl.md`

### Architectural Decisions

Durable decisions that apply across all phases:

- **Language**: Python 3.11+
- **CLI framework**: Click (argparse fallback if Click overhead is unwanted)
- **Config format**: YAML via `pyyaml` or `ruamel.yaml`
- **Archive format**: JSON file with atomic writes (write to temp, rename)
- **Extractor pipeline**: Chain-of-responsibility pattern — 3 strategy classes share a common `ExtractionStrategy` protocol
- **Download backend**: Subprocess calls to yt-dlp (bundled Python package) or ffmpeg (system dependency)
- **Daemon HTTP**: Minimal server from stdlib (`http.server`) — no framework dependency
- **Scheduler**: `apscheduler` or simple `asyncio` loop
- **Testing**: pytest, pytest-mock for unit tests
- **Project layout**: Flat `src/videocrawl/` package with CLI entry point via `pyproject.toml` (`[project.scripts]`)

---

### Phase 1: Project scaffold, config, archive, `list` subcommand

**User stories**: 1, 2, 12, 20, 21

#### What to build

Set up the Python project with `pyproject.toml`, a `src/videocrawl/` package, and a Click-based CLI skeleton. Build the Config module (load and validate YAML), the Archive Tracker (read/write JSON archive with atomic writes), and the `list` subcommand that prints configured sources from the config file.

This phase has no network or download functionality — it validates the project structure, config parsing, and archive persistence end-to-end.

#### Acceptance criteria

- [ ] `videocrawl --help` and `videocrawl --version` work
- [ ] `videocrawl list` reads a YAML config and displays all sources with their target dir, schedule, and crawl depth
- [ ] An invalid/missing config file produces a clear error message
- [ ] Archive JSON file is created on first write; subsequent writes are atomic (temp + rename)
- [ ] Config module validates required fields and reports missing ones by name
- [ ] Tests pass for config loading (valid, missing fields, file not found) and archive tracker (mark, check, dedup, atomic write)

---

### Phase 2: yt-dlp extraction + download, `run` subcommand

**User stories**: 3, 4, 5, 9 (Tier 1 only), 10, 11, 16

#### What to build

Implement Tier 1 of the extractor pipeline (yt-dlp), the Download Manager, and the `run` subcommand. When `videocrawl run` executes against a source URL, it queries yt-dlp for stream info, selects the best quality, downloads the stream to the target directory, and records it in the archive. Already-downloaded content is skipped. Network errors trigger a retry (configurable count).

No iframe extraction or browser automation yet — this phase only works for sites yt-dlp supports natively.

#### Acceptance criteria

- [ ] `videocrawl run` iterates all sources, runs yt-dlp extraction, downloads new content, skips duplicates
- [ ] `videocrawl run <source-name>` runs only the named source
- [ ] Download succeeds to the configured target_dir; files are named based on stream title
- [ ] Archive is updated after each successful download
- [ ] Re-running immediately skips all already-downloaded content
- [ ] Transient errors (network timeout, HTTP 5xx) are retried up to 3 times
- [ ] Permanent errors (invalid URL, 404) are reported and skipped
- [ ] Tests pass for yt-dlp extractor (mocked), download manager (mocked), and archive integration (end-to-end with mock)

---

### Phase 3: Iframe embed extraction (Tier 2)

**User stories**: 9 (Tier 2), 18 (partial)

#### What to build

Implement Tier 2 of the extractor pipeline: parse the source page HTML for `<iframe>` and `<video>` tags, recursively follow embed chains up to the configured `crawl_depth`, and detect HLS/DASH manifest URLs at each level. This handles sites like basketballreplays.net that embed third-party video players.

When yt-dlp fails for a source (Tier 1 returns nothing), the pipeline automatically falls through to Tier 2 (iframe). This is transparent to the user — no config change needed.

#### Acceptance criteria

- [ ] A source page with a direct iframe embed (one level) is successfully extracted
- [ ] A source page with nested embeds (iframe within iframe) up to `crawl_depth` is successfully extracted
- [ ] `crawl_depth: 0` disables embed following (only checks the original page)
- [ ] The pipeline correctly falls through Tier 1 → Tier 2 when yt-dlp returns nothing
- [ ] Detected manifest URLs are returned as `StreamResult` and passed to the Download Manager
- [ ] Tests pass with fixture HTML files for single embed, nested embed, and no-embed pages

---

### Phase 4: Playwright browser automation (Tier 3)

**User stories**: 9 (Tier 3), 17

#### What to build

Implement Tier 3 of the extractor pipeline: launch headless Chromium via Playwright, navigate to the URL, intercept network requests for `.m3u8` and `.mpd` patterns, and capture the manifest URL. This catches sites that load video manifests dynamically via JavaScript, beyond what static HTML parsing can find.

Also implement live-stream detection: if the manifest indicates a live/in-progress stream (no end time, infinite playlist), skip it and log a warning rather than attempting a download.

The pipeline order is yt-dlp → iframe → Playwright, with automatic fallthrough if earlier tiers fail.

#### Acceptance criteria

- [ ] A page that loads a video manifest via JavaScript is successfully extracted by Playwright
- [ ] Playwright is only launched when Tiers 1 and 2 both fail (not on every run)
- [ ] The extracted manifest URL is returned as `StreamResult` and passed to the Download Manager
- [ ] Live/in-progress streams are detected and skipped with a logged warning
- [ ] Playwright browser launch is configurable (headless mode, timeout) via global config
- [ ] Tests pass with a controlled test server serving a mock page with JS-loaded manifests
- [ ] Test that pipeline correctly falls through Tier 1 → Tier 2 → Tier 3 when all prior tiers fail

---

### Phase 5: Daemon mode + scheduler + HTTP status

**User stories**: 6, 7, 8, 14, 15

#### What to build

Implement the Scheduler module and the `daemon` subcommand. In daemon mode, videocrawl runs each source on its configured schedule. A lightweight HTTP server on localhost exposes health and status endpoints. Sources without a schedule are skipped in daemon mode (they're on-demand only).

The `status` subcommand connects to the daemon's HTTP endpoint (or reads the archive directly if the daemon isn't running) and prints status information.

Structured logging is implemented across all modules (log to file and stdout, configurable level).

#### Acceptance criteria

- [ ] `videocrawl daemon` starts the scheduler and HTTP server; daemon logs its PID and startup info
- [ ] Sources with a schedule (e.g., `every 6 hours`) are run at their configured interval
- [ ] Sources without a schedule are skipped in daemon mode
- [ ] `GET /health` returns `{"status": "ok", "uptime": "..."}`
- [ ] `GET /status` returns per-source status (last check, last download, next run, error count)
- [ ] `GET /status/<source-name>` returns status for a specific source
- [ ] `videocrawl status` prints daemon status and summary of the archive
- [ ] `videocrawl daemon` handles SIGTERM/SIGINT gracefully (finish in-progress download, save state, exit)
- [ ] Logs are written to file and stdout at the configured level
- [ ] Tests pass for scheduler logic (mock clock, mock sources) and HTTP endpoints

---

### Phase 6: Playlist support, crawl depth, polish

**User stories**: 18 (full), 19, 16 (retry refinement)

#### What to build

Add playlist/multi-video support: when a page contains multiple videos (or a page at `crawl_depth > 0` links to sub-pages with videos), all are discovered and downloaded. Per-source config controls how deep the crawler follows links.

Refine error handling with exponential backoff for retries. Polish logging output. Ensure `--version` and `--help` are working correctly. End-to-end testing on a real site (basketballreplays.net) to validate the full pipeline.

#### Acceptance criteria

- [ ] A source page listing multiple game links (e.g., `/nba-2025-26`) with `crawl_depth: 1` discovers all linked game pages and downloads their videos
- [ ] `crawl_depth: 0` only checks the configured page itself (no link following)
- [ ] Each discovered video is tracked individually in the archive (no duplicate downloads across runs)
- [ ] Retry uses exponential backoff (1s, 2s, 4s, …) up to the configured max retries
- [ ] End-to-end test against a real basketballreplays.net page produces a valid video file
- [ ] All existing tests still pass
- [ ] README documents installation, config format, dependencies (ffmpeg, Playwright browsers), and usage examples for both CLI and daemon modes
