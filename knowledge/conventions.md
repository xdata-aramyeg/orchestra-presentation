# Conventions

Every coder reads this first and follows it. The PM keeps it current.

## What we're building
The specific goal lives in the **PM's epic + the team brief** (so it can change without
rewriting this file). Current default: a small, polished web app with a real backend
(e.g. a launch page with a database-backed waitlist).

## Stack
- **Next.js (App Router) + TypeScript** — Route Handlers for the API.
- **Tailwind** (+ shadcn/ui where useful) for styling; **Motion** (`motion/react`) for animation.
- **SQLite via `better-sqlite3`** for persistence; **zod** for validation.
- Native Node modules (better-sqlite3): if Next bundling complains, add it to
  `serverExternalPackages` in `next.config`.

## Design (owned by Frontend)
- Direction is chosen with **`ui-ux-pro-max`**, executed with **`frontend-design`** +
  **`frontend-patterns`**, and assembled from **21st.dev magic MCP** components.
- Design tokens (palette, type, motion) are recorded once and reused across the app — never
  hardcode ad-hoc colors. SVG icons (Lucide), never emoji. Respect `prefers-reduced-motion`.

## Coding standards (all roles)
- **Immutability** — return new objects; never mutate inputs.
- **Many small files** (<400 lines), one clear responsibility each.
- **Validate input at boundaries** (zod); handle errors meaningfully; safe error messages
  (no stack/internal leaks).
- **Parameterized queries only** — never interpolate user input into SQL.
- No `console.log` in committed code. No hardcoded secrets (use env vars).
- Follow existing structure and naming; match what's already there.

## Ownership (no file conflicts)
- **Frontend** owns UI/component/page files. **Backend** owns API/DB/validation files.
  They agree an **API contract** up front and build against it in parallel.
- **QA** writes only test cases/plans (under `tests/` or `qa/`); never app code.
- **Reviewer** edits nothing.
