
/* ---- explanation block, reused by practice feedback and the review list ---- */
function explainHtml(q, picked){
  picked = picked || [];
  let opts = '<div class="opts" style="margin-bottom:14px">';
  q.options.forEach(function(o){
    const isRight = q.correct.indexOf(o.k) !== -1;
    const chose = picked.indexOf(o.k) !== -1;
    let cls = "opt locked";
    if(isRight && chose) cls += " right";
    else if(isRight) cls += " missed";
    else if(chose) cls += " wrong";
    opts += '<div class="' + cls + '"><span class="k">' + o.k + '</span><span>' + md(o.text) +
      (isRight ? ' <b class="stat-good xs" style="white-space:nowrap">&#10003; correct</b>' : "") +
      (chose && !isRight ? ' <b class="stat-bad xs" style="white-space:nowrap">&#10007; your answer</b>' : "") +
      '</span></div>';
  });
  opts += '</div>';

  let d = "";
  const keys = Object.keys(q.explain.distractors || {});
  if(keys.length){
    d = '<h4>Why the others fail</h4><ul>';
    keys.sort().forEach(function(k){
      d += '<li><b>' + k + '.</b> ' + md(q.explain.distractors[k]) + '</li>';
    });
    d += '</ul>';
  }

  const note = q.note ? '<div class="callout warn" style="margin:12px 0 0"><div class="ct">Exam answer vs current docs</div>' +
    md(q.note) + '</div>' : "";

  return opts + '<div class="expl"><h4>Why ' + q.correct.join(" + ") + '</h4>' +
    '<div class="why">' + md(q.explain.why) + '</div>' + d + note + refsHtml(q.refs) + '</div>';
}

/* ---- the live question screen ---- */
function renderQuiz(){
  if(!Q) return;
  const view = Q.mode === "exam" ? el("v-exam") : el("v-practice");
  const q = Q.items[Q.i];
  const picked = Q.picked[Q.i];
  const t = TASK_BY_ID[q.ts];
  const prog = (Q.i + 1) / Q.items.length;

  let top = '<div class="qprog">' +
    '<span class="small muted tnum" style="white-space:nowrap">Question <b>' + (Q.i + 1) +
      '</b> of ' + Q.items.length + '</span>' +
    '<div class="bar"><i style="width:' + Math.round(prog * 100) + '%;background:var(--accent)"></i></div>';
  if(Q.limitMs) top += '<span class="timer" id="qTimer">' + clock(Q.limitMs - (Date.now() - Q.started)) + '</span>';
  top += '<button class="btn ghost sm" onclick="abandonQuiz()">End</button></div>';

  /* scenario framing, exactly as the exam presents it */
  let scen = "";
  if(q.scenario){
    const sc = SCENARIOS[q.scenario];
    scen = '<div class="scenario"><b>Scenario ' + q.scenario + ' &middot; ' + esc(sc.t) + '</b>' + esc(sc.b) + '</div>';
  }

  const meta = '<div class="qmeta"><span class="tag d' + q.domain + '">Domain ' + q.domain + '</span>' +
    '<span class="tag">' + q.ts + '</span>' +
    '<span class="xs dim">' + esc(t.name) + '</span>' +
    (q.type === "multi" ? '<span class="chip near">Select ' + q.correct.length + '</span>' : "") + '</div>';

  let body;
  if(Q.revealed){
    const ok = Q.graded[Q.i];
    body = '<div class="verdict ' + (ok ? "right" : "wrong") + '">' +
      (ok ? "&#10003; Correct" : "&#10007; Not quite") + '</div>' + explainHtml(q, picked);
  }else{
    body = '<div class="opts">';
    q.options.forEach(function(o){
      const sel = picked.indexOf(o.k) !== -1;
      body += '<button class="opt' + (sel ? " sel" : "") + '" onclick="toggleOpt(\'' + o.k + '\')">' +
        '<span class="k">' + o.k + '</span><span>' + md(o.text) + '</span></button>';
    });
    body += '</div>';
  }

  /* controls */
  let ctrl = '<div class="row" style="justify-content:space-between">';
  if(Q.mode === "exam"){
    ctrl += '<button class="btn" onclick="prevItem()"' + (Q.i === 0 ? " disabled" : "") + '>&larr; Back</button>' +
      '<span class="xs dim">' + Q.picked.filter(function(p){ return p.length; }).length +
        ' of ' + Q.items.length + ' answered</span>' +
      (Q.i === Q.items.length - 1
        ? '<button class="btn primary" onclick="finishQuiz()">Submit exam</button>'
        : '<button class="btn primary" onclick="nextItem()">Next &rarr;</button>');
  }else if(Q.revealed){
    ctrl += '<span></span><button class="btn primary" onclick="nextItem()">' +
      (Q.i === Q.items.length - 1 ? "See results" : "Next question &rarr;") + '</button>';
  }else{
    ctrl += '<span class="xs dim">Keys <kbd>1</kbd>&ndash;<kbd>4</kbd> to choose, <kbd>Enter</kbd> to submit</span>' +
      '<button class="btn primary" onclick="submitAnswer()"' + (picked.length ? "" : " disabled") + '>Submit</button>';
  }
  ctrl += '</div>';

  view.innerHTML = '<div class="qwrap">' + top + scen + meta +
    '<div class="stem">' + md(q.stem) + '</div>' + body + ctrl + '</div>';
}

function abandonQuiz(){
  if(!Q) return;
  const n = Q.graded.filter(function(g){ return g !== null; }).length;
  if(n && !confirm("End this session? Your " + n + " graded answer" + (n === 1 ? "" : "s") +
     " are already saved.")) return;
  if(!n && !confirm("End this session without answering anything?")) return;
  finishQuiz();
}
