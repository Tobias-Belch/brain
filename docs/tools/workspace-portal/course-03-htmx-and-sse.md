---
title: "Course 03 — HTMX and Server-Sent Events"
---

# Course 03 — HTMX and Server-Sent Events

**Goal:** Replace the plain-text stub responses from Course 02 with a real, mobile-friendly UI driven by HTMX and Server-Sent Events.  
**Prerequisite:** [Course 02 — Building the Portal in Go](./course-02-building-the-portal.md)  
**Output:** A fully functional portal UI: interactive directory tree, session management, live SSE updates — no JavaScript framework, no build step.

---

## Lesson 1 — What is HTMX?

### The problem HTMX solves

Traditional web apps face a choice:

1. **Server-rendered HTML** — simple, fast initial load, but every interaction reloads the full page (bad UX).
2. **Single-Page Applications** — rich interactions, but require a JS framework, a bundler, API endpoints, and JSON serialisation everywhere.

HTMX is a third path: you keep server-rendered HTML, but individual parts of the page can be swapped in response to user interactions — without writing JavaScript.

### How it works

HTMX is a single JavaScript file (~14 kB gzipped) that extends HTML with new attributes:

```html
<!-- Without HTMX: clicking this link navigates the whole page -->
<a href="/fs/list?path=foo">foo/</a>

<!-- With HTMX: clicking this link fetches /fs/list?path=foo
     and swaps the response into #children-foo, no page reload -->
<button
  hx-get="/fs/list?path=foo"
  hx-target="#children-foo"
  hx-swap="innerHTML"
>foo/</button>
```

The server still returns HTML — just a fragment instead of a full page. The handler in Go doesn't change its nature; it just returns less HTML.

### The HTMX mental model

Think of HTMX as giving **any HTML element** the ability to make an HTTP request and put the response somewhere on the page. The attributes are:

| Attribute | Purpose |
|---|---|
| `hx-get` / `hx-post` | Which endpoint to call and with which method |
| `hx-target` | Which element to update (CSS selector, defaults to the element itself) |
| `hx-swap` | How to update the target (`innerHTML`, `outerHTML`, `beforeend`, etc.) |
| `hx-trigger` | What event fires the request (default: `click` for buttons, `submit` for forms) |
| `hx-vals` | Extra values to include in the request body (JSON object) |
| `hx-indicator` | A CSS selector for an element to show while the request is in flight |

### Comparing to React

If you come from React, the mental map is:

| React | HTMX |
|---|---|
| Component state + `useState` | Server state, re-fetched on demand |
| `fetch()` + JSON parsing | `hx-get` — HTML fragment returned directly |
| `setState` triggers re-render | `hx-swap` replaces a DOM element |
| `useEffect` for side effects | `hx-trigger="load"` for on-load fetches |
| Loading spinners via `isLoading` state | `hx-indicator` + CSS |
| React Router | Regular `<a>` tags (full page) or `hx-push-url` |

HTMX has **no virtual DOM, no diffing, no client-side state**. The server is the source of truth.

### What we will build

The portal UI has three interacting pieces:

1. **Directory tree** — click a row to expand it (HTMX `hx-get` loads children); click again to collapse (toggle).
2. **Session controls** — "Open OpenCode" / "Open VS Code" buttons POST to the server and replace the sessions list.
3. **Live updates** — an SSE connection pushes `session.started`, `session.healthy`, `session.stopped` events and HTMX re-fetches the sessions list in response.

---

## Lesson 2 — Embedding HTMX and Templates

### Download HTMX

```bash
cd ~/workspaces/fea/lib/workspace-portal
curl -L https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js -o internal/assets/static/htmx.min.js
```

Check the file size — it should be around 50 kB unminified, 14 kB gzipped. We embed it so the portal works with no external network access.

### Go embed directives

`go:embed` turns files in your source tree into byte slices baked into the binary at compile time. There are two forms:

```go
//go:embed static/htmx.min.js
var htmxJS []byte  // single file → []byte

//go:embed templates/*.html
var templateFS embed.FS  // directory tree → fs.FS
```

Key rules:
- The `//go:embed` comment must be directly above the `var` declaration — no blank line.
- The path is relative to the file containing the directive.
- `embed.FS` supports multiple glob patterns and directories.
- The embedded data is read-only and available at any call site that imports the package.

### Create `internal/assets/assets.go`

`go:embed` paths must stay within or below the directory containing the source file — they cannot traverse `../`. The solution is to co-locate the assets with the embed declarations: both `static/` and `templates/` live inside `internal/assets/`, so the paths are simple and local.

```go
package assets

import "embed"

// HTMXJS is the embedded htmx.min.js file served at /static/htmx.min.js.
//go:embed static/htmx.min.js
var HTMXJS []byte

// TemplateFS contains all Go HTML templates under templates/.
//go:embed templates/*.html
var TemplateFS embed.FS
```

Update `internal/server/server.go` to import `assets`:

```go
import (
    // ...
    "workspace-portal/internal/assets"
)
```

### Parse templates at startup

Parsing templates is expensive — do it once when the server starts, not on every request. Update `New()` in `internal/server/server.go`:

```go
package server

import (
    "html/template"
    "log"
    "net/http"

    "workspace-portal/internal/assets"
    "workspace-portal/internal/config"
    "workspace-portal/internal/session"
    "workspace-portal/internal/fs"
)

type Server struct {
    cfg     *config.Config
    manager *session.Manager
    tmpl    *template.Template
    mux     *http.ServeMux
}

func New(cfg *config.Config, mgr *session.Manager) *Server {
    tmpl, err := template.ParseFS(assets.TemplateFS, "templates/*.html")
    if err != nil {
        log.Fatalf("parse templates: %v", err)
    }

    s := &Server{
        cfg:     cfg,
        manager: mgr,
        tmpl:    tmpl,
        mux:     http.NewServeMux(),
    }
    s.routes()
    return s
}
```

`template.ParseFS` reads all matching files from an `fs.FS` and parses them as a template set. All templates in the set can reference each other with `{{template "name" .}}`.

---

## Lesson 3 — Go HTML Templates

### Template syntax overview

Go's `html/template` is a superset of `text/template`. It auto-escapes HTML values, preventing XSS.

```go
// Execute a template: write output to w, pass data as the dot (.)
tmpl.ExecuteTemplate(w, "layout.html", data)
```

Inside a template:

```html
<!-- Access a field on dot -->
<p>{{.Name}}</p>

<!-- Conditionals -->
{{if .IsGit}}<span class="git">git</span>{{end}}

<!-- Range over a slice — dot becomes the element -->
{{range .Entries}}
  <li>{{.Name}}</li>
{{end}}

<!-- Call a template defined in another file -->
{{template "session-row.html" .}}

<!-- Define a named block (for layout inheritance) -->
{{define "content"}} ... {{end}}

<!-- Include a sub-template, passing a new value as dot -->
{{template "tree-row.html" .}}
```

### Template data structs

Define the data types that templates receive in `internal/server/templates.go`:

```go
package server

import "workspace-portal/internal/session"

// pageData is passed to layout.html for the initial full-page render.
type pageData struct {
    Root     string           // workspaces root path (display only)
    Sessions []session.Session
}

// treeRowData is passed to tree-row.html for each directory entry.
type treeRowData struct {
    Name        string
    Path        string // full path relative to workspaces root
    IsGit       bool
    HasChildren bool
    // Expanded is set server-side when rendering children inline.
    // For lazily-loaded rows it is always false on first render.
    Expanded    bool
}

// sessionRowData is passed to session-row.html for each session entry.
type sessionRowData struct {
    session.Session
}
```

Keep template data structs in the `server` package. They are view-model types — they exist to decouple the template from the domain types.

---

## Lesson 4 — The Layout Template

Create `internal/assets/templates/layout.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Workspace Portal</title>
  <style>
    /* Minimal reset and mobile-friendly base */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 16px;
      background: #0f1117;
      color: #e2e8f0;
      min-height: 100vh;
    }
    header {
      padding: 1rem;
      border-bottom: 1px solid #2d3748;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    header h1 { font-size: 1rem; font-weight: 600; }
    header span { font-size: 0.8rem; color: #718096; font-family: monospace; }
    main { padding: 1rem; max-width: 900px; margin: 0 auto; }
    h2 { font-size: 0.875rem; font-weight: 600; text-transform: uppercase;
         letter-spacing: 0.05em; color: #718096; margin: 1.5rem 0 0.5rem; }
    /* Tree */
    .tree { list-style: none; }
    .tree-item { border-bottom: 1px solid #1a202c; }
    .tree-row {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 0.25rem;
      cursor: pointer;
      user-select: none;
    }
    .tree-row:hover { background: #1a202c; }
    .tree-indent { padding-left: 1.25rem; }
    .tree-icon { width: 1rem; text-align: center; font-size: 0.75rem; color: #718096; }
    .tree-name { flex: 1; font-size: 0.875rem; font-family: monospace; }
    .tree-name.git::after { content: " git"; font-size: 0.7rem; color: #48bb78;
                              background: #1a3329; padding: 0 0.25rem; border-radius: 3px;
                              margin-left: 0.25rem; }
    .tree-actions { display: flex; gap: 0.25rem; }
    /* Buttons */
    .btn {
      font-size: 0.75rem; padding: 0.25rem 0.5rem; border: none; border-radius: 4px;
      cursor: pointer; white-space: nowrap;
    }
    .btn-oc   { background: #2b6cb0; color: #fff; }
    .btn-oc:hover   { background: #2c5282; }
    .btn-vs   { background: #553c9a; color: #fff; }
    .btn-vs:hover   { background: #44337a; }
    .btn-stop { background: #742a2a; color: #fff; }
    .btn-stop:hover { background: #9b2c2c; }
    .btn-open { background: #276749; color: #fff; }
    .btn-open:hover { background: #22543d; }
    /* Sessions */
    #sessions { margin-top: 1rem; }
    .session-row {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid #1a202c;
      font-size: 0.875rem;
    }
    .session-type { font-size: 0.7rem; background: #2d3748; padding: 0.1rem 0.35rem;
                    border-radius: 3px; font-family: monospace; }
    .session-dir  { flex: 1; font-family: monospace; color: #a0aec0; }
    .session-port { font-size: 0.75rem; color: #718096; font-family: monospace; }
    .session-status-starting { color: #d69e2e; font-size: 0.75rem; }
    .session-status-healthy  { color: #48bb78; font-size: 0.75rem; }
    /* Loading indicator (shown while htmx request in flight) */
    .htmx-indicator { display: none; }
    .htmx-request .htmx-indicator { display: inline; }
    .htmx-request.htmx-indicator { display: inline; }
    /* Children container */
    .children { display: none; }
    .children.open { display: block; }
  </style>
</head>
<body hx-ext="sse" sse-connect="/events">

  <header>
    <h1>Workspace Portal</h1>
    <span>{{.Root}}</span>
  </header>

  <main>
    <h2>Directories</h2>
    <ul class="tree" id="tree-root">
      {{template "tree-children.html" .RootEntries}}
    </ul>

    <h2>Running Sessions</h2>
    <div id="sessions"
         hx-ext="sse"
         sse-swap="session.started,session.stopped,session.healthy"
         hx-get="/sessions"
         hx-trigger="sse:session.started, sse:session.stopped, sse:session.healthy">
      {{template "sessions.html" .Sessions}}
    </div>
  </main>

  <script src="/static/htmx.min.js"></script>
  <script src="/static/htmx-ext-sse.min.js"></script>
</body>
</html>
```

> **Note on SSE + HTMX:** We use `hx-trigger="sse:session.started, ..."` on the sessions `<div>` to re-fetch `/sessions` whenever an SSE event arrives. This is simpler and more robust than parsing SSE event data in the browser — the server just re-renders the sessions list fragment and HTMX swaps it in.

### Why `{{template "tree-children.html" .RootEntries}}` not `{{template "tree-row.html"}}`?

We will define `tree-children.html` as a template that takes a `[]treeRowData` slice and renders multiple rows. A single-entry template (`tree-row.html`) is also defined, and `tree-children.html` loops over the slice calling `tree-row.html` for each entry. This allows the `/fs/list` endpoint to return just `tree-children.html` rendered with a slice, which HTMX injects into the right place in the DOM.

---

## Lesson 5 — Tree Templates

### `internal/assets/templates/tree-children.html`

This template receives `[]treeRowData` as dot and renders a `<ul>` of rows.

```html
{{define "tree-children.html"}}
{{range .}}
  {{template "tree-row.html" .}}
{{end}}
{{end}}
```

Simple: it delegates every element to `tree-row.html`.

### `internal/assets/templates/tree-row.html`

This template receives a single `treeRowData` as dot and renders one row with:
- An expand/collapse toggle (if the directory has children)
- A git badge (if it's a git repo)
- "Open OC" and "Open VS Code" buttons

```html
{{define "tree-row.html"}}
<li class="tree-item" id="item-{{.SafeID}}">
  <div class="tree-row">
    {{if .HasChildren}}
    <span class="tree-icon"
          hx-get="/fs/list?path={{.Path}}"
          hx-target="#children-{{.SafeID}}"
          hx-swap="innerHTML"
          hx-on:click="toggleChildren(this, '{{.SafeID}}')"
          title="Expand">▶</span>
    {{else}}
    <span class="tree-icon" style="color:#2d3748">—</span>
    {{end}}

    <span class="tree-name{{if .IsGit}} git{{end}}">{{.Name}}</span>

    <div class="tree-actions">
      <button class="btn btn-oc"
              hx-post="/sessions/start"
              hx-vals='{"type":"opencode","dir":"{{.Path}}"}'
              hx-target="#sessions"
              hx-swap="innerHTML"
              hx-indicator="#sessions-indicator">
        OpenCode
      </button>
      <button class="btn btn-vs"
              hx-post="/sessions/start"
              hx-vals='{"type":"vscode","dir":"{{.Path}}"}'
              hx-target="#sessions"
              hx-swap="innerHTML"
              hx-indicator="#sessions-indicator">
        VS
      </button>
    </div>
  </div>

  {{if .HasChildren}}
  <ul class="tree children tree-indent" id="children-{{.SafeID}}">
    <!-- children loaded lazily via hx-get above -->
  </ul>
  {{end}}
</li>
{{end}}
```

### The `SafeID` helper

CSS `id` attributes cannot contain `/` or `.` characters. We need a safe version of the path to use as an HTML id. Add a method to `treeRowData`:

```go
// in internal/server/templates.go
import "strings"

func (t treeRowData) SafeID() string {
    // Replace path separators and dots with underscores
    r := strings.NewReplacer("/", "_", ".", "_", " ", "_")
    return r.Replace(t.Path)
}
```

> **Template method calls:** Go templates can call methods on the dot value. `{{.SafeID}}` calls the `SafeID()` method on `treeRowData`. The method must be exported (capital letter) and return either one value or a value plus an error.

### The expand/collapse toggle

When the user clicks the icon, we want to:
1. Fetch children from the server (if not already loaded)
2. Toggle the `children` element between shown and hidden
3. Update the arrow icon direction

HTMX handles step 1. We need a tiny JavaScript function for steps 2 and 3. Add this to `layout.html` before the `</body>`:

```html
<script>
function toggleChildren(icon, id) {
  const children = document.getElementById('children-' + id);
  if (!children) return;
  const isOpen = children.classList.toggle('open');
  icon.textContent = isOpen ? '▼' : '▶';
}
</script>
```

This is the only custom JavaScript in the entire portal. Everything else is HTMX attributes.

> **Why is this JavaScript and not HTMX?** HTMX is for HTTP requests. Toggling a CSS class is a pure DOM operation with no server involvement — it belongs in JavaScript. HTMX and JavaScript complement each other; HTMX is not a replacement for every DOM manipulation.

---

## Lesson 6 — Sessions Template

### `internal/assets/templates/sessions.html`

This template receives `[]session.Session` and renders the sessions list. It is also the fragment returned by `/sessions` and `/sessions/start` and `/sessions/stop`.

```html
{{define "sessions.html"}}
{{if .}}
{{range .}}
  {{template "session-row.html" .}}
{{end}}
{{else}}
<p style="color:#4a5568;font-size:0.875rem;">No sessions running.</p>
{{end}}
{{end}}
```

### `internal/assets/templates/session-row.html`

```html
{{define "session-row.html"}}
<div class="session-row" id="session-{{.ID}}">
  <span class="session-type">{{.Type}}</span>
  <span class="session-dir">{{.Dir}}</span>
  <span class="session-port">:{{.Port}}</span>

  {{if eq .Status "healthy"}}
    <a href="{{.URL}}" target="_blank" class="btn btn-open">Open ↗</a>
  {{else}}
    <span class="session-status-starting">starting…</span>
  {{end}}

  <button class="btn btn-stop"
          hx-post="/sessions/stop"
          hx-vals='{"id":"{{.ID}}"}'
          hx-target="#sessions"
          hx-swap="innerHTML"
          hx-confirm="Stop {{.Type}} for {{.Dir}}?">
    Stop
  </button>
</div>
{{end}}
```

Key HTMX attribute here: `hx-confirm` shows a browser `confirm()` dialog before making the request. No custom JavaScript needed.

---

## Lesson 7 — Updating the Handlers

Now we replace the `// TODO Course 03` stubs in `internal/server/handlers.go` with real template-rendering handlers.

### The `index` handler

```go
func (h *handler) index(w http.ResponseWriter, r *http.Request) {
    if r.URL.Path != "/" {
        http.NotFound(w, r)
        return
    }

    entries, err := fs.List(h.cfg.WorkspacesRoot, h.cfg.FS.PruneDirs)
    if err != nil {
        http.Error(w, "list root: "+err.Error(), http.StatusInternalServerError)
        return
    }

    rows := make([]treeRowData, len(entries))
    for i, e := range entries {
        rows[i] = treeRowData{
            Name:        e.Name,
            Path:        e.RelPath,
            IsGit:       e.IsGit,
            HasChildren: e.HasChildren,
        }
    }

    data := pageData{
        Root:         h.cfg.WorkspacesRoot,
        RootEntries:  rows,
        Sessions:     h.manager.List(),
    }

    if err := h.tmpl.ExecuteTemplate(w, "layout.html", data); err != nil {
        log.Printf("render index: %v", err)
    }
}
```

Update `pageData` to include `RootEntries`:

```go
type pageData struct {
    Root        string
    RootEntries []treeRowData
    Sessions    []session.Session
}
```

### The `fsList` handler

```go
func (h *handler) fsList(w http.ResponseWriter, r *http.Request) {
    // Sanitise and resolve the requested path
    relPath := r.URL.Query().Get("path")
    if relPath == "" {
        http.Error(w, "path required", http.StatusBadRequest)
        return
    }

    // Prevent path traversal: the resolved path must stay inside workspaces root
    absPath := filepath.Join(h.cfg.WorkspacesRoot, relPath)
    if !strings.HasPrefix(absPath, h.cfg.WorkspacesRoot) {
        http.Error(w, "forbidden", http.StatusForbidden)
        return
    }

    entries, err := fs.List(absPath, h.cfg.FS.PruneDirs)
    if err != nil {
        http.Error(w, "list: "+err.Error(), http.StatusInternalServerError)
        return
    }

    rows := make([]treeRowData, len(entries))
    for i, e := range entries {
        rows[i] = treeRowData{
            Name:        e.Name,
            Path:        filepath.Join(relPath, e.Name),
            IsGit:       e.IsGit,
            HasChildren: e.HasChildren,
        }
    }

    if err := h.tmpl.ExecuteTemplate(w, "tree-children.html", rows); err != nil {
        log.Printf("render fsList: %v", err)
    }
}
```

> **Security note:** `filepath.Join` cleans `..` sequences, so `path=../../etc/passwd` becomes something like `/etc/passwd`. The `HasPrefix` check then rejects it because it is outside `WorkspacesRoot`. Always sanitise user-supplied paths before using them to access the filesystem.

### The `sessions` handler

```go
func (h *handler) sessions(w http.ResponseWriter, r *http.Request) {
    if err := h.tmpl.ExecuteTemplate(w, "sessions.html", h.manager.List()); err != nil {
        log.Printf("render sessions: %v", err)
    }
}
```

### The `sessionsStart` handler

```go
func (h *handler) sessionsStart(w http.ResponseWriter, r *http.Request) {
    sessionType := r.FormValue("type")
    dir := r.FormValue("dir")

    if sessionType == "" || dir == "" {
        http.Error(w, "type and dir required", http.StatusBadRequest)
        return
    }

    // Resolve relative to workspaces root
    absDir := filepath.Join(h.cfg.WorkspacesRoot, dir)

    _, err := h.manager.Start(session.Type(sessionType), absDir)
    if err != nil {
        http.Error(w, "start session: "+err.Error(), http.StatusInternalServerError)
        return
    }

    // Return the updated sessions list (HTMX swaps this into #sessions)
    if err := h.tmpl.ExecuteTemplate(w, "sessions.html", h.manager.List()); err != nil {
        log.Printf("render sessionsStart: %v", err)
    }
}
```

### The `sessionsStop` handler

```go
func (h *handler) sessionsStop(w http.ResponseWriter, r *http.Request) {
    id := r.FormValue("id")
    if id == "" {
        http.Error(w, "id required", http.StatusBadRequest)
        return
    }

    if err := h.manager.Stop(id); err != nil {
        http.Error(w, "stop session: "+err.Error(), http.StatusInternalServerError)
        return
    }

    if err := h.tmpl.ExecuteTemplate(w, "sessions.html", h.manager.List()); err != nil {
        log.Printf("render sessionsStop: %v", err)
    }
}
```

### The `static` handler

```go
func (h *handler) static(w http.ResponseWriter, r *http.Request) {
    // Strip the /static/ prefix and look up the file
    name := strings.TrimPrefix(r.URL.Path, "/static/")
    switch name {
    case "htmx.min.js":
        w.Header().Set("Content-Type", "application/javascript")
        w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
        w.Write(assets.HTMXJS)
    default:
        http.NotFound(w, r)
    }
}
```

For now we only serve `htmx.min.js`. The `Cache-Control: immutable` header tells browsers to never re-request this file — fine since we control the embedded version and can change the URL if we upgrade.

---

## Lesson 8 — HTMX SSE Extension

HTMX's SSE support is a separate extension file in HTMX v2. Download it alongside `htmx.min.js`:

```bash
curl -L https://unpkg.com/htmx-ext-sse@2.2.3/sse.js -o internal/assets/static/htmx-ext-sse.min.js
```

Add it to the assets embed and the static handler:

```go
// internal/assets/assets.go
//go:embed static/htmx.min.js
var HTMXJS []byte

//go:embed static/htmx-ext-sse.min.js
var HTMXSSEJS []byte
```

```go
// static handler addition
case "htmx-ext-sse.min.js":
    w.Header().Set("Content-Type", "application/javascript")
    w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
    w.Write(assets.HTMXSSEJS)
```

The `layout.html` already has the two `<script>` tags for both files.

### How SSE + HTMX works in practice

The `<body>` tag in `layout.html` has:

```html
<body hx-ext="sse" sse-connect="/events">
```

This tells HTMX to establish an SSE connection to `/GET /events` as soon as the page loads. The connection is maintained until the user navigates away or closes the tab.

The sessions `<div>` has:

```html
<div id="sessions"
     hx-get="/sessions"
     hx-trigger="sse:session.started, sse:session.stopped, sse:session.healthy">
```

When any of those SSE event names arrive, HTMX fires `hx-get="/sessions"` and swaps the response into `#sessions`. The server's `events` handler (already complete from Course 02) writes the events; the server's `sessions` handler re-renders the list.

This pattern — SSE triggers a fresh fetch rather than using SSE data directly — avoids parsing JSON in the browser and keeps the Go server as the sole source of rendered HTML.

---

## Lesson 9 — Wiring Everything Together

### Update the `handler` struct

In `internal/server/handlers.go`, add the template and assets references:

```go
type handler struct {
    cfg     *config.Config
    manager *session.Manager
    tmpl    *template.Template
}
```

Update `routes()` in `server.go` to pass the parsed template to the handler:

```go
func (s *Server) routes() {
    h := &handler{
        cfg:     s.cfg,
        manager: s.manager,
        tmpl:    s.tmpl,
    }

    s.mux.HandleFunc("GET /", h.index)
    s.mux.HandleFunc("GET /fs/list", h.fsList)
    s.mux.HandleFunc("GET /sessions", h.sessions)
    s.mux.HandleFunc("POST /sessions/start", h.sessionsStart)
    s.mux.HandleFunc("POST /sessions/stop", h.sessionsStop)
    s.mux.HandleFunc("GET /events", h.events)
    s.mux.HandleFunc("GET /static/", h.static)
}
```

### Import additions

Add to `handlers.go` imports:

```go
import (
    "encoding/json"
    "fmt"
    "html/template"
    "log"
    "net/http"
    "path/filepath"
    "strings"

    "workspace-portal/internal/config"
    "workspace-portal/internal/fs"
    "workspace-portal/internal/session"
)
```

### Build and run

```bash
go build ./...
go run ./cmd/portal
```

Open `http://localhost:4000` in a browser. You should see:
- A dark-themed portal with a directory tree
- Clicking a `▶` arrow expands the directory and loads children
- Clicking "OpenCode" or "VS" starts a session (it will fail gracefully if OpenCode/code-server are not installed)
- The sessions section updates live via SSE when sessions start or stop

---

## Lesson 10 — Server-Side Tests for Handlers

### What to test

We test the HTTP handlers via `httptest.NewServer` with a mock session manager. This confirms:
- Routes are correctly registered
- Templates render without error
- Path traversal in `/fs/list` is rejected
- Form values are correctly parsed by `/sessions/start` and `/sessions/stop`

### Mock session manager

Define a `ManagerInterface` in `internal/session/manager.go` to allow mocking in tests:

```go
// ManagerInterface defines the methods the HTTP handlers need.
// The concrete Manager implements this interface.
type ManagerInterface interface {
    Start(t Type, dir string) (Session, error)
    Stop(id string) error
    List() []Session
    Get(id string) (Session, bool)
    Events() <-chan Event
}
```

Update `server.go` and `handlers.go` to use `ManagerInterface` instead of `*Manager`.

### Test file `internal/server/handlers_test.go`

```go
package server_test

import (
    "io"
    "net/http"
    "net/http/httptest"
    "net/url"
    "strings"
    "testing"

    "github.com/yourusername/workspace-portal/internal/config"
    "github.com/yourusername/workspace-portal/internal/session"
    "github.com/yourusername/workspace-portal/internal/server"
)

// fakeManager satisfies session.ManagerInterface for testing.
type fakeManager struct {
    sessions []session.Session
    started  []session.Session
    stopped  []string
}

func (f *fakeManager) Start(t session.Type, dir string) (session.Session, error) {
    s := session.Session{ID: "test-id", Type: t, Dir: dir, Port: 4100, Status: "starting"}
    f.sessions = append(f.sessions, s)
    f.started = append(f.started, s)
    return s, nil
}

func (f *fakeManager) Stop(id string) error {
    f.stopped = append(f.stopped, id)
    for i, s := range f.sessions {
        if s.ID == id {
            f.sessions = append(f.sessions[:i], f.sessions[i+1:]...)
            break
        }
    }
    return nil
}

func (f *fakeManager) List() []session.Session        { return f.sessions }
func (f *fakeManager) Get(id string) (session.Session, bool) {
    for _, s := range f.sessions {
        if s.ID == id { return s, true }
    }
    return session.Session{}, false
}
func (f *fakeManager) Events() <-chan session.Event {
    ch := make(chan session.Event)
    return ch
}

func newTestServer(t *testing.T, mgr session.ManagerInterface) *httptest.Server {
    t.Helper()
    cfg := &config.Config{
        WorkspacesRoot: t.TempDir(),
        PortalPort:     4000,
    }
    srv := server.New(cfg, mgr)
    return httptest.NewServer(srv)
}

func TestIndex(t *testing.T) {
    ts := newTestServer(t, &fakeManager{})
    defer ts.Close()

    resp, err := http.Get(ts.URL + "/")
    if err != nil {
        t.Fatal(err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        t.Fatalf("want 200, got %d", resp.StatusCode)
    }
    body, _ := io.ReadAll(resp.Body)
    if !strings.Contains(string(body), "Workspace Portal") {
        t.Error("response does not contain expected heading")
    }
}

func TestFsListPathTraversal(t *testing.T) {
    ts := newTestServer(t, &fakeManager{})
    defer ts.Close()

    resp, err := http.Get(ts.URL + "/fs/list?path=../../etc")
    if err != nil {
        t.Fatal(err)
    }
    if resp.StatusCode != http.StatusForbidden {
        t.Fatalf("want 403, got %d", resp.StatusCode)
    }
}

func TestSessionsStart(t *testing.T) {
    mgr := &fakeManager{}
    ts := newTestServer(t, mgr)
    defer ts.Close()

    form := url.Values{"type": {"opencode"}, "dir": {"my-project"}}
    resp, err := http.PostForm(ts.URL+"/sessions/start", form)
    if err != nil {
        t.Fatal(err)
    }
    defer resp.Body.Close()

    if resp.StatusCode != http.StatusOK {
        t.Fatalf("want 200, got %d", resp.StatusCode)
    }
    if len(mgr.started) != 1 {
        t.Fatalf("want 1 session started, got %d", len(mgr.started))
    }
    if mgr.started[0].Type != session.TypeOpenCode {
        t.Errorf("want type opencode, got %s", mgr.started[0].Type)
    }
}

func TestSessionsStop(t *testing.T) {
    mgr := &fakeManager{
        sessions: []session.Session{{ID: "abc", Type: session.TypeOpenCode, Dir: "/foo", Port: 4100, Status: "healthy"}},
    }
    ts := newTestServer(t, mgr)
    defer ts.Close()

    form := url.Values{"id": {"abc"}}
    resp, err := http.PostForm(ts.URL+"/sessions/stop", form)
    if err != nil {
        t.Fatal(err)
    }
    if resp.StatusCode != http.StatusOK {
        t.Fatalf("want 200, got %d", resp.StatusCode)
    }
    if len(mgr.stopped) != 1 || mgr.stopped[0] != "abc" {
        t.Errorf("want stopped=[abc], got %v", mgr.stopped)
    }
}

func TestEventsContentType(t *testing.T) {
    ts := newTestServer(t, &fakeManager{})
    defer ts.Close()

    resp, err := http.Get(ts.URL + "/events")
    if err != nil {
        t.Fatal(err)
    }
    ct := resp.Header.Get("Content-Type")
    if !strings.HasPrefix(ct, "text/event-stream") {
        t.Errorf("want text/event-stream, got %s", ct)
    }
}
```

### Run tests

```bash
go test ./internal/server/...
```

Fix any compilation errors, then check for race conditions:

```bash
go test -race ./internal/server/...
```

---

## Lesson 11 — Template Error Handling

Go's `html/template` is strict about missing template names. If `ExecuteTemplate` is called with a name that was not parsed, it returns an error at runtime. This is different from JavaScript template engines that silently produce empty output.

### Best practices

**Always log template execution errors:**
```go
if err := tmpl.ExecuteTemplate(w, "sessions.html", data); err != nil {
    log.Printf("template sessions.html: %v", err)
    // Note: we cannot http.Error here because we may have already written
    // the response header. Log and return.
    return
}
```

**Parse at startup, not per-request:**
Calling `template.ParseFS` once at startup means a typo in a template crashes the server at startup (fast fail) rather than returning a 500 to users later. This is the correct behaviour.

**Use `template.Must` for top-level parse calls:**
```go
tmpl := template.Must(template.ParseFS(assets.TemplateFS, "templates/*.html"))
```
`template.Must` wraps any function returning `(*Template, error)` and panics if the error is non-nil. Panics at startup are acceptable (the process immediately exits with a clear message); panics inside HTTP handlers are not.

### HTML auto-escaping

`html/template` automatically escapes values placed into HTML context:

```html
<!-- If .Path is "foo/bar<script>alert(1)</script>" -->
<span>{{.Path}}</span>
<!-- Rendered as: <span>foo/bar&lt;script&gt;alert(1)&lt;/script&gt;</span> -->
```

This is why we use `html/template` not `text/template` — even though we control all our data, auto-escaping is a defence-in-depth safeguard. Never use `text/template` for HTML output.

**Explicit trust with `template.HTML`:**
If you need to insert pre-rendered HTML (e.g., from a trusted internal source), use the `template.HTML` type:

```go
type myData struct {
    SafeHTML template.HTML
}
// In Go: data.SafeHTML = template.HTML("<strong>trusted</strong>")
// In template: {{.SafeHTML}} — rendered as-is, not escaped
```

Use this sparingly and only for values you fully control. Never use it with user input.

---

## Lesson 12 — Polishing the UI

### Loading indicators

When HTMX makes a request, it adds the class `htmx-request` to the element that triggered the request. We use this to show a loading state. Add to `layout.html` style block:

```css
/* Show spinner text on in-flight session start requests */
button.htmx-request { opacity: 0.6; cursor: wait; }
button.htmx-request::after { content: "…"; }
```

No JavaScript — pure CSS responding to the class HTMX manages.

### Mobile tap target sizing

The minimum recommended tap target size is 44×44 CSS pixels (Apple HIG) / 48×48dp (Android). Update button padding:

```css
.btn {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;   /* increased from 0.25rem 0.5rem */
    min-width: 44px;
    min-height: 44px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}
```

### Preventing duplicate sessions

The "Open OC" button should not start a second session if one is already running for that directory. Implement this in `sessionsStart`:

```go
func (h *handler) sessionsStart(w http.ResponseWriter, r *http.Request) {
    sessionType := r.FormValue("type")
    dir := r.FormValue("dir")

    absDir := filepath.Join(h.cfg.WorkspacesRoot, dir)

    // Check for an existing session with the same type and directory
    for _, s := range h.manager.List() {
        if s.Type == session.Type(sessionType) && s.Dir == absDir {
            // Already running — just re-render the sessions list
            h.tmpl.ExecuteTemplate(w, "sessions.html", h.manager.List())
            return
        }
    }

    _, err := h.manager.Start(session.Type(sessionType), absDir)
    if err != nil {
        http.Error(w, "start session: "+err.Error(), http.StatusInternalServerError)
        return
    }

    h.tmpl.ExecuteTemplate(w, "sessions.html", h.manager.List())
}
```

---

## Summary

You now have a complete, working portal UI with:

- **HTMX-driven directory tree** — lazy expansion, one level at a time, no full-page reloads
- **Session management** — start and stop OpenCode/VS Code sessions with a single tap
- **Live SSE updates** — the sessions section updates automatically across all open browser tabs when sessions start, become healthy, or stop
- **Embedded assets** — HTMX and the SSE extension are baked into the binary; no CDN, no external dependencies at runtime
- **Go HTML templates** — server-rendered fragments with auto-escaping; no JavaScript framework
- **Handler tests** — all HTTP endpoints tested with a fake session manager via `httptest`
- **One small JavaScript function** — `toggleChildren` for DOM-only expand/collapse; everything else is HTMX

The binary is fully functional. In the next course we package it into a Docker image.

**Next:** [Course 04 — Docker](./course-04-docker.md) — build a minimal Docker image using multi-stage builds, configure secrets and volumes, and run the portal as a container.
