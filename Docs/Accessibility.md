# JHUB Africa Website — Accessibility Documentation

Version 1.0 · Target standard: WCAG 2.1 Level AA

## 1. Scope
Covers all public routes (`/`, `/about`, `/innovation`, `/for-innovators`, `/for-students`, `/for-partners`, `/programs`, `/courses`, `/events`, `/news`, `/resources`, `/support`, `/contact`) and the internal `/admin` route.

## 2. Accessibility principles applied

### 2.1 Perceivable
- **White background by design.** The site uses `--bg-main: #ffffff` with dark neutral body text (`--text-main`). Brand colours (blue `#0f2d59`, green, red) are restricted to headings and accents, so no long-form text sits on a saturated field.
- **Contrast.** Body text on white exceeds the 4.5:1 AA requirement. Dark-blue headings on white are ~13:1. The hero renders white text over a photograph with a dark gradient overlay plus text shadow to keep contrast above 4.5:1.
- **Text alternatives.** Every meaningful image (logo, partner logos, hero) carries an `alt` attribute describing the organisation or content. Purely decorative graphics use `alt=""`.
- **No colour-only meaning.** Status information (cohort open/closed, project stage, tags) is conveyed with text labels, not colour alone.

### 2.2 Operable
- **Keyboard.** All interactive elements are native `<button>`, `<a>`, `<input>`, `<select>` and `<textarea>`, so tab order, Enter/Space activation and focus follow the DOM. No `tabIndex > 0` is used anywhere.
- **Focus visibility.** Interactive elements retain a visible focus ring; custom styles never remove `:focus-visible` outlines.
- **Icon-only controls.** The mobile navigation toggle in `Navbar.tsx` has `aria-label="Toggle navigation"`.
- **Tap targets.** Navigation links, buttons and form controls use padding that keeps them at or above the 44×44 px recommendation on mobile.
- **No time limits, no auto-playing motion.** Content carousels and transitions are user-initiated.

### 2.3 Understandable
- **Language.** `<html lang="en">` is declared in the root shell.
- **Headings.** One `<h1>` per page (the page header), followed by `<h2>` section headings — no skipped levels.
- **Forms.** The contact form and the admin forms use explicit labels or `aria-label` on every field (for example the admin password input). Required fields use the native `required` attribute so browsers surface validation to assistive tech.
- **Consistent navigation.** The same 8-item navbar and 5-column footer appear on every route, in the same order.

### 2.4 Robust
- **Semantic landmarks.** The root layout renders exactly one `<main>` element wrapping `<Outlet/>`, with `<header>`/`<nav>` for the navbar and `<footer>` for the footer. Page sections use `<section>` and lists use `<ul>/<li>`.
- **Server-rendered HTML.** Because the site is SSR-first, screen readers and crawlers receive complete markup without waiting for JavaScript.
- **Radix primitives.** Where interactive widgets are needed, Radix/shadcn components are used; they ship correct ARIA roles and focus management.

## 3. Known gaps and remediation backlog

| # | Issue | Impact | Action |
|---|---|---|---|
| 1 | No "Skip to main content" link | Keyboard users tab through the full nav on every page | Add a visually-hidden skip link as the first focusable element in `__root.tsx` |
| 2 | Filter tabs on `/innovation` and Featured Innovations are plain buttons | Screen readers do not announce selected state | Add `aria-pressed` (or convert to a Radix Tabs list with `role="tablist"`) |
| 3 | Admin save confirmation ("Saved.") is not announced | Non-visual users miss the feedback | Wrap the message in `aria-live="polite"` |
| 4 | Some partner logos rely on a group `aria-label` | Individual logo names may be under-described | Ensure each `<img>` has `alt="<Partner name> logo"` |
| 5 | `min-h-screen` used in root 404/error views | Mobile browser chrome can clip content | Switch to `min-h-dvh` |
| 6 | Contact form has no error summary region | Validation errors are only inline/native | Add an `aria-live` error summary above the form |

## 4. Testing procedure
1. **Automated:** run axe DevTools or Lighthouse Accessibility on each route; target score ≥ 95 with zero critical violations.
2. **Keyboard:** tab through each page start to finish — confirm every control is reachable, visibly focused, and activatable; confirm the mobile menu can be opened and closed with the keyboard.
3. **Screen reader:** NVDA (Windows) and VoiceOver (macOS/iOS) — verify heading outline, landmark navigation, image descriptions and form labels.
4. **Zoom / reflow:** at 200% zoom and 320 px width, no horizontal scrolling and no clipped content.
5. **Contrast:** sample hero text, headings, muted text and button labels with a contrast checker.

## 5. Ownership
Accessibility checks are part of the definition of done for any new route or component. Any new icon-only control must ship with an `aria-label`; any new image must ship with an `alt`.
