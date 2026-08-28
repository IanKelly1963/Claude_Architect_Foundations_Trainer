/* ============================================================================
   Distractor quality guard.

   A distractor that is obviously wrong lets a student score above chance by
   elimination, without knowing the material — the same class of defect as an
   answer-key skew or a length tell, and invisible to the content validator.

   WHAT THIS GATES ON, AND WHY

   Only defects that are demonstrably *exploitable* fail the build:

     1. an elimination heuristic beating chance      -> free marks without knowledge
     2. two distractors saying the same thing        -> both must be wrong, so both go
     3. two invented-capability distractors          -> both eliminable on product
                                                        knowledge alone

   Rationale length and "engagement" phrasing are reported but do NOT gate.
   Both were trialled as gates and rejected on evidence: good rationales are
   often short ("A 30-hour cadence blows the SLA before processing even
   begins" is complete at 62 chars), and terseness is *correct* for an
   invented-capability distractor. A phrasing target would be met by padding
   rationales with "this is tempting, but…" boilerplate, which teaches nothing.
   The elimination heuristics measure the real property directly.

   Usage: node distractors.js <path-to-built-html>
   ============================================================================ */

const fs = require("fs");

const htmlPath = process.argv[2] || "Claude_Architect_Trainer.html";
const _src = fs.readFileSync(htmlPath, "utf8");
/* The bank cites R_* citation constants declared earlier in the built file.
   Evaluating the array in isolation would fail on them, so bring them along. */
const _refs = (_src.match(/^const R_[A-Z0-9_]+ *= *\{[\s\S]*?\};$/gm) || []).join("\n");
const BANK = eval(_refs + "\n" + _src.match(/const BANK_ALL = (\[[\s\S]*?\n\]);/)[1]);
const SINGLE = BANK.filter(q => q.type !== "multi");

const fails = [], warns = [];
const pct = n => (n * 100).toFixed(1) + "%";

const STOP = new Set(("the a an is are was were be been being of to in for on with and or " +
  "that this it its as by at from when what which how why you your use using should would " +
  "could not do does no so if then than there their they them we our us can may").split(" "));
const words = t => t.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/)
  .filter(w => w.length > 3 && !STOP.has(w));
const wordSet = t => new Set(words(t));
function jaccard(a, b) {
  const A = wordSet(a), B = wordSet(b);
  if (!A.size || !B.size) return 0;
  const i = [...A].filter(x => B.has(x)).length;
  return i / (A.size + B.size - i);
}

const ABSOLUTE = /\b(always|never|all|none|only|every|any|cannot|impossible|must|guaranteed|entirely|completely)\b/i;
const HEDGED   = /\b(may|can|often|typically|generally|usually|tends to|somewhat|sometimes)\b/i;
const INVENTED = /(does not exist|is not a real|no such|not a Claude Code|invented|not a recognised|not a documented|there is no)/i;
const ENGAGE   = /\b(reasonable|sensible|right approach|would work|does work|does help|helps|useful|valid|partially|tempting|plausible|right idea|second step|marginal|better than|more useful|worth|legitimate|defensible|in principle|delays|reduces|improves|raises|lowers|slightly|mostly|most of the time|but|however|though|although|while)\b/i;

/* --------------------------------------------- 1. elimination heuristics */
function scoreHeuristic(fn) {
  let t = 0;
  SINGLE.forEach(q => {
    const p = fn(q);
    if (p.length && p.includes(q.correct[0])) t += 1 / p.length;
  });
  return t / SINGLE.length;
}

const HEURISTICS = {
  "longest option": q => {
    const m = Math.max(...q.options.map(o => o.text.length));
    return q.options.filter(o => o.text.length === m).map(o => o.k);
  },
  "shortest option": q => {
    const m = Math.min(...q.options.map(o => o.text.length));
    return q.options.filter(o => o.text.length === m).map(o => o.k);
  },
  /* Fixing a "longest answer" tell by extending exactly one distractor moves
     items from rank 1 to rank 2 rather than spreading them, which creates a
     second-longest tell instead. Testing only the extremes misses that
     entirely, so every interior rank is checked too. */
  "second-longest option": q => {
    const sorted = q.options.slice().sort((a, b) => b.text.length - a.text.length);
    return sorted.length > 1 ? [sorted[1].k] : [];
  },
  "second-shortest option": q => {
    const sorted = q.options.slice().sort((a, b) => a.text.length - b.text.length);
    return sorted.length > 1 ? [sorted[1].k] : [];
  },
  "avoid absolutes": q => {
    const k = q.options.filter(o => !ABSOLUTE.test(o.text));
    return (k.length && k.length < q.options.length) ? k.map(o => o.k) : [];
  },
  "prefer hedged wording": q => {
    const k = q.options.filter(o => HEDGED.test(o.text));
    return (k.length && k.length < q.options.length) ? k.map(o => o.k) : [];
  },
  "most stem-word overlap": q => {
    const sw = wordSet(q.stem);
    const sc = q.options.map(o => ({ k: o.k, n: words(o.text).filter(w => sw.has(w)).length }));
    const m = Math.max(...sc.map(x => x.n));
    return m === 0 ? [] : sc.filter(x => x.n === m).map(x => x.k);
  },
  "odd-one-out (lead word)": q => {
    const lead = q.options.map(o => o.text.split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, ""));
    const c = {}; lead.forEach(l => c[l] = (c[l] || 0) + 1);
    const u = q.options.filter((o, i) => c[lead[i]] === 1);
    return u.length === 1 ? [u[0].k] : [];
  }
};

console.log("=".repeat(72));
console.log("DISTRACTOR QUALITY GUARD  ·  " + BANK.length + " items (" + SINGLE.length + " single-answer)");
console.log("=".repeat(72));

console.log("\n1. BLIND-ELIMINATION HEURISTICS   chance 25.0%   fail >35.0%   warn >30.0%");
Object.keys(HEURISTICS).forEach(name => {
  const p = scoreHeuristic(HEURISTICS[name]);
  const flag = p > 0.35 ? "   FAIL" : (p > 0.30 ? "   warn" : "");
  console.log("   " + name.padEnd(26) + pct(p).padStart(6) + flag);
  if (p > 0.35) fails.push("elimination tell: '" + name + "' scores " + pct(p));
  else if (p > 0.30) warns.push("'" + name + "' at " + pct(p) + " is above chance");
});

/* ------------------------------------------ 2. near-duplicate distractors */
console.log("\n2. NEAR-DUPLICATE DISTRACTORS   two wrong options that say the same thing");

/* Options that are predominantly a code literal are testing syntax
   discrimination, where the whole point is that they differ by punctuation
   the word tokeniser discards. Comparing `paths: ["src/**\/*.{ts,tsx}"]`
   against `paths: ["src/**\/*.ts*"]` on words alone calls them identical when
   a student must tell them apart precisely. Prose options are unaffected, so
   genuinely interchangeable distractors are still caught. */
function isCodeLiteral(text) {
  const inTicks = (text.match(/`[^`]*`/g) || []).join("").length;
  return inTicks / text.length > 0.6;
}

let dup = 0;
BANK.forEach(q => {
  const d = q.options.filter(o => q.correct.indexOf(o.k) === -1);
  for (let i = 0; i < d.length; i++) for (let j = i + 1; j < d.length; j++) {
    if (isCodeLiteral(d[i].text) && isCodeLiteral(d[j].text)) continue;
    const s = jaccard(d[i].text, d[j].text);
    if (s > 0.55) {
      dup++;
      fails.push(q.id + ": distractors " + d[i].k + "/" + d[j].k +
                 " near-duplicate (similarity " + s.toFixed(2) + ")");
    }
  }
});
console.log("   pairs above 0.55 similarity: " + dup + (dup ? "   FAIL" : "   ok"));

/* ------------------------------------- 3. invented-capability distractors
   Exempt: items that reproduce a published sample question from the exam
   guide. The guide's own Q10 offers both `CLAUDE_HEADLESS` and `--batch` and
   states in its explanation that both are non-existent features, so the real
   exam does do this. Faithfulness to the source wins over the house rule. */
const INVENTED_EXEMPT = {
  "d3-3.6-a": "mirrors exam guide sample Q10, which itself uses two invented flags"
};
console.log("\n3. INVENTED-CAPABILITY DISTRACTORS   at most one per question");
let over = 0, exempted = 0;
BANK.forEach(q => {
  const n = Object.values(q.explain.distractors || {}).filter(r => INVENTED.test(r)).length;
  if (n > 1) {
    if (INVENTED_EXEMPT[q.id]) { exempted++; return; }
    over++;
    fails.push(q.id + " has " + n + " invented-capability distractors (max 1)");
  }
});
console.log("   questions with more than one: " + over + (over ? "   FAIL" : "   ok") +
            (exempted ? "   (" + exempted + " exempt as guide-derived)" : ""));

/* ------------------------------------------- 4. off-topic filler (warn only) */
console.log("\n4. OFF-TOPIC FILLER   distractors should be as on-topic as correct answers");
function zeroOverlapRate(pickCorrect) {
  let z = 0, n = 0;
  BANK.forEach(q => {
    const sw = wordSet(q.stem);
    q.options.filter(o => (q.correct.indexOf(o.k) !== -1) === pickCorrect).forEach(o => {
      n++;
      if ([...wordSet(o.text)].filter(w => sw.has(w)).length === 0) z++;
    });
  });
  return n ? z / n : 0;
}
const dz = zeroOverlapRate(false), cz = zeroOverlapRate(true);
console.log("   zero stem-overlap: distractors " + pct(dz) + "  vs correct answers " + pct(cz) + " (control)");
if (dz - cz > 0.15) warns.push("distractors are markedly less on-topic than correct answers (" +
  pct(dz) + " vs " + pct(cz) + "), suggesting off-topic filler");

/* --------------------------------------------- 5. informational statistics */
let tot = 0, eng = 0; const lens = [];
BANK.forEach(q => Object.values(q.explain.distractors || {}).forEach(r => {
  tot++; lens.push(r.length); if (ENGAGE.test(r)) eng++;
}));
lens.sort((a, b) => a - b);
console.log("\n5. RATIONALE STATISTICS   informational only - deliberately not gated");
console.log("   count " + tot + "   min " + lens[0] + "   median " + lens[Math.floor(lens.length / 2)] +
            "   max " + lens[lens.length - 1]);
console.log("   containing a concession/engagement marker: " + pct(eng / tot) +
            "   (weak proxy for phrasing, not substance)");

console.log("\n" + "=".repeat(72));
if (warns.length) { console.log("WARNINGS (" + warns.length + "):"); warns.forEach(w => console.log("   ! " + w)); }
if (fails.length) {
  console.log("FAILURES (" + fails.length + "):");
  fails.forEach(f => console.log("   x " + f));
  console.log("\nDISTRACTOR GUARD: FAIL");
  process.exit(1);
}
console.log("DISTRACTOR GUARD: PASS" + (warns.length ? " (with warnings)" : ""));
