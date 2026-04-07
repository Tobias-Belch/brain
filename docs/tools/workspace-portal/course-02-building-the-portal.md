---
title: "Course 02 — Building the Portal in Go"
---

# Course 02 — Building the Portal in Go

**Goal:** Implement every module of workspace-portal from scratch, producing a working Go binary.  
**Prerequisite:** [Course 01 — Go Foundations](./course-01-go-foundations.md)  
**Output:** A compiled `workspace-portal` binary that serves an HTTP server, lists directories, and manages OC/VS Code processes. The UI is wired up in Course 03.

---

## Lesson 1 — Scaffolding the Repository

### Create the directory and initialise the module

```bash
mkdir -p ~/workspaces/fea/lib/workspace-portal
cd ~/workspaces/fea/lib/workspace-portal
git init
go mod init github.com/yourusername/workspace-portal
```

The module name is the import path. Use your actual GitHub username if you plan to publish. For local development any string works.

### Create the directory structure

```bash
mkdir -p cmd/portal
mkdir -p internal/config
mkdir -p internal/fs
mkdir -p internal/session
mkdir -p internal/tailscale
mkdir -p internal/server
mkdir -p templates
mkdir -p static
mkdir -p deploy/launchd
mkdir -p deploy/docker
```

### `go.mod` — add the only external dependency

```bash
go get gopkg.in/yaml.v3
```

Your `go.mod` will now look like:

```
module github.com/yourusername/workspace-portal

go 1.22

require gopkg.in/yaml.v3 v3.0.1
```

### `cmd/portal/main.go` — the entry point

```go
package main

import (
    "flag"
    "fmt"
    "log"
    "os"

    "github.com/yourusername/workspace-portal/internal/config"
    "github.com/yourusername/workspace-portal/internal/server"
)

func main() {
    // CLI flags
    configPath := flag.String("config", "", "path to config.yaml")
    flag.Parse()

    // Resolve config path
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

### `Makefile`

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

### `.gitignore`

```
bin/
config.yaml
.secrets/
*.log
```

Verify the scaffold compiles (it won't run yet — we haven't written the other packages):

```bash
go build ./...
# should produce no output (no errors)
```

---

## Lesson 2 — `internal/config`: Loading Configuration

This module is the foundation. Everything else depends on it.

### `internal/config/config.go`

```go
package config

import (
    "fmt"
    "os"
    "path/filepath"
    "strconv"
    "strings"

    "gopkg.in/yaml.v3"
)

// Config holds all portal configuration.
type Config struct {
    WorkspacesRoot string    `yaml:"workspaces_root"`
    PortalPort     int       `yaml:"portal_port"`
    SecretsDir     string    `yaml:"secrets_dir"`
    OC             OCConfig  `yaml:"oc"`
    VSCode         VSConfig  `yaml:"vscode"`
    Tailscale      TSConfig  `yaml:"tailscale"`
    FS             FSConfig  `yaml:"fs"`
}

type OCConfig struct {
    Binary    string   `yaml:"binary"`
    PortRange [2]int   `yaml:"port_range"`
    Flags     []string `yaml:"flags"`
}

type VSConfig struct {
    Binary    string `yaml:"binary"`
    PortRange [2]int `yaml:"port_range"`
}

type TSConfig struct {
    Enabled bool   `yaml:"enabled"`
    Binary  string `yaml:"binary"`
}

type FSConfig struct {
    PruneDirs []string `yaml:"prune_dirs"`
}

// defaults returns a Config populated with sensible defaults.
func defaults() *Config {
    return &Config{
        PortalPort: 3000,
        SecretsDir: ".secrets",
        OC: OCConfig{
            Binary:    "opencode",
            PortRange: [2]int{4100, 4199},
            Flags:     []string{"web", "--mdns"},
        },
        VSCode: VSConfig{
            Binary:    "code-server",
            PortRange: [2]int{4200, 4299},
        },
        Tailscale: TSConfig{
            Binary: "tailscale",
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

    // Apply env var overrides
    applyEnvOverrides(cfg)

    // Expand ~ in workspaces root
    if strings.HasPrefix(cfg.WorkspacesRoot, "~/") {
        home, _ := os.UserHomeDir()
        cfg.WorkspacesRoot = filepath.Join(home, cfg.WorkspacesRoot[2:])
    }

    // Resolve secrets dir relative to config file
    if !filepath.IsAbs(cfg.SecretsDir) {
        cfg.SecretsDir = filepath.Join(filepath.Dir(path), cfg.SecretsDir)
    }

    // Validate
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
    return ""
}

// applyEnvOverrides checks env vars and overrides config values.
func applyEnvOverrides(cfg *Config) {
    if v := os.Getenv("PORTAL_WORKSPACES_ROOT"); v != "" {
        cfg.WorkspacesRoot = v
    }
    if v := os.Getenv("PORTAL_PORT"); v != "" {
        if n, err := strconv.Atoi(v); err == nil {
            cfg.PortalPort = n
        }
    }
    if v := os.Getenv("PORTAL_OC_BINARY"); v != "" {
        cfg.OC.Binary = v
    }
    if v := os.Getenv("PORTAL_VSCODE_BINARY"); v != "" {
        cfg.VSCode.Binary = v
    }
    if v := os.Getenv("PORTAL_TAILSCALE_ENABLED"); v == "true" {
        cfg.Tailscale.Enabled = true
    }
    if v := os.Getenv("PORTAL_OC_PORT_RANGE"); v != "" {
        if parts := strings.SplitN(v, "-", 2); len(parts) == 2 {
            lo, _ := strconv.Atoi(parts[0])
            hi, _ := strconv.Atoi(parts[1])
            cfg.OC.PortRange = [2]int{lo, hi}
        }
    }
    if v := os.Getenv("PORTAL_VSCODE_PORT_RANGE"); v != "" {
        if parts := strings.SplitN(v, "-", 2); len(parts) == 2 {
            lo, _ := strconv.Atoi(parts[0])
            hi, _ := strconv.Atoi(parts[1])
            cfg.VSCode.PortRange = [2]int{lo, hi}
        }
    }
}
```

### `internal/config/config_test.go`

```go
package config

import (
    "os"
    "testing"
)

func TestDefaults(t *testing.T) {
    // Load with a non-existent file — should use defaults
    cfg, err := Load("nonexistent.yaml")
    if err == nil {
        t.Fatal("expected error for missing workspaces_root")
    }
    _ = cfg
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
        t.Errorf("expected default OC binary, got %q", cfg.OC.Binary)
    }
}

func TestEnvOverride(t *testing.T) {
    f, _ := os.CreateTemp("", "config*.yaml")
    f.WriteString("workspaces_root: /tmp/workspaces\n")
    f.Close()
    defer os.Remove(f.Name())

    t.Setenv("PORTAL_PORT", "5555")
    defer os.Unsetenv("PORTAL_PORT")

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

---

## Lesson 3 — `internal/fs`: Directory Tree

This module provides one function: list the children of a directory, with pruning.

### `internal/fs/tree.go`

```go
package fs

import (
    "os"
    "path/filepath"
    "sort"
)

// DirEntry describes one directory in the tree.
type DirEntry struct {
    Path        string // absolute path
    Name        string // basename
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
// extraPrune is an additive list from config.
func List(path string, extraPrune []string) ([]DirEntry, error) {
    pruned := make(map[string]bool, len(defaultPrune)+len(extraPrune))
    for k, v := range defaultPrune {
        pruned[k] = v
    }
    for _, name := range extraPrune {
        pruned[name] = true
    }

    entries, err := os.ReadDir(path)
    if err != nil {
        return nil, err
    }

    var result []DirEntry
    for _, e := range entries {
        if !e.IsDir() {
            continue
        }
        if pruned[e.Name()] {
            continue
        }
        absPath := filepath.Join(path, e.Name())
        entry := DirEntry{
            Path:  absPath,
            Name:  e.Name(),
            IsGit: isGitRepo(absPath),
        }
        entry.HasChildren = hasNonPrunedChildren(absPath, pruned)
        result = append(result, entry)
    }

    sort.Slice(result, func(i, j int) bool {
        return result[i].Name < result[j].Name
    })
    return result, nil
}

// isGitRepo returns true if the directory contains a git repository.
// Handles: standard .git dir, worktree .git file, and bare .bare/HEAD.
func isGitRepo(path string) bool {
    // Standard repo: .git is a directory
    if info, err := os.Stat(filepath.Join(path, ".git")); err == nil && info.IsDir() {
        return true
    }
    // Worktree checkout: .git is a file (contains "gitdir: ...")
    if info, err := os.Stat(filepath.Join(path, ".git")); err == nil && info.Mode().IsRegular() {
        return true
    }
    // Bare repo: .bare/HEAD exists
    if _, err := os.Stat(filepath.Join(path, ".bare", "HEAD")); err == nil {
        return true
    }
    return false
}

// hasNonPrunedChildren returns true if path contains at least one non-pruned subdirectory.
func hasNonPrunedChildren(path string, pruned map[string]bool) bool {
    entries, err := os.ReadDir(path)
    if err != nil {
        return false
    }
    for _, e := range entries {
        if e.IsDir() && !pruned[e.Name()] {
            return true
        }
    }
    return false
}
```

### `internal/fs/tree_test.go`

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
    //   node_modules/   (should be pruned)
    //   .secrets/       (dotdir, should appear — we show all)
    root, _ := os.MkdirTemp("", "portal-fs*")
    defer os.RemoveAll(root)

    os.MkdirAll(filepath.Join(root, "project-a", ".git"), 0755)
    os.MkdirAll(filepath.Join(root, "project-b", "src"), 0755)
    os.MkdirAll(filepath.Join(root, "node_modules"), 0755)
    os.MkdirAll(filepath.Join(root, ".secrets"), 0755)

    entries, err := List(root, nil)
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

Before writing the OC and VS Code runners, define the interface they both implement. This is the key design decision: the session manager works with `Runner` and never imports `oc` or `vscode` directly. This makes both swappable and testable in isolation.

### `internal/session/runner.go`

```go
package session

import "time"

// Session holds the state of a running session.
type Session struct {
    ID        string    `json:"id"`
    Type      string    `json:"type"`    // "oc" or "vscode"
    Dir       string    `json:"dir"`
    Port      int       `json:"port"`
    PID       int       `json:"pid"`
    StartedAt time.Time `json:"started_at"`
    URL       string    `json:"url"`     // set after health check passes
}

// Runner is implemented by each session type (OC, VS Code).
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

```go
package session

import (
    "fmt"
    "os/exec"
    "strconv"
)

// OCRunner starts and stops OpenCode processes.
type OCRunner struct {
    Binary string
    Flags  []string
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

```go
package session

import (
    "fmt"
    "os"
    "os/exec"
    "strconv"
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

This is the most complex module. It orchestrates port assignment, process lifecycle, health checking, state persistence, and SSE event broadcasting.

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
    "time"

    "github.com/google/uuid"  // go get github.com/google/uuid
)

// Registrar is implemented by the Tailscale integration (or a no-op).
type Registrar interface {
    Register(port int) (url string, err error)
    Deregister(port int) error
}

// NoopRegistrar does nothing — used when Tailscale is disabled.
type NoopRegistrar struct{}
func (n *NoopRegistrar) Register(port int) (string, error) { return "", nil }
func (n *NoopRegistrar) Deregister(port int) error         { return nil }

// Manager manages the lifecycle of all running sessions.
type Manager struct {
    mu         sync.Mutex
    sessions   map[string]*Session
    stateFile  string
    events     chan Event      // SSE event broadcast channel
    registrar  Registrar
    ocRunner   Runner
    vsRunner   Runner
    ocRange    [2]int
    vsRange    [2]int
}

// Event is sent on the SSE channel when session state changes.
type Event struct {
    Type    string  // "started", "healthy", "stopped"
    Session *Session
}

// NewManager creates a Manager, loads persisted state, and removes orphans.
func NewManager(
    stateFile string,
    ocRunner, vsRunner Runner,
    registrar Registrar,
    ocRange, vsRange [2]int,
) *Manager {
    m := &Manager{
        sessions:  make(map[string]*Session),
        stateFile: stateFile,
        events:    make(chan Event, 64),
        registrar: registrar,
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
    case "oc":
        runner = m.ocRunner
        portRange = m.ocRange
    case "vscode":
        runner = m.vsRunner
        portRange = m.vsRange
    default:
        return nil, fmt.Errorf("unknown session type: %s", sessionType)
    }

    // Check for existing session for this dir+type
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

    // Health check in a goroutine — updates URL when ready
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

    // Determine runner
    var runner Runner
    if s.Type == "oc" {
        runner = m.ocRunner
    } else {
        runner = m.vsRunner
    }
    runner.Stop(s.PID)
    m.registrar.Deregister(s.Port)
    m.saveState()
    m.events <- Event{Type: "stopped", Session: s}
    return nil
}

// waitHealthy polls until the session is healthy, then registers with Tailscale.
func (m *Manager) waitHealthy(s *Session, healthURL string) {
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    ticker := time.NewTicker(time.Second)
    defer ticker.Stop()

    for {
        select {
        case <-ctx.Done():
            return // timed out
        case <-ticker.C:
            resp, err := http.Get(healthURL)
            if err == nil && resp.StatusCode < 500 {
                resp.Body.Close()
                url, _ := m.registrar.Register(s.Port)
                if url == "" {
                    url = healthURL
                }
                m.mu.Lock()
                s.URL = url
                m.mu.Unlock()
                m.saveState()
                m.events <- Event{Type: "healthy", Session: s}
                return
            }
        }
    }
}

// nextPort finds the first available port in the given range.
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

// saveState persists current sessions to disk.
func (m *Manager) saveState() {
    m.mu.Lock()
    defer m.mu.Unlock()

    os.MkdirAll(filepath.Dir(m.stateFile), 0755)
    data, err := json.Marshal(m.sessions)
    if err == nil {
        os.WriteFile(m.stateFile, data, 0644)
    }
}

// loadState reads persisted sessions and removes orphans (dead processes).
func (m *Manager) loadState() {
    data, err := os.ReadFile(m.stateFile)
    if err != nil {
        return // no state file yet
    }
    var loaded map[string]*Session
    if err := json.Unmarshal(data, &loaded); err != nil {
        return
    }
    for id, s := range loaded {
        // Check if process is still alive
        proc, err := os.FindProcess(s.PID)
        if err != nil || proc.Signal(syscall.Signal(0)) != nil {
            continue // orphan — skip
        }
        m.sessions[id] = s
    }
}
```

> **Note on `uuid`:** Add the dependency: `go get github.com/google/uuid`. This is a rare case where using an external package for UUID generation is preferable to a stdlib implementation.

---

## Lesson 6 — `internal/tailscale`: The Optional Plugin

```go
package tailscale

import (
    "fmt"
    "os/exec"
    "strconv"
)

// Serve implements session.Registrar using the tailscale CLI.
type Serve struct {
    Binary string
}

// Register runs: tailscale serve --bg --https={port} http://localhost:{port}
func (s *Serve) Register(port int) (string, error) {
    p := strconv.Itoa(port)
    cmd := exec.Command(s.Binary,
        "serve", "--bg", "--https="+p,
        "http://localhost:"+p,
    )
    if out, err := cmd.CombinedOutput(); err != nil {
        return "", fmt.Errorf("tailscale serve: %w\n%s", err, out)
    }
    // We don't know the hostname here — the caller resolves it separately
    return "", nil
}

// Deregister removes the serve config for the given port.
func (s *Serve) Deregister(port int) error {
    p := strconv.Itoa(port)
    cmd := exec.Command(s.Binary, "serve", "--https="+p, "reset")
    cmd.Run() // best-effort
    return nil
}
```

---

## Lesson 7 — `internal/server`: Wiring It All Together

This lesson adds the HTTP server. The UI (templates) is added in Course 03, so for now handlers return plain text to verify routing works.

### `internal/server/server.go`

```go
package server

import (
    "fmt"
    "log"
    "net/http"
    "os"
    "path/filepath"

    "github.com/yourusername/workspace-portal/internal/config"
    fsmod "github.com/yourusername/workspace-portal/internal/fs"
    "github.com/yourusername/workspace-portal/internal/session"
    "github.com/yourusername/workspace-portal/internal/tailscale"
)

// Start builds all dependencies and starts the HTTP server.
func Start(cfg *config.Config) error {
    // Build registrar
    var registrar session.Registrar
    if cfg.Tailscale.Enabled {
        registrar = &tailscale.Serve{Binary: cfg.Tailscale.Binary}
    } else {
        registrar = &session.NoopRegistrar{}
    }

    // Build runners
    ocRunner := &session.OCRunner{
        Binary: cfg.OC.Binary,
        Flags:  cfg.OC.Flags,
    }
    vsRunner := &session.VSCodeRunner{
        Binary:   cfg.VSCode.Binary,
        Password: cfg.Secret("vscode-password"),
    }

    // State file path
    stateDir, _ := os.UserHomeDir()
    stateFile := filepath.Join(stateDir, ".local", "share", "workspace-portal", "sessions.json")

    // Build manager
    manager := session.NewManager(
        stateFile, ocRunner, vsRunner, registrar,
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

```go
package server

import (
    "fmt"
    "net/http"

    "github.com/yourusername/workspace-portal/internal/config"
    fsmod "github.com/yourusername/workspace-portal/internal/fs"
    "github.com/yourusername/workspace-portal/internal/session"
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
    entries, err := fsmod.List(path, h.cfg.FS.PruneDirs)
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
func (h *handler) events(w http.ResponseWriter, r *http.Request) {
    // SSE requires these headers
    w.Header().Set("Content-Type", "text/event-stream")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")

    flusher, ok := w.(http.Flusher)
    if !ok {
        http.Error(w, "streaming not supported", http.StatusInternalServerError)
        return
    }

    // Send a heartbeat immediately so the browser knows the connection is alive
    fmt.Fprintf(w, ": heartbeat\n\n")
    flusher.Flush()

    // Fan out events from the manager channel to this client
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

Create a minimal `config.yaml`:

```yaml
workspaces_root: ~/workspaces
portal_port: 3000
```

```bash
go run ./cmd/portal
# listening on :3000
```

```bash
curl http://localhost:3000/
# workspace-portal — root: /Users/yourname/workspaces

curl http://localhost:3000/fs/list
# .secrets (git=false children=false)
# cyber-security (git=false children=true)
# de (git=false children=true)
# ...
```

The server works. The UI is plain text for now — that changes in Course 03.

---

## Lesson 8 — Running Tests

```bash
go test ./...
```

All tests should pass. Fix any compilation errors (likely import paths) before continuing.

```bash
# Run with race detector — finds concurrency bugs
go test -race ./...
```

The `-race` flag instruments the binary to detect data races. Run it regularly — the session manager uses shared state across goroutines and race conditions are easy to introduce.

---

## Summary

You now have a working Go binary with:
- Config loading from YAML + env vars + `.secrets/`
- Directory tree listing with smart pruning and git detection
- Session lifecycle management (start, stop, health check, state persistence)
- Optional Tailscale integration via the `Registrar` interface
- HTTP server with all routes stubbed and responding

**Next:** [Course 03 — HTMX and SSE](./course-03-htmx-and-sse.md) — replace the plain-text responses with a real HTMX-driven UI.
