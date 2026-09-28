# AGENTS.md

Instructions for coding agents (Codex, Claude Code, and others) working in this repository.
Humans are welcome to read it too — it is the shortest accurate description of how this project is maintained.

## What this project is

『熱波論破』 is a static, build-free browser quiz game (Japanese UI).
Each "sauna store" is a topic (GitHub, Codex, WSL, ...). A rival character states a claim;
the player decides whether it is correct or picks the precise correction.
The educational value lives in the explanations, so **factual accuracy beats everything else**.

## Commands

- Install once: `npm ci`
- Run all tests: `npm test` (Node's built-in `node --test` + jsdom). Must pass before any commit.
- Fast unit/data tests only: `npm run test:unit`
- Check question sources (network GET only, no AI): `node scripts/check-sources.mjs`
  - After adding or re-verifying a source URL: `node scripts/check-sources.mjs --update`
  - Check one URL while writing a question: `node scripts/check-sources.mjs --only <url>`
- Run locally: `python3 -m http.server 8000`, then open http://localhost:8000

## Layout

- `js/data/questions-<store>.js` — question banks, one file per store, built with `defineQuestions()`
- `js/data/stores.js`, `js/data/questionPools.js`, `js/data/introScripts.js` — store registry, pool registry, intro dialogue
- `js/engine/` — DOM-free logic (picker, timer, records). `js/screens/` — one module per screen
- `tests/` — `data.test.js` validates every registered pool automatically
- `data/source-snapshots.json` — hashes of each source page's main text, used to detect doc changes
- `docs/CONTENT_GUIDE.md` — the rules for writing questions (read it before touching question files)
- `docs/MAINTENANCE.md` — playbook for the daily source-watch issue and routine upkeep

## Rules for question content

- Sources must be **official documentation** of the product (vendor docs, official repos). No blogs, videos, or AI-generated text.
- Open the source page and confirm the claim is actually written there before using it. Do not infer beyond the page.
- Ask about durable concepts, not volatile details (button positions, prices, preview-only flags).
- Never change or delete an existing question `id`; players' progress is keyed by it. Append new questions at the end.
- Keep choices length-balanced; `tests/data.test.js` enforces that the correct choice is not usually the longest or shortest.
- Every URL in `source` must appear in `data/source-snapshots.json` (a test checks this). Run `--update` after adding one.

## Rules for code changes

- Vanilla ES modules only. No build step, no framework, no runtime dependencies.
- Tests must not call the network, paid APIs, or any LLM.
- Keep the UI keyboard-operable and readable on a phone-width screen.
- Keep diffs focused on the task. Do not reformat unrelated files.

## When the daily source-watch issue fires

Follow `docs/MAINTENANCE.md`. In short: for each changed URL, re-read the page, check the listed question ids,
fix the question or explanation only if the doc now says something different, then run `npm test` and
`node scripts/check-sources.mjs --update`, and open a PR that names the question ids you checked.

## Safety

- Do not push to `main`, merge PRs, create tags or releases, or change repository settings. Open a PR and stop.
- Do not commit secrets, personal data, or local machine paths.
