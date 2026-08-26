
function finishQuiz(){
  if(!Q) return;
  clearInterval(Q.tick);
  const dur = Date.now() - Q.started;

  /* Exam mode grades everything at the end, in one pass. */
  if(Q.mode === "exam"){
    for(let i = 0; i < Q.items.length; i++){
      const ok = isCorrect(Q.items[i], Q.picked[i]);
      Q.graded[i] = ok;
      record(Q.items[i], ok);
    }
  }

  const perDomain = {1:[0,0], 2:[0,0], 3:[0,0], 4:[0,0], 5:[0,0]};
  const perTS = {};
  let correct = 0, answered = 0;
  for(let i = 0; i < Q.items.length; i++){
    const g = Q.graded[i];
    if(g === null) continue;                    /* skipped in practice */
    answered++;
    const q = Q.items[i];
    perDomain[q.domain][1]++;
    if(!perTS[q.ts]) perTS[q.ts] = [0,0];
    perTS[q.ts][1]++;
    if(g){ correct++; perDomain[q.domain][0]++; perTS[q.ts][0]++; }
  }

  const rec = {
    date: Date.now(), mode: Q.mode, label: Q.label,
    n: answered, correct: correct, durationMs: dur,
    perDomain: perDomain, perTS: perTS
  };
  if(Q.mode === "exam"){
    rec.raw = answered ? correct / Q.items.length : 0;
    rec.scaled = scaledScore(rec.raw);
    rec.scenarios = Q.scenarios;
    rec.total = Q.items.length;
  }
  if(answered > 0){ S.sessions.push(rec); save(); }

  const done = Q;
  Q = null;
  renderResult(done, rec);
  paintReadiness();
}

/* ---- result screen ---- */
function renderResult(quiz, rec){
  const view = quiz.mode === "exam" ? el("v-exam") : el("v-practice");
  const raw = rec.n ? rec.correct / rec.n : 0;

  let head;
  if(quiz.mode === "exam"){
    const passed = rec.scaled >= 720;
    head =
      '<div class="card pad" style="text-align:center">' +
        '<div class="xs dim" style="text-transform:uppercase;letter-spacing:.07em;font-weight:640">Simulated score report</div>' +
        '<div style="font-size:46px;font-weight:700;letter-spacing:-.03em;line-height:1.1;margin:6px 0 2px" class="tnum ' +
          (passed ? "stat-good" : "stat-bad") + '">' + rec.scaled + '</div>' +
        '<div class="small muted">scaled, 100&ndash;1000 &middot; pass mark 720</div>' +
        '<div style="margin-top:12px"><span class="chip ' + (passed ? "ok" : "weak") + '">' +
          (passed ? "Pass" : "Below pass mark") + '</span></div>' +
        '<div class="small muted" style="margin-top:14px">' + rec.correct + ' of ' + rec.total +
          ' correct (' + pct(rec.raw) + ' raw) &middot; ' + fmtDur(rec.durationMs) + '</div>' +
        '<div class="callout info" style="text-align:left;margin-top:18px">' +
          '<div class="ct">On the scaled score</div>' +
          'Anthropic does not publish the raw-to-scaled conversion for CCAR-F. This app uses a plain ' +
          'linear map from 0&ndash;100% onto the 100&ndash;1000 scale, which puts 720 at about 69% raw. ' +
          'Treat it as a rough gauge; the raw percentage above and your per-task-statement mastery ' +
          'are the more meaningful numbers.' +
        '</div>' +
      '</div>';
  }else{
    head =
      '<div class="card pad" style="text-align:center">' +
        '<div style="font-size:40px;font-weight:700;letter-spacing:-.03em;line-height:1.1" class="tnum ' +
          bandClass(raw, false) + '">' + pct(raw) + '</div>' +
        '<div class="small muted" style="margin-top:2px">' + rec.correct + ' of ' + rec.n +
          ' correct &middot; ' + fmtDur(rec.durationMs) + '</div>' +
      '</div>';
  }

  /* per-domain breakdown, as the real score report gives */
  let dom = '<div class="card pad" style="margin-top:14px"><div class="sec-head"><h2>By domain</h2>' +
            '<p>The official score report gives percent-correct per domain. This mirrors it.</p></div>' +
            '<div class="tscroll"><table class="tstable"><tbody>';
  DOMAINS.forEach(function(D){
    const p = rec.perDomain[D.d];
    const s = p[1] ? p[0] / p[1] : 0;
    dom += '<tr style="cursor:default"><td><span class="tag d' + D.d + '">D' + D.d + '</span></td>' +
      '<td class="tsname">' + esc(D.name) + '</td>' +
      '<td class="barcell">' + (p[1] ? bar(s, false) : '<span class="dim xs">not sampled</span>') + '</td>' +
      '<td class="num">' + (p[1] ? p[0] + "/" + p[1] : "&ndash;") + '</td>' +
      '<td class="num"><b>' + (p[1] ? pct(s) : "&ndash;") + '</b></td></tr>';
  });
  dom += '</tbody></table></div></div>';

  /* which task statements this session moved, and where they now stand */
  let tsRows = "";
  Object.keys(rec.perTS).sort().forEach(function(ts){
    const p = rec.perTS[ts], st = tsStat(ts), t = TASK_BY_ID[ts];
    tsRows += '<tr onclick="openNote(\'' + ts + '\')"><td class="tsid">' + ts + '</td>' +
      '<td class="tsname">' + esc(t.name) + '</td>' +
      '<td class="num small muted">' + p[0] + '/' + p[1] + ' now</td>' +
      '<td class="barcell">' + bar(st.score, st.untested) + '</td>' +
      '<td class="num"><b>' + pct(st.score) + '</b></td>' +
      '<td><span class="chip ' + band(st.score, st.untested) + '">' +
        (st.mastered ? "mastered" : band(st.score, st.untested) === "near" ? "close" : "weak") + '</span></td></tr>';
  });
  const tsTable = '<div class="card pad" style="margin-top:14px"><div class="sec-head">' +
    '<h2>Task statements touched</h2><p>Updated mastery after this session. Click a row to read the notes.</p></div>' +
    '<div class="tscroll"><table class="tstable"><tbody>' + tsRows + '</tbody></table></div></div>';

  /* review every item */
  let review = '<div class="card pad" style="margin-top:14px"><div class="sec-head"><h2>Review</h2>' +
    '<p>Every item, with the reasoning. Reading the wrong-answer rationales is where most of the learning is.</p></div>';
  quiz.items.forEach(function(q, i){
    const g = quiz.graded[i];
    review += '<details style="border-bottom:1px solid var(--line);padding:9px 0">' +
      '<summary style="cursor:pointer;display:flex;gap:9px;align-items:flex-start;font-size:13.5px">' +
      '<span class="chip ' + (g === null ? "new" : g ? "ok" : "weak") + '" style="flex:none;margin-top:2px">' +
        (g === null ? "skipped" : g ? "correct" : "missed") + '</span>' +
      '<span class="tag" style="flex:none;margin-top:2px">' + q.ts + '</span>' +
      '<span>' + esc(q.stem.slice(0, 110)) + (q.stem.length > 110 ? "&hellip;" : "") + '</span></summary>' +
      '<div style="padding:11px 0 4px">' + explainHtml(q, quiz.picked[i]) + '</div></details>';
  });
  review += '</div>';

  const again = quiz.mode === "exam"
    ? '<button class="btn primary" onclick="renderExam()">Back to mock exam</button>'
    : '<button class="btn primary" onclick="renderPractice()">New practice set</button>';

  view.innerHTML = '<div class="qwrap">' + head + dom + tsTable + review +
    '<div class="row" style="margin-top:16px;justify-content:center">' + again +
    '<button class="btn" onclick="go(\'dashboard\')">Dashboard</button></div></div>';
  window.scrollTo(0,0);
}
