#!/usr/bin/env python3
"""Check the HTML documents for unbalanced tags and missing basics.

Uses the standard library's :mod:`html.parser`, so it needs no third-party
validator. The checks are deliberately conservative: they catch the mistakes
that actually break a page -- an unclosed tag, a stray closing tag, a
duplicate ``id`` -- rather than enforcing a house style.

Void elements are treated as self-closing, so ``<meta>``, ``<img>`` and
friends do not need an explicit slash.

Usage:
    python3 tools/check_html.py [root]

Exit codes:
    0 -- every document is well formed.
    1 -- at least one document has a problem.
"""

from __future__ import annotations

import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path

VOID_ELEMENTS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input",
    "link", "meta", "param", "source", "track", "wbr",
}

# Tags whose content is not parsed as normal markup.
RAW_TEXT_ELEMENTS = {"script", "style"}

REQUIRED_IN_HEAD = ("charset", "viewport")
"""Metadata that every document is expected to declare."""


class StructureParser(HTMLParser):
    """Tracks the open-tag stack, duplicate ids and head metadata."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[str] = []
        self.errors: list[str] = []
        self.ids: Counter[str] = Counter()
        self.has_head = False
        self.has_charset = False
        self.has_viewport = False
        self._in_head = False
        self._in_raw: str | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if self._in_raw is not None:
            return
        if tag == "head":
            self._in_head = True
            self.has_head = True

        if self._in_head and tag == "meta":
            attributes = {name.lower(): (value or "") for name, value in attrs}
            if "charset" in attributes:
                self.has_charset = True
            if attributes.get("name", "").lower() == "viewport":
                self.has_viewport = True

        for name, value in attrs:
            if name == "id" and value:
                self.ids[value] += 1

        if tag in VOID_ELEMENTS:
            return
        if tag in RAW_TEXT_ELEMENTS:
            self._in_raw = tag
            return
        self.stack.append(tag)

    def handle_endtag(self, tag: str) -> None:
        if self._in_raw is not None:
            if tag == self._in_raw:
                self._in_raw = None
            return
        if tag in VOID_ELEMENTS:
            return
        if not self.stack:
            self.errors.append(f"stray closing tag </{tag}>")
            return
        if self.stack[-1] == tag:
            self.stack.pop()
            return
        if tag in self.stack:
            self.errors.append(f"</{tag}> closes while <{self.stack[-1]}> is still open")
            while self.stack and self.stack[-1] != tag:
                self.stack.pop()
            self.stack.pop()
            return
        self.errors.append(f"stray closing tag </{tag}>")

    def close(self) -> None:
        super().close()
        if self.stack:
            self.errors.append(
                "unclosed tag(s): " + ", ".join(f"<{tag}>" for tag in reversed(self.stack))
            )


def iter_html_files(root: Path) -> list[Path]:
    skip = {".git", ".github", "node_modules", ".venv", "__pycache__", "venv"}
    return sorted(
        path
        for path in root.rglob("*.html")
        if not any(part in skip for part in path.parts)
    )


def check_file(path: Path) -> list[str]:
    """Return the list of problems found in one document."""
    parser = StructureParser()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    parser.close()

    problems = list(parser.errors)

    for identifier, count in parser.ids.items():
        if count > 1:
            problems.append(f"duplicate id \"{identifier}\" ({count} occurrences)")

    if parser.has_head:
        if not parser.has_charset:
            problems.append("missing <meta charset> in <head>")
        if not parser.has_viewport:
            problems.append("missing <meta name=\"viewport\"> in <head>")

    return problems


def main(argv: list[str]) -> int:
    root = Path(argv[1] if len(argv) > 1 else ".").resolve()
    if not root.is_dir():
        print(f"error: {root} is not a directory", file=sys.stderr)
        return 1

    files = iter_html_files(root)
    if not files:
        print("error: no HTML files found", file=sys.stderr)
        return 1

    failed = 0
    for html_file in files:
        problems = check_file(html_file)
        relative = html_file.relative_to(root)
        if problems:
            failed += 1
            print(f"FAIL {relative}", file=sys.stderr)
            for problem in problems:
                print(f"     {problem}", file=sys.stderr)
        else:
            print(f"ok   {relative}")

    print(f"\n{len(files) - failed}/{len(files)} document(s) passed")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
