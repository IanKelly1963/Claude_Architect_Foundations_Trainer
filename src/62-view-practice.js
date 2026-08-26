
/* ---- Practice ---- */
function renderPractice(){
  if(Q && Q.mode === "practice"){ renderQuiz(); return; }
  const weak = weakestTs(5);
  const weakHtml = weak.length
    ? weak.map(function(ts){
        const s = tsStat(ts);
        return '<span class="tag" title="' + esc(TASK_BY_ID[ts].name) + '">' + ts + ' &middot; ' +
               (s.untested ? "untested" : pct(s.score)) + '</span>';
      }).join(" ")
    : '<span class="chip ok">all task statements at the gate</span>';

  let domOpts = "";
  DOMAINS.forEach(function(D){
    const s = domainStat(D.d);
    domOpts += '<button class="btn sm" onclick="drillDomain(' + D.d + ')">D' + D.d + ' &middot; ' +
      (s.untested ? "untested" : pct(s.score)) + '</button>';
  });

  el("v-practice").innerHTML =
    '<div class="qwrap">' +
    '<div class="card pad"><div class="sec-head"><h2>Adaptive practice</h2>' +
      '<p>Questions are selected by weight, not at random: task statements furthest below the 85% gate ' +
      'dominate the draw, items you have never seen are boosted, items you missed come back hard, and ' +
      'items you have answered correctly are held back on a widening interval. Every answer is graded ' +
      'and scored immediately.</p></div>' +
      '<div class="callout info"><div class="ct">Currently weakest</div>' + weakHtml + '</div>' +
      '<div class="row" style="margin-top:16px">' +
        '<button class="btn primary" onclick="startPractice(10)">10 questions</button>' +
        '<button class="btn" onclick="startPractice(20)">20 questions</button>' +
        '<button class="btn" onclick="quickDrill()">Weakest 5 only</button>' +
      '</div>' +
    '</div>' +
    '<div class="card pad" style="margin-top:14px"><div class="sec-head"><h2>Drill one domain</h2>' +
      '<p>Restrict the draw to a single domain when you want to work one area to the gate.</p></div>' +
      '<div class="row">' + domOpts + '</div>' +
    '</div></div>';
}

function startPractice(n){
  const items = pickAdaptive(n);
  if(!items.length){ alert("The question bank is empty."); return; }
  startQuiz({ mode:"practice", items:items, label:"Adaptive practice" });
}
function drillDomain(d){
  const items = pickAdaptive(12, TS_IN_DOMAIN[d]);
  if(!items.length){ alert("No questions for domain " + d + " yet."); return; }
  go("practice");
  startQuiz({ mode:"practice", items:items, label:"Domain " + d + " drill" });
}

/* ---- Mock exam ---- */
function renderExam(){
  if(Q && Q.mode === "exam"){ renderQuiz(); return; }
  const past = S.sessions.filter(function(x){ return x.mode === "exam"; });
  let hist = "";
  if(past.length){
    hist = '<div class="card pad" style="margin-top:14px"><div class="sec-head"><h2>Previous sittings</h2></div>' +
      '<div class="tscroll"><table class="sess"><thead><tr><th>Date</th><th class="num">Raw</th><th class="num">Scaled</th>' +
      '<th>Result</th><th class="num">Time</th></tr></thead><tbody>';
    past.slice().reverse().forEach(function(x){
      hist += '<tr><td>' + fmtDate(x.date) + '</td>' +
        '<td class="num tnum">' + pct(x.raw) + '</td>' +
        '<td class="num tnum"><b>' + x.scaled + '</b></td>' +
        '<td><span class="chip ' + (x.scaled >= 720 ? "ok" : "weak") + '">' +
          (x.scaled >= 720 ? "pass" : "below") + '</span></td>' +
        '<td class="num dim">' + fmtDur(x.durationMs) + '</td></tr>';
    });
    hist += '</tbody></table></div></div>';
  }

  el("v-exam").innerHTML =
    '<div class="qwrap"><div class="card pad"><div class="sec-head"><h2>Mock exam</h2>' +
      '<p>Mirrors the real sitting: 60 items in 120 minutes, drawn from 4 of the 6 scenarios picked at ' +
      'random, with items distributed by the published blueprint weights. No feedback until you submit. ' +
      'You can move backwards and change answers before submitting, as in the real exam.</p></div>' +
      '<div class="tscroll"><table class="tstable" style="margin:6px 0 4px"><tbody>' +
        DOMAINS.map(function(D){
          return '<tr style="cursor:default"><td><span class="tag d' + D.d + '">D' + D.d + '</span></td>' +
            '<td class="tsname">' + esc(D.name) + '</td>' +
            '<td class="num dim">' + D.weight + '%</td>' +
            '<td class="num"><b>' + D.exam + ' items</b></td></tr>';
        }).join("") +
      '</tbody></table></div>' +
      '<div class="callout warn"><div class="ct">Before you start</div>Set aside the full two hours. ' +
      'Every answer is recorded against your mastery scores exactly as practice answers are, so an ' +
      'abandoned exam still counts for whatever you completed.</div>' +
      '<div class="row" style="margin-top:14px">' +
        '<button class="btn primary" onclick="startExam()">Start 60-item mock exam</button>' +
        '<button class="btn" onclick="startExam(true)">Short form (20 items, 40 min)</button>' +
      '</div>' +
    '</div>' + hist + '</div>';
}

function startExam(short){
  const draw = drawMock();
  let items = draw.questions, limit = 120 * 60 * 1000;
  if(short){ items = items.slice(0, 20); limit = 40 * 60 * 1000; }
  if(!items.length){ alert("The question bank is empty."); return; }
  startQuiz({ mode:"exam", items:items, scenarios:draw.scenarios, limitMs:limit,
              label: short ? "Short mock" : "Full mock exam" });
}
