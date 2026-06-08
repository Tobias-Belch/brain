---
title: Agent Image Creation Tools — Skills, MCPs, and Capabilities
---

# Agent Image Creation Tools: Skills, MCPs, and Capabilities

## Executive Summary

Yes, there are now extensive tools, skills, and MCPs that allow AI agents to create raster and vector images. The ecosystem has matured rapidly in 2025-2026, with **50+ MCP servers** for image generation, dedicated **agent skills** for SVG creation, and direct API integrations. Agents can absolutely create images in the kawaii/cartoon style shown in your reference image — both via raster generation (DALL-E, Flux, Stable Diffusion, Gemini) and programmatic SVG (via code-generation skills). The key limitation is that agents generate images through API calls or code, not through visual understanding of composition.

## Research Question and Scope

**Question:** Are there any skills, MCPs, or other tools that allow agents to properly use image creation tools, specifically for creating raster or vector images, in the style of cute cartoon/kawaii illustrations? Will agents be capable of creating such images?

**Scope:** Skills, MCPs, plugins, APIs, and SDKs for image generation by AI agents; raster formats; vector formats (SVG); styled illustration capabilities (cartoon, kawaii, flat design); agent-native image generation workflows.

## Methodology

Deep research (12-30 sources) across web, repositories, and documentation. Sources include MCP server catalogs, GitHub repositories, agent documentation sites, image generation API comparisons, and SVG generation analyses.

## Key Findings

### 1. MCP Servers for Image Generation (Raster)

The image generation MCP ecosystem has **50+ servers** across all major platforms as of April 2026:

**Top-tier servers for agent image generation:**

| Server | Stars | Platform | Key Capability |
|---|---|---|---|
| `joenorton/comfyui-mcp-server` | 294 | ComfyUI/Local | 15+ tools, workflow-based, v1.0 rewrite |
| `shinpr/mcp-image` | 105 | Google Gemini/Nano Banana | Auto-prompt optimization, character consistency |
| `tadasant/mcp-server-stability-ai` | 84 | Stability AI | 11 chainable tools, SD 3.5, edit/upscale/relight |
| `am0y/mcp-fal` | 77 | fal.ai | 600+ models, model discovery |
| `apinetwork/piapi-mcp-server` | 70 | Multi-platform | Midjourney, Flux, Kling, Luma, 3D |
| `lansespirit/image-gen-mcp` | 56 | Multi-provider | gpt-image-2, Imagen 4, 6 OpenAI models |
| `spartanz51/imagegen-mcp` | 33 | OpenAI | DALL-E 2/3, gpt-image-1 |

**For kawaii/cartoon style specifically:**
- **DALL-E 3 / gpt-image-2** excels at illustration styles including cartoon and kawaii via prompt instructions
- **Flux models** (especially via Replicate or Together AI) handle stylized illustrations well
- **Gemini Nano Banana** models support character consistency and style transfer
- **Stable Diffusion** with fine-tuned LoRA models can produce very specific kawaii styles

**How to use:** Add MCP server config to `opencode.json`:
```json
{
  "mcp": {
    "image-gen": {
      "type": "remote",
      "url": "https://mcp.replicate.com/",
      "enabled": true
    }
  }
}
```

### 2. Agent Skills for SVG/Vector Generation

**SVG Creator Skill** (`upbrew-tech/svg-creator-skill`) is the most complete agent skill for vector image creation:

- **Render-verify-fix loop:** Agent writes SVG code, renders to PNG, visually inspects, identifies issues, fixes, and re-renders (2-8 iterations)
- **Rich techniques:** Multi-stop gradients, five-zone lighting, colored shadows, noise textures, character construction templates
- **Character construction:** Thick rounded lines, circle joint covers, incremental build (torso → legs → arms → head), 8-head proportion system
- **Works with:** Claude Code, OpenCode, Cursor, Windsurf, Codex CLI, any Agent Skills-compatible tool
- **Installation:** Copy skill folder to `.claude/skills/` or `.opencode/skills/`

**Claude SVG via Artifacts** (native capability):
- Claude can generate SVG code and preview it live via Artifacts panel
- Excellent for simple-to-medium icons, UI elements, animations
- Limited for complex illustrations (characters, faces, detailed scenes)
- **Key limitation:** Language model generates code, not visual model generating images

**Key limitation for vector:** No dedicated MCP server exists specifically for SVG generation. SVG capability comes from code-generation skills (the agent writes SVG as text), not from image models. For production-quality vector, a visual pipeline (generate raster → vectorize) is more reliable.

### 3. Agent Capability for Styled Image Creation

**Can agents create kawaii/cartoon illustrations like the reference image?**

**Raster (PNG/JPG/WebP):** **Yes, very capable.**
- Agents can call image generation APIs (DALL-E, Flux, Stable Diffusion, Gemini) via MCP servers
- Kawaii/cartoon/flat illustration is a well-supported style in all major models
- Prompt engineering works: "kawaii potted cactus with cute face, simple flat illustration, pastel colors, thick outlines, minimal detail"
- Agent can iterate: generate → review → adjust prompt → regenerate
- **Best approach:** Use an MCP server like `shinpr/mcp-image` or `tadasant/mcp-server-stability-ai` and iterate with style-specific prompts

**Vector (SVG):** **Partially capable, with caveats.**
- Agent can write SVG code directly (via skills like `svg-creator-skill`)
- Simple kawaii shapes (rounded pots, smiley faces, basic plants) are achievable as SVG
- Complex characters and compositions require significant iteration (5-8 rounds)
- No SVG generation model exists — agent must understand SVG syntax
- **Better approach for production:** Generate raster via API → vectorize with a dedicated tool (SVG Genie, Adobe Illustrator, Potrace)

**Style consistency across a set:**
- **Weak point.** Most MCP servers and skills don't guarantee style consistency across multiple generations
- `shinpr/mcp-image` offers character consistency features (Gemini-based)
- For a cohesive set (like the 6 plants in your image), manual prompt refinement or reference image workflows are needed
- ComfyUI workflows can enforce style consistency via fixed pipelines

### 4. Recommended Tools by Use Case

| Use Case | Recommended Tool | Why |
|---|---|---|
| Quick kawaii raster illustrations | MCP + DALL-E 3 / gpt-image-2 | Best prompt understanding for illustration styles |
| Cost-effective batch generation | MCP + Flux via Together AI or Replicate | Low per-image cost, good style support |
| Local generation (no API cost) | ComfyUI MCP + SD/Flux models | Full control, no API fees, needs GPU |
| SVG icons and simple illustrations | `svg-creator-skill` + Claude Code | Render-verify-fix loop, code-based |
| Production vector from raster | Raster API → vectorize (SVG Genie/Potrace) | Most reliable path to production SVG |
| Style-consistent series | ComfyUI workflows or Gemini character consistency | Pipeline-based consistency |
| Free/zero-setup | Puter.js browser API | No API keys needed, frontend only |

### 5. Emerging Trends (2026)

- **gpt-image-2** (April 2026): 4K resolution, ~99% text accuracy, new quality benchmark
- **Gemini Nano Banana Pro**: Character consistency across generations, style transfer
- **Agent-native workflows:** Skills + MCP servers creating end-to-end creative pipelines
- **ComfyUI v1.0:** Streamable HTTP, job management, iterative refinement
- **Adobe Firefly MCP:** First official MCP server, early adoption

## Conflicts and Open Questions

- **Vector vs raster tradeoff:** No agent tool produces production-quality SVG directly. The raster-then-vectorize pipeline remains more reliable than code-generated SVG for complex illustrations.
- **Style consistency:** No general solution exists for maintaining exact style across many generations. ComfyUI workflows and Gemini character features are the closest.
- **Midjourney access:** No official API or MCP server; all integrations use unofficial proxies.

## Blindspot / Gap Analysis

- Limited exploration of fine-tuned LoRA models for specific kawaii styles
- No cost comparison automation across MCP providers
- Image-to-3D pipelines not covered (out of scope but adjacent)
- Non-English prompt support for kawaii styles not tested
- Negative results (failed attempts at specific styles) not documented

## Recommendations and Next Steps

1. **For kawaii raster illustrations:** Start with an MCP server (`shinpr/mcp-image` or `tadasant/mcp-server-stability-ai`) and use prompts like: *"kawaii [subject] with cute face, simple flat illustration, pastel colors, thick outlines, minimal detail, white background"*

2. **For SVG:** Install the `svg-creator-skill` for code-based SVG generation, or use the raster-then-vectorize pipeline for production quality.

3. **For a cohesive set:** Use ComfyUI with fixed workflows/prompts, or generate individual elements and compose manually.

4. **For zero-cost experimentation:** Use Puter.js or run Flux locally via ComfyUI.

## Confidence and Limits

- **High confidence:** MCP servers exist and work for raster image generation by agents. Agents can create kawaii-style images via these tools.
- **High confidence:** SVG Creator Skill provides a viable agent-native SVG workflow for simpler illustrations.
- **Medium confidence:** Style consistency across batches remains a challenge without pipeline-based approaches.
- **Low confidence:** Exact reproduction of the reference image style would require prompt iteration or fine-tuning.

## Source Inventory

See `source-inventory.md` for full source list (20 sources).

## Deferred Decisions

None (default checkpoint mode, no AFK).
