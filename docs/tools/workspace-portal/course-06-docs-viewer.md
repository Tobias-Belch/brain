---
title: "Course 06 — Centralised Documentation Viewer"
---

# Course 06 — Centralised Documentation Viewer

**Goal:** Add a live documentation viewer to workspace-portal that renders all `.md` and `.mdx` files from your workspaces root as a searchable, navigable Starlight site — automatically excluding gitignored files and updating as you edit.

**Prerequisite:** [Course 05 — Deployment](/tools/workspace-portal/course-05-deployment.md)

**Output:** A new `/docs` route in the portal backed by an Astro Starlight child process. Edit any `.md` or `.mdx` file in your workspaces and the change is visible in the browser within seconds. Full MDX component rendering, sidebar navigation, and search included.

---

## Lesson 1 — What is Astro? What is Starlight?

### The problem

Your workspaces root contains hundreds of `README.md` files, `docs/` subdirectories, ADRs, `.mdx` component docs, and design notes. There is no way to browse all of this in one place from a mobile browser. The portal's directory tree can navigate to them, but it opens raw Markdown — not rendered HTML.

A Go-based Markdown renderer (like `goldmark`) can render `.md` files. But `.mdx` files mix Markdown prose with JSX component invocations:

```mdx
import { Callout } from '@/components/Callout.astro'

# My ADR

<Callout type="warning">This approach was superseded by ADR-012.</Callout>

The decision was made because...
```

A Go renderer has no way to execute JSX. The `<Callout>` block would be silently dropped, shown as raw text, or cause a parse error.

### Why Astro + Starlight

**Astro** is a web framework for content sites. It compiles `.astro` components and `.mdx` files to HTML at build time (or at request time in server mode). It understands JSX, TypeScript, and every major UI framework — but outputs plain HTML to the browser, keeping the runtime small.

**Starlight** is an Astro theme built specifically for documentation sites. It provides out of the box:
- Sidebar navigation generated from your file tree
- Full-text search (pagefind, runs in the browser, no server needed)
- Syntax highlighting for code blocks
- Mobile-friendly responsive layout
- Dark mode
- MDX component support

If you have used Docusaurus, VitePress, or GitBook, Starlight is the Astro equivalent — simpler than Docusaurus, faster than VitePress, self-hosted unlike GitBook.

### Astro vs React (for a TypeScript developer)

| Concept | React SPA | Astro |
|---|---|---|
| Component syntax | JSX, `.tsx` | `.astro` (frontmatter + HTML template) |
| Runtime JS | Framework + your code | Zero by default (opt-in per component) |
| Build output | JS bundle | Static HTML files |
| Data fetching | `useEffect`, React Query | Async in frontmatter (`const data = await fetch(...)`) |
| Content files | Not a first-class concept | Built-in content collections (`.md`, `.mdx`) |
| Hot reload | Vite HMR | Vite HMR (Astro uses Vite internally) |

The key difference: Astro components run **once at build/request time** to produce HTML. There is no React reconciler, no virtual DOM, no hydration unless you explicitly opt in with `client:load`.

### Why run Astro as a child process

There are three ways to integrate Astro with the Go portal:

1. **Static embed**: Run `astro build` once; embed `dist/` in the Go binary with `go:embed`. Dead simple, zero runtime dependency. **Problem**: docs are stale until you rebuild and restart the portal.
2. **Separate service**: Run Astro independently on another port; link from the portal. **Problem**: two things to start and manage; the portal can't show a link until Astro is up; no lifecycle control.
3. **Child process** ← chosen: The portal spawns `astro dev` on startup (same pattern used for OC and code-server). The portal reverse-proxies `/docs/**` to it. Astro watches the filesystem; changes appear in seconds. The portal kills it on shutdown.

Option 3 keeps the user experience simple — one process to manage, one URL to remember — while giving the full power of Astro's dev server.

---

## Lesson 2 — Initialising the Astro + Starlight Project

### Where the Astro project lives

The Astro project is a subdirectory of the portal repo:

```
workspace-portal/
  docs/               ← Astro project lives here
    package.json
    astro.config.mjs
    src/
    scripts/
  cmd/
  internal/
  ...
```

This is deliberate: `go:embed` requires the embedded path to be inside the module (we will use this in Lesson 6 for embedding the Astro binary path configuration). More importantly, keeping everything in one repo means one `git clone` gets you the full system.

### Initialise the Astro project

```bash
cd ~/workspaces/fea/lib/workspace-portal
npm create astro@latest -- --template starlight docs
```

The CLI will ask several questions. Choose:
- **Where should we create your new project?** → `docs` (already suggested by `-- docs`)
- **How would you like to start your new project?** → Use template (Starlight)
- **Install dependencies?** → Yes
- **Initialize a new git repository?** → No (the parent repo already has git)

After the command completes:

```
docs/
  .gitignore         ← Astro generates this; check it doesn't conflict with the root .gitignore
  package.json
  astro.config.mjs
  tsconfig.json
  src/
    assets/
      houston.webp
    content/
      docs/
        index.mdx    ← default welcome page
    env.d.ts
```

### Verify it works

```bash
cd docs
npm run dev
```

Visit `http://localhost:4321` — you should see the default Starlight welcome page.

`Ctrl-C` to stop it. You will not run it directly from here on — the portal will manage it.

### Add `docs/` to the root `.gitignore` exclusion list

Astro generates a `docs/.gitignore`. The root repo `.gitignore` should also ignore Astro's output:

```gitignore
# Astro docs build output
docs/dist/
docs/.astro/
docs/node_modules/
```

Add these to the root `.gitignore` if they are not already covered.

---

## Lesson 3 — Astro Project Structure and Content Collections

### Astro's content collection system

Starlight uses Astro's **content collections** to manage documentation files. A content collection is a directory of structured files (`.md`, `.mdx`, `.json`, `.yaml`) that Astro type-checks and makes available to templates.

The Starlight template creates one collection: `src/content/docs/`. Every `.md` and `.mdx` file in this directory becomes a page in the documentation site. The sidebar is generated automatically from the directory structure.

```
src/content/docs/
  index.mdx                    → /docs/
  getting-started.md           → /docs/getting-started
  guides/
    first-steps.md             → /docs/guides/first-steps
    advanced.mdx               → /docs/guides/advanced
```

### Frontmatter

Starlight reads YAML frontmatter from each file:

```yaml
---
title: "My Page"
description: "What this page covers"
sidebar:
  order: 2
  badge: New
---
```

If a file has no frontmatter, Starlight derives the title from the first `# Heading`. This is important: most of your existing project `README.md` files will have no Starlight frontmatter, and that is fine.

### `astro.config.mjs`

After scaffolding, `astro.config.mjs` looks like:

```js
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  integrations: [
    starlight({
      title: 'Workspace Docs',
      social: {
        github: 'https://github.com/yourusername/workspace-portal',
      },
      sidebar: [
        { label: 'Guides', autogenerate: { directory: 'guides' } },
      ],
    }),
  ],
})
```

You will replace the static `sidebar` with `autogenerate` covering the whole `docs/` root in Lesson 4. For now leave it as-is.

### The base path

When served through the portal's reverse proxy at `/docs`, Astro needs to know its base path so that asset URLs are correct. Add `base: '/docs'` to the config:

```js
export default defineConfig({
  base: '/docs',
  integrations: [
    starlight({
      title: 'Workspace Docs',
      // ...
    }),
  ],
})
```

This tells Astro: all links and asset paths should be prefixed with `/docs`. Without this, a page at `/docs/guides/intro` would try to load its CSS from `/assets/...` instead of `/docs/assets/...`, resulting in 404s.

---

## Lesson 4 — Collecting Documentation Files with `.gitignore` Filtering

### The problem

Astro's content collection reads from `src/content/docs/` inside the Astro project. Your actual documentation is scattered across the workspaces root — a completely different directory. Astro does not support pointing a content collection at an arbitrary filesystem path outside the project.

The solution is a **collector script** that:
1. Walks the `DOCS_ROOT` directory
2. Filters out gitignored paths (using the `ignore` npm package)
3. Copies `.md` and `.mdx` files into `src/content/docs/`, preserving the relative directory structure

The script runs before Astro starts and is re-run via a file watcher integration (Lesson 5) when files change.

### Install the `ignore` package

```bash
cd docs
npm install ignore
```

`ignore` implements git's `.gitignore` matching algorithm exactly — the same rules as `git check-ignore`. It supports nested `.gitignore` files, negation patterns, and directory-only patterns.

### Write `docs/scripts/collect-docs.js`

Create the file:

```js
// docs/scripts/collect-docs.js
//
// Walks DOCS_ROOT, copies .md/.mdx files into src/content/docs/,
// preserving directory structure, respecting all .gitignore files found.
//
// Usage:
//   DOCS_ROOT=/path/to/workspaces node scripts/collect-docs.js

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ignore from 'ignore'

// --- Configuration -------------------------------------------------------

const DOCS_ROOT = process.env.DOCS_ROOT
if (!DOCS_ROOT) {
  console.error('ERROR: DOCS_ROOT env var is required')
  process.exit(1)
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'content', 'docs')

// --- Helpers -------------------------------------------------------------

/**
 * Read a .gitignore file at `dir` and return an `ignore` instance seeded
 * with those rules, or null if no .gitignore exists.
 */
function loadGitignore(dir) {
  const gitignorePath = path.join(dir, '.gitignore')
  if (!fs.existsSync(gitignorePath)) return null
  const rules = fs.readFileSync(gitignorePath, 'utf8')
  return ignore().add(rules)
}

/**
 * Recursively walk `dir`, collecting .md and .mdx files.
 * `ignoreStack` is an array of { base: string, ig: ignore } objects,
 * one per ancestor directory that had a .gitignore.
 */
function walk(dir, ignoreStack, results) {
  // Load .gitignore at this level if present
  const localIg = loadGitignore(dir)
  const currentStack = localIg
    ? [...ignoreStack, { base: dir, ig: localIg }]
    : ignoreStack

  let entries
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true })
  } catch {
    // Permission denied or broken symlink — skip silently
    return
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    // Check against every .gitignore in the ancestor stack
    const isIgnored = currentStack.some(({ base, ig }) => {
      const rel = path.relative(base, fullPath)
      return ig.ignores(rel)
    })
    if (isIgnored) continue

    if (entry.isDirectory()) {
      // Skip hidden system directories that are never documentation
      if (entry.name === '.git' || entry.name === 'node_modules') continue
      walk(fullPath, currentStack, results)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase()
      if (ext === '.md' || ext === '.mdx') {
        results.push(fullPath)
      }
    }
  }
}

// --- Main ----------------------------------------------------------------

function collect() {
  console.log(`[collect-docs] Scanning ${DOCS_ROOT}`)

  const files = []
  walk(DOCS_ROOT, [], files)

  // Clear the output directory before writing
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  let copied = 0
  for (const srcPath of files) {
    const rel = path.relative(DOCS_ROOT, srcPath)
    const destPath = path.join(OUTPUT_DIR, rel)
    fs.mkdirSync(path.dirname(destPath), { recursive: true })
    fs.copyFileSync(srcPath, destPath)
    copied++
  }

  console.log(`[collect-docs] Copied ${copied} files to ${OUTPUT_DIR}`)
}

collect()
```

### Key design decisions in the script

**Why copy instead of symlink?** Astro's dev server watches `src/content/docs/` for changes. If the files are symlinks to an external directory, Vite's file watcher may or may not follow them depending on the OS. Copies are reliable. The performance cost is negligible for documentation files.

**Why clear `OUTPUT_DIR` before each run?** To handle deletions. If you delete `README.md` in the workspaces root, the collector removes it from `src/content/docs/` on the next run.

**Why the `ignoreStack` array?** Git's `.gitignore` is hierarchical: a `.gitignore` in a subdirectory applies only to that subdirectory and its descendants. The stack tracks all active `.gitignore` files and their base directories so each file is tested against all relevant rules.

### Test it manually

```bash
cd docs
DOCS_ROOT=~/workspaces node scripts/collect-docs.js
ls src/content/docs/
```

You should see a mirror of the `.md`/`.mdx` files from your workspaces, respecting `.gitignore` rules.

### Update `astro.config.mjs` to autogenerate the sidebar

Replace the static sidebar config with one that autogenerates from the entire `docs/` root:

```js
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  base: '/docs',
  integrations: [
    starlight({
      title: 'Workspace Docs',
      sidebar: [
        {
          label: 'Documentation',
          autogenerate: { directory: '.' },
        },
      ],
    }),
  ],
})
```

`autogenerate: { directory: '.' }` tells Starlight to generate the sidebar from all files in `src/content/docs/` — which is exactly what the collector populates.

---

## Lesson 5 — Live Reload via Astro Dev Integration

### The problem

Running the collector script once before `astro dev` starts is not enough. When you edit a file in `DOCS_ROOT`, the collector needs to re-run and copy the updated file into `src/content/docs/` so Astro's Vite HMR can pick it up.

Astro's integration API lets you hook into the dev server lifecycle. You can add a file watcher that triggers the collector on any change in `DOCS_ROOT`.

### Write `docs/src/integrations/collect-docs-integration.js`

Create the directory and file:

```bash
mkdir -p docs/src/integrations
```

```js
// docs/src/integrations/collect-docs-integration.js
//
// Astro integration that:
// 1. Runs the collector before the dev server starts
// 2. Watches DOCS_ROOT for .md/.mdx changes and re-runs the collector

import { execFileSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import chokidar from 'chokidar'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const COLLECTOR = path.join(__dirname, '..', '..', 'scripts', 'collect-docs.js')

function runCollector() {
  const docsRoot = process.env.DOCS_ROOT
  if (!docsRoot) {
    console.warn('[collect-docs] DOCS_ROOT not set — skipping collection')
    return
  }
  try {
    execFileSync(process.execPath, [COLLECTOR], {
      env: { ...process.env, DOCS_ROOT: docsRoot },
      stdio: 'inherit',
    })
  } catch (err) {
    console.error('[collect-docs] Collection failed:', err.message)
  }
}

export function collectDocsIntegration() {
  return {
    name: 'collect-docs',
    hooks: {
      'astro:server:setup': ({ server }) => {
        // Run once before the dev server is ready
        runCollector()

        // Watch DOCS_ROOT for changes
        const docsRoot = process.env.DOCS_ROOT
        if (!docsRoot) return

        const watcher = chokidar.watch(docsRoot, {
          ignored: [
            /(^|[/\\])\../,     // dotfiles
            /node_modules/,
            /\.git/,
          ],
          persistent: true,
          ignoreInitial: true,
        })

        const onchange = (filePath) => {
          const ext = path.extname(filePath).toLowerCase()
          if (ext === '.md' || ext === '.mdx' || filePath.endsWith('.gitignore')) {
            console.log(`[collect-docs] Change detected: ${filePath}`)
            runCollector()
          }
        }

        watcher.on('add', onchange)
        watcher.on('change', onchange)
        watcher.on('unlink', onchange)

        // Clean up watcher when dev server closes
        server.httpServer?.on('close', () => watcher.close())
      },
      'astro:build:start': () => {
        // Also run before production builds
        runCollector()
      },
    },
  }
}
```

### Install `chokidar`

`chokidar` is a reliable cross-platform file watcher (the same one Vite uses internally):

```bash
cd docs
npm install chokidar
```

### Wire the integration into `astro.config.mjs`

```js
import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import { collectDocsIntegration } from './src/integrations/collect-docs-integration.js'

export default defineConfig({
  base: '/docs',
  integrations: [
    collectDocsIntegration(),    // ← runs before Starlight processes content
    starlight({
      title: 'Workspace Docs',
      sidebar: [
        {
          label: 'Documentation',
          autogenerate: { directory: '.' },
        },
      ],
    }),
  ],
})
```

### Test the full loop

```bash
cd docs
DOCS_ROOT=~/workspaces npm run dev
```

1. Open `http://localhost:4321/docs` — you should see your docs tree in the sidebar.
2. Open any `.md` file in your workspaces and add a line.
3. Watch the terminal — you should see `[collect-docs] Change detected: ...` followed by Vite HMR refreshing the page.

Press `Ctrl-C` when done.

---

## Lesson 6 — Implementing `internal/docs/runner.go`

### The `Runner` interface (recap)

From Course 02, the `Runner` interface is:

```go
// internal/session/runner.go
type Runner interface {
    Start(ctx context.Context) error
    Stop() error
    Port() int
    HealthURL() string
}
```

The docs runner implements this interface to start and stop the Astro dev server process.

### Create `internal/docs/runner.go`

```go
// internal/docs/runner.go
package docs

import (
    "context"
    "fmt"
    "net/http"
    "os"
    "os/exec"
    "path/filepath"
    "time"
)

// Runner manages an Astro dev server child process.
type Runner struct {
    port       int
    docsRoot   string
    astroDir   string
    nodeBinary string
    cmd        *exec.Cmd
}

// Config holds configuration for the docs runner.
type Config struct {
    // Port is the localhost port the Astro dev server will listen on.
    Port int
    // DocsRoot is the directory scanned for .md/.mdx files (DOCS_ROOT env var).
    DocsRoot string
    // AstroDir is the path to the Astro project directory (the docs/ subdirectory).
    AstroDir string
    // NodeBinary is the path to the node executable (default: "node").
    NodeBinary string
}

// New creates a new docs Runner. It does not start the process.
func New(cfg Config) *Runner {
    nodeBinary := cfg.NodeBinary
    if nodeBinary == "" {
        nodeBinary = "node"
    }
    return &Runner{
        port:       cfg.Port,
        docsRoot:   cfg.DocsRoot,
        astroDir:   cfg.AstroDir,
        nodeBinary: nodeBinary,
    }
}

// Port returns the port the Astro server will listen on.
func (r *Runner) Port() int {
    return r.port
}

// HealthURL returns the URL used to check if the Astro server is ready.
func (r *Runner) HealthURL() string {
    return fmt.Sprintf("http://127.0.0.1:%d/docs", r.port)
}

// Start spawns the Astro dev server.
//
// It resolves the astro binary from the docs project's node_modules,
// then runs:
//
//   node ./node_modules/.bin/astro dev --port {port} --host 127.0.0.1
//
// with DOCS_ROOT set in the environment.
func (r *Runner) Start(ctx context.Context) error {
    astroBin := filepath.Join(r.astroDir, "node_modules", ".bin", "astro")
    if _, err := os.Stat(astroBin); err != nil {
        return fmt.Errorf("docs: astro binary not found at %s — run `npm ci` in %s: %w",
            astroBin, r.astroDir, err)
    }

    r.cmd = exec.CommandContext(ctx,
        r.nodeBinary,
        astroBin,
        "dev",
        "--port", fmt.Sprintf("%d", r.port),
        "--host", "127.0.0.1",
    )
    r.cmd.Dir = r.astroDir
    r.cmd.Env = append(os.Environ(),
        "DOCS_ROOT="+r.docsRoot,
        "FORCE_COLOR=1", // preserve coloured log output
    )
    r.cmd.Stdout = os.Stdout
    r.cmd.Stderr = os.Stderr

    if err := r.cmd.Start(); err != nil {
        return fmt.Errorf("docs: failed to start astro: %w", err)
    }
    return nil
}

// Stop kills the Astro dev server process.
func (r *Runner) Stop() error {
    if r.cmd == nil || r.cmd.Process == nil {
        return nil
    }
    if err := r.cmd.Process.Kill(); err != nil {
        return fmt.Errorf("docs: failed to kill astro process: %w", err)
    }
    _ = r.cmd.Wait() // reap the process; ignore the "killed" exit error
    return nil
}

// WaitHealthy polls the Astro health URL until the server responds with HTTP 200
// or the context is cancelled.
//
// Astro's dev server takes a few seconds to start because it runs the
// collect-docs script before Vite starts. A 30-second timeout is generous.
func (r *Runner) WaitHealthy(ctx context.Context) error {
    deadline := time.Now().Add(60 * time.Second) // Astro cold start can be slow
    client := &http.Client{Timeout: 2 * time.Second}

    for {
        select {
        case <-ctx.Done():
            return ctx.Err()
        default:
        }

        if time.Now().After(deadline) {
            return fmt.Errorf("docs: timed out waiting for astro to become healthy")
        }

        resp, err := client.Get(r.HealthURL())
        if err == nil {
            resp.Body.Close()
            if resp.StatusCode < 500 {
                return nil // server is up
            }
        }

        time.Sleep(1 * time.Second)
    }
}
```

### Why 60 seconds for the health timeout?

The Astro dev server has a longer cold start than OC or code-server because it:
1. Starts Node.js
2. Imports all Astro + Starlight npm packages
3. Runs the `collect-docs.js` script (which may walk a large directory tree)
4. Starts Vite's dev server and bundles the initial page

On a modern Mac this takes 5–15 seconds. 60 seconds gives plenty of headroom without impacting the happy path.

### Add `docs.Config` to `internal/config`

Open `internal/config/config.go` and add the `Docs` section:

```go
type DocsConfig struct {
    Enabled    bool   `yaml:"enabled"`
    Root       string `yaml:"root"`        // defaults to WorkspacesRoot
    Port       int    `yaml:"port"`        // default: 4300
    NodeBinary string `yaml:"node_binary"` // default: "node"
    AstroDir   string `yaml:"astro_dir"`   // default: ./docs (relative to binary)
}

type Config struct {
    WorkspacesRoot string      `yaml:"workspaces_root"`
    PortalPort     int         `yaml:"portal_port"`
    SecretsDir     string      `yaml:"secrets_dir"`
    OC             OCConfig    `yaml:"oc"`
    VSCode         VSCodeConfig `yaml:"vscode"`
    Tailscale      TailscaleConfig `yaml:"tailscale"`
    FS             FSConfig    `yaml:"fs"`
    Docs           DocsConfig  `yaml:"docs"`  // ← new
}
```

Add defaults in the `loadDefaults` function:

```go
func loadDefaults(cfg *Config) {
    // ... existing defaults ...
    if cfg.Docs.Port == 0 {
        cfg.Docs.Port = 4300
    }
    if cfg.Docs.NodeBinary == "" {
        cfg.Docs.NodeBinary = "node"
    }
    if cfg.Docs.AstroDir == "" {
        cfg.Docs.AstroDir = "./docs"
    }
    if cfg.Docs.Root == "" {
        cfg.Docs.Root = cfg.WorkspacesRoot
    }
    // Docs is enabled by default
    // Note: zero value of bool is false; use a pointer or explicit opt-out field
    // to distinguish "not set" from "set to false". For simplicity, we treat
    // absent field as enabled=true by adding an explicit check in main.go.
}
```

> **Tip:** Go's zero value for `bool` is `false`. If you add `Enabled bool` to the struct and the user does not set it in config, it will be `false` — silently disabling the feature. The simplest fix is to use `*bool` (a pointer to bool) for optional boolean fields, so you can distinguish between "not set" (nil) and "explicitly set to false". Alternatively, name the field `Disabled bool` and invert the logic. For this course, we use `Disabled bool` for clarity:

```go
type DocsConfig struct {
    Disabled   bool   `yaml:"disabled"`    // set to true to turn off the viewer
    Root       string `yaml:"root"`
    Port       int    `yaml:"port"`
    NodeBinary string `yaml:"node_binary"`
    AstroDir   string `yaml:"astro_dir"`
}
```

---

## Lesson 7 — Reverse Proxy: `GET /docs/**` in `internal/server`

### What is a reverse proxy?

A reverse proxy is a server that forwards requests from clients to another server, then returns that server's response to the client. The client sees only the proxy — it does not know the upstream server exists.

In the portal: the browser sends `GET /docs/guides/intro` to Go. Go forwards it to `http://127.0.0.1:4300/docs/guides/intro` (the Astro dev server), gets back an HTML page, and returns it to the browser. The browser never talks to Astro directly.

Go's standard library includes `net/http/httputil.NewSingleHostReverseProxy` for exactly this:

```go
proxy := httputil.NewSingleHostReverseProxy(&url.URL{
    Scheme: "http",
    Host:   "127.0.0.1:4300",
})
```

### Add the docs handler to `internal/server/handlers.go`

```go
// internal/server/handlers.go (new handler, add alongside existing ones)

import (
    "net/http"
    "net/http/httputil"
    "net/url"
    "fmt"
)

// DocsHandler returns an http.Handler that reverse-proxies to the Astro
// dev server running on the given port.
//
// It does NOT strip the /docs prefix — Astro is configured with base: '/docs'
// so it expects to receive /docs/... paths.
func DocsHandler(port int) http.Handler {
    target := &url.URL{
        Scheme: "http",
        Host:   fmt.Sprintf("127.0.0.1:%d", port),
    }
    proxy := httputil.NewSingleHostReverseProxy(target)

    // Improve error messages when the Astro server is not yet up
    proxy.ErrorHandler = func(w http.ResponseWriter, r *http.Request, err error) {
        http.Error(w,
            "Documentation server is starting up, please try again in a moment.\n\nError: "+err.Error(),
            http.StatusBadGateway,
        )
    }

    return proxy
}
```

### Register the route in `internal/server/server.go`

```go
// internal/server/server.go — inside the route registration block

if !cfg.Docs.Disabled {
    docsHandler := DocsHandler(cfg.Docs.Port)
    mux.Handle("/docs/", docsHandler)
    mux.Handle("/docs", http.RedirectHandler("/docs/", http.StatusMovedPermanently))
}
```

Two routes are registered:
- `/docs/` — the prefix match that forwards everything under `/docs/` to Astro
- `/docs` — redirect to `/docs/` so that typing `/docs` in the browser works

### Add a "Docs" link to the nav

In `templates/layout.html`, add a link to the docs in the nav bar:

```html
<nav>
  <a href="/">Portal</a>
  {{if not .DocsDisabled}}
  <a href="/docs">Docs</a>
  {{end}}
</nav>
```

Pass `DocsDisabled` from the handler via the template data struct. In `internal/server/handlers.go`:

```go
type layoutData struct {
    // ... existing fields ...
    DocsDisabled bool
}

func (s *Server) handleIndex(w http.ResponseWriter, r *http.Request) {
    data := layoutData{
        // ... existing fields ...
        DocsDisabled: s.cfg.Docs.Disabled,
    }
    // ... render template ...
}
```

---

## Lesson 8 — Wiring the Docs Runner in `main.go`

### Starting the docs runner on portal startup

The docs runner is started once when the portal starts, unconditionally (unless `docs.disabled: true`). It is not user-initiated and is not tracked in the session manager.

Open `cmd/portal/main.go` and add the docs startup block:

```go
import (
    // ... existing imports ...
    "github.com/yourusername/workspace-portal/internal/docs"
)

func main() {
    // ... config loading, server setup as before ...

    // Start the docs runner if enabled
    var docsRunner *docs.Runner
    if !cfg.Docs.Disabled {
        docsRunner = docs.New(docs.Config{
            Port:       cfg.Docs.Port,
            DocsRoot:   cfg.Docs.Root,
            AstroDir:   cfg.Docs.AstroDir,
            NodeBinary: cfg.Docs.NodeBinary,
        })

        log.Printf("docs: starting Astro dev server on port %d", cfg.Docs.Port)
        if err := docsRunner.Start(context.Background()); err != nil {
            log.Fatalf("docs: failed to start: %v", err)
        }

        // Wait for Astro to be healthy before the portal accepts traffic
        // (optional — you can remove this to start the portal immediately
        //  and show the "starting up" message from the proxy error handler)
        go func() {
            if err := docsRunner.WaitHealthy(context.Background()); err != nil {
                log.Printf("docs: warning — health check failed: %v", err)
            } else {
                log.Printf("docs: Astro dev server is healthy at port %d", cfg.Docs.Port)
            }
        }()
    }

    // ... start HTTP server ...

    // Graceful shutdown
    // In your signal handler (or deferred cleanup):
    if docsRunner != nil {
        if err := docsRunner.Stop(); err != nil {
            log.Printf("docs: error stopping Astro: %v", err)
        }
    }
}
```

### Graceful shutdown with `os/signal`

If `main.go` does not already handle `SIGINT`/`SIGTERM` gracefully, add it now:

```go
import (
    "context"
    "os"
    "os/signal"
    "syscall"
)

func main() {
    // ... setup ...

    ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
    defer cancel()

    // Start docs runner with the cancellable context so it is killed on signal
    if !cfg.Docs.Disabled {
        docsRunner = docs.New(docs.Config{ /* ... */ })
        if err := docsRunner.Start(ctx); err != nil {
            log.Fatalf("docs: %v", err)
        }
    }

    // Start the HTTP server in a goroutine
    srv := &http.Server{Addr: fmt.Sprintf(":%d", cfg.PortalPort), Handler: mux}
    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("server: %v", err)
        }
    }()

    log.Printf("portal: listening on :%d", cfg.PortalPort)

    // Block until signal
    <-ctx.Done()
    log.Println("portal: shutting down")

    // Shut down HTTP server
    shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer shutdownCancel()
    _ = srv.Shutdown(shutdownCtx)

    // Docs runner is killed automatically because we passed ctx to Start()
    // (exec.CommandContext kills the process when ctx is cancelled)
}
```

### Verify the full loop

```bash
cd ~/workspaces/fea/lib/workspace-portal
DOCS_ROOT=~/workspaces go run ./cmd/portal
```

1. Watch the terminal — you should see Astro starting up.
2. Visit `http://localhost:3000` — the nav should show a "Docs" link.
3. Click "Docs" — you should be proxied to `http://localhost:3000/docs/` and see the Starlight site with your workspace docs in the sidebar.
4. Edit a `.md` file in `~/workspaces` — within a few seconds, the sidebar should update.
5. `Ctrl-C` — the Astro process should be killed.

---

## Lesson 9 — Docker: Three-Stage Build with Node.js at Runtime

### Why the Dockerfile changes

The original Dockerfile had two stages:
1. **Build** (`golang:alpine`) — compiles the Go binary
2. **Runtime** (`alpine:latest`) — runs the binary

The docs runner spawns `astro dev` — a Node.js process. Node.js must be available in the runtime image. We add it via a three-stage build.

### Updated `deploy/docker/Dockerfile`

```dockerfile
# ─── Stage 1: Install Astro dependencies ───────────────────────────────────
FROM node:20-alpine AS node-deps

WORKDIR /app/docs
COPY docs/package.json docs/package-lock.json ./
RUN npm ci --prefer-offline

# ─── Stage 2: Build the Go binary ──────────────────────────────────────────
FROM golang:1.22-alpine AS go-build

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-s -w" \
    -o /workspace-portal \
    ./cmd/portal

# ─── Stage 3: Runtime ──────────────────────────────────────────────────────
# Use a Node.js Alpine image so `node` is available for `astro dev`
FROM node:20-alpine AS runtime

# Install ca-certificates for HTTPS outbound calls (health checks)
RUN apk add --no-cache ca-certificates

# Non-root user
RUN addgroup -S portal && adduser -S portal -G portal
USER portal

WORKDIR /app

# Copy the Go binary from Stage 2
COPY --from=go-build --chown=portal:portal /workspace-portal ./workspace-portal

# Copy the Astro project (source + node_modules) from Stage 1
COPY --from=node-deps --chown=portal:portal /app/docs ./docs
# Also copy the Astro source files (config, scripts, src/)
COPY --chown=portal:portal docs/astro.config.mjs ./docs/
COPY --chown=portal:portal docs/tsconfig.json ./docs/
COPY --chown=portal:portal docs/scripts/ ./docs/scripts/
COPY --chown=portal:portal docs/src/ ./docs/src/

EXPOSE 3000 4300

ENTRYPOINT ["./workspace-portal"]
```

### Key decisions

**Why `node:20-alpine` instead of `alpine` + installing Node?**
`node:20-alpine` is the official lightweight Node.js image. It is ~50 MB — smaller than `alpine` + `apk add nodejs npm` because the Node.js Alpine image uses a pre-compiled binary.

**Why copy the Astro source files in Stage 3?**
`astro dev` reads `astro.config.mjs`, `src/`, and `scripts/` at runtime. The `node_modules/` directory (from Stage 1) is also needed for imports. We copy both.

**Why not run `astro build` in Docker and serve the static output?**
The docs viewer is designed to serve live content from `DOCS_ROOT` (mounted from the host). A static build would snapshot the docs at image build time — defeating the purpose of live reload.

### Updated `docker-compose.yml`

```yaml
services:
  portal:
    build:
      context: .
      dockerfile: deploy/docker/Dockerfile
    ports:
      - "3000:3000"
      - "4300:4300"
    volumes:
      - "${WORKSPACES_ROOT:-$HOME/workspaces}:/workspaces:ro"
      - "${SECRETS_DIR:-$HOME/.secrets}:/run/secrets:ro"
    environment:
      PORTAL_WORKSPACES_ROOT: /workspaces
      PORTAL_PORTAL_PORT: "3000"
      PORTAL_DOCS_PORT: "4300"
      PORTAL_DOCS_ROOT: /workspaces
      PORTAL_DOCS_ASTRO_DIR: /app/docs
    restart: unless-stopped
```

### Test the Docker build

```bash
docker build -t workspace-portal:latest -f deploy/docker/Dockerfile .
docker run --rm \
  -p 3000:3000 -p 4300:4300 \
  -v ~/workspaces:/workspaces:ro \
  -e PORTAL_WORKSPACES_ROOT=/workspaces \
  -e PORTAL_DOCS_ROOT=/workspaces \
  -e PORTAL_DOCS_ASTRO_DIR=/app/docs \
  workspace-portal:latest
```

Visit `http://localhost:3000/docs` — you should see the Starlight site served from the container.

> **Note on OrbStack:** If you are using OrbStack instead of Docker Desktop, the `docker build` and `docker run` commands are identical. OrbStack provides the same Docker CLI. The only difference is startup time (OrbStack is faster) and memory usage (OrbStack uses less).

---

## Lesson 10 — Customising Starlight and the Production Workflow

### Customising the Starlight theme

Starlight is customisable via `astro.config.mjs` and a custom CSS file. Common customisations:

**Site title and favicon:**
```js
starlight({
  title: 'My Workspace Docs',
  favicon: '/favicon.ico',
  // ...
})
```

**Custom CSS (override Starlight's default colours):**

Create `docs/src/assets/custom.css`:
```css
:root {
  --sl-color-accent-low: #1a1a2e;
  --sl-color-accent: #4f8ef7;
  --sl-color-accent-high: #a8c8ff;
}
```

Reference it in `astro.config.mjs`:
```js
starlight({
  customCss: ['./src/assets/custom.css'],
  // ...
})
```

**Add a link back to the portal in the header:**
```js
starlight({
  // ...
  head: [
    {
      tag: 'meta',
      attrs: { name: 'portal-link', content: '/' },
    },
  ],
  components: {
    // You can override individual Starlight components with your own .astro files
    // See: https://starlight.astro.build/guides/overriding-components/
  },
})
```

A simpler approach: add a sidebar link to the portal:
```js
starlight({
  sidebar: [
    { label: '← Back to Portal', link: '/' },
    { label: 'Documentation', autogenerate: { directory: '.' } },
  ],
})
```

### `astro dev` vs `astro preview`

| Command | Use case | MDX rendering | File watching |
|---|---|---|---|
| `astro dev` | Development, live editing | Server-side on demand | Yes (Vite HMR) |
| `astro build` | One-time static build | At build time | No |
| `astro preview` | Serve a previous `astro build` output | Static (pre-built) | No |

For workspace-portal, `astro dev` is the right choice because:
- Docs are live (you want changes to appear immediately)
- The workspaces root is mounted at runtime (you cannot pre-build its content into a static image)
- Dev performance on a local machine is excellent

For a high-traffic or production deployment where rebuild latency is acceptable, a watcher-triggered rebuild approach (watch → `astro build` → serve `dist/`) would reduce memory usage. This is a future optimisation.

### `Makefile` targets

Add a `Makefile` to the repo root:

```makefile
.PHONY: docs-install docs-dev build dev

# Install Astro dependencies
docs-install:
	cd docs && npm ci

# Run the Astro dev server standalone (for working on the Starlight config)
docs-dev:
	DOCS_ROOT=$(DOCS_ROOT) cd docs && npm run dev

# Build the Go binary (does not include the Astro project — it runs at runtime)
build:
	CGO_ENABLED=0 go build -o bin/workspace-portal ./cmd/portal

# Run the full portal in development (Go server + Astro child process)
dev:
	DOCS_ROOT=$(or $(DOCS_ROOT),$(HOME)/workspaces) go run ./cmd/portal
```

Usage:
```bash
# First time setup
make docs-install

# Start the portal (Go spawns Astro automatically)
DOCS_ROOT=~/workspaces make dev

# Build a production binary
make build
```

### Production checklist additions (for Course 05 launchd setup)

Add to the launchd plist's `EnvironmentVariables`:
```xml
<key>PORTAL_DOCS_ROOT</key>
<string>/Users/yourname/workspaces</string>
<key>PORTAL_DOCS_PORT</key>
<string>4300</string>
<key>PORTAL_DOCS_ASTRO_DIR</key>
<string>/Users/yourname/workspaces/fea/lib/workspace-portal/docs</string>
```

And add to the Tailscale serve configuration so the docs port is also accessible:
```bash
tailscale serve --bg --https=4300 http://localhost:4300
```

Or simply rely on the portal's `/docs` reverse proxy — external clients only need to access port 3000.

### Summary

In this course you have:

1. Learned what Astro and Starlight are and why they are the right tool for this feature
2. Scaffolded an Astro Starlight project inside the portal repo
3. Written a collector script that walks `DOCS_ROOT`, respects `.gitignore`, and populates Astro's content directory
4. Built an Astro integration that runs the collector before dev startup and watches for file changes
5. Implemented `internal/docs/runner.go` — a `Runner` that spawns and manages the Astro child process
6. Added a `/docs/**` reverse proxy route to the Go server
7. Wired the docs runner into `main.go` with graceful shutdown
8. Updated the Dockerfile to a three-stage build with Node.js at runtime
9. Customised the Starlight theme and added a nav link back to the portal
10. Established `Makefile` targets for the development and build workflow

The portal now serves a fully rendered, searchable, live-updating documentation site at `/docs` — driven by the `.md` and `.mdx` files already scattered across your workspaces.
