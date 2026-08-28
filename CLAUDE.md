# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A standalone study and mock-exam app for the Claude Certified Architect – Foundations
(CCAR-F) exam. One self-contained HTML file: no dependencies, no server, no network calls.
`Architecture_Foundations_Exam_Guide.md` is the source of truth for all content.

`readme.txt` records why the design is the way it is, including decisions that were
reversed. Read it before changing the scoring model or the question bank — several
obvious-looking "improvements" were already tried and rejected on evidence.

## The one rule that matters

**`Claude_Architect_Trainer.html` is generated. Never edit it by hand.** Edit `src/`, then:

```bash
bash tools/build.sh && bash tools/check.sh
```

`check.sh` exits non-zero if any quality gate fails. Nothing is committed until it is green.

## Commands

```bash
bash tools/build.sh                                   # src/ -> Claude_Architect_Trainer.html
bash tools/check.sh                                   # all gates; non-zero exit on failure
node tools/distractors.js Claude_Architect_Trainer.html   # just the distractor guard
python tools/apply_patch.py tools/patches/<file>.json     # rewrite option texts by "id|letter"
python tools/retag.py tools/patches/<file>.json           # reassign scenarios by question id
```

`tools/analyse.js` and `tools/analyse-presented.js` expect a `bank.js` module in the
working directory. `check.sh` extracts one into a temp dir before running them; to run one
standalone, replicate that extraction rather than invoking it from the repo root.

To preview with working persistence, run `Start Trainer.cmd`, or serve the folder
(`python -m http.server 8731 --bind 127.0.0.1`) and open the file over `http://`.
Opening from `file://` works in Chrome and Edge but storage is blocked in some browsers,
which is why the app probes storage at boot and shows a banner when it fails.

In the browser console: `validateBank()`, `CCARF.state()`, `CCARF.tsStat("4.3")`,
`CCARF.readiness()`, `CCARF.drawMock()`.

## Build model

`src/` files are **concatenated in sorted filename order** into a single inline `<script>`.
Numeric prefixes define that order; the build globs the directory, so adding a file needs
no build change.

Two consequences that will bite you:

- **There are no modules.** Everything shares one scope. A `const` in `03-taxonomy.js` is
  visible in `90-boot.js`. Declaration order is filename order, so anything referenced at
  load time must sort earlier.
- **The per-domain bank files are fragments, not valid JavaScript.** `20-bank-open.js`
  opens the array literal and `26-bank-close.js` closes it; `21-…` through `25-…` contain
  bare object literals between them. Linting one in isolation will report syntax errors.

`.gitattributes` pins line endings to LF. This is functional, not cosmetic: `check.sh`
matches `^<script>$`, and Windows autocrlf would inject carriage returns and break the
build for anyone cloning.

## Architecture

Data flows `BANK_ALL` → filtered into `BANK_D1..D5` (`26-bank-close.js`) → merged back to
`BANK` with derived indexes (`40-engine.js`).

Each question carries: `id`, `domain`, `ts` (task statement), `scenario` (1–6), `type`,
`stem`, four `options`, `correct` keys, `explain.why`, a rationale for **every** distractor,
and `refs`. Ids are stable — mastery history keys off them, so never renumber.

**Scoring (`40-engine.js`)** is deliberately not lifetime percent-correct. Each task
statement scores on a recency-weighted window of its last 12 attempts, and mastery also
requires a minimum number of attempts across a minimum number of *distinct* questions.
`gateFor()` scales those minimums to the size of that statement's question pool
(`ceil(pool×0.5)` attempts clamped to [6,10]; `ceil(pool×0.4)` distinct clamped to [4,8]),
so the gate stays proportionate as the bank grows and never becomes unreachable.

**Options are permuted at presentation time** (`shuffleOptions` in `46-shuffle.js`, called
from `startQuiz` in `51-quiz.js`). Every question is authored with the correct answer first,
so **stored order is always A** — that is expected, not a bug. The shuffle relabels the
option list, the `correct` keys and the per-letter distractor rationales together. Any code
that reads answers must go through the presented copy, never the stored one.

**The mock exam sampler** (`41-sampler.js`) draws 4 of the 6 scenarios, then fills the
blueprint distribution 16/11/12/12/9 per domain, preferring scenario-matched items and
backfilling when a scenario-matched pool is short.

## Quality gates

Two biases and one plausibility defect were found in the original bank by measurement, and
guards now exist so they cannot silently return. When adding questions, all must hold:

| Gate | Enforced by | Fails on |
|---|---|---|
| Content correctness | `validateBank()` in `src/80-validate.js`, on every page load | bad ids, correct key not among options, missing rationale, unframed item, over-target task statement, mock draw that cannot fill |
| Answer position | `tools/analyse-presented.js` | non-uniform position **after shuffling** |
| Answer length | `analyse.js` + `validateBank()` | correct answer longest in >40% of items (chance is 25%) |
| Distractor plausibility | `tools/distractors.js` | any of eight blind-elimination heuristics >35%, near-duplicate distractors in one question, >1 invented-capability distractor per question |
| Reproducible build | manual | rebuilding from `src/` not byte-identical |

`tools/distractors.js` deliberately **reports but does not gate** rationale length and
"engagement" phrasing. Both were trialled as gates and rejected: good rationales are often
short, terseness is correct for an invented-capability distractor, and a phrasing target
would be met by padding rather than by better content. `readme.txt` §5 has the evidence.

## Authoring questions

Write in the exam guide's idiom: a concrete production symptom with numbers, one answer
correct for a specific architectural reason, three distractors that a competent
practitioner might actually pick. Each distractor should be one of — over-engineering;
right instinct but wrong mechanism; blaming a component that is working correctly; a proxy
for the real variable (confidence, sentiment); partially correct; or a plausible-but-false
capability. **At most one plausible-but-false capability per question**, or a student
eliminates two options on product knowledge alone.

Do not make correct answers systematically longer than distractors. The justification
belongs in `explain.why`, not in the option text.

Where the exam guide and current Anthropic documentation disagree, teach the
**exam-canonical answer first** and flag current behaviour in the item's `note` field.
Four such divergences are already documented (`Task` vs `Agent`, MCP scope count,
`/memory` vs `/context`, native Structured Outputs).

## Content status

600 questions across 30 task statements, 20 each. Every item is scenario-framed, and
all 75 domain/draw combinations in the mock exam fill without backfill.

Only the 12 questions derived from the guide's published samples have externally validated
answers; the rest are authored judgement. Do not describe the app as authoritative.

When adding questions, correcting a length bias by extending one distractor pushes items
into the adjacent rank and creates a mirror tell there. `tools/distractors.js` tests all
four length ranks for exactly this reason; check the whole distribution, not one metric.
