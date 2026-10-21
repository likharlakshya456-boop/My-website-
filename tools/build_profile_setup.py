#!/usr/bin/env python3
"""Build tools/profile-setup.html from the profile README.

The page exists for one reason: the profile README has to end up as the
``README.md`` of the ``likharlakshya456-boop`` repository, and the automated
publish cannot do it — the credential available to the build has no write
access to that repository. Rather than asking for the file to be typed on a
phone, this page puts the exact text on the clipboard with one tap.

Usage:
    python3 tools/build_profile_setup.py [source.md] [output.html]

Two files are embedded verbatim in ``<script type="text/plain">`` blocks, so
nothing in either can break the page:

* ``tools/profile-README.md``   — the profile README
* ``tools/ci.yml``             — the CI workflow for this repository

Both have a one-tap copy button, so neither has to be typed on a phone.

This file is a helper. It is not linked from the site's navigation, and it
can be deleted without affecting any public page.
"""

from __future__ import annotations

import html
import sys
from pathlib import Path

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Profile README — copy and publish</title>
<style>
  :root {
    color-scheme: light dark;
    --bg: #ffffff;
    --fg: #14161a;
    --muted: #5b6470;
    --line: #dfe3e8;
    --accent: #1f6feb;
    --code-bg: #f6f8fa;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #0d1117;
      --fg: #e6edf3;
      --muted: #9198a1;
      --line: #30363d;
      --accent: #6ea8ff;
      --code-bg: #161b22;
    }
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    padding: 1.25rem;
    background: var(--bg);
    color: var(--fg);
    font: 16px/1.6 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  main { max-width: 46rem; margin: 0 auto; }
  h1 { font-size: 1.4rem; margin: 0 0 .25rem; }
  h2 { font-size: 1.05rem; margin: 1.75rem 0 .5rem; }
  p.lead { color: var(--muted); margin: 0 0 1.25rem; }
  ol { padding-left: 1.25rem; }
  li { margin-bottom: .5rem; }
  a { color: var(--accent); }
  code { background: var(--code-bg); padding: .1rem .35rem; border-radius: .3rem;
         font-size: .9em; }
  button {
    display: block;
    width: 100%;
    margin: 1rem 0 .5rem;
    padding: .9rem 1rem;
    font-size: 1.05rem;
    font-weight: 600;
    color: #fff;
    background: var(--accent);
    border: 0;
    border-radius: .5rem;
    cursor: pointer;
  }
  button:active { transform: translateY(1px); }
  #status { min-height: 1.5rem; color: var(--muted); font-size: .92rem; }
  textarea {
    width: 100%;
    height: 16rem;
    margin-top: .75rem;
    padding: .75rem;
    font: 13px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
    color: var(--fg);
    background: var(--code-bg);
    border: 1px solid var(--line);
    border-radius: .5rem;
    resize: vertical;
  }
  details { margin-top: 1.25rem; border-top: 1px solid var(--line); padding-top: .75rem; }
  summary { cursor: pointer; font-weight: 600; }
  .note {
    margin: 1rem 0 0;
    padding: .75rem .9rem;
    border-left: 3px solid var(--accent);
    background: var(--code-bg);
    border-radius: 0 .35rem .35rem 0;
    font-size: .92rem;
    color: var(--muted);
  }
</style>
</head>
<body>
<main>
  <h1>Profile README — copy and publish</h1>
  <p class="lead">One page, three taps, no typing. This helper exists because the
  automated publish could not reach the profile repository, not because
  anything is broken.</p>

  <h2>1. Copy the README</h2>
  <p>Tap the button. The exact text of the profile README is placed on your
  clipboard.</p>
  <button id="copy" type="button">Copy the README to the clipboard</button>
  <p id="status" role="status" aria-live="polite"></p>

  <h2>2. Paste it into the profile repository</h2>
  <ol>
    <li>Open <a href="https://github.com/likharlakshya456-boop" target="_blank" rel="noopener">the profile page</a>.</li>
    <li>Open the <strong>likharlakshya456-boop</strong> repository. On the
        phone app it is under <em>Your repositories</em>; on the web, follow
        the repository link in the repositories list.</li>
    <li>Tap <strong>Add file</strong>, then <strong>Create new file</strong>.</li>
    <li>Type <code>README.md</code> as the file name.</li>
    <li>Tap into the editor, paste, and commit directly to
        <code>main</code>.</li>
  </ol>

  <h2>3. Check it</h2>
  <p>Reload the profile page. The README appears under your name. The
  repository description, the topics, the pinned repositories and the profile
  bio are separate settings — see the notes below.</p>

  <h2>Also: the CI workflow for this site</h2>
  <p>The repository already contains a workflow that validates every page and
  every link, but the credential that built this page cannot push a
  <code>.github/workflows/</code> file. Copy it and add it by hand.</p>
  <button id="copy-ci" type="button">Copy the CI workflow to the clipboard</button>
  <p id="status-ci" role="status" aria-live="polite"></p>
  <ol>
    <li>Open the <strong>My-website-</strong> repository.</li>
    <li>Tap <strong>Add file</strong>, then <strong>Create new file</strong>.</li>
    <li>Type <code>.github/workflows/ci.yml</code> as the path. GitHub creates
        the folders for you.</li>
    <li>Paste and commit to <code>main</code>.</li>
  </ol>

  <details>
    <summary>If the copy button does not work</summary>
    <p>Select the text below, copy it with your phone's own
    select-and-copy gesture, and paste it into the editor.</p>
    <textarea id="fallback" readonly spellcheck="false" aria-label="The profile README source"></textarea>
  </details>

  <details>
    <summary>What still needs doing by hand, and why</summary>
    <ul>
      <li><strong>Repository description and topics</strong> — open the
          repository, tap <em>About</em>, then the gear icon. A credential
          without <code>repo</code> metadata write access cannot set these.</li>
      <li><strong>Profile bio and website</strong> — open your avatar, then
          <em>Your profile</em>, then <em>Edit profile</em>. The same
          credential cannot write to the account endpoints.</li>
      <li><strong>Pinned repositories</strong> — on the profile page, tap
          <em>Customize your profile</em>, then <em>Pinned repositories</em>,
          and add three: this site, llm-sentry, and the profile repository
          itself.</li>
      <li><strong>llm-sentry</strong> — this repository does not exist yet,
          and creating one needs an account-level credential. The full source
          is in the llm-sentry folder of the change bundle; on a computer,
          <code>gh repo create likharlakshya456-boop/llm-sentry --public</code>
          followed by a push is the whole job.</li>
      <li><strong>The CI workflow for this site</strong> — it is already in
          this repository as <code>.github/workflows/ci.yml</code>. A
          credential without <code>workflow</code> write access cannot push
          it, so it travels with the next commit that touches a normal file.</li>
    </ul>
  </details>

  <p class="note">Nothing on this page is linked from the site's navigation.
  It can be deleted at any time without affecting any public page.</p>
</main>

<script type="text/plain" id="readme-source">
__README__
</script>
<script type="text/plain" id="ci-source">
__CI__
</script>
<script>
(function () {
  var source = document.getElementById('readme-source').textContent;
  source = source.replace(/^\\n/, '').replace(/\\s+$/, '');
  var status = document.getElementById('status');
  var fallback = document.getElementById('fallback');
  fallback.value = source;

  var button = document.getElementById('copy');
  button.addEventListener('click', function () {
    var done = function () {
      status.textContent = 'Copied. Paste it into the profile README editor.';
    };
    var failed = function () {
      status.textContent = 'The browser refused the copy. Expand the box below and copy the text by hand.';
      fallback.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fallback.focus();
      fallback.select();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(source).then(done, failed);
    } else {
      failed();
    }
  });
})();
</script>
</body>
</html>
"""


def main(argv: list[str]) -> int:
    """Build the page.

    Args:
        argv: The source and output paths.
    """
    here = Path(__file__).resolve().parent
    source_path = Path(argv[1]) if len(argv) > 1 else here / "profile-README.md"
    output_path = Path(argv[2]) if len(argv) > 2 else here / "profile-setup.html"

    if not source_path.exists():
        print(f"source not found: {source_path}", file=sys.stderr)
        return 1

    ci_path = here / "ci.yml"
    if not ci_path.exists():
        print(f"CI workflow not found: {ci_path}", file=sys.stderr)
        return 1

    readme = source_path.read_text(encoding="utf-8").strip()
    ci = ci_path.read_text(encoding="utf-8").strip()

    # The script block is a text/plain element, so the only sequence that
    # could end it early is the closing tag itself.
    for name, body in (("the README", readme), ("the CI workflow", ci)):
        if "</script" in body.lower():
            print(f"{name} contains a closing script tag; refusing to embed it",
                  file=sys.stderr)
            return 1

    page = (TEMPLATE
            .replace("__README__", html.escape(readme, quote=False))
            .replace("__CI__", html.escape(ci, quote=False)))
    output_path.write_text(page, encoding="utf-8")
    print(f"wrote {output_path} ({len(page):,} bytes) from {source_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
