# JHUB Africa Website — Testing Documentation

Version 1.0

## 1. Testing strategy overview

| Level | What it covers | Tooling |
|---|---|---|
| Static analysis | Types, unused code, style | `tsc`, ESLint, Prettier |
| Unit | Pure functions and data modules (`impact.ts`, `adminContent.ts`, `utils.ts`) | Vitest |
| Component | Navbar, Footer, PartnersSection, ContactStrip, filter UIs | Vitest + React Testing Library |
| Integration / route | Route renders, head metadata, navigation between tabs | Vitest + TanStack Router test harness |
| End-to-end | Real user journeys in a browser | Playwright |
| Non-functional | Performance, accessibility, SEO | Lighthouse, axe |
| Manual / UAT | Content accuracy, responsiveness, admin workflow | Checklist below |

## 2. Static analysis
```bash
bun run lint        # ESLint (typescript-eslint, react-hooks, prettier)
bunx tsc --noEmit   # type check
bun run format      # Prettier write
bun run build       # production build must succeed
```
Gate: all four commands must pass before any change is published.

## 3. Unit tests

### 3.1 `src/data/impact.ts`
- Exports the approved metric sheet with the expected keys and values.
- Partner list is non-empty; every partner has `name`, `logo`, and a non-empty `contribution`.
- No duplicate partner names.

### 3.2 `src/lib/adminContent.ts`
- `loadNews()` returns seeded defaults when `localStorage` is empty.
- `saveNews()` then `loadNews()` round-trips the array.
- Same for `loadEvents()` / `saveEvents()`.
- Corrupt JSON in storage falls back to defaults instead of throwing.
- Each seeded item has a unique `id`.

### 3.3 `src/lib/utils.ts`
- `cn()` merges class names and resolves Tailwind conflicts.

## 4. Component tests

| Component | Assertions |
|---|---|
| `Navbar` | Renders all 8 nav links; logo has alt text; mobile toggle has `aria-label` and opens/closes the menu; CTA buttons point at the right routes |
| `Footer` | Renders 5 columns; contact email and phone are present; all links resolve to real routes |
| `ContactStrip` | Shows JKUAT name, telephone and `info.jhub@jkuat.ac.ke` |
| `PartnersSection` | Renders one logo per entry in `impact.ts`; each has an accessible name; contributions render |
| Home filters | Clicking a category tab filters the featured innovation cards; "All" restores the full set |
| `/innovation` filters | Search text, stage and sector filters combine correctly; empty result shows an empty state |

## 5. Route / integration tests
For every route file:
- Renders without throwing under SSR and on the client.
- `head()` returns a unique, non-placeholder `title` and `description`, plus `og:title` and `og:description`.
- `/admin` includes `robots: noindex, nofollow`.
- Unknown paths render the 404 component with a working "Go home" link.

## 6. End-to-end scenarios (Playwright)

1. **Navigation** — from `/`, click each navbar tab and assert the URL and the `<h1>` of the destination.
2. **Hero CTAs** — "Submit Innovation" and "Get Involved" land on the correct pages.
3. **Audience tiles** — each of the four tiles routes to its landing page.
4. **Innovation filtering** — search "agri", assert only matching cards remain.
5. **Contact form** — fill all fields, choose an inquiry type, submit, assert the confirmation state; submit empty and assert native validation blocks it.
6. **Admin happy path** — visit `/admin`, enter the password, add a news post, verify it appears on `/news`; edit it, verify the change; delete it, verify removal.
7. **Admin auth** — wrong password shows "Incorrect password."; the dashboard is not rendered; "Lock admin" clears the session and returns to the password screen.
8. **Persistence** — content added in admin survives a page reload (same browser).
9. **Responsive** — at 375 px the mobile menu toggle appears, grids collapse to a single column, and no horizontal scrollbar exists; repeat at 768 px and 1440 px.
10. **404** — navigate to `/does-not-exist` and assert the 404 page.

## 7. Non-functional test gates

| Check | Tool | Target |
|---|---|---|
| Performance | Lighthouse (mobile) | ≥ 90 |
| Accessibility | Lighthouse + axe | ≥ 95, zero critical |
| Best practices | Lighthouse | ≥ 95 |
| SEO | Lighthouse | ≥ 95 |
| Console | Browser devtools | No errors or warnings on any route |

## 8. Cross-browser and device matrix
Chrome, Firefox, Safari, Edge (latest two versions) × desktop 1440 px, tablet 768 px, mobile 375 px. Include Safari iOS and Chrome Android for touch behaviour.

## 9. Manual UAT checklist
- [ ] Impact metrics identical on Home and About (single source: `impact.ts`)
- [ ] All 12 partner logos load, are centred and evenly sized
- [ ] Hero text is legible over the background photo
- [ ] Every heading uses brand colour; no brand colour inside body copy
- [ ] Footer contact details correct: Tel +254 67 52181/4 LAN Ext 2814, info.jhub@jkuat.ac.ke
- [ ] No broken links or images
- [ ] Admin password is not discoverable in the UI
- [ ] Page titles and social previews are unique per page

## 10. Defect management
Log each defect with: route, steps to reproduce, expected vs actual, browser/viewport, screenshot, severity (Critical / Major / Minor / Cosmetic). Critical and Major must be fixed before release; Minor and Cosmetic can be scheduled.

## 11. Regression suite
Before each publish, re-run: static analysis, the full E2E suite, and Lighthouse on `/`, `/innovation`, `/contact` and `/admin`.
