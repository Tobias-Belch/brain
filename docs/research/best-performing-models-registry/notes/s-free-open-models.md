---
title: 's-free-open-models'
---

# Source Note: s-free-open-models

## Metadata
- Source: Aggregate of multiple sources (Onyx AI leaderboard, Presenc AI, ChatGPTAIHub, Check.AI, Lushbinary, Awesome Agents, ComputingForGeeks, AIProductivity, Codersera, Digital Applied, OpenRouter, GitHub repos, Google DeepMind blog)
- Date: 2026-06-08
- Type: web (multi-source synthesis)
- Quality: high

## Key Claims

1. **The open-weight frontier has converged with proprietary models.** GLM-5.1 is the first open model to top SWE-Bench Pro (58.4%), surpassing GPT-5.4 (57.7%) and Claude Opus 4.6 (57.3%). DeepSeek V4 Pro scores 83.7% on SWE-Bench Verified. The Artificial Analysis Intelligence Index shows Kimi K2.6 at #4 overall (score 54) behind only Anthropic, Google, and OpenAI (all 57) — the smallest gap ever recorded.

2. **MoE (Mixture-of-Experts) is the dominant architecture.** Every frontier open-weight model except Gemma 4 31B Dense uses MoE with 3B–49B active params, enabling 100B–1.6T total parameter models to run on single GPUs (at quantization).

3. **Licensing has liberalised dramatically.** Apache 2.0 and MIT now cover ~56% of new model releases. Eleven leading model families ship under Apache 2.0 (Qwen 3.5/3.6, Gemma 4, Mistral Small 4, Mistral Large 3, GPT-OSS, Ministral, Step-3.5-Flash) or MIT (DeepSeek V3/V4, GLM-5/5.1, Phi-4). Only Llama 4 retains a custom Community License with a 700M MAU threshold and EU multimodal exclusion.

4. **Specialisation has overtaken raw parameter count.** Qwen 3.5 leads GPQA Diamond at 88.4% (scientific reasoning). GLM-5.1 leads SWE-Bench Pro at 58.4% (agentic coding). Llama 4 Scout offers 10M token context. Gemma 4 31B delivers unmatched intelligence-per-parameter on consumer hardware. DeepSeek R1 scores 97.3% on MATH-500.

5. **Free-tier API access is widely available.** OpenRouter offers 28+ free models (DeepSeek R1, Qwen3 Coder 480B, Llama 4 Scout, Gemma 4 31B, GPT-OSS-120B) at 20 RPM / 50-1000 requests/day with no credit card. Groq offers free tier at 30 RPM / 14K RPD on LPU hardware (600-840 tok/s). Together AI, DeepInfra, Fireworks offer signup credits. Cerebras and Cloudflare Workers AI have free tiers.

6. **Image generation: FLUX.2 is the quality leader; SDXL retains ecosystem dominance.** FLUX.2 [dev] (32B DiT) produces highest quality but requires commercial license. FLUX.2 [klein] 4B ships under Apache 2.0 with sub-second inference on consumer GPUs (~8GB VRAM). SDXL remains the ecosystem workhorse (5,000+ LoRAs, mature ControlNet). SD 3.5 is in an awkward middle ground with minimal community traction. HunyuanImage-3.0 (80B/13B active MoE) is the largest open image model but carries geographic restrictions (excludes EU/UK/South Korea).

## Evidence Extracts

### DeepSeek Family

- "DeepSeek V4 Pro: 1.6T total / 49B active MoE, 83.7% SWE-Bench Verified, 1M context, HumanEval ~90%. License: MIT. Released 2026-04-27." (Presenc AI, 2026-05-15)
- "DeepSeek V3.2: 685B MoE (37B active), MMLU 94.2%, SWE-bench 67.8%, GPQA Diamond 79.9%, AIME 2025 89.3%. IMO/IOI/ICPC gold medals. MIT license." (AIProductivity, 2026-04-03)
- "DeepSeek R1: 671B MoE (37B active), MATH-500 97.3%, MMLU-Pro 84.0%. MIT license." (ComputingForGeeks, 2026-03-28)

### Qwen Family

- "Qwen 3.5-397B-A17B: 397B total / 17B active MoE, GPQA Diamond 88.4% (best-in-class open), MMLU-Pro ~84%, 256K context, 201 languages. Apache 2.0. Released Feb 2026." (Presenc AI, 2026-05-15)
- "Qwen 3.6-35B-A3B: 35B total / 3B active MoE, SWE-bench Verified 73.4%, AIME 2026 92.7%, 262K context (extensible to 1M). Apache 2.0. Fits dual RTX 5060 Ti at 21.7 tok/s." (Lushbinary, 2026-04-18)
- "Qwen 3 235B-A22B: 235B total / 22B active MoE, MMLU-Pro 83.6%, GPQA Diamond 77.2%, AIME '24 85.7%. Apache 2.0." (ComputingForGeeks, 2026-03-28)

### Llama 4 Family

- "Llama 4 Scout: 109B total / 17B active MoE (16 experts), 10M token context (largest open), MMLU 79.6%. Llama 4 Community License." (ComputingForGeeks, 2026-03-28)
- "Llama 4 Maverick: 400B total / 17B active MoE (128 experts), MMLU 85.5% (highest open), 1M context. License includes 700M MAU threshold; EU multimodal exclusion applies." (ComputingForGeeks / Open-Weight License Landscape 2026)
- "Llama 3.3 70B: Dense, 128K context, MMLU 86.0, HumanEval 88.4. EU-OK (text-only, unaffected by Llama 4 EU restriction)." (xigh/open-weight-models, 2026-04-04)

### Gemma 4 (Google)

- "Gemma 4 31B Dense: AIME 2026 89.2%, LiveCodeBench v6 80.0%, GPQA Diamond 84.3%, MMLU-Pro 85.2%. Ranks #3 open model on Arena AI. Apache 2.0. Quantized versions run on consumer GPUs (20-24GB VRAM at Q4)." (Google DeepMind blog, 2026-04-02; Lushbinary)
- "Gemma 4 26B-A4B MoE: 26B total / ~4B active, near-30B quality at 8B speed. Apache 2.0." (Google DeepMind blog)
- "Gemma 4 family spans 2B–31B across dense and MoE, all natively multimodal (text+image+audio on edge models)." (Google DeepMind blog)

### Mistral Family

- "Mistral Large 3: 675B total / 41B active MoE, 256K context, Apache 2.0. Released Dec 2025. Leading European (French) dense reasoning." (Presenc AI / ComputingForGeeks)
- "Mistral Small 4: 119B total / 6B active MoE (128 experts), unifies instruct/reasoning/vision/agentic coding. Apache 2.0. Fits single A100 quantized." (Lushbinary, 2026-04-18)

### GLM Family (Zhipu AI)

- "GLM-5: 744B total / 40B active MoE, SWE-bench Verified 77.8% (open leader), MIT license. First frontier model trained entirely on Huawei Ascend chips (no NVIDIA). Released 2026-02-13." (AIProductivity, 2026-04-03)
- "GLM-5.1: 58.4% SWE-Bench Pro (beats GPT-5.4 at 57.7% and Claude Opus 4.6 at 57.3%). MIT license." (Lushbinary, 2026-04-18)

### Kimi / Other Families

- "Kimi K2.6 (Moonshot AI): Score 54 on Artificial Analysis Intelligence Index — #4 overall behind only Anthropic/Google/OpenAI (57). Best open model by neutral composite benchmark. Leads agentic coding (HLE-with-tools)." (Codersera, 2026-05-03)
- "GPT-OSS-120B (OpenAI): 117B total / 5.1B active MoE, MXFP4 quantization, GPQA Diamond 80.9, AIME 96.6%, Codeforces 2622. Apache 2.0. Runs on single H100." (xigh/open-weight-models; OpenRouter free tier)
- "Phi-4 (Microsoft): 14B dense, MIT license, MATH-500 92.5%. Phi-4-mini: 3.8B, 128K context, best-in-class at 4B scale. All MIT." (xigh/open-weight-models)

### Image Models

- "FLUX.2 [dev]: 32B DiT, highest quality open image model, multi-reference editing (up to 10 ref images). Non-commercial license. Requires 24GB+ VRAM at FP8." (BentoML, 2025-08-28; GitHub black-forest-labs/flux2)
- "FLUX.2 [klein] 4B: Sub-second inference on consumer GPUs (~8GB VRAM), Apache 2.0. Supports text-to-image, single/multi-reference editing. Released 2026-01-15." (GitHub black-forest-labs/flux2, 2026-01-15)
- "Stable Diffusion 3.5: MMDiT architecture, 2.5B params, 18GB VRAM. OpenRAIL++-M license. Better than SDXL but minimal community ecosystem." (WillItRunAI, 2026-03-26)
- "SDXL: 2.6B UNet, 8GB VRAM. Largest LoRA ecosystem (5,000+). OpenRAIL-M. Still the default for community-dependent workflows." (WillItRunAI)
- "HunyuanImage-3.0: 80B total / 13B active MoE (64 experts). Largest open image model. Tencent Hunyuan Community License — excludes EU/UK/South Korea, 100M MAU cap, cannot improve other AI models with outputs. Requires 3×80GB (T2I) or 8×80GB (Instruct)." (GitHub Tencent-Hunyuan, 2025-09-27)
- "Z-Image-Turbo: 6B params, distilled, matches FLUX.2 quality at sub-second latency. Apache 2.0. Fits 16GB VRAM." (BentoML; Pixazo)
- "Qwen-Image (Alibaba): Apache 2.0. Strong for photorealistic textures and text rendering." (Pinggy, 2025-08-28)

### Free API Access

- "OpenRouter free tier (May 2026): 28+ free models incl. Qwen3 Coder 480B (262K ctx), DeepSeek R1, Llama 4 Scout (10M ctx), Gemma 4 31B, GPT-OSS-120B. Limits: 20 RPM, 50-1000 req/day. `:free` variant syntax. No credit card required." (Klymentiev, 2026-05-10; OpenRouter docs)
- "Groq free tier: 30 RPM, 6K TPM, 14,400 RPD. Llama 3.3 70B at 394 TPS on custom LPU hardware. Fastest free inference by latency." (Klymentiev)
- "Together AI / DeepInfra / Fireworks: New-account free credits ($5-$25 range), OpenAI-compatible endpoints. DeepInfra hosts broadest catalog of niche open models." (Infrabase, 2026-03-04)
- "Cloudflare Workers AI: Free tier (10,000 neurons/day), sub-100ms edge inference for global users." (CostBench, 2026-06-07)

### License Landscape

- "Apache 2.0: ~38% of new HuggingFace releases. MIT: ~18%. Llama Community: ~14%. Tongyi Qianwen: ~6%. Gemma Terms: ~5%. OpenRAIL-M: ~3%. CC-BY-NC: ~9%." (Presenc AI, 2026-05-23)
- "Llama 4 Community License: Free under 700M MAU. EU multimodal exclusion for Scout/Maverick — effective EU ban. Text-only Llama 3.3 70B unaffected." (Presenc AI / xigh/open-weight-models)
- "HunyuanImage-3.0: Tencent Hunyuan Community License. Excludes EU, UK, South Korea. 100M MAU cap. Output cannot improve other AI models." (Tencent LICENSE file)
- "FLUX.2 [dev]: FLUX Non-Commercial License. FLUX.2 [klein] 4B: Apache 2.0. 9B variants: non-commercial." (GitHub black-forest-labs/flux2)

## Limitations

- **Benchmark inconsistency**: SWE-Bench Verified and SWE-Bench Pro are different difficulty levels; AIME 2025 vs AIME 2026 are different test sets. Cross-source score comparisons require careful benchmark matching.
- **Vendor-reported vs independent benchmarks**: Many scores (especially for newer 2026 releases like DeepSeek V4, Qwen 3.6) come from vendor tech reports, not third-party verification. The Artificial Analysis Intelligence Index and Chat Arena ELO are independent but cover a narrower set of models.
- **Rapid obsolescence**: The open-weight field is evolving monthly. Models cited here (GLM-5, DeepSeek V4, Qwen 3.5) may have been superseded by Qwen 3.7, DeepSeek V4.1, etc. by the time of reading.
- **"Free tier" fragility**: OpenRouter's free model roster rotates as upstream providers change policies. The 28+ models available in May 2026 may differ by June. Groq free tier has meaningful rate caps.
- **Image model comparison primarily qualitative**: Unlike LLMs, image model benchmarks lack standardised cross-model leaderboards. Quality assessments (photorealism, prompt adherence) are based on community consensus and provider claims.
- **Hardware requirements are best-effort**: VRAM figures vary with quantization level, batch size, sequence length, and framework (vLLM, llama.cpp, diffusers). Figures given assume Q4_K_M or FP8 unless noted.

## Secondary Leads

- Onyx AI Open LLM Leaderboard: https://onyx.app/open-llm-leaderboard
- Artificial Analysis Intelligence Index: https://artificialanalysis.ai/
- OpenRouter free models: https://openrouter.ai/collections/free-models
- Groq free tier: https://groq.com/pricing/
- Presenc AI Open-Weight License Landscape: https://presenc.ai/research/open-weight-license-landscape-2026
- Presenc AI Open-Source LLM Landscape: https://presenc.ai/research/open-source-llm-landscape-2026
- awesome-open-weight-models GitHub: https://github.com/phlx0/awesome-open-weight-models
- xigh/open-weight-models GitHub: https://github.com/xigh/open-weight-models
- FLUX.2 official repo: https://github.com/black-forest-labs/flux2
- HunyuanImage-3.0 official repo: https://github.com/Tencent-Hunyuan/HunyuanImage-3.0
- Google Gemma 4 announcement: https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/
