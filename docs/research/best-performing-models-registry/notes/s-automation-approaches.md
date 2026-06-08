---
title: 's-automation-approaches'
---

# Source Note: s-automation-approaches

## Metadata
- Source: Multiple (see individual sections)
- Date: 2026-06-08
- Type: web
- Quality: high

## Approach 1: arena-ai-leaderboards (GitHub + REST API)

- **Source**: https://github.com/oolong-tea-2026/arena-ai-leaderboards / https://api.wulong.dev/arena-ai-leaderboards/v1
- **What it provides**: Auto-updated daily snapshots of every Arena AI (formerly LMSYS Chatbot Arena) leaderboard in structured JSON. Covers 10+ arena categories (text, code, vision, document, text-to-image, image-edit, image-to-code, search, text-to-video, image-to-video, video-to-video).
- **Access methods**: (1) Free REST API at api.wulong.dev — no auth needed, (2) Raw GitHub JSON at `https://raw.githubusercontent.com/oolong-tea-2026/arena-ai-leaderboards/main/data/{YYYY-MM-DD}/{category}.json`, (3) `latest.json` pointer.
- **Data format**: JSON with `meta` (leaderboard name, source_url, fetched_at, model_count) and `models[]` array (rank, model, vendor, license, score/ELO, ci, votes).
- **Update cadence**: Daily via GitHub Actions (auto-discovers new categories from the Arena overview page).
- **Reproducibility**: High — stable schema, date-stamped historical snapshots.
- **Rate limits / auth**: None for REST API or raw GitHub access.

### Key Claims
- Arena AI (arena.ai) has no public API and no official historical data. This is the only structured, versioned archive.
- The pipeline auto-discovers new leaderboard categories (no hardcoded list).
- Data is validated against a strict JSON Schema before commit.

### Evidence Extracts
> "Arena AI doesn't provide a public API. This repo gives you stable, machine-readable data with historical tracking — updated automatically via GitHub Actions."
> "Free, no auth needed. Hosted on api.wulong.dev"
> "curl https://api.wulong.dev/arena-ai-leaderboards/v1/leaderboard?name=text&date=2026-03-21"

### Limitations
- Unofficial/third-party project — no SLA, could disappear or break if Arena AI changes its page structure.
- The REST API is hosted on a personal domain (api.wulong.dev).
- ELO scores are human-preference-based (Bradley-Terry), not capability benchmarks.
- No filtering by sub-category or date range in the API (must paginate dates manually).

### Secondary Leads
- Apify actor "lmarena-llm-leaderboard-scraper" — commercial option with structured output but requires Apify.
- Arena AI official site: https://arena.ai/leaderboard (no API, but page is server-side rendered — easier to scrape than SPA).

---

## Approach 2: Artificial Analysis API

- **Source**: https://artificialanalysis.ai/api-reference
- **What it provides**: Independent benchmark scores, pricing, and speed metrics for LLMs, text-to-image, text-to-video, etc. Includes the Artificial Analysis Intelligence Index v4.0 (composite of 10 evaluations) plus individual benchmark scores (MMLU-Pro, GPQA, LiveCodeBench, AIME 2025, HLE, Terminal-Bench Hard, etc.).
- **Access methods**: REST API at `https://artificialanalysis.ai/api/v2/data/llms/models` with `x-api-key` header.
- **Data format**: JSON array with objects containing `id`, `name`, `slug`, `model_creator`, `evaluations` (object with per-benchmark scores), `pricing`, `median_output_tokens_per_second`, `median_time_to_first_token_seconds`.
- **Update cadence**: Frequently (benchmarks are independently run; performance metrics tested 8x/day).
- **Reproducibility**: High — documented methodology at https://artificialanalysis.ai/methodology.
- **Rate limits / auth**: Free API key required (create account on Insights Platform). 1,000 requests/day on free tier. Commercial tier available.

### Key Claims
- Independent benchmarking — not self-reported by model providers.
- Intelligence Index v4.0 uses 10 evaluations across 4 categories: Agents (25%), Coding (25%), General (25%), Scientific Reasoning (25%).
- Models run in standardized agentic harness (Stirrup) with controlled temperature/parameters.

### Evidence Extracts
> "Artificial Analysis provides a free API to support analysis of AI models... focused on model benchmarks."
> "Free API is rate limited to 1000 requests per day."
> "Our independent intelligence evaluations, speed benchmarks and pricing."
> "Intelligence Index v4.0 incorporates 10 evaluations: GDPval-AA, τ²-Bench Telecom, Terminal-Bench Hard, SciCode, AA-LCR, AA-Omniscience, IFBench, Humanity's Last Exam, GPQA Diamond, CritPt."

### Limitations
- Free tier has moderate rate limits (1,000/day).
- Requires account creation and API key.
- Custom composite index (Intelligence Index) — methodology may change.
- No historical snapshots through the API (current data only).

### Secondary Leads
- https://github.com/MaurerAnton/artificialanalysis-ai-parser — unofficial parser that extracts data from AA's RSC endpoint without API key (fragile, but works as fallback).
- https://github.com/alexfazio/artificial-analysis-compare — skill/wrapper around the official API.
- https://artificialanalysis.ai/leaderboards/intelligence — web leaderboard for cross-reference.

---

## Approach 3: Hugging Face Leaderboard Data API

- **Source**: https://huggingface.co/docs/hub/main/en/leaderboard-data-guide
- **What it provides**: Programmatic access to benchmark leaderboards on Hugging Face datasets. Two modes: (1) Per-benchmark leaderboard API via `GET https://huggingface.co/api/datasets/{dataset_id}/leaderboard`, (2) Aggregated multi-benchmark dataset `OpenEvals/leaderboard-data` (single Parquet file).
- **Access methods**: `huggingface_hub` Python library (`api.get_dataset_leaderboard()`), REST API with Bearer token auth, direct Parquet load (`pd.read_parquet("hf://datasets/OpenEvals/leaderboard-data/...")`).
- **Data format**: Typed `DatasetLeaderboardEntry` objects or Parquet with columns: model_name, provider, per-benchmark scores (aime2026_score, mmluPro_score, etc.).
- **Update cadence**: Varies per dataset — OpenEvals/leaderboard-data is updated regularly by the HuggingFace evaluations team.
- **Reproducibility**: High — authoritative source, versioned datasets.
- **Rate limits / auth**: HF token required for gated datasets. Public datasets may be accessible without token but rate limits apply for unauthenticated requests.

### Key Claims
- Covers "official" benchmark datasets on the Hub.
- The `OpenEvals/leaderboard-data` dataset is the fastest way to get a cross-benchmark view without calling multiple API endpoints.
- HuggingFace is the canonical home for the Open LLM Leaderboard and many community benchmarks.

### Evidence Extracts
> "Use huggingface_hub to find all official benchmark datasets... GET https://huggingface.co/api/datasets?filter=benchmark:official"
> "The OpenEvals/leaderboard-data dataset aggregates scores across official benchmarks into one Parquet file"
> "curl https://huggingface.co/api/datasets/cais/hle/leaderboard --header 'Authorization: Bearer $(cat ~/.cache/huggingface/token)' | jq ."

### Limitations
- Not all benchmarks have leaderboard data enabled in the API.
- Gated datasets require authentication and access requests.
- The OpenEvals/leaderboard-data schema may change without notice.
- Some legacy leaderboards (original Open LLM Leaderboard) have deprecated or moved datasets.

### Secondary Leads
- `open-llm-leaderboard/contents` dataset at https://huggingface.co/datasets/open-llm-leaderboard/contents — raw results from the v1 Open LLM Leaderboard (Parquet format, ~1.1 MB).
- https://huggingface.co/OpenEvals — the HuggingFace evaluations organization (5+ datasets).
- https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard — the web UI for discovery.

---

## Approach 4: OpenCompass / CompassAcademic

- **Source**: https://doc.opencompass.org.cn/notes/academic.html / https://github.com/open-compass/opencompass
- **What it provides**: A full evaluation framework rather than an API. CompassAcademic is a leaderboard for LLMs updated ~every 2 weeks. The framework provides reproducible evaluation configurations.
- **Access methods**: (1) Reproduce evaluations locally using OpenCompass framework with their config files, (2) Web leaderboard at https://rank.opencompass.org.cn/leaderboard-llm-academic/, (3) Source code at GitHub.
- **Data format**: Python configuration files + local output (JSON/CSV). No hosted API for leaderboard data.
- **Update cadence**: ~biweekly for the leaderboard; framework release ongoing.
- **Reproducibility**: Very high — they publish exact configuration files and verifier model specs.
- **Rate limits / auth**: None (self-hosted evaluation).

### Key Claims
- OpenCompass provides the real-time configuration files used in the academic leaderboard so results are fully reproducible.
- Evaluation uses a dedicated verifier model (CompassVerifier-32B) for LLM-as-judge tasks.
- Models are regularly removed from the leaderboard after 6-12 months to keep rankings current.

### Evidence Extracts
> "We maintain the CompassAcademic Leaderboard for LLMs on our official website, updating it typically every two weeks."
> "eval_academic_leaderboard_REALTIME.py contains the configuration currently used for academic ranking evaluation."
> "Newly released models are promptly included, while models published six months to one year (or more) ago are removed."

### Limitations
- No programmatic API for reading leaderboard results — you must run evaluations yourself or scrape the web page.
- Chinese-centric (OpenCompass platform, docs in Chinese/English).
- Requires significant GPU/compute resources to run evaluations.
- Model configs need manual setup per model.

### Secondary Leads
- https://github.com/open-compass/opencompass/tree/main/examples — reference config files.
- EvalScope (https://github.com/modelscope/evalscope) — integrates OpenCompass as a backend for easier usage.
- https://rank.opencompass.org.cn/leaderboard-llm-academic/ — web leaderboard.

---

## Approach 5: Papers with Code API

- **Source**: https://paperswithcode-client.readthedocs.io/ / https://github.com/paperswithcode/paperswithcode-client
- **What it provides**: Read/write API for state-of-the-art (SOTA) tracking. Search papers, datasets, tasks, and evaluation tables. Supports mirroring competition leaderboards programmatically.
- **Access methods**: Python client (`pip install paperswithcode`), REST API, data dumps (JSON).
- **Data format**: Python objects with paginated responses. Evaluation tables include task, dataset, metrics, results, and methodology.
- **Update cadence**: Data dumps regenerated daily. Live API reflects current state.
- **Reproducibility**: Medium — SOTA data is community-contributed, not independently verified.
- **Rate limits / auth**: Write mode requires API token. Read mode may work without token for public data.

### Key Claims
- Comprehensive coverage of ML research benchmarks across all domains (not just LLMs).
- Competition mirroring API allows automated leaderboard synchronization.
- Full data dump available for download.

### Evidence Extracts
> "Papers with Code offers a mirroring service for ongoing competitions that allows competition administrators to automatically upload the results to Papers with Code using an API."
> "To keep your Papers with Code leaderboard in sync, you can simply re-post all the entries in your competition on regular intervals."
> "Data is regenerated daily."

### Limitations
- Focus is on academic/paper benchmarks, not real-time model provider rankings.
- SOTA data quality depends on community submissions — can be stale or inaccurate.
- LLM-specific coverage is less comprehensive than dedicated LLM leaderboards.
- Read API has pagination limits (50 items/page).

### Secondary Leads
- https://github.com/paperswithcode/paperswithcode-data — direct data dump downloads.
- https://github.com/hbg/mcp-paperswithcode — MCP interface for LLM agent integration.

---

## Approach 6: BenchLM.ai API

- **Source**: https://benchlm.ai/embed
- **What it provides**: Ranked benchmark scores for 248+ LLMs across 225 benchmarks, plus pricing data. Categories: coding, agentic, reasoning, knowledge, math, multilingual, instruction following.
- **Access methods**: REST API at `https://benchlm.ai/api/data/leaderboard` and `https://benchlm.ai/api/data/pricing`. CSV/JSON download from the /embed page.
- **Data format**: JSON with `lastUpdated`, `models[]` array (rank, model, creator, sourceType, overallScore, categoryScores, inputPrice, outputPrice). CSV also available.
- **Update cadence**: 1-3 times per week. CDN-cached for 1 hour.
- **Reproducibility**: Medium — blend of benchmark backbone + external calibration signals. Methodology is documented.
- **Rate limits / auth**: Free-tier has 3-second intentional delay. No auth required for basic access. 1-hour CDN cache.

### Key Claims
- 248 tracked LLMs, 225 benchmarks, comprehensive coverage.
- Distinguishes "provisional" (source-unverified) from "verified" (exact-source) rankings.
- Scores use bounded calibration from external consensus signals — benchmarks retain majority weight.

### Evidence Extracts
> "Returns ranked benchmark scores for all models. Supports category filtering and CSV export."
> "Benchmark scores and pricing data are updated 1-3 times per week."
> "Free-tier API responses include a 3-second delay. Responses are cached at the CDN for 1 hour."
> "GET /api/data/leaderboard?category=coding&limit=10"

### Limitations
- 3-second intentional delay on free tier is significant for high-frequency polling.
- No auth means anyone can use it, but service may be less reliable.
- Composite "overallScore" is proprietary and may change methodology.
- No historical snapshots — current data only.

### Secondary Leads
- https://benchlm.ai/ — web interface for discovery.
- https://github.com/leoncuhk/awesome-llm-bench — auto-synced daily mirror of BenchLM.ai top-10 per benchmark.

---

## Approach 7: ALL Bench Leaderboard (HuggingFace Dataset)

- **Source**: https://huggingface.co/datasets/FINAL-Bench/ALL-Bench-Leaderboard
- **What it provides**: Unified multi-modal benchmark dataset covering LLM (42 models), VLM (16), Agent (10), Image Gen (10), Video Gen (10), Music Gen (8). Each score tagged with confidence level: cross-verified, single-source, or self-reported.
- **Access methods**: HuggingFace datasets library or direct JSON download via `hf_hub_download`.
- **Data format**: JSON file (`all_bench_leaderboard_v2.1.json`) with `llm`, `vlm`, `agent`, `image`, `video`, `music` arrays and a `confidence` object mapping per-model per-benchmark source trust levels.
- **Update cadence**: Manual/periodic (last updated March 2026).
- **Reproducibility**: High — each score has provenance tagging; GitHub repo with versioned releases.
- **Rate limits / auth**: HuggingFace dataset download limits apply (free tier).

### Key Claims
- The only unified multi-modal AI benchmark dataset with explicit confidence tagging.
- Covers 91 models across 6 modalities.
- Composite score uses a 5-Axis Intelligence Framework: Knowledge, Expert Reasoning, Abstract Reasoning, Metacognition, Execution.

### Evidence Extracts
> "Each benchmark score in the confidence object is tagged: cross-verified ✓✓, single-source ✓, or self-reported ~."
> "ALL Bench Leaderboard aggregates and cross-verifies benchmark scores for 91 AI models across 6 modalities."
> "Every numerical score is tagged with a confidence level and its original source."

### Limitations
- Manual curation — may lag behind new model releases.
- Not all scores are independently verified (many are "single-source" or "self-reported").
- Relatively small team behind it (sustainability concern).
- Dataset is a single JSON file, not an updatable API.

### Secondary Leads
- https://huggingface.co/spaces/FINAL-Bench/all-bench-leaderboard — interactive leaderboard web UI.
- GitHub mirror: https://github.com/final-bench/ALL-Bench-Leaderboard.

---

## Approach 8: BenchGecko Python Client

- **Source**: https://github.com/BenchGecko/benchgecko-python
- **What it provides**: Python client for benchgecko.ai — tracks 414 models across 55 providers and 40 benchmarks. Methods: `get_model()`, `compare_models()`, `get_pricing()`, `list_benchmarks()`, `list_models()`.
- **Access methods**: Python library (`pip install benchgecko`) with bundled snapshot data.
- **Data format**: Python dictionaries with benchmark scores, pricing, provider info.
- **Update cadence**: Bundled snapshot — update frequency not specified.
- **Reproducibility**: Medium — uses snapshot data, not live API.
- **Rate limits / auth**: None (offline/bundled data).

### Key Claims
- Zero-dependency Python client.
- 414 models, 55 providers, 40 benchmarks tracked.
- Covers OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, Cohere.

### Evidence Extracts
> "Python client for BenchGecko, the AI model data platform."
> "BenchGecko tracks 414 models across 55 providers and 40 benchmarks."

### Limitations
- Bundled snapshot approach means data can be stale between releases.
- Smaller project — less community validation.
- No live streaming API; relies on periodic data dumps.

### Secondary Leads
- https://benchgecko.ai — web platform for the full catalogue.

---

## Approach 9: ModelRank AI (GitHub Auto-Updater)

- **Source**: https://github.com/chenjy16/modelrank_ai
- **What it provides**: Auto-updated open-source LLM leaderboard that fetches model evaluation data from HuggingFace daily via GitHub Actions. Outputs JSON and CSV.
- **Access methods**: GitHub repo with data/ directory. JSON and CSV downloads from GitHub Pages.
- **Data format**: CSV/JSON with model name, parameters, evaluation scores (IFEval, BBH, MATH, MUSR, MMLU-PRO, etc.).
- **Update cadence**: Daily via GitHub Actions cron.
- **Reproducibility**: High — fully automated pipeline.
- **Rate limits / auth**: None via GitHub.

### Key Claims
- Automatically fetches latest model evaluation data from HuggingFace daily via GitHub Actions.
- Provides comprehensive leaderboard data with search, sort, and data download.

### Evidence Extracts
> "Automatically fetches the latest model evaluation data from HuggingFace daily via GitHub Actions."
> "Provides data in JSON and CSV formats for download."

### Limitations
- Depends on HuggingFace data sources (if they change schema, this breaks).
- Relatively low community engagement (10 stars).
- Focuses on a limited set of benchmarks.

### Secondary Leads
- https://github.com/EvanZhouDev/ai-model-index — similar approach but using Artificial Analysis API as source, auto-updates daily.

---

## Approach 10: EvalScope (Evaluation Framework with HTTP API)

- **Source**: https://github.com/modelscope/evalscope / https://evalscope.readthedocs.io/
- **What it provides**: A comprehensive evaluation framework with an HTTP API service mode. Supports model evaluation and performance stress testing via REST endpoints.
- **Access methods**: `POST /api/v1/eval` and `POST /api/v1/perf` endpoints. Python library `evalscope` with `run_task()` function. CLI command `evalscope eval`.
- **Data format**: JSON request/response with evaluation results saved to `work_dir` output directory.
- **Update cadence**: Framework is actively developed (v1.5+). Benchmark datasets are pre-loaded.
- **Reproducibility**: Very high — standardized evaluation harness, documented parameters.
- **Rate limits / auth**: None (self-hosted). API key is required only for the model endpoints being evaluated.

### Key Claims
- One-stop evaluation framework with built-in industry-recognized benchmarks (MMLU, C-Eval, GSM8K, ARC, HellaSwag, etc.).
- Supports OpenAI-compatible model APIs, local models, and multi-backend (OpenCompass, MTEB, VLMEvalKit, RAGAS).
- HTTP service mode makes evaluation callable as a microservice.
- Agent evaluation mode for tool-calling and multi-step reasoning benchmarks (SWE-bench, etc.).

### Evidence Extracts
> "EvalScope is a one-stop LLM evaluation framework built by the ModelScope Community."
> "The Flask service encapsulates EvalScope's core evaluation (eval) and stress testing (perf) functionalities, providing services through standard RESTful APIs."
> "evalscope eval --model your-model-name --api-url $OPENAI_API_BASE_URL --api-key $OPENAI_API_KEY --eval-type openai_api --datasets gsm8k --limit 5"

### Limitations
- This is an evaluation framework, not a data source — you run the evaluations yourself.
- Requires deploying the model service you want to evaluate.
- Benchmark datasets are pre-loaded but may not include the most recent community additions.
- Results are local output files, not a hosted leaderboard.

### Secondary Leads
- https://evalscope.readthedocs.io/en/latest/user_guides/service.html — HTTP API documentation.
- https://github.com/modelscope/evalscope/tree/main/evalscope/benchmarks — bundled benchmark adapters.

---

## Automation Pipeline Design Considerations

### Recommended Primary Sources (for a cron-based registry)
1. **arena-ai-leaderboards REST API** — daily ELO snapshots, no auth, stable JSON schema. Use as the primary Arena source.
2. **Artificial Analysis API** — independent benchmark scores with pricing, 1,000 req/day free. Use for multi-benchmark capability scores.
3. **HuggingFace leaderboard API / OpenEvals Parquet** — authoritative single-file cross-benchmark view. Use for "official" benchmark coverage.
4. **BenchLM API** — broadest model coverage (248+ models) with category filtering. Acceptable for fallback with 3s delay tolerance.

### Web Scraping Fallbacks
- Arena AI (arena.ai) — no API, but page is server-side rendered. The arena-ai-leaderboards repo demonstrates using Jina Reader + Azure OpenAI for structured extraction. Fallback: raw HTML parsing.
- Artificial Analysis RSC endpoint — the `MaurerAnton/artificialanalysis-ai-parser` extracts data from the internal Next.js RSC stream (fragile, use only if official API is unavailable).

### Data Validation Strategy
- Cross-validate ELO scores across Arena AI API and Artificial Analysis (they both track Arena ELO).
- Tag each datapoint with fetch timestamp and source.
- Use versioned snapshots (e.g., `data/YYYY-MM-DD/`) like the arena-ai-leaderboards pattern.
- Implement schema validation (JSON Schema or Pydantic) before committing to storage.
- Use the ALL-Bench Leaderboard's confidence system (cross-verified / single-source / self-reported) as a model for provenance tracking.

### Recommended Update Cadence
| Source | Cadence | Justification |
|---|---|---|
| arena-ai-leaderboards (Arena ELO) | Daily | Arena updates continuously with new votes |
| Artificial Analysis API | Daily (1x) | Benchmark scores change infrequently; pricing changes more often |
| HuggingFace leaderboards | Weekly | Leaderboard updates are batch-processed |
| BenchLM API | Weekly | 1-3 updates/week, daily check sufficient |
| ALL-Bench dataset | On-release | Manual dataset release, check HF for updates |

### Minimal Pipeline Architecture
```
cron trigger → fetch_data.py
  ├── Fetch arena-ai-leaderboards (REST API + raw GitHub fallback)
  ├── Fetch Artificial Analysis (REST API with API key)
  ├── Fetch HuggingFace OpenEvals Parquet (hf:// path)
  └── Fetch BenchLM (REST API, accept 3s delay)

validate.py → validates schema, normalizes fields, timestamps

merge.py → merges into unified registry DB (SQLite or Parquet)
  └── Per-model: Arena ELO, AA Intelligence Index, per-benchmark scores, pricing

persist → commit to data/YYYY-MM-DD/ + update latest.json pattern
```

## Limitations & Risks
- **No single authoritative source** — cross-referencing is required for trustworthy rankings.
- **Arena ELO is human preference, not capability** — treat separately from benchmark scores.
- **Vendor self-reported scores** (on model cards) are not reliable — favor independently-verified sources (Artificial Analysis, HuggingFace official leaderboards, OpenCompass).
- **API terms of service** — verify redistribution rights for each source before publishing aggregated data.
- **Source availability** — unofficial scrapers and third-party APIs can break without notice. Maintain at least 2 independent paths for each data point.

## Secondary Leads
- https://opencompass.org.cn/leaderboard-llm — OpenCompass web leaderboard (Chinese-language).
- https://lmarena.ai — official Arena AI/Chatbot Arena (301-redirects to arena.ai).
- https://artificialanalysis.ai/leaderboards/intelligence — AA Intelligence Index web view.
- https://smartchunks.com/lmsys-arena-elo-leaderboard-explained-2026/ — analysis of Arena ELO methodology (April 2026).
- https://github.com/AgileWoW/lmsys-arena-leaderboard-tracker — historical ELO tracker with CSV data.
- https://github.com/AgileWoW/best-ai-models-leaderboard — multi-source aggregation (LMSYS + SWE-bench + AA).
- https://github.com/EvanZhouDev/ai-model-index — daily auto-updated leaderboard from Artificial Analysis API.
- https://evalscope.readthedocs.io/ — documentation for the EvalScope framework.
