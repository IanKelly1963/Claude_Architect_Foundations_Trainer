#!/usr/bin/env bash
# Concatenate src/ into the single-file deliverable.
# Numeric filename prefixes define the order.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/Claude_Architect_Trainer.html"
: > "$OUT"
for f in $(ls -1 "$ROOT/src" | LC_ALL=C sort); do cat "$ROOT/src/$f" >> "$OUT"; done
echo "built: $(wc -c < "$OUT") bytes, $(wc -l < "$OUT") lines -> $OUT"
