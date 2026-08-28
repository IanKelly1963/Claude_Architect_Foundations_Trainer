# Claude Architect Foundations Trainer

A standalone study and assessment app for the **Claude Certified Architect – Foundations**
exam (CCAR-F). One HTML file, no dependencies, no network calls, works offline.

- **187 questions** covering all 30 task statements in the exam blueprint
- **30 teaching notes**, one per task statement
- **152 flashcards** for factual recall
- **Timed mock exam** mirroring the real format: 60 items, 120 minutes, 4 of 6 scenarios
- Progress persists in `localStorage`, with JSON export/import for backup

## Using it

Open `Claude_Architect_Trainer.html` in a browser. That is the whole app.

If it shows a red *"Progress cannot be saved in this browser"* banner, that browser is
blocking storage for local files. Run `Start Trainer.cmd` instead, which serves the folder
on `http://localhost:8731` where storage works everywhere.

> **Progress is tied to the exact file location.** Chrome keys local-file storage to the
> full file URL and Firefox to the containing directory, so moving or renaming the HTML
> orphans your scores. Clearing browser data wipes them. Use **Export progress** on the
> Progress tab for a durable backup — the app nags you every 5 sessions.

## How mastery is scored

The 85% gate is applied **per task statement** (30 of them), not per domain, so a weak
topic cannot hide inside a strong domain.

Lifetime percent-correct would be a poor readiness signal: early mistakes drag it down
permanently, and re-seeing a memorised question inflates it. Instead each task statement is
scored on a **recency-weighted window** of its last 12 attempts, and mastery additionally
requires at least 6 attempts spread over at least 4 **distinct** questions. That
distinct-question floor is what stops a lucky streak on one remembered item awarding a
green light — 8/8 correct on 3 distinct questions is deliberately *not* mastery.

Practice draws adaptively: weak task statements dominate the sample, unseen questions are
boosted, missed questions come back hard, and correctly-answered ones are held back on a
widening interval. With a student solid everywhere except one domain, ~72% of drawn
questions come from that domain against its ~19% share of the bank.

## Repository layout

```
Claude_Architect_Trainer.html   the deliverable (generated - do not edit by hand)
Start Trainer.cmd               optional localhost launcher for guaranteed persistence
Architecture_Foundations_Exam_Guide.md   the official exam guide this is built against
src/                            source parts; numeric prefixes define build order
tools/build.sh                  concatenates src/ into the HTML
tools/check.sh                  JS syntax check, both bias analyses,
                                distractor guard and contrast guard
tools/analyse.js                measures the bank as stored
tools/analyse-presented.js      measures the bank as the student actually sees it
tools/distractors.js            catches distractors eliminable without knowledge
tools/contrast.js               checks the dark palette against WCAG
tools/apply_patch.py            surgically rewrites individual option texts by id
tools/patches/                  the option rewrites applied to remove answer bias
```

**Edit `src/`, never the HTML.** Then:

```bash
bash tools/build.sh && bash tools/check.sh
```

## Test-construction guarantees

Two biases would let a student score well without knowing the material. Both were present
in the first draft and have been fixed:

| Naive strategy | Before | After | Chance |
|---|---|---|---|
| Always answer A | **100.0%** | 25.0% | 25% |
| Always pick the longest option | **78.8%** | 21.8% | 25% |

**Answer position.** Every question was authored with the correct answer first, leaving it
at A in all 187 items. Options are now permuted whenever a question is drawn into a quiz —
option list, `correct` keys and per-letter distractor rationales relabelled together — so
positions are uniform and cannot be memorised across sessions.

**Answer length.** The correct answer was the longest option 78.8% of the time, because
correct answers carried a justifying clause that distractors lacked. 232 option texts were
rewritten: justifications moved into the explanation (where they already lived) and thin
distractors given real substance. The length-rank distribution is now flat.

> `tools/analyse.js` reports *"always answer A: 100%"* by design — it measures the **stored**
> order, and shuffling happens at presentation time. `tools/analyse-presented.js` measures
> what a student actually sees, and is the one that matters.

`validateBank()` runs on every page load and guards both properties, so an edit cannot
silently reintroduce them. It errors if the correct answer is longest in more than 40% of
items, and if the shuffled key distribution skews. Open the browser console to see it.

## Content accuracy

Questions and notes are written against the exam guide and checked against current
Anthropic documentation. Where the two have diverged, the note teaches the
**exam-canonical answer first** and flags current behaviour second:

1. **`Task` → `Agent`** — the guide says `allowedTools` must include `Task`; Claude Code
   renamed it `Agent` in v2.1.63, though the SDK still reports `Task` in `system:init`.
2. **MCP scopes** — the guide implies two; current docs define three (`local` is the
   default for personal servers, not `user`).
3. **`/memory` vs `/context`** — `/memory` lists file *locations*; `/context` shows what
   actually **loaded**.
4. **Structured outputs** — tool use with a JSON schema remains the exam answer; native
   Structured Outputs via `output_format` now also exists.

The simulated scaled score uses a linear 0–100% → 100–1000 map, putting the 720 pass mark
at about 69% raw. **Anthropic does not publish the real conversion**, and the app labels
this an approximation. Raw percentage and per-task-statement mastery are the meaningful
numbers.
