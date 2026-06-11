# Source Note: S2 - yt-dlp: CLI Video Downloader in 2026

## Metadata
- Source: https://dev.to/pickuma/yt-dlp-the-cli-video-downloader-developers-actually-use-in-2026-57jk
- Date: 2026-05-12
- Type: Web (DEV Community article)
- Quality: High

## Key Claims
- yt-dlp covers 1700+ sites with extractors
- Plugin architecture for custom extractors
- Python API for embedding in pipelines
- --download-archive flag enables cron-driven mirroring
- --cookies-from-browser handles auth for gated content
- --concurrent-fragments for parallel segment downloading
- Live HLS/DASH stream recording with --live-from-start

## Evidence Extracts
- "yt-dlp has become the default tool when you need to programmatically pull video or audio from a URL"
- "The --download-archive appends each successfully downloaded video ID to a file... This is the single most useful flag for cron-driven mirroring"
- "For dataset collection workflows where you only need metadata and captions, combine --write-info-json --write-subs --sub-langs en --skip-download"

## Limitations
- Focused on YouTube; generic extractor may not work on all sites
- yt-dlp's generic extractor needs a page with specific patterns to extract video URLs
