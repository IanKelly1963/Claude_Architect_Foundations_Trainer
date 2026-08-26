
/* ==========================================================================
   11. Boot
   ========================================================================== */

probeStorage();
load();
applyTheme();

document.getElementById("tabs").addEventListener("click", function(e){
  const b = e.target.closest("button[data-v]");
  if(b) go(b.dataset.v);
});
document.getElementById("btnTheme").addEventListener("click", cycleTheme);

/* open on the first unmastered task statement's notes, so Learn is useful
   the moment you switch to it */
const firstWeak = weakestTs(1);
if(firstWeak.length) curNote = firstWeak[0];

go("dashboard");
renderBanner();
window.VALIDATION = validateBank();

/* exposed for console-driven checks */
window.CCARF = {
  state: function(){ return S; },
  bank: BANK, notes: NOTES, cards: CARDS,
  tsStat: tsStat, domainStat: domainStat, readiness: readiness,
  drawMock: drawMock, validate: validateBank
};
