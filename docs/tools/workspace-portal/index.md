---
title: "Workspace Portal — Course Index"
---

# Workspace Portal — Course Index

A self-study series for building **workspace-portal** from scratch. Each course produces working code and teaches the technology used to build the portal.

**Audience:** Developers familiar with TypeScript/JavaScript who want to learn Go, HTMX, and Docker through a real project.

**Project:** A self-hosted, mobile-friendly web portal that launches and manages per-directory [OpenCode](https://opencode.ai) and [code-server](https://github.com/coder/code-server) sessions over Tailscale.

---

## Courses

| Course | Topic | What you build |
|---|---|---|
| [Course 01](./course-01-go-foundations.md) | Go Foundations | Go language, stdlib, toolchain — referenced throughout |
| [Course 02](./course-02-building-the-portal.md) | Building the Portal in Go | All Go modules: config, fs, session, HTTP server (text stubs) |
| [Course 03](./course-03-htmx-and-sse.md) | HTMX and Server-Sent Events | Full UI: directory tree, session management, live SSE updates |
| [Course 04](./course-04-docker.md) | Docker | Multi-stage Dockerfile, Compose, volumes, secrets |
| [Course 05](./course-05-deployment.md) | Deployment | launchd service, production checklist, README, config example |
| [Course 06](./course-06-docs-viewer.md) | Centralised Documentation Viewer | Astro Starlight child process, `.gitignore` filtering, reverse proxy at `/docs` |
| [Course 07](./course-07-tailscale.md) | Tailscale Setup | Install, MagicDNS + HTTPS in admin console, `tailscale serve`, `internal/tailscale` Go module |

---

## Prerequisites

- Comfortable with TypeScript/JavaScript (used as the comparison language throughout)
- A Mac with Go 1.22+ installed
- Node.js 20+ installed (needed for Course 06 — the docs viewer runs an Astro child process at runtime)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) or [OrbStack](https://orbstack.dev) (for Course 04+) — OrbStack is a lighter, faster alternative to Docker Desktop on macOS
- Tailscale installed and connected to a tailnet (optional — needed for Course 07 only)

---

## Learning Path

The courses are designed to be read and coded in order. Each course begins where the previous one left off. If you are already comfortable with a topic, you can skim the early lessons and start coding at the first code block you have not seen before.

---

## Reference

- [PRD — Product Requirements Document](./00-prd.md) — full specification: user stories, module design, config schema, SSE events, testing decisions
- [Go standard library](https://pkg.go.dev/std)
- [HTMX documentation](https://htmx.org/docs/)
- [Docker documentation](https://docs.docker.com/)
- [launchd reference](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPSystemStartup/Chapters/CreatingLaunchdJobs.html)
- [Tailscale serve CLI reference](https://tailscale.com/kb/1242/tailscale-serve)
- [Tailscale MagicDNS](https://tailscale.com/kb/1081/magicdns)
- [Tailscale HTTPS certificates](https://tailscale.com/kb/1153/enabling-https)
