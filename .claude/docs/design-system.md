# Lava-SA Design System

## Colour Tokens
- Primary: `#1B6B6B` (Lava petrol green)
- Primary mid: `#2A8A8A`
- Light bg: `#E8F4F4`
- Text: `#1A1917`
- Secondary text: `#5A5857`
- Border: `#E5E4E0`
- Warning: `#C8780A`
- Error: `#C0392B`

## Tailwind Usage
Colours are registered as CSS variables via `@theme inline` in globals.css.
Use semantic class names: `text-primary`, `bg-surface`, `border-border`, `text-copy-muted`, etc.

## Typography
- Headings: bold, tight tracking
- Overline: `text-[11px] font-bold uppercase tracking-widest text-secondary`
- Body: `text-copy-muted` for secondary copy

## Component Patterns
- Card hover overlay: `card-hover-group` + `card-hover-overlay` (slides petrol bar up from bottom)
- Section container: `section-container` utility class
- Buttons: petrol fill for primary, outlined for secondary
