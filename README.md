# Northwind Customer Portal

A modern React-based dashboard for browsing Northwind customers and visualizing their order history.

---

## Getting Started

### Prerequisites

- Node.js 18+
- Northwind API running at `https://localhost:7250` (Swagger at `http://localhost:5226/swagger`)

### Install Dependencies

```bash
npm install
```

### Generate API Client

Ensure the backend is running, then execute:

```bash
npm run generate
```

This scaffolds a typed `typescript-fetch` client from the live Swagger spec into `src/api`.

### Start Development Server

```bash
npm run dev
```

---

## Section 4 — Component & Directory Architecture

All feature-specific UI components live under `src/components`:

| Path                               | Purpose                                                         |
| ---------------------------------- | --------------------------------------------------------------- |
| `src/components/CustomerTable.tsx` | Shadcn table with search, sort & pagination                     |
| `src/components/OrderDetails.tsx`  | Per-customer order breakdown                                    |
| `src/components/ui/`               | Shadcn primitive components (button, input, table, badge)       |
| `src/api/`                         | Auto-generated typed API client (managed by `npm run generate`) |

---

## Section 5 — Functional Requirements

- **Data Sourcing:** All data is consumed exclusively from the `NorthwindWs` API via the generated client in `src/api`. Static mocks are prohibited.
- **Customer Dashboard:** Shadcn-based table featuring:
  - Full-text search across ID, company, contact, city, country
  - Column sorting (ascending / descending) on all fields
  - Client-side pagination (10 rows per page)
- **Order Details:** Detailed order breakdown per customer fetched via `OrdersApi` from `src/api`, including dates, freight, ship-via, and computed status badge.

---

## Section 6 — UI/UX & Architecture

- **Vite Setup:** `react-ts` template with path aliases (`@/` → `src/`).
- **Styling:** Tailwind CSS with Shadcn UI design tokens (CSS variables).
- **Service Layer:** All data fetching uses generated class instances (`CustomersApi`, `OrdersApi`) from `src/api`.
- **Environment:** API base URL stored in `.env`:
  ```
  VITE_API_BASE_URL=https://localhost:7250
  ```
  Referenced in `src/lib/apiConfig.ts` via `import.meta.env.VITE_API_BASE_URL`.

---

## Section 7 — Execution Steps

1. **Initialization:** Vite project created with the `react-ts` template; Tailwind CSS and Shadcn UI installed and configured.
2. **API Generation:** `npm run generate` is configured in `package.json` and generates the typed client from `http://localhost:5226/swagger/v1/swagger.json` into `src/api`.
3. **Component Scaffolding:** `CustomerTable` and `OrderDetails` built inside `src/components` using typed models from the generated client.
4. **Integration:** Components connect to live `NorthwindWs` endpoints via `CustomersApi` and `OrdersApi` instantiated with `apiConfig`.
5. **Validation:** Confirm `.env` contains the correct `VITE_API_BASE_URL`, run `npm run generate` while the API is live, then `npm run dev` to verify end-to-end data flow.
