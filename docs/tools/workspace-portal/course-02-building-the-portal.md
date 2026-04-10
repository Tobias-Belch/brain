---
title: "Course 02 — Building the Portal in Go"
---

# Course 02 — Building the Portal in Go

**Goal:** Implement every module of workspace-portal from scratch, producing a working Go binary.  
**Prerequisite:** [Course 01 — Go Foundations](./course-01-go-foundations.md)  
**Output:** A compiled `workspace-portal` binary that serves an HTTP server, lists directories, and manages OpenCode/VS Code processes. The UI is wired up in Course 03.

---

## Lesson 1 — Scaffolding the Repository

Before writing a line of application code, you need a working project skeleton: a directory, a Git repo, a module, the package layout, and the tooling files (`Makefile`, `.gitignore`). Getting this right up front means every subsequent lesson starts from a clean, compilable state.

### Create the directory and initialise the module

```bash
mkdir -p ~/workspaces/fea/lib/workspace-portal
cd ~/workspaces/fea/lib/workspace-portal
git init
go mod init workspace-portal
```

`go mod init` creates `go.mod`, which declares the module name. Every import path inside this project will be rooted here — for example, `workspace-portal/internal/config`. Because this is a personal tool you won't be publishing, a plain name without a domain works fine.

### Create the directory structure

```bash
mkdir -p cmd/portal
mkdir -p internal/config
mkdir -p internal/fs
mkdir -p internal/session
mkdir -p internal/server
mkdir -p templates
mkdir -p static
mkdir -p deploy/launchd
mkdir -p deploy/docker
```

The directories map directly to the modules you'll build:

| Directory | Purpose |
|---|---|
| `cmd/portal/` | The binary entry point (`main.go`). One sub-directory per binary is the convention. |
| `internal/config/` | YAML loading, env var overrides, secrets resolution. |
| `internal/fs/` | Directory tree listing with pruning and git detection. |
| `internal/session/` | Process lifecycle — start, stop, health check, state persistence. |
| `internal/server/` | HTTP mux, route handlers, SSE streaming. |
| `templates/` | Go HTML templates (wired up in Course 03). |
| `static/` | CSS and JS assets (Course 03). |
| `deploy/` | Deployment configs — launchd plist and Dockerfile. |

> **No `src/` directory:** Go does not treat `src/` as special. The idiomatic layout places packages directly under named directories (`cmd/`, `internal/`, etc.) at the module root. A top-level `src/` is a Java/Maven habit — avoid it in Go.

### `go.mod` — add external dependencies

The portal has three external dependencies: `gopkg.in/yaml.v3` for parsing the config file, `github.com/caarlos0/env/v11` for struct-tag-driven environment variable overrides, and `github.com/sabhiram/go-gitignore` for parsing `.gitignore` files when listing directories. The first two have zero transitive dependencies. Everything else — HTTP, file I/O, process management, JSON, concurrency — is covered by the Go standard library.

```bash
go get gopkg.in/yaml.v3
go get github.com/caarlos0/env/v11
go get github.com/sabhiram/go-gitignore
```

Your `go.mod` will now look like:

```
module workspace-portal

go 1.22

require (
    github.com/caarlos0/env/v11 v11.4.0
    github.com/sabhiram/go-gitignore v0.0.0-20210923224102-525f6e181f06
    gopkg.in/yaml.v3 v3.0.1
)
```

### `cmd/portal/main.go` — the entry point

`main.go` is intentionally thin. Its only job is to wire together three things:

1. **Parse CLI flags** — so the config path can be overridden at the command line.
2. **Load config** — delegate to `internal/config`, fail fast and loudly if it's wrong.
3. **Start the server** — delegate to `internal/server`, which owns all HTTP concerns.

This pattern — a thin `main` that delegates immediately — keeps the entry point testable (you can't test `main` directly in Go, but you can test `config.Load` and `server.Start`).

```go
package main

import (
    "flag"
    "fmt"
    "log"
    "os"

    "workspace-portal/internal/config"
    "workspace-portal/internal/server"
)

func main() {
    // CLI flags
    configPath := flag.String("config", "", "path to config.yaml")
    flag.Parse()

    // Resolve config path: flag > env var > default
    if *configPath == "" {
        if v := os.Getenv("PORTAL_CONFIG"); v != "" {
            *configPath = v
        } else {
            *configPath = "config.yaml"
        }
    }

    // Load config
    cfg, err := config.Load(*configPath)
    if err != nil {
        fmt.Fprintf(os.Stderr, "config error: %v\n", err)
        os.Exit(1)
    }

    // Start server
    log.Printf("workspace-portal starting on :%d", cfg.PortalPort)
    if err := server.Start(cfg); err != nil {
        log.Fatal(err)
    }
}
```

`flag.String` returns a `*string`, so you dereference it with `*configPath`. The resolution order (flag → env var → default) is a common pattern for CLI tools: it lets you override in scripts without editing config files.

### `Makefile`

The Makefile wraps the commands you'll run repeatedly so you don't have to remember the flags:

```makefile
.PHONY: build run test install

build:
	go build -ldflags="-s -w" -o bin/workspace-portal ./cmd/portal

run:
	go run ./cmd/portal --config config.yaml

test:
	go test -v ./...

install: build
	cp bin/workspace-portal /usr/local/bin/workspace-portal
```

`-ldflags="-s -w"` strips the symbol table and DWARF debug info from the binary. It has no effect on behaviour but reduces binary size by ~25–30%.

### `.gitignore`

```
bin/
config.yaml
.secrets/
*.log
```

`config.yaml` is gitignored because it will contain paths specific to your machine. If you commit it, someone else's clone will silently use the wrong paths.

### Verify the scaffold compiles

The project won't run yet — `internal/config` and `internal/server` don't exist — but it should parse without errors:

```bash
go build ./...
# should produce no output (no errors)
```

If you get "no Go files" warnings, that's expected — empty directories are ignored by the toolchain.

---

## Lesson 2 — `internal/config`: Loading Configuration

### What this module does

Every other module in the portal needs configuration — the port to listen on, the path to the workspaces directory, which binary to launch for OpenCode, and so on. Rather than scatter `os.Getenv` calls throughout the codebase, all configuration is centralised here. This module is the first one you implement because nothing else can be written without it.

The design follows a three-layer resolution order:
1. **YAML file** — the primary source, written once and kept locally.
2. **Environment variables** — useful for overriding in scripts or containers without editing the file.
3. **Defaults** — sensible values so the binary is runnable with a minimal config.

### Key design decisions

**Why a `defaults()` function?**  
Go's zero values (`0`, `""`, `false`) are not always sensible defaults. A port of `0` would pick a random port; an empty binary path would fail immediately. Seeding `cfg` with defaults before unmarshalling means YAML only needs to specify what differs from the defaults — you don't have to repeat the OpenCode binary path in every config file.

**Why accept a missing file?**  
`os.IsNotExist(err)` lets the portal start with defaults + env vars even if no `config.yaml` exists. This is useful in Docker or CI environments where you inject everything via environment variables.

**Why `env` struct tags and `caarlos0/env` instead of a manual `applyEnvOverrides`?**  
The manual approach — a function that reads `os.Getenv` for each field — has a silent failure mode: if you add a new field to the config struct, you must remember to add a matching `os.Getenv` call. Forget it, and that field can never be set by env var without any error or warning. This is the worst kind of bug — it fails silently and only at runtime, in production, for someone who tried to configure their deployment.

The `env` tag approach solves this by colocating the env var name with the field declaration. When you add a field, you add its `env` tag at the same time, in the same place. There is no separate function to keep in sync. `env.ParseWithOptions` then drives all fields automatically — the caller adds no code.

`github.com/caarlos0/env/v11` was chosen specifically because it has **zero transitive dependencies** — adding it costs one line in `go.mod` with no dependency tree attached. The `env:"..."` tag convention also directly mirrors the `yaml:"..."` and `json:"..."` tags students already know.

`PortRange [2]int` is the one type that `env` cannot parse out of the box, because `[2]int` has no standard string representation. Rather than adding a helper function that calls `os.Getenv` explicitly (reintroducing exactly the maintenance problem we set out to solve), the solution is to define a named type `PortRange` and implement `encoding.TextUnmarshaler` on it. Both `yaml.v3` and `caarlos0/env` discover and call `UnmarshalText` automatically — the port range fields get normal `env` tags, no special-casing exists anywhere in `Load`, and the YAML schema and env var format are unchanged.

**Why a `Secret` method?**  
Secrets (like `vscode-password`) should never live in the main config file, which is likely shared or version-controlled. The `Secret` method resolves them from env vars first, then from files in a `.secrets/` directory, then from Docker secrets (`/run/secrets/`). The caller doesn't care where the value came from. If no source provides a value, `Secret` returns an empty string and logs a warning — the empty string is intentional (it avoids a hard failure for optional secrets), but the warning makes misconfiguration visible immediately in the process log rather than producing a silent auth bypass.

### `internal/config/config.go`

```go
package config

import (
    "fmt"
    "log"
    "os"
    "path/filepath"
    "strconv"
    "strings"

    "github.com/caarlos0/env/v11"
    "gopkg.in/yaml.v3"
)

// Config holds all portal configuration.
type Config struct {
    WorkspacesRoot string    `yaml:"workspaces_root" env:"PORTAL_WORKSPACES_ROOT"`
    PortalPort     int       `yaml:"portal_port"      env:"PORTAL_PORT"`
    SecretsDir     string    `yaml:"secrets_dir"`
    OC             OCConfig  `yaml:"oc"               envPrefix:"PORTAL_OC_"`
    VSCode         VSCConfig `yaml:"vscode"           envPrefix:"PORTAL_VSCODE_"`
}

// PortRange is a [lo, hi] port pair that unmarshals from "lo-hi" strings in both
// YAML and environment variables (e.g. "4100-4199"). Implementing
// encoding.TextUnmarshaler means both yaml.v3 and caarlos0/env pick it up
// automatically — no custom parsing code needed at the call site.
type PortRange [2]int

func (p *PortRange) UnmarshalText(text []byte) error {
    parts := strings.SplitN(string(text), "-", 2)
    if len(parts) != 2 {
        return fmt.Errorf("port range must be in lo-hi format, got %q", string(text))
    }
    lo, err1 := strconv.Atoi(parts[0])
    hi, err2 := strconv.Atoi(parts[1])
    if err1 != nil || err2 != nil {
        return fmt.Errorf("invalid port range %q", string(text))
    }
    *p = PortRange{lo, hi}
    return nil
}

type OCConfig struct {
    Binary    string    `yaml:"binary"     env:"BINARY"`
    PortRange PortRange `yaml:"port_range" env:"PORT_RANGE"`
    Flags     []string  `yaml:"flags"      env:"FLAGS"`
}

type VSCConfig struct {
    Binary    string    `yaml:"binary"     env:"BINARY"`
    PortRange PortRange `yaml:"port_range" env:"PORT_RANGE"`
}

// defaults returns a Config populated with sensible defaults.
func defaults() *Config {
    return &Config{
        PortalPort: 4000,
        SecretsDir: ".secrets",
        OC: OCConfig{
            Binary:    "opencode",
            PortRange: PortRange{4100, 4199},
            Flags:     []string{"web", "--mdns"},
        },
        VSCode: VSCConfig{
            Binary:    "code-server",
            PortRange: PortRange{4200, 4299},
        },
    }
}

// Load reads config from the given YAML file path, applies env var overrides,
// and validates required fields.
func Load(path string) (*Config, error) {
    cfg := defaults()

    // Read and parse YAML if file exists
    data, err := os.ReadFile(path)
    if err != nil && !os.IsNotExist(err) {
        return nil, fmt.Errorf("reading config file %s: %w", path, err)
    }
    if err == nil {
        if err := yaml.Unmarshal(data, cfg); err != nil {
            return nil, fmt.Errorf("parsing config file %s: %w", path, err)
        }
    }

    // Apply env var overrides for all tagged fields automatically.
    // env.Parse only writes a field when its env var is actually present —
    // it never touches fields whose env var is unset, so YAML-loaded and
    // defaults()-populated values are preserved unless explicitly overridden.
    // PortRange fields are covered automatically because PortRange implements
    // encoding.TextUnmarshaler — env parses "4100-4199" into PortRange{4100,4199}.
    if err := env.Parse(cfg); err != nil {
        return nil, fmt.Errorf("applying env overrides: %w", err)
    }

    // Expand ~ in workspaces root
    if strings.HasPrefix(cfg.WorkspacesRoot, "~/") {
        home, _ := os.UserHomeDir()
        cfg.WorkspacesRoot = filepath.Join(home, cfg.WorkspacesRoot[2:])
    }

    // Resolve secrets dir relative to config file location
    if !filepath.IsAbs(cfg.SecretsDir) {
        cfg.SecretsDir = filepath.Join(filepath.Dir(path), cfg.SecretsDir)
    }

    // Validate required fields
    if cfg.WorkspacesRoot == "" {
        return nil, fmt.Errorf("workspaces_root is required (set in config.yaml or PORTAL_WORKSPACES_ROOT)")
    }

    return cfg, nil
}

// Secret reads a secret value by name. Resolution order:
//  1. Environment variable PORTAL_{UPPER_NAME} (e.g. PORTAL_VSCODE_PASSWORD)
//  2. File at cfg.SecretsDir/{name}
//  3. File at /run/secrets/{name}  (Docker secrets convention)
func (cfg *Config) Secret(name string) string {
    // 1. Env var
    envKey := "PORTAL_" + strings.ToUpper(strings.ReplaceAll(name, "-", "_"))
    if v := os.Getenv(envKey); v != "" {
        return v
    }
    // 2. secrets dir
    if v, err := os.ReadFile(filepath.Join(cfg.SecretsDir, name)); err == nil {
        return strings.TrimSpace(string(v))
    }
    // 3. Docker secrets
    if v, err := os.ReadFile(filepath.Join("/run/secrets", name)); err == nil {
        return strings.TrimSpace(string(v))
    }
    log.Printf("warning: secret %q not found (checked env var %s, %s, /run/secrets/%s)", name, envKey, filepath.Join(cfg.SecretsDir, name), name)
    return ""
}
```

### `internal/config/config_test.go`

The tests cover the four meaningful behaviours: missing file, file with values, env var override, and secret resolution. Each test is independent — it creates its own temp files and cleans up with `defer`.

Notice the test for defaults: it expects an *error* because `workspaces_root` is required and no file is present. This is the right thing to test — "missing required field fails loudly" is a behaviour worth protecting.

The `TestEnvOverride` test sets `PORTAL_PORT` via `t.Setenv` and confirms that `Load` picks it up. This exercises `env.ParseWithOptions` indirectly — if a new field is added with a correct `env` tag, no test change is needed to cover the mechanism; you only need to add a test for the specific field's value.

```go
package config

import (
    "os"
    "testing"
)

func TestDefaults(t *testing.T) {
    // Load with a non-existent file — should fail on missing workspaces_root
    _, err := Load("nonexistent.yaml")
    if err == nil {
        t.Fatal("expected error for missing workspaces_root")
    }
}

func TestLoadFromFile(t *testing.T) {
    f, _ := os.CreateTemp("", "config*.yaml")
    f.WriteString("workspaces_root: /tmp/workspaces\nportal_port: 9000\n")
    f.Close()
    defer os.Remove(f.Name())

    cfg, err := Load(f.Name())
    if err != nil {
        t.Fatalf("unexpected error: %v", err)
    }
    if cfg.WorkspacesRoot != "/tmp/workspaces" {
        t.Errorf("got %q, want /tmp/workspaces", cfg.WorkspacesRoot)
    }
    if cfg.PortalPort != 9000 {
        t.Errorf("got %d, want 9000", cfg.PortalPort)
    }
    // Defaults still apply for unset fields
    if cfg.OC.Binary != "opencode" {
        t.Errorf("expected default OpenCode binary, got %q", cfg.OC.Binary)
    }
}

func TestEnvOverride(t *testing.T) {
    f, _ := os.CreateTemp("", "config*.yaml")
    f.WriteString("workspaces_root: /tmp/workspaces\n")
    f.Close()
    defer os.Remove(f.Name())

    t.Setenv("PORTAL_PORT", "5555")

    cfg, _ := Load(f.Name())
    if cfg.PortalPort != 5555 {
        t.Errorf("env override failed, got %d", cfg.PortalPort)
    }
}

func TestSecret(t *testing.T) {
    dir, _ := os.MkdirTemp("", "secrets*")
    defer os.RemoveAll(dir)
    os.WriteFile(dir+"/vscode-password", []byte("secret123\n"), 0600)

    cfg := &Config{SecretsDir: dir}
    if got := cfg.Secret("vscode-password"); got != "secret123" {
        t.Errorf("got %q, want secret123", got)
    }
}
```

Run:

```bash
go test ./internal/config/...
```

All four tests should pass before continuing.

---

## Lesson 3 — `internal/fs`: Directory Tree

### What this module does

The portal needs to display a navigable directory tree rooted at `workspaces_root`. Critically, it should *not* descend into build artefact directories like `node_modules`, `.next`, or `target` — these are noisy, large, and irrelevant to navigation. It should also respect `.gitignore` files, so any directory a project already marks as ignored is also hidden here — without the user having to configure anything separately.

This module provides a single function, `List`, that returns the immediate children of a given path with those directories filtered out. It also annotates each entry with two flags that the UI needs: `IsGit` (to show a git badge) and `HasChildren` (to show an expand arrow).

### Key design decisions

**Why only immediate children, not a full recursive tree?**  
The UI will load children lazily on expand — so we only need one level at a time. Recursing the whole workspace tree upfront would be slow and unnecessary.

**Why a hardcoded `defaultPrune` map?**  
Most pruned directories (`node_modules`, `dist`, etc.) are universally unwanted. Hardcoding them means users don't have to rediscover the list. There is no user-configurable extra prune list — `.gitignore` files already express user-level exclusion preferences, so duplicating that mechanism in the portal config would create two places to maintain the same information.

**Why respect `.gitignore` files?**  
Git already tracks which directories a project considers ignorable. By loading `.gitignore` files from ancestor directories (walking up from the listed path to `workspaces_root`), the portal automatically hides anything the user has already decided isn't worth tracking — generated directories, local secrets, toolchain caches. This is zero-configuration from the user's perspective: write a `.gitignore` once, get consistent filtering everywhere.

`github.com/sabhiram/go-gitignore` implements the full gitignore matching algorithm (negations, `**` globs, anchored patterns) with a single dependency and no transitive dependencies.

**Why detect git repos at this layer?**  
The directory listing and git detection happen in the same `os.ReadDir` pass. Doing it here avoids a second pass later and keeps the data clean for the handler.

### `internal/fs/tree.go`

```go
package fs

import (
    "os"
    "path/filepath"
    "sort"

    gitignore "github.com/sabhiram/go-gitignore"
)

// DirEntry describes one directory in the tree.
type DirEntry struct {
    Path        string // absolute path to this entry (includes Name as the final element)
    Name        string // basename (final path element only)
    IsGit       bool   // contains a git repo
    HasChildren bool   // has non-pruned subdirectories
}

// defaultPrune is the set of directory names that are never shown.
var defaultPrune = map[string]bool{
    "node_modules": true, ".pnpm": true, ".pnpm-store": true,
    "dist": true, ".next": true, ".nuxt": true, ".turbo": true,
    "build": true, "out": true, "coverage": true,
    ".cache": true, "__pycache__": true, ".pytest_cache": true,
    "target": true, "vendor": true, ".gradle": true,
    // git internals — prune CONTENTS of .git and .bare, not the dirs themselves
    "objects": true, "refs": true, "info": true,
    "hooks": true, "worktrees": true, "pack": true,
    "logs": true,
}

// List returns the immediate non-pruned children of path.
// It respects .gitignore files found in path and its ancestors up to root.
// root is the workspaces root — gitignore walk stops there.
func List(path, root string) ([]DirEntry, error) {
    matchers := loadGitignores(path, root)

    entries, err := os.ReadDir(path)
    if err != nil {
        return nil, err
    }

    var result []DirEntry
    for _, e := range entries {
        if !e.IsDir() {
            continue
        }
        if defaultPrune[e.Name()] {
            continue
        }
        absPath := filepath.Join(path, e.Name())
        if gitignored(absPath, root, matchers) {
            continue
        }
        entry := DirEntry{
            Path:  absPath,
            Name:  e.Name(),
            IsGit: isGitRepo(absPath),
        }
        entry.HasChildren = hasVisibleSubdirs(absPath, root, matchers)
        result = append(result, entry)
    }

    sort.Slice(result, func(i, j int) bool {
        return result[i].Name < result[j].Name
    })
    return result, nil
}

// gitignored returns true if absPath is matched by any of the compiled matchers.
func gitignored(absPath, root string, matchers []*gitignore.GitIgnore) bool {
    rel, err := filepath.Rel(root, absPath)
    if err != nil {
        return false
    }
    for _, m := range matchers {
        if m.MatchesPath(rel) {
            return true
        }
    }
    return false
}

// loadGitignores walks from root up to path, collecting all .gitignore files,
// and returns a slice of compiled matchers. Returns nil if none are found.
func loadGitignores(path, root string) []*gitignore.GitIgnore {
    // Collect .gitignore file paths from root down to path.
    var files []string
    current := path
    for {
        candidate := filepath.Join(current, ".gitignore")
        if _, err := os.Stat(candidate); err == nil {
            files = append([]string{candidate}, files...) // prepend so root wins
        }
        if current == root {
            break
        }
        parent := filepath.Dir(current)
        if parent == current {
            break
        }
        current = parent
    }

    var matchers []*gitignore.GitIgnore
    for _, f := range files {
        ig, err := gitignore.CompileIgnoreFile(f)
        if err == nil {
            matchers = append(matchers, ig)
        }
    }
    return matchers
}

// isGitRepo returns true if the directory contains a git repository.
// Handles three layouts:
//   - standard:  .git/ is a directory
//   - worktree:  .git is a regular file
//   - bare repo: .bare/HEAD exists
func isGitRepo(path string) bool {
    if info, err := os.Stat(filepath.Join(path, ".git")); err == nil && info.IsDir() {
        return true
    }
    if info, err := os.Stat(filepath.Join(path, ".git")); err == nil && info.Mode().IsRegular() {
        return true
    }
    if _, err := os.Stat(filepath.Join(path, ".bare", "HEAD")); err == nil {
        return true
    }
    return false
}

// hasVisibleSubdirs returns true if path contains at least one subdirectory
// that is neither in the default prune set nor excluded by .gitignore rules.
// Files are not considered.
func hasVisibleSubdirs(path, root string, matchers []*gitignore.GitIgnore) bool {
    entries, err := os.ReadDir(path)
    if err != nil {
        return false
    }
    for _, e := range entries {
        if !e.IsDir() || defaultPrune[e.Name()] {
            continue
        }
        if gitignored(filepath.Join(path, e.Name()), root, matchers) {
            continue
        }
        return true
    }
    return false
}
```

### `internal/fs/tree_test.go`

The tests build a synthetic directory tree in a temp directory. This is the standard Go testing pattern for file system code — never test against real directories you don't control.

The tree covers all the cases worth asserting: a pruned directory is absent, a dotdir is present, git is detected, `HasChildren` is accurate, and a `.gitignore`-excluded directory is absent.

```go
package fs

import (
    "os"
    "path/filepath"
    "testing"
)

func TestList(t *testing.T) {
    // Build a temp tree:
    // root/
    //   project-a/      (git repo)
    //   project-b/      (no git, has children)
    //   node_modules/   (should be pruned by defaultPrune)
    //   .secrets/       (dotdir, should appear — we show all)
    //   ignored-dir/    (should be pruned via .gitignore)
    root, _ := os.MkdirTemp("", "portal-fs*")
    defer os.RemoveAll(root)

    os.MkdirAll(filepath.Join(root, "project-a", ".git"), 0755)
    os.MkdirAll(filepath.Join(root, "project-b", "src"), 0755)
    os.MkdirAll(filepath.Join(root, "node_modules"), 0755)
    os.MkdirAll(filepath.Join(root, ".secrets"), 0755)
    os.MkdirAll(filepath.Join(root, "ignored-dir"), 0755)
    os.WriteFile(filepath.Join(root, ".gitignore"), []byte("ignored-dir\n"), 0644)

    entries, err := List(root, root)
    if err != nil {
        t.Fatal(err)
    }

    byName := make(map[string]DirEntry)
    for _, e := range entries {
        byName[e.Name] = e
    }

    if _, ok := byName["node_modules"]; ok {
        t.Error("node_modules should be pruned")
    }
    if _, ok := byName["ignored-dir"]; ok {
        t.Error("ignored-dir should be excluded by .gitignore")
    }
    if _, ok := byName[".secrets"]; !ok {
        t.Error(".secrets should appear")
    }
    if !byName["project-a"].IsGit {
        t.Error("project-a should be detected as git repo")
    }
    if byName["project-b"].IsGit {
        t.Error("project-b should not be a git repo")
    }
    if !byName["project-b"].HasChildren {
        t.Error("project-b should have children")
    }
}

func TestIsGitRepo(t *testing.T) {
    root, _ := os.MkdirTemp("", "gitrepo*")
    defer os.RemoveAll(root)

    t.Run("standard repo", func(t *testing.T) {
        dir := filepath.Join(root, "standard")
        os.MkdirAll(filepath.Join(dir, ".git"), 0755)
        if !isGitRepo(dir) {
            t.Error("expected true for standard .git dir")
        }
    })
    t.Run("worktree", func(t *testing.T) {
        dir := filepath.Join(root, "worktree")
        os.MkdirAll(dir, 0755)
        os.WriteFile(filepath.Join(dir, ".git"), []byte("gitdir: ../.bare/worktrees/main"), 0644)
        if !isGitRepo(dir) {
            t.Error("expected true for .git file (worktree)")
        }
    })
    t.Run("bare repo", func(t *testing.T) {
        dir := filepath.Join(root, "bare")
        os.MkdirAll(filepath.Join(dir, ".bare"), 0755)
        os.WriteFile(filepath.Join(dir, ".bare", "HEAD"), []byte("ref: refs/heads/main"), 0644)
        if !isGitRepo(dir) {
            t.Error("expected true for .bare/HEAD (bare repo)")
        }
    })
    t.Run("not a repo", func(t *testing.T) {
        dir := filepath.Join(root, "plain")
        os.MkdirAll(dir, 0755)
        if isGitRepo(dir) {
            t.Error("expected false for plain dir")
        }
    })
}
```

---

## Lesson 4 — `internal/session`: The Runner Interface

### What this module does

This module handles the full lifecycle of a running editor session: launching the process, assigning it a port, polling until it's healthy, persisting state to disk so sessions survive a portal restart, and broadcasting events to connected browsers via SSE.

There are two session types — OpenCode and VS Code — which are launched differently (different binaries, different flags, different auth). The module is split into four files to separate these concerns:

| File | Responsibility |
|---|---|
| `runner.go` | The `Runner` interface and `Session` struct — the shared contract. |
| `oc.go` | The OpenCode-specific `Runner` implementation. |
| `vscode.go` | The VS Code-specific `Runner` implementation. |
| `manager.go` | Orchestration — port assignment, lifecycle, state persistence, SSE. |

### Key design decisions

**Why define a `Runner` interface before writing the implementations?**  
The `Manager` in `manager.go` needs to start and stop sessions without knowing which type they are. By programming against the `Runner` interface, the manager is completely decoupled from the OpenCode and VS Code specifics. You can add a third session type later without touching the manager, and you can inject a fake `Runner` in tests.

This is the same principle as TypeScript interfaces — the difference is that Go satisfies interfaces implicitly (no `implements` keyword).

**Why keep `Session` in `runner.go` rather than `manager.go`?**  
`Session` is the data shape shared by the runner, the manager, and the HTTP handlers. Defining it in `runner.go` (the foundational file) avoids circular imports and makes it clear that it belongs to the `session` package as a whole, not just to the manager.

### `internal/session/runner.go`

The `Runner` interface defines the three things the manager needs from any session type: start it, stop it, and get the URL to health-check it.

```go
package session

import "time"

// Session holds the state of a running session.
type Session struct {
    ID        string    `json:"id"`
    Type      string    `json:"type"`    // "opencode" or "vscode"
    Dir       string    `json:"dir"`
    Port      int       `json:"port"`
    PID       int       `json:"pid"`
    StartedAt time.Time `json:"started_at"`
    URL       string    `json:"url"`     // set after health check passes
}

// Runner is implemented by each session type (OpenCode, VS Code).
type Runner interface {
    // Start launches the process. Returns when the process has started
    // (not necessarily healthy yet).
    Start(dir string, port int) (pid int, err error)
    // Stop terminates the process.
    Stop(pid int) error
    // HealthURL returns the URL to poll for the health check.
    HealthURL(port int) string
}
```

### `internal/session/oc.go`

`OCRunner` launches the `opencode` binary with a port flag and optional CORS origin. `cmd.Start()` (not `cmd.Run()`) is used because we want the process to keep running after `Start` returns — `Run` would block until the process exits.

```go
package session

import (
    "fmt"
    "os"
    "os/exec"
    "strconv"
)

// OCRunner starts and stops OpenCode processes.
type OCRunner struct {
    Binary     string
    Flags      []string
    CORSOrigin string
}

func (r *OCRunner) Start(dir string, port int) (int, error) {
    args := append([]string{}, r.Flags...)
    args = append(args, "--port", strconv.Itoa(port))
    if r.CORSOrigin != "" {
        args = append(args, "--cors", r.CORSOrigin)
    }

    cmd := exec.Command(r.Binary, args...)
    cmd.Dir = dir
    if err := cmd.Start(); err != nil {
        return 0, fmt.Errorf("starting opencode: %w", err)
    }
    return cmd.Process.Pid, nil
}

func (r *OCRunner) Stop(pid int) error {
    proc, err := os.FindProcess(pid)
    if err != nil {
        return nil // already gone
    }
    return proc.Kill()
}

func (r *OCRunner) HealthURL(port int) string {
    return fmt.Sprintf("http://localhost:%d", port)
}
```

### `internal/session/vscode.go`

`VSCodeRunner` launches `code-server`. The password is passed as an environment variable (`PASSWORD=...`) rather than a flag, because that is how code-server's auth is designed. `os.Environ()` copies the current process environment so the child inherits `PATH` and everything else it needs.

```go
package session

import (
    "fmt"
    "os"
    "os/exec"
)

// VSCodeRunner starts and stops code-server processes.
type VSCodeRunner struct {
    Binary   string
    Password string
}

func (r *VSCodeRunner) Start(dir string, port int) (int, error) {
    cmd := exec.Command(r.Binary,
        "--bind-addr", fmt.Sprintf("127.0.0.1:%d", port),
        "--auth", "password",
        dir,
    )
    cmd.Env = append(os.Environ(), "PASSWORD="+r.Password)
    if err := cmd.Start(); err != nil {
        return 0, fmt.Errorf("starting code-server: %w", err)
    }
    return cmd.Process.Pid, nil
}

func (r *VSCodeRunner) Stop(pid int) error {
    proc, err := os.FindProcess(pid)
    if err != nil {
        return nil
    }
    return proc.Kill()
}

func (r *VSCodeRunner) HealthURL(port int) string {
    return fmt.Sprintf("http://localhost:%d", port)
}
```

---

## Lesson 5 — `internal/session/manager.go`: The Session Manager

### What this module does

The manager is the most complex part of the portal. It owns the runtime state of every running session and handles five distinct concerns:

1. **Port assignment** — scan the configured range and find a free port before starting a process.
2. **Process lifecycle** — start a session, record its PID, and stop it cleanly on request.
3. **Health checking** — after starting, poll the process's HTTP endpoint until it responds. Only then mark the session as ready.
4. **State persistence** — write the session map to a JSON file after every change. On restart, reload it and remove any sessions whose processes are no longer alive (orphans).
5. **SSE broadcasting** — publish events (`started`, `healthy`, `stopped`) to a channel that HTTP handlers can fan out to connected browsers.

### Key design decisions

**Why a buffered `events` channel of size 64?**  
The manager sends events synchronously (no goroutine). If the HTTP handler is slow to consume them, a blocking send would deadlock the manager. A buffer of 64 means the manager can fire 64 events before it blocks — more than enough for any realistic load. This is a pragmatic choice, not a scalable pub/sub system.

**Why save state after every mutation?**  
State persistence is cheap (a small JSON file) and the cost of losing it (all sessions appear stopped after a portal restart) is high. Writing on every change is the right tradeoff here.

**Why check `proc.Signal(0)` to detect orphans?**  
`os.FindProcess` on Unix never returns an error — it just constructs a process handle. The only way to check if a process is actually alive is to send it signal 0, which does nothing to the process but returns an error if it doesn't exist or you don't have permission.

### `internal/session/manager.go`

Before writing this file, add the UUID dependency:

```bash
go get github.com/google/uuid
```

UUIDs are used as session IDs. The stdlib has no UUID generator — `crypto/rand` could generate random bytes, but encoding them correctly to the standard UUID format is non-trivial. `github.com/google/uuid` is a well-maintained, zero-dependency package maintained by Google. This is a case where using a dependency is clearly the right call.

```go
package session

import (
    "context"
    "encoding/json"
    "fmt"
    "net"
    "net/http"
    "os"
    "path/filepath"
    "sync"
    "syscall"
    "time"

    "github.com/google/uuid"
)

// Manager manages the lifecycle of all running sessions.
type Manager struct {
    mu        sync.Mutex
    sessions  map[string]*Session
    stateFile string
    events    chan Event // SSE event broadcast channel
    ocRunner  Runner
    vsRunner  Runner
    ocRange   [2]int
    vsRange   [2]int
}

// Event is sent on the SSE channel when session state changes.
type Event struct {
    Type    string // "started", "healthy", "stopped"
    Session *Session
}

// NewManager creates a Manager, loads persisted state, and removes orphans.
func NewManager(
    stateFile string,
    ocRunner, vsRunner Runner,
    ocRange, vsRange [2]int,
) *Manager {
    m := &Manager{
        sessions:  make(map[string]*Session),
        stateFile: stateFile,
        events:    make(chan Event, 64),
        ocRunner:  ocRunner,
        vsRunner:  vsRunner,
        ocRange:   ocRange,
        vsRange:   vsRange,
    }
    m.loadState()
    return m
}

// Events returns the channel for SSE subscribers.
func (m *Manager) Events() <-chan Event {
    return m.events
}

// List returns all current sessions.
func (m *Manager) List() []*Session {
    m.mu.Lock()
    defer m.mu.Unlock()
    out := make([]*Session, 0, len(m.sessions))
    for _, s := range m.sessions {
        out = append(out, s)
    }
    return out
}

// Start launches a new session for the given directory and type.
func (m *Manager) Start(sessionType, dir string) (*Session, error) {
    var runner Runner
    var portRange [2]int
    switch sessionType {
    case "opencode":
        runner = m.ocRunner
        portRange = m.ocRange
    case "vscode":
        runner = m.vsRunner
        portRange = m.vsRange
    default:
        return nil, fmt.Errorf("unknown session type: %s", sessionType)
    }

    // Return existing session if one is already running for this dir+type
    if existing := m.findByDirAndType(dir, sessionType); existing != nil {
        return existing, nil
    }

    port, err := m.nextPort(portRange)
    if err != nil {
        return nil, err
    }

    pid, err := runner.Start(dir, port)
    if err != nil {
        return nil, err
    }

    s := &Session{
        ID:        uuid.New().String(),
        Type:      sessionType,
        Dir:       dir,
        Port:      port,
        PID:       pid,
        StartedAt: time.Now(),
    }

    m.mu.Lock()
    m.sessions[s.ID] = s
    m.mu.Unlock()
    m.saveState()

    m.events <- Event{Type: "started", Session: s}

    // Health check runs in a goroutine — it blocks until the process responds,
    // then updates s.URL and sends the "healthy" event.
    go m.waitHealthy(s, runner.HealthURL(port))

    return s, nil
}

// Stop terminates a session by ID.
func (m *Manager) Stop(id string) error {
    m.mu.Lock()
    s, ok := m.sessions[id]
    if !ok {
        m.mu.Unlock()
        return fmt.Errorf("session %s not found", id)
    }
    delete(m.sessions, id)
    m.mu.Unlock()

    var runner Runner
    if s.Type == "opencode" {
        runner = m.ocRunner
    } else {
        runner = m.vsRunner
    }
    runner.Stop(s.PID)
    m.saveState()
    m.events <- Event{Type: "stopped", Session: s}
    return nil
}

// waitHealthy polls until the session responds, then marks it healthy.
// It times out after 30 seconds to avoid leaking goroutines for processes that
// fail to start.
func (m *Manager) waitHealthy(s *Session, healthURL string) {
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    ticker := time.NewTicker(time.Second)
    defer ticker.Stop()

    for {
        select {
        case <-ctx.Done():
            return // timed out — process failed to become healthy
        case <-ticker.C:
            resp, err := http.Get(healthURL)
            if err == nil && resp.StatusCode < 500 {
                resp.Body.Close()
                m.mu.Lock()
                s.URL = healthURL
                m.mu.Unlock()
                m.saveState()
                m.events <- Event{Type: "healthy", Session: s}
                return
            }
        }
    }
}

// nextPort finds the first available port in the given range.
// It checks both the in-use session map (fast) and then attempts to bind
// the port (authoritative — catches ports used by unrelated processes).
func (m *Manager) nextPort(r [2]int) (int, error) {
    m.mu.Lock()
    inUse := make(map[int]bool)
    for _, s := range m.sessions {
        inUse[s.Port] = true
    }
    m.mu.Unlock()

    for port := r[0]; port <= r[1]; port++ {
        if inUse[port] {
            continue
        }
        ln, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", port))
        if err == nil {
            ln.Close()
            return port, nil
        }
    }
    return 0, fmt.Errorf("no available ports in range %d-%d", r[0], r[1])
}

// findByDirAndType returns an existing session if one is already running.
func (m *Manager) findByDirAndType(dir, sessionType string) *Session {
    m.mu.Lock()
    defer m.mu.Unlock()
    for _, s := range m.sessions {
        if s.Dir == dir && s.Type == sessionType {
            return s
        }
    }
    return nil
}

// saveState persists current sessions to disk as JSON.
func (m *Manager) saveState() {
    m.mu.Lock()
    defer m.mu.Unlock()

    os.MkdirAll(filepath.Dir(m.stateFile), 0755)
    data, err := json.Marshal(m.sessions)
    if err == nil {
        os.WriteFile(m.stateFile, data, 0644)
    }
}

// loadState reads persisted sessions and removes orphans (processes no longer alive).
func (m *Manager) loadState() {
    data, err := os.ReadFile(m.stateFile)
    if err != nil {
        return // no state file yet — fresh start
    }
    var loaded map[string]*Session
    if err := json.Unmarshal(data, &loaded); err != nil {
        return
    }
    for id, s := range loaded {
        proc, err := os.FindProcess(s.PID)
        if err != nil || proc.Signal(syscall.Signal(0)) != nil {
            continue // orphan — process is gone
        }
        m.sessions[id] = s
    }
}
```

---

## Lesson 6 — `internal/tailscale`: The Optional Plugin

The Tailscale integration is implemented in [Course 07 — Tailscale Setup](./course-07-tailscale.md). You do not need to create the `internal/tailscale/` directory now — Course 07 covers it in full, including how it hooks into the session manager.

---

## Lesson 7 — `internal/server`: Wiring It All Together

### What this module does

The server module has two files:

- `server.go` — constructs all dependencies and starts listening. This is the composition root for the whole application.
- `handlers.go` — implements each HTTP handler, reading from config/manager and writing HTTP responses.

For now, all handlers return plain text. The HTMX UI and templates are added in Course 03 — these plain-text responses are placeholders that let you verify routing is correct before touching the UI layer.

### Key design decisions

**Why is `server.go` the composition root?**  
`main.go` is deliberately kept thin. `server.Start` is where all the wiring happens: which registrar, which runners, which state file, which manager, which mux. This keeps `main.go` readable and makes it easy to see the full dependency graph in one place.

**Why a `handler` struct rather than standalone functions?**  
Handlers need access to shared state — the config and the session manager. In Go, the idiomatic way to thread shared state into handler functions is to hang them on a struct and pass that struct around. The alternative (global variables) makes testing and reasoning about state harder.

**How does SSE work?**  
Server-Sent Events is a one-way HTTP stream from server to browser. The client opens a persistent `GET /events` connection; the server never closes it, instead writing `event: ...\ndata: ...\n\n` frames as events occur. The `http.Flusher` interface is required to push each frame to the client immediately rather than buffering it.

### `internal/server/server.go`

```go
package server

import (
    "fmt"
    "log"
    "net/http"
    "os"
    "path/filepath"

    "workspace-portal/internal/config"
    "workspace-portal/internal/session"
)

// Start builds all dependencies and starts the HTTP server.
func Start(cfg *config.Config) error {
    // Build runners
    ocRunner := &session.OCRunner{
        Binary: cfg.OC.Binary,
        Flags:  cfg.OC.Flags,
    }
    vsRunner := &session.VSCodeRunner{
        Binary:   cfg.VSCode.Binary,
        Password: cfg.Secret("vscode-password"),
    }

    // State file lives in the user's local data directory
    stateDir, _ := os.UserHomeDir()
    stateFile := filepath.Join(stateDir, ".local", "share", "workspace-portal", "sessions.json")

    // Build manager
    manager := session.NewManager(
        stateFile, ocRunner, vsRunner,
        cfg.OC.PortRange, cfg.VSCode.PortRange,
    )

    // HTTP mux
    mux := http.NewServeMux()
    h := &handler{cfg: cfg, manager: manager}

    mux.HandleFunc("GET /", h.index)
    mux.HandleFunc("GET /fs/list", h.fsList)
    mux.HandleFunc("GET /sessions", h.sessions)
    mux.HandleFunc("POST /sessions/start", h.sessionsStart)
    mux.HandleFunc("POST /sessions/stop", h.sessionsStop)
    mux.HandleFunc("GET /events", h.events)
    mux.HandleFunc("GET /static/", h.static)

    addr := fmt.Sprintf(":%d", cfg.PortalPort)
    log.Printf("listening on %s", addr)
    return http.ListenAndServe(addr, mux)
}
```

### `internal/server/handlers.go`

The `// TODO Course 03` comments mark where templates will replace the plain-text responses. This is intentional — you can verify routing and data plumbing before committing to the UI layer.

```go
package server

import (
    "encoding/json"
    "fmt"
    "net/http"

    "workspace-portal/internal/config"
    fsmod "workspace-portal/internal/fs"
    "workspace-portal/internal/session"
)

type handler struct {
    cfg     *config.Config
    manager *session.Manager
}

func (h *handler) index(w http.ResponseWriter, r *http.Request) {
    // TODO Course 03: render full layout template
    fmt.Fprintf(w, "workspace-portal — root: %s", h.cfg.WorkspacesRoot)
}

func (h *handler) fsList(w http.ResponseWriter, r *http.Request) {
    path := r.URL.Query().Get("path")
    if path == "" {
        path = h.cfg.WorkspacesRoot
    }
    entries, err := fsmod.List(path, h.cfg.WorkspacesRoot)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    // TODO Course 03: render tree-row template for each entry
    for _, e := range entries {
        fmt.Fprintf(w, "%s (git=%v children=%v)\n", e.Name, e.IsGit, e.HasChildren)
    }
}

func (h *handler) sessions(w http.ResponseWriter, r *http.Request) {
    // TODO Course 03: render sessions template
    for _, s := range h.manager.List() {
        fmt.Fprintf(w, "%s %s port=%d\n", s.Type, s.Dir, s.Port)
    }
}

func (h *handler) sessionsStart(w http.ResponseWriter, r *http.Request) {
    r.ParseForm()
    sessionType := r.FormValue("type")
    dir := r.FormValue("dir")

    s, err := h.manager.Start(sessionType, dir)
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    // TODO Course 03: return sessions HTML fragment
    fmt.Fprintf(w, "started %s for %s on port %d\n", s.Type, s.Dir, s.Port)
}

func (h *handler) sessionsStop(w http.ResponseWriter, r *http.Request) {
    r.ParseForm()
    id := r.FormValue("id")
    if err := h.manager.Stop(id); err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    // TODO Course 03: return updated sessions HTML fragment
    fmt.Fprintf(w, "stopped %s\n", id)
}

// events streams Server-Sent Events to the browser.
// The connection stays open until the client disconnects (r.Context().Done()).
func (h *handler) events(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/event-stream")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")

    flusher, ok := w.(http.Flusher)
    if !ok {
        http.Error(w, "streaming not supported", http.StatusInternalServerError)
        return
    }

    // Heartbeat so the browser knows the connection is alive immediately
    fmt.Fprintf(w, ": heartbeat\n\n")
    flusher.Flush()

    for {
        select {
        case <-r.Context().Done():
            return // client disconnected
        case event := <-h.manager.Events():
            data, _ := json.Marshal(event.Session)
            fmt.Fprintf(w, "event: session.%s\ndata: %s\n\n", event.Type, data)
            flusher.Flush()
        }
    }
}

func (h *handler) static(w http.ResponseWriter, r *http.Request) {
    // TODO Course 03: serve embedded static files
}
```

### Verify the server runs

Create a minimal `config.yaml` (gitignored, so it stays local):

```yaml
workspaces_root: ~/workspaces
portal_port: 4000
```

```bash
go run ./cmd/portal
# workspace-portal starting on :4000
# listening on :4000
```

In a second terminal:

```bash
curl http://localhost:4000/
# workspace-portal — root: /Users/yourname/workspaces

curl http://localhost:4000/fs/list
# .secrets (git=false children=false)
# cyber-security (git=false children=true)
# de (git=false children=true)
# ...
```

The server works. The responses are plain text for now — that changes in Course 03.

---

## Lesson 8 — Running Tests

With all modules implemented, run the full test suite:

```bash
go test ./...
```

All tests should pass. The most likely failure at this point is an import path mismatch — make sure every import uses `workspace-portal/internal/...` (matching your `go.mod` module name), not a GitHub URL.

Once the basic suite passes, run it again with the race detector:

```bash
go test -race ./...
```

The `-race` flag compiles the binary with race detection instrumentation. It catches data races — cases where two goroutines access the same memory concurrently and at least one is writing, without synchronisation. The session manager is the most likely source: it uses `sync.Mutex` around the session map, but any mutation path you add later that skips the lock will be caught here. Run `-race` regularly throughout development, not just at the end.

---

## Summary

You now have a working Go binary with:
- Config loading from YAML + env vars + `.secrets/`
- Directory tree listing with smart pruning and git detection
- Session lifecycle management (start, stop, health check, state persistence)
- HTTP server with all routes stubbed and responding

**Next:** [Course 03 — HTMX and SSE](./course-03-htmx-and-sse.md) — replace the plain-text responses with a real HTMX-driven UI.
