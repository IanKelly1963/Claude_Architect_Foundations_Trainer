
/* ==========================================================================
   7. Quiz runner  (shared by Practice and Mock Exam)
   --------------------------------------------------------------------------
   mode "practice": grade + explain after each item.
   mode "exam":     no feedback until submit; countdown timer; score report.
   ========================================================================== */

let Q = null;   /* active quiz, or null */

function startQuiz(opts){
  S.sessionCounter++;
  save();
  const items = opts.items.map(shuffleOptions);
  Q = {
    mode: opts.mode,
    items: items,
    scenarios: opts.scenarios || [],
    i: 0,
    picked: items.map(function(){ return []; }),
    graded: items.map(function(){ return null; }),
    revealed: false,
    started: Date.now(),
    limitMs: opts.limitMs || 0,
    tick: null,
    label: opts.label || ""
  };
  if(Q.limitMs){
    Q.tick = setInterval(function(){
      if(!Q) return;
      const left = Q.limitMs - (Date.now() - Q.started);
      const t = el("qTimer");
      if(t){
        t.textContent = clock(left);
        t.className = "timer" + (left < 10 * 60 * 1000 ? " low" : "");
      }
      if(left <= 0) finishQuiz();
    }, 1000);
  }
  renderQuiz();
}

function isCorrect(q, picked){
  if(picked.length !== q.correct.length) return false;
  for(let i = 0; i < q.correct.length; i++){
    if(picked.indexOf(q.correct[i]) === -1) return false;
  }
  return true;
}

function toggleOpt(k){
  if(!Q || Q.revealed) return;
  const q = Q.items[Q.i];
  const cur = Q.picked[Q.i];
  if(q.type === "multi"){
    const at = cur.indexOf(k);
    if(at === -1){
      if(cur.length >= q.correct.length) return;   /* cap at the stated count */
      cur.push(k);
    } else {
      cur.splice(at, 1);
    }
  }else{
    Q.picked[Q.i] = [k];
  }
  renderQuiz();
}

function submitAnswer(){
  if(!Q || Q.revealed) return;
  const q = Q.items[Q.i];
  if(!Q.picked[Q.i].length) return;
  const ok = isCorrect(q, Q.picked[Q.i]);
  Q.graded[Q.i] = ok;
  if(Q.mode === "practice"){
    record(q, ok);                 /* practice scores as you go */
    Q.revealed = true;
  }else{
    nextItem();                    /* exam defers grading to submit */
    return;
  }
  renderQuiz();
}

function nextItem(){
  if(!Q) return;
  Q.revealed = false;
  if(Q.i < Q.items.length - 1){ Q.i++; renderQuiz(); }
  else finishQuiz();
}
function prevItem(){
  if(!Q || Q.i === 0) return;
  Q.revealed = false; Q.i--; renderQuiz();
}
function gotoItem(n){ if(Q){ Q.revealed = false; Q.i = n; renderQuiz(); } }
