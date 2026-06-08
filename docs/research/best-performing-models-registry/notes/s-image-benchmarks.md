---
title: 's-image-benchmarks'
---

# Source Note: s-image-benchmarks

## Metadata
- Source: Multiple — Arena AI (arena.ai), Artificial Analysis, Lumenfall, KEAR AI, Kingy AI, Digital Applied, ToolHalla, TokenMix, ImagenWorld (arxiv), ModelHunter, Magic Hour Research
- Date: 2025-12 through 2026-06
- Type: web
- Quality: high

---

## 1. Text-to-Image Arena (Arena AI / LM Arena)

### Key Claims
- **GPT-Image-2 (medium)** swept all 7 categories: #1 Overall T2I, #1 Single-Image Edit, #1 Multi-Image Edit (launched Apr 2026).
- Elo 1512 vs #2 (nano-banana-2) at 1270 — a +242 point gap, the largest ever on Image Arena. The gap between #2 and ~#30 is ~250 pts, meaning the margin equals the entire rest of the competitive field combined.
- Text rendering accuracy jumped from ~90–95% to >99%.
- Prior to GPT-Image-2, **GPT-Image-1.5 High-Fidelity** led at ~1241-1264 Elo (Dec 2025–Feb 2026).
- **nano-banana-2** (Gemini 3.1 Flash Image Preview) and **nano-banana-pro** (Gemini 3 Pro Image Preview 2K) from Google held ranks #2/#3 at 1270/1244 pre-GPT-Image-2.
- Google's **nano-banana-2** led at 1288 on Lumenfall's TrueSkill-based Arena (May 17, 2026 snapshot), suggesting different methodologies yield slightly different ordering.
- **FLUX.2 Max** (Black Forest Labs) consistently at ~1165-1169 Elo, making it the top open-weights-adjacent commercial model.
- **MAI-Image-2** (Microsoft) entered at 1184.
- **Seedream 4.5/4-2K** (ByteDance) at ~1140-1144.
- **Qwen-Image 2512** (Alibaba, Apache 2.0) at ~1138 — highest-ranked open-weight model.

### Evidence Extracts
- "GPT-Image-2 (medium) currently leads the Artificial Analysis Text to Image Arena with an Elo score of 1339" (Artificial Analysis, accessed Jun 2026)
- "A +242 point lead. A clean sweep of every category. The largest margin ever recorded on Image Arena" (Kingy AI, Apr 21 2026)
- "GPT-Image-2 took #1 in every single one of the seven categories — Text Rendering: +316 points over GPT-Image-1.5-High-Fidelity" (Kingy AI)
- "The top image editing models by Elo rating are: 1. GPT Image 1.5 (high) (Elo 1259), 2. GPT Image 2 (high) (Elo 1252), 3. Nano Banana Pro (Gemini 3 Pro Image) (Elo 1241)" (Artificial Analysis Image Editing Leaderboard)
- "nano-banana-pro will likely claim #1 by mid-year. Google's iteration speed on the nano-banana architecture has been relentless." (KEAR AI, Feb 7 2026)
- "GPT-Image-2 appears to be the first widely-deployed image model that applies chain-of-thought / reasoning paradigm to image generation." (Kingy AI, Apr 21 2026)

### Current Top-5 T2I Models (synthesized across sources, May–Jun 2026)
1. **GPT-Image-2 (medium)** — OpenAI — Elo ~1339-1512 (varies by arena methodology)
2. **GPT-Image-1.5 High-Fidelity** — OpenAI — Elo ~1241-1271
3. **nano-banana-2 (Gemini 3.1 Flash Image Preview)** — Google — Elo ~1260-1288
4. **nano-banana-pro (Gemini 3 Pro Image Preview 2K)** — Google — Elo ~1219-1244
5. **Cosmos3-Super-Text2Image** (agentic) — Elo ~1240 on Artificial Analysis; or **FLUX.2 Max** — BFL — Elo ~1165-1169

### Limitations
- Elo scores are relative, not absolute; different arenas (Arena AI, Artificial Analysis, Lumenfall) use different algorithms (Bradley-Terry Elo vs TrueSkill) and produce different absolute numbers.
- GPT-Image-2 scores marked "Preliminary" with wider CI (±8 vs ±3-5 for neighbors) due to lower vote count (15k vs 50k+).
- Vote counts vary massively (e.g., nano-banana has 750k+ votes vs GPT-Image-2's 15k), affecting statistical confidence.
- Category-specific rankings (7 sub-buckets) only added Jan 2026; historical comparison limited.
- Blind human preference measures overall appeal, not specific capabilities (e.g., text rendering, anatomy) independently.

### Secondary Leads
- https://arena.ai/leaderboard/text-to-image
- https://artificialanalysis.ai/image/leaderboard/text-to-image
- https://kearai.com/leaderboard/text-to-image
- https://kingy.ai/ai/gpt-image-2-benchmark-results-openai-sweeps-the-arena-leaderboard-by-242-elo/

---

## 2. Image Editing Arena

### Key Claims
- **GPT-Image-2 (medium)** leads both Single-Image Edit (Elo 1513) and Multi-Image Edit (Elo 1464) as of Apr 2026.
- Prior to that, **GPT-Image-1.5 (high)** led Artificial Analysis Image Editing Arena at Elo 1259; **chatgpt-image-latest-high-fidelity (20251216)** led Arena AI Image Edit at Elo 1413 (Feb 2026).
- **Nano Banana Pro** (Gemini 3 Pro Image) was a strong #2 in editing at 1400 (Arena AI Feb 2026) and 1241 (Artificial Analysis).
- **HunyuanImage 3.0 Instruct** (Tencent) is the top open-weights editing model, Elo 1225 on Artificial Analysis, debuted at #6 on Arena AI.
- **FLUX.2 [klein] 9B** leads among open-weights at Elo 1160-1166 for editing.
- Magic Hour Research (Apr 2026) ranked editing workflows by inpainting fidelity: **Magic Hour** (87/100), **Qwen** (83/100), **Nano Banana Pro** (83/100), **Seedream 4.5** (79/100).

### Evidence Extracts
- "GPT Image 1.5 (high) currently leads the Artificial Analysis Image Editing Arena with an Elo score of 1259" (Artificial Analysis)
- "GPT-Image-2 posts 1464 in Multi-Image Edit, +90 over nano-banana-2" (Kingy AI, Apr 2026)
- "hunyuan-image-3.0-instruct from Tencent landed directly at #6 — no warm-up, just straight into the top ten." (KEAR AI, Feb 2026)
- "ImagenWorld finds models consistently achieve lower performance on editing tasks than on generation tasks, with an average gap of ~0.1 score points." (ImagenWorld arxiv paper, 2026)

### Top-5 Image Editing Models (synthesized, May–Jun 2026)
1. **GPT-Image-2 (medium)** — Elo 1513 / 1464 (Arena AI, single/multi edit)
2. **GPT-Image-1.5 (high)** — Elo 1259-1390
3. **Nano Banana Pro (Gemini 3 Pro Image)** — Elo 1241-1400
4. **Nano Banana 2 (Gemini 3.1 Flash Image Preview)** — Elo 1240-1387
5. **MAI-Image-2** (Microsoft) — Elo ~1401, or **HunyuanImage 3.0 Instruct** (Tencent) — Elo 1225 (best open-weights)

### Limitations
- Editing tasks vary in difficulty: single-image edit, multi-image edit, inpainting, reference-guided. Different leaderboards measure different subsets.
- Inpainting-specific benchmarks (Magic Hour) use different rubrics than blind-preference Elo arenas.
- Editing evaluation is less standardized than T2I; fewer models tested across all sub-types.

### Secondary Leads
- https://arena.ai/leaderboard/image-edit
- https://artificialanalysis.ai/image/leaderboard/editing
- https://magichour.ai/model-leaderboard/image-editing
- https://arxiv.org/pdf/2603.27862 (ImagenWorld)

---

## 3. Per-Image Pricing (Commercial Models, May–Jun 2026)

### Key Claims
- Price spread across tiers is ~25-30x: from $0.003/image (FLUX Schnell / self-hosted SDXL) to $0.20/image (GPT Image 1.5 High / DALL-E 3 HD).
- **Three tiers**: Premium proprietary ($0.03–$0.20), Open-weight hosted ($0.02–$0.10), Aggregator-hosted ($0.003–$0.04).
- **GPT-Image-2** pricing not fully published; GPT-Image-1.5 pricing serves as baseline.

### Evidence Extracts — Pricing Table (USD per image, standard 1024×1024 unless noted)

| Model | Provider | Price/Image | Notes |
|-------|----------|------------|-------|
| **FLUX.1 [schnell]** | fal.ai / Replicate | $0.003 | Apache 2.0, 1-2s latency |
| **SDXL (self-hosted)** | — | ~$0.001–$0.003 | GPU electricity only |
| **FLUX.2 [klein] 4B** | BFL direct | $0.014 | Open-weights |
| **FLUX.1 [dev]** | fal.ai / Replicate | $0.025 | Open-weights |
| **GPT Image 1 Mini (Low)** | OpenAI API | $0.005 | Quality tier: Low |
| **FLUX.2 [pro]** | BFL direct / fal.ai | $0.030 | Commercial flagship |
| **Stable Image Core** | Stability AI | $0.030 | |
| **SD 3.5 Large** | Stability AI | $0.030–$0.065 | |
| **Imagen 4 Fast** | Google Vertex AI | $0.02 | |
| **Imagen 4** | Google Vertex AI | $0.04 | |
| **Imagen 4 Ultra** | Google Vertex AI | $0.06 | |
| **DALL-E 3 Standard** | OpenAI API | $0.04 | 1024×1024 |
| **DALL-E 3 HD** | OpenAI API | $0.08 | 1024×1024 |
| **GPT Image 1.5 (Medium)** | OpenAI API | $0.034–$0.04 | Sweet spot tier |
| **GPT Image 1.5 (High)** | OpenAI API | $0.133–$0.20 | Up to 2048×2048 |
| **FLUX 1.1 [pro]** | BFL / Replicate | $0.04–$0.055 | |
| **FLUX.1 Kontext [max]** | BFL | $0.08 | Editing-focused |
| **Midjourney v7 (Fast)** | Subscription | ~$0.05–$0.10 | Est., no API publicly available at scale |
| **Midjourney (Relaxed)** | Subscription | ~$0.01–$0.02 | Unlimited, queued |
| **DALL-E 3 (via ChatGPT Plus)** | Subscription | ~$0.003 | $20/mo, ~100-200 images/day |
| **Ideogram 3.0 Quality** | Ideogram | $0.09 | Typography specialist |

### Evidence Extracts
- "DALL-E 3 runs $0.04-$0.12/image; GPT Image 1.5 starts $0.03 but tops $0.19. Flux Pro 1.1 matches DALL-E quality at $0.04-$0.06 with better text rendering and 2-3x faster generation." (TokenMix, Apr 2026)
- "Cost spread is 25x — pick the tier first, the model within tier second. Cheapest hosted SD 3.5 ($0.008/image on FAL or Together) to premium DALL-E 4 HD ($0.18/image)." (Digital Applied, Apr 2026)
- "FLUX.1 [schnell] via fal.ai or Replicate at $0.003 per image, sub-second latency." (toolchew, May 2026)
- "GPT Image 1 Mini provides budget-friendly generation from $0.005/image." (ToolHalla, Mar 2026)
- "Midjourney API still has license restrictions that disqualify it for most agency work." (Digital Applied, Apr 2026)

### Limitations
- Pricing changes frequently (30-40% YoY deflation). All prices sourced May–Jun 2026.
- Subscription models (Midjourney, ChatGPT Plus) have complex cost-per-image calculations dependent on usage patterns.
- GPT-Image-2 pricing not yet confirmed as of mid-2026.
- Some providers use megapixel-based pricing (BFL charges per megapixel for FLUX.2).

### Secondary Leads
- https://toolchew.com/en/best-ai-image-api/
- https://www.digitalapplied.com/blog/ai-image-generation-api-pricing-comparison-2026
- https://tokenmix.ai/blog/dall-e-api-pricing
- https://toolhalla.ai/blog/sdxl-vs-flux-vs-midjourney-vs-dalle-2026

---

## 4. Free / Open-Source Options

### Key Claims
- **Stable Diffusion 3.5 Large** (Stability AI) — open-weights, Elo 939-945 on Arena AI. Available via Stability API ($0.065) or self-hosted. Licensed for commercial use.
- **FLUX.2 [klein] 4B** (Black Forest Labs) — Apache 2.0, Elo 1021-1026, runs on 16 GB VRAM.
- **FLUX.1 [dev]** — open-weights (non-commercial license), Elo 1100+ range self-hosted.
- **FLUX.1 [schnell]** — Apache 2.0, Elo ~1030+ range, 1-4 step generation. The cheapest API option at $0.003/image.
- **SDXL 1.0** — open-weights, runs on 8 GB VRAM. Lowest hardware barrier. Elo ~1000-1100.
- **Qwen-Image** (Alibaba) — Apache 2.0, Elo 1057-1062. Best open-weight for text rendering (bilingual EN/ZH).
- **Qwen-Image 2512** (Alibaba) — Apache 2.0, highest-ranked open model at Elo 1138.
- **HunyuanImage 3.0 Instruct** (Tencent) — Community license, best open-weights editing model (Elo 1225 on Artificial Analysis editing).
- **GLM-Image** (Z.ai) — MIT, Elo 1011-1013.
- **Cosmos3-Super-Text2Image (agentic)** — leads open weights on Artificial Analysis T2I at Elo 1240.
- **OmniGen V2**, **BAGEL** — open-weights, lower tier (Elo 900-912).

### Evidence Extracts
- "Cosmos3-Super-Text2Image (agentic) currently leads among open weights models in the Artificial Analysis Text to Image Arena with an Elo score of 1240" (Artificial Analysis)
- "HunyuanImage 3.0 Instruct (Fal) currently leads among open weights models in the Artificial Analysis Image Editing Arena with an Elo score of 1225" (Artificial Analysis)
- "Qwen-Image (Apache 2.0, Elo 1139) and FLUX.2 Klein 4B (Apache 2.0, Elo 1021) demonstrate open models closing the gap." (OpenMM Arena docs, Feb 2026)
- "self-hosted SDXL costs $0.002-0.006/image — 10-20x cheaper than API models." (GyanByte, 2026)
- "Stable Diffusion is free to run locally with no image limits, but requires capable hardware." (StackCompare, Mar 2026)

### Limitations
- Open-weight ≠ free to run at scale (GPU costs apply).
- License restrictions vary: FLUX.1 Dev is non-commercial; FLUX Schnell and Klein 4B are Apache 2.0; SD 3.5 requires Stability AI membership for commercial use beyond certain thresholds.
- Open models lag proprietary by ~150-300 Elo points on T2I, though the gap is narrowing.
- Fine-tuned community variants may outperform base models but are not tracked in major leaderboards.

### Secondary Leads
- https://huggingface.co/spaces/ArtificialAnalysis/Text-to-Image-Leaderboard
- https://github.com/OpenEnvision-Lab/OpenMM-Arena

---

## 5. Academic Benchmark: ImagenWorld

### Key Claims
- 3.6K condition sets, 6 tasks (TIG, SRIG, MRIG, TIE, SRIE, MRIE), 6 domains (artworks, photorealistic, info graphics, textual graphics, computer graphics, screenshots), 20K fine-grained human annotations.
- **GPT-Image-1** strongest overall; closed-source leads across tasks.
- Models struggle more with editing than generation, especially local edits.
- Models excel in artistic/photorealistic domains; struggle with symbolic/text-heavy domains (screenshots, info graphics).
- **Qwen-Image** uniquely competitive on textual graphics due to synthetic data curation pipeline.
- VLM-as-judge achieves Kendall accuracy up to 0.79, approximating human ranking but cannot do fine-grained error attribution.

### Evidence Extracts
- "GPT-Image-1 achieves the strongest overall performance, outperforming Gemini 2.0 Flash by about 0.1–0.2 points on average." (ImagenWorld, arxiv 2603.27862)
- "All models struggle with text-related tasks such as information graphics, screenshots, and textual graphics. However, Qwen-Image consistently outperforms other models on textual graphics."
- "For editing tasks, models tend to exhibit one of two failure modes: regenerating an entirely new image, or returning the input unchanged."

### Limitations
- Evaluated GPT-Image-1, not GPT-Image-2 (which launched Apr 2026, after this study).
- Single human-score rubric may not reflect all quality dimensions.
- 14 models tested; many newer models (GPT-Image-2, nano-banana-2, FLUX.2 series) not included.

### Secondary Leads
- https://arxiv.org/pdf/2603.27862

---

## Summary: Top-5 Models Across Metrics (Mid-2026)

| Rank | Text-to-Image | Image Editing | Value (Quality/$) | Open-Weight Leader |
|------|--------------|--------------|-------------------|-------------------|
| 1 | GPT-Image-2 (1512) | GPT-Image-2 (1513) | FLUX Schnell ($0.003) | Cosmos3-Super (1240) |
| 2 | GPT-Image-1.5 (1264) | GPT-Image-1.5 (1390) | GPT Image 1 Mini ($0.005) | Qwen-Image 2512 (1138) |
| 3 | nano-banana-2 (1270) | Nano Banana Pro (1400) | FLUX.2 Pro ($0.03) | HunyuanImage 3.0 Instruct (1225 edit) |
| 4 | nano-banana-pro (1244) | MAI-Image-2 (1401) | Imagen 4 Fast ($0.02) | FLUX.2 Klein 4B (1026) |
| 5 | FLUX.2 Max (1169) | HunyuanImage 3.0 Instruct (1225) | SDXL self-hosted (~$0.001) | Qwen-Image (1062) |

**Key Theme (2026):** The image generation market has converged on reasoning-native architectures. GPT-Image-2's application of chain-of-thought to image generation represents a step-function jump (+242 Elo). Text rendering accuracy crossed 99%. Open-weight models continue closing the gap but remain 150-300 Elo points behind the proprietary frontier. Prices continue to deflate (~30-40% YoY), with viable free/self-hosted options at near-zero marginal cost.
