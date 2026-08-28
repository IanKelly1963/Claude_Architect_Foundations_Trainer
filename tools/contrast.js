/* ============================================================================
   Contrast guard for the dark theme.

   The trainer is a single-file app that cannot be screenshotted from the build
   environment, so "the dark mode is high contrast" has to be a measured
   property rather than a claim. This reads the palette out of the built HTML
   and checks every foreground/background pair the stylesheet actually puts on
   screen against WCAG 2.1 contrast ratios.

   WHAT THIS GATES ON, AND WHY

     text pairs  -> AA 4.5:1 required, AAA 7:1 reported
     UI pairs    -> 3:1 required (SC 1.4.11 non-text contrast: control
                    boundaries, focus rings, progress fills, status borders)

   Large text is allowed 3:1 by the standard, but nothing here is gated at that
   relaxed level: the one large-text pair in the app (the readiness ring figure)
   uses --ink, which clears 7:1 anyway, so applying the strict threshold
   everywhere costs nothing and removes a judgement call from the gate.

   The pair list is maintained by hand against 01-head.html. That is deliberate
   — inferring pairs from CSS would need a cascade resolver, and a wrong pair
   list that looks automatic is worse than a short one that is true. When a rule
   introduces a new colour combination, add it here.

   Usage: node contrast.js <path-to-built-html>
   ============================================================================ */

const fs = require("fs");

const htmlPath = process.argv[2] || "Claude_Architect_Trainer.html";
const src = fs.readFileSync(htmlPath, "utf8");

/* ------------------------------------------------ palette from the built file */
const rootBlock = src.match(/:root\{([\s\S]*?)\n\}/);
if (!rootBlock) { console.error("contrast: could not find :root block"); process.exit(1); }
const PAL = {};
rootBlock[1].replace(/--([a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{6})/g, (_, k, v) => { PAL[k] = v; });

/* A second palette block would mean a light theme crept back in, which this
   tool cannot reason about — every pair below assumes one resolved palette. */
const rootCount = (src.match(/:root(?:\[|\s|\{|:not)/g) || []).length;
if (rootCount > 1 || /prefers-color-scheme/.test(src)) {
  console.error("contrast: more than one palette in scope; pair checks assume a single theme");
  process.exit(1);
}

/* ------------------------------------------------------------ WCAG maths */
const srgb = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
function lum(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * srgb((n >> 16) & 255) + 0.7152 * srgb((n >> 8) & 255) + 0.0722 * srgb(n & 255);
}
function ratio(a, b) {
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/* -------------------------------------------------------------- pair list
   [foreground, background, kind, where it appears]                        */
const PAIRS = [
  /* body and page ground */
  ["ink",   "bg",      "text", "body copy on the page ground"],
  ["ink-2", "bg",      "text", ".muted, .sec-head p, tab labels"],
  ["ink-3", "bg",      "text", ".empty state, .brand subtitle, topbar labels"],
  ["warn",  "panel",   "text", ".stat-warn readiness figure"],
  ["accent","bg",      "text", "links outside cards"],

  /* cards */
  ["ink",   "panel",   "text", "headings and body inside .card / .dcard"],
  ["ink-2", "panel",   "text", ".muted inside cards, .opt .k letter"],
  ["ink-3", "panel",   "text", ".dim, table headers, .tsid, .dcard .dm"],
  ["accent","panel",   "text", "links inside .expl and .note"],

  /* inset surfaces */
  ["ink",   "panel-2", "text", ".expl body, .scenario b, .readypill value"],
  ["ink-2", "panel-2", "text", ".expl li, .scenario body, .callout base"],
  ["ink-3", "panel-2", "text", ".expl h4, .readypill label"],

  /* raised surfaces */
  ["ink",   "panel-3", "text", "code and kbd spans"],
  ["ink-2", "panel-3", "text", ".tag base, .tag.d5"],
  ["ink-3", "panel-3", "text", ".chip.new (deliberately de-emphasised)"],
  ["ink-2", "panel-3", "text", ".timer countdown"],

  /* status text on its own tint */
  ["good",  "good-bg", "text", ".chip.ok, .callout.good .ct, .tag.d2"],
  ["warn",  "warn-bg", "text", ".chip.near, .callout.warn .ct, .tag.d3"],
  ["bad",   "bad-bg",  "text", ".chip.weak, .callout.bad .ct, .tag.d4, .timer.low"],
  ["info",  "info-bg", "text", ".tag.d1, .callout.info .ct"],

  /* status text directly on a panel */
  ["good",  "panel",   "text", ".verdict.right, .stat-good"],
  ["bad",   "panel",   "text", ".verdict.wrong, .stat-bad"],
  ["info",  "panel-2", "text", ".scenario b label"],

  /* text sitting on a solid fill */
  ["accent-ink", "accent", "text", ".btn.primary, .opt.sel .k, .note-nav button.on"],
  ["good-ink",   "good",   "text", ".opt.right .k badge"],
  ["bad-ink",    "bad",    "text", ".opt.wrong .k badge"],

  /* answer review: option text keeps the panel ink over a status tint */
  ["ink",   "good-bg", "text", ".opt.right body text"],
  ["ink",   "bad-bg",  "text", ".opt.wrong body text"],

  /* non-text: control boundaries, rings, fills (SC 1.4.11) */
  ["line-2", "panel",  "ui", ".opt and .btn borders - the control boundary"],
  ["line-2", "bg",     "ui", ".ring gauge track"],
  ["accent", "panel",  "ui", ".opt.sel / .opt:hover border, tab underline"],
  ["focus",  "panel",  "ui", "focus ring on cards and options"],
  ["focus",  "bg",     "ui", "focus ring on the page ground"],
  ["good",   "panel-3","ui", ".bar.good fill against its track"],
  ["warn",   "panel-3","ui", ".bar.warn fill against its track"],
  ["bad",    "panel-3","ui", ".bar.bad fill against its track"],
  ["ink-3",  "panel-3","ui", ".bar default fill against its track"],
  ["good-line", "good-bg", "ui", ".callout.good / .chip.ok border"],
  ["warn-line", "warn-bg", "ui", ".callout.warn / .chip.near border"],
  ["bad-line",  "bad-bg",  "ui", ".callout.bad / .chip.weak border"],
  ["info-line", "info-bg", "ui", ".callout.info / .tag.d1 border"]
];

/* --focus is checked against --panel and --bg but deliberately NOT against
   --accent. The ring is drawn with outline-offset, so it never touches the
   button it belongs to: both its inner and outer neighbours are the surface
   behind the control. That is only true while the offset is actually present,
   so it is asserted below rather than assumed. */

const MIN = { text: 4.5, ui: 3.0 };
const AAA = 7.0;

console.log("=".repeat(76));
console.log("CONTRAST GUARD  ·  dark theme  ·  " + Object.keys(PAL).length + " palette tokens");
console.log("=".repeat(76));

const fails = [];
let aaa = 0, textPairs = 0;

["text", "ui"].forEach(kind => {
  console.log("\n" + (kind === "text" ? "TEXT PAIRS   require AA 4.5:1   (AAA 7:1 marked *)"
                                      : "NON-TEXT PAIRS   require 3:1   (SC 1.4.11)"));
  PAIRS.filter(p => p[2] === kind).forEach(([fg, bg, k, where]) => {
    if (!PAL[fg] || !PAL[bg]) {
      fails.push("unknown token in pair " + fg + "/" + bg);
      console.log("   " + (fg + " on " + bg).padEnd(24) + "  MISSING TOKEN");
      return;
    }
    const r = ratio(PAL[fg], PAL[bg]);
    const ok = r >= MIN[k];
    if (k === "text") { textPairs++; if (r >= AAA) aaa++; }
    const mark = !ok ? "  FAIL" : (k === "text" && r >= AAA ? "  *" : "");
    console.log("   " + (fg + " on " + bg).padEnd(24) + r.toFixed(2).padStart(6) + ":1" +
                mark.padEnd(7) + "  " + where);
    if (!ok) fails.push(fg + " on " + bg + " is " + r.toFixed(2) + ":1, below " + MIN[k] + ":1  (" + where + ")");
  });
});

console.log("\n" + "-".repeat(76));
console.log("text pairs at AAA (7:1 or better): " + aaa + " of " + textPairs);

/* ------------------------------------------------- structural assertions */
console.log("\nSTRUCTURE");
const checks = [
  [/:focus-visible\{[^}]*outline:[^}]*\}/.test(src),
   "a :focus-visible outline is defined"],
  [/:focus-visible\{[^}]*outline-offset:\s*[1-9]/.test(src),
   "the focus ring is offset, so it sits on the surface behind the control"],
  [/html\{[^}]*color-scheme:\s*dark/.test(src),
   "color-scheme:dark is set, so native scrollbars and controls render dark"],
  [!/color:\s*#fff/i.test(src.slice(src.indexOf("<style>"), src.indexOf("</style>"))),
   "no hard-coded white text survives in the stylesheet"]
];
checks.forEach(([ok, what]) => {
  console.log("   " + (ok ? "ok  " : "FAIL") + "  " + what);
  if (!ok) fails.push("structure: " + what);
});

console.log("=".repeat(76));
if (fails.length) {
  console.log("FAILURES (" + fails.length + "):");
  fails.forEach(f => console.log("   x " + f));
  console.log("\nCONTRAST GUARD: FAIL");
  process.exit(1);
}
console.log("CONTRAST GUARD: PASS");
