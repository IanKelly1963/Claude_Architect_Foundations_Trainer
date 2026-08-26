"""Replace individual option texts in the bank source files, keyed by
"questionId|optionLetter". Only the option's text string is touched; stems,
correct keys, explanations and refs are left exactly as authored.

Refuses to run if a target is ambiguous or missing, so a typo fails loudly
rather than silently editing the wrong question.
"""
import io, json, os, re, sys

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "parts")
FILES = ["21-bank-d1a.js", "21-bank-d1b.js", "22-bank-d2.js",
         "23-bank-d3.js", "24-bank-d4.js", "25-bank-d5.js"]


def js_escape(s):
    return s.replace("\\", "\\\\").replace('"', '\\"')


def main(patch_path):
    patch = json.load(io.open(patch_path, encoding="utf-8"))
    sources = {f: io.open(os.path.join(BASE, f), encoding="utf-8").read() for f in FILES}
    applied, failed = 0, []

    for key, new_text in patch.items():
        qid, letter = key.split("|")
        hits = []
        for fname, src in sources.items():
            # locate this question's block: from its id to the next question's id
            m = re.search(r'\{\s*id:"' + re.escape(qid) + r'"', src)
            if not m:
                continue
            start = m.start()
            nxt = re.search(r'\n\{ id:"', src[start + 5:])
            end = start + 5 + nxt.start() if nxt else len(src)
            block = src[start:end]
            # the option line for this letter, inside the options array only
            opt_re = re.compile(r'(\{k:"' + letter + r'", text:")((?:[^"\\]|\\.)*)(")')
            found = list(opt_re.finditer(block))
            if len(found) == 1:
                hits.append((fname, start, end, block, found[0]))
            elif len(found) > 1:
                failed.append((key, "ambiguous: %d matches for option %s" % (len(found), letter)))

        if len(hits) != 1:
            if not any(f[0] == key for f in failed):
                failed.append((key, "found in %d files (expected 1)" % len(hits)))
            continue

        fname, start, end, block, mo = hits[0]
        new_block = block[:mo.start(2)] + js_escape(new_text) + block[mo.end(2):]
        sources[fname] = sources[fname][:start] + new_block + sources[fname][end:]
        applied += 1

    if failed:
        print("REFUSING TO WRITE - %d problem(s):" % len(failed))
        for k, why in failed:
            print("   %s : %s" % (k, why))
        return 1

    for fname, src in sources.items():
        io.open(os.path.join(BASE, fname), "w", encoding="utf-8", newline="\n").write(src)
    print("applied %d option rewrites cleanly" % applied)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1]))
