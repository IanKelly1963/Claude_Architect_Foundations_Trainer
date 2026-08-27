
/* ==========================================================================
   8. Views
   ========================================================================== */

function renderDashboard(){
  const r = readiness();
  const untestedCount = TASKS.filter(function(t){ return tsStat(t.ts).untested; }).length;

  let msg;
  if(untestedCount === TASKS.length){
    msg = "Nothing tested yet. A first practice set of 12 will sample broadly and give the " +
          "adaptive engine something to work with.";
  }else if(r.mastered === r.total){
    msg = "All 30 task statements are at or above the 85% gate. Sit a full mock exam to confirm " +
          "it holds under time pressure, then keep a light practice cadence so recency-weighted " +
          "scores do not drift.";
  }else{
    msg = r.mastered + " of 30 task statements are at the 85% gate" +
          (untestedCount ? ", and " + untestedCount + " are still untested" : "") +
          ". Practice sets are weighted toward whatever is furthest behind.";
  }

  let html =
    '<div class="card pad"><div class="hero">' +
      '<div class="ring">' + ringSvg(r.pct) +
        '<div class="rt"><b>' + Math.round(r.pct * 100) + '%</b><span>Ready</span></div></div>' +
      '<div class="hero-txt"><h2>' + r.mastered + ' of ' + r.total + ' task statements mastered</h2>' +
        '<p>' + msg + '</p>' +
        '<div class="hero-cta">' +
          '<button class="btn primary" onclick="quickDrill()">Drill my weakest 5</button>' +
          '<button class="btn" onclick="go(\'practice\')">Practice set</button>' +
          '<button class="btn" onclick="go(\'exam\')">Mock exam</button>' +
        '</div>' +
      '</div>' +
    '</div></div>';

  /* domain cards */
  html += '<div class="dgrid">';
  DOMAINS.forEach(function(D){
    const s = domainStat(D.d);
    html += '<div class="dcard"><div class="dh">' +
      '<span class="tag d' + D.d + '">D' + D.d + ' &middot; ' + D.weight + '%</span>' +
      '<span class="dv ' + (s.untested ? "dim" : "stat-" + (s.score >= GATE ? "good" : s.score >= .6 ? "warn" : "bad")) + '">' +
        (s.untested ? "&ndash;" : pct(s.score)) + '</span></div>' +
      '<div class="dn">' + esc(D.name) + '</div>' +
      '<div class="dm"><span>' + s.masteredCount + '/' + s.total + ' mastered</span>' +
        '<span>' + s.attempts + ' answered</span></div>' +
      bar(s.score, s.untested) + '</div>';
  });
  html += '</div>';

  /* task statement table */
  html += '<div class="card pad" style="margin-top:16px"><div class="sec-head">' +
    '<h2>Mastery by task statement</h2>' +
    '<p>The 85% gate is applied here, per task statement &mdash; not at domain level &mdash; so a weak ' +
    'topic cannot hide inside a strong domain. Mastery needs a recency-weighted score of 85%, at least ' +
    'a proportion of its attempts and distinct questions, scaled to how many questions that ' +
    'statement has (up to ' + MIN_ATTEMPTS + ' attempts across ' + MIN_DISTINCT + ' distinct). Click a row for the notes.</p></div>' +
    '<div class="tscroll"><table class="tstable"><thead><tr><th>ID</th><th>Task statement</th>' +
    '<th class="barcell">Score</th><th class="num">Seen</th><th class="num">Score</th><th>Status</th></tr></thead><tbody>';

  let lastD = 0;
  TASKS.forEach(function(t){
    const s = tsStat(t.ts);
    if(t.d !== lastD){
      lastD = t.d;
      html += '<tr style="cursor:default"><td colspan="6" style="padding-top:13px;background:none">' +
        '<span class="tag d' + t.d + '">Domain ' + t.d + '</span> ' +
        '<span class="xs dim">' + esc(DOMAIN_BY_ID[t.d].name) + '</span></td></tr>';
    }
    let statusText, statusCls = band(s.score, s.untested);
    if(s.untested) statusText = "untested";
    else if(s.mastered) statusText = "mastered";
    else if(s.blocker === "attempts") statusText = "need " + (s.needAttempts - s.attempts) + " more";
    else if(s.blocker === "distinct") statusText = "need variety";
    else statusText = statusCls === "near" ? "close" : "weak";

    html += '<tr onclick="openNote(\'' + t.ts + '\')" title="Open the notes for ' + t.ts + '">' +
      '<td class="tsid">' + t.ts + '</td>' +
      '<td class="tsname">' + esc(t.name) + '</td>' +
      '<td class="barcell">' + bar(s.score, s.untested) + '</td>' +
      '<td class="num small dim">' + (s.attempts || "&ndash;") + '</td>' +
      '<td class="num"><b>' + (s.untested ? "&ndash;" : pct(s.score)) + '</b></td>' +
      '<td><span class="chip ' + statusCls + '">' + statusText + '</span></td></tr>';
  });
  html += '</tbody></table></div></div>';
  el("v-dashboard").innerHTML = html;
}

function quickDrill(){
  const weak = weakestTs(5);
  if(!weak.length){
    go("exam");
    return;
  }
  go("practice");
  startQuiz({ mode:"practice", items: pickAdaptive(12, weak),
              label:"Weakest 5 drill (" + weak.join(", ") + ")" });
}
