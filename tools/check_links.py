#!/usr/bin/env python3
"""Check that every local link and asset reference in the site resolves.

A dependency-free static link checker. It walks the HTML files, extracts
``href`` and ``src`` attributes, and verifies that each local target exists on
disk. External links (``http``, ``https``, ``mailto``, ``tel``), pure
fragments, and ``data:`` URIs are skipped.

Usage:
    python3 tools/check_links.py [root]

Exit codes:
    0 -- every local reference resolves.
    1 -- at least one reference is broken.
"""

from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

SKIP_SCHEMES = {"http", "https", "mailto", "tel", "data", "javascript", "sms", "whatsapp"}
ASSET_ATTRS = ("href", "src")


class LinkParser(HTMLParser):
    """Collects (attribute, value) pairs for every element in a document."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.references: list[tuple[str, str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        for name, value in attrs:
            if name in ASSET_ATTRS and value:
                self.references.append((name, value))

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)


def resolve(target: str, source: Path, root: Path) -> Path | None:
    """Resolve a local reference to a path on disk.

    Returns ``None`` when the reference is not a local file reference.
    """
    parsed = urlparse(target)
    if parsed.scheme or parsed.netloc:
        return None
    if not parsed.path:
        return None  # pure fragment such as "#pricing"

    relative = unquote(parsed.path)
    if relative.startswith("/"):
        candidate = root / relative.lstrip("/")
    else:
        candidate = (source.parent / relative).resolve()

    if candidate.is_dir():
        candidate = candidate / "index.html"
    return candidate


def iter_html_files(root: Path) -> list[Path]:
    """Return every HTML file under ``root``, excluding VCS and tool folders."""
    skip = {".git", ".github", "node_modules", ".venv", "__pycache__", "venv"}
    return sorted(
        path
        for path in root.rglob("*.html")
        if not any(part in skip for part in path.parts)
    )


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else ".").resolve()
    if not root.is_dir():
        print(f"error: {root} is not a directory", file=sys.stderr)
        return 1

    files = iter_html_files(root)
    if not files:
        print("error: no HTML files found", file=sys.stderr)
        return 1

    broken: list[str] = []
    checked = 0

    for html_file in files:
        parser = LinkParser()
        parser.feed(html_file.read_text(encoding="utf-8", errors="replace"))
        parser.close()

        for attribute, target in parser.references:
            if urlparse(target).scheme in SKIP_SCHEMES:
                continue
            resolved = resolve(target, html_file, root)
            if resolved is None:
                continue
            checked += 1
            if not resolved.exists():
                relative_source = html_file.relative_to(root)
                broken.append(f"{relative_source}: {attribute}=\"{target}\"")

    print(f"checked {checked} local reference(s) across {len(files)} HTML file(s)")

    if broken:
        print(f"\n{len(broken)} broken reference(s):", file=sys.stderr)
        for item in broken:
            print(f"  {item}", file=sys.stderr)
        return 1

    print("all local references resolve")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
