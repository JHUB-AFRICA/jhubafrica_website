# JHUB Africa Website — Data Flow Diagrams (DFD)

Version 1.0 · Notation: Gane–Sarson style, rendered with Mermaid

## Entities, processes and stores

**External entities:** Visitor (innovator, student, funder, partner, researcher), Administrator, Search Engine / Social Crawler, Email Recipient (JHUB staff inbox).

**Data stores:**
| ID | Store | Implementation |
|---|---|---|
| D1 | Static content | Constants inside route files |
| D2 | Impact metrics & partners | `src/data/impact.ts` |
| D3 | News & events | `localStorage` via `src/lib/adminContent.ts` |
| D4 | Admin session | `sessionStorage` (`ADMIN_SESSION_KEY`) |
| D5 | Media assets | `src/assets/` (bundled, hashed) |
| D6 | JHUB database (planned) | MySQL, 16 tables |

---

## Level 0 — Context diagram

```mermaid
flowchart LR
  V([Visitor]) -->|Page request, filter & form input| S[[JHUB Africa Website System]]
  S -->|Rendered pages, metrics, portfolio, confirmations| V
  A([Administrator]) -->|Password, news & event data| S
  S -->|Admin dashboard, save confirmations| A
  C([Search / Social Crawler]) -->|Crawl request| S
  S -->|HTML, meta tags, OG previews| C
  S -->|Inquiry details| E([JHUB Staff Inbox])
```

---

## Level 1 — Major processes

```mermaid
flowchart TB
  V([Visitor])
  A([Administrator])

  P1[1.0 Serve Page / Route]
  P2[2.0 Present Impact & Partners]
  P3[3.0 Filter & Search Innovations]
  P4[4.0 Handle Contact Inquiry]
  P5[5.0 Publish News & Events]
  P6[6.0 Authenticate Administrator]

  D1[(D1 Static content)]
  D2[(D2 Impact metrics & partners)]
  D3[(D3 News & events)]
  D4[(D4 Admin session)]
  D5[(D5 Media assets)]

  V -->|URL request| P1
  P1 --> D1
  P1 --> D5
  P1 -->|Rendered page| V

  P1 --> P2
  D2 --> P2
  P2 -->|Metric bar, partner grid| V

  V -->|Search term, sector, stage| P3
  D1 --> P3
  P3 -->|Filtered project cards| V

  V -->|Name, email, inquiry type, message| P4
  P4 -->|Routed inquiry| E([JHUB Staff Inbox])
  P4 -->|Confirmation| V

  D3 --> P1
  P1 -->|News feed, event calendar| V

  A -->|Password| P6
  P6 --> D4
  D4 -->|Unlock state| P6
  P6 -->|Access granted / denied| A

  A -->|Create, edit, delete| P5
  P6 -->|Authorised| P5
  P5 <--> D3
  P5 -->|Saved confirmation| A
```

---

## Level 2 — Process 5.0: Publish News & Events

```mermaid
flowchart TB
  A([Administrator])
  P51[5.1 Verify unlock state]
  P52[5.2 Capture form input]
  P53[5.3 Validate required fields]
  P54[5.4 Create or update record]
  P55[5.5 Delete record after confirm]
  P56[5.6 Persist collection]
  P57[5.7 Render list & feedback]
  D3[(D3 News & events)]
  D4[(D4 Admin session)]

  A --> P51
  D4 --> P51
  P51 -->|Authorised| P52
  P52 --> P53
  P53 -->|Invalid: blocked| A
  P53 -->|Valid| P54
  A -->|Delete request| P55
  P54 --> P56
  P55 --> P56
  P56 --> D3
  D3 --> P57
  P57 -->|Updated list + "Saved."| A
  D3 -->|Feed data| V([Visitor via /news and /events])
```

---

## Level 2 — Process 6.0: Authenticate Administrator

```mermaid
flowchart LR
  A([Administrator]) -->|Password entry| P61[6.1 Compare credential]
  P61 -->|Match| P62[6.2 Write session flag]
  P61 -->|No match| P63[6.3 Return error message]
  P62 --> D4[(D4 Admin session)]
  D4 -->|Flag present on mount| P64[6.4 Restore unlocked state]
  P64 -->|Dashboard| A
  P63 -->|"Incorrect password."| A
  A -->|Lock admin| P65[6.5 Clear session flag]
  P65 --> D4
```

---

## Level 2 — Process 3.0: Filter & Search Innovations

```mermaid
flowchart LR
  V([Visitor]) -->|Search text| P31[3.1 Match title & description]
  V -->|Sector selection| P32[3.2 Filter by sector]
  V -->|Stage selection| P33[3.3 Filter by stage]
  D1[(D1 Project catalogue)] --> P31
  P31 --> P32 --> P33 --> P34[3.4 Render result set]
  P34 -->|Matching cards or empty state| V
```

---

## Planned target-state flow (with MySQL backend)

```mermaid
flowchart LR
  V([Visitor]) --> UI[Website UI]
  A([Administrator]) --> UI
  UI -->|createServerFn RPC| SF[Server functions]
  SF --> DB[(D6 MySQL: users, contacts,\nnewsletter_subscribers, programs,\nprogram_applications, events,\nevent_registrations, innovations,\ninnovation_members, projects,\nmentorship_bookings, blogs,\ncategories, partners, team_members,\nfunding_requests)]
  DB --> SF --> UI
  SF -->|Notification| E([JHUB Staff Inbox])
```

### Migration notes
- D3 (`localStorage` news/events) is replaced by the `blogs` and `events` tables.
- D4 (client password flag) is replaced by the `users` table with hashed passwords and a server-side role check.
- Contact and funding submissions move from mailto/manual routing into `contacts` and `funding_requests`.
- Impact metrics and partners can move from D2 into the `partners` table while keeping a single approved source.
