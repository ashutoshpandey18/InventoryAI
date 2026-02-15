# InventoryAI

Inventory planning and reorder recommendation SaaS UI built with Next.js App Router, TypeScript, and Tailwind CSS.

## Overview

This project contains two primary experiences:
- Marketing site for product positioning and feature walkthrough
- Dashboard experience for low-stock visibility, reorder decisions, and trend review

The codebase is organized to keep UI, data, and utility logic separated and maintainable for production deployment.

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Lucide React icons
- Recharts (lazy loaded)

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm run dev
```

3. Open:

`http://localhost:3000`

## Production Build

Run the same checks used before deployment:

```bash
npm run build
npm run start
```

## Environment Variables

Copy `.env.example` to `.env.local` for local development:

```bash
copy .env.example .env.local
```

Only commit `.env.example`. Do not commit `.env`, `.env.local`, or any real credentials.

## Project Structure

```text
app/
  (dashboard)/
    layout.tsx
    page.tsx
  layout.tsx
  page.tsx
  globals.css

components/
  ui/
    Button.tsx
    Card.tsx
    Container.tsx
  AppShell.tsx
  Header.tsx
  Sidebar.tsx
  StickyNav.tsx
  ...

config/
  navigation.ts

lib/
  mock-data.ts
  utils.ts
```

## Architecture Notes

- `lib/mock-data.ts` stores demo data and related interfaces
- `lib/utils.ts` stores reusable formatting and helper utilities
- `components/ui/*` contains shared UI primitives
- Feature components consume typed data instead of embedding raw arrays
- Recharts visualization is isolated in a dynamic wrapper to reduce initial client bundle cost

## Hooks and APIs Used (Detailed)

### `useState`

Used for local interactive UI state.

Where and why:
- `components/StickyNav.tsx`
  - `isScrolled`: toggles condensed navbar style after scroll threshold
  - `isMobileMenuOpen`: toggles mobile navigation panel
- `components/AppShell.tsx`
  - `isSidebarOpen`: controls sidebar visibility on smaller screens
- `components/InventoryTable.tsx`
  - `sortField` and `sortDirection`: controls client-side table sorting

Production reasoning:
- Keeps transient UI state close to the component that owns it
- Avoids unnecessary global state for simple interactions

### `useEffect`

Used for browser-side effects and event lifecycle management.

Where and why:
- `components/StickyNav.tsx`
  - Registers a passive scroll listener to update `isScrolled`
  - Implements throttling with timeout to reduce render pressure
  - Cleans up listeners/timeouts on unmount

Production reasoning:
- Prevents memory leaks via cleanup
- Improves scroll performance with passive events and throttled updates

### `usePathname` (Next.js)

Used to derive the current route and mark active navigation items.

Where and why:
- `components/Sidebar.tsx`
  - Compares current pathname against configured navigation links
  - Applies active-state classes and `aria-current="page"`

Production reasoning:
- Keeps navigation state in sync with App Router route transitions
- Improves accessibility and orientation

### `dynamic` (Next.js)

Used for code splitting and deferring client-only heavy components.

Where and why:
- `components/SalesVelocityChartWrapper.tsx`
  - Dynamically imports `SalesVelocityChart`
  - Sets `ssr: false` for chart rendering compatibility
  - Provides a loading skeleton fallback

Production reasoning:
- Reduces initial JS payload
- Avoids server/client mismatch for chart libraries
- Improves first-load responsiveness

### `forwardRef` (React API)

Used in shared primitives to support ref forwarding from parent components.

Where and why:
- `components/ui/Button.tsx`
- `components/ui/Card.tsx`

Production reasoning:
- Enables integration with focus management, forms, and composition patterns
- Keeps UI primitives reusable and interoperable

## Accessibility and UX Notes

- Interactive elements use semantic buttons/links
- Focus rings are visible and keyboard accessible
- Active navigation state uses `aria-current`
- Motion has been constrained to short durations for reduced visual noise

## Deployment on Vercel

1. Push repository to GitHub
2. Import repo in Vercel dashboard
3. Set environment variables from `.env.example` as needed
4. Deploy with default Next.js settings

Vercel will run `npm run build` automatically.

## Scripts

```bash
npm run dev     # Development server
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Lint checks (if configured)
```

## Security and Data Safety

- No credentials are stored in source
- Demo data uses placeholder inventory information only
- No PII is included in mock records

## License

Private/internal use unless a license is added by the repository owner.
