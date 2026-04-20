# Design System Specification: High-Density Enterprise Intelligence

## 1. Overview & Creative North Star: "The Architectural Ledger"

In the world of database management, the sheer volume of information can often lead to visual fatigue and "dashboard claustrophobia." This design system rejects the cluttered, line-heavy aesthetic of legacy enterprise software. Our Creative North Star is **The Architectural Ledger**. 

We treat data with the reverence of a high-end editorial publication and the precision of an architectural blueprint. We move beyond the "standard" dashboard by utilizing intentional asymmetry, sophisticated tonal layering, and an aggressive "No-Line" philosophy. The result is a workspace that feels authoritative, expansive, and profoundly trustworthy—a digital environment where ClassicModels' data doesn't just exist, it breathes.

## 2. Colors: Tonal Depth vs. Structural Lines

This system leverages a sophisticated palette of deep blues (`primary`) and cool grays (`secondary`) to create a professional, calm environment. 

### The "No-Line" Rule
Standard UI relies on 1px borders to separate content. This design system **prohibits** 1px solid borders for sectioning. Boundaries must be defined solely through:
- **Background Shifts:** Placing a `surface-container-lowest` card on a `surface` background.
- **Tonal Transitions:** Using `surface-container-low` to define the sidebar against the `surface` workspace.

### Surface Hierarchy & Nesting
We treat the UI as physical layers of fine paper and frosted glass. Depth is achieved through the nesting of surface tokens:
- **Foundation:** `surface` (#f7f9fb) is the global canvas.
- **Primary Containers:** `surface-container-low` (#f2f4f6) is used for large structural areas like sidebars.
- **Interactive Elements:** `surface-container-lowest` (#ffffff) is reserved for high-priority cards and data tables to make them "pop" against the canvas.
- **Emphasis:** `surface-container-highest` (#e0e3e5) is used for active states or nested utility panels.

### The "Glass & Gradient" Rule
To elevate the experience, floating elements (like Search Overlays) must use **Glassmorphism**: 
- Background: `surface-container-lowest` with 80% opacity.
- Effect: `backdrop-blur: 12px`.
- CTA Polish: Main action buttons should use a subtle linear gradient from `primary` (#0d2d7e) to `primary-container` (#2b4696) at a 135-degree angle to add "visual soul" and depth.

## 3. Typography: Editorial Authority

We use **Inter** to bridge the gap between technical utility and premium aesthetic. The hierarchy is designed to guide the eye through dense data without friction.

- **The Hero Metric:** Use `display-sm` (2.25rem) for primary database KPIs. It should feel bold and undeniable.
- **The Narrative:** `title-lg` (1.375rem) is used for section headers. Ensure generous letter-spacing (-0.02em) to maintain an editorial feel.
- **Technical Precision:** `label-md` (0.75rem) and `label-sm` (0.6875rem) are for metadata and table headers. These should be set in All Caps with +0.05em tracking when used in headers to denote authority.
- **Body Content:** `body-md` (0.875rem) is our workhorse for table data, ensuring maximum readability at high densities.

## 4. Elevation & Depth: Tonal Layering

Traditional drop shadows are often messy. We define hierarchy through "Ambient Light" and "Tonal Stacking."

- **The Layering Principle:** Place `surface-container-lowest` elements on top of `surface` to create a soft, natural lift. No shadow is required for static cards.
- **Ambient Shadows:** For floating modals or dropdowns, use an extra-diffused shadow: `box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.08)`. The color is a tinted version of `on-surface` to mimic natural light.
- **The "Ghost Border" Fallback:** If a border is required for accessibility in data-dense tables, use the `outline-variant` (#c4c5d5) at **15% opacity**. Never use 100% opaque lines.
- **Signature Tactility:** Use the `roundedness-md` (0.375rem) for most containers to maintain a professional, slightly sharp edge that feels disciplined.

## 5. Components: Precision Primitives

### Data Tables (The Core)
- **Zero Lines:** Remove all vertical and horizontal dividers.
- **Separation:** Use `body-sm` for headers. Use a subtle `surface-container-low` background on hover to indicate row selection.
- **Density:** Maintain a tight 8px vertical padding to maximize data visibility while using horizontal whitespace to prevent crowding.

### High-Fidelity Charts
- **Palette:** Use `primary` (#0d2d7e), `primary-fixed-dim` (#b6c4ff), and `tertiary-fixed` (#89f5e7) for data visualization. This ensures a monochromatic professional base with a "high-tech" tertiary accent.
- **Interaction:** Chart tooltips must follow the **Glassmorphism** rule.

### Buttons
- **Primary:** Gradient fill (`primary` to `primary-container`). Roundedness: `md`.
- **Secondary:** Surface-only. No border. Background: `secondary-container`. Text: `on-secondary-container`.
- **Tertiary:** No background. Text: `primary`. Use for low-emphasis actions like "Cancel" or "Export."

### Search Bar
- **Styling:** Use `surface-container-lowest` with a `Ghost Border`.
- **Iconography:** Use a 20px "search" icon in `outline` color. 
- **State:** On focus, transition the ghost border to `primary` at 50% opacity and increase the ambient shadow.

### Sidebar Navigation
- **Architecture:** `surface-container-low` background. 
- **Active State:** A vertical "pill" indicator (4px wide) using `primary` color, with the menu item text shifting to `on-primary-fixed-variant`.

## 6. Do's and Don'ts

### Do:
- **Use Vertical White Space:** Separate groups of data with the Spacing Scale rather than lines.
- **Embrace Asymmetry:** Allow the sidebar to be significantly narrower than the main content to create a dynamic, modern focal point.
- **Layer Surfaces:** Always place the most important information on the "highest" (whitest) surface.

### Don't:
- **No 100% Opaque Borders:** This is the quickest way to make the dashboard look like a "standard template."
- **No Pure Black Shadows:** Shadows must always be tinted with the `on-surface` color to maintain tonal harmony.
- **No Multi-Color Chaos:** Stick strictly to the Blue/Slate/White palette. Use `error` (#ba1a1a) only for critical system failures.