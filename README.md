# JHUB Africa Portal (Frontend Client)

The official web portal and administrator control center for **JHUB Africa**, built using React, TypeScript, and Vite. This application integrates directly with `jhub-backend` (running on Express + PostgreSQL + Supabase) to deliver dynamic resource catalogs, portfolio showcases, and administrative controls.

---

## 🚀 Key Features

*   **Course Catalog**: A database-driven listing of short courses, categorized dynamically (e.g., Software, Data, Design), featuring duration calculators, prerequisites, delivery modes (Online/Hybrid/In-Person), and cohort recruitment status indicators.
*   **Innovations Showcase**: Portfolio grids highlighting JKUAT/JHUB innovations. Support for guest proposal submissions, stage mapping (Concept to Scale), and automated JWT-claim based ownership tracking.
*   **Events Calendar**: Interactive cards tracking upcoming dates, converting datetime stamps to readable calendar badges, and integrating waitlist sign-ups.
*   **News & Announcements**: Dynamic blog board tracking announcements with category tags.
*   **Secure Admin Dashboard**: Restricted JWT-protected management portal enabling staff to securely log in, verify statistics, and run full **CRUD operations** (Create, Read, Update, Delete) on:
    *   *News posts* (with base64 image uploads)
    *   *Events schedules* (automatically parsed by category keywords)
    *   *Innovations proposals* (approving, rejecting, or editing status stages)
    *   *Courses programs* (editing catalog options, publishing drafts, and featuring items)

---

## 🛠 Tech Stack

*   **Framework**: [React 18](https://react.dev/)
*   **Build Tool**: [Vite](https://vite.dev/)
*   **Routing**: [TanStack Router](https://tanstack.com/router) (for absolute type-safe routing)
*   **HTTP Client**: [Axios](https://axios-http.com/)
*   **Styling**: Vanilla CSS (Premium, cohesive palette with light/dark glassmorphism, responsive flex grids, and status pills)
*   **Type Checker**: TypeScript

---

## 📁 Project Structure

```
├── axios/
│   ├── api/                 # Modular API client callers
│   │   ├── admin/           # Admin restricted callers (Auth, Courses, Innovations)
│   │   ├── courses.ts       # Public course catalog API
│   │   ├── events.ts        # Public events API + formatting mapping
│   │   ├── innovations.ts   # Public innovations + JWT sub ownership mapping
│   │   └── news.ts          # Public news API + slug realignments
│   └── axios.ts             # Axios client with JWT Bearer auth request interceptors
├── src/
│   ├── components/          # Reusable UI component blocks (Apply dialogs, forms)
│   ├── features/
│   │   └── admin/           # Admin custom form layouts and useAdminContent state hooks
│   ├── routes/              # TanStack type-safe pages (Home, Courses, Events, Innovations, Admin)
│   ├── types/               # Type definitions mapping database models
│   ├── main.tsx             # App entry point
│   └── index.css            # Root tokens and layout styling rules
```

---

## 💻 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone this repository.
2. Navigate to the project root directory:
   ```bash
   cd jhubafrica_website
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

1. Create a `.env` file in the root directory:
   ```env
   VITE_APP_API_URL=http://localhost:4000/
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The portal will be available locally at `http://localhost:5173/`.

### Building for Production

Compile and bundle the production assets:
```bash
npm run build
```
Production assets will be built inside the `/dist` directory.

---

## 📖 Documentation

For detailed guides, local setup, and deployment instructions, visit our [Docs Directory](./Docs/README.md):
*   [Frontend Setup Guide](./Docs/FRONTEND_SETUP.md)
*   [Backend Local Setup Guide](./Docs/BACKEND_LOCAL_SETUP.md)
*   [Docker Deployment Guide](./Docs/DOCKER_DEPLOYMENT.md)


