---
title: 'Source Note: S4 - Adaptive Bitrate Streaming: HLS, DASH, and CDN Delivery'
---

# Source Note: S4 - Adaptive Bitrate Streaming: HLS, DASH, and CDN Delivery

## Metadata
- Source: https://kindatechnical.com/system-design-interview/adaptive-bitrate-streaming-hls-dash-and-cdn-delivery.html
- Date: 2026-03-19
- Type: Web (Technical blog)
- Quality: High

## Key Claims
- HLS (~80% mobile market share) and DASH (~60% web) are the dominant streaming protocols
- Both break video into small segments (2-10 seconds) referenced by a manifest file
- HLS uses .m3u8 playlists pointing to .ts or fMP4 segments
- DASH uses XML-based MPD manifests
- CMAF (Common Media Application Format) now allows shared segments between HLS and DASH

## Evidence Extracts
- HLS manifest example shows #EXT-X-STREAM-INF lines with bandwidth and resolution variants
- Segments are fetched individually via HTTP GET requests

## Limitations
- Educational content, not specifically about automation/downloading
