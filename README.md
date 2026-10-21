# Socialkaroo ⚡

**Inbound lead generation and social media growth for local businesses.**

A production static website for Socialkaroo, an agency in Indore, India. The
site is the agency's primary sales surface: it explains the offer, lets a
visitor model the return on investment, captures an enquiry, and hands the
visitor off to WhatsApp with the details already filled in.

Also includes **Maison Noire**, a complete e-commerce front-end built as a
case study to demonstrate that the same standard of work applies beyond
marketing pages.

- **Live site:** <https://likharlakshya456-boop.github.io/My-website-/>
- **Pricing one-pager:** <https://likharlakshya456-boop.github.io/My-website-/pricing-onepager.html>
- **Maison Noire demo:** <https://likharlakshya456-boop.github.io/My-website-/maison-noire/>

---

## Why it is built this way

The whole site is **static HTML, CSS and JavaScript**. No build step, no
framework, no bundler, no runtime dependency, no tracking script, no
third-party API call. That is a deliberate engineering choice:

| Decision | Reason |
| --- | --- |
| No framework | A lead-capture page is a document. React would add ~45 KB and a build pipeline to solve a problem the site does not have. |
| No build step | Anyone can clone the repository and serve the folder. There is no toolchain to install, version, or break. |
| Vanilla JS | The interactive pieces are six self-contained modules in one file, each independently readable. |
| No third-party scripts | Nothing loads from a CDN at runtime except the two Google Fonts, so the page cannot break because someone else's server did. |
| No analytics | Visitor tracking is not collected, and the site sets no cookies. |

The result is a site that is fast, dependency-free, and editable by a
non-specialist — which matters when the person maintaining it is also running
the business.

---

## Features

### The agency site

- **3D depth particle canvas** (`script.js` → `initParticleCanvas`)
  A request-animation-frame particle field rendered on a `<canvas>` in the
  hero. Particles are seeded with a depth value, so they scale and fade with
  distance, and the field repaints on resize. The animation pauses when the
  hero scrolls out of view, using an `IntersectionObserver` so background
  tabs do not burn CPU.

- **3D card tilt** (`initTiltCards`)
  Pointer-tracked perspective transforms on the service and tier cards. The
  transform is written directly to the element's style rather than through a
  framework, and it resets on `mouseleave`.

- **Interactive ROI calculator** (`calculateROI`)
  The visitor picks an industry (each carries its own baseline ticket value
  and lead volume), then adjusts the average ticket and the close rate with
  two sliders. The calculator recomputes leads, customers and monthly
  revenue live, and compares the result against the cost of the recommended
  tier to state the return multiple.

- **1-on-1 strategy call booking engine** (`initBookingEngine`)
  A three-part selector — day (today / tomorrow / day after), time slot
  (11:30 AM to 8:00 PM IST) and call mode (phone, WhatsApp audio, Google
  Meet). The summary panel updates as the visitor chooses, and confirming
  opens WhatsApp with the booking details pre-filled.

- **3D inbound lead funnel simulator** (`runFunnelSimulation`)
  A four-stage animated pipeline — local discovery → five-minute WhatsApp
  funnel → qualified call → closed sale and review — that plays through with
  a staggered interval and reports the outcome.

- **Pricing with a billing toggle** (`togglePricingDuration`)
  Three tiers, switchable between a monthly retainer and a 90-day upfront
  plan with the saving shown as a percentage rather than a rounded number.

- **Lead capture with validation** (`handleFormSubmit`)
  Required fields are validated by the browser, then the form assembles a
  structured message and hands off to WhatsApp. The handoff URL is built with
  `encodeURIComponent`, so a name containing `&` or `=` cannot corrupt the
  message.

- **FAQ accordion, mobile drawer navigation, sticky header, scroll reveals**
  Progressive enhancement throughout: navigation, content and contact details
  remain usable with JavaScript disabled.

- **Social sharing metadata**
  Open Graph and Twitter card tags with a generated share image.

### The Maison Noire demo

A five-page e-commerce front end used as a portfolio case study:

| Page | What it shows |
| --- | --- |
| `index.html` | Editorial landing page with featured collections and testimonials |
| `collection.html` | Category filtering, sorting and a responsive product grid |
| `product.html` | Image gallery, size selection, related products, add to bag |
| `about.html` | Brand story, sustainability section, editorial imagery |
| `contact.html` | Contact form, store information, social links |

It includes a **shopping bag** backed by `localStorage` — add, remove,
change quantity, subtotal, badge count and an empty state — plus a dark
mode, a mobile drawer and scroll-triggered reveals. The checkout button is
intentionally a stub: there is no payment backend behind this demo, and it
does not pretend otherwise.

---

## Project structure

```
.
├── index.html            # Agency site: hero, offer, funnel, ROI, pricing, booking, FAQ, form
├── style.css             # Design tokens, layout and component styles
├── script.js             # The six interactive modules
├── pricing-onepager.html # Printable client pricing proposal
├── favicon.svg           # Brand favicon
├── logo.svg              # Vector brand mark
├── logo.png              # Raster brand mark
├── og-image.jpg          # Social share card
├── maison-noire/         # E-commerce case study
│   ├── index.html
│   ├── collection.html
│   ├── product.html
│   ├── about.html
│   ├── contact.html
│   ├── css/style.css
│   ├── js/script.js
│   └── images/
└── tools/
    ├── render_brand.py   # Generates logo.png and og-image.jpg with Pillow
    ├── check_html.py     # Structural HTML validation
    └── check_links.py    # Local link and asset resolution check
```

---

## Running it locally

There is nothing to install. Any static file server will do:

```bash
git clone https://github.com/likharlakshya456-boop/My-website-.git
cd socialkaroo
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Opening `index.html` directly from the filesystem also works, but a local
server is recommended so that relative paths and browser caching behave the
same way they do in production.

### Regenerating the brand assets

`logo.png` and `og-image.jpg` are generated, not hand-drawn:

```bash
pip install pillow
python3 tools/render_brand.py
```

The script takes no arguments and rewrites both files in place. It needs a
DejaVu font at the standard Linux path; adjust the `FONT` constant if yours
lives elsewhere.

---

## Quality checks

Two dependency-free Python checkers and a Node syntax check keep the site
honest. They are the same commands CI runs.

```bash
python3 tools/check_html.py .    # unbalanced tags, duplicate ids, head metadata
python3 tools/check_links.py .   # every local href/src resolves on disk
node --check script.js           # JavaScript syntax
node --check maison-noire/js/script.js
```

`check_html.py` uses the standard library's `html.parser`, so it needs no
third-party validator and cannot be broken by a dependency update.
`check_links.py` walks every HTML file, extracts `href` and `src`
attributes, skips external and `data:` URIs, and resolves the rest against
the filesystem — including directory URLs, which resolve to `index.html`.

Current status: **7/7 documents pass the structural check, 170/170 local
references resolve, both scripts pass the syntax check.**

---

## Deployment

The site is served by **GitHub Pages** from the `main` branch, at the
repository root. Pages builds automatically on every push to `main`; no
workflow file is needed because Pages uses its own built-in deployment
workflow.

To deploy a fork, enable **Settings → Pages → Source: Deploy from a branch →
`main` / `/ (root)`**.

---

## Browser support

Tested and supported in current versions of Chrome, Edge, Firefox and Safari
on desktop and mobile.

The site uses `IntersectionObserver`, CSS custom properties, `clamp()` and
`aspect-ratio`. Where a modern feature is used for decoration only, a
reasonable fallback is provided. The core content and the contact details are
plain HTML and work in any browser.

---

## Security and privacy

- **No secrets in the repository.** There is no API key, no token, and no
  credential of any kind. The site makes no outbound requests other than the
  user's own tap on a WhatsApp or telephone link.
- **No cookies and no analytics.** The site sets no cookies and collects no
  visitor data. The only browser storage used is `localStorage` in the
  Maison Noire demo, for the shopping bag, and it is never sent anywhere.
- **Form input is not transmitted to a server.** The enquiry form composes a
  message and opens WhatsApp; the text never passes through a backend.
- **No third-party scripts.** Two Google Fonts are loaded from
  `fonts.googleapis.com`; everything else is first-party.

---

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `section`, `footer`) and a
  logical heading order.
- A visible focus ring on every interactive element, applied through
  `:focus-visible` so it appears for keyboard interaction without showing on
  mouse clicks.
- `aria-expanded` on the mobile navigation toggle and on every FAQ question,
  kept in step with the rendered state by the script, and `aria-controls`
  pointing the toggle at the navigation it opens.
- `aria-hidden="true"` on the hero canvas, so the decorative particle field
  is not announced.
- The mobile menu closes on `Escape` and returns focus to the toggle.
- `prefers-reduced-motion` is honoured throughout: CSS animations,
  transitions and smooth scrolling are neutralised, the hero particle canvas
  renders a single static frame instead of animating, the pointer-tracked
  card tilt is skipped, and the funnel simulator jumps to its final state
  rather than counting up.

Colour contrast has not been formally audited against WCAG; the palette is
built around a deep-ink-on-ivory canvas with indigo and cyan accents, but
that is a design intent rather than a certified result.

---

## Known limitations

- The lead form has no server-side endpoint; it hands off to WhatsApp by
  design.
- The Maison Noire checkout is a stub, and the demo has no product database.
- The Google Fonts request is the only third-party network call; the site
  falls back to system fonts if it is blocked.
- Colour contrast has not been formally audited against WCAG.
- The Maison Noire demo has no `prefers-reduced-motion` handling of its own
  beyond the shared CSS block; its dark-mode transition still animates.

---

## License

MIT — see [`LICENSE`](LICENSE).

Copyright © 2026 Lakshya Likhar.

Maison Noire, its products, its imagery and the contact addresses shown in
the demo are fictional and exist only as demonstration content.
