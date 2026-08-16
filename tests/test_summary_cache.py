#!/usr/bin/env python3
"""Tests for the summary cache in scripts/infer_skills.py.

The contract: an unchanged repo must not trigger a model call, so the weekly
sync job leaves data/site.js byte-identical and commits nothing.

Run from the repo root:
    python tests/test_summary_cache.py
"""

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from infer_skills import context_fingerprint  # noqa: E402

failures = []


def check(name, condition):
    if condition:
        print(f"  ok   {name}")
    else:
        print(f"  FAIL {name}")
        failures.append(name)


CTX = {
    "languages": ["Python", "Jupyter Notebook"],
    "readme": "# Project\n\nDoes a thing.",
    "dependencies": {
        "requirements.txt": "pandas\nnumpy\n",
        "detected_imports": "numpy, pandas",
    },
}


def decide(stored, fingerprint, has_existing_text, force=False):
    """Mirrors the branch in infer_skills.main(). Returns True to regenerate."""
    if force:
        return True
    if stored is None:
        return not has_existing_text
    return stored != fingerprint


print("context_fingerprint")
check("is stable across calls", context_fingerprint(CTX) == context_fingerprint(CTX))

reordered = dict(CTX, languages=list(reversed(CTX["languages"])))
check("ignores language ordering", context_fingerprint(reordered) == context_fingerprint(CTX))

reordered_deps = dict(CTX, dependencies=dict(reversed(list(CTX["dependencies"].items()))))
check("ignores dependency key ordering", context_fingerprint(reordered_deps) == context_fingerprint(CTX))

check(
    "changes when the README changes",
    context_fingerprint(dict(CTX, readme="# Project\n\nDoes a different thing.")) != context_fingerprint(CTX),
)
check(
    "changes when a dependency changes",
    context_fingerprint(dict(CTX, dependencies={"requirements.txt": "pandas\nnumpy\nscipy\n"}))
    != context_fingerprint(CTX),
)
check(
    "changes when a language is added",
    context_fingerprint(dict(CTX, languages=CTX["languages"] + ["TypeScript"])) != context_fingerprint(CTX),
)
check("handles a repo-less project", isinstance(context_fingerprint(None), str))
check(
    "treats no-repo and empty-repo alike",
    context_fingerprint(None)
    == context_fingerprint({"languages": [], "readme": "", "dependencies": {}}),
)

print("\nregeneration decision")
fp = context_fingerprint(CTX)
check("skips when the fingerprint matches", decide(fp, fp, True) is False)
check("regenerates when the fingerprint differs", decide("stale-hash", fp, True) is True)
check("seeds without rewriting when text already exists", decide(None, fp, True) is False)
check("generates when there is no text yet", decide(None, fp, False) is True)
check("--force overrides a matching fingerprint", decide(fp, fp, True, force=True) is True)

print()
if failures:
    print(f"{len(failures)} failed: {', '.join(failures)}")
    sys.exit(1)
print("All tests passed.")
