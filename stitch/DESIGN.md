---
name: Elite Athletic Brutalism
colors:
  wildcat-maroon: '#570000'
  power-red: '#800000'
  ice-white: '#FFFFFF'
  slate-grey: '#50606F'
  deep-onyx: '#1A1C1C'
  surface-muted: '#EEEEEE'
  outline-maroon: '#8E706C'
typography:
  display-xl:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Lexend
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Lexend
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Lexend
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  margin: 32px
  gutter: 24px
  container-max: 1280px
---

## Brand & Style
The brand identity is "Elite Athletic Brutalism"—a high-impact, prestigious aesthetic that blends the raw energy of competitive sports with a disciplined, institutional structure. It targets high-performance athletes and their families, evoking a sense of legacy, grit, and excellence.

The design style utilizes **Brutalism** and **High-Contrast Bold** elements: heavy 2px borders, sharp corners, and aggressive typography. Visual interest is maintained through "Sheen" hover effects and high-contrast photographic overlays, creating a digital environment that feels as physical and high-stakes as a professional hockey arena.

## Colors
The palette is dominated by **Wildcat Maroon** and **Ice White**, creating a classic collegiate feel with a modern edge. 

- **Primary:** A deep, aggressive maroon (#570000) used for brand-critical elements, borders, and accents.
- **Secondary:** A cool slate grey (#50606F) used to balance the warmth of the maroon with a professional, steely tone.
- **Backgrounds:** Primarily light neutrals (#F9F9F9) to keep text legible, with occasional dark primary containers to create high-contrast sections.
- **Accents:** High-fidelity reds and metallic greys are used for interactive states and decorative borders.

## Typography
The system uses a pairing of **Inter** for structural/display elements and **Lexend** for body/labels to maximize readability while maintaining an athletic character.

- **Display Text:** Bold, heavy weights (800+) in all-caps and italics are preferred for hero sections to convey speed and power.
- **Headlines:** Clean, tightly tracked Inter sans-serifs provide a modern, authoritative tone.
- **Body:** Lexend is utilized for its exceptional legibility and slightly wider character stance, which feels active and clear.
- **Stylistic Rules:** Frequent use of `uppercase` and `tracking-widest` for navigation and button labels to enhance the "Elite" brand feel.

## Layout & Spacing
The system follows a **Fixed Grid** philosophy centered within a 1280px container. 

- **Composition Sidebar:** A signature 2-column layout for internal pages (280px sidebar | 1fr content) with a significant 48px (xl) gap.
- **Rhythm:** An 8px-based spacing system governs internal element padding, while section-level vertical spacing is strictly set at 48px (xl) to create breathing room between high-impact visuals.
- **Margins:** Standard page margins are 32px to ensure content doesn't crowd the viewport edges on smaller screens.

## Elevation & Depth
Depth is created through **Structural Brutalism** rather than realistic shadows.

- **Hard Shadows:** Interactive cards use "offset shadows"—solid 8px blocks of primary color (#570000) that give elements a physical, popped-out appearance.
- **High-Contrast Borders:** Depth is defined by 2px and 4px borders rather than blurs.
- **Layering:** Images use `mix-blend-overlay` and `opacity` (50%) over dark primary containers to create a "glass-like" or "ice-like" depth without traditional transparency.
- **Hover States:** Elements use a "Sheen" gradient effect (diagonal metallic transitions) to simulate the glint of light on polished ice or metal.

## Shapes
The design system is strictly **Sharp (0px roundedness)**. 

Every UI component—buttons, containers, sidebar navs, and images—uses hard 90-degree corners. This reinforces the "discipline" and "rigor" of the brand's hockey association identity. Occasional circular elements are reserved exclusively for icons or profile avatars to provide a singular point of focus.

## Components
- **Buttons:** Sharp corners, high-contrast background (Primary Maroon or Ice White), and `tracking-widest` uppercase labels. They must feature the "sheen-effect" on hover.
- **Cards:** Defined by 2px solid borders. Leadership cards feature a heavy 4px bottom border in Primary Maroon. 
- **Navigation (Sidebar):** Contained within a block with an 8px hard offset shadow. Items use Material Symbols for iconography, which translate rightward on hover.
- **Header:** Sticky, with a 2px primary-colored bottom border. Navigation links use a 4px bottom border for the active state.
- **Feature Blocks:** Alternating background colors (Surface Muted vs. White) with thick left-side accent borders (8px) for major section headings.
- **Icons:** Use the 'Material Symbols Outlined' set, strictly using the primary brand color for consistency.