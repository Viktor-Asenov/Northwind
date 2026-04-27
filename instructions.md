# Frontend Specification: Northwind Customer Portal

## 1. Project Overview

A modern React-based dashboard for browsing Northwind customers and visualizing their order history using Vite.

---

## 2. Technical Stack

- **Framework:** React 18+ with **Vite**.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS + Shadcn UI.
- **API Client:** `typescript-fetch` (auto-generated).

---

## 3. Local Development & Scripts

The following scripts must be defined in `package.json`:

- **npm run dev:** Starts the Vite development server.
- **npm run generate:** Scaffolds the typed API client.
  - **Source:** `http://localhost:5226/swagger/v1/swagger.json`
  - **Output Path:** `src/api` (This directory will be managed by the generator).

**PowerShell Command for `npm run generate`:**

```powershell
npx @openapitools/openapi-generator-cli generate `
  -i http://localhost:5226/swagger/v1/swagger.json `
  -g typescript-fetch `
  -o ./src/api `
  --additional-properties=typescriptThreePlus=true


```

## 4. Component & Directory Architecture

**CRITICAL:** All newly created UI components and features must follow this directory structure to ensure modularity:

- **UI Components Output-Directory:** `src/components`
- **API Layer Output-Directory:** `src/api`
- **Logic Rule:** AI Agent must place all feature-specific components (tables, cards, forms) inside `src/components`.

---

## 5. Functional Requirements

- **Data Sourcing:** Must consume data **only** from the `NorthwindWs` API client. Static mocks are strictly prohibited.
- **Customer Dashboard:** Implement a Shadcn-based table with search functionality, pagination, and sorting.
- **Order Details:** Detailed breakdown of orders fetched via the generated client services from `src/api`.

---

## 6. UI/UX & Architecture

- **Vite Setup:** `react-ts` template.
- **Service Layer:** Use generated client classes from `src/api` for all data fetching.
- **Environment:** Store the API base URL (`https://localhost:7250`) in a `.env` file and reference it via `import.meta.env`.

---

## 7. AI Agent Execution Steps

1. **Initialization:** Initialize Vite project and install Tailwind CSS and Shadcn UI.
2. **API Generation:** Configure `npm run generate` in `package.json` and execute the command to create the client in `src/api`.
3. **Component Scaffolding:** Build the UI components within `src/components` using the typed models from the generated client.
4. **Integration:** Connect the frontend components to the live `NorthwindWs` endpoints.
5. **Validation:** Finalize environment and connection tests.
