#!/usr/bin/env python3
"""
Infer skills and generate AI summaries for each project in lib/projects.json
using Claude + GitHub API. Also fetches last-commit dates and sorts projects
by most recent activity.

Usage (from portfolio root):
    pip install anthropic requests python-dotenv
    python scripts/infer_skills.py

Reads ANTHROPIC_API_KEY and GITHUB_TOKEN from .env.
Writes updated skills, descriptions, lastCommit, and year back to lib/projects.json.
"""

import base64
import json
import os
import re
import sys
from pathlib import Path

import anthropic
import requests
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

GITHUB_USERNAME = "nathansso"
GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
PROJECTS_PATH = Path(__file__).parent.parent / "lib" / "projects.json"

DEPENDENCY_FILES = [
    "requirements.txt", "setup.py", "pyproject.toml",
    "Pipfile", "environment.yml", "package.json",
]

STDLIB = {
    "os", "sys", "re", "json", "math", "random", "datetime",
    "collections", "itertools", "functools", "pathlib", "typing",
    "abc", "io", "time", "copy", "warnings", "logging", "unittest",
    "string", "textwrap", "csv", "hashlib", "struct", "operator",
    "contextlib", "tempfile", "glob", "shutil", "pickle",
    "subprocess", "threading", "multiprocessing", "socket",
    "http", "urllib", "email", "html", "xml", "pdb", "traceback",
    "inspect", "dis", "gc", "weakref", "enum", "dataclasses",
    "statistics", "decimal", "fractions", "numbers",
    "zipfile", "getpass", "argparse", "uuid", "sqlite3",
    "base64", "codecs", "configparser", "pprint", "heapq",
    "queue", "signal", "ctypes", "platform", "site",
}


def gh_headers() -> dict:
    h = {"Accept": "application/vnd.github+json"}
    if GITHUB_TOKEN:
        h["Authorization"] = f"token {GITHUB_TOKEN}"
    return h


def get_repos(project: dict) -> list[str]:
    repo = project.get("repo")
    if not repo:
        return []
    return [repo] if isinstance(repo, str) else list(repo)


def fetch_last_commit_date(repo: str) -> str | None:
    r = requests.get(
        f"https://api.github.com/repos/{GITHUB_USERNAME}/{repo}/commits",
        headers=gh_headers(), timeout=15,
        params={"per_page": 1},
    )
    if r.status_code == 200:
        commits = r.json()
        if isinstance(commits, list) and commits:
            return commits[0]["commit"]["committer"]["date"][:10]
    return None


def fetch_languages(repo: str) -> list[str]:
    r = requests.get(
        f"https://api.github.com/repos/{GITHUB_USERNAME}/{repo}/languages",
        headers=gh_headers(), timeout=15,
    )
    return list(r.json().keys()) if r.status_code == 200 else []


def fetch_readme(repo: str) -> str:
    r = requests.get(
        f"https://api.github.com/repos/{GITHUB_USERNAME}/{repo}/readme",
        headers=gh_headers(), timeout=15,
    )
    if r.status_code == 200:
        data = r.json()
        content = data.get("content", "")
        if data.get("encoding") == "base64" and content:
            return base64.b64decode(content).decode("utf-8", errors="replace")[:3000]
    return ""


def parse_imports(code: str) -> set[str]:
    packages = set()
    for line in code.split("\n"):
        line = line.strip()
        m = re.match(r"^import\s+([\w.]+)", line)
        if m:
            packages.add(m.group(1).split(".")[0])
        m = re.match(r"^from\s+([\w.]+)\s+import", line)
        if m:
            packages.add(m.group(1).split(".")[0])
    return {p for p in packages if p and p not in STDLIB}


def decode_content(data: dict) -> str:
    content = data.get("content", "")
    if data.get("encoding") == "base64" and content:
        return base64.b64decode(content).decode("utf-8", errors="replace")
    return content


def fetch_repo_context(repo: str) -> dict:
    context: dict = {"languages": [], "readme": "", "dependencies": {}}
    context["languages"] = fetch_languages(repo)
    context["readme"] = fetch_readme(repo)

    for fname in DEPENDENCY_FILES:
        r = requests.get(
            f"https://api.github.com/repos/{GITHUB_USERNAME}/{repo}/contents/{fname}",
            headers=gh_headers(), timeout=15,
        )
        if r.status_code == 200:
            context["dependencies"][fname] = decode_content(r.json())[:2000]

    r = requests.get(
        f"https://api.github.com/repos/{GITHUB_USERNAME}/{repo}/contents/",
        headers=gh_headers(), timeout=15,
    )
    all_imports: set[str] = set()
    if r.status_code == 200:
        for item in r.json():
            if not isinstance(item, dict):
                continue
            name = item.get("name", "")
            path = item.get("path", "")
            if item.get("type") != "file":
                continue
            fr = requests.get(
                f"https://api.github.com/repos/{GITHUB_USERNAME}/{repo}/contents/{path}",
                headers=gh_headers(), timeout=15,
            )
            if fr.status_code != 200:
                continue
            raw = decode_content(fr.json())
            if name.endswith(".py"):
                all_imports |= parse_imports(raw)
            elif name.endswith(".ipynb"):
                try:
                    nb = json.loads(raw)
                    for cell in nb.get("cells", []):
                        if cell.get("cell_type") == "code":
                            all_imports |= parse_imports("".join(cell.get("source", [])))
                except json.JSONDecodeError:
                    pass

    if all_imports:
        context["dependencies"]["detected_imports"] = ", ".join(sorted(all_imports))

    return context


def merge_contexts(contexts: list[dict]) -> dict:
    merged: dict = {"languages": [], "readme": "", "dependencies": {}}
    seen_langs: set[str] = set()
    for ctx in contexts:
        for lang in ctx.get("languages", []):
            if lang not in seen_langs:
                merged["languages"].append(lang)
                seen_langs.add(lang)
        if not merged["readme"] and ctx.get("readme"):
            merged["readme"] = ctx["readme"]
        for k, v in ctx.get("dependencies", {}).items():
            if k == "detected_imports" and k in merged["dependencies"]:
                existing = set(merged["dependencies"][k].split(", "))
                merged["dependencies"][k] = ", ".join(sorted(existing | set(v.split(", "))))
            elif k not in merged["dependencies"]:
                merged["dependencies"][k] = v
    return merged


def build_context_lines(project: dict, repo_context: dict | None) -> list[str]:
    lines = [
        f"Project title: {project['title']}",
        f"Current description: {project['description']}",
    ]
    if repo_context:
        if repo_context.get("languages"):
            lines.append(f"Repo languages: {', '.join(repo_context['languages'])}")
        deps = repo_context.get("dependencies", {})
        if deps.get("detected_imports"):
            lines.append(f"Detected Python imports: {deps['detected_imports']}")
        for fname, content in deps.items():
            if fname != "detected_imports":
                lines.append(f"\n{fname}:\n{content[:500]}")
        if repo_context.get("readme"):
            lines.append(f"\nREADME (excerpt):\n{repo_context['readme'][:2000]}")
    return lines


def infer_skills(project: dict, repo_context: dict | None, client: anthropic.Anthropic) -> list[str]:
    lines = build_context_lines(project, repo_context)
    lines.append("""
Return a JSON array of skill tags for this project.
Include: programming languages, libraries/frameworks, ML techniques, data tools, and domain skills.
Keep each tag lowercase and concise (1-3 words).
Examples: "python", "scikit-learn", "machine learning", "d3.js", "data visualization", "xgboost", "pandas", "jupyter", "probabilistic modeling"
Return ONLY the JSON array, no other text.
""")
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{"role": "user", "content": "\n".join(lines)}],
    )
    text = msg.content[0].text.strip()
    match = re.search(r"\[.*?\]", text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    return []


def generate_summary(project: dict, repo_context: dict | None, client: anthropic.Anthropic) -> str:
    lines = build_context_lines(project, repo_context)
    lines.append("""
Write a concise 2-3 sentence project description for a portfolio website.
Focus on what the project accomplishes, the key technical approach, and any notable results or findings.
Be specific about methods, tools, datasets, and outcomes — avoid vague phrases like "explores" or "analyzes".
Write in past tense. Return ONLY the description text, no other text or formatting.
""")
    msg = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        messages=[{"role": "user", "content": "\n".join(lines)}],
    )
    return msg.content[0].text.strip()


def main() -> None:
    api_key = os.getenv("ANTHROPIC_API_KEY", "")
    if not api_key:
        print("Error: ANTHROPIC_API_KEY environment variable not set.", file=sys.stderr)
        sys.exit(1)

    projects = json.loads(PROJECTS_PATH.read_text(encoding="utf-8"))
    client = anthropic.Anthropic(api_key=api_key)

    for i, project in enumerate(projects):
        print(f"[{i + 1}/{len(projects)}] {project['title']}")
        repos = get_repos(project)
        repo_context = None
        last_commit = None

        if repos:
            contexts = []
            commit_dates = []
            for repo in repos:
                print(f"  -> fetching GitHub data for {repo}...")
                contexts.append(fetch_repo_context(repo))
                date = fetch_last_commit_date(repo)
                if date:
                    commit_dates.append(date)
                    print(f"  -> last commit: {date}")

            repo_context = merge_contexts(contexts) if len(contexts) > 1 else contexts[0]
            if commit_dates:
                last_commit = max(commit_dates)

        project["lastCommit"] = last_commit
        if last_commit:
            project["year"] = int(last_commit[:4])

        if repo_context:
            summary = generate_summary(project, repo_context, client)
            project["description"] = summary
            print(f"  -> summary: {summary[:80]}...")

        skills = infer_skills(project, repo_context, client)
        project["skills"] = skills
        print(f"  -> skills ({len(skills)}): {skills[:5]}...")

    projects.sort(key=lambda p: p.get("lastCommit") or "0000-00-00", reverse=True)

    PROJECTS_PATH.write_text(
        json.dumps(projects, indent=4, ensure_ascii=False), encoding="utf-8"
    )
    print(f"\nDone. Updated {PROJECTS_PATH}")


if __name__ == "__main__":
    main()
