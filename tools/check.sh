#!/usr/bin/env bash
# Verify the built file: JS syntax, then the test-construction bias analyses.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/Claude_Architect_Trainer.html"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

sed -n '/^<script>$/,/^<\/script>$/p' "$OUT" | sed '1d;$d' > "$TMP/app.js"
node --check "$TMP/app.js" && echo "JS syntax OK ($(wc -l < "$TMP/app.js") lines)"

# the bank references R_* citation constants declared earlier in the file,
# so they must come along or the extracted module will not evaluate
grep -E '^const R_[A-Z0-9_]+ *= *\{' "$OUT" > "$TMP/bank.js"
awk '/^const BANK_ALL = \[$/,/^\];$/' "$OUT" >> "$TMP/bank.js"
echo "module.exports = BANK_ALL;" >> "$TMP/bank.js"
cp "$ROOT/tools/analyse.js" "$ROOT/tools/analyse-presented.js" "$TMP/"
( cd "$TMP" && node analyse.js && node analyse-presented.js )

# distractor quality guard - exits non-zero on any exploitable defect
node "$ROOT/tools/distractors.js" "$OUT"
node "$ROOT/tools/contrast.js" "$OUT"
