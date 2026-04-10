---
title: "Workspace Portal - PRD"
---

## Problem Statement

A developer works across many projects simultaneously from a single macOS machine. The machine is accessed remotely — exclusively via a web browser — from any device including mobile phones. Currently, OpenCode (an AI coding agent with a web UI) is started manually in a terminal and runs as a single persistent process scoped to the projects root directory (`~/workspaces`). This setup has three compounding problems:

1. **No remote lifecycle control.** Starting, stopping, and restarting OpenCode requires physical or SSH access to the machine. From a mobile browser — the primary access method — there is no way to restart the process. This matters because OpenCode caches per-project state (skills, LSP connections) on first access and only refreshes it on restart. Adding a new project-local skill requires a full process restart, which is impossible remotely.

2. **Wrong scope for OpenCode instances.** Running a single OpenCode instance from the projects root means all project sessions share one process. Per-project configuration (AGENTS.md, `.agents/skills/`) is resolved correctly via directory context, but the skill cache is warm from the first session and is never invalidated for new projects opened later. Per-project instances would start fresh with the correct skills every time.

3. **No remote VS Code access.** There is no way to open a browser-based VS Code session for a specific project directory from a mobile phone or another machine on the network. GitHub Codespaces and Gitpod solve this problem for cloud-hosted repos, but the developer works on local checkouts.

The developer needs a self-hosted, mobile-friendly portal that acts as a launcher and manager for per-directory OpenCode and VS Code sessions, accessible from any device.

---

## Solution

A self-hosted web portal called **workspace-portal** — a small Go HTTP server with an HTMX-driven UI — that:

- Presents an **interactive directory tree** rooted at a configurable workspaces directory, navigable from a mobile browser
- Allows launching **OpenCode** and **code-server (VS Code)** sessions for any directory, on demand
- Tracks running sessions and shows their status live (via SSE)
- Runs as a **launchd service** on macOS (always-on, survives terminal close, restarts on crash)
- Is **network-agnostic** — the portal binds to localhost and delegates exposure to whatever the user has configured (Tailscale serve, nginx, Cloudflare Tunnel, etc.)
- Ships as a **single static Go binary** and as a **Docker image** with zero runtime dependencies
- Is fully **configurable via `config.yaml`** for non-secret settings and a `.secrets/` directory (or `/run/secrets/` for Docker) for sensitive values
- Is **open source**, designed for others to self-host with their own paths and credentials supplied via config

---

## User Stories

### Directory Navigation

1. As a remote developer, I want to open the portal in a mobile browser and see a tree of my workspaces root directory, so that I can orient myself and find the project I want to work on.
2. As a remote developer, I want to tap a directory row to expand it and see its immediate children, so that I can navigate into nested project structures without loading the full tree.
3. As a remote developer, I want to collapse an expanded directory by tapping it again, so that I can keep the tree view uncluttered.
4. As a remote developer, I want directories that contain a git repo (`.git` dir, `.git` file for worktrees, or a `.bare` bare repo) to be visually distinguished from plain directories, so that I can tell at a glance which entries are version-controlled projects.
5. As a remote developer, I want build artifact directories (`node_modules`, `dist`, `.next`, `.turbo`, `target`, etc.) to be automatically hidden when I expand a directory, so that the tree stays navigable and doesn't show irrelevant internals.
6. As a remote developer, I want git internals (`.git/objects`, `.git/refs`, `.bare/objects`, `.bare/refs`, etc.) to be automatically hidden, so that expanding a directory never shows git plumbing noise.
7. As a remote developer, I want the portal to show every directory — including dotdirs, grouping dirs, and dirs without git — so that I can open any directory as a session context regardless of whether it is a recognised project type.
8. As a remote developer, I want to see the full relative path of each directory row, so that I always know where I am in the tree.
9. As a remote developer, I want the tree to expand lazily on demand (one level at a time, fetched from the server), so that the initial page load is fast even with a large workspaces root.

### Launching Sessions

10. As a remote developer, I want every directory row to show an "Open OpenCode" button, so that I can start an OpenCode session for that directory with one tap.
11. As a remote developer, I want every directory row to show an "Open VS Code" button, so that I can start a code-server session for that directory with one tap.
12. As a remote developer, I want the portal to assign an available port automatically when starting a session, so that I never have to manage port numbers manually.
13. As a remote developer, I want the portal to wait until a session is healthy (HTTP 200 from the process) before showing me the link to open it, so that I don't land on a "not ready" page.
14. As a remote developer, I want a loading indicator on the button while a session is starting, so that I know the action was registered and the process is launching.
15. As a remote developer, I want the "Open OpenCode" button to become a direct link to the session once it is running, so that tapping it again opens the session rather than starting a duplicate.
16. As a remote developer, I want the same de-duplication behaviour for "Open VS Code" — tapping when already running opens rather than spawning, so that I never accidentally run two sessions for the same directory.
17. As a remote developer, I want to open a session URL in a new browser tab, so that the portal remains open for managing other sessions.

### Session Management

18. As a remote developer, I want a "Running Sessions" section at the bottom of the portal showing all active sessions, so that I can see at a glance what is currently open.
19. As a remote developer, I want each running session entry to show its directory path, type (OpenCode or VS Code), port, and a direct link, so that I can reconnect to a session I already started.
20. As a remote developer, I want to stop any running session from the portal with one tap, so that I can free up resources or force a fresh restart.
21. As a remote developer, I want the running sessions list to update live via SSE without me refreshing the page, so that changes are reflected immediately across any device I have the portal open on.
22. As a remote developer, I want the portal to detect orphaned session entries (process died unexpectedly) on startup and remove them from state, so that the sessions list is always accurate.
23. As a remote developer, I want session state to persist across portal restarts (written to a state file), so that the portal recovers its view of what is running if it is restarted.
24. As a remote developer, I want to restart OpenCode for a specific directory by stopping and starting it from the portal, so that per-project skill caches are refreshed without needing SSH access.

### Tailscale Integration (Optional)

25. As a self-hoster with Tailscale, I want the portal to automatically register each new session with `tailscale serve` when a session starts, so that the session is accessible at an HTTPS URL on my tailnet without manual configuration.
26. As a self-hoster with Tailscale, I want the portal to deregister a session from `tailscale serve` when the session is stopped, so that stale routes do not accumulate.
27. As a self-hoster without Tailscale, I want to disable the Tailscale integration entirely via config, so that the portal works with any other reverse proxy setup (nginx, Caddy, Cloudflare Tunnel, WireGuard, etc.) without errors.
28. As a self-hoster, I want the portal itself to be served over Tailscale HTTPS when Tailscale integration is enabled, so that I can access it securely from any device on my tailnet without additional configuration.

### Configuration

29. As a self-hoster, I want all non-secret configuration to live in a `config.yaml` file, so that I can version-control a documented example and keep my actual config alongside it.
30. As a self-hoster, I want secrets (passwords, tokens) to live in a `.secrets/` directory as plain text files (one per secret), so that they are never accidentally committed and match the pattern I already use.
31. As a self-hoster running in Docker, I want secrets to be resolved from `/run/secrets/` automatically (Docker Swarm / K8s convention), so that the app works natively with Docker secrets without custom configuration.
32. As a self-hoster, I want environment variables to override any config file value, so that I can run the portal in Docker with `-e` flags and no mounted config file.
33. As a self-hoster, I want the config file path to be specifiable via a `--config` CLI flag or a `PORTAL_CONFIG` env var, so that I can run multiple portal instances with different configs on the same machine.
34. As a self-hoster, I want a fully-documented `config.example.yaml` committed to the repo, so that I know exactly what every option does and what its default value is.
35. As a self-hoster, I want the portal to validate config at startup and exit with a clear error message if required values are missing or invalid, so that misconfiguration is caught immediately.
36. As a self-hoster, I want the workspaces root, OpenCode binary path, code-server binary path, port ranges, and secrets directory to all be configurable, so that the portal is not tied to any specific machine layout.

### Deployment — macOS / launchd

37. As a macOS user, I want a launchd plist template and an install script included in the repo, so that I can set up the portal as an always-on background service with one command.
38. As a macOS user, I want the portal to start automatically on login via launchd, so that it is always available when the machine is on.
39. As a macOS user, I want launchd to restart the portal automatically if it crashes, so that a process failure does not leave me without access.
40. As a macOS user, I want stdout and stderr from the portal to be written to a log file, so that I can diagnose issues without attaching a terminal.

### Deployment — Docker

41. As a self-hoster using Docker, I want a published Docker image, so that I can run the portal without installing Go or compiling the binary.
42. As a self-hoster using Docker, I want to mount my workspaces directory into the container and configure it via env vars, so that the containerised portal has access to my local files.
43. As a self-hoster using Docker, I want the Docker image to be as small as possible (multi-stage build, scratch or Alpine base), so that it is fast to pull and uses minimal disk space.

### Open Source / Portability

44. As a new self-hoster cloning the repo, I want a clear README with step-by-step setup instructions for both native macOS and Docker deployments, so that I can be up and running in under 30 minutes.
45. As a new self-hoster, I want all machine-specific values (paths, hostnames, passwords) documented in `config.example.yaml` and `.secrets.example/`, so that I know exactly what to fill in for my own setup.
46. As a contributor, I want the Go codebase to use only one external dependency (`gopkg.in/yaml.v3`) and rely on the standard library for everything else, so that the dependency surface is minimal and auditable.

---

## Implementation Decisions

### Architecture

- The portal is a single Go binary exposing an HTTP server.
- UI is rendered server-side using Go `html/template`, progressively enhanced with HTMX (embedded static asset, no CDN). No JavaScript framework, no build step.
- Live session status updates use a single SSE endpoint (`GET /events`), consumed by HTMX's `hx-ext="sse"`.
- HTML fragments (tree rows, session list) are returned by handlers directly — no JSON API surface except the SSE stream.

### Modules

**`internal/config`**
Loads configuration from (in priority order): CLI flag `--config`, env var `PORTAL_CONFIG`, `./config.yaml`, `~/.config/workspace-portal/config.yaml`. Merges with env var overrides (`PORTAL_` prefix). Resolves secrets from env var → `{secrets_dir}/{name}` → `/run/secrets/{name}`. Exposes a single `Config` struct. Validates required fields at startup.

**`internal/fs`**
Provides `List(path string) ([]DirEntry, error)` — reads immediate children of a directory, prunes known build/git-internal dirs, annotates each entry with `IsGit` (has `.git` dir, `.git` file, or `.bare/HEAD`) and `HasChildren` (has non-pruned subdirs). Pruned dir names are a hardcoded default set, additive with `config.fs.prune_dirs`. Does not recurse — the tree is navigated lazily by the browser.

**`internal/session/manager`**
Maintains in-memory session state, persisted to a JSON state file on every mutation. Assigns ports from configured ranges (OpenCode range, VS Code range) by scanning for the first port not in use (checked via `net.Listen`). On startup, reads the state file and validates each entry by checking the process PID; removes orphans. Exposes: `Start(type, dir) (Session, error)`, `Stop(id) error`, `List() []Session`, `Get(id) (Session, bool)`.

**`internal/session/oc`**
Implements the OpenCode process lifecycle: spawn `opencode web --port {port} {extra_flags}` in the target directory, health-check by polling `http://localhost:{port}` until 200 or timeout, kill on stop. Returns a `Runner` interface consumed by the session manager.

**`internal/session/vscode`**
Implements the code-server process lifecycle: spawn `code-server --bind-addr 127.0.0.1:{port} {dir}` with `PASSWORD` env var, health-check, kill on stop. Returns a `Runner` interface.

**`internal/tailscale`**
Optional integration, implemented in Course 07. Gated by `config.tailscale.enabled`. Exposes `Register(port int) (url string, error)` and `Deregister(port int) error`. Shells out to the `tailscale` binary. If disabled, `Register` is a no-op returning an empty URL. The session manager calls these hooks around `Runner.Start/Stop` — it does not know whether Tailscale is enabled.

**`internal/server`**
Sets up the HTTP mux, registers all routes, serves embedded static assets and templates. Handlers return HTML fragments (HTMX targets) or full pages. Routes:

| Method | Path | Description |
|---|---|---|
| GET | `/` | Full page — layout + initial tree root + sessions list |
| GET | `/fs/list` | HTML fragment — dir children (`?path=`) |
| GET | `/sessions` | HTML fragment — running sessions list |
| POST | `/sessions/start` | Start session (`type`, `dir` form values); returns updated sessions fragment |
| POST | `/sessions/stop` | Stop session (`id` form value); returns updated sessions fragment |
| GET | `/events` | SSE stream — `session.started`, `session.stopped`, `session.healthy` events |

**`templates/`**
Go HTML templates: `layout.html` (full page shell), `tree-row.html` (single dir entry with expand/collapse and action buttons), `sessions.html` (running sessions list), `session-row.html` (single session entry). All embedded via `go:embed`.

**`static/`**
Contains `htmx.min.js` only. Embedded via `go:embed`. No other static assets; all styling is inline or via a minimal `<style>` block in `layout.html`.

**`deploy/launchd/`**
`com.workspace-portal.plist.tmpl` — launchd plist template with placeholders for binary path, config path, log path. `install.sh` — substitutes values, writes to `~/Library/LaunchAgents/`, runs `launchctl bootstrap`.

**`deploy/docker/Dockerfile`**
Multi-stage: `golang:alpine` build stage → `alpine:latest` runtime stage. Copies binary only. Exposes port 3000. Entrypoint: `workspace-portal`.

### Config schema (`config.yaml`)

```
workspaces_root     string    (required)
portal_port         int       (default: 3000)
secrets_dir         string    (default: .secrets, relative to config file)
oc.binary           string    (default: opencode)
oc.port_range       [int,int] (default: [4100, 4199])
oc.flags            []string  (default: ["web", "--mdns"])
vscode.binary       string    (default: code-server)
vscode.port_range   [int,int] (default: [4200, 4299])
fs.prune_dirs       []string  (default: [])
```

Tailscale config (`tailscale.enabled`, `tailscale.binary`) is added in Course 07.

Env var override format: `PORTAL_{SECTION}_{KEY}` (e.g. `PORTAL_OC_PORT_RANGE=4100-4199`).

### Secrets

- `vscode-password` → used as `PASSWORD` env var for code-server
- Additional secrets (e.g. OpenCode server password) added to `.secrets/` and wired via config as needed

### Session state file

Written to `~/.local/share/workspace-portal/sessions.json` (XDG-compliant). Contains an array of `Session` objects. Read on startup for orphan detection.

### Port assignment

Scan the configured range sequentially. For each candidate port: check it is not already in the in-memory session list, then attempt `net.Listen("tcp", "127.0.0.1:{port}")` — if it succeeds the port is free. Return the first free port or error if the range is exhausted.

### Process health check

Poll `http://localhost:{port}/` with a 1-second interval and a 30-second total timeout. A 200 response (or any non-connection-refused response) is considered healthy. If the timeout is reached, the session is marked failed and the process is killed.

### SSE event format

```
event: session.started
data: {"id":"...","type":"opencode","dir":"...","port":4101}

event: session.healthy
data: {"id":"...","url":"https://..."}

event: session.stopped
data: {"id":"..."}
```

---

## Testing Decisions

A good test verifies **external behaviour through the module's public interface**, not implementation details. Tests should not assert on internal state, private functions, or specific log output. They should be fast, deterministic, and not depend on external processes being installed.

### Modules to test

**`internal/config`**
Test that the config struct is correctly populated from: a YAML file only; env vars only; env vars overriding YAML; missing required fields producing an error; secrets resolved from `.secrets/` dir; secrets resolved from `/run/secrets/` fallback; secrets resolved from env var override.

**`internal/fs`**
Test `List()` with a temporary directory tree: default prune list hides `node_modules`, `dist`, `.git` internals; custom prune list from config is applied additively; `IsGit` is true for a dir with a `.git` directory, a `.git` file, and a `.bare/HEAD`; `HasChildren` is false for a leaf dir and true for a dir with non-pruned children.

**`internal/session/manager`**
Test port assignment: returns first free port in range; skips ports already in session list; skips ports in use by `net.Listen`; errors when range is exhausted. Test orphan detection: a session with a dead PID is removed on startup load. Test state persistence: `Start` and `Stop` write to the state file; a new manager instance reads the same state.

**`internal/server` (integration)**
Test HTTP handlers with an `httptest.Server`: `GET /` returns 200 and contains expected HTML landmarks; `GET /fs/list?path=` returns an HTML fragment with dir entries; `POST /sessions/start` with a mocked session manager returns the updated sessions fragment; `POST /sessions/stop` calls `manager.Stop`; `GET /events` returns `Content-Type: text/event-stream`.

The session manager is injected as an interface in all server tests so OpenCode and code-server processes are never actually spawned.

---

## Centralised Documentation Viewer

### Problem

Documentation for projects in the workspaces root is scattered across individual `README.md`, `docs/` subdirectories, ADRs, and `.mdx` files. There is no way to browse all documentation in one place from a mobile browser without navigating the file tree manually and opening individual files as raw Markdown.

### Solution

A documentation viewer integrated into the portal at `GET /docs/**`. The viewer is powered by **Astro Starlight** — a full-featured documentation site framework with sidebar navigation, search, syntax highlighting, and full MDX component rendering. The Astro dev server runs as a child process managed by the portal (using the same `Runner` pattern as OpenCode and code-server). It watches the `docs_root` directory for changes to `.md` and `.mdx` files and hot-reloads without a manual rebuild. The portal proxies all `/docs/**` traffic to it.

---

### User Stories — Documentation Viewer

47. As a remote developer, I want to open `/docs` in my browser and see a sidebar listing all `.md` and `.mdx` files found under my workspaces root, so that I can browse all project documentation in one place.
48. As a remote developer, I want gitignored files and directories to be excluded from the documentation tree, so that generated files, `node_modules`, and other non-documentation content do not appear.
49. As a remote developer, I want to click any file in the sidebar and see it rendered as a styled HTML page — including MDX components — so that documentation is readable and well-formatted rather than shown as raw Markdown.
50. As a remote developer, I want the documentation to update automatically when I edit a `.md` or `.mdx` file, without manually triggering a rebuild, so that my changes are visible immediately.
51. As a remote developer, I want to use the Starlight search bar to find content across all documentation files, so that I can locate information without knowing which file contains it.
52. As a remote developer, I want the documentation viewer to be accessible at `/docs` within the portal, so that I can reach it from any device without knowing which port the Astro server is running on.
53. As a self-hoster, I want to disable the documentation viewer entirely via config, so that the portal starts faster and does not require Node.js if I do not need the feature.
54. As a self-hoster, I want to configure the root directory that is scanned for documentation files, so that I can point the viewer at a different directory than the workspaces root if needed.

---

### Implementation Decisions — Documentation Viewer

#### Architecture

The documentation viewer is not embedded in the Go binary. It is an **Astro Starlight project** living in the `docs/` subdirectory of the portal repo. At runtime, the portal spawns `astro dev` (or `astro preview` for production) as a child process. The Go server reverse-proxies `GET /docs/**` to the Astro process.

This architecture was chosen over alternatives for the following reasons:

- **Full MDX support**: Astro renders JSX components in `.mdx` files natively. A Go-based Markdown renderer (e.g. goldmark) would silently strip or mis-render MDX component blocks.
- **Live reload without rebuild**: `astro dev` watches the content directory and hot-reloads on file changes. Static embedding would require a rebuild step triggered manually.
- **Sidebar, search, syntax highlighting**: Starlight provides all of these out of the box. Implementing them from scratch in Go+HTMX would be a significant effort.
- **No static embed**: Embedding a pre-built `dist/` would make the docs stale on every file change. Runtime child process management is more appropriate.

#### `.gitignore` filtering

The Astro content collection is populated by a Node.js build-time helper script (`docs/scripts/collect-docs.js`) that:
1. Walks the `DOCS_ROOT` directory (set via env var, defaults to `workspaces_root`)
2. Loads every `.gitignore` file encountered (using the [`ignore`](https://www.npmjs.com/package/ignore) npm package, which implements the same algorithm as git)
3. Copies (or symlinks) non-ignored `.md` and `.mdx` files into `docs/src/content/docs/`, preserving the relative directory structure
4. Is re-run automatically by Astro's dev server file watcher via a custom integration

#### New module: `internal/docs`

**`internal/docs/runner.go`**

Implements the `Runner` interface (same as `internal/session/oc.go` and `internal/session/vscode.go`):

- Spawns `{node_binary} {astro_binary} dev --port {port} --host 127.0.0.1` in the `docs/` directory, with `DOCS_ROOT={docs_root}` env var set.
- Health-checks by polling `http://127.0.0.1:{port}/` until 200 or 30-second timeout.
- Kills the process on `Stop()`.
- Is started unconditionally on portal startup if `docs.enabled = true`.

The docs runner is not tracked in the session manager (it is not a user-initiated session). It is started by `main.go` directly and its lifecycle is tied to the portal process.

#### Reverse proxy

`internal/server/handlers.go` gains a `DocsHandler` that uses `httputil.NewSingleHostReverseProxy` to forward all traffic from `GET /docs/**` to `http://127.0.0.1:{docs.port}`. The proxy strips the `/docs` prefix before forwarding so Astro receives paths rooted at `/`.

A `<a href="/docs">Docs</a>` link is added to the portal's `layout.html` nav.

#### Config additions

```
docs.enabled        bool    (default: true)
docs.root           string  (default: same as workspaces_root)
docs.port           int     (default: 4300)
docs.node_binary    string  (default: node)
docs.astro_dir      string  (default: ./docs, relative to portal binary)
```

Env var overrides: `PORTAL_DOCS_ENABLED`, `PORTAL_DOCS_ROOT`, `PORTAL_DOCS_PORT`, `PORTAL_DOCS_NODE_BINARY`, `PORTAL_DOCS_ASTRO_DIR`.

#### Updated route table

| Method | Path | Description |
|---|---|---|
| GET | `/` | Full page — layout + initial tree root + sessions list |
| GET | `/fs/list` | HTML fragment — dir children (`?path=`) |
| GET | `/sessions` | HTML fragment — running sessions list |
| POST | `/sessions/start` | Start session (`type`, `dir` form values); returns updated sessions fragment |
| POST | `/sessions/stop` | Stop session (`id` form value); returns updated sessions fragment |
| GET | `/events` | SSE stream — `session.started`, `session.stopped`, `session.healthy` events |
| GET | `/docs/**` | Reverse proxy to Astro dev server |

#### `docs/` project structure

```
docs/
  package.json
  astro.config.mjs        ← Starlight config; content collection rooted at src/content/docs/
  tsconfig.json
  scripts/
    collect-docs.js       ← walks DOCS_ROOT, copies .md/.mdx respecting .gitignore
  src/
    content/
      docs/               ← populated by collect-docs.js at dev/build time
    assets/               ← Starlight logo, custom CSS
  public/
```

#### Docker changes

The `Dockerfile` gains a **Node.js runtime** in the final image (Alpine + Node), since `astro dev` must run at container startup. The multi-stage build becomes:

```
Stage 1 (node:alpine)   — npm ci in docs/
Stage 2 (golang:alpine) — go build
Stage 3 (node:alpine)   — copy Go binary + docs/ directory; entrypoint runs both
```

The `docker-compose.yml` sets `DOCS_ROOT` to the mounted workspaces directory.

#### `Makefile` targets

```makefile
docs-install:   cd docs && npm ci
docs-dev:       cd docs && npm run dev
build:          go build ./cmd/portal
dev:            make -j2 docs-dev go-dev   # parallel
```

---

## Out of Scope

- **Authentication / authorisation on the portal itself.** Network-level security (Tailscale, WireGuard, VPN) is the expected auth boundary. A portal password may be added in a future iteration.
- **Multi-machine support.** The portal manages processes on the machine it runs on only.
- **Session sharing / collaboration.** Sessions are single-user.
- **OpenCode session isolation** beyond process-per-directory. OpenCode's internal multi-session behaviour (multiple chat sessions within one OpenCode process) is not managed by the portal.
- **Automatic idle timeout / session garbage collection.** Sessions persist until explicitly stopped.
- **Browser-native terminal.** The portal does not embed a terminal emulator (ttyd, xterm.js, etc.).
- **Project creation or git operations.** The portal is read/launch only — it does not create directories, initialise repos, or run git commands.
- **Custom domain / TLS termination.** The portal binds to localhost; TLS is handled by whatever sits in front of it.
- **Windows support.** The portal targets macOS (launchd) and Linux (Docker / systemd). Windows/WSL is not a supported deployment target in v1.
- **openvscode-server support.** Only code-server (Coder) is supported in v1.
- **Plugin system** for other session types (e.g. Jupyter, custom dev servers). Can be added in a future iteration.
- **Documentation editing via the UI.** The docs viewer is read-only; editing happens in the filesystem.
- **Full-text search across live filesystem.** Search is provided by Starlight's built-in index, which is built from the collected docs at startup.

---

## Further Notes

- The portal was designed with the constraint that it must be operable from a mobile phone browser with no native app. All interactions must be one or two taps maximum for common actions (open session, stop session).
- The HTMX approach was chosen specifically to avoid any JavaScript build tooling, keeping the project simple to fork, modify, and self-host without requiring Node.js or a bundler on the host machine. The docs viewer is the one deliberate exception: Astro is used because full MDX rendering and live reload justify the Node.js dependency.
- `gopkg.in/yaml.v3` is the only external Go dependency. This is a deliberate constraint to keep the dependency surface auditable and the binary lean.
- The directory tree intentionally shows all directories including dotdirs. The portal is a directory navigator, not a project manager. Filtering is done only for directories that are never useful to open (build artifacts, git object stores).
- Session state is persisted to an XDG-compliant path (`~/.local/share/workspace-portal/`) so it survives portal restarts and does not pollute the workspaces directory.
- The open-source design intent means all machine-specific values must flow through config/env vars. The repo must be cloneable by anyone and functional with only a filled-in `config.yaml` and `.secrets/` directory.
