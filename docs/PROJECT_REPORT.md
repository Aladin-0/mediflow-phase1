# MediFlow — Project Report
## Phase 1 · Build Progress Report
## Generated: 13 March 2026

---

## 1. PROJECT OVERVIEW

MediFlow is a modern Indian Pharmacy Management SaaS platform built for independent pharmacy owners, chains, and billing staff. It handles the complete pharmaceutical retail workflow: billing (POS), inventory tracking with batch/expiry management, purchase/GRN entry from distributors, credit (udhari) management, GST-compliant invoicing, staff attendance, and business analytics — all tailored for the Indian pharmacy regulatory environment including Schedule H/H1/X/Narcotic drug compliance, CGST/SGST calculation, and Indian drug license requirements.

**Target Users:** Independent pharmacy owners, store managers, billing counter staff in Indian retail pharmacies.

**Core Value Proposition:** Replace manual billing books and spreadsheets with a fast, compliant, offline-capable digital system purpose-built for Indian pharmacy workflows — without the complexity of generic ERP software.

**Tech Stack Summary:**
- **Frontend:** Next.js 14 + TypeScript + TanStack Query + Zustand + shadcn/ui + Tailwind CSS
- **Backend:** Django 4 + Django REST Framework + PostgreSQL + Redis
- **Infrastructure:** Docker Compose (4 services), Nginx (prod)

**Current Phase:** Phase 1 — Frontend MVP (Stages 1–9). Estimated 55% complete overall; frontend mock-mode is ~72% complete for the planned feature set.

---

## 2. TECH STACK (Exact Versions)

### Frontend (`apps/frontend/package.json`)

| Category | Package | Version |
|---|---|---|
| **Framework** | next | 14.2.15 |
| **Runtime** | react | 18.2.0 |
| **Runtime** | react-dom | 18.2.0 |
| **Language** | typescript | 5.4.5 |
| **UI Components** | shadcn/ui (Radix primitives) | various |
| **Styling** | tailwindcss | 3.4.1 |
| **State Management** | zustand | ^5.0.11 |
| **Data Fetching** | @tanstack/react-query | ^5.90.21 |
| **Tables** | @tanstack/react-table | ^8.21.3 |
| **Forms** | react-hook-form | ^7.71.2 |
| **Validation** | zod | ^4.3.6 |
| **Form Resolvers** | @hookform/resolvers | ^5.2.2 |
| **Charts** | recharts | ^3.8.0 |
| **HTTP Client** | axios | ^1.13.6 |
| **Date Utils** | date-fns | ^4.1.0 |
| **Offline DB** | dexie | ^4.3.0 |
| **PDF/Print** | @react-pdf/renderer | ^4.3.2 |
| **Print Helper** | react-to-print | ^2.15.1 |
| **Icons** | lucide-react | latest |
| **Command Menu** | cmdk | ^1.1.1 |
| **Drawer** | vaul | ^1.1.2 |
| **CSS Utils** | clsx | ^2.1.1 |
| **CSS Utils** | tailwind-merge | ^3.5.0 |
| **CSS Utils** | class-variance-authority | ^0.7.1 |
| **Debounce** | use-debounce | ^10.1.0 |
| **Themes** | next-themes | ^0.4.6 |
| **Testing** | jest | ^30.3.0 |
| **Testing** | ts-jest | ^29.4.6 |

### Backend

| Category | Detail |
|---|---|
| Framework | Django 4.x |
| API | Django REST Framework |
| Database | PostgreSQL 16 (Alpine) |
| Cache | Redis 7 (Alpine) |
| Auth | JWT (SimpleJWT) |
| CORS | django-cors-headers |
| Settings | Split: `mediflow.settings.dev` / `prod` |

### Infrastructure (docker-compose.yml)

| Service | Image | Port | Volume |
|---|---|---|---|
| postgres | postgres:16-alpine | 5432:5432 | postgres_data |
| redis | redis:7-alpine | 6379:6379 | redis_data |
| backend | custom (backend.Dockerfile) | 8000:8000 | ./apps/backend:/app |
| frontend | custom (frontend.Dockerfile) | 3000:3000 | ./apps/frontend:/app |

---

## 3. REPOSITORY STRUCTURE

```
mediflow_main/
├── docker-compose.yml          # Dev orchestration (4 services)
├── docker-compose.prod.yml     # Production orchestration
├── package.json                # Monorepo root (turbo)
├── turbo.json                  # Turborepo pipeline config
├── .env.example                # All required env variables
├── README.md                   # Project overview
│
├── docker/
│   ├── frontend.Dockerfile     # Next.js container
│   ├── backend.Dockerfile      # Django container
│   └── nginx.conf              # Prod reverse proxy config
│
├── packages/
│   ├── types/index.ts          # Shared TypeScript types (pkg)
│   └── constants/index.ts      # Shared constants (pkg)
│
├── docs/                       # Project documentation (this dir)
│   ├── PROJECT_REPORT.md
│   ├── STAFF_PINS.md
│   ├── API_REFERENCE.md
│   ├── COMPONENT_TREE.md
│   └── CHANGELOG.md
│
├── apps/
│   ├── backend/                # Django 4 API (not yet integrated)
│   │   ├── manage.py
│   │   ├── mediflow/
│   │   │   └── settings/
│   │   └── apps/
│   │
│   └── frontend/               # Next.js 14 App
│
└── frontend app structure:
    ├── app/
    │   ├── layout.tsx           # Root layout (fonts, providers)
    │   ├── page.tsx             # Redirect → /login
    │   ├── globals.css          # Tailwind base + custom CSS
    │   ├── providers.tsx        # QueryClient + Toaster
    │   ├── (auth)/login/        # Public login route
    │   └── dashboard/           # All protected routes
    │       ├── page.tsx         # Home KPI dashboard
    │       ├── billing/
    │       │   ├── page.tsx     # POS billing screen
    │       │   └── [id]/page.tsx# Invoice detail view
    │       ├── inventory/
    │       │   └── page.tsx     # Inventory with tabs
    │       ├── purchases/
    │       │   └── page.tsx     # Purchases list (shell)
    │       ├── customers/page.tsx  # Shell
    │       ├── credit/page.tsx     # Shell
    │       ├── staff/page.tsx      # Shell
    │       ├── reports/page.tsx    # Shell
    │       ├── settings/page.tsx   # Shell
    │       └── attendance/
    │           ├── page.tsx        # Shell
    │           └── mark/page.tsx   # Kiosk shell
    │
    ├── components/
    │   ├── billing/
    │   │   ├── BillingSearch.tsx
    │   │   ├── BillingCart.tsx
    │   │   ├── CustomerSelector.tsx
    │   │   ├── PaymentModal.tsx
    │   │   ├── ScheduleHModal.tsx
    │   │   └── InvoicePreviewModal.tsx
    │   ├── dashboard/
    │   │   ├── KPICards.tsx
    │   │   ├── HourlySalesChart.tsx
    │   │   ├── PaymentBreakdownChart.tsx
    │   │   └── TopSellingTable.tsx
    │   ├── inventory/
    │   │   ├── InventoryStatCards.tsx
    │   │   ├── StockTable.tsx
    │   │   ├── ExpiryTable.tsx
    │   │   ├── LowStockTable.tsx
    │   │   ├── BatchDetailDrawer.tsx
    │   │   └── StockAdjustmentModal.tsx
    │   ├── shared/
    │   │   ├── Sidebar.tsx
    │   │   ├── Header.tsx
    │   │   ├── Breadcrumb.tsx
    │   │   ├── OfflineBanner.tsx
    │   │   ├── PermissionGate.tsx
    │   │   ├── RoleBadge.tsx
    │   │   └── DashboardSkeleton.tsx
    │   └── ui/                  # shadcn UI primitives (27 files)
    │
    ├── hooks/
    │   ├── useDashboard.ts
    │   ├── useDebounce.ts
    │   ├── useInventory.ts
    │   ├── useInventoryFilters.ts
    │   ├── useKeyboardShortcuts.ts
    │   ├── useOutletId.ts
    │   ├── usePageTitle.ts
    │   ├── usePermissions.ts
    │   ├── usePrintInvoice.ts
    │   ├── useProductSearch.ts
    │   ├── usePurchases.ts
    │   ├── useSaveBill.ts
    │   └── use-toast.ts
    │
    ├── store/
    │   ├── authStore.ts
    │   ├── billingStore.ts
    │   └── settingsStore.ts
    │
    ├── lib/
    │   ├── api.ts               # Axios instance
    │   ├── apiClient.ts         # Exports (mock or real)
    │   ├── auth.ts              # Token helpers
    │   ├── export.ts            # CSV export util
    │   ├── gst.ts               # GST calculation engine
    │   ├── mockApi.ts           # All mock API functions
    │   ├── offline-db.ts        # Dexie IndexedDB
    │   ├── purchase-calculations.ts
    │   ├── queryClient.ts       # React Query config
    │   ├── utils.ts             # cn() helper
    │   └── validations/
    │       ├── auth.ts          # loginSchema
    │       ├── billing.ts       # scheduleHSchema
    │       ├── inventory.ts     # adjustmentSchema
    │       └── purchases.ts     # purchaseItemSchema etc.
    │
    ├── mock/
    │   ├── index.ts             # Barrel exports
    │   ├── organization.mock.ts
    │   ├── staff.mock.ts
    │   ├── products.mock.ts
    │   ├── customers.mock.ts
    │   ├── credit.mock.ts
    │   ├── distributors.mock.ts
    │   ├── purchases.mock.ts
    │   ├── sales.mock.ts
    │   └── dashboard.mock.ts
    │
    └── types/
        └── index.ts             # All 30+ TypeScript interfaces
```

---

## 4. FEATURES BUILT

### 4.1 Authentication & Auth Flow — ✅ Complete

- Phone + password login via `LoginForm.tsx`
- JWT token returned from mock (or Django when live)
- `authStore` (Zustand) persists user + outlet to `localStorage` key `mediflow-auth`
- Middleware redirects unauthenticated users to `/login`
- Mock cookie `mediflow_mock_auth` allows middleware bypass in dev
- Staff PIN verification in billing screen (4-digit PIN per bill)

**Key files:** `app/(auth)/login/`, `store/authStore.ts`, `middleware.ts`, `lib/auth.ts`

---

### 4.2 Dashboard Home — ✅ Complete

- KPI cards: Today's Sales, Bills Count, Total GST, Total Discount
- Hourly sales bar chart (Recharts)
- Payment mode pie chart (Cash/UPI/Card/Credit)
- Top-selling products table (TanStack Table)
- Low stock + expiry alerts from `mockAlertSummary`
- React Query with 5-minute stale time

**Key files:** `app/dashboard/page.tsx`, `components/dashboard/`, `hooks/useDashboard.ts`, `mock/dashboard.mock.ts`

---

### 4.3 Billing POS Screen — ✅ Complete

- Full-screen POS layout
- Product search with debounce (by name/composition/manufacturer)
- Add to cart, update qty/discount, remove items
- Customer selector with credit history shown
- Staff PIN verification gate before each bill
- Schedule H/H1/X/Narcotic detection → triggers `ScheduleHModal`
- Payment modal: Cash (with change), UPI (with ref), Card (type + last4), Credit, Split
- Live total calculation with CGST/SGST breakdown
- Invoice preview (A4 + Thermal 80mm layout)
- Print via `react-to-print`
- Success screen with invoice number

**Key files:** `app/dashboard/billing/page.tsx`, `components/billing/`, `store/billingStore.ts`, `lib/gst.ts`

---

### 4.4 Inventory Management — ✅ Complete

- Stock overview table with search + filters (schedule type, low/expiry)
- "Expiring Soon" tab (batches < 90 days)
- "Low Stock" tab (stock < reorder level) with Progress bar
- Stat cards: total products, low stock count, expiry alerts, stock value
- Batch Detail Drawer (slide-out) with full batch info
- Stock Adjustment Modal (damage/theft/correction/patient return)
  - Zod validation, reason field, staff attribution
- CSV export for each tab
- Keyboard shortcuts: `/` to search, `E` for Expiring tab
- PermissionGate on Adjust button (`manage_staff`)

**Key files:** `app/dashboard/inventory/page.tsx`, `components/inventory/`, `hooks/useInventory.ts`

---

### 4.5 Purchases / GRN Entry — 🔶 Partial

- Mock data complete: 5 invoices, 3 distributors, purchase calculations
- Mock API complete: `mockPurchasesApi`, `mockDistributorsApi`
- React Query hooks complete: `usePurchaseList`, `useCreatePurchase`, etc.
- Validation schemas complete: `purchaseItemSchema`, `createPurchaseSchema`, `distributorSchema`
- `lib/purchase-calculations.ts` complete
- **Pending:** purchases page components (GRN form, invoice list, distributor list, payment modal)

**Key files:** `mock/purchases.mock.ts`, `hooks/usePurchases.ts`, `lib/purchase-calculations.ts`

---

### 4.6 Credit / Udhari — ❌ Not Started
Shell page only at `/dashboard/credit`.

### 4.7 Customer Management — ❌ Not Started
Shell page only at `/dashboard/customers`.

### 4.8 Staff Management — ❌ Not Started
Shell page only at `/dashboard/staff`.

### 4.9 Attendance — ❌ Not Started
Shell page at `/dashboard/attendance` and `/dashboard/attendance/mark`.

### 4.10 Reports — ❌ Not Started
Shell page at `/dashboard/reports`.

### 4.11 Settings — ❌ Not Started
Shell page at `/dashboard/settings`. `settingsStore` exists for printer/sidebar preferences.

---

## 5. COMPONENTS CATALOGUE

### Shared Components

| Component | File | Purpose | Used In |
|---|---|---|---|
| `Sidebar` | `components/shared/Sidebar.tsx` | Left nav with all routes | Dashboard layout |
| `Header` | `components/shared/Header.tsx` | Top bar with breadcrumb + avatar | Dashboard layout |
| `Breadcrumb` | `components/shared/Breadcrumb.tsx` | Auto route breadcrumbs | Header |
| `OfflineBanner` | `components/shared/OfflineBanner.tsx` | Online/offline status + sync | Dashboard layout |
| `PermissionGate` | `components/shared/PermissionGate.tsx` | Hides children without permission | Billing, Inventory, Purchases |
| `RoleBadge` | `components/shared/RoleBadge.tsx` | Colored role label | Header, Staff pages |
| `DashboardSkeleton` | `components/shared/DashboardSkeleton.tsx` | Loading placeholder | Dashboard page |

### Dashboard Components

| Component | File | Purpose |
|---|---|---|
| `KPICards` | `components/dashboard/KPICards.tsx` | 4 metric cards (sales/bills/GST/discount) |
| `HourlySalesChart` | `components/dashboard/HourlySalesChart.tsx` | BarChart of hourly sales |
| `PaymentBreakdownChart` | `components/dashboard/PaymentBreakdownChart.tsx` | PieChart of payment methods |
| `TopSellingTable` | `components/dashboard/TopSellingTable.tsx` | TanStack Table of top products |

### Billing Components

| Component | File | Purpose |
|---|---|---|
| `BillingSearch` | `components/billing/BillingSearch.tsx` | Product search with results |
| `BillingCart` | `components/billing/BillingCart.tsx` | Cart with qty/discount editing |
| `CustomerSelector` | `components/billing/CustomerSelector.tsx` | Searchable customer combobox |
| `PaymentModal` | `components/billing/PaymentModal.tsx` | Multi-mode payment collection |
| `ScheduleHModal` | `components/billing/ScheduleHModal.tsx` | Doctor/patient details for Schedule drugs |
| `InvoicePreviewModal` | `components/billing/InvoicePreviewModal.tsx` | A4 + Thermal invoice preview + print |

### Inventory Components

| Component | File | Purpose |
|---|---|---|
| `InventoryStatCards` | `components/inventory/InventoryStatCards.tsx` | 4 inventory KPI cards |
| `StockTable` | `components/inventory/StockTable.tsx` | Full stock table with filters |
| `ExpiryTable` | `components/inventory/ExpiryTable.tsx` | Expiring batches table |
| `LowStockTable` | `components/inventory/LowStockTable.tsx` | Low stock table with Progress bars |
| `BatchDetailDrawer` | `components/inventory/BatchDetailDrawer.tsx` | Slide-out drawer with batch info |
| `StockAdjustmentModal` | `components/inventory/StockAdjustmentModal.tsx` | Stock adjustment form |

---

## 6. STATE MANAGEMENT

### authStore (`store/authStore.ts`)

| Field | Type | Description |
|---|---|---|
| `user` | `AuthUser \| null` | Logged-in user object |
| `outlet` | `Outlet \| null` | Selected outlet |
| `isAuthenticated` | `boolean` | Auth state flag |
| `isLoading` | `boolean` | Login loading state |
| `error` | `string \| null` | Auth error message |

**Actions:** `setUser`, `setOutlet`, `setLoading`, `setError`, `logout`

**Persisted to `localStorage` key `mediflow-auth`:** `user`, `outlet`, `isAuthenticated`

**Consumed by:** `LoginForm`, `Header`, `Sidebar`, `middleware`, `usePermissions`, all pages requiring `outletId`

---

### billingStore (`store/billingStore.ts`)

| Field | Type | Description |
|---|---|---|
| `cart` | `CartItem[]` | Current bill items |
| `activeStaff` | `StaffPinVerifyResponse \| null` | Staff who verified PIN |
| `isPinVerified` | `boolean` | Whether PIN has been entered |
| `customer` | `Customer \| null` | Selected customer |
| `doctor` | `Doctor \| null` | Selected doctor |
| `payment` | `PaymentSplit` | Payment details |
| `scheduleHData` | `ScheduleHData \| null` | Doctor details for Schedule H |
| `isCartOpen` | `boolean` | Cart panel toggle |
| `searchQuery` | `string` | Current product search |
| `lastInvoice` | `SaleInvoice \| null` | Last saved invoice (for print) |

**Computed methods:** `getTotals()` — full BillTotals, `hasScheduleHItems()`, `cartCount()`

**Not persisted** (session-only). **Consumed by:** `BillingPage`, `BillingCart`, `BillingSearch`, `PaymentModal`, `ScheduleHModal`, `InvoicePreviewModal`

---

### settingsStore (`store/settingsStore.ts`)

| Field | Type | Description |
|---|---|---|
| `selectedOutletId` | `string \| null` | Active outlet |
| `isSidebarCollapsed` | `boolean` | Sidebar state |
| `printerType` | `'a4' \| 'thermal_80mm' \| 'thermal_57mm'` | Invoice printer |
| `theme` | `'light'` | App theme (dark mode planned) |

**Persisted to `localStorage` key `mediflow-settings`:** all fields

---

## 7. API LAYER

See `docs/API_REFERENCE.md` for full function-level documentation.

**Architecture:** `lib/apiClient.ts` exports named API objects. When `NEXT_PUBLIC_USE_MOCK=true` (dev), each export points to the corresponding mock function in `lib/mockApi.ts`. When `false` (production), it would point to real Axios calls to `NEXT_PUBLIC_API_URL`.

```
authApi / productsApi / salesApi / creditApi /
dashboardApi / staffApi / inventoryApi /
purchasesApi / distributorsApi
```

---

## 8. DATA MODELS / TYPES

All defined in `types/index.ts`.

| Type | Key Fields | Used In |
|---|---|---|
| `StaffRole` | `super_admin \| admin \| manager \| billing_staff \| view_only` | Auth, permissions |
| `AuthUser` | id, name, phone, role, staffPin, outletId, outlet | authStore, all screens |
| `Outlet` | id, name, gstin, drugLicenseNo, city, state | authStore, invoice header |
| `Organization` | id, name, slug, plan | org-level features |
| `StaffMember` | id, role, staffPin, maxDiscount, canEditRate, canViewPurchaseRates | Staff management |
| `MasterProduct` | id, name, composition, scheduleType, gstRate, packSize | Billing, inventory |
| `Batch` | id, batchNo, expiryDate, mrp, purchaseRate, saleRate, qtyStrips | Billing, inventory |
| `ProductSearchResult` | extends MasterProduct + totalStock, batches[] | Product search |
| `Customer` | id, name, phone, creditLimit, outstanding, isChronic | Billing, credit |
| `CartItem` | batchId, name, qty, rate, discountPct, gstRate, totalAmount | billingStore |
| `BillTotals` | subtotal, discountAmount, taxableAmount, cgst, sgst, grandTotal | PaymentModal, invoice |
| `PaymentSplit` | method, amount, cashTendered, upiRef, splitBreakdown | PaymentModal |
| `ScheduleHData` | patientName, patientAge, doctorName, doctorRegNo | ScheduleHModal |
| `SaleInvoice` | id, invoiceNo, items, grandTotal, paymentMode, createdAt | Invoice detail |
| `CreditAccount` | customerId, totalOutstanding, status | Credit screen |
| `Distributor` | id, name, gstin, phone, creditDays, openingBalance | Purchases |
| `PurchaseInvoice` | id, distributorId, invoiceNo, grandTotal, outstanding, dueDate | Purchases list |
| `PurchaseItem` | masterProductId, batchNo, qty, purchaseRate, gstRate, totalAmount | GRN form |
| `PurchaseInvoiceFull` | extends PurchaseInvoice + items[], createdByName | GRN detail |
| `CreatePurchasePayload` | distributorId, invoiceNo, invoiceDate, items[] | GRN form submit |
| `DistributorLedgerEntry` | date, type, invoiceNo, amount, balanceAfter | Distributor drawer |
| `DashboardKPI` | totalSales, totalBills, topSellingItems[], hourlySales[] | Dashboard |
| `StockFilters` | search, scheduleType, lowStock, expiringSoon, sortBy | Inventory table |
| `StockAdjustmentPayload` | batchId, adjustmentType, qtyChange, reason | Adjustment modal |
| `ExpiryReportItem` | product, batch, daysRemaining | Expiry table |
| `PaginatedResponse<T>` | data: T[], pagination: { page, totalRecords } | All list APIs |

---

## 9. MOCK DATA CATALOGUE

| File | Contents | Records |
|---|---|---|
| `organization.mock.ts` | 1 org (Apollo Medical Store), 2 outlets | org-001, outlet-001, outlet-002 |
| `staff.mock.ts` | 5 staff members with PINs | staff-001 to staff-005 |
| `products.mock.ts` | 10 master products + 13 batches | prod-001 to prod-010 |
| `customers.mock.ts` | 6 customers (incl. Walk-in) | customer-001 to customer-walkin |
| `distributors.mock.ts` | 3 distributors | dist-001, dist-002, dist-003 |
| `purchases.mock.ts` | 5 purchase invoices | purchase-1 to purchase-5 |
| `sales.mock.ts` | Sample sale invoices | — |
| `credit.mock.ts` | Credit accounts + transactions | — |
| `dashboard.mock.ts` | KPI data + alert summary | — |

### All 10 Products

| ID | Name | Composition | Schedule | GST |
|---|---|---|---|---|
| prod-001 | Metformin 500mg Tablet | Metformin HCl 500mg | H | 12% |
| prod-002 | Paracetamol 500mg Tablet | Paracetamol 500mg | OTC | 12% |
| prod-003 | Alprazolam 0.25mg Tablet | Alprazolam 0.25mg | H1 | 12% |
| prod-004 | Amoxicillin 500mg Capsule | Amoxicillin Trihydrate 500mg | H | 12% |
| prod-005 | Pan-D Capsule | Pantoprazole 40mg + Domperidone 10mg | OTC | 12% |
| prod-006 | Azithromycin 500mg Tablet | Azithromycin 500mg | H | 12% |
| prod-007 | Dolo 650 Tablet | Paracetamol 650mg | OTC | 12% |
| prod-008 | Crocin Advance 500mg | Paracetamol 500mg | OTC | 12% |
| prod-009 | Atorvastatin 10mg | Atorvastatin Calcium 10mg | H | 12% |
| prod-010 | Becosules Capsule | Vitamin B Complex + Vitamin C | OTC | 0% |

### Staff PINs (see `docs/STAFF_PINS.md` for full card)

| Name | Role | PIN | Max Discount |
|---|---|---|---|
| Rajesh Patil | super_admin | **0000** | 30% |
| Priya Sharma | admin | **1234** | 20% |
| Rahul Kumar | manager | **2345** | 15% |
| Sunita Devi | billing_staff | **4821** | 10% |
| Amit Singh | billing_staff | **3567** | 5% |

### Distributors

| ID | Name | GSTIN | Credit Days | Outstanding |
|---|---|---|---|---|
| dist-001 | Ajanta Pharma Distributors | 27AAJCA1234B1Z3 | 30 | ₹30,900 |
| dist-002 | Sun Pharma Wholesale | 27AABCS1234C1Z7 | 45 | ₹10,600 |
| dist-003 | Cipla Direct | 27AAACC1234D1Z1 | 21 | ₹0 |

---

## 10. ROUTING MAP

| Route | Component File | Auth Required | Permission | Status |
|---|---|---|---|---|
| `/` | `app/page.tsx` | No | — | Redirects to /login |
| `/login` | `app/(auth)/login/page.tsx` | No | — | ✅ Complete |
| `/dashboard` | `app/dashboard/page.tsx` | Yes | view_outlet | ✅ Complete |
| `/dashboard/billing` | `app/dashboard/billing/page.tsx` | Yes | create_bills | ✅ Complete |
| `/dashboard/billing/[id]` | `app/dashboard/billing/[id]/page.tsx` | Yes | create_bills | ✅ Complete |
| `/dashboard/inventory` | `app/dashboard/inventory/page.tsx` | Yes | view_outlet | ✅ Complete |
| `/dashboard/purchases` | `app/dashboard/purchases/page.tsx` | Yes | create_purchases | 🔶 Shell |
| `/dashboard/purchases/new` | `app/dashboard/purchases/new/page.tsx` | Yes | create_purchases | ❌ Not built |
| `/dashboard/purchases/[id]` | `app/dashboard/purchases/[id]/page.tsx` | Yes | create_purchases | ❌ Not built |
| `/dashboard/customers` | `app/dashboard/customers/page.tsx` | Yes | view_outlet | 🔶 Shell |
| `/dashboard/credit` | `app/dashboard/credit/page.tsx` | Yes | override_credit | 🔶 Shell |
| `/dashboard/staff` | `app/dashboard/staff/page.tsx` | Yes | manage_staff | 🔶 Shell |
| `/dashboard/attendance` | `app/dashboard/attendance/page.tsx` | Yes | view_outlet | 🔶 Shell |
| `/dashboard/attendance/mark` | `app/dashboard/attendance/mark/page.tsx` | Yes | — (kiosk) | 🔶 Shell |
| `/dashboard/reports` | `app/dashboard/reports/page.tsx` | Yes | view_reports | 🔶 Shell |
| `/dashboard/settings` | `app/dashboard/settings/page.tsx` | Yes | manage_settings | 🔶 Shell |

---

## 11. PERMISSION SYSTEM

Defined in `hooks/usePermissions.ts`. Consumed via `usePermissions()` hook and `<PermissionGate permission="...">` component.

| Permission | super_admin | admin | manager | billing_staff | view_only |
|---|:---:|:---:|:---:|:---:|:---:|
| view_outlet | ✅ | ✅ | ✅ | ✅ | ✅ |
| create_bills | ✅ | ✅ | ✅ | ✅ | ❌ |
| create_purchases | ✅ | ✅ | ✅ | ❌ | ❌ |
| view_reports | ✅ | ✅ | ✅ | ❌ | ✅ |
| export_reports | ✅ | ✅ | ✅ | ❌ | ❌ |
| override_credit | ✅ | ✅ | ✅ | ❌ | ❌ |
| view_purchase_rates | ✅ | ✅ | ❌ | ❌ | ❌ |
| manage_staff | ✅ | ✅ | ❌ | ❌ | ❌ |
| manage_settings | ✅ | ✅ | ❌ | ❌ | ❌ |
| manage_outlets | ✅ | ✅ | ❌ | ❌ | ❌ |
| view_all_outlets | ✅ | ❌ | ❌ | ❌ | ❌ |

Note: `super_admin` has wildcard `['*']` — all permissions automatically granted.

---

## 12. VALIDATION SCHEMAS

| Schema | File | Key Fields | Rules |
|---|---|---|---|
| `loginSchema` | `lib/validations/auth.ts` | phone, password | phone: 10-digit Indian format; password: min 6 chars |
| `scheduleHSchema` | `lib/validations/billing.ts` | patientName, patientAge, patientAddress, doctorName, doctorRegNo, prescriptionNo | Required fields; age 1–120 |
| `adjustmentSchema` | `lib/validations/inventory.ts` | adjustmentType, qtyStrips, qtyLoose, reason | adjustmentType: enum; qty: coerce number int; reason: min 5 chars |
| `purchaseItemSchema` | `lib/validations/purchases.ts` | masterProductId, batchNo, expiryDate, qty, purchaseRate, mrp, saleRate | batchNo: uppercase alphanumeric; expiry > today; mrp >= purchaseRate; saleRate between purchaseRate and mrp |
| `createPurchaseSchema` | `lib/validations/purchases.ts` | distributorId, invoiceNo, invoiceDate, items[] | items: min 1; all header fields required |
| `distributorSchema` | `lib/validations/purchases.ts` | name, gstin, phone, creditDays | GSTIN: regex validated (Indian format); phone: 10–15 char; creditDays: 0–365 |

---

## 13. KEYBOARD SHORTCUTS

| Key | Screen | Action |
|---|---|---|
| `/` | Inventory | Focus search input |
| `E` | Inventory | Switch to Expiring tab |
| `L` | Inventory | Switch to Low Stock tab |
| `A` | Inventory | Switch to All Stock tab |
| `Ctrl+E` | Inventory | Export current tab to CSV |
| `Enter` | Payment Modal | Confirm payment (if valid) |
| `Alt+A` | GRN Form (planned) | Add new item row |
| `Tab` | GRN Form | Move between row fields |

Additional shortcuts are supported via the `useKeyboardShortcuts` hook which accepts a map of `key → callback`. Keys ignore input/textarea focus.

---

## 14. BUSINESS LOGIC DOCUMENTATION

### 14.1 GST Calculation (`lib/gst.ts`)

**`calculateItemTotals(mrp, rate, qty, discountPct, gstRate)`**

Uses backward GST calculation (standard in Indian pharmacy — rates are GST-inclusive):
```
discountedRate = rate × (1 - discountPct / 100)
rawTotal       = discountedRate × qty
taxableAmount  = rawTotal / (1 + gstRate / 100)   ← backward calc
gstAmount      = rawTotal - taxableAmount
```

**CGST/SGST Split:** GST is split 50/50 between CGST and SGST for intra-state transactions. IGST is used for inter-state (determined by `isInterState(fromState, toState)`).

**`calculateBillTotals(items[])`** — Aggregates all items, calculates grand total with `Math.round()` rounding and records the paise difference as `roundOff`.

**`formatCurrency(amount)`** — Formats as Indian locale: `₹1,23,456.78` using `Intl.NumberFormat('en-IN')`.

---

### 14.2 Purchase Calculations (`lib/purchase-calculations.ts`)

**`calculatePurchaseItem(item)`**
```
effectiveQty   = qty + freeQty
baseAmount     = qty × purchaseRate
taxableAmount  = baseAmount × (1 - discountPct/100)
gstAmount      = taxableAmount × (gstRate/100)
totalAmount    = taxableAmount + gstAmount
marginPct      = (saleRate - purchaseRate) / purchaseRate × 100
freeGoodsValue = freeQty × purchaseRate
```

**`calculatePurchaseTotals(items[])`** — Aggregates all items. CGST = SGST = totalGST / 2.

---

### 14.3 Billing Rules

- **Discount Cap:** `billingStore.applyDiscountToItem()` enforces `activeStaff.maxDiscount`. UI disables higher discounts.
- **Schedule H/H1/X/Narcotic:** Detected in `billingStore.getTotals()`. Any cart item with `scheduleType` in `['H', 'H1', 'X', 'Narcotic']` sets `hasScheduleH = true`. Items with `H1/X/Narcotic` set `requiresDoctorDetails = true`, blocking payment until `ScheduleHModal` is completed.
- **FIFO Batch Selection:** Mock products return batches sorted by expiry date ascending. The first batch is the "nearest expiry" and shown as the default. Full FIFO enforcement (blocking use of newer batches while old stock exists) is planned for Stage 16 (real API).
- **Credit Limit:** `PaymentModal` credit tab checks `customer.outstanding + creditGiven > customer.creditLimit` and shows an inline warning. Override requires `override_credit` permission.

---

## 15. OFFLINE CAPABILITIES

Implemented in `lib/offline-db.ts` using **Dexie** (IndexedDB wrapper).

**IndexedDB Database:** `MediFlowDB` version 1

**Table:** `offlineBills`
| Field | Type | Index |
|---|---|---|
| id | auto-increment | primary |
| payload | object | — |
| createdAt | string (ISO) | ✅ |
| status | `'pending' \| 'synced' \| 'failed'` | ✅ |
| retryCount | number | — |

**Offline Bill Queue Flow:**
1. Network goes offline → `OfflineBanner` appears (yellow)
2. Bill created → `saveOfflineBill(payload)` saves to IndexedDB as `pending`
3. Network restores → `OfflineBanner` shows "Sync" button
4. `syncOfflineBills(syncApiCall)` iterates pending bills, calls API for each
5. Success → status updated to `synced`
6. Failure → `retryCount++`; after 3 failures, status becomes `failed`

**What works offline:** Billing (queued), product search (last cached by React Query)

**Requires connection:** Dashboard KPIs, inventory sync, purchases, staff management

---

## 16. PRINT / INVOICE SYSTEM

**Components:** `components/billing/InvoicePreviewModal.tsx`

Contains two printable layouts:
- **A4 Layout** (`InvoiceA4`): Full-width invoice with GST breakdown table, header/footer, pharmacist signature block
- **Thermal 80mm Layout** (`InvoiceThermal`): Narrow layout, essential info only, styled for POS receipt printers

**Print Setup:** Uses `react-to-print`. A `ref` is attached to the invoice element. `handlePrint()` is called on button click, triggering browser print dialog with correct page styles.

**Printer Selection:** `settingsStore.printerType` (default: `thermal_80mm`) controls which layout is rendered. Can be changed in Settings (Stage 15).

**Invoice Content:** Invoice number, date, outlet info (name, address, GSTIN, drug license), customer details, line items (name/batch/expiry/qty/rate/GST/amount), CGST/SGST breakdown, grand total, payment method.

---

## 17. ENVIRONMENT VARIABLES

| Variable | Used In | Purpose | Example |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `lib/api.ts` | Backend API base URL | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_USE_MOCK` | `lib/apiClient.ts` | Toggle mock vs real API | `true` |
| `NEXT_PUBLIC_APP_NAME` | App layout | Application name | `MediFlow` |
| `NEXT_PUBLIC_APP_VERSION` | App layout | Version string | `1.0.0` |
| `SECRET_KEY` | Django settings | Django secret key | `changeme-in-production` |
| `DEBUG` | Django settings | Debug mode flag | `True` |
| `DATABASE_URL` | Django settings | PostgreSQL connection | `postgres://mediflow:mediflow@postgres:5432/mediflow` |
| `REDIS_URL` | Django settings | Redis connection | `redis://redis:6379/0` |
| `DJANGO_SETTINGS_MODULE` | Docker | Settings module path | `mediflow.settings.dev` |
| `CORS_ALLOWED_ORIGINS` | Django CORS | Allowed frontend origins | `http://localhost:3000` |
| `POSTGRES_DB` | Docker postgres | Database name | `mediflow` |
| `POSTGRES_USER` | Docker postgres | Database user | `mediflow` |
| `POSTGRES_PASSWORD` | Docker postgres | Database password | `mediflow` |
| `NODE_ENV` | Frontend Docker | Node environment | `development` |
| `CHOKIDAR_USEPOLLING` | Frontend Docker | File watch in Docker | `true` |

---

## 18. KNOWN LIMITATIONS & TODOS

| Location | Description | Planned Stage |
|---|---|---|
| `mock/purchases.mock.ts` | Items use the same 2 products for all invoices | Stage 9 fix |
| `components/inventory/ExpiryTable.tsx` | "Mark for Return" button is a no-op placeholder | Stage 8 follow-up |
| `components/inventory/BatchDetailDrawer.tsx` | "Add New Batch" button is a placeholder | Stage 9 (GRN flow) |
| `lib/validations/purchases.ts` | Expiry validation uses `Math.random()` workaround | Stage 9 cleanup |
| `lib/mockApi.ts` (inventoryApi.getStock) | `lowStock` filter logic needs refinement | Stage 9 |
| `store/billingStore.ts` | FIFO batch selection not enforced — manual batch pick | Stage 16 |
| `middleware.ts` | sessionStorage cannot be read in Edge middleware | Stage 16 |
| All shell pages | `customers`, `credit`, `staff`, `reports`, `settings`, `attendance` are stubs | Stages 10–15 |
| `components/billing/InvoicePreviewModal.tsx` | Thermal 57mm layout not implemented | Stage 15 |
| `store/settingsStore.ts` | Dark mode declared in type but not implemented | Stage 15 |

---

## 19. TESTING STATUS

| File | Tests | Status |
|---|---|---|
| `lib/__tests__/auth.test.ts` | Auth token helpers | ⚠️ Present, status unknown |
| `lib/__tests__/gst.test.ts` | GST calculation functions | ⚠️ Present, status unknown |

**No tests for:**
- All React components
- Billing store logic
- Mock API functions
- Validation schemas
- Inventory calculations
- Purchase calculations
- Hooks

Run tests: `cd apps/frontend && npm test`

---

## 20. WHAT'S LEFT — REMAINING STAGES

### Stage 9 (continued): Purchase Components — **High**
- `components/purchases/` — all components listed in Stage 9 spec
- GRN form, invoice list, distributor list, payment modal

### Stage 10: Credit / Udhari — **Medium**
- Credit accounts list, transaction history
- Record payment against outstanding
- WhatsApp reminder integration (future)
- Files: `components/credit/`, `hooks/useCredit.ts`

### Stage 11: Customers — **Low**
- Customer list with search + filters
- Customer profile page (purchase history, credit)
- Add/edit customer modal
- Files: `components/customers/`, `hooks/useCustomers.ts`

### Stage 12: Staff Management — **Medium**
- Staff list with roles
- Add/edit staff modal, PIN reset
- Staff performance dashboard
- Files: `components/staff/`, `hooks/useStaff.ts`

### Stage 13: Attendance (Kiosk Mode) — **High**
- Kiosk screen at `/attendance/mark` for self check-in
- Camera capture for check-in photo
- Admin attendance report
- Files: `components/attendance/`, `hooks/useAttendance.ts`

### Stage 14: Reports — **Very High**
- GST Report (GSTR-1 style)
- Sales Report (daily/monthly/custom range)
- Stock Valuation Report
- Purchase Register
- CSV + PDF export for all
- Files: `components/reports/`, `lib/report-generators.ts`

### Stage 15: Settings — **Medium**
- Outlet profile edit (GSTIN, drug license, logo)
- Printer type selection (A4/Thermal)
- Staff PIN management
- Tax settings (CGST/SGST vs IGST toggle)
- Theme selection (dark mode)

### Stage 16: Real Django API Integration — **Very High**
- Wire all API calls to real Django endpoints
- JWT auth flow (access + refresh tokens)
- WebSocket for real-time stock updates
- Remove `NEXT_PUBLIC_USE_MOCK=true`

### Stage 17: Testing + Deployment — **High**
- Jest tests for all components
- Playwright E2E tests for critical flows
- Production Docker build
- SSL + Nginx configuration
- Cloud deployment (AWS/GCP/Railway)

---

## 21. QUICK START GUIDE

### Prerequisites
- **Node.js:** v20+ (LTS)
- **Docker Desktop:** 4.x+
- **Git:** any recent version
- **OS:** Linux / macOS (Windows via WSL2)

### Setup

```bash
# 1. Clone repository
git clone <repo-url> mediflow_main
cd mediflow_main

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
sudo docker compose up --build

# This starts:
#   PostgreSQL on :5432
#   Redis on :6379
#   Django backend on :8000
#   Next.js frontend on :3000
```

### Access

| Service | URL |
|---|---|
| Frontend App | http://localhost:3000 |
| Backend API | http://localhost:8000/api/v1 |
| Django Admin | http://localhost:8000/admin |
| PostgreSQL | localhost:5432 (user: mediflow, db: mediflow) |

### Test Login

```
Phone:    9876543210
Password: password123
```

### Staff PINs for Testing

| Name | Role | PIN |
|---|---|---|
| Rajesh Patil | super_admin | 0000 |
| Priya Sharma | admin | 1234 |
| Rahul Kumar | manager | 2345 |
| Sunita Devi | billing_staff | 4821 |
| Amit Singh | billing_staff | 3567 |

### Development (without Docker)

```bash
cd apps/frontend
npm install
npm run dev       # http://localhost:3000
npm run type-check  # TypeScript check
npm test          # Jest tests
```

---

## 22. GLOSSARY

| Term | Definition |
|---|---|
| **GRN** | Goods Receipt Note — document recording medicines received from a distributor |
| **MRP** | Maximum Retail Price — the legal maximum price a medicine can be sold at in India |
| **Schedule H** | Drugs requiring doctor's prescription; cannot be sold OTC (e.g., antibiotics) |
| **Schedule H1** | Stricter prescription drugs with additional record-keeping requirements (e.g., some psychotropics) |
| **Schedule X** | High-potency drugs with strict state-level controls |
| **Narcotic** | Controlled substances under NDPS Act (e.g., codeine-based cough syrups) |
| **OTC** | Over The Counter — drugs that can be sold without prescription |
| **CGST** | Central GST — the central government's portion of GST (50% of total GST) |
| **SGST** | State GST — the state government's portion of GST (50% of total GST) |
| **IGST** | Integrated GST — applied for inter-state transactions (replaces CGST+SGST) |
| **HSN Code** | Harmonized System of Nomenclature — 4-digit code for drug classification for GST |
| **GSTIN** | GST Identification Number — 15-character unique tax ID for businesses |
| **Drug License** | Government license required to operate a pharmacy in India |
| **Udhari** | Hindi term for credit/dues — informal credit given to trusted customers |
| **Strip** | A blister pack of tablets (e.g., "1 strip = 10 tablets") |
| **Loose** | Individual tablets sold without a full strip |
| **FIFO** | First In First Out — stock management method: oldest batch sold first |
| **Rack Location** | Physical shelf/rack identifier for stock (e.g., "R-B3-Shelf2") |
| **Credit Days** | Number of days before a purchase invoice payment is due to the distributor |
| **UTR Number** | Unique Transaction Reference — ID for NEFT/RTGS payments |
| **UPI** | Unified Payments Interface — Indian digital payment standard (PhonePe, GPay, etc.) |
| **Credit Limit** | Maximum outstanding amount allowed for a customer |
| **Outstanding** | Unpaid amount owed (by customer or to distributor) |
| **Payables** | Amounts owed by the pharmacy to distributors |
| **Batch No** | Unique batch identifier assigned by manufacturer for traceability |
| **Pack Size** | Number of units in one pack/strip (e.g., 10 tablets/strip) |
| **Pack Type** | Container type: strip, bottle, tube, sachet, etc. |
| **Pack Unit** | Unit of dispensing: tablet, capsule, ml, gm, etc. |
| **Expiry Date** | Last date a medicine is safe and effective; must not be sold after this |
| **Purchase Rate** | Price at which pharmacy buys from distributor (before GST) |
| **Sale Rate** | Price at which pharmacy sells to customer |
