
/* ==========================================================================
   10. Content validator
   --------------------------------------------------------------------------
   Runs on load and reports to the console. Catches authoring mistakes that
   would otherwise show up as a broken question mid-session: duplicate ids,
   correct answers pointing at options that do not exist, task statements with
   too few items, missing distractor rationales, notes with no matching task
   statement, and mock draws that cannot be filled.
   ========================================================================== */

function validateBank(){
  const errs = [], warns = [];
  const seen = {};

  BANK.forEach(function(q, i){
    const at = "[" + (q.id || "#" + i) + "]";
    if(!q.id) errs.push(at + " missing id");
    else if(seen[q.id]) errs.push(at + " duplicate id");
    else seen[q.id] = 1;

    if(!TASK_BY_ID[q.ts]) errs.push(at + " unknown task statement '" + q.ts + "'");
    else if(TASK_BY_ID[q.ts].d !== q.domain)
      errs.push(at + " domain " + q.domain + " does not match task statement " + q.ts);

    if(!q.options || q.options.length < 3) errs.push(at + " fewer than 3 options");
    if(!q.correct || !q.correct.length) errs.push(at + " no correct answer");
    else{
      const keys = (q.options || []).map(function(o){ return o.k; });
      q.correct.forEach(function(k){
        if(keys.indexOf(k) === -1) errs.push(at + " correct answer '" + k + "' is not an option");
      });
      if(q.type === "multi" && q.correct.length < 2) errs.push(at + " typed multi but has one answer");
      if(q.type !== "multi" && q.correct.length > 1) errs.push(at + " has " + q.correct.length +
        " answers but is not typed multi");
    }
    if(!q.explain || !q.explain.why) errs.push(at + " missing explain.why");
    else{
      const d = q.explain.distractors || {};
      (q.options || []).forEach(function(o){
        if(q.correct.indexOf(o.k) === -1 && !d[o.k])
          warns.push(at + " no rationale for distractor " + o.k);
      });
    }
    if(q.scenario && !SCENARIOS[q.scenario]) errs.push(at + " unknown scenario " + q.scenario);
    if(!q.refs || !q.refs.length) warns.push(at + " no source reference");
  });

  /* coverage */
  const perTs = {}, perDom = {1:0,2:0,3:0,4:0,5:0};
  TASKS.forEach(function(t){ perTs[t.ts] = 0; });
  BANK.forEach(function(q){ if(perTs[q.ts] !== undefined) perTs[q.ts]++; if(perDom[q.domain] !== undefined) perDom[q.domain]++; });
  TASKS.forEach(function(t){
    if(perTs[t.ts] === 0) errs.push("task statement " + t.ts + " has NO questions");
    else if(perTs[t.ts] < 6)
      warns.push("task statement " + t.ts + " has only " + perTs[t.ts] +
                 " questions, too few to sample without heavy repetition");
    if(!NOTE_BY_TS[t.ts]) warns.push("task statement " + t.ts + " has no Learn note");
  });
  for(let d = 1; d <= 5; d++){
    if(perDom[d] < BLUEPRINT[d])
      errs.push("domain " + d + " has " + perDom[d] + " questions but a mock exam needs " + BLUEPRINT[d]);
  }

  /* --- target depth: 20 questions per task statement -----------------------
     Under target is expected while the bank is being built out, so it is
     reported as progress rather than an error. Over target is an authoring
     mistake and does fail. */
  const TARGET_PER_TS = 20;
  const atTarget = TASKS.filter(function(t){ return perTs[t.ts] >= TARGET_PER_TS; }).length;
  TASKS.forEach(function(t){
    if(perTs[t.ts] > TARGET_PER_TS)
      errs.push("task statement " + t.ts + " has " + perTs[t.ts] + " questions, over the target of " + TARGET_PER_TS);
  });
  console.log("  depth: " + atTarget + "/" + TASKS.length + " task statements at " +
              TARGET_PER_TS + " questions (bank " + BANK.length + "/" + (TASKS.length * TARGET_PER_TS) + ")");

  /* --- every item must be scenario-framed, as the real exam is ------------- */
  const unframed = BANK.filter(function(q){ return !q.scenario; });
  if(unframed.length)
    errs.push(unframed.length + " item(s) carry no scenario framing: " +
              unframed.slice(0, 8).map(function(q){ return q.id; }).join(", ") +
              (unframed.length > 8 ? " …" : ""));

  /* --- can every four-scenario draw fill the blueprint without backfill? ----
     The real sitting draws 4 of the 6 scenarios. If a draw cannot supply a
     domain's share from scenario-matched items, the sampler silently pulls in
     questions from scenarios the student is not being shown. */
  const scenarioShort = [];
  for(let a = 1; a <= 6; a++) for(let b = a+1; b <= 6; b++)
  for(let c = b+1; c <= 6; c++) for(let e = c+1; e <= 6; e++){
    const draw = [a,b,c,e];
    for(let d = 1; d <= 5; d++){
      const avail = BANK.filter(function(q){
        return q.domain === d && draw.indexOf(q.scenario) !== -1; }).length;
      if(avail < BLUEPRINT[d]) scenarioShort.push(draw.join("+") + " short on D" + d +
        " (" + avail + "/" + BLUEPRINT[d] + ")");
    }
  }
  if(scenarioShort.length){
    warns.push(scenarioShort.length + " of 75 domain/draw combinations backfill from " +
      "unshown scenarios, e.g. " + scenarioShort.slice(0, 3).join("; "));
  }
  console.log("  scenario coverage: " + (75 - scenarioShort.length) + "/75 domain-draw " +
              "combinations fill from scenario-matched items alone");

  /* can the mock sampler always fill a blueprint-weighted 60? */
  let worstBackfill = 0, fails = 0;
  if(BANK.length){
    for(let k = 0; k < 200; k++){
      const m = drawMock();
      if(m.questions.length !== 60) fails++;
      worstBackfill = Math.max(worstBackfill, m.backfilled);
    }
    if(fails) errs.push("mock draw failed to reach 60 items in " + fails + "/200 trials");
  }

  /* --- test-construction bias --------------------------------------------
     Two tells would let a student score well without knowing the material:
     a skewed answer key, and the correct answer being reliably the longest.
     Position is neutralised at presentation time by shuffleOptions(), so it
     is checked on the shuffled form. Length is a property of the content
     itself and must be checked on the stored text.                        */
  const singles = BANK.filter(function(q){ return q.type !== "multi"; });
  if(singles.length > 40){
    const pos = {A:0,B:0,C:0,D:0};
    singles.forEach(function(q){
      const k = shuffleOptions(q).correct[0];
      if(pos[k] !== undefined) pos[k]++;
    });
    const expP = singles.length / 4;
    const x2p = ["A","B","C","D"].reduce(function(s,k){
      return s + Math.pow(pos[k] - expP, 2) / expP; }, 0);
    if(x2p > 16.27) errs.push("answer key is skewed after shuffling (chi-square " +
      x2p.toFixed(1) + "); shuffleOptions may be broken");

    const rankHist = {1:0,2:0,3:0,4:0};
    singles.forEach(function(q){
      const cl = q.options.filter(function(o){ return q.correct.indexOf(o.k) !== -1; })[0].text.length;
      rankHist[1 + q.options.filter(function(o){ return o.text.length > cl; }).length]++;
    });
    const longestPct = rankHist[1] / singles.length;
    const x2l = [1,2,3,4].reduce(function(s,r){
      return s + Math.pow(rankHist[r] - expP, 2) / expP; }, 0);
    console.log("  answer position after shuffle:", pos, " chi2=" + x2p.toFixed(2));
    console.log("  correct-answer length rank:", rankHist,
                " longest=" + (longestPct*100).toFixed(1) + "% (25% = chance), chi2=" + x2l.toFixed(2));
    if(longestPct > 0.40) errs.push("length tell: correct answer is the longest option in " +
      (longestPct*100).toFixed(0) + "% of items (25% = chance)");
    else if(x2l > 11.34) warns.push("correct-answer length rank is uneven (chi-square " +
      x2l.toFixed(1) + "); a rank-based guessing strategy may beat chance");
  }

  const line = "%cCCAR-F Trainer%c  " + BANK.length + " questions · " + NOTES.length +
               " notes · " + CARDS.length + " cards";
  console.log(line, "font-weight:bold", "font-weight:normal");
  console.log("  coverage per task statement:", perTs);
  console.log("  coverage per domain:", perDom, " mock needs:", BLUEPRINT);
  if(BANK.length) console.log("  mock draw: 200/200 filled 60 items; worst-case backfill " +
                              worstBackfill + " items");
  if(errs.length){ console.error("  " + errs.length + " ERROR(S):"); errs.forEach(function(e){ console.error("   ✗ " + e); }); }
  if(warns.length){ console.warn("  " + warns.length + " warning(s):"); warns.forEach(function(w){ console.warn("   ! " + w); }); }
  if(!errs.length && !warns.length) console.log("  %cvalidator clean", "color:#2f7d55;font-weight:bold");
  return { errors:errs, warnings:warns, perTs:perTs, perDom:perDom };
}
