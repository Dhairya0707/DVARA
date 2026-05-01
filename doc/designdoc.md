# Sarvam AI DESIGN.md

## Brand

- Build world-class AI from India with depth, rigor, and cultural roots.
- Blend high-tech clarity with Indic visual heritage (mandalas, arches, patterns).
- Prioritize trust, calm, and confidence over hype or flashiness.
- Speak as a thoughtful expert, not a marketing slogan machine.

## Layout

- Use generous whitespace; let content breathe.
- Max content width: 1120–1200px centered on desktop.
- Global horizontal padding: 24px on mobile, 40px on tablet, 72px on desktop.
- Stack sections with clear vertical rhythm (64–80px gaps on desktop, 40–56px on mobile).
- Keep layouts mostly single-column with occasional two-column splits for hero, case studies, and feature sections.
- Use subtle dividers or background shifts (tints, soft gradients) to separate sections instead of hard borders.

## Color

- Primary base: Deep, trustworthy blue family for backgrounds and key surfaces.
- Accent: Warm orange/red inspired by Indian textiles and architecture, used sparingly for highlights and CTAs.
- Neutral palette: Cool greys for text and UI surfaces; avoid pure black and pure white.
- Use gradients to bridge deep blue into warm accent tones where appropriate (hero, key buttons, background washes).
- Reserve the warm accent for the most important actions and emphasis; do not over-saturate the UI.

## Typography

- Primary type: Modern, clean sans-serif (e.g., Inter, SF, or similar) for all UI and body copy.
- Headings: Strong but not aggressive. Use medium or semi-bold, with generous line-height and letter spacing.
- Body text: Comfortable reading size (16–18px) with 1.5–1.6 line-height.
- Use hierarchy via size, weight, and spacing, not color explosions.
- Avoid all-caps for long headings; consider Title Case or Sentence case.
- Support Indian languages where needed; ensure fonts render Indic scripts crisply.

## Imagery & Motifs

- Lean on abstract, geometric imagery: mandalas, lotus-inspired forms, arches, and tiling patterns.
- Use patterns derived from Indian architecture and crafts to frame content, not overwhelm it.
- Keep imagery high-contrast and well-lit; avoid noisy textures and busy photos.
- For product visuals, keep UI clean and secondary to the overall brand story.

## Components

### Buttons – Primary 3D

- Purpose: Main calls to action (e.g., “Get in touch”, “Explore models”, “Talk to us”).
- Shape: Rounded pill with large radius (9999px) for a soft, inviting silhouette.
- Height: 44–48px on desktop, 40–44px on mobile.
- Fill: Subtle vertical or diagonal gradient
  - Top: Slightly lighter accent tone.
  - Bottom: Richer, deeper accent tone.
- Lighting: Simulate light from above:
  - Add a soft inner highlight near the top edge.
  - Slight darkening near the bottom edge.
- Shadow:
  - Rest state: 0 10px 24px rgba(0, 0, 0, 0.35), slight vertical offset.
  - Hover: Lift the button by translateY(-2px); shadow becomes slightly larger and softer.
  - Active: Press down by translateY(1px); shadow shortens and darkens.
- Text:
  - Color: White or near-white for high contrast.
  - Weight: Medium or semi-bold.
  - Case: Title Case; keep labels short and clear.
- Focus:
  - Add a 2px outline in the accent color plus a 4–6px soft glow ring.
  - Ensure visible focus even on dark backgrounds.
- States:
  - Disabled: Reduce contrast, flatten gradient, and remove strong shadow to clearly indicate inactivity.

### Buttons – Secondary

- Purpose: Supporting actions less critical than primary CTA.
- Style:
  - Outline or ghost style on deep backgrounds.
  - Border in primary blue; text in primary blue; transparent or lightly tinted background.
- Hover:
  - Subtle background tint and very soft shadow.
- Avoid competing visually with primary 3D buttons.

### Buttons – Tertiary / Text

- Purpose: Low-emphasis actions (e.g., “Learn more” links).
- Style:
  - Text-only with underline on hover.
  - Use body text color with a slight accent hint if needed.
- Keep them visually quiet to preserve hierarchy.

### Cards

- Use soft-radius rectangles with subtle elevation.
- Background: Dark navy or deep grey-blue with a very subtle gradient.
- Shadow: Light, wide shadow for separation from the page; do not outshine button shadows.
- Add thin accent lines or small pattern fragments at the top edge to connect with Indic motifs.

### Navigation

- Header:
  - Sticky top bar with semi-transparent dark background on scroll.
  - Brand mark on left, primary nav links center or right, key CTA button on far right.
- Links:
  - Understated by default; slightly brighter or accented on hover.
- Mobile:
  - Full-screen or large panel menu with clear grouping of items.

### Forms & Inputs

- Inputs:
  - Rounded corners (4–8px radius).
  - Dark background with lighter border that brightens on focus.
  - Clear, high-contrast labels above fields.
- Buttons:
  - Use primary or secondary styles; avoid new styles just for forms.
- Validation:
  - Use color plus concise text; avoid only relying on color.

### Motion & Interaction

- Motion is purposeful and understated.
- Use short, smooth transitions (150–220ms) for hover, focus, and layout changes.
- Avoid bouncy or playful easing; prefer standard ease-out or ease-in-out.
- Consider subtle parallax or depth effects for hero elements, but keep performance in mind.

## Content Tone

- Speak with clarity and conviction; avoid buzzword salads.
- Emphasize impact for India and real-world use cases.
- Prefer simple, direct phrases over grandiose claims.
- Make technical depth understandable without diluting rigor.

## Accessibility

- Maintain strong color contrast for text and key UI elements.
- Provide focus states for all interactive elements.
- Support keyboard navigation across all primary flows.
- Consider screen reader labels for complex components and patterns.
