# Plan: CCAR-F Architect Trainer — standalone HTML tutor & exam simulator

## Context

The project folder contains one file: `Architecture_Foundations_Exam_Guide.md`, the official guide for the
**Claude Certified Architect – Foundations (CCAR-F)** exam. Web research confirms this is a real Anthropic
credential (launched March 2026, delivered via Pearson VUE, 60 items / 120 min / 720-of-1000 to pass).

The guide defines a precise, testable structure that nothing currently exercises:

- **5 domains** with fixed blueprint weights (27 / 18 / 20 / 20 / 15 %)
- **30 task statements** across those domains — the real unit of knowledge
- **6 scenarios**, 4 of which are drawn at random per exam sitting
- 12 worked sample questions establishing the house style: realistic production symptom → four
  plausible options → one right for a *specific architectural reason*, with the others being
  over-engineering, probabilistic-where-deterministic-is-needed, or fixing the wrong layer

The need: a single self-contained tutor the student can open repeatedly, that **teaches** each objective,
**tests** it, and **remembers scores across sessions per subject**, driving every subject to 85%.

Outcome: one HTML file, no server, no dependencies, no network calls, that a student can run daily until
the dashboard is green across all 30 task statements.

## Decisions taken (confirmed with user)

| Decision | Choice |
|---|---|
| Persistence | `localStorage` + explicit JSON export/import |
| Mastery granularity | Per **task statement** (30), rolling up to domain; 85% gate applies per task statement |
| Bank size | ~185 questions — 7 per Domain 1 statement, 6 per statement elsewhere |
| Modes | Learn · Adaptive practice · Timed mock exam · Flashcards |

## Deliverable

`Claude_Architect_Trainer.html` in the project root — single file, inline CSS/JS, zero external requests,
works from `file://`. Estimated ~400 KB when fully populated.

---

## Architecture

### Data model

Three inline arrays, plus a persisted state object.

```js
BANK = [{
  id: "d1-1-1-a",          // stable — mastery history keys off this, never renumber
  domain: 1,                // 1..5
  ts: "1.1",                // task statement — the mastery unit
  scenario: 3,              // 1..6, or 0 for scenario-free objective items
  type: "single" | "multi", // multi-response items state how many to pick
  stem, options[{k,text}], correct: ["A"],
  explain: { why, distractors: {B,C,D} },   // every distractor explained, per guide style
  refs: [{label, url}],
  note: "…"                 // optional exam-vs-current-docs callout
}]

NOTES = [{ ts: "1.1", title, core, facts[], traps[], refs[], note }]   // 30 entries, Learn mode

CARDS = [{ ts, front, back }]                                          // ~120 recall cards
```

Persisted under localStorage key `ccarf.trainer.v1`:

```js
{ version, questionStats: { [qid]: {seen, correct, consecCorrect, lastSession} },
  tsHistory:  { [ts]:  [{correct: bool, t: epoch}] },   // capped at 40 most recent
  sessions:   [{date, mode, n, correct, perDomain, perTS, durationMs, scaled?}],
  cardStats:  { [cardId]: {…} },                        // kept OUT of the mastery model
  sessionCounter, prefs }
```

### Mastery model — the core of "85% on all subjects"

Naive lifetime percent-correct is wrong twice over: early mistakes permanently drag the number down, and
re-seeing a memorised question inflates it. Instead, per task statement:

- **Score** = recency-weighted accuracy over the last 12 attempts, weight `0.85^age`
- **Mastered** requires *all three*: score ≥ 0.85 **and** ≥ 6 attempts **and** ≥ 4 *distinct* questions seen

The distinct-question floor is what stops a lucky streak on one memorised item from awarding mastery.

- **Domain score** = same formula over a 25-attempt window across the domain
- **Domain mastered** only when all its task statements are mastered
- **Overall readiness** = mastered task statements / 30

Flashcards are self-graded, so their stats are tracked and displayed but **excluded** from the scored model.

### Adaptive selection

Each candidate question gets weight:

```
w = (0.2 + 3·(1 − mastery(ts))²)          // push hard toward weak task statements
  × (never seen ? 2.0 : answered-wrong ? 2.5 : 0.25)
  × (spaced-repetition gate: suppress while sessionCounter − lastSession < 2^consecCorrect)
```

then sample without replacement; never repeat a question within one session.

### Mock exam

Mirrors the real format: pick 4 of the 6 scenarios at random, then draw 60 items matching **blueprint
weights** — 16 / 11 / 12 / 12 / 9 — preferring items tagged to the chosen scenarios and backfilling from
scenario-free items. 120-minute countdown, no feedback until submit, then a score report showing
per-domain percent-correct exactly as the real report does.

Scaled score uses a linear 0–100% → 100–1000 map, so 720 ≈ 69% raw. **Anthropic does not publish the
raw-to-scaled conversion**, so the UI labels this an approximation and shows raw percent against the
student's own 85% target alongside it. No invented authority.

### Bank shape vs blueprint

The bank is deliberately *coverage-balanced* (6–7 per task statement) so Learn and Practice cover every
objective evenly; the **mock exam sampler** applies blueprint weighting at draw time. Domain 1 gets 7 per
statement (49 items) because it carries 27% of the real exam.

Domain 1: 49 · Domain 2: 30 · Domain 3: 36 · Domain 4: 36 · Domain 5: 36 → **187 items**

### UI

Tabs: **Dashboard · Learn · Practice · Mock Exam · Flashcards · Progress**

- **Dashboard** — overall readiness ring; 5 domain cards; a 30-row task-statement table colour-coded
  red / amber / green against the 85% line; "Drill your weakest 5" one-click CTA
- **Learn** — 30 task-statement notes: core idea, testable facts, the traps the exam sets, doc links
- **Practice** — 10–20 item adaptive sets, immediate per-question feedback with full distractor rationale
- **Mock Exam** — timed, scenario-framed, score report at the end
- **Flashcards** — two-sided rapid recall, self-graded
- **Progress** — session history table + per-domain trend, export/import/reset

Light/dark via `prefers-color-scheme`. Keyboard: `1–4` to select, `Enter` to submit/advance.

### Content accuracy — "exam answer vs current docs"

Research surfaced four places where the July 2026 guide has been overtaken. Each becomes a flagged callout
in Learn mode, teaching the **exam-canonical answer first** and the current behaviour second:

1. **Task → Agent.** Guide says `allowedTools` must include `"Task"` to spawn subagents. The tool was
   renamed `Agent` in Claude Code v2.1.63; the SDK still emits `Task` in `system:init`. Answer `Task` on
   the exam.
2. **MCP scopes.** Guide implies two (project `.mcp.json`, user `~/.claude.json`). Docs define three —
   **local** (the default, stored per-project in `~/.claude.json`), **project**, **user** — with precedence
   local → project → user.
3. **`/memory` vs `/context`.** Guide says use `/memory` to verify which memory files loaded. Docs: `/memory`
   lists and opens memory file *locations*; `/context` shows what actually **loaded** this session.
4. **Structured output.** Guide's answer — `tool_use` + JSON schema — is still correct for the exam. Docs now
   also offer native Structured Outputs via the `output_format` parameter.

An unverified blog claim about `paths:` frontmatter being ignored in `~/.claude/rules/` is **excluded** —
official docs state user-level rules load before project rules, and I won't assert what I can't confirm.

Every question carries `refs[]` pointing at the primary source used:
`code.claude.com/docs/en/memory`, `/mcp`, `/headless`, `/skills`, `/agent-sdk/subagents`, `/agent-sdk/hooks`,
plus `platform.claude.com` for the Messages/Batches API.

---

## Build sequence

Each pass leaves a valid, openable file — arrays start empty and are filled in place at marked anchors.

| Pass | Work |
|---|---|
| 1 | Shell: HTML/CSS, state layer, mastery engine, adaptive sampler, all 6 tabs, `validateBank()`, empty data arrays |
| 2 | `NOTES` — all 30 task-statement teaching notes + the 4 discrepancy callouts |
| 3 | `BANK` Domain 1 — 49 items (agentic loop, coordinator/subagent, context passing, enforcement, hooks, decomposition, sessions) |
| 4 | `BANK` Domains 2 & 3 — 66 items (tool descriptions, MCP errors, tool distribution, MCP config, built-in tools; CLAUDE.md, commands/skills, path rules, plan mode, iteration, CI/CD) |
| 5 | `BANK` Domains 4 & 5 — 72 items (criteria, few-shot, JSON schemas, validation/retry, batch, multi-pass; context, escalation, error propagation, codebase exploration, human review, provenance) |
| 6 | `CARDS` — ~120 recall cards |
| 7 | Verification + fixes |

I'll write questions in the guide's own idiom: a concrete production symptom with numbers, one correct
answer justified by an architectural principle, and three distractors drawn from the specific failure modes
the guide names — over-engineering, prompt-based enforcement where deterministic is required, blaming a
downstream component, and confidence/sentiment proxies for complexity.

## Verification

**Built-in validator** (`validateBank()`, runs on load, logs to console):
- every `id` unique; every `correct` key exists in that item's `options`
- every one of the 30 task statements has ≥ 6 questions; every domain total matches the table above
- every item has a non-empty `explain.why` and a rationale for *each* distractor
- every one of the 30 task statements has a matching `NOTES` entry
- mock-exam sampler can fill 16/11/12/12/9 from any random 4-scenario draw (run 200 times)

**Browser check** via `preview_start` on the `file://` URL, then `read_console_messages` for validator
output and `read_page` to confirm rendering. Fall back to a temporary static server if `file://` is refused.

**Manual end-to-end:**
1. Practice set of 10 → confirm dashboard task-statement scores move
2. Reload → confirm scores persisted
3. Export JSON → inspect the file → reset → import → confirm exact restoration
4. Full mock exam short-circuited via console → confirm timer, blueprint distribution, scaled score, per-domain report
5. Deliberately answer one task statement wrong repeatedly → confirm the adaptive sampler over-selects it
6. Confirm mastery is withheld at 6/6 correct on only 3 distinct questions (distinct-question floor works)
7. Resize to 375px → confirm mobile layout holds

## Out of scope

- No network calls or API keys — the bank is static, so the app works offline forever
- Not published as an Artifact by default. It would work and be reachable from any device, but localStorage
  is origin-scoped, so a published copy keeps **separate** progress from the local file. Offered as a
  follow-up, not assumed.