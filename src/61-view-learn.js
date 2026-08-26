
/* ---- Learn ---- */
let curNote = "1.1";

function openNote(ts){ curNote = ts; go("learn"); }

function renderLearn(){
  let nav = '<div class="note-nav">';
  let lastD = 0;
  TASKS.forEach(function(t){
    if(t.d !== lastD){
      lastD = t.d;
      nav += '<span class="tag d' + t.d + '" style="align-self:center">D' + t.d + '</span>';
    }
    nav += '<button class="' + (t.ts === curNote ? "on" : "") + '" onclick="openNote(\'' + t.ts +
           '\')" title="' + esc(t.name) + '">' + t.ts + '</button>';
  });
  nav += '</div>';

  const n = NOTE_BY_TS[curNote], t = TASK_BY_ID[curNote], s = tsStat(curNote);

  if(!n){
    el("v-learn").innerHTML = nav + '<div class="card pad empty"><p>No notes written for ' +
      curNote + ' yet.</p></div>';
    return;
  }

  let body = '<div class="card pad note">' +
    '<div class="spread" style="align-items:flex-start">' +
      '<div><h3>' + esc(n.title) + '</h3>' +
      '<div class="nsub">' + curNote + ' &middot; Domain ' + t.d + ' &middot; ' +
        esc(DOMAIN_BY_ID[t.d].name) + '</div></div>' +
      '<div style="text-align:right;flex:none">' +
        '<div class="xs dim">Your score</div>' +
        '<div style="font-size:20px;font-weight:680" class="tnum ' +
          (s.untested ? "dim" : "stat-" + (s.score >= GATE ? "good" : s.score >= .6 ? "warn" : "bad")) + '">' +
          (s.untested ? "&ndash;" : pct(s.score)) + '</div>' +
      '</div>' +
    '</div>' +
    '<p class="core">' + md(n.core) + '</p>';

  body += '<h4>What the exam tests</h4><ul>';
  n.facts.forEach(function(f){ body += '<li>' + md(f) + '</li>'; });
  body += '</ul>';

  if(n.traps && n.traps.length){
    body += '<h4>Traps the exam sets</h4><ul>';
    n.traps.forEach(function(x){ body += '<li>' + md(x) + '</li>'; });
    body += '</ul>';
  }

  if(n.note){
    body += '<div class="callout warn"><div class="ct">Exam answer vs current docs</div>' + md(n.note) + '</div>';
  }

  body += refsHtml(n.refs);

  const nQ = (Q_BY_TS[curNote] || []).length;
  body += '<hr class="sep"><div class="row" style="justify-content:space-between">' +
    '<span class="xs dim">' + nQ + ' question' + (nQ === 1 ? "" : "s") + ' in the bank for this task statement</span>' +
    '<button class="btn primary sm" onclick="drillTs(\'' + curNote + '\')">Drill ' + curNote + '</button></div>';
  body += '</div>';

  /* prev / next */
  const idx = TASKS.findIndex(function(x){ return x.ts === curNote; });
  let pager = '<div class="row" style="justify-content:space-between;margin-top:14px">';
  pager += idx > 0
    ? '<button class="btn sm" onclick="openNote(\'' + TASKS[idx-1].ts + '\')">&larr; ' + TASKS[idx-1].ts + '</button>'
    : '<span></span>';
  pager += idx < TASKS.length - 1
    ? '<button class="btn sm" onclick="openNote(\'' + TASKS[idx+1].ts + '\')">' + TASKS[idx+1].ts + ' &rarr;</button>'
    : '<span></span>';
  pager += '</div>';

  el("v-learn").innerHTML = nav + body + pager;
  window.scrollTo(0,0);
}

function drillTs(ts){
  const items = pickAdaptive(8, [ts]);
  if(!items.length){ alert("No questions in the bank for " + ts + " yet."); return; }
  go("practice");
  startQuiz({ mode:"practice", items:items, label:"Drill " + ts });
}
