
/* ==========================================================================
   9. Router, theme, keyboard
   ========================================================================== */

let view = "dashboard";
const RENDER = {
  dashboard: renderDashboard, learn: renderLearn, practice: renderPractice,
  exam: renderExam, cards: renderCards, progress: renderProgress
};

function go(v){
  if(Q && v !== view){
    const answered = Q.graded.filter(function(g){ return g !== null; }).length;
    if(!confirm("Leave the session in progress?" +
        (answered ? " Your " + answered + " graded answer" + (answered === 1 ? " is" : "s are") +
        " already saved." : ""))) return;
    clearInterval(Q.tick);
    if(Q.graded.some(function(g){ return g !== null; })) finishQuiz(); else Q = null;
  }
  view = v;
  document.querySelectorAll("nav.tabs button").forEach(function(b){
    b.setAttribute("aria-selected", String(b.dataset.v === v));
  });
  document.querySelectorAll(".view").forEach(function(s){
    s.classList.toggle("on", s.id === "v-" + v);
  });
  RENDER[v]();
  paintReadiness();
  renderBanner();
}

function renderAll(){ RENDER[view](); }

function paintReadiness(){
  const r = readiness();
  const e = el("tbReady");
  if(e){
    e.textContent = r.mastered + "/" + r.total;
    e.className = "val " + (r.pct >= 1 ? "stat-good" : r.pct >= .5 ? "stat-warn" : "");
  }
}

document.addEventListener("keydown", function(e){
  if(e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = (e.target.tagName || "").toLowerCase();
  if(tag === "input" || tag === "textarea") return;

  /* mastery-table rows open the notes on click; keyboard users need the same
     route, so Enter and Space on a focused row fire the row's own handler */
  const row = e.target.closest ? e.target.closest(".tstable tbody tr[tabindex]") : null;
  if(row && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); row.click(); return; }

  if(FC && view === "cards"){
    if(e.key === " "){ e.preventDefault(); if(!FC.shown) flipCard(); return; }
    if(FC.shown && (e.key === "1" || e.key.toLowerCase() === "n")){ gradeCard(0); return; }
    if(FC.shown && (e.key === "2" || e.key.toLowerCase() === "y")){ gradeCard(1); return; }
    return;
  }
  if(!Q) return;

  const q = Q.items[Q.i];
  const n = parseInt(e.key, 10);
  if(n >= 1 && n <= q.options.length && !Q.revealed){
    e.preventDefault(); toggleOpt(q.options[n-1].k); return;
  }
  const letter = e.key.toUpperCase();
  if(!Q.revealed && q.options.some(function(o){ return o.k === letter; })){
    e.preventDefault(); toggleOpt(letter); return;
  }
  if(e.key === "Enter"){
    e.preventDefault();
    if(Q.revealed) nextItem();
    else if(Q.mode === "exam") nextItem();
    else submitAnswer();
  }
  if(e.key === "ArrowRight" && Q.mode === "exam"){ e.preventDefault(); nextItem(); }
  if(e.key === "ArrowLeft"  && Q.mode === "exam"){ e.preventDefault(); prevItem(); }
});

window.addEventListener("beforeunload", function(e){
  if(Q && Q.graded.some(function(g){ return g === null; }) && Q.mode === "exam"){
    e.preventDefault(); e.returnValue = "";
  }
});
