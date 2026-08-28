
/* ==========================================================================
   1. Derived indexes
   ========================================================================== */

const BANK = [].concat(BANK_D1, BANK_D2, BANK_D3, BANK_D4, BANK_D5);
const TASK_BY_ID  = {}; TASKS.forEach(function(t){ TASK_BY_ID[t.ts] = t; });
const TS_IN_DOMAIN = {1:[],2:[],3:[],4:[],5:[]};
TASKS.forEach(function(t){ TS_IN_DOMAIN[t.d].push(t.ts); });
const DOMAIN_BY_ID = {}; DOMAINS.forEach(function(x){ DOMAIN_BY_ID[x.d] = x; });
const NOTE_BY_TS = {}; NOTES.forEach(function(n){ NOTE_BY_TS[n.ts] = n; });
const Q_BY_TS = {}; TASKS.forEach(function(t){ Q_BY_TS[t.ts] = []; });
BANK.forEach(function(q){ if(Q_BY_TS[q.ts]) Q_BY_TS[q.ts].push(q); });

/* ==========================================================================
   2. Persistence
   --------------------------------------------------------------------------
   One localStorage key holds everything. Export/import round-trips the exact
   same object so progress survives a cache clear or a move between machines.
   ========================================================================== */

const LS_KEY = "ccarf.trainer.v1";

function blankState(){
  return {
    version: 1,
    created: Date.now(),
    sessionCounter: 0,
    questionStats: {},   /* qid -> {seen, correct, consec, last, lastSession} */
    tsHistory: {},       /* ts  -> [{c:1|0, q:qid, t:epoch}]  (capped)        */
    sessions: [],        /* one record per completed testing session          */
    cardStats: {},       /* cardId -> {seen, got, missed}  (excluded from score) */
    prefs: {}
  };
}

let S = blankState();

function load(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      if(parsed && typeof parsed === "object") S = Object.assign(blankState(), parsed);
    }
  }catch(e){ console.warn("Could not read saved progress; starting fresh.", e); }
}

let saveTimer = null;
function save(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(function(){
    try{ localStorage.setItem(LS_KEY, JSON.stringify(S)); }
    catch(e){ console.warn("Could not save progress.", e); }
  }, 120);
}

/* ==========================================================================
   3. Mastery model
   --------------------------------------------------------------------------
   Lifetime percent-correct is a poor readiness signal: early mistakes drag it
   down forever, and re-seeing a memorised item inflates it. So each task
   statement is scored on a RECENCY-WEIGHTED window of its last 12 attempts,
   and mastery additionally requires a minimum number of attempts spread over
   a minimum number of DISTINCT questions. That distinct-question floor is
   what stops a lucky streak on one remembered item awarding a green light.
   ========================================================================== */

function weighted(hist, windowSize){
  const h = hist.slice(-windowSize);
  if(!h.length) return 0;
  let num = 0, den = 0;
  for(let i = 0; i < h.length; i++){
    const age = h.length - 1 - i;            /* 0 = most recent */
    const w = Math.pow(DECAY, age);
    num += w * (h[i].c ? 1 : 0);
    den += w;
  }
  return num / den;
}

/* Mastery thresholds scale with the pool actually available for a task
   statement, rather than being fixed. A flat "8 distinct questions" would be
   two thirds of a 6-item pool but only a fifth of a 20-item one, and it would
   make mastery unreachable for any statement not yet expanded. Scaling keeps
   the guarantee proportionate at any bank size, with MIN_* as the ceilings. */
function gateFor(ts){
  const pool = (Q_BY_TS[ts] || []).length;
  const clamp = function(v, lo, hi){ return Math.max(lo, Math.min(hi, v)); };
  return {
    attempts: pool ? clamp(Math.ceil(pool * 0.5), 6, MIN_ATTEMPTS) : MIN_ATTEMPTS,
    distinct: pool ? clamp(Math.ceil(pool * 0.4), 4, MIN_DISTINCT) : MIN_DISTINCT,
    pool: pool
  };
}

function tsStat(ts){
  const all = S.tsHistory[ts] || [];
  const distinct = new Set(all.map(function(x){ return x.q; })).size;
  const score = weighted(all, WINDOW_TS);
  const gate = gateFor(ts);
  return {
    ts: ts,
    score: score,
    attempts: all.length,
    distinct: distinct,
    untested: all.length === 0,
    needAttempts: gate.attempts,
    needDistinct: gate.distinct,
    mastered: score >= GATE && all.length >= gate.attempts && distinct >= gate.distinct,
    /* why mastery is being withheld, for honest UI copy */
    blocker: all.length === 0 ? "untested"
           : score < GATE ? "score"
           : all.length < gate.attempts ? "attempts"
           : distinct < gate.distinct ? "distinct" : null
  };
}

function domainStat(d){
  const tss = TS_IN_DOMAIN[d];
  let all = [];
  tss.forEach(function(ts){ all = all.concat(S.tsHistory[ts] || []); });
  all.sort(function(a,b){ return a.t - b.t; });
  const stats = tss.map(tsStat);
  return {
    d: d,
    score: weighted(all, WINDOW_D),
    attempts: all.length,
    untested: all.length === 0,
    masteredCount: stats.filter(function(s){ return s.mastered; }).length,
    total: tss.length,
    mastered: stats.every(function(s){ return s.mastered; })
  };
}

function readiness(){
  const m = TASKS.filter(function(t){ return tsStat(t.ts).mastered; }).length;
  return { mastered:m, total:TASKS.length, pct:m / TASKS.length };
}

/* Record one graded answer. This is the single write path for scored data. */
function record(q, wasCorrect){
  if(!S.tsHistory[q.ts]) S.tsHistory[q.ts] = [];
  S.tsHistory[q.ts].push({ c: wasCorrect ? 1 : 0, q: q.id, t: Date.now() });
  if(S.tsHistory[q.ts].length > 40) S.tsHistory[q.ts] = S.tsHistory[q.ts].slice(-40);

  const st = S.questionStats[q.id] || { seen:0, correct:0, consec:0, last:null, lastSession:0 };
  st.seen++;
  if(wasCorrect){ st.correct++; st.consec++; } else { st.consec = 0; }
  st.last = wasCorrect ? 1 : 0;
  st.lastSession = S.sessionCounter;
  S.questionStats[q.id] = st;
  save();
}
