---
name: eleventy-excellent-frontend
description: Use this skill whenever working on the Plano Wildcats Hockey website (a fork of Eleventy Excellent v4) — designing, reviewing, or refactoring layouts, components, templates, partials, includes, shortcodes, CSS, or design tokens. Triggers on any mention of 11ty, Eleventy, Eleventy Excellent, CUBE CSS, Every Layout, Nunjucks, WebC, design tokens, Tailwind (v3) in this project, fluid type or fluid space, Utopia scales, progressive enhancement, intrinsic layout, cascade layers, or pa11y. Also use when adding new pages, sections, blocks, compositions, utilities, or tokens; when editing src/_data/designTokens/*; when reviewing markup for accessibility or semantics; or when cleaning up CSS. Reach for this skill even when the request is phrased casually ("tweak the homepage hero," "add a roster card," "the schedule page looks off") — if the work touches this site's frontend in any way, this skill applies.
---

# Eleventy Excellent frontend (Plano Wildcats Hockey)

A working brief for designing, reviewing, and refactoring the Plano Wildcats Hockey site so changes stay true to the *Build Excellent Websites* workflow that Eleventy Excellent is built on.

## Project context

The site is a fork of **Eleventy Excellent v4.x** (`madrilene/eleventy-excellent`) by madrilene, hosted at `PlanoWildcatsHockey/pwha-site`. The stack:

- **Eleventy 3.x** with Nunjucks + WebC templating
- **CUBE CSS** layered architecture (Composition / Utility / Block / Exception)
- **Every Layout** primitives for intrinsic layouts
- **Tailwind CSS v3** (`^3.4.17`) — *configured in JS*, not v4 CSS-first
- **PostCSS** with `postcss-import`, `cssnano`, autoprefixer
- **pa11y-ci** for accessibility regression tests
- Eleventy plugins: `eleventy-img`, `eleventy-fetch`, `eleventy-plugin-rss`, `eleventy-plugin-syntaxhighlight`, `eleventy-plugin-webc`, `is-land`

### The integration that matters most

This project has **one source of truth for the design system**: JSON token files in `src/_data/designTokens/`. Both the CUBE CSS layer (via custom properties) and the Tailwind config (via `tokensToTailwind()` + `clampGenerator()` utilities in `src/_config/utils/`) are generated from those same tokens. Tailwind here isn't a separate utility framework laid over the design — it's a generated surface API for the same tokens that drive the CSS custom properties.

This means: **edit tokens in JSON, not values in CSS or class names.** A new color goes in `colors.json`, not as an arbitrary hex in a stylesheet or a one-off Tailwind class. The starter author has a blog post explaining this at `/blog/what-is-tailwind-css-doing-here/` — the short version is "Tailwind in this project does not work the way generic Tailwind tutorials describe."

### Folder map

```
src/
├── _data/
│   └── designTokens/        ← single source of truth
│       ├── colors.json
│       ├── borderRadius.json
│       ├── fonts.json
│       ├── spacing.json
│       ├── textSizes.json
│       ├── textLeading.json
│       ├── textWeights.json
│       └── viewports.json
├── _config/
│   └── utils/               ← token → Tailwind pipeline
│       ├── clamp-generator.js
│       └── tokens-to-tailwind.js
├── _includes/               ← layouts and partials
├── assets/
│   └── css/
│       ├── global/          ← cascade-layered global bundle
│       │   ├── base/        ← reset, typography defaults
│       │   ├── compositions/← Every Layout primitives (grid.css, flow.css, …)
│       │   ├── blocks/      ← component-specific styles (CUBE "B")
│       │   ├── utilities/   ← single-purpose classes (CUBE "U")
│       │   └── tests/       ← debug helpers (decommented when needed)
│       └── local/           ← per-page / per-component CSS bundles
└── posts/                   ← starter's own blog posts (good reference)
tailwind.config.js           ← consumes designTokens, produces utilities
eleventy.config.js
```

## Principles

**Tokens are the source of truth.** New colors, sizes, spacing steps, font weights, etc., are added to `src/_data/designTokens/*.json` and propagate to both Tailwind utilities and CSS custom properties automatically. Don't hardcode `1.5rem`, `#1a1a1a`, or one-off `clamp(...)` values in stylesheets or templates.

**Honor Eleventy Excellent's CUBE structure.** When something needs styling, decide *which CUBE layer* it belongs to:

- **Composition** (`global/compositions/`) — intrinsic layout primitives from Every Layout (Stack, Cluster, Sidebar, Switcher, Cover, Grid, Frame, Reel). Use these for layout problems before writing component-specific flex/grid.
- **Utility** (`global/utilities/`, plus generated Tailwind classes) — single-purpose classes derived from tokens. Tailwind utilities count as CUBE utilities here.
- **Block** (`global/blocks/`) — component-specific styles when a pattern is genuinely component-shaped, not layout-shaped.
- **Exception** — data-attribute variants on existing blocks (e.g., `[data-variant="featured"]`).

**Tailwind use is idiomatic, not "an overlay."** Use Tailwind utilities freely *when they read more clearly than a Composition primitive or a Block class*. The classes are token-derived, so they don't fight the design system. What to avoid: arbitrary values like `text-[15px]` or `bg-[#abcdef]` — those bypass the tokens and create drift.

**Tailwind is v3 in this project.** The config is `tailwind.config.js` (JS, not v4's CSS-first `@theme`). Don't suggest `@theme` blocks or `@import "tailwindcss";` — those are v4 patterns and will not work without a deliberate upgrade that also rebuilds the token-to-Tailwind pipeline.

**Build Excellent Websites mindset.** Semantic, accessible HTML first; styling second; JS only when necessary. Fluid type and space via `clamp()` — already wired into the tokens through `clampGenerator()`. Layouts should flex with content and viewport without hard-coded breakpoints wherever possible.

**Use the cascade layers.** The global bundle is organized in cascade layers (Mayank-inspired pattern, replacing earlier `:where()` low-specificity tricks). New global styles slot into the right layer; the local bundle has higher specificity by design and is for per-page overrides.

**Progressive enhancement and resilience.** Markup should make sense with no CSS and no JS loaded. Avoid patterns that hide content behind interactions on small screens. Favor `<details>`, `<dialog>`, native form elements, `is-land` for hydration boundaries, and CSS-driven interactions before reaching for scripts.

**Accessibility is enforced at build time.** `pa11y-ci` runs against the built site (`npm run test:a11y`). New pages and components should pass pa11y, not just look right. Landmarks, heading order, interactive-element correctness, labels, alt text, focus order, and contrast are non-negotiable.

## Workflow for a change request

1. **Clarify briefly, only if needed.** If file context isn't obvious, ask one question: which file/route this affects and what the primary content goal is (schedule page, roster card, news post, etc.). Guess and propose if you can.

2. **Decide which layer the change belongs in.** Token? Composition? Utility? Block? Exception? Picking the right layer is most of the work. If you're tempted to write a one-off style, pause — there's almost always a more idiomatic place for it.

3. **Check semantics and accessibility first.** Before any styling, validate landmarks, heading outline, interactive-element correctness, labels, alt text, focus order. Fix structural issues before anything cosmetic.

4. **Reach for an Every Layout primitive.** If the layout problem matches a known primitive ("stack with consistent spacing," "cluster things that wrap," "sidebar + main with a sensible breakpoint," "switch from row to column at a content threshold"), use the primitive in `global/compositions/` — don't write a one-off flex/grid block.

5. **Use existing tokens; extend the JSON when needed.** If a needed value isn't in the token files, add it to the appropriate JSON. Don't reach for arbitrary Tailwind values or hardcoded CSS values.

6. **Apply fluid type/space through the existing scale.** New steps go into `textSizes.json` / `spacing.json` and flow through `clampGenerator()` automatically.

7. **Tailwind review, when applicable.** Flag long utility chains that should become a Block. Flag arbitrary `[…]` values. Flag any utility that fights the browser (fixed heights cropping content, manual sizing where a Composition primitive would do it for free).

8. **Deliver concrete snippets.** Respond with copy-pasteable Nunjucks/HTML/CSS/JSON that fits the starter's conventions. Each meaningful snippet gets one short explanation — what it does, which CUBE layer it belongs to, and why. No broad rewrites unless explicitly requested.

## Response style

Assume the reader is comfortable editing Eleventy templates, CSS, and JSON tokens. Skip beginner explanations unless asked. Prefer one or two focused, improved snippets over sweeping rewrites. When proposing structural changes, name the CUBE layer and the file path so the change is recognizable inside the starter (e.g., "this becomes a Block at `src/assets/css/global/blocks/roster-card.css`"). Be specific about file paths.

## Things to *not* suggest

- `tailwind.config.js` → CSS `@theme` migration, unless the user explicitly asks for a v4 upgrade. The tokens-to-Tailwind pipeline depends on JS config.
- Arbitrary Tailwind values like `text-[15px]`, `bg-[#abcdef]`. Those bypass the design system.
- Inline `clamp(...)` in components. Use the generated scale.
- Hardcoded hex colors, rems, or pixel widths anywhere.
- New CSS that bypasses the cascade-layer structure.

## Reference

- [Eleventy Excellent](https://github.com/madrilene/eleventy-excellent) — the upstream starter.
- [`PlanoWildcatsHockey/pwha-site`](https://github.com/PlanoWildcatsHockey/pwha-site) — this project's repo (origin).
- [Build Excellent Websites](https://buildexcellentwebsit.es/) — Andy Bell's principles: modern CSS, fluid type, fluid space, flexible layout, progressive enhancement.
- [CUBE CSS](https://cube.fyi/) — Composition, Utility, Block, Exception methodology.
- [A CSS project boilerplate (Piccalilli)](https://piccalil.li/blog/a-css-project-boilerplate/) — the article the starter's CSS docs link to as "if you want to know exactly how it all works."
- [Every Layout](https://every-layout.dev/) — intrinsic layout primitives.
- [Utopia](https://utopia.fyi/) — fluid type/space scale calculator (the model `clampGenerator()` follows).
- [Tailwind CSS v3 docs](https://v3.tailwindcss.com/docs) — current Tailwind version in this project.
- [Eleventy 3 docs](https://www.11ty.dev/docs/) — current Eleventy reference.
- In-repo: `src/docs/css.md` — the starter's own CSS philosophy doc.
- In-repo: `src/posts/2023/2023-11-30-tailwind.md` — *"What is Tailwind CSS doing here?"*
