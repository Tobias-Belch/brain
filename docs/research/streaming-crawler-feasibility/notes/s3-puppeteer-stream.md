# Source Note: S3 - puppeteer-stream npm package

## Metadata
- Source: https://www.npmjs.com/package/puppeteer-stream
- Date: 2026 (published 9 months ago)
- Type: Web (npm package)
- Quality: High

## Key Claims
- Captures audio/video streams from a page via MediaRecorder API
- Works in headless mode
- Can save stream directly to file
- Supports various mimeTypes and quality settings

## Evidence Extracts
- "An Extension for Puppeteer to retrieve audio and/or video streams of a page"
- "Works also in headless mode (no gui needed), just set headless: 'new'"

## Limitations
- Uses browser-level MediaRecorder (re-encodes), not the original stream
- Not suitable for high-quality archival (captures what browser renders, not original segments)
