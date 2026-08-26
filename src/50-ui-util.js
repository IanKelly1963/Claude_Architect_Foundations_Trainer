
/* ==========================================================================
   6. Small UI helpers
   ========================================================================== */

function el(id){ return document.getElementById(id); }
function esc(s){
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
                  .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}
/* Content is authored in this file, so a light markup pass is safe:
   `code` spans and **bold** only, applied after escaping. */
function md(s){
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
}
function pct(x){ return Math.round(x * 100) + "%"; }
function band(score, untested){
  if(untested) return "new";
  if(score >= GATE) return "ok";
  if(score >= 0.6) return "near";
  return "weak";
}
function bandClass(score, untested){
  if(untested) return "";
  if(score >= GATE) return "good";
  if(score >= 0.6) return "warn";
  return "bad";
}
function bar(score, untested){
  return '<div class="bar ' + bandClass(score, untested) + '"><i style="width:' +
         (untested ? 0 : Math.round(score * 100)) + '%"></i></div>';
}
function fmtDate(t){
  const d = new Date(t);
  return d.toLocaleDateString(undefined,{month:"short",day:"numeric"}) + " " +
         d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"});
}
function fmtDur(ms){
  const s = Math.round(ms / 1000);
  const m = Math.floor(s / 60);
  return m + "m " + String(s % 60).padStart(2,"0") + "s";
}
function clock(ms){
  const s = Math.max(0, Math.round(ms / 1000));
  return String(Math.floor(s / 60)).padStart(2,"0") + ":" + String(s % 60).padStart(2,"0");
}
function refsHtml(refs){
  if(!refs || !refs.length) return "";
  return '<div class="refs dim">Source: ' + refs.map(function(r){
    return '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.label) + '</a>';
  }).join("") + "</div>";
}
function ringSvg(frac){
  const R = 58, C = 2 * Math.PI * R;
  const cls = frac >= GATE ? "var(--good)" : frac >= 0.6 ? "var(--warn)" : "var(--accent)";
  return '<svg width="132" height="132" viewBox="0 0 132 132">' +
    '<circle cx="66" cy="66" r="' + R + '" fill="none" stroke="var(--panel-3)" stroke-width="10"/>' +
    '<circle cx="66" cy="66" r="' + R + '" fill="none" stroke="' + cls + '" stroke-width="10" ' +
    'stroke-linecap="round" stroke-dasharray="' + C + '" stroke-dashoffset="' +
    (C * (1 - frac)) + '" style="transition:stroke-dashoffset .6s cubic-bezier(.3,.9,.3,1)"/></svg>';
}
