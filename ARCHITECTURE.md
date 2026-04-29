# InventoryAI — Full Product & System Architecture

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Product Architecture Overview](#2-product-architecture-overview)
3. [Feature Breakdown](#3-feature-breakdown)
4. [Backend Architecture](#4-backend-architecture)
5. [Database Design](#5-database-design)
6. [Authentication & Security Data Flow](#6-authentication--security-data-flow)
7. [Demand Prediction Engine](#7-demand-prediction-engine)
8. [AI Assistant Architecture](#8-ai-assistant-architecture)
9. [In-Memory Caching Layer](#9-in-memory-caching-layer)
10. [System Scaling Strategy](#10-system-scaling-strategy)
11. [System Flow Diagram](#11-system-flow-diagram)

---

## 1. Product Vision

**InventoryAI** is a multi-tenant SaaS platform targeting B2B and B2C retail operators. The product solves the core operational failure mode of small-to-mid-sized retail businesses: reactive, spreadsheet-based inventory management that leads to stockouts, dead stock accumulation, and missed reorder windows.

**Core value proposition:**
- Predict when products will run out before they do
- Surface actionable reorder quantities per product
- Identify dead stock tying up capital
- Provide a natural-language assistant interface for non-technical operators

**User personas:**
- **Store Owner (OWNER role)** — creates stores, owns all data, full access
- **Store Manager (MANAGER role)** — operational access, no store deletion
- **Staff (STAFF role)** — limited read/entry access

---

## 2. Product Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│                     VERCEL (CDN + Serverless)           │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Next.js 14 App Router               │   │
│  │                                                   │   │
│  │  ┌──────────────┐   ┌───────────────────────┐   │   │
│  │  │  Landing UI   │   │   Dashboard App        │   │
│  │  │  (page.tsx)   │   │   (app/dashboard/*)    │   │
│  │  └──────────────┘   └───────────────────────┘   │   │
│  │                                                   │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │         API Routes (app/api/*)            │   │   │
│  │  │   auth | stores | products | sales        │   │   │
│  │  │   dashboard | predictions | assistant     │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  │                                                   │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │       Service Layer (services/*)          │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────┘   │
│                          │ Prisma ORM                    │
│                          ▼                               │
│             ┌──────────────────────┐                    │
│             │   Neon PostgreSQL     │  (cloud)           │
│             └──────────────────────┘                    │
└────────────────────────────────────────────────────────┘
```

**Local development counterpart:**
- PostgreSQL 16-alpine via Docker Compose (port 5433)
- Database name: `smart_inventory_db`

---

## 3. Feature Breakdown

| Feature | Status | Description |
|---|---|---|
| Multi-store management | ✅ Live | One user owns N stores; store-scoped all data |
| Product catalogue | ✅ Live | SKU, name, unit, per-store unique constraint |
| Inventory tracking | ✅ Live | Quantity + reorder point per product (1:1) |
| Sales recording | ✅ Live | Quantity + total amount + timestamp per sale |
| Low stock alerts | ✅ Live | Reorder point check + days-left threshold |
| Reorder suggestions | ✅ Live | Suggested qty from prediction or rolling avg |
| Dead stock detection | ✅ Live | Products with no sales in 30-day window |
| Fast-moving items | ✅ Live | avgDailySales ≥ 5 units/day |
| Dashboard summary | ✅ Live | 4 KPI cards + 4 tabbed data tables |
| AI Assistant | ✅ Live (rule-based) | Intent detection → dashboard data in prose |
| Demand forecasting | ✅ Live | Stored `Prediction` records, 7-day window |
| Responsive UI | ✅ Live | Mobile-first, all breakpoints |
| Role-based access | 🔄 Schema ready | OWNER / MANAGER / STAFF roles defined |

---

## 4. Backend Architecture

### Layer Structure

```
app/api/*          →  Route handlers (HTTP boundary, validation, error mapping)
services/*         →  Business logic (pure functions on Prisma client)
lib/               →  Cross-cutting: auth, cache, env, middleware guards
validators/*       →  Zod schemas (input contract enforcement)
prisma/            →  Schema + migrations
```

### API Surface

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Login, sets `auth_token` cookie |
| POST | `/api/auth/logout` | Public | Clears `auth_token` cookie |
| GET | `/api/auth/me` | Required | Returns current user profile |
| GET | `/api/stores` | Required | Lists user's stores |
| POST | `/api/stores` | Required | Creates new store |
| GET | `/api/products` | Required | Lists products for a store |
| POST | `/api/products` | Required | Creates product |
| GET | `/api/sales` | Required | Lists sales for a store |
| POST | `/api/sales` | Required | Records a new sale |
| GET | `/api/dashboard?storeId=` | Required + Owner | Full dashboard computation |
| GET/POST | `/api/predictions` | Required | On-demand demand forecasting |
| POST | `/api/assistant` | Required + Owner | Natural-language query |
| GET | `/api/health` | Public | Liveness probe |

### Validation Strategy

Every mutating endpoint uses a **Zod schema** defined in `validators/`. Parsing happens before service calls. Invalid input returns HTTP 400 with `{ error, details }`. This prevents invalid state from ever reaching the service layer or database.

---

## 5. Database Design

### Schema (Prisma / PostgreSQL)

```
User
─────────────────────────────
id           UUID  PK
email        String  UNIQUE
name         String?
password     String?   (bcrypt hash, SALT_ROUNDS=12)
role         Enum  (OWNER | MANAGER | STAFF)  default OWNER
createdAt    DateTime
stores       Store[]

Store
─────────────────────────────
id           UUID  PK
name         String
slug         String  UNIQUE
ownerId      UUID  → User.id
products     Product[]
sales        Sale[]

Product
─────────────────────────────
id           UUID  PK
storeId      UUID  → Store.id
name         String
sku          String
unit         String  (e.g. "pcs", "kg")
inventory    Inventory?  (1:1)
sales        Sale[]
predictions  Prediction[]
UNIQUE(storeId, sku)

Inventory
─────────────────────────────
id           UUID  PK
productId    UUID  UNIQUE  → Product.id  (enforces 1:1)
quantity     Int
reorderPoint Int

Sale
─────────────────────────────
id           UUID  PK
storeId      UUID  → Store.id
productId    UUID  → Product.id
quantity     Int
totalAmount  Decimal(12,2)
soldAt       DateTime
INDEX(storeId, soldAt)
INDEX(productId, soldAt)

Prediction
─────────────────────────────
id              UUID  PK
productId       UUID  → Product.id
predictedDemand Int
forecastDate    DateTime
createdAt       DateTime
INDEX(productId)
INDEX(productId, createdAt)
INDEX(productId, forecastDate)
```

### Design Decisions

- **Inventory as a separate 1:1 table** — Keeps the product catalogue clean; inventory-only writes are cheaper without touching the product row.
- **`Sale.storeId` denormalized** — Also accessible via `Product.storeId`, but the denormalized field enables efficient store-level sales queries without a join through `Product`.
- **Compound indexes on `(storeId, soldAt)` and `(productId, soldAt)`** — Directly target the 30-day rolling window aggregation queries run on every dashboard load.
- **`Prediction` as append-only records** — Stores historical forecasts immutably. The dashboard reads the latest per product via `distinct: ["productId"], orderBy: { createdAt: "desc" }`.

---

## 6. Authentication & Security Data Flow

```
Browser          Edge Middleware           API Route           Service
  │                    │                       │                  │
  │── POST /login ─────────────────────────>  │                  │
  │                    │               validate Zod               │
  │                    │               bcrypt.compare()          │
  │                    │               generateToken()            │
  │                    │               setAuthCookie()            │
  │<── 200 { user } ──────────────────────────│                  │
  │    [HttpOnly auth_token cookie set]        │                  │
  │                    │                       │                  │
  │── GET /dashboard ──>                       │                  │
  │                jose.jwtVerify()            │                  │
  │                (Edge Runtime)              │                  │
  │                    │ valid                 │                  │
  │                    │──────────────────────>│                  │
  │<── 200 HTML ───────│                       │                  │
  │                    │                       │                  │
  │── GET /api/dashboard?storeId=xxx ──────>  │                  │
  │                    │               requireAuth()              │
  │                    │               requireStoreOwnership()    │
  │                    │               cache.get()                │
  │                    │                       │──getDashboard()─>│
  │<── 200 { summary, lowStock, ... } ─────── │                  │
```

### Security Controls

| Control | Implementation |
|---|---|
| **HttpOnly cookie** | `auth_token` is inaccessible to JavaScript — eliminates XSS token theft |
| **SameSite=lax** | CSRF mitigated without explicit CSRF tokens |
| **Secure flag** | Only set in `NODE_ENV=production` |
| **JWT TTL** | 7 days, verified on every protected request |
| **Dual JWT libraries** | `jsonwebtoken` in Node.js runtime (API routes), `jose` in Edge runtime (middleware) — same `JWT_SECRET` |
| **Ownership guard** | `requireStoreOwnership()` runs on every store-scoped API call — prevents IDOR |
| **bcrypt SALT_ROUNDS=12** | ~400ms hash time, resistant to brute-force |
| **Production error masking** | Returns generic "Internal server error" in production, not stack traces |
| **JWT_SECRET length enforcement** | Minimum 32 chars validated at startup in production via `validateEnvironment()` |

---

## 7. Demand Prediction Engine

The prediction engine uses a **30-day rolling sales velocity** model. It is a deterministic algorithm — no ML model is involved currently. The design is intentionally structured to slot an ML model in later without changing the API contract.

### Core Formula

```
avgDailySales        = totalUnitsSoldLast30Days / 30
daysLeft             = currentStockQty / avgDailySales
                       → null if avgDailySales = 0 (no sales history)

suggestedReorderQty  = ceil(avgDailySales × 7 + 5)
  FORECAST_DAYS = 7
  SAFETY_BUFFER = 5
```

### Classification Thresholds

| Classification | Condition |
|---|---|
| **Low Stock** | `quantity ≤ reorderPoint` OR `daysLeft ≤ 3` |
| **Reorder Now** | Same filter as Low Stock (reorder suggestions are the actionable form) |
| **Dead Stock** | No sales in last 30 days AND `quantity > 0` |
| **Fast Moving** | `avgDailySales ≥ 5` units/day |

### PredictionService vs DashboardService

| | `PredictionService` | `DashboardService` |
|---|---|---|
| **Trigger** | On-demand via `POST /api/predictions` or when a sale is recorded | Every `GET /api/dashboard` request |
| **Persists to DB?** | Yes — writes a `Prediction` row | No — computed in memory |
| **Relationship** | Generates stored predictions | Reads them via `predictionMap` |

When a `Prediction` record exists for a product, `getReorderSuggestions()` uses `prediction.predictedDemand` as the suggested quantity. Otherwise it falls back to the formula above.

---

## 8. AI Assistant Architecture

The assistant is a **rule-based NLU system**, not a generative LLM. It is structured so it can be replaced by an LLM call at a future point with zero changes to the API contract.

### Request Flow

```
POST /api/assistant  { storeId, question }
         │
         ├─ requireAuth()
         ├─ requireStoreOwnership()
         ├─ assistantService.handleQuery(storeId, question)
         │         │
         │         ├─ detectIntent(question)   ← keyword matching
         │         │     → "reorder" | "risk" | "deadstock"
         │         │        "fastmoving" | "summary" | "unknown"
         │         │
         │         ├─ dashboardService.getDashboardData(storeId)
         │         │     (full dashboard computation on every query)
         │         │
         │         └─ buildXxxResponse(dashboardData)
         │               → { answer: string, data: any }
         │
         └─ NextResponse.json({ answer, data })
```

### Intent Detection Keywords

| Intent | Trigger words |
|---|---|
| `reorder` | reorder, order, buy, purchase, stock up |
| `risk` | risk, low stock, running out, stockout, almost empty |
| `deadstock` | dead, not selling, slow moving, stagnant, unused |
| `fastmoving` | fast, best, top, popular, selling well, high demand |
| `summary` | summary, overview, status, how, doing |
| `unknown` | anything else → fallback: "I can only answer inventory questions" |

### Future LLM Migration Path

The `detectIntent()` and `buildXxxResponse()` methods can be replaced by a single `llm.complete(systemPrompt + dashboardContext + question)` call. The dashboard data object already serves as the retrieval-augmented context — effectively a pre-built RAG payload ready for LLM consumption.

---

## 9. In-Memory Caching Layer

`lib/cache.ts` implements a simple TTL cache backed by a JavaScript `Map`.

```
cache.set("dashboard:{storeId}", data, 60)   // 60-second TTL
cache.get("dashboard:{storeId}")             // returns null if expired
cache.cleanup()                              // runs every 5 minutes via setInterval
```

### Current Limitations

- **Not distributed** — Cache is per-process. On Vercel, each serverless function instance has its own cache. Multiple instances = no cross-instance sharing = cache miss rate effectively 100% under load.
- **No write-through invalidation** — If a new sale is recorded, the stale dashboard cache for that store is not evicted.

### Production Upgrade Path

Replace the `cache.ts` implementation with an Upstash Redis client. The call site in `app/api/dashboard/route.ts` only calls `cache.get(key)` and `cache.set(key, data, ttl)` — no changes needed outside `lib/cache.ts`.

---

## 10. System Scaling Strategy

### Current State (Vercel + Neon)

| Concern | Current Approach |
|---|---|
| **Compute** | Vercel serverless — auto-scales, cold starts ~200ms |
| **Database** | Neon serverless PostgreSQL — connection pooling built-in |
| **Sessions** | Stateless JWT — no session server needed |
| **Cache** | In-memory per instance — not distributed |
| **Assets** | Vercel CDN — Next.js static generation for landing pages |

### Identified Bottlenecks

**1. Dashboard computation cost**
Each dashboard load runs 3 database queries (product+inventory join, prediction findMany, sales groupBy). At 1,000 concurrent users this is ~3,000 queries/second.
→ Mitigation: Upstash Redis cache so most requests are served without hitting the DB.

**2. In-memory cache**
The current `SimpleCache` provides no cross-instance benefit on Vercel serverless.
→ Mitigation: Replace with Upstash Redis, no call-site changes required.

**3. Synchronous prediction recalculation**
`PredictionService.recalculatePrediction()` runs inline on demand.
→ Mitigation: Move to a Vercel Cron job that pre-computes predictions nightly per store.

**4. No pagination**
`prisma.product.findMany()` has no `take`/`skip`. For stores with thousands of SKUs, this becomes a memory and latency problem.
→ Mitigation: Add `?page=&limit=` parameters to all list endpoints.

### Scaling Roadmap

| Phase | Action |
|---|---|
| Phase 1 | Replace in-memory cache with Upstash Redis |
| Phase 2 | Add pagination to all list endpoints |
| Phase 3 | Move prediction recalculation to Vercel Cron (nightly) |
| Phase 4 | Integrate real LLM (OpenAI API) for the assistant |
| Phase 5 | Add webhook / push notifications for stockout events |

---

## 11. System Flow Diagram

```
─────────────────────────────────────────────────────────────────────────────
USER BROWSER
─────────────────────────────────────────────────────────────────────────────
     │
     │  Visit / (landing)
     ├──────────────── Static HTML from Vercel CDN ──────────────────────────>
     │
     │  Visit /signin → POST /api/auth/login
     │  ◄── HttpOnly cookie "auth_token" (JWT HS256, 7d TTL) ───────────────
     │
     │  Visit /dashboard
     │  ──► Edge Middleware (jose.jwtVerify)  →  PASS  →  SSR page served
     │
     │  Page load: GET /api/stores
     │  ──► requireAuth()  →  storeService.getStoresByOwner(userId)  →  DB
     │  ◄── [ { id, name, slug }, ... ]
     │
     │  Select store: GET /api/dashboard?storeId=xxx
     │  ──► requireAuth()
     │  ──► requireStoreOwnership()  →  DB (ownerId check)
     │  ──► cache.get("dashboard:xxx")
     │       └─ MISS ──► dashboardService.getDashboardData(storeId)
     │                       ├── prisma.product.findMany  (+ inventory join)
     │                       ├── prisma.prediction.findMany  (latest per product)
     │                       └── prisma.sale.groupBy  (last 30 days, sum qty)
     │                       → compute: avgDailySales, daysLeft per product
     │                       → classify: lowStock, deadStock, fastMoving, reorder
     │       └─ cache.set(key, data, 60s)
     │  ◄── { summary, lowStockItems, reorderSuggestions,
     │         deadStockItems, fastMovingItems }
     │
     │  Ask assistant: POST /api/assistant { storeId, question }
     │  ──► detectIntent(question)  →  keyword match
     │  ──► getDashboardData(storeId)  →  DB queries (same as above)
     │  ──► buildXxxResponse(data)  →  prose answer + structured data
     │  ◄── { answer: "You should reorder 3 products today: ...", data }
     │
─────────────────────────────────────────────────────────────────────────────
DATA LAYER:   PostgreSQL (Neon)  ─  6 tables  ─  Prisma ORM 5.22
CACHE LAYER:  In-memory Map (60s TTL)  →  future: Upstash Redis
AUTH LAYER:   JWT HS256 (7d)  +  HttpOnly SameSite cookie  +  bcrypt(12)
EDGE LAYER:   Next.js middleware (jose)  →  route protection before SSR
─────────────────────────────────────────────────────────────────────────────
```

---

*Last updated: March 2026 — reflects codebase state at commit `6e49f2a`.*
