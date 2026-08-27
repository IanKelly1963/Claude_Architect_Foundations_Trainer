================================================================================
CCAR-F ARCHITECT TRAINER
How and why this app was built, and every quality gate it must pass
================================================================================

Last updated after Pass 0 of the bank expansion (commit b173a83).

Current state:  187 questions | 30 teaching notes | 152 flashcards
                30 task statements, 6-7 questions each (target: 20 each)
                553 distractor rationales | 187/187 items scenario-framed
                440,415 bytes, one file, no dependencies


--------------------------------------------------------------------------------
1. WHY IT EXISTS
--------------------------------------------------------------------------------

The Claude Certified Architect - Foundations exam (CCAR-F) is a real Anthropic
credential: 60 items, 120 minutes, scaled pass mark of 720 out of 1000, valid
12 months, delivered through Pearson VUE.

The project began with one file in this folder: the official exam guide. It
defines a precise structure that nothing was exercising:

  - 5 content domains with fixed blueprint weights (27/18/20/20/15 %)
  - 30 task statements across those domains
  - 6 realistic scenarios, 4 of which are drawn at random per sitting
  - 12 worked sample questions establishing the exam's house style

The requirement was an app that BOTH teaches and tests one student, remembers
scores between sessions per subject, and drives them to 85% on every subject.

The design decision that shapes everything else: the 85% gate is applied per
TASK STATEMENT (30 of them), not per domain. A domain-level gate would let a
student sit at 85% in "Agentic Architecture" while being consistently wrong
about hooks and session forking. Thirty separate gates make that impossible.


--------------------------------------------------------------------------------
2. WHY A SINGLE HTML FILE
--------------------------------------------------------------------------------

No dependencies, no build step to run it, no server, no network calls, no API
keys, no accounts. Double-click and study. It works on a train.

Verified: the only HTTP request the page makes is for the page itself.

The cost of that choice is that all content is baked in, so the app cannot
generate new questions. Everything is authored ahead of time. That is why the
question bank is the bulk of the work and the bulk of this document.


--------------------------------------------------------------------------------
3. HOW SCORING WORKS, AND WHY IT IS NOT SIMPLE PERCENT-CORRECT
--------------------------------------------------------------------------------

Lifetime percent-correct is a poor readiness signal for two opposite reasons:
early mistakes drag it down permanently, and re-seeing a memorised question
inflates it. So:

  RECENCY WEIGHTING
  Each task statement is scored over its last 12 attempts, weighted 0.85^age.
  Recent work counts for more. A student who answered 6 wrong then 6 right
  scores 72.6%, not the naive 50%.

  A DISTINCT-QUESTION FLOOR
  Mastery is withheld unless the attempts are spread across enough DIFFERENT
  questions. This is what stops a lucky streak on one remembered item awarding
  a green light. Verified: 8 correct answers on only 3 distinct questions
  yields a score of 1.0 but is correctly NOT mastered.

  A GATE THAT SCALES WITH THE POOL
  The thresholds are not fixed. gateFor() computes them from how many
  questions that task statement actually has:
        attempts  = ceil(pool x 0.5), clamped to [6, 10]
        distinct  = ceil(pool x 0.4), clamped to [4, 8]
  At a 7-question pool that is 6 attempts / 4 distinct. At 20 it becomes
  10 / 8 automatically.

  This replaced a flat raise to 10/8, which was implemented, measured, and
  reverted: it made mastery unreachable for every task statement until the
  bank expansion finished, leaving the app unusable throughout. The scaled
  gate needs no flag day.

  ADAPTIVE SELECTION
  Practice draws by weight, not at random. Weak task statements dominate,
  unseen questions are boosted, missed questions return hard, and correctly
  answered ones are held back on a widening interval (2^consecutive-correct
  sessions). Measured: with a student solid everywhere except one domain,
  71.6% of drawn questions came from that domain against its 19.3% share of
  the bank - a 3.71x boost.

  FLASHCARDS ARE EXCLUDED FROM SCORING
  They are self-graded, and self-assessment is too unreliable to gate on.
  Tracked and displayed, deliberately kept out of the mastery percentages.


--------------------------------------------------------------------------------
4. THE THREE TEST-CONSTRUCTION DEFECTS FOUND AND FIXED
--------------------------------------------------------------------------------

A question bank can be technically accurate and still worthless, if a student
can score well without knowing the material. Three such defects were found by
measurement. All three were introduced by the authoring process, and none was
visible to the content validator.

  DEFECT 1 - ANSWER POSITION (catastrophic)
  Every one of the 187 questions had been authored with the correct answer
  written first, leaving it at position A in all of them. Chi-square 537 on
  3 degrees of freedom. A student answering "A" to everything scored 100%.

  Fix: options are permuted whenever a question is drawn into a quiz. The
  option list, the correct keys and the per-letter distractor rationales are
  relabelled together, and the item keeps its id so scoring is unaffected. A
  student meeting the same question twice sees a different arrangement.

  Verified: correct-answer text preserved in 2000/2000 shuffles, zero orphaned
  rationales, position distribution uniform (chi-square 0.74).

  DEFECT 2 - ANSWER LENGTH
  The correct answer was the longest option in 78.8% of items, against a 25%
  chance rate. Cause was structural: correct answers carried a justifying
  clause that distractors lacked, so correct answers averaged 29.5% more
  characters.

  Fix: 232 option texts rewritten. Justifications moved into the explanation,
  where they already lived; thin distractors given real substance.

  Verified: now 21.8%, length-rank chi-square 2.07, mean lengths within 5%.

  Note the fix initially OVERSHOT to 10.1%, which is its own reverse tell, and
  clumped 70 items at rank 2. A second rebalancing pass restored 27 correct
  answers to produce a flat distribution. Both directions matter.

  DEFECT 3 - DISTRACTOR PLAUSIBILITY
  A distractor that is obviously wrong lets a student score above chance by
  elimination. Measured and found real:
    - d1-1.7-c had three near-duplicate distractors, all variations of "not
      the flag", so recognising any one of them eliminated all three
    - two questions carried two invented-capability distractors each, both
      eliminable on product knowledge alone
    - "pick the shortest option" scored 30.6%, a residue of over-trimming
      during the Defect 2 fix

  Fix: d1-1.7-c rebuilt around REAL flags with genuinely different failure
  modes (--continue loads the most recent conversation; --session-id names a
  new one), verified against the CLI reference. Rationales rewritten to avoid
  double invented capabilities. Nine over-trimmed correct answers restored.

  Verified: shortest-option now 25.0%, exactly chance.


--------------------------------------------------------------------------------
5. TWO METRICS THAT WERE PROPOSED, TRIALLED, AND REJECTED
--------------------------------------------------------------------------------

Recorded because the reasoning matters more than the conclusion.

  REJECTED: a minimum rationale length of 80 characters.
  Good rationales are often short. "A 30-hour cadence blows the SLA before
  processing even begins" is complete and precise at 62 characters. And
  terseness is CORRECT for an invented-capability distractor: "--batch is not
  a Claude Code flag" is the whole truth. An 80-char floor would have forced
  padding of good content.

  REJECTED: a target of 60% of rationales containing an "engagement marker"
  (wording that concedes why a wrong answer is tempting).
  Measurement showed the metric was reading phrasing, not substance. This
  rationale scores zero on it and is excellent:
      "A single assistant turn can contain both text and tool_use blocks. The
       model often narrates what it is about to do and then calls a tool in
       the same turn, so text presence is not a completion signal."
  Chasing 60% would have meant padding 400+ rationales with "this is tempting,
  but..." boilerplate. That is metric-gaming with no learning benefit.

  Both are still REPORTED by the guard, labelled as informational, so the
  numbers are visible without driving behaviour.

  What replaced them: the elimination heuristics, which measure the real
  property (can a student beat chance without knowledge) directly.


--------------------------------------------------------------------------------
6. THE QUALITY GATES
--------------------------------------------------------------------------------

Run:   bash tools/build.sh && bash tools/check.sh
check.sh exits non-zero if any gate fails. No pass is committed until it is
green.

GATE 1 - JavaScript syntax
  node --check over the inline script extracted from the built HTML.

GATE 2 - Content validator (src/80-validate.js, runs in-browser on every load)
  ERRORS on:
    - duplicate or missing question ids
    - a correct answer key that is not one of the options
    - a question typed "multi" with one answer, or untyped with several
    - domain not matching the task statement
    - unknown scenario, missing explain.why
    - a task statement with no questions
    - a domain with fewer questions than a mock exam needs
    - a task statement over the 20-question target
    - any item with no scenario framing
    - a mock draw failing to reach 60 items in 200 trials
    - answer key skewed after shuffling (would mean shuffleOptions broke)
    - correct answer longest in more than 40% of items
  WARNS on:
    - a distractor with no rationale
    - an item with no source reference
    - a task statement with fewer than 6 questions
    - a task statement with no Learn note
    - uneven correct-answer length rank
    - domain/draw combinations that backfill from unshown scenarios

GATE 3 - Bias analysis, as stored (tools/analyse.js)
  Answer key distribution, correct-answer length rank histogram, mean length
  of correct versus distractor options, and a naive-strategy simulation.

GATE 4 - Bias analysis, as presented (tools/analyse-presented.js)
  The same measures over 300 simulated presentations, i.e. what a student
  actually sees after shuffling. This is the one that matters for position.
  Requires: position uniform, no length tell.

GATE 5 - Distractor quality guard (tools/distractors.js)
  FAILS on:
    - any of six blind-elimination heuristics scoring above 35% (chance 25%):
      longest option, shortest option, avoid-absolutes, prefer-hedged,
      most stem-word overlap, odd-one-out by leading word
    - a near-duplicate distractor pair within one question (Jaccard > 0.55)
    - more than one invented-capability distractor per question
  WARNS on:
    - a heuristic between 30% and 35%
    - distractors markedly less on-topic than correct answers
  REPORTS ONLY:
    - rationale length distribution and engagement-marker rate (section 5)

  One documented exemption: d3-3.6-a is allowed two invented-capability
  distractors because it reproduces the guide's own sample Q10, which uses
  CLAUDE_HEADLESS and --batch and says so in its explanation. Faithfulness to
  the source beats the house rule; the exemption carries its reason in code.

GATE 6 - Reproducible build
  Deleting the HTML, rebuilding from src/, and comparing must give a
  byte-identical file. Last verified at commit b173a83: sha256 882ce32b8caf,
  440415 bytes, identical.

GATE 7 - Manual, before any release
  - practice a set, confirm task-statement scores move on the dashboard
  - reload, confirm scores persisted
  - export JSON, reset, import, confirm exact restoration
  - mock exam: timer, blueprint distribution, scaled score, per-domain report
  - confirm mastery is withheld at the distinct-question floor
  - resize to 375px, confirm no horizontal page overflow in any view
  - confirm zero external network requests


--------------------------------------------------------------------------------
7. AUTHORING STANDARD FOR QUESTIONS
--------------------------------------------------------------------------------

Every item carries: stem, exactly 4 options, correct key(s), explain.why, a
rationale for EVERY distractor, a source citation, a domain, a task statement
and a scenario.

Questions are written in the guide's own idiom: a concrete production symptom
with numbers, one answer correct for a specific architectural reason, and
three distractors drawn from the failure modes the guide itself names.

Every distractor must be one of six named failure modes, so it is a mistake a
competent practitioner might actually make:
  1. over-engineering - heavier machinery that would work but is disproportionate
  2. right instinct, wrong mechanism - a prompt where a hook is required
  3. blaming a component that is working correctly
  4. a proxy for the real variable - confidence or sentiment for complexity
  5. partially correct - does part of the job, misses the decisive part
  6. plausible-but-false capability - a flag or field that sounds real

At most ONE type-6 distractor per question.


--------------------------------------------------------------------------------
8. SCENARIO FIDELITY
--------------------------------------------------------------------------------

The real exam draws 4 of the 6 scenarios and frames every item under one. An
audit against the guide found four defects, now being closed:

  - Scenario 4 had ZERO Domain 3 questions, though the guide declares D3
    primary for it. Five items retagged in Pass 0; more to come.
  - Domain 3 was 69% concentrated in Scenario 2, so 6 of the 15 possible
    four-scenario draws could not fill the blueprint and silently backfilled
    from scenarios the student was not being shown.
  - 16 scenario-tagged items sat in a non-primary domain.
  - 25 items (13.4%) had no scenario framing at all. Now zero.

A GENUINE CONSTRAINT WORTH RECORDING
The guide declares Domain 4 primary only for Scenarios 5 and 6. The draw
{1,2,3,4} excludes both, so under STRICT primary-domain tagging that draw
could supply zero D4 items while the blueprint demands 12. Strict tagging and
full mock-draw coverage are mathematically incompatible.

Resolution: "primary domains" is treated as EMPHASIS, not exclusivity. Each
scenario keeps 64-83% of its items in its declared primary domains, with a
deliberate minority elsewhere so every draw fills. The guide supports this -
it calls the blueprint weights "approximate" - and a prompt-engineering
question about the support agent sits naturally under Scenario 1.


--------------------------------------------------------------------------------
9. CONTENT ACCURACY, AND ITS LIMITS
--------------------------------------------------------------------------------

Content is written against the exam guide's task statements and checked
against current Anthropic documentation. Where the guide and the docs have
diverged, the Learn notes teach the EXAM-CANONICAL answer first and flag
current behaviour second:

  1. Task -> Agent. The guide says allowedTools must include "Task"; Claude
     Code renamed it "Agent" in v2.1.63, though the SDK still reports Task in
     the system:init list. Answer Task on the exam.
  2. MCP scopes. The guide implies two; current docs define three, and "local"
     rather than "user" is the default for a personal server.
  3. /memory versus /context. /memory lists file locations; /context shows
     what actually loaded.
  4. Structured outputs. Tool use with a JSON schema remains the exam answer;
     native Structured Outputs via output_format now also exists.

WHAT IS NOT VERIFIED, STATED PLAINLY
The guide's 12 sample questions are the only externally validated answers -
the guide publishes both the question and its rationale, and all 12 are
covered. The other 175 answers are one author's judgement applied to the
guide's objectives. There has been no second reviewer and no answer key from
Anthropic. Treat the app as good preparation, not as an oracle.

The simulated scaled score uses a linear 0-100% to 100-1000 map, putting the
720 pass mark at about 69% raw. Anthropic does not publish the real
conversion. The app labels this an approximation on screen. Raw percentage
and per-task-statement mastery are the meaningful numbers.


--------------------------------------------------------------------------------
10. PERSISTENCE, AND ITS FAILURE MODES
--------------------------------------------------------------------------------

Progress lives in one localStorage key, ccarf.trainer.v1, with JSON export and
import.

Local-file storage is real but fragile, and the app is honest about it:

  - Chrome and Edge key localStorage to the exact file URL; Firefox keys it to
    the containing directory. MOVING OR RENAMING THE HTML ORPHANS YOUR SCORES.
  - Clearing browser data wipes them.
  - Some browsers and policies block storage for file:// origins entirely.

So the app PROBES storage for real at startup rather than assuming. If the
probe fails it shows a blunt red banner naming two fixes, and it prompts for a
JSON export every 5 sessions. "Start Trainer.cmd" serves the folder over
http://localhost, where storage works in every browser.

This could not be verified empirically: every browser automation tool
available refused the file:// protocol. The behaviour above is from
documentation, which is why the runtime probe and the launcher both exist.


--------------------------------------------------------------------------------
11. REPOSITORY LAYOUT AND WORKFLOW
--------------------------------------------------------------------------------

  Claude_Architect_Trainer.html   the deliverable - GENERATED, do not hand-edit
  Start Trainer.cmd               localhost launcher for guaranteed persistence
  Architecture_Foundations_Exam_Guide.md   the source of truth for content
  README.md                       short orientation
  readme.txt                      this document
  src/                            32 source parts; numeric prefixes set order
  tools/build.sh                  concatenates src/ into the HTML
  tools/check.sh                  runs gates 1, 3, 4 and 5
  tools/analyse.js                bias analysis, as stored
  tools/analyse-presented.js      bias analysis, as the student sees it
  tools/distractors.js            distractor quality guard
  tools/apply_patch.py            surgical option rewrites by id|letter
  tools/retag.py                  scenario reassignment by id
  tools/patches/                  every content migration, kept as a record

EDIT src/, NEVER THE HTML. Then:

    bash tools/build.sh && bash tools/check.sh

.gitattributes pins line endings to LF. This is not cosmetic: check.sh matches
^<script>$, and Windows autocrlf would inject carriage returns and break the
build for anyone cloning.

.gitignore excludes ccarf-progress-*.json so exported personal study data is
never committed by accident.


--------------------------------------------------------------------------------
12. WHAT IS IN FLIGHT
--------------------------------------------------------------------------------

The bank is being expanded from 187 to 600 questions - 20 per task statement -
because 6-7 is too thin for repeated study: a student begins recognising items,
which inflates scores against the 85% gate.

  Pass 0  DONE  distractor guard, scaled mastery gate, full scenario framing
  Pass 1        Domain 1  +91
  Pass 2        Domain 2  +70
  Pass 3        Domain 3  +84
  Pass 4        Domain 4  +84
  Pass 5        Domain 5  +84
  Pass 6        final verification and documentation

Every pass rebuilds, runs all gates, and is committed only when green. The
per-pass checkpoint exists so an authoring problem surfaces after ~80
questions rather than after 413.

================================================================================
