"""Reassign the `scenario:` tag on bank items, keyed by question id.

Only the scenario integer changes; stems, options, answers, explanations and
refs are untouched. Refuses to run if an id is missing or ambiguous, so a typo
fails loudly rather than retagging the wrong question.

Usage: python tools/retag.py tools/patches/<retag>.json
       where the JSON is { "questionId": <scenario 1-6>, ... }
"""
import io, json, os, re, sys

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src")
FILES = [f for f in sorted(os.listdir(SRC))
         if f.startswith("2") and "bank" in f and f.endswith(".js")]


def main(patch_path):
    patch = json.load(io.open(patch_path, encoding="utf-8"))
    sources = {f: io.open(os.path.join(SRC, f), encoding="utf-8").read() for f in FILES}
    applied, failed = 0, []

    for qid, scenario in patch.items():
        if not isinstance(scenario, int) or not (0 <= scenario <= 6):
            failed.append((qid, "scenario must be an integer 0-6, got %r" % (scenario,)))
            continue
        hits = []
        for fname, src in sources.items():
            pat = re.compile(r'(\{ id:"' + re.escape(qid) + r'",[^\n]*?scenario:)(\d+)')
            found = list(pat.finditer(src))
            if len(found) == 1:
                hits.append((fname, found[0]))
            elif len(found) > 1:
                failed.append((qid, "%d matches in %s" % (len(found), fname)))
        if len(hits) != 1:
            if not any(f[0] == qid for f in failed):
                failed.append((qid, "found in %d file(s), expected 1" % len(hits)))
            continue
        fname, mo = hits[0]
        s = sources[fname]
        sources[fname] = s[:mo.start(2)] + str(scenario) + s[mo.end(2):]
        applied += 1

    if failed:
        print("REFUSING TO WRITE - %d problem(s):" % len(failed))
        for qid, why in failed:
            print("   %s : %s" % (qid, why))
        return 1

    for fname, src in sources.items():
        io.open(os.path.join(SRC, fname), "w", encoding="utf-8", newline="\n").write(src)
    print("retagged %d questions cleanly" % applied)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
