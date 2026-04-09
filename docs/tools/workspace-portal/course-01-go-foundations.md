---
title: "Course 01 — Go Foundations"
---

# Course 01 — Go Foundations

**Goal:** Understand Go well enough to write every module of workspace-portal.  
**Assumed knowledge:** You know TypeScript/JavaScript. Comparisons are made throughout.  
**Output:** By the end of this course you can read and write idiomatic Go and understand why it is structured the way it is.

---

## Lesson 1 — What Go Is and Why It Was Built This Way

Go (also called Golang) was created at Google in 2009 by the people who designed C and Unix. They were frustrated with the tradeoffs of the languages available at the time:

- C/C++ compiled to fast, small binaries but were hard to maintain and had no standard tooling
- Java and C# were safer but slow to compile and verbose
- Python and Ruby were fast to write but slow at runtime and had complex dependency ecosystems
- JavaScript was single-threaded and required a runtime

Go's design goals:
1. **Compile to a single static binary** — no runtime to install, no dependency hell
2. **Compile fast** — Google's massive codebase was taking minutes to compile in C++
3. **Be readable by any Go developer** — one way to format code (`gofmt`), minimal syntax
4. **Concurrency as a first-class citizen** — goroutines and channels, not callbacks or async/await
5. **Explicit error handling** — no exceptions, errors are values you must handle

### What this means for workspace-portal

The portal compiles to a single binary. Users on any machine can download it and run it — no need to install Go, Node.js, Python, or any runtime. This, alongside the desire to learn Go, are the two primary reasons Go was chosen over TypeScript/Bun for this project.

---

## Lesson 2 — Installing Go and the Toolchain

```bash
brew install go
go version    # should print go version 1.22 or later
```

Go comes with everything built-in. No separate package manager (npm, pip) needed:

| Tool | What it does |
|---|---|
| `go build` | Compile to a binary |
| `go run` | Compile and run immediately (like `ts-node`) |
| `go test` | Run tests |
| `go mod init` | Create a module (like `npm init`) |
| `go get` | Add a dependency (like `npm install`) |
| `go fmt` | Format code (like Prettier, runs automatically) |
| `go vet` | Static analysis (like ESLint) |

### Your first Go program

Create a directory:

```bash
mkdir hello-go && cd hello-go
go mod init hello-go
```

`go mod init` creates `go.mod` — this is Go's equivalent of `package.json`. It records the module name and Go version.

Create `main.go`:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, workspace-portal")
}
```

Run it:

```bash
go run main.go
# Hello, workspace-portal
```

Compile it:

```bash
go build -o hello .
./hello
# Hello, workspace-portal
```

The resulting `hello` binary has zero dependencies. Copy it to any machine with the same OS/architecture and it runs.

---

## Lesson 3 — Go Syntax: The Familiar Parts

Coming from TypeScript, most of Go will feel familiar. The syntax is different but the concepts are the same.

### Variables

```go
// TypeScript                    // Go
let name = "portal"              name := "portal"           // inferred type
const port: number = 3000        port := 3000               // := declares AND assigns
let url: string                  var url string             // zero value: ""
```

Go has **zero values** — every variable has a default. `string` defaults to `""`, `int` to `0`, `bool` to `false`, pointers to `nil`. You rarely need to explicitly initialise.

`:=` is the short declaration operator — it declares a new variable and assigns it. It only works inside functions. At package level, use `var`.

### Functions

```go
// TypeScript
function greet(name: string): string {
    return "Hello " + name
}

// Go
func greet(name string) string {
    return "Hello " + name
}
```

Multiple return values — this is one of Go's signature features:

```go
// Go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("cannot divide by zero")
    }
    return a / b, nil
}

result, err := divide(10, 2)
if err != nil {
    // handle error
}
fmt.Println(result)  // 5
```

This replaces exceptions. Every function that can fail returns an `error` as its last return value. If there is no error, it returns `nil`. The caller **must** handle the error explicitly — ignoring it is a conscious choice (`_`).

### Types

```go
// TypeScript                    // Go
type User = {                    type User struct {
    name: string                     Name string
    age: number                      Age  int
}                                }

const u: User = {                u := User{
    name: "Tobias",                  Name: "Tobias",
    age: 30,                         Age:  30,
}                                }

console.log(u.name)              fmt.Println(u.Name)
```

Go uses `struct` instead of TypeScript's object types. Field names starting with a capital letter are exported (public). Lowercase is unexported (private to the package). This is Go's visibility system — no `public`/`private` keywords.

### Slices (arrays)

```go
// TypeScript                    // Go
const ports: number[] = []       ports := []int{}
ports.push(4100)                 ports = append(ports, 4100)
ports.push(4101)                 ports = append(ports, 4101)
console.log(ports[0])            fmt.Println(ports[0])      // 4100
console.log(len(ports))          fmt.Println(len(ports))    // 2
```

### Maps (objects/dicts)

```go
// TypeScript                    // Go
const sessions: Record<          sessions := map[string]int{
    string, number               }
> = {}
sessions["abc"] = 4100           sessions["abc"] = 4100

// Check if key exists
// TypeScript                    // Go
if (sessions["abc"] !== undefined)  if port, ok := sessions["abc"]; ok {
                                        fmt.Println(port)
                                    }
```

The two-value assignment `port, ok := sessions["abc"]` is idiomatic Go — `ok` is `true` if the key exists.

---

## Lesson 4 — Go Syntax: The Different Parts

### No `class` — use structs with methods

Go has no classes. Instead, you attach methods to structs:

```go
// TypeScript
class SessionManager {
    private sessions: Map<string, Session> = new Map()

    start(dir: string): Session { ... }
    stop(id: string): void { ... }
}

// Go
type SessionManager struct {
    sessions map[string]Session
}

func (m *SessionManager) Start(dir string) (Session, error) { ... }
func (m *SessionManager) Stop(id string) error { ... }
```

The `(m *SessionManager)` is called a **receiver**. It is like `this` in TypeScript. The `*` means it is a pointer receiver — the method can modify the struct. More on pointers in Lesson 5.

Create an instance:

```go
manager := &SessionManager{
    sessions: make(map[string]Session),
}
manager.Start("/workspaces/fea/brain")
```

### Interfaces — structural, not declared

TypeScript's interfaces are structural (duck typing). Go's are the same — a type satisfies an interface automatically if it has the right methods. You never write `implements`.

```go
// TypeScript
interface Runner {
    start(): Promise<void>
    stop(): void
    isHealthy(): Promise<boolean>
}

// Go
type Runner interface {
    Start() error
    Stop() error
    IsHealthy() bool
}
```

Any struct that has these three methods automatically satisfies `Runner`. This is how the portal's OC and VS Code sessions are interchangeable — both implement `Runner`, the session manager only knows about `Runner`.

### Error handling — always explicit

```go
// TypeScript — errors are thrown and caught
try {
    const result = riskyOperation()
} catch (e) {
    console.error(e)
}

// Go — errors are returned and checked
result, err := riskyOperation()
if err != nil {
    return fmt.Errorf("operation failed: %w", err)  // wrap with context
}
// use result safely here
```

`fmt.Errorf("...: %w", err)` wraps an error with additional context. The `%w` verb is specifically for wrapping errors so callers can inspect the chain. This is idiomatic Go — always add context when propagating errors upward.

### `defer` — cleanup that always runs

`defer` schedules a function call to run when the surrounding function returns, regardless of how it returns (normal return, early return, panic). This is how Go handles cleanup instead of `try/finally`:

```go
func readFile(path string) (string, error) {
    f, err := os.Open(path)
    if err != nil {
        return "", err
    }
    defer f.Close()   // will always run when readFile returns

    // read file...
    return content, nil
}
```

You will use `defer` constantly in the portal — for closing files, releasing mutexes, cleaning up processes.

---

## Lesson 5 — Pointers

Pointers are the concept TypeScript developers most commonly struggle with in Go. In TypeScript, objects are always passed by reference. Primitives are passed by value. Go makes this explicit.

```go
// Value — a copy is made
func double(n int) int {
    n = n * 2
    return n
}

x := 5
y := double(x)
fmt.Println(x)  // still 5 — x was not modified
fmt.Println(y)  // 10

// Pointer — the original is modified
func doubleInPlace(n *int) {
    *n = *n * 2
}

x := 5
doubleInPlace(&x)    // & takes the address of x
fmt.Println(x)       // 10 — x was modified
```

`&x` means "the address of x" — a pointer to x.  
`*n` means "the value at this address" — dereferencing a pointer.

### When to use pointers in practice

For structs with methods that modify state, use pointer receivers:

```go
// ✗ Value receiver — m is a copy, modifications are lost
func (m SessionManager) Start(dir string) { ... }

// ✓ Pointer receiver — m is the original, modifications persist
func (m *SessionManager) Start(dir string) { ... }
```

For structs, always use `&` when creating them if you'll be passing them around:

```go
manager := &SessionManager{...}   // *SessionManager — a pointer to SessionManager
```

For optional values, use a pointer:

```go
type Config struct {
    Port     int
    Password *string   // nil means "not set"
}
```

A good rule of thumb: if a struct has state that changes (like a session manager), use pointer receivers. If a struct is read-only data (like a config), value receivers are fine.

---

## Lesson 6 — Packages and Modules

### Modules

A Go module is a collection of packages with a single `go.mod` file. It is like a repository. The module name is the import path prefix.

```
workspace-portal/
├── go.mod                        # module github.com/yourname/workspace-portal
├── cmd/
│   └── portal/
│       └── main.go              # package main
├── internal/
│   ├── config/
│   │   └── config.go            # package config
│   ├── fs/
│   │   └── tree.go              # package fs
│   └── session/
│       └── manager.go           # package session
```

### Packages

Every `.go` file starts with `package name`. All files in the same directory must have the same package name. The package name is how you import it.

```go
// internal/config/config.go
package config

type Config struct {
    Port int
    // ...
}

func Load(path string) (*Config, error) {
    // ...
}
```

```go
// cmd/portal/main.go
package main

import (
    "github.com/yourname/workspace-portal/internal/config"
)

func main() {
    cfg, err := config.Load("config.yaml")
    // ...
}
```

### `internal/` directory

The `internal/` directory is special in Go. Packages inside `internal/` can only be imported by code in the parent tree. This enforces encapsulation — `internal/session` cannot be imported by external packages, only by your own code. This is how the portal keeps its implementation private while exposing a clean public API.

### Adding a dependency

```bash
go get gopkg.in/yaml.v3
```

This adds the dependency to `go.mod` and `go.sum` (the lockfile). Import it:

```go
import "gopkg.in/yaml.v3"
```

The portal uses exactly one external dependency: `gopkg.in/yaml.v3` for parsing YAML config files. Everything else is the Go standard library.

---

## Lesson 7 — The Standard Library: What You Need for the Portal

Go's standard library is unusually comprehensive. The portal uses these packages:

### `net/http` — HTTP server and client

```go
// Start an HTTP server
http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello from workspace-portal")
})
http.ListenAndServe(":3000", nil)
```

`http.ResponseWriter` is how you write the response. `*http.Request` has the request data (path, method, headers, body, query params).

More structured routing:

```go
mux := http.NewServeMux()
mux.HandleFunc("GET /", handleIndex)
mux.HandleFunc("GET /fs/list", handleFSList)
mux.HandleFunc("POST /sessions/start", handleSessionStart)

server := &http.Server{
    Addr:    ":3000",
    Handler: mux,
}
server.ListenAndServe()
```

### `html/template` — HTML templating

```go
// Parse a template from a string
tmpl := template.Must(template.New("page").Parse(`
    <html>
    <body>
        <h1>{{.Title}}</h1>
        <ul>
        {{range .Items}}
            <li>{{.Name}}</li>
        {{end}}
        </ul>
    </body>
    </html>
`))

// Execute the template with data
data := struct {
    Title string
    Items []struct{ Name string }
}{
    Title: "Running Sessions",
    Items: []struct{ Name string }{{"fea/brain"}, {"de/web/active"}},
}
tmpl.Execute(w, data)
```

Templates are HTML files with `{{.FieldName}}` placeholders. `{{range .Items}}` is a loop. `{{if .IsGit}}` is a conditional. This is what generates the portal's HTML — no JavaScript templating, no JSX.

### `os/exec` — Running external processes

```go
// Run a command and wait for it to finish
cmd := exec.Command("opencode", "web", "--port", "4100")
cmd.Dir = "/workspaces/fea/brain"   // set working directory
cmd.Env = append(os.Environ(), "OPENCODE_PORT=4100")

err := cmd.Start()   // Start — non-blocking, like child_process.spawn
// later:
err = cmd.Process.Kill()   // kill the process

// Or run and wait for completion:
output, err := exec.Command("tailscale", "version").Output()
```

### `os` — Files, directories, environment

```go
os.ReadDir("/workspaces")          // list directory
os.ReadFile(".secrets/password")   // read a file
os.Getenv("PORTAL_PORT")          // read env var
os.MkdirAll("/some/path", 0755)   // create directories
```

### `encoding/json` — JSON

```go
// Marshal (encode)
data := map[string]string{"id": "abc", "dir": "/workspaces"}
bytes, _ := json.Marshal(data)
fmt.Println(string(bytes))  // {"dir":"/workspaces","id":"abc"}

// Unmarshal (decode)
var session Session
json.Unmarshal(bytes, &session)
```

### `sync` — Concurrency primitives

The portal handles multiple HTTP requests simultaneously (Go runs handlers in goroutines). Shared state like the session list needs a mutex:

```go
type SessionManager struct {
    mu       sync.Mutex
    sessions map[string]Session
}

func (m *SessionManager) Add(s Session) {
    m.mu.Lock()         // like acquiring a lock
    defer m.mu.Unlock() // release when function returns
    m.sessions[s.ID] = s
}
```

### `embed` — Embedding static files into the binary

This is how the portal ships its HTML templates and HTMX script inside the binary itself:

```go
import _ "embed"

//go:embed templates/layout.html
var layoutHTML string

//go:embed static/htmx.min.js
var htmxJS []byte
```

The `//go:embed` comment (a compile-time directive) tells the compiler to embed the file's contents into the variable. The resulting binary contains the HTML — no external files needed.

---

## Lesson 8 — Concurrency: Goroutines and Channels

This is where Go truly differs from JavaScript. Go was built for concurrency.

### Goroutines

A goroutine is a lightweight thread managed by the Go runtime. Launch one with `go`:

```go
// TypeScript — async/await
async function startSession() {
    await waitForHealth(port)
}
startSession()

// Go — goroutine
go func() {
    waitForHealth(port)
}()
// execution continues immediately
```

The portal uses goroutines for:
- Handling each HTTP request (the HTTP server does this automatically)
- Health-checking a newly started session without blocking the response
- Broadcasting SSE events to all connected clients

### Channels

Channels are how goroutines communicate safely:

```go
// Create a channel that carries strings
events := make(chan string, 10)   // buffered: can hold 10 messages without blocking

// Goroutine 1 — sends events
go func() {
    events <- "session.started"
}()

// Goroutine 2 — receives events
go func() {
    for event := range events {
        fmt.Println("Event:", event)
    }
}()
```

The portal uses a channel as its SSE event bus: when a session starts or stops, a message is sent to the channel, and the SSE handler reads from it and sends it to connected browsers.

### The `select` statement

```go
// Wait for whichever happens first
select {
case event := <-events:
    fmt.Println("got event:", event)
case <-time.After(30 * time.Second):
    fmt.Println("timeout waiting for event")
}
```

This is used in the health-check loop: wait for either a healthy response or a timeout.

---

## Lesson 9 — Error Handling Patterns

Go error handling has conventions. Learning them makes Go code idiomatic.

### The sentinel error

```go
var ErrPortExhausted = errors.New("port range exhausted")

func (m *SessionManager) nextPort() (int, error) {
    // ...
    return 0, ErrPortExhausted
}

// Caller checks for specific errors:
port, err := manager.nextPort()
if errors.Is(err, ErrPortExhausted) {
    // handle specifically
}
```

### Wrapping errors with context

```go
// Each layer adds context:
// session manager:
return 0, fmt.Errorf("nextPort: %w", err)
// server handler:
return fmt.Errorf("handleStart: %w", err)
// logged at top:
// "handleStart: nextPort: port range exhausted"
```

The `%w` verb wraps the error. `errors.Is(err, ErrPortExhausted)` unwraps through the chain.

### Error handling at the boundary

Errors propagate upward until they reach a "boundary" — usually an HTTP handler — where they are converted into an HTTP response:

```go
func handleSessionStart(w http.ResponseWriter, r *http.Request) {
    session, err := manager.Start(r.FormValue("dir"), r.FormValue("type"))
    if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
        return
    }
    // render success response
    renderSessions(w, manager.List())
}
```

---

## Lesson 10 — Testing in Go

Go has testing built in. No test runner to install, no config files.

### Writing a test

Create `config_test.go` next to `config.go`:

```go
package config

import (
    "testing"
    "os"
)

func TestLoadFromFile(t *testing.T) {
    // write a temp config file
    tmp, _ := os.CreateTemp("", "config*.yaml")
    tmp.WriteString("portal_port: 4000\n")
    tmp.Close()

    cfg, err := Load(tmp.Name())
    if err != nil {
        t.Fatalf("expected no error, got: %v", err)
    }
    if cfg.Port != 4000 {
        t.Errorf("expected port 4000, got %d", cfg.Port)
    }
}
```

Run tests:

```bash
go test ./...          # run all tests in the module
go test ./internal/config/...    # run tests for one package
go test -v ./...       # verbose output
go test -run TestLoadFromFile ./internal/config/...  # run one test
```

### What makes a good Go test

- Test **exported behaviour** (public functions/methods), not internals
- Use **table-driven tests** for multiple cases:

```go
func TestPortAssignment(t *testing.T) {
    tests := []struct {
        name       string
        inUse      []int
        rangeStart int
        rangeEnd   int
        wantPort   int
        wantErr    bool
    }{
        {"first port free", []int{}, 4100, 4199, 4100, false},
        {"first port taken", []int{4100}, 4100, 4199, 4101, false},
        {"all ports taken", []int{4100, 4101}, 4100, 4101, 0, true},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            got, err := assignPort(tt.inUse, tt.rangeStart, tt.rangeEnd)
            if (err != nil) != tt.wantErr {
                t.Errorf("wantErr=%v, got err=%v", tt.wantErr, err)
            }
            if got != tt.wantPort {
                t.Errorf("want %d, got %d", tt.wantPort, got)
            }
        })
    }
}
```

- Use **interfaces to swap real dependencies for fakes** in tests:

```go
// Instead of calling the real tailscale binary, inject a fake:
type fakeRegistrar struct{ registeredPorts []int }
func (f *fakeRegistrar) Register(port int) (string, error) {
    f.registeredPorts = append(f.registeredPorts, port)
    return fmt.Sprintf("https://machine.ts.net:%d", port), nil
}

manager := NewSessionManager(config, &fakeRegistrar{})
```

---

## Lesson 11 — Reading YAML Config

The portal's only external dependency is `gopkg.in/yaml.v3`. Here is how it works:

```bash
go get gopkg.in/yaml.v3
```

```go
package config

import (
    "os"
    "gopkg.in/yaml.v3"
)

type Config struct {
    WorkspacesRoot string    `yaml:"workspaces_root"`
    PortalPort     int       `yaml:"portal_port"`
    OC             OCConfig  `yaml:"oc"`
    VSCode         VSConfig  `yaml:"vscode"`
}

type OCConfig struct {
    Binary    string `yaml:"binary"`
    PortRange [2]int `yaml:"port_range"`
    Flags     []string `yaml:"flags"`
}

type VSConfig struct {
    Binary    string `yaml:"binary"`
    PortRange [2]int `yaml:"port_range"`
}

func Load(path string) (*Config, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("reading config: %w", err)
    }

    cfg := &Config{
        PortalPort: 3000,               // default
        OC: OCConfig{
            Binary:    "opencode",
            PortRange: [2]int{4100, 4199},
        },
        VSCode: VSConfig{
            Binary:    "code-server",
            PortRange: [2]int{4200, 4299},
        },
    }

    if err := yaml.Unmarshal(data, cfg); err != nil {
        return nil, fmt.Errorf("parsing config: %w", err)
    }

    return cfg, nil
}
```

The struct tags (`` `yaml:"field_name"` ``) tell the YAML parser which YAML key maps to which struct field. This is the same pattern used for JSON (`` `json:"field_name"` ``).

---

## Lesson 12 — Building for Production

### Cross-compilation

Go can compile for any OS/architecture from any machine:

```bash
# Build for Linux (for Docker) from macOS
GOOS=linux GOARCH=amd64 go build -o portal-linux ./cmd/portal

# Build for macOS Apple Silicon
GOOS=darwin GOARCH=arm64 go build -o portal-macos-arm ./cmd/portal

# Build with optimisations and stripped debug info (smaller binary)
go build -ldflags="-s -w" -o portal ./cmd/portal
```

### Checking your binary

```bash
ls -lh portal          # check file size — should be ~10-15MB
file portal            # check architecture
otool -L portal        # macOS: check dynamic library links (should show none)
ldd portal             # Linux: same
```

A properly built Go binary is fully static — `ldd` will say "not a dynamic executable".

---

## Summary

You now understand:

- Go's module system and how it compares to npm
- Variables, functions, structs, slices, maps — the building blocks
- Pointer semantics — when and why to use `*` and `&`
- Interfaces — how Go achieves polymorphism without inheritance
- Error handling — returning and wrapping errors instead of throwing exceptions
- The standard library packages the portal uses: `net/http`, `html/template`, `os/exec`, `os`, `encoding/json`, `sync`, `embed`
- Goroutines and channels — Go's concurrency model
- Testing — table-driven tests and interface injection
- YAML config parsing
- Cross-compilation

**Next:** [Course 02 — Building the Portal in Go](./course-02-building-the-portal.md) — put all of this into practice by implementing each module of workspace-portal, starting from the scaffold and ending with a working binary.
