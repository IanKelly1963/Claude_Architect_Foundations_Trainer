
/* ---- Progress ---- */
function renderProgress(){
  const sess = S.sessions.slice().reverse();
  let rows = "";
  if(!sess.length){
    rows = '<tr style="cursor:default"><td colspan="6" class="dim" style="padding:22px 10px;text-align:center">' +
           'No sessions recorded yet.</td></tr>';
  }else{
    sess.forEach(function(x){
      const raw = x.n ? x.correct / x.n : 0;
      rows += '<tr style="cursor:default"><td class="dim">' + fmtDate(x.date) + '</td>' +
        '<td>' + esc(x.label || x.mode) + '</td>' +
        '<td><span class="chip ' + (x.mode === "exam" ? "near" : "new") + '">' + x.mode + '</span></td>' +
        '<td class="num tnum">' + x.correct + '/' + x.n + '</td>' +
        '<td class="num tnum ' + bandClass(raw, false) + '" style="color:var(--ink)"><b>' + pct(raw) + '</b></td>' +
        '<td class="num dim">' + fmtDur(x.durationMs) + '</td></tr>';
    });
  }

  const totalAnswered = TASKS.reduce(function(a, t){ return a + (S.tsHistory[t.ts] || []).length; }, 0);
  const seenQ = Object.keys(S.questionStats).length;

  el("v-progress").innerHTML =
    '<div class="dgrid" style="margin-top:0">' +
      statCard("Questions answered", totalAnswered, "graded attempts, all time") +
      statCard("Bank coverage", seenQ + " / " + BANK.length, "distinct questions seen") +
      statCard("Sessions", S.sessions.length, "practice and exam") +
      statCard("Mastered", readiness().mastered + " / 30", "task statements at the gate") +
    '</div>' +

    '<div class="card pad" style="margin-top:16px"><div class="sec-head"><h2>Session history</h2>' +
      '<p>Every graded session, newest first. Scores on the dashboard are recency-weighted, so recent ' +
      'sessions count for more than old ones.</p></div>' +
      '<div class="tscroll"><table class="sess"><thead><tr><th>When</th><th>Session</th><th>Mode</th>' +
      '<th class="num">Score</th><th class="num">%</th><th class="num">Time</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div>' +

    '<div class="card pad" style="margin-top:16px"><div class="sec-head"><h2>Your data</h2>' +
      '<p>Progress lives in this browser&rsquo;s local storage, which is tied to this exact file location. ' +
      'Export a backup before clearing browser data, changing machine, or moving the file.</p></div>' +
      '<div class="row">' +
        '<button class="btn primary" onclick="exportProgress()">Export progress</button>' +
        '<button class="btn" onclick="el(\'importFile\').click()">Import progress</button>' +
        '<input type="file" id="importFile" accept="application/json,.json" style="display:none" ' +
          'onchange="importProgress(this)">' +
        '<button class="btn ghost" onclick="resetProgress()" style="color:var(--bad)">Reset everything</button>' +
      '</div>' +
      '<div class="xs dim" style="margin-top:11px">Storage key <code>' + LS_KEY + '</code>' +
        (S.created ? ' &middot; tracking since ' + fmtDate(S.created) : "") + '</div>' +
    '</div>';
}

function statCard(name, val, sub){
  return '<div class="dcard"><div class="dv">' + val + '</div>' +
    '<div class="dn" style="margin-top:2px">' + name + '</div>' +
    '<div class="xs dim" style="margin-top:3px">' + sub + '</div></div>';
}

function exportProgress(){
  const blob = new Blob([JSON.stringify(S, null, 2)], { type:"application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ccarf-progress-" + new Date().toISOString().slice(0,10) + ".json";
  document.body.appendChild(a); a.click();
  S.lastExport = Date.now(); save();
  setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); renderBanner(); }, 500);
}

function importProgress(input){
  const f = input.files && input.files[0];
  if(!f) return;
  const rd = new FileReader();
  rd.onload = function(){
    try{
      const p = JSON.parse(rd.result);
      if(!p || typeof p !== "object" || !p.tsHistory) throw new Error("Not a progress file");
      if(!confirm("Replace all current progress with the contents of " + f.name + "?")) return;
      S = Object.assign(blankState(), p);
      localStorage.setItem(LS_KEY, JSON.stringify(S));
      renderAll(); paintReadiness();
      alert("Progress imported.");
    }catch(e){
      alert("Could not import that file: " + e.message);
    }
    input.value = "";
  };
  rd.readAsText(f);
}

function resetProgress(){
  if(!confirm("Delete all scores, session history and flashcard stats? This cannot be undone.\n\n" +
     "Export a backup first if you might want it back.")) return;
  if(!confirm("Really reset? Last chance.")) return;
  S = blankState();
  localStorage.removeItem(LS_KEY);
  renderAll(); paintReadiness();
}
