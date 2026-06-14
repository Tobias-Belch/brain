---
title: 'Source Note: S6 - Headless Browser Detection & Evasion'
---

# Source Note: S6 - Headless Browser Detection & Evasion

## Metadata
- Source: https://dev.to/vhub_systems_ed5641f65d59/how-sites-detect-headless-browsers-and-how-to-evade-each-signal-2026-guide-2jj0
- Date: 2026-04-03
- Type: Web (DEV Community guide)
- Quality: High

## Key Claims
- Sites use probabilistic detection (bot score) based on multiple signals
- Key signals: navigator.webdriver, missing plugins, CDP exposure, Canvas/WebGL fingerprinting, behavioral patterns
- Stealth plugins exist but are imperfect
- Playwright/Puppeteer can be detected even with stealth patches

## Evidence Extracts
- "Detection is probabilistic, not binary. Sites like Cloudflare, Akamai, and DataDome maintain a 'bot score'"
- Key evasion: overriding navigator.webdriver, patching CDP detection, adding realistic mouse movements

## Limitations
- Evasion is an arms race; techniques that work today may not work tomorrow
- Sophisticated sites (Google, banking) are hardest to bypass
