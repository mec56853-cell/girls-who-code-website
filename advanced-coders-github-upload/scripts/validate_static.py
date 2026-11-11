"""Validate the generated GitHub Pages artifact and its local references."""

from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
EXPECTED_PAGES = {
    Path("index.html"),
    Path("youngest-game/index.html"),
    Path("youngest-game/lesson/index.html"),
    Path("middle-game/index.html"),
    Path("ambassadors-game/index.html"),
}
REFERENCE = re.compile(r"(?:href|src|data-href)=[\"']([^\"']+)[\"']")


def reference_target(page: Path, value: str) -> Path | None:
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or value.startswith(("#", "mailto:", "tel:")):
        return None
    candidate = (page.parent / parsed.path).resolve()
    if parsed.path.endswith("/"):
        candidate /= "index.html"
    return candidate


def validate() -> list[str]:
    errors: list[str] = []
    if not DIST.is_dir():
        return ["dist does not exist; run scripts/build_static.py first"]

    actual_pages = {path.relative_to(DIST) for path in DIST.rglob("*.html")}
    missing_pages = EXPECTED_PAGES - actual_pages
    if missing_pages:
        errors.append(f"missing expected pages: {sorted(map(str, missing_pages))}")

    for page in sorted(DIST.rglob("*.html")):
        content = page.read_text(encoding="utf-8")
        if "{{" in content or "{%" in content:
            errors.append(f"{page.relative_to(DIST)} contains unresolved template syntax")
        for value in REFERENCE.findall(content):
            target = reference_target(page, value)
            if target is not None and not target.exists():
                errors.append(
                    f"{page.relative_to(DIST)} references missing path {value!r}"
                )
    return errors


def main() -> None:
    errors = validate()
    if errors:
        raise SystemExit("Static validation failed:\n- " + "\n- ".join(errors))
    print(f"Validated {len(EXPECTED_PAGES)} pages and all local asset references.")


if __name__ == "__main__":
    main()
