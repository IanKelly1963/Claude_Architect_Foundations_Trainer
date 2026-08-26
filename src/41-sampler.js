
/* ==========================================================================
   4. Selection
   ========================================================================== */

function shuffle(a){
  const r = a.slice();
  for(let i = r.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    const t = r[i]; r[i] = r[j]; r[j] = t;
  }
  return r;
}

/* Draw n items from pool using the supplied weights, without replacement. */
function weightedSample(pool, weights, n){
  const items = pool.slice(), w = weights.slice(), out = [];
  n = Math.min(n, items.length);
  for(let k = 0; k < n; k++){
    let total = 0;
    for(let i = 0; i < w.length; i++) total += w[i];
    let pick = w.length - 1;
    if(total > 0){
      let r = Math.random() * total, acc = 0;
      for(let i = 0; i < w.length; i++){
        acc += w[i];
        if(r <= acc){ pick = i; break; }
      }
    }else{
      pick = Math.floor(Math.random() * items.length);
    }
    out.push(items[pick]);
    items.splice(pick, 1);
    w.splice(pick, 1);
  }
  return out;
}

/* Weight favours weak task statements, unseen questions, and previously
   missed questions; a spaced-repetition gate suppresses items answered
   correctly in the recent past so they resurface on a widening interval. */
function adaptiveWeight(q, tsScores){
  const st = tsScores[q.ts];
  let w;
  if(st.untested){
    w = 3.4;                                       /* never tested: top priority */
  }else{
    w = 0.2 + 3 * Math.pow(1 - st.score, 2);       /* weak topics dominate */
  }
  const qs = S.questionStats[q.id];
  if(!qs){
    w *= 2.0;                                      /* never seen this item */
  }else{
    w *= (qs.last === 0) ? 2.5 : 0.25;             /* missed items come back hard */
    const gap = S.sessionCounter - (qs.lastSession || 0);
    const needed = Math.pow(2, Math.min(qs.consec || 0, 4));
    if(gap < needed) w *= 0.05;                    /* spaced-repetition hold */
  }
  return Math.max(w, 0.001);
}

function pickAdaptive(n, restrictTs){
  const tsScores = {};
  TASKS.forEach(function(t){ tsScores[t.ts] = tsStat(t.ts); });
  let pool = BANK;
  if(restrictTs && restrictTs.length) {
    pool = BANK.filter(function(q){ return restrictTs.indexOf(q.ts) !== -1; });
  }
  if(!pool.length) return [];
  const weights = pool.map(function(q){ return adaptiveWeight(q, tsScores); });
  return weightedSample(pool, weights, n);
}

/* The five task statements furthest from the gate, untested ones first. */
function weakestTs(n){
  return TASKS.map(function(t){ return tsStat(t.ts); })
    .filter(function(s){ return !s.mastered; })
    .sort(function(a,b){
      if(a.untested !== b.untested) return a.untested ? -1 : 1;
      return a.score - b.score;
    })
    .slice(0, n)
    .map(function(s){ return s.ts; });
}

/* ==========================================================================
   5. Mock exam construction
   --------------------------------------------------------------------------
   The real sitting draws 4 scenarios from the bank of 6, then presents 60
   items. The bank here is coverage-balanced (6-7 per task statement) so that
   Learn and Practice cover every objective evenly; blueprint weighting is
   applied HERE, at draw time, so the mock mirrors the real item distribution.
   ========================================================================== */

function drawMock(){
  const scenarios = shuffle([1,2,3,4,5,6]).slice(0,4);
  const picked = [];
  let backfilled = 0;
  for(let d = 1; d <= 5; d++){
    const need = BLUEPRINT[d];
    const scoped = BANK.filter(function(q){
      return q.domain === d && (q.scenario === 0 || scenarios.indexOf(q.scenario) !== -1);
    });
    let chosen = shuffle(scoped).slice(0, need);
    if(chosen.length < need){
      const have = {}; chosen.forEach(function(q){ have[q.id] = 1; });
      const rest = shuffle(BANK.filter(function(q){ return q.domain === d && !have[q.id]; }));
      const short = need - chosen.length;
      backfilled += short;
      chosen = chosen.concat(rest.slice(0, short));
    }
    picked.push.apply(picked, chosen);
  }
  return { scenarios: scenarios, questions: shuffle(picked), backfilled: backfilled };
}

/* Anthropic does not publish the raw-to-scaled conversion. This is a plain
   linear map from 0-100% onto the 100-1000 reporting scale, which places the
   720 pass mark at ~68.9% raw. The UI labels it as an approximation. */
function scaledScore(raw){ return Math.round(100 + raw * 900); }
