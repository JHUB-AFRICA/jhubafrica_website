# JHUB Africa Website — Performance Documentation

Version 1.0

## 1. Performance objectives

| Metric | Target | Rationale |
|---|---|---|
| Largest Contentful Paint (LCP) | < 2.5 s | Hero image + headline must appear fast on 3G/4G |
| Interaction to Next Paint (INP) | < 200 ms | Filter tabs and menu must feel instant |
| Cumulative Layout Shift (CLS) | < 0.1 | Logos and hero must not push content |
| First Contentful Paint | < 1.8 s | |
| Time to First Byte | < 600 ms | Served from the edge |
| Lighthouse Performance (mobile) | ≥ 90 | Release gate |
| Total transferred (homepage) | < 1.5 MB | Bandwidth-conscious for Kenyan mobile users |

## 2. Architectural performance decisions

1. **Server-side rendering at the edge.** `src/server.ts` runs on a Cloudflare-style worker close to users, so HTML arrives without a client round-trip for data.
2. **Automatic route-level code splitting.** TanStack Router splits each route file, so visiting `/` never downloads `/admin` or `/innovation` logic.
3. **Static, co-located content.** Page copy lives as typed constants inside route files and is rendered on the server — zero fetch waterfalls, no loading spinners on first paint.
4. **No client-side data layer on the critical path.** TanStack Query is mounted but the marketing pages need no runtime queries.
5. **CSS custom properties over runtime theming.** All tokens are plain CSS in `src/styles.css` (~480 lines), compiled by Tailwind v4's Lightning CSS — no CSS-in-JS runtime cost.
6. **Vite production build.** Tree shaking, minification, hashed asset filenames for long-lived caching, and ES module output.

## 3. Asset strategy

| Asset | Treatment |
|---|---|
| Hero photograph | Compressed JPEG, served as a CSS background with a gradient overlay; the single LCP candidate — keep under ~250 KB |
| Logo | Small JPEG imported as an ES module so Vite hashes and caches it |
| 12 partner logos | Small JPEGs in `src/assets/partners/`, rendered in a fixed-height grid to prevent layout shift; lazy-loaded because they sit below the fold |
| Icons | `lucide-react`, imported per-icon so only used glyphs are bundled |
| Fonts | System font stack — no webfont download, no FOIT/FOUT |

### Image checklist for new images
- Resize to the maximum rendered size (never ship a 4000 px photo into a 600 px slot).
- Use JPEG for photographs, PNG only when transparency is required.
- Add `loading="lazy"` and `decoding="async"` to anything below the fold.
- Give a fixed aspect ratio or explicit `width`/`height` to avoid CLS.

## 4. JavaScript budget
- Keep the initial homepage JS payload under ~200 KB gzipped.
- Avoid adding heavy dependencies to shared components; `recharts`, `embla-carousel`, `react-day-picker` and similar libraries must only be imported inside the route that uses them so they stay out of the shared chunk.
- No polling, no timers left running on unmount.

## 5. Rendering performance
- `localStorage` reads (news, events, admin session) happen in `useEffect`, never during render, avoiding hydration mismatch and re-render storms.
- Filter state on `/` and `/innovation` is local `useState` over small in-memory arrays — filtering is O(n) on tens of items, no memoisation required.
- Lists use stable `id` keys so React reconciles rather than remounts.

## 6. Caching
- Hashed static assets (`/assets/*.[hash].js|css|jpg`) are immutable and can be cached for a year.
- HTML is served fresh from the edge on each request.
- Admin content lives in `localStorage`, so `/news` and `/events` re-render instantly with no network cost.

## 7. Responsiveness and mobile performance
- Layout is CSS Grid with `repeat(auto-fit, minmax(...))`, so 5-column bars collapse to 2 and then 1 column without JavaScript media queries.
- The mobile menu is a single boolean toggle — no third-party drawer library on the critical path.
- No fixed pixel widths that force horizontal scrolling at 320 px.

## 8. Measurement procedure
1. `bun run build` then `bun run preview` to test the production bundle (dev mode is not representative).
2. Run Lighthouse mobile on `/`, `/innovation`, `/courses`, `/contact`.
3. Inspect the Network panel: check total transfer, largest single asset, and that no unexpected chunk loads on the homepage.
4. Check the Performance panel for long tasks over 50 ms.
5. Record results against the targets in section 1.

## 9. Optimisation backlog

| # | Opportunity | Expected gain |
|---|---|---|
| 1 | Convert hero and partner logos to WebP/AVIF with JPEG fallback | 40–60% image bytes |
| 2 | Preload the hero image (`<link rel="preload" as="image">`) | Faster LCP |
| 3 | Add explicit `width`/`height` to every `<img>` | Lower CLS |
| 4 | Add `loading="lazy"` to all below-the-fold imagery | Faster initial load |
| 5 | Audit the shared chunk for unused Radix/shadcn imports | Smaller JS |
| 6 | Serve responsive `srcset` variants of the hero for mobile | Large mobile saving |
| 7 | Move news/events to server-rendered data once MySQL is wired in | Removes client hydration flash |

## 10. Monitoring
Track Core Web Vitals in the field (Real User Monitoring) after publishing, segmented by mobile vs desktop and by Kenyan network conditions. Re-run the Lighthouse gate on every release.
