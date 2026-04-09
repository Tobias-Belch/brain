---
title: "Course 04 — Docker"
---

# Course 04 — Docker

**Goal:** Package workspace-portal into a minimal Docker image using multi-stage builds, understand how Docker runs Go binaries, and wire up volumes, environment variables, and secrets for the containerised portal.  
**Prerequisite:** [Course 03 — HTMX and SSE](/tools/workspace-portal/course-03-htmx-and-sse.md)  
**Output:** A working `Dockerfile`, a `docker-compose.yml` for local development, and a compiled Docker image that runs the portal.

---

## Lesson 1 — What is Docker and Why Use It?

### The core problem Docker solves

Your Go binary compiles to a single executable. On macOS that's an `arm64` ELF binary. On a Linux server it's an `amd64` (or `arm64`) ELF binary. If you `scp` a macOS binary to a Linux machine, it will not run — different OS, different instruction set, different system call interface.

Docker wraps the binary together with the OS environment it needs (filesystem layout, shared libraries, PATH) into an image. That image runs the same way everywhere Docker is installed.

For workspace-portal specifically, Docker gives us:
1. **Reproducible builds** — the binary is compiled in a known environment, not your local `go build`
2. **Portable deployment** — the same image runs on your Mac (via Docker Desktop or OrbStack), on a Linux VPS, or in Kubernetes
3. **Clean dependency isolation** — the image carries only what it needs; nothing from your host system leaks in
4. **Simple secrets handling** — Docker Swarm and Kubernetes have first-class secrets support that maps to `/run/secrets/`, which our config already handles

### Running Docker on macOS

Docker on macOS requires a Linux VM because containers are a Linux kernel feature (namespaces + cgroups). Two good options:

**Docker Desktop** — the official option from Docker Inc. Free for personal use.
```bash
brew install --cask docker
# Then open Docker.app from Applications to start the VM
```

**OrbStack** — a faster, lighter alternative built specifically for macOS. Lower memory and CPU usage than Docker Desktop; native Apple Silicon support; starts in under a second. Free for personal use, paid for commercial use.
```bash
brew install --cask orbstack
# Then open OrbStack.app — it installs the docker CLI shim automatically
```

Both provide the same `docker` and `docker compose` CLI. All commands in this course work with either. If you are on Apple Silicon and resource usage matters, OrbStack is the better choice.

### Docker concepts (for a JS developer)

| Docker concept | JavaScript analogy |
|---|---|
| Image | `node_modules` + your app bundled together |
| Container | A running instance of the image (like a process) |
| Dockerfile | `package.json` build script — instructions to create the image |
| Layer | Each instruction in a Dockerfile adds a layer (like a cache entry) |
| Registry | npm registry — stores and distributes images |
| `docker build` | `npm install && npm run build` |
| `docker run` | `node dist/index.js` |
| Volume | A mount that maps host directory into the container (like `--mount` in Node) |
| `docker-compose` | Like `pm2` — runs multiple containers together |

### Image layers

A Docker image is a stack of read-only layers. Each `RUN`, `COPY`, and `ADD` instruction in a Dockerfile creates a new layer. Layers are cached — if the instruction and its inputs have not changed, Docker reuses the cached layer.

This is why we separate `go mod download` (changes rarely) from `go build` (changes on every code change):

```dockerfile
# Layer 1: copy go.mod and go.sum only (changes rarely → cached)
COPY go.mod go.sum ./
RUN go mod download

# Layer 2: copy all source (changes often → invalidates cache from here)
COPY . .
RUN go build -o portal ./cmd/portal
```

If you change source code, layer 1 is served from cache and only layer 2 is re-run. If you change `go.mod`, both layers re-run.

---

## Lesson 2 — Multi-Stage Builds

### Why multi-stage?

The Go toolchain (`gc`, `go`, `gofmt`, the standard library sources) is ~500 MB. Your compiled binary is ~10 MB. We do not want to ship 500 MB of build tools in a production image.

Multi-stage builds solve this:

```dockerfile
# Stage 1 — builder: has Go toolchain, builds the binary
FROM golang:1.22-alpine AS builder
COPY . .
RUN go build -o portal ./cmd/portal

# Stage 2 — runtime: tiny base image, no Go toolchain
FROM alpine:3.21
COPY --from=builder /app/portal /usr/local/bin/portal
```

The final image contains only what `FROM alpine:3.21` provides plus the binary we copied. The builder stage is discarded.

### Why Alpine (not `scratch`)?

`scratch` is an empty filesystem — no shell, no libc, nothing. It produces the smallest possible image but has two drawbacks for us:

1. **No shell** — `docker exec` for debugging is impossible
2. **CA certificates** — the portal makes HTTPS health checks (polling `http://localhost:{port}/`). Static binaries that use Go's built-in TLS need the system CA bundle at `/etc/ssl/certs/ca-certificates.crt`. Alpine provides this.

Alpine Linux is a ~5 MB musl-libc-based distro designed for containers. It gives us:
- `sh` for debugging
- CA certificates
- `wget`/`curl` for health checks
- ~10 MB total image overhead

For a Go binary compiled with CGO disabled (pure Go, no C bindings), Alpine is the sweet spot between size and usability.

---

## Lesson 3 — Writing the Dockerfile

Create `deploy/docker/Dockerfile`:

```dockerfile
# ─── Stage 1: Build ──────────────────────────────────────────────────────────
FROM golang:1.22-alpine AS builder

# Install git — needed if go modules fetch via git
RUN apk add --no-cache git

WORKDIR /build

# Download dependencies first (cached layer — only re-runs if go.mod/sum change)
COPY go.mod go.sum ./
RUN go mod download

# Copy source
COPY . .

# Build the binary
# CGO_ENABLED=0  — disable CGO so the binary is fully static (no libc dependency)
# GOOS=linux     — target Linux even if building on macOS
# -ldflags       — strip debug info and symbol table to reduce binary size
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-s -w" \
    -o /portal \
    ./cmd/portal

# ─── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM alpine:3.21

# Install CA certificates (required for TLS health checks)
RUN apk add --no-cache ca-certificates

# Create a non-root user for security
RUN adduser -D -u 1000 portal

# Create the XDG state directory for session persistence
RUN mkdir -p /home/portal/.local/share/workspace-portal \
    && chown -R portal:portal /home/portal

USER portal
WORKDIR /home/portal

# Copy the compiled binary from the builder stage
COPY --from=builder /portal /usr/local/bin/portal

# The portal listens on this port (configurable via PORTAL_PORTAL_PORT env var)
EXPOSE 3000

# Use exec form (not shell form) so the process receives signals directly
ENTRYPOINT ["portal"]
```

### What the build flags do

| Flag | Effect |
|---|---|
| `CGO_ENABLED=0` | Disables C interop. The binary links only Go code — no `libc` dependency. Required for `scratch`; strongly recommended for Alpine. |
| `GOOS=linux` | Cross-compiles for Linux regardless of the build host OS. On macOS this produces a Linux binary. |
| `-ldflags="-s -w"` | `-s` strips the symbol table. `-w` strips DWARF debug info. Together they reduce binary size by ~25%. |
| `ENTRYPOINT` exec form | `["portal"]` runs `portal` directly as PID 1. Shell form (`portal`) runs `sh -c "portal"` as PID 1 — signals (SIGTERM from `docker stop`) go to `sh`, not `portal`. Use exec form always. |

### Build and test the image

From the repo root:

```bash
docker build -f deploy/docker/Dockerfile -t workspace-portal:dev .
```

Inspect what was built:

```bash
docker images workspace-portal
# REPOSITORY          TAG   IMAGE ID       CREATED         SIZE
# workspace-portal    dev   abc123def456   2 seconds ago   ~20MB
```

~20 MB is the expected size: Alpine base (~5 MB) + CA certs (~1 MB) + portal binary (~12 MB).

Run it with a test config:

```bash
docker run --rm \
  -p 3000:3000 \
  -e PORTAL_WORKSPACES_ROOT=/workspaces \
  -v ~/workspaces:/workspaces:ro \
  workspace-portal:dev
```

Open `http://localhost:3000` — the portal should show your workspaces tree.

---

## Lesson 4 — Volumes, Secrets, and Environment Variables

### Volumes

The portal needs access to two things from the host:

1. **Workspaces directory** — the source tree to browse and launch sessions in
2. **Session state** — `~/.local/share/workspace-portal/sessions.json`

```bash
docker run \
  -v ~/workspaces:/workspaces:ro \
  -v portal-state:/home/portal/.local/share/workspace-portal \
  workspace-portal:dev
```

- `~/workspaces:/workspaces:ro` — mounts your workspaces directory read-only (the portal only reads it)
- `portal-state:/home/portal/.local/share/workspace-portal` — named Docker volume for state persistence

> **Why a named volume for state?** Named volumes survive `docker rm` and `docker run` cycles. If you mount a host directory (`:rw`), path ownership can cause permission issues between the host user and the container's `portal` user (UID 1000). Named volumes avoid this — Docker owns the volume and handles permissions.

### Environment variables

All config values can be passed as env vars (prefix `PORTAL_`):

```bash
docker run \
  -e PORTAL_WORKSPACES_ROOT=/workspaces \
  -e PORTAL_PORTAL_PORT=3000 \
  -e PORTAL_OC_BINARY=/usr/local/bin/opencode \
  workspace-portal:dev
```

For nested config keys like `oc.port_range`, the env var convention from our config module is `PORTAL_OC_PORT_RANGE=4100-4199`.

### Docker secrets

Docker Swarm and Kubernetes mount secrets as files under `/run/secrets/`:

```
/run/secrets/vscode-password    ← contents: "mysecretpassword"
```

Our config module already checks `/run/secrets/{name}` as a fallback after `.secrets/{name}`. In Docker:

```yaml
# docker-compose.yml
services:
  portal:
    image: workspace-portal:dev
    secrets:
      - vscode-password

secrets:
  vscode-password:
    file: ./secrets/vscode-password  # plain text file on the host
```

Docker maps `./secrets/vscode-password` into the container at `/run/secrets/vscode-password`. The portal reads it automatically.

---

## Lesson 5 — `docker-compose.yml`

`docker-compose` coordinates multi-container applications and simplifies the `docker run` command. For a single-container app like the portal, it mainly serves as a documented, version-controlled run configuration.

Create `deploy/docker/docker-compose.yml`:

```yaml
version: "3.9"

services:
  portal:
    image: workspace-portal:dev
    build:
      context: ../..          # repo root
      dockerfile: deploy/docker/Dockerfile
    ports:
      - "3000:3000"
    environment:
      PORTAL_WORKSPACES_ROOT: /workspaces
      PORTAL_PORTAL_PORT: "3000"
      PORTAL_OC_BINARY: opencode
      PORTAL_VSCODE_BINARY: code-server
    volumes:
      # Mount workspaces read-only — portal navigates but does not write
      - type: bind
        source: ${WORKSPACES_ROOT:-~/workspaces}
        target: /workspaces
        read_only: true
      # Named volume for session state persistence
      - type: volume
        source: portal-state
        target: /home/portal/.local/share/workspace-portal
    secrets:
      - vscode-password
    restart: unless-stopped

volumes:
  portal-state:

secrets:
  vscode-password:
    file: ../../.secrets/vscode-password
```

Run with:

```bash
cd deploy/docker
docker compose up --build
```

Stop with `Ctrl-C`. Start in background:

```bash
docker compose up -d
docker compose logs -f portal
```

### `${WORKSPACES_ROOT:-~/workspaces}` — shell variable substitution in Compose

Compose supports `${VAR:-default}` — use `VAR` from the environment, or `~/workspaces` if unset. Set `WORKSPACES_ROOT=/home/yourname/workspaces` in a `.env` file alongside `docker-compose.yml`:

```
# deploy/docker/.env
WORKSPACES_ROOT=/home/yourname/workspaces
```

---

## Lesson 6 — Launching Processes Inside the Container

The portal spawns `opencode` and `code-server` subprocesses. For this to work inside a Docker container, those binaries must exist inside the container.

### Option A — pass through to host (recommended for dev)

Mount the host binaries as read-only files:

```yaml
volumes:
  - /usr/local/bin/opencode:/usr/local/bin/opencode:ro
  - /usr/local/bin/code-server:/usr/local/bin/code-server:ro
```

Configure them in the compose environment:

```yaml
environment:
  PORTAL_OC_BINARY: /usr/local/bin/opencode
  PORTAL_VSCODE_BINARY: /usr/local/bin/code-server
```

The spawned processes run inside the container's PID namespace but use the host binary. This works as long as the binaries are dynamically linked against a compatible libc (likely glibc). If they are statically linked, it works unconditionally.

> **Limitation:** Processes spawned by the portal inherit the container's filesystem namespace. The "target directory" passed to `opencode` or `code-server` is the path inside the container (e.g. `/workspaces/my-project`), not the host path. Ensure the workspaces volume is mounted at the same path the portal uses.

### Option B — build with binaries (self-contained image)

Copy the binaries into the Docker image during the build:

```dockerfile
# In the runtime stage, before ENTRYPOINT:
COPY --from=builder /build/opencode /usr/local/bin/opencode
COPY --from=builder /build/code-server /usr/local/bin/code-server
```

This requires them to be present in the build context or downloadable as a build step. The advantage is a fully self-contained image; the disadvantage is a much larger image and version management complexity.

For personal use, Option A (volume-mounted binaries) is simpler.

### Networking: sessions started by the portal

When the portal spawns `opencode --port 4101`, that process binds `127.0.0.1:4101` inside the container. From the host, that port is not reachable unless you expose it.

**Solution: expose the session port range:**

```yaml
ports:
  - "3000:3000"       # portal
  - "4100-4199:4100-4199"  # OC sessions
  - "4200-4299:4200-4299"  # VS Code sessions
```

Exposing a range of 200 ports is fine for Docker on a local machine. For production (remote server), you would add these ranges to your Tailscale or reverse proxy configuration instead.

---

## Lesson 7 — Image Health Check

Docker can monitor container health and restart it (or report it unhealthy) if a health check fails. Add to the `Dockerfile` runtime stage:

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1
```

`wget` (provided by Alpine's busybox) fetches the portal root. If it returns non-zero, the container is marked unhealthy after 3 failures. Docker Compose and orchestrators (Kubernetes, Swarm) can restart unhealthy containers.

| Flag | Meaning |
|---|---|
| `--interval=30s` | Run the check every 30 seconds |
| `--timeout=5s` | Fail the check if it takes more than 5 seconds |
| `--start-period=10s` | Do not count failures in the first 10 seconds (startup grace period) |
| `--retries=3` | Mark unhealthy after 3 consecutive failures |

---

## Lesson 8 — Docker Layer Caching in CI

If you add a CI pipeline later (GitHub Actions, GitLab CI), layer caching matters for build speed. The two key practices:

### 1. Separate dependency download from source copy

Already done in our Dockerfile — `go mod download` is a separate layer before `COPY . .`.

### 2. Use BuildKit

Docker BuildKit (`DOCKER_BUILDKIT=1`) enables parallel stage execution, inline cache, and better cache utilisation:

```bash
DOCKER_BUILDKIT=1 docker build -f deploy/docker/Dockerfile -t workspace-portal:dev .
```

In `docker-compose.yml`, BuildKit is enabled by default in Compose v2.

### 3. `.dockerignore`

Create a `.dockerignore` at the repo root to prevent unnecessary files being included in the build context (each file in the context is sent to the Docker daemon):

```
# .dockerignore
.git
.secrets
*.local
node_modules
dist
*.md
deploy/launchd
```

With `.dockerignore`, `COPY . .` in the Dockerfile copies only Go source files, templates, and static assets — not git history, secrets, or documentation.

---

## Lesson 9 — Building for Multiple Architectures

Your macOS M1/M2/M3 uses `arm64`. A Linux server typically uses `amd64`. Docker's `buildx` builds for multiple architectures in one step:

```bash
# One-time: create a multi-arch builder
docker buildx create --name multiarch --use

# Build and push for both amd64 and arm64
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -f deploy/docker/Dockerfile \
  -t ghcr.io/yourusername/workspace-portal:latest \
  --push \
  .
```

Go makes multi-arch trivially easy — just set `GOARCH` in the build command:

```dockerfile
# Automatically uses the target architecture Docker is building for
RUN CGO_ENABLED=0 go build -ldflags="-s -w" -o /portal ./cmd/portal
```

Go's toolchain cross-compiles natively. No emulation layer needed during the build.

---

## Lesson 10 — Inspecting and Debugging

### Shell into a running container

```bash
docker exec -it <container-name-or-id> sh
```

Since our image is Alpine (not `scratch`), we have a shell. Useful for:
- Checking if binaries are present: `which opencode`
- Inspecting the state file: `cat ~/.local/share/workspace-portal/sessions.json`
- Testing network connectivity: `wget -qO- http://localhost:4101/`

### View container logs

```bash
docker logs <container-name>       # print all logs
docker logs -f <container-name>    # follow (like tail -f)
docker compose logs -f portal      # with compose
```

### Inspect the image

```bash
# What layers make up the image and how big are they?
docker history workspace-portal:dev

# Dive into the image filesystem layer by layer (requires dive tool)
brew install dive
dive workspace-portal:dev
```

### Common issues

**"exec format error"** — you built an `arm64` binary on your Mac and are running it on an `amd64` machine (or vice versa). Fix: set `GOARCH` explicitly or use `docker buildx`.

**"permission denied"** — the binary does not have execute permission, or the container user cannot read a volume. Check `ls -la` inside the container.

**"no such file or directory" for the binary** — the `COPY --from=builder` path is wrong. Check the builder stage output path matches exactly.

**Sessions not persisting** — the state directory volume is not mounted, or the container user does not own the directory. Check `ls -la ~/.local/share/`.

---

## Summary

You now know how to:

- **Build a multi-stage Docker image** that separates compilation from the runtime image, producing a ~20 MB final image
- **Configure the portal via environment variables** in a Docker Compose file
- **Mount host volumes** for workspaces (read-only) and session state (read-write named volume)
- **Pass secrets** via Docker secrets mapped to `/run/secrets/`
- **Expose spawned session ports** to the host network
- **Add a health check** so Docker can monitor and restart the portal
- **Build for multiple architectures** using `docker buildx`
- **Inspect and debug** running containers

The portal is now packaged and portable. In the final course we deploy it on macOS as a native `launchd` service.

**Next:** [Course 05 — Deployment](/tools/workspace-portal/course-05-deployment.md) — install the portal as a `launchd` service that starts on login and set up the full production environment.
