
/* ==========================================================================
   5b. Storage guard
   --------------------------------------------------------------------------
   Progress persistence is the whole point of this app, so it must never fail
   silently. Two real hazards when running from a local file:
     - Some browsers refuse localStorage on a file:// origin outright.
     - Where it is allowed, Chrome keys storage to the exact file URL and
       Firefox to the containing directory, so moving or renaming the file
       orphans the saved progress. A cache clear wipes it either way.
   So: probe storage for real at boot, say so plainly when it is unavailable,
   and nudge for a JSON export when a backup is overdue.
   ========================================================================== */

let STORAGE_OK = false;

function probeStorage(){
  try{
    const k = "__ccarf_probe__";
    localStorage.setItem(k, "1");
    const ok = localStorage.getItem(k) === "1";
    localStorage.removeItem(k);
    STORAGE_OK = ok;
  }catch(e){ STORAGE_OK = false; }
  return STORAGE_OK;
}

/* sessions completed since the last export; drives the backup nudge */
function exportOverdue(){
  if(!S.sessions.length) return false;
  const since = S.sessions.filter(function(x){ return x.date > (S.lastExport || 0); }).length;
  return since >= 5;
}

function renderBanner(){
  const host = el("banner");
  if(!host) return;
  if(!STORAGE_OK){
    host.innerHTML =
      '<div class="callout bad" style="margin:0 0 18px">' +
      '<div class="ct">Progress cannot be saved in this browser</div>' +
      '<p>This browser is blocking local storage for the page, so scores will be lost when you close ' +
      'the tab. Everything else works, but nothing will persist.</p>' +
      '<p style="margin-bottom:0"><b>Two fixes:</b> open the file in Chrome or Edge, which do allow ' +
      'storage for local files &mdash; or serve the folder over <code>http://localhost</code> ' +
      '(<code>python -m http.server</code> in the folder, then open ' +
      '<code>http://localhost:8000/Claude_Architect_Trainer.html</code>), which works in every browser.</p>' +
      '</div>';
    return;
  }
  if(exportOverdue()){
    const since = S.sessions.filter(function(x){ return x.date > (S.lastExport || 0); }).length;
    host.innerHTML =
      '<div class="callout warn" style="margin:0 0 18px">' +
      '<div class="ct">Backup overdue</div>' +
      '<p style="margin-bottom:8px">' + since + ' sessions since your last export. Saved progress is tied ' +
      'to this browser and this exact file location &mdash; clearing browser data, or moving the file, ' +
      'loses it. An export takes a second.</p>' +
      '<button class="btn sm primary" onclick="exportProgress()">Export backup now</button> ' +
      '<button class="btn sm ghost" onclick="dismissNudge()">Not now</button>' +
      '</div>';
    return;
  }
  host.innerHTML = "";
}

function dismissNudge(){
  S.lastExport = Date.now();   /* snooze: restarts the 5-session count */
  save(); renderBanner();
}
