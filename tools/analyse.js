const BANK = require("./bank.js");

const single = BANK.filter(q => q.type !== "multi");
const multi  = BANK.filter(q => q.type === "multi");

function pct(n, d) { return d ? (n / d * 100).toFixed(1) + "%" : "-"; }
function chi2(obs, expEach) {
  return obs.reduce((s, o) => s + Math.pow(o - expEach, 2) / expEach, 0);
}

console.log("=".repeat(72));
console.log("QUESTION BANK BIAS ANALYSIS  ·  " + BANK.length + " items (" +
            single.length + " single-answer, " + multi.length + " multi-answer)");
console.log("=".repeat(72));

/* ---------------------------------------------------------------- 1. KEY */
console.log("\n--- 1. ANSWER KEY DISTRIBUTION (single-answer items) -------------------");
const keys = ["A", "B", "C", "D"];
const counts = { A: 0, B: 0, C: 0, D: 0 };
single.forEach(q => counts[q.correct[0]]++);
const expEach = single.length / 4;
keys.forEach(k => {
  const bar = "#".repeat(Math.round(counts[k] / single.length * 100));
  console.log(`  ${k}: ${String(counts[k]).padStart(3)}  ${pct(counts[k], single.length).padStart(6)}  ${bar}`);
});
console.log(`  expected under uniformity: ${expEach.toFixed(1)} each (25.0%)`);
const X2 = chi2(keys.map(k => counts[k]), expEach);
console.log(`  chi-square = ${X2.toFixed(2)}  (df=3; 7.81 = p.05, 11.34 = p.01, 16.27 = p.001)`);
console.log(`  verdict: ${X2 < 7.81 ? "consistent with random" : X2 < 11.34 ? "SIGNIFICANT SKEW p<.05" : X2 < 16.27 ? "SIGNIFICANT SKEW p<.01" : "SEVERE SKEW p<.001"}`);

/* per domain */
console.log("\n  by domain:");
for (let d = 1; d <= 5; d++) {
  const items = single.filter(q => q.domain === d);
  const c = { A: 0, B: 0, C: 0, D: 0 };
  items.forEach(q => c[q.correct[0]]++);
  console.log(`   D${d} (n=${String(items.length).padStart(2)}):  ` +
    keys.map(k => `${k}=${String(c[k]).padStart(2)}`).join("  ") +
    `   chi2=${chi2(keys.map(k => c[k]), items.length / 4).toFixed(1)}`);
}

/* runs: consecutive identical keys in authored order */
console.log("\n  longest run of the same key in authored order:");
let run = 1, best = 1, bestKey = single[0].correct[0], bestAt = single[0].id;
for (let i = 1; i < single.length; i++) {
  if (single[i].correct[0] === single[i - 1].correct[0]) {
    run++;
    if (run > best) { best = run; bestKey = single[i].correct[0]; bestAt = single[i].id; }
  } else run = 1;
}
console.log(`   ${best} consecutive '${bestKey}' (ending ${bestAt})`);
const flips = single.slice(1).filter((q, i) => q.correct[0] !== single[i].correct[0]).length;
console.log(`   key changes between adjacent items: ${flips}/${single.length - 1} (${pct(flips, single.length - 1)}; ~75% expected if random)`);

/* --------------------------------------------------------------- 2. LEN */
console.log("\n--- 2. LENGTH BIAS (single-answer items) ------------------------------");
let longestIsCorrect = 0, shortestIsCorrect = 0;
let rankSum = 0, corrLenSum = 0, distLenSum = 0, distCount = 0;
const rankHist = { 1: 0, 2: 0, 3: 0, 4: 0 };
const offenders = [];

single.forEach(q => {
  const lens = q.options.map(o => ({ k: o.k, n: o.text.length }));
  const sorted = lens.slice().sort((a, b) => b.n - a.n);         // longest first
  const correctKey = q.correct[0];
  const correctLen = lens.find(o => o.k === correctKey).n;
  const rank = sorted.findIndex(o => o.k === correctKey) + 1;    // 1 = longest
  rankHist[rank]++;
  rankSum += rank;
  if (rank === 1) { longestIsCorrect++; offenders.push({ id: q.id, len: correctLen, next: sorted[1].n, margin: correctLen - sorted[1].n }); }
  if (rank === 4) shortestIsCorrect++;
  corrLenSum += correctLen;
  lens.forEach(o => { if (o.k !== correctKey) { distLenSum += o.n; distCount++; } });
});

console.log(`  correct answer is the LONGEST option:  ${longestIsCorrect}/${single.length}  ${pct(longestIsCorrect, single.length)}   (25.0% = chance)`);
console.log(`  correct answer is the SHORTEST option: ${shortestIsCorrect}/${single.length}  ${pct(shortestIsCorrect, single.length)}   (25.0% = chance)`);
console.log(`  mean length rank of correct answer: ${(rankSum / single.length).toFixed(2)}  (2.50 = no bias; 1.00 = always longest)`);
console.log(`  rank histogram (1=longest): ` + [1, 2, 3, 4].map(r => `${r}:${rankHist[r]}`).join("  "));
const mc = corrLenSum / single.length, md = distLenSum / distCount;
console.log(`  mean chars, correct option:    ${mc.toFixed(1)}`);
console.log(`  mean chars, distractor option: ${md.toFixed(1)}`);
console.log(`  difference: ${(mc - md >= 0 ? "+" : "") + (mc - md).toFixed(1)} chars (${((mc / md - 1) * 100).toFixed(1)}%)`);
const X2len = chi2([rankHist[1], rankHist[2], rankHist[3], rankHist[4]], single.length / 4);
console.log(`  chi-square on rank distribution = ${X2len.toFixed(2)} (df=3)`);
console.log(`  verdict: ${X2len < 7.81 ? "no detectable length tell" : X2len < 11.34 ? "LENGTH TELL p<.05" : "LENGTH TELL p<.01"}`);

/* strategy simulation */
console.log("\n--- 3. NAIVE-STRATEGY SIMULATION (what a clueless student would score) --");
const alwaysA = single.filter(q => q.correct[0] === "A").length;
const pickLongest = longestIsCorrect;
let pickLongestMulti = 0;
multi.forEach(q => {
  const sorted = q.options.slice().sort((a, b) => b.text.length - a.text.length)
    .slice(0, q.correct.length).map(o => o.k).sort().join("");
  if (sorted === q.correct.slice().sort().join("")) pickLongestMulti++;
});
console.log(`  always answer A:            ${alwaysA}/${single.length}  ${pct(alwaysA, single.length)}`);
console.log(`  always pick longest option: ${pickLongest}/${single.length}  ${pct(pickLongest, single.length)}`);
console.log(`  longest-N on multi items:   ${pickLongestMulti}/${multi.length}  ${pct(pickLongestMulti, multi.length)}`);
const naiveBest = Math.max(alwaysA, pickLongest);
console.log(`  best naive strategy scores ~${pct(naiveBest, single.length)}  (random guessing = 25.0%)`);

/* worst offenders for length */
console.log("\n--- 4. WORST LENGTH OFFENDERS (correct answer longest by widest margin) -");
offenders.sort((a, b) => b.margin - a.margin).slice(0, 12).forEach(o => {
  console.log(`   ${o.id.padEnd(11)} correct=${String(o.len).padStart(3)} chars, next longest=${String(o.next).padStart(3)}, margin +${o.margin}`);
});

/* multi-answer key positions */
console.log("\n--- 5. MULTI-ANSWER ITEMS (n=" + multi.length + ") -----------------------------------");
const mc2 = {};
multi.forEach(q => { const k = q.correct.slice().sort().join(""); mc2[k] = (mc2[k] || 0) + 1; });
Object.keys(mc2).sort().forEach(k => console.log(`   ${k}: ${mc2[k]}`));
console.log("");
