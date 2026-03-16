# MediFlow Backend Implementation Plan

## Goal Description
Develop a robust, atomic, and secure Django/PostgreSQL backend for the MediFlow pharmacy management software. The backend must strictly implement the business logic provided in the backend documentation, accurately map to the frontend interfaces defined in `packages/types/index.ts`, and match the architectural rigor of industry-standard systems like **Marg ERP 9+ Gold**.

## Deep Research Integration: Marg ERP 9+ Gold Architectures
Based on deep analysis of Marg ERP 9+ Gold and the provided frontend specifications, the backend architecture must incorporate several advanced modular concepts to achieve parity:
1. **High-Volume Transaction Auditing**: Marg ERP processes massive transaction volumes efficiently. Our implementation must use optimized Django ORM features like `bulk_create`, select_related, and strict `SELECT FOR UPDATE` table locks to prevent database deadlocks during parallel billing.
2. **Advanced Inventory Valuation & Multi-Godown**: Beyond simple FEFO, Marg manages multi-tier warehousing. We must support `GodownLocation` (Main, Cold Storage, Secondary) on `PurchaseInvoice` and integrate `rackLocation` modeling per batch to replicate Marg's physical stock discovery.
3. **Rigorous Ledger & Bill-by-Bill Offsetting**: Marg is fundamentally an accounting software. Our backend must track double-entry style `LedgerEntry` logs for every transaction (Debit/Credit running balances). Bill-by-bill tracking means `PaymentAllocation` acts as the explicit bridge linking a `PaymentEntry` to a specific `outstanding` on a `PurchaseInvoice` or `SaleInvoice`.
4. **Schedule H & Regulatory Compliance registers**: Indian pharmacy law strictly mandates Schedule H registers. The backend will enforce this via pre-save signals blocking any Schedule H/H1/X drug sale lacking a `ScheduleHRegister` associated entry (Doctor & Patient details). 

## User Review Required
No immediate blockers. This document serves as the final blueprint as requested.

## Proposed Changes

### 1. Database Schema & Models
The following Django models must be created carefully with `outletId` filtering applied via custom Managers (`OutletFilteredManager`).

**Core Entities**:
- **Organization**: Tracks multitenancy.
- **Outlet**: Represents a specific branch/pharmacy.
- **Staff**: Custom User model integrating `StaffRole`, PIN auth (`staffPin`), and permission flags (`canEditRate`, etc.).

**Inventory Management**:
- **MasterProduct**: Global product catalog containing `drugType`, `scheduleType`, `mrp`, `ptr`, `pts`, and `hsnCode`. (Marg parity: HSN codes for GST GSTR-1/2/3B export).
- **Batch**: Tracks stock (`qtyStrips`, `qtyLoose`) by `outletProductId`, FEFO rules apply here. Must never go below 0. Includes `rackLocation` and `isFridge` for Marg-like physical inventory tracking.

**Billing & Sales**:
- **SaleInvoice** / **SaleItem**: Tracks GST totals, customer ID, prescription doctor details, and payment splits (cash/upi/card/credit). Handles Sales Returns symmetrically with explicit negative quantity handling for stock reinforcement.
- **ScheduleHRegister**: Mandatory table for DrugSchedule H, H1, X. Tied to a SaleItem.

**Purchases & Godown**:
- **PurchaseInvoice** / **PurchaseItem**: Tracks purchase rates, PTR, PTS, MRP, and GST on purchases. Explicit `godown` tracking per invoice.

**Accounts & Ledger (Marg Accounting Parity)**:
- **Distributor** and **Customer**: Entities for parties with dynamic `creditDays` and `creditLimit` locks.
- **CreditAccount** / **CreditTransaction**: Manages customer Udhari. (Counterpart to Marg's customer ledger).
- **PaymentEntry** / **PaymentAllocation**: Explicit Bill-by-Bill allocation tables. Essential for tracking which exact invoice is cleared.
- **LedgerEntry**: Unified ledger tracking debit/credit/running balance per entity (Distributor). Must act as an immutable append-only ledger log.

### 2. Critical Business Logic (Services Layer & Edge Cases)
As per the strict directives and Marg architectural patterns:

- **Atomic Purchase Saves**: Saving a purchase will create the invoice, parse items, intelligently generate/update Batches (merging old batches if matching batchNo/expiry), update Distributor Ledger, and compute due date all inside a single `with transaction.atomic():` block.
- **FEFO Batch Selection & Substitution Alerting**: Selecting batches for a sale via `Batch.objects.filter(qtyStrips__gt=0, expiryDate__gt=date.today()).order_by('expiryDate')`. Throws `InsufficientStockError` if insufficient sum. Must auto-split quantities across multiple batches if the oldest batch lacks full quantity requested (e.g., needing 15 strips, Batch 1 has 10, Batch 2 has 5).
- **Bill-by-Bill Payment Allocation (Strict Offsetting)**: Complex multi-table insert where an atomic transaction validates `total_allocated == payload.totalAmount`, then offsets `PurchaseInvoice.outstanding`, sets `amountPaid`, and creates Ledger Credit entries. Overpayments block execution.
- **Schedule H Blocking**: Sale validation will explicitly block checkout if the `MasterProduct` is Schedule H/H1/X/Narcotic and the payload lacks Doctor/Patient details.
- **Auto-Sequential Invoice Numbering**: `SELECT FOR UPDATE` locking on the last SaleInvoice query to reliably increment `INV-YYYY-XXXXXX` per outlet to avoid race conditions. Crucial for concurrent multi-terminal billing exactly like Marg ERP.
- **Multi-Split Payment Ledgers**: Handling `SaleInvoice` payment structures where a single bill is paid via `Cash + UPI + Credit` split, requiring distinct accounting nodes updated simultaneously.

### 3. API Endpoints Mapping (Phase 1 Launch Checklist Alignment)
Mapping directly to `mockApi.ts` endpoints to fulfill the mandatory Phase 1 go-live requirements:

- **Auth**: `POST /auth/login/` -> JWT Access/Refresh tokens.
- **Products**: `GET /products/search/` -> Returns MasterProducts joined with local Outlet Batches.
- **Batches**: `GET /inventory/` -> Aggregation endpoint summarizing Batches per Product.
- **Sales**: `POST /sales/` -> Checkout mutation (Atomic FEFO deduction, SaleInvoice creation). `GET /sales/` -> List paginated invoices.
- **Purchases**: `POST /purchases/` -> Atomic Purchase workflow. `GET /purchases/` -> Paginated GRNs.
- **Distributors**: `GET /distributors/` -> CRUD operations for suppliers.
- **Customers**: `GET /customers/` -> Basic CRUD.
- **Outstanding**: `GET /distributors/{id}/ledger` -> Distributor totals.
- **Payments**: `POST /credit/payment` -> Customer/Distributor payment handler.
- **Reports**: `GET /dashboard/daily` -> KPI aggregators (Total Sales, Cash/UPI splits).
- **Attendance**: `POST /attendance/check-in` -> Validates staff PIN, checks time against shift, saves selfie.

## Verification Plan

### Automated Tests
*To be implemented in `apps/backend/tests.py`:*
1. **Atomic Purchase Tests**: Validate that a failed ledger push rolls back the batch supply injection. Run via `python manage.py test api.tests.PurchaseTests`.
2. **FEFO Selection Tests**: Validate that oldest batch strips are decremented correctly during sale scenarios. Run via `python manage.py test api.tests.InventoryTests`.
3. **Bill-By-Bill Tests**: Test partial invoice allocations and track outstanding balances. Run via `python manage.py test api.tests.PaymentTests`.

### Manual Verification
1. Launch the backend locally using `docker-compose up -d`.
2. Run migrations: `python manage.py migrate` and `python manage.py seed_demo_data`.
3. Start the Next.js frontend with `.env` configured to `USE_MOCK=false`.
4. Walk through the 16 functional stages of the UI (Auth, Products, POS, Inventory, Purchases) observing the Database queries (via Django Debug Toolbar/Logs) to ensure isolation by `outletId` is enforced on all APIs.
