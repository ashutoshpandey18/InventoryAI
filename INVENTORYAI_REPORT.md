# InventoryAI — System Analysis & Next Steps

This document captures a concise, actionable analysis of the current repository state for InventoryAI, followed by a strict build plan to reach a Minimum Working Product (MWP).

---

## 1. Current State Analysis

- Backend: Prisma schema (User, Store, Product, Inventory, Sale, Prediction) is implemented. Database migrations applied.
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` implemented (JWT cookie auth).
- Stores: `GET /api/stores`, `POST /api/stores` implemented (owner-scoped).
- Products: Full CRUD implemented under `app/api/products` with store ownership checks.
- Inventory: `GET` inventory by store and `PATCH` updates (quantity, reorderPoint).
- Sales: `POST /api/sales` (records sale, decrements inventory), `GET /api/sales` implemented.
- Dashboard: `GET /api/dashboard?storeId=` implemented; aggregates summary, low-stock, reorder suggestions, dead stock, fast-movers.
- Predictions: `GET/POST /api/predictions` implemented; uses 30-day sales average to suggest reorder qty (7-day forecast default).
- Assistant: `POST /api/assistant` rule-based natural-language intent detection returning dashboard-derived answers.
- Services: service layer present for auth, store, product, inventory, sales, prediction, assistant, dashboard.
- Frontend: pages for sign-in, signup, dashboard, products, sales, analytics and settings — most pages call the backend via `fetch` and are connected to APIs.

### What is present in repo (non-exhaustive)
-+- Prisma migrations in `prisma/migrations` and `prisma/schema.prisma`.
-+- Service files in `services/` handling business logic and predictions.
-+- Validators using Zod for request validation in server routes.
-+- Middleware utilities for `requireAuth`, `requireStoreOwnership`, and `requireProductOwnership`.

---

## 2. What the product can do RIGHT NOW (if deployed)

- Users can register and log in.
- Authenticated users can create stores and manage multiple stores.
- Users can add, edit, delete products for a store.
- Inventory per product exists (quantity + reorder point); stock can be adjusted.
- Sales can be recorded and persist (inventory decremented transactionally).
- Dashboard shows KPI summary, low-stock items, reorder suggestions, dead stock, and fast-moving items.
- A rule-based AI assistant answers simple natural-language queries about inventory/ordering using dashboard data.

In short: the core Store → Product → Sale → Dashboard loop functions end-to-end.

---

## 3. Identified Gaps (precise, not guessed)

CRITICAL / IMPORTANT gaps:

- Dev server must be started to run the app locally — verify `npm run dev`.
- Ensure test data exists (scripts are present: `create-test-user.mjs`, `setup-test-data.js`). If not executed, demo flows lack data.
- Role-based enforcement (OWNER/MANAGER/STAFF) is defined in schema but middleware lacks fine-grained role checks.
- Password reset and email verification flows are not implemented.
- Prediction recalculation runs on sale events; no scheduled recalculation exists for inactive products.
- Inventory change audit (who/when) is missing.
- No bulk import (CSV) for product onboarding.
- Notifications (email or in-app) for low-stock are not implemented.

LATER / Nice-to-have (ignore for MVP): supplier management, PO generation, advanced ML forecasting, mobile app.

---

## 4. Minimum Working Product (MWP) — smallest loop

The smallest working loop to ship a demoable SaaS:

1. User registration + login (existing)
2. Create a store (existing)
3. Create products with inventory (existing)
4. Record sales which decrement inventory (existing)
5. Dashboard that reflects inventory and shows reorder suggestions (existing)

All five items are implemented; the remaining work is execution (start server, load test data, verify UI flows).

---

## 5. Next Build Plan — Strict, step-by-step, executable

PHASE 1 — Get it running and validated (CRITICAL)

Step 1: Start dev server
- Run: `npm install` (if not installed) then `npm run dev`.
- Priority: CRITICAL

Step 2: Create test admin user
- Run: `node create-test-user.mjs` (script exists in repo).
- Priority: CRITICAL

Step 3: Verify login and cookie behavior
- Open `http://localhost:3000/signin` and log in with `admin@inventory.ai` / `admin123`.
- Priority: CRITICAL

Step 4: Create a store via UI
- Use Dashboard → Create Store modal.
- Priority: CRITICAL

Step 5: Add 3 products (with initial stock and reorderPoint)
- Use Products page; verify inventory records created.
- Priority: CRITICAL

Step 6: Record 5 sales entries via Sales page
- Confirm inventory decremented and predictions generated.
- Priority: CRITICAL

Step 7: Validate dashboard analytics and assistant
- Query `/api/dashboard?storeId=` and test Assistant with a question like “What should I reorder?”
- Priority: CRITICAL

PHASE 2 — UX Stabilization (IMPORTANT)

Step 8: Add empty states and loading skeletons to product/analytics pages
- Files: `app/dashboard/products/page.tsx`, `app/dashboard/analytics/page.tsx`, `app/dashboard/page.tsx`.
- Priority: IMPORTANT

Step 9: Add API error handling (client-side) for failed fetches
- Update top-level fetch calls to show friendly error UI.
- Priority: IMPORTANT

Step 10: Add role checks in middleware where appropriate
- Enforce role for destructive operations (store delete) using existing `User.role`.
- Priority: IMPORTANT

PHASE 3 — Production readiness (IMPORTANT → CRITICAL)

Step 11: Add basic monitoring/logging and deploy to Vercel
- Prepare environment variables, database URL (Neon), and `prisma migrate deploy` on deploy.
- Priority: CRITICAL

Step 12: Add password reset and email verification flows (OTP or token)
- Integrate SMTP provider or SendGrid for transactional emails.
- Priority: IMPORTANT

Step 13: Implement low-stock notifications (emails or in-app)
- Use a simple scheduler or background job to check predictions and send alerts.
- Priority: IMPORTANT

---

## 6. Priority Rules (summary)

- CRITICAL: Start server, create test data, verify full loop, deploy to Vercel.
- IMPORTANT: UX empty states, error handling, role enforcement, monitoring, password reset.
- LATER: Bulk import, supplier/PO features, advanced ML forecasting, mobile-specific work.

---

## 7. What to IGNORE right now

- Machine learning model development — prediction logic is sufficient for v1.
- Advanced scaling and microservices.
- Real-time websockets and push systems.
- Complex caching or optimization.
- Overly broad refactors or tech changes.

---

## 8. Final 3-line Summary

- Where you are stuck: The codebase is feature-complete but not executed — start server and load test data.
- What to do next: Run `npm run dev`, `node create-test-user.mjs`, then exercise Store → Products → Sales → Dashboard flows.
- What success looks like in 2–3 days: Local demo with working dashboard, empty-state UX added, and production deployment planned.

---

If you want, I can now:
- start the dev server for you and run the test user script, or
- add a small README section to `README.md` with quick run steps and demo credentials.

---
Generated on: 2026-04-02