"""Export the Flask templates as a portable static site for GitHub Pages."""

from __future__ import annotations

import argparse
import posixpath
import re
import shutil
from pathlib import Path, PurePosixPath


ROOT = Path(__file__).resolve().parents[1]
TEMPLATES = ROOT / "templates"
STATIC = ROOT / "static"
DEFAULT_OUTPUT = ROOT / "dist"

ROUTES = {
    "home": ("index.html", "index.html"),
    "youngest_game": ("youngest-game/play.html", "youngest-game/index.html"),
    "youngest_lesson": (
        "youngest-game/lesson.html",
        "youngest-game/lesson/index.html",
    ),
    "middle_game": ("middle-game/play.html", "middle-game/index.html"),
    "ambassadors_game": (
        "ambassadors-game/play.html",
        "ambassadors-game/index.html",
    ),
    "explore_careers": ("explore-careers.html", "explore-careers/index.html"),
}

STATIC_URL = re.compile(
    r"{{\s*url_for\(\s*['\"]static['\"]\s*,\s*filename\s*=\s*['\"]([^'\"]+)['\"]\s*\)\s*}}",
    re.DOTALL,
)
ROUTE_URL = re.compile(
    r"{{\s*url_for\(\s*['\"]([a-zA-Z_][a-zA-Z0-9_]*)['\"]\s*\)\s*}}",
    re.DOTALL,
)


def relative_file_url(output_path: str, target_path: str) -> str:
    current_directory = str(PurePosixPath(output_path).parent)
    return posixpath.relpath(target_path, current_directory)


def relative_route_url(output_path: str, endpoint: str) -> str:
    if endpoint not in ROUTES:
        raise ValueError(f"Unknown route endpoint in template: {endpoint}")
    target_output = PurePosixPath(ROUTES[endpoint][1])
    current_directory = str(PurePosixPath(output_path).parent)
    target_directory = str(target_output.parent)
    relative = posixpath.relpath(target_directory, current_directory)
    return "./" if relative == "." else f"{relative}/"


def render_template(template_path: str, output_path: str) -> str:
    source = (TEMPLATES / template_path).read_text(encoding="utf-8")
    rendered = STATIC_URL.sub(
        lambda match: relative_file_url(output_path, f"static/{match.group(1)}"),
        source,
    )
    rendered = ROUTE_URL.sub(
        lambda match: relative_route_url(output_path, match.group(1)),
        rendered,
    )
    if "{{" in rendered or "{%" in rendered:
        raise ValueError(f"Unresolved template expression in {template_path}")
    return rendered


def safe_clean(output: Path) -> None:
    resolved = output.resolve()
    if resolved == ROOT or resolved.parent != ROOT or resolved.name != "dist":
        raise ValueError(f"Refusing to clean unexpected output directory: {resolved}")
    if resolved.exists():
        shutil.rmtree(resolved)


def build(output: Path = DEFAULT_OUTPUT) -> None:
    safe_clean(output)
    output.mkdir(parents=True)
    shutil.copytree(STATIC, output / "static")

    for template_path, output_path in ROUTES.values():
        destination = output / Path(output_path)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(
            render_template(template_path, output_path),
            encoding="utf-8",
        )

    (output / ".nojekyll").write_text("", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help="Output directory (the supported value is the repository's dist directory).",
    )
    args = parser.parse_args()
    build(args.output)
    print(f"Built static site in {args.output.resolve()}")


if __name__ == "__main__":
    main()
