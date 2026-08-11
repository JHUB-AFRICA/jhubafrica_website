# JHUB Africa Website — Architecture Documentation

Version 1.0 · Last updated: August 2026

## 1. Purpose
This document describes the technical architecture of the JHUB Africa website: the runtime stack, routing model, data flow, component structure, and deployment topology.

## 2. Technology stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start v1 (React 19, SSR + file-based routing) |
| Router | TanStack Router (`src/routeTree.gen.ts` auto-generated) |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 + custom design tokens in `src/styles.css` |
| UI primitives | Radix UI / shadcn components, lucide-react icons |
| Data fetching | TanStack Query (client cache) |
| Language | TypeScript 5.8 (strict) |
| Runtime target | Edge worker (Cloudflare workerd) via Nitro |
| Client persistence | `localStorage` / `sessionStorage` (admin content store) |
| Planned backend | MySQL schema (`jhub_africa_schema.sql`, 16 tables) |

## 3. High-level architecture

```text
                 ┌──────────────────────────────┐
   Browser ──────▶ Edge Worker (SSR entry)      │
                 │  src/server.ts  →  TanStack   │
                 │  Start server entry           │
                 └───────────┬──────────────────┘
                             │ renders
                 ┌───────────▼──────────────────┐
                 │  Route tree (src/routes/*)   │
                 │  __root.tsx  → Navbar        │
                 │                → <Outlet/>   │
                 │                → Footer      │
                 └───────────┬──────────────────┘
                             │ reads
      ┌──────────────────────┼───────────────────────┐
      │                      │                       │
┌─────▼──────┐      ┌────────▼────────┐     ┌────────▼────────┐
│ src/data   │      │ src/lib         │     │ src/assets      │
│ impact.ts  │      │ adminContent.ts │     │ logos / hero    │
│ (metrics,  │      │ (news + events  │     │ images          │
│  partners) │      │  localStorage)  │     │                 │
└────────────┘      └─────────────────┘     └─────────────────┘
```

## 4. Directory structure

```text
src/
├── routes/                 # file-based routes (one file = one URL)
│   ├── __root.tsx          # shell: <html>, head metadata, Navbar/Footer
│   ├── index.tsx           # /  homepage
│   ├── about.tsx           # /about
│   ├── innovation.tsx      # /innovation  (filterable portfolio)
│   ├── for-innovators.tsx  # /for-innovators
│   ├── for-students.tsx    # /for-students
│   ├── for-partners.tsx    # /for-partners
│   ├── programs.tsx        # /programs
│   ├── courses.tsx         # /courses
│   ├── events.tsx          # /events
│   ├── news.tsx            # /news
│   ├── resources.tsx       # /resources
│   ├── support.tsx         # /support  (fund a project)
│   ├── contact.tsx         # /contact
│   └── admin.tsx           # /admin  (password-gated CRUD, noindex)
├── components/site/        # Navbar, Footer, ContactStrip, PartnersSection
├── data/impact.ts          # single source of truth: metrics + partners
├── lib/                    # adminContent store, error capture/reporting, utils
├── assets/                 # hero image, logo, partner logos
├── styles.css              # design tokens + all layout/section CSS
├── router.tsx              # router instance + QueryClient context
└── server.ts               # SSR entry wrapper with error normalisation
```

## 5. Routing model
- Filename maps directly to URL; `createFileRoute("/path")` must match the generated route ID.
- `__root.tsx` is the only layout: it renders `<HeadContent/>`, the `Navbar`, a single `<main>` with `<Outlet/>`, and the `Footer`.
- Every content route defines its own `head()` with a unique title, description and Open Graph tags.
- `/admin` sets `robots: noindex, nofollow`.
- 404 and error states are handled by `notFoundComponent` and `errorComponent` on the root route.

## 6. Data architecture

### 6.1 Static content
Page copy (focus areas, programmes, sponsor packages, FAQ) is co-located inside each route file as typed constants. This keeps content SSR-rendered with zero client fetch cost.

### 6.2 Impact metrics and partners — `src/data/impact.ts`
A single approved metric sheet (founded year, innovators supported, innovations, copyrights, partner count) plus the partner registry (name, logo import, contribution). Home and About consume the same export so numbers can never drift between pages.

### 6.3 Dynamic content — `src/lib/adminContent.ts`
News posts and events are stored in `localStorage` under versioned keys, with seeded defaults on first load. The store exposes `loadNews/saveNews` and `loadEvents/saveEvents`. `/news` and `/events` read from it; `/admin` writes to it after a `sessionStorage`-backed password unlock.

> Note: this is a browser-local store intended as an interim CMS. The production path is the MySQL schema in `jhub_africa_schema.sql`, exposed through server functions.

## 7. Rendering and execution model
1. Request hits the edge worker (`src/server.ts`).
2. TanStack Start matches the route, runs `head()` and any loader, and streams SSR HTML.
3. React hydrates on the client; `QueryClientProvider` is mounted in `RootComponent`.
4. Browser-only reads (`localStorage`, `sessionStorage`) happen inside `useEffect` to avoid hydration mismatches.

## 8. Error handling
- `src/lib/error-capture.ts` records the last SSR error.
- `src/server.ts` detects swallowed h3 500 responses and renders a friendly HTML error page instead of raw JSON.
- `src/lib/lovable-error-reporting.ts` reports client errors from the root `errorComponent` boundary.

## 9. Design system
All colour, spacing and typography values are CSS custom properties in `src/styles.css`:
`--jhub-blue: #0f2d59`, `--jhub-green`, `--jhub-red`, `--bg-main: #ffffff`, `--text-main`, `--border-color`.
Rule enforced across the codebase: JHUB brand colours appear on headings and accents only; body content stays neutral on a white background.

## 10. Future backend integration
| Concern | Target |
|---|---|
| Contact form | `contacts` table via server function POST |
| Newsletter | `newsletter_subscribers` |
| Admin auth | `users` table + hashed passwords + role check, replacing the client-side password |
| News / events | `blogs`, `events`, `event_registrations` |
| Innovations portfolio | `innovations`, `innovation_members`, `projects` |
| Funding requests | `funding_requests` |

Server logic should use `createServerFn` from `@tanstack/react-start`; webhooks and external callers use routes under `src/routes/api/public/*`.
