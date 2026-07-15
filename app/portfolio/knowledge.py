import json
from functools import lru_cache
from pathlib import Path


PORTFOLIO_PATH = Path("app/data/portfolio.json")


@lru_cache(maxsize=1)
def load_portfolio() -> dict:
    return json.loads(PORTFOLIO_PATH.read_text(encoding="utf-8"))


def _flatten(value, prefix: str = "") -> list[tuple[str, str]]:
    rows: list[tuple[str, str]] = []

    if isinstance(value, dict):
        for key, item in value.items():
            label = f"{prefix}.{key}" if prefix else key
            rows.extend(_flatten(item, label))
    elif isinstance(value, list):
        for index, item in enumerate(value, start=1):
            label = f"{prefix}[{index}]"
            rows.extend(_flatten(item, label))
    else:
        rows.append((prefix, str(value)))

    return rows


def search_portfolio_knowledge(query: str, limit: int = 12) -> str:
    portfolio = load_portfolio()
    terms = {
        term.lower()
        for term in query.replace("/", " ").replace("-", " ").split()
        if len(term) > 2
    }

    if terms & {"project", "projects", "built", "github", "repo", "repositories"}:
        return "\n\n".join(
            f"[Portfolio Project: {project['title']}]\n{json.dumps(project, indent=2)}"
            for project in portfolio.get("projects", [])
        )

    if terms & {"skill", "skills", "technology", "technologies", "stack"}:
        return f"[Portfolio Skills]\n{json.dumps(portfolio.get('skills', {}), indent=2)}"

    if terms & {"experience", "work", "job", "company"}:
        return "\n\n".join(
            f"[Portfolio Experience: {experience['title']}]\n{json.dumps(experience, indent=2)}"
            for experience in portfolio.get("experience", [])
        )

    semantic_sections = []

    for project in portfolio.get("projects", []):
        semantic_sections.append((
            f"project: {project['title']}",
            json.dumps(project, indent=2)
        ))

    for experience in portfolio.get("experience", []):
        semantic_sections.append((
            f"experience: {experience['title']} at {experience['company']}",
            json.dumps(experience, indent=2)
        ))

    semantic_sections.extend([
        ("professional summary", portfolio.get("summary", "")),
        ("skills", json.dumps(portfolio.get("skills", {}), indent=2)),
        ("education", json.dumps(portfolio.get("education", {}), indent=2)),
        ("certifications", json.dumps(portfolio.get("certifications", []), indent=2)),
        ("contact", json.dumps({
            "email": portfolio.get("email"),
            "phone": portfolio.get("phone"),
            "location": portfolio.get("location"),
            "links": portfolio.get("links", {})
        }, indent=2))
    ])

    rows = semantic_sections + _flatten(portfolio)
    scored: list[tuple[int, str, str]] = []

    for label, text in rows:
        haystack = f"{label} {text}".lower()
        score = sum(1 for term in terms if term in haystack)

        if score:
            scored.append((score, label, text))

    if not scored:
        summary = [
            f"Name: {portfolio['name']}",
            f"Role: {portfolio['role']}",
            f"Summary: {portfolio['summary']}",
            "Top projects: " + ", ".join(project["title"] for project in portfolio["projects"]),
            "Core skills: " + ", ".join(
                skill
                for group in portfolio["skills"].values()
                for skill in group[:4]
            )
        ]
        return "\n".join(summary)

    scored.sort(key=lambda item: item[0], reverse=True)

    results = [
        f"[Portfolio: {label}]\n{text}"
        for _, label, text in scored[:limit]
    ]

    return "\n\n".join(results)


def portfolio_profile() -> dict:
    return load_portfolio()
