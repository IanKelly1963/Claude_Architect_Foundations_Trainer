
/* ---- Flashcards ----
   Self-graded, so these deliberately do NOT feed the mastery model. They are
   recall practice for the factual detail the scenario questions assume. */
let FC = null;

function renderCards(){
  if(!CARDS.length){
    el("v-cards").innerHTML = '<div class="card pad empty"><p>No flashcards yet.</p></div>';
    return;
  }
  if(!FC){
    const seen = Object.keys(S.cardStats).length;
    let opts = '<div class="row">' +
      '<button class="btn primary" onclick="startCards(0)">All ' + CARDS.length + ' cards</button>';
    DOMAINS.forEach(function(D){
      const n = CARDS.filter(function(c){ return TASK_BY_ID[c.ts] && TASK_BY_ID[c.ts].d === D.d; }).length;
      if(n) opts += '<button class="btn sm" onclick="startCards(' + D.d + ')">D' + D.d + ' &middot; ' + n + '</button>';
    });
    opts += '</div>';
    el("v-cards").innerHTML = '<div class="qwrap"><div class="card pad">' +
      '<div class="sec-head"><h2>Flashcards</h2>' +
      '<p>Rapid recall for the factual layer the scenario questions assume: flag values, file locations, ' +
      'error categories, CLI flags. These are self-graded, so they are tracked separately and ' +
      '<b>excluded from your mastery scores</b> &mdash; self-assessment is too unreliable to gate on.</p></div>' +
      opts +
      '<div class="xs dim" style="margin-top:12px">' + seen + ' of ' + CARDS.length + ' cards seen so far</div>' +
      '</div></div>';
    return;
  }
  const c = FC.items[FC.i];
  el("v-cards").innerHTML = '<div class="qwrap">' +
    '<div class="qprog"><span class="small muted tnum">Card <b>' + (FC.i + 1) + '</b> of ' + FC.items.length + '</span>' +
    '<div class="bar"><i style="width:' + Math.round((FC.i + 1) / FC.items.length * 100) + '%;background:var(--accent)"></i></div>' +
    '<button class="btn ghost sm" onclick="FC=null;renderCards()">End</button></div>' +
    '<div class="card fcard" onclick="flipCard()">' +
      '<span class="tag" style="margin-bottom:14px">' + c.ts + '</span>' +
      '<div class="ff">' + md(c.front) + '</div>' +
      (FC.shown ? '<div class="fb">' + md(c.back) + '</div>' : '') +
      '<div class="hint">' + (FC.shown ? "" : "Click, or press Space, to reveal") + '</div>' +
    '</div>' +
    (FC.shown
      ? '<div class="row" style="justify-content:center;margin-top:16px">' +
        '<button class="btn" onclick="gradeCard(0)">&#10007; Missed it</button>' +
        '<button class="btn primary" onclick="gradeCard(1)">&#10003; Got it</button></div>'
      : '<div class="row" style="justify-content:center;margin-top:16px">' +
        '<button class="btn primary" onclick="flipCard()">Reveal</button></div>') +
    '</div>';
}

function startCards(d){
  let pool = CARDS.map(function(c, i){ return Object.assign({ id:"c" + i }, c); });
  if(d) pool = pool.filter(function(c){ return TASK_BY_ID[c.ts] && TASK_BY_ID[c.ts].d === d; });
  FC = { items: shuffle(pool), i:0, shown:false, got:0 };
  renderCards();
}
function flipCard(){ if(FC){ FC.shown = true; renderCards(); } }
function gradeCard(ok){
  if(!FC) return;
  const c = FC.items[FC.i];
  const st = S.cardStats[c.id] || { seen:0, got:0, missed:0 };
  st.seen++; if(ok){ st.got++; FC.got++; } else st.missed++;
  S.cardStats[c.id] = st; save();
  if(FC.i < FC.items.length - 1){ FC.i++; FC.shown = false; renderCards(); }
  else{
    const total = FC.items.length, got = FC.got;
    FC = null;
    el("v-cards").innerHTML = '<div class="qwrap"><div class="card pad" style="text-align:center">' +
      '<div style="font-size:38px;font-weight:700;letter-spacing:-.03em" class="tnum">' +
        Math.round(got / total * 100) + '%</div>' +
      '<div class="small muted">' + got + ' of ' + total + ' recalled</div>' +
      '<div class="callout info" style="text-align:left;margin-top:16px"><div class="ct">Not scored</div>' +
      'Flashcards are self-graded, so this result is recorded but deliberately kept out of your ' +
      'mastery percentages. Use Practice for anything that should count.</div>' +
      '<div class="row" style="justify-content:center;margin-top:14px">' +
      '<button class="btn primary" onclick="renderCards()">Another set</button>' +
      '<button class="btn" onclick="go(\'dashboard\')">Dashboard</button></div></div></div>';
  }
}
