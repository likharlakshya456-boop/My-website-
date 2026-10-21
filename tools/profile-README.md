# Lakshya Likhar

**AI Engineer · Software Developer · Founder of [Socialkaroo](https://github.com/likharlakshya456-boop/My-website-)**

I build AI systems that hold up in production, and the interfaces that put
them in front of people. Currently focused on **LLM reliability engineering** —
retries, rate limits, circuit breaking, structured output, evaluation — and on
shipping fast, dependency-light front-ends.

Based in Indore, India. Open to AI engineering and software development
roles, internships, and freelance projects.

---

## Selected work

### [`llm-sentry`](https://github.com/likharlakshya456-boop/llm-sentry) — Python

[![CI](https://github.com/likharlakshya456-boop/llm-sentry/actions/workflows/ci.yml/badge.svg)](https://github.com/likharlakshya456-boop/llm-sentry/actions/workflows/ci.yml)

**A reliability toolkit for shipping LLM features.**

Calling a chat-completion API from a prototype is one line. Calling it from a
production service is not — a single `requests.post` has no idea that the
provider will return `429` for the next ninety seconds, that the API key was
rejected two minutes ago, or that the budget ran out an hour ago.

`llm-sentry` is the layer that sits between the application and the provider.

- **Unified provider interface** — one class for any endpoint that speaks the
  OpenAI chat-completions format, so the base URL is the only thing that
  changes between OpenAI, Groq, Together, DeepSeek, Ollama, LM Studio and
  vLLM. A second class covers the Anthropic Messages API, including the two
  places its wire format differs: the system prompt is a top-level field
  rather than a message, and `max_tokens` is mandatory.
- **Reliability primitives** — exponential backoff with *full jitter*, a
  thread-safe token-bucket rate limiter, a three-state circuit breaker, and an
  absolute deadline that the retries cannot outlive.
- **Retries that know when to stop** — an authentication failure is never
  retried, because a rejected key stays rejected. Neither is a malformed
  reply or a schema violation. Only rate limits, timeouts, transport failures
  and server errors are.
- **A spend ceiling** — an optional limit in US dollars, checked *before* each
  request rather than after, so a run cannot overshoot by a call it had
  already decided not to make.
- **Schema-constrained output** — tolerant JSON extraction from fenced
  blocks, prose and trailing commas, plus a JSON Schema subset validator that
  reports the exact failing path, for example `$.items[0].price`.
- **Observability** — span tracing, token accounting, cost estimation.
- **Offline evaluation** — golden datasets and failure-tolerant reports, so a
  prompt change can be checked before it ships.

**Zero runtime dependencies** — the core package is standard library only, so
it installs anywhere and there are no wheels to audit. **194 tests, 96%
coverage**, running fully offline against a fake transport, with `ruff` and
`mypy` clean.

```python
from llm_sentry import Sentry, Settings, Message

sentry = Sentry.from_settings(Settings.from_env())
response = sentry.ask("Summarise this in one sentence.")
print(response.text, response.usage.to_dict())
```

The test suite never touches the network, so it runs in about a tenth of a
second and cannot flake.

---

### [`My-website-`](https://github.com/likharlakshya456-boop/My-website-) — HTML · CSS · JavaScript

**The live website for Socialkaroo, an inbound lead-generation agency in
Indore.**

The site is the business's primary sales surface: it explains the offer, lets
a visitor model the return on investment, captures an enquiry, and hands them
off to WhatsApp with the details already filled in.

- **Interactive ROI calculator** — the visitor picks an industry and adjusts
  ticket value and close rate; leads, customers and monthly revenue recompute
  live against the cost of the recommended tier.
- **1-on-1 strategy call booking engine** — day, time slot and call-mode
  selectors feeding a summary panel and a pre-filled WhatsApp handoff.
- **3D depth particle canvas** on the hero, with `requestAnimationFrame`,
  device-pixel-ratio scaling, and an `IntersectionObserver` that pauses
  rendering when the hero scrolls out of view.
- **Lead capture with validation** that assembles a structured message and
  URL-encodes it into a WhatsApp link, so a name containing `&` cannot
  corrupt the message.
- **No build step, no framework, no runtime dependency, no third-party
  scripts** — a lead-capture page is a document, and React would add tens of
  kilobytes and a build pipeline to solve a problem the site does not have.

Also includes **Maison Noire**, a complete five-page e-commerce front end
built as a case study: a `localStorage`-backed shopping bag with quantities
and subtotal, category filtering, a product gallery, dark mode, and a mobile
drawer.

The repository carries its own quality gates — two dependency-free Python
checkers that validate the HTML structure of all seven documents and resolve
every local link, both runnable with the standard library alone. A GitHub
Actions workflow runs them, along with a syntax check on both scripts.

- **Live site:** <https://likharlakshya456-boop.github.io/My-website-/>
- **Source:** <https://github.com/likharlakshya456-boop/My-website->

---

### **Maison Noire** — HTML · CSS · JavaScript

**An e-commerce front end, built as a case study.**

Five pages — landing, collection, product, about and contact — built to the
same standard as the agency site rather than as a throwaway mock-up.

- A shopping bag persisted in `localStorage`, with add, remove, quantity
  changes, a running subtotal, a badge count and a proper empty state.
- Category filtering and a responsive product grid; a product page with an
  image gallery, size selection and related products.
- Dark mode with a persisted preference, a mobile drawer that closes on
  `Escape`, and scroll-triggered reveals.
- Accessibility handled rather than asserted: `prefers-reduced-motion` is
  honoured in the CSS *and* in the JavaScript — the hero canvas draws a
  single static frame, the card tilt is skipped and the funnel simulator jumps
  straight to its final state — focus is visible via `:focus-visible`, and the
  checkout button is honestly a stub, because there is no payment backend
  behind the demo and it does not pretend otherwise.

- **Live demo:** <https://likharlakshya456-boop.github.io/My-website-/maison-noire/>
- **Source:** <https://github.com/likharlakshya456-boop/My-website-/tree/main/maison-noire>

---

## Stack

**AI engineering** — Python 3.10+, `dataclasses` and `typing`, the standard
library `urllib` transport, JSON Schema validation, pytest, `ruff`, `mypy`.

**Front-end** — HTML5 semantic markup, modern CSS (custom properties,
`clamp()`, grid, flexbox, `@media`, `:focus-visible`,
`prefers-reduced-motion`), vanilla JavaScript with the DOM, Canvas 2D,
`IntersectionObserver`, `matchMedia` and `localStorage`.

**Tooling** — Git, GitHub Actions, GitHub Pages, the GitHub CLI, and the
REST and GraphQL APIs.

**Practices I care about** — dependency-light design, honest error handling,
tests that run offline, and documentation that says what is *not* finished.

---

## Currently

- Building out `llm-sentry` and looking for contributors to its provider
  adapters and evaluation harness.
- Exploring evaluation-driven development for LLM features — golden datasets
  in CI, regressions caught before production.
- Running **Socialkaroo**, where the interesting engineering problem is
  turning local business marketing into a measurable inbound pipeline.

---

## Contact

- **LinkedIn** — <https://www.linkedin.com/in/lakshya-likhar-691630333/>
- **Email** — <likharlakshya456@gmail.com>
- **GitHub** — <https://github.com/likharlakshya456-boop>

---

*Everything above is real and checkable: the code is in the repositories
linked here, the test suite runs in CI, and the demos are live.*
