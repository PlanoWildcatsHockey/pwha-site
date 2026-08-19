# Ice-rink background (archived 2026-08-16)

Removed from the live site but kept here in case we want to revisit and improve it.

What it did: a subtle aerial ice-rink background behind `<main>` on
top-level pages — center-ice logo bisected by the header seam, an ice
texture across the page, and defensive-zone markings (faceoff circles,
goal crease, end line) near the footer. The footer also had rounded
bottom corners + a background tint to read as the rink boards.

## Files here

- `rink-background.css` — was `src/assets/css/global/blocks/rink-background.css`
- `rink-endline.svg` — was `src/assets/svg/misc/rink-endline.svg`

## To reinstate

1. Move both files back to their original paths above.
2. In `src/_layouts/base.njk`, wrap the `{{ content | safe }}` line inside
   `<main>` with the post-layout check and add the svg shortcode call:
   ```njk
   <main id="main" class="flow">
     {{ content | safe }}
     {% if layout != "post" %}
       {% svg "misc/rink-endline", null, "rink-endline" %}
     {% endif %}
   </main>
   ```
3. In `eleventy.config.js`, re-add the passthrough copy entry:
   ```js
   'logos/original4logo.svg': 'logos/original4logo.svg',
   ```
4. In `src/assets/css/global/blocks/site-footer.css`, re-add the rounded
   bottom corners + tint (was removed alongside this feature since the
   rounding only made sense as "boards" against the ice motif):
   ```css
   background-color: var(--color-bg-accent);
   border-radius: 0 0 clamp(1.5rem, 6vw, 4rem) clamp(1.5rem, 6vw, 4rem);
   ```

The center-ice logo crop math (background-position/size on `#main::before`)
was measured against `logos/original4logo.svg`'s actual artwork bounds —
see the conversation history if that needs re-deriving.
