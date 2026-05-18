# Design System: Elite Athletic Brutalism (PWHA)

## Brand Vision
A high-impact, modern athletic aesthetic designed for the Plano Wildcats Hockey Association. The system balances "Brutalist" structural elements—heavy borders, bold typography, and a restricted palette—with the sophisticated "fluid design" principles of the Eleventy Excellent framework.

## Core Principles
- **CUBE CSS**: Clear separation of Composition, Utility, Block, and Exception layers.
- **Intrinsic Web Design**: Layouts that fluidly adapt to the viewport using CSS `clamp()` and modern layout primitives (Flexbox/Grid) rather than rigid media queries.
- **Athletic Power**: High-contrast colors and aggressive typography that reflect the intensity of high school hockey.

## Color Palette
| Token | Hex | Usage |
| :--- | :--- | :--- |
| `color-primary` | `#570000` | Wildcat Maroon: Headers, primary buttons, branding. |
| `color-secondary` | `#800000` | Power Red: Accents, hover states, highlights. |
| `color-surface` | `#FFFFFF` | Ice White: Main backgrounds, card surfaces. |
| `color-surface-muted`| `#EEEEEE` | Light Grey: Section backgrounds, borders. |
| `color-text` | `#1A1C1C` | Deep Onyx: Primary body copy and headings. |
| `color-text-muted` | `#50606F` | Slate Grey: Subtext and metadata. |

## Typography
The system uses a fluid type scale based on the `clamp()` function, ensuring readability from mobile to ultra-wide displays.

- **Headlines**: Inter (Bold/Black), Italicized. Characterized by tight letter-spacing and uppercase styling for maximum impact.
- **Body**: Lexend. Chosen for its high legibility and modern geometric feel.
- **Fluid Scale**: 
  - `step-0`: Base body text.
  - `step-5`: Hero headlines.

## Compositional Patterns
- **The Sidebar**: A flexible layout primitive for "About" and "Contact" pages where a sidebar remains fixed or stacks based on content width.
- **The Grid**: A fluid, auto-filling grid for player rosters and news cards.
- **The Stack**: Consistent vertical rhythm using the `margin-block-start` property with fluid spacing tokens.

## UI Components
- **Top Bar**: Heavy-weight navigation with a primary "Join the Club" CTA.
- **Player Cards**: High-contrast cards featuring player photography, jersey numbers, and key stats.
- **News Cards**: Image-heavy blocks with clear categorical labeling (e.g., "Game Recap," "Recruiting").
- **Interactive States**: Bold transitions using a `200ms` ease-in-out curve, often involving background color shifts or subtle scaling.

## CUBE CSS Implementation
- **Composition**: Layouts handled by `.l-stack`, `.l-grid`, and `.l-sidebar`.
- **Utilities**: Token-driven classes like `u-bg-primary`, `u-text-step-1`.
- **Blocks**: Encapsulated components like `.c-card` or `.c-nav`.
- **Exceptions**: State-based modifiers like `[data-state="active"]`.