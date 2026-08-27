# Lakshya — Freelance Web Developer Portfolio

A modern, responsive freelance portfolio website built with HTML and CSS. It presents services, selected work, process, and a direct email contact flow — and features a full live e-commerce demo, **Maison Noire**, as its case study.

## Live

- Portfolio: <https://likharlakshya456-boop.github.io/My-website-/>
- Maison Noire demo: <https://likharlakshya456-boop.github.io/My-website-/maison-noire/>

## Structure

```
├── index.html            # Freelance portfolio (single page)
├── style.css             # Portfolio styles
├── favicon.svg           # Portfolio favicon
├── og-image.jpg          # Social share card
└── maison-noire/         # Fashion e-commerce demo (case study)
    ├── index.html        # Home: hero, featured collection, slider, testimonials
    ├── collection.html   # Shop with category filters
    ├── product.html      # Product detail with gallery
    ├── about.html        # Brand story + team
    ├── contact.html      # Contact + FAQ
    ├── css/style.css     # Full design system (shared)
    ├── js/script.js      # Cart (localStorage), dark mode, sliders, reveal animations
    └── images/           # Original AI-generated editorial imagery
```

## Customize

Update the name, project examples, LinkedIn URL, and social links in `index.html`. The contact email is already configured for `likharlakshya456@gmail.com`.

## Run locally

Open `index.html` in a browser, or run `python3 -m http.server 8000` and visit `http://localhost:8000`.
