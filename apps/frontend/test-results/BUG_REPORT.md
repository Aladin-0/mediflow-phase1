# MediFlow Frontend — Bug Report
**Generated:** 2026-03-14
**Test Run:** 17 suites, 313 tests — All PASS
**Coverage:** 29.88% statements (mock/lib/store only tested; components/pages excluded from Jest)

---

## Summary

| Severity | Count |
|----------|-------|
| 🔴 HIGH  | 4     |
| 🟡 MEDIUM | 7     |
| 🔵 LOW   | 5     |
| **Total** | **16** |

---

## 🔴 HIGH Severity Bugs

### BUG-001: StaffMember.pin Field Does Not Exist — Field Is Named `staffPin`
**File:** `mock/staff.mock.ts`, `types/index.ts`
**Test:** `__tests__/unit/validations/staff.test.ts`
**Description:**
The `StaffMember` type uses `staffPin` as the field name, not `pin`. However, the `mockStaffApi.verifyPin(pin)` function takes a `pin` parameter. This naming inconsistency means any code that reads `staff.pin` will get `undefined`. The KioskMode and billing PIN verification logic must account for this.
**Observed:** `staff.pin === undefined` for all staff; actual field is `staff.staffPin`
**Impact:** Any component that destructures `{ pin }` from a staff object will silently get `undefined`.

---

### BUG-002: `mockPurchasesApi.create()` Does Not Validate Empty Items
**File:** `lib/mockApi.ts`
**Test:** `__tests__/unit/lib/mockApi.test.ts`
**Description:**
Creating a purchase with `items: []` succeeds and returns a purchase with `grandTotal: 0`. This should reject with a validation error. A purchase invoice with zero items is meaningless and could corrupt stock and financial records.
**Observed:** `await mockPurchasesApi.create({ ..., items: [] })` resolves with `grandTotal: 0`
**Expected:** Should reject with `{ error: { code: 'EMPTY_ITEMS' } }` or similar

---

### BUG-003: `mockPurchasesApi.create()` Allows Duplicate Invoice Numbers
**File:** `lib/mockApi.ts`
**Test:** `__tests__/integration/api/purchases.test.ts`
**Description:**
Creating two purchases with the same `invoiceNo` succeeds silently. Duplicate invoice numbers are illegal under GST regulations and would cause GSTR-2 reconciliation failures with the distributor.
**Observed:** Two calls with identical `invoiceNo` both succeed
**Expected:** Second call should reject with `{ error: { code: 'DUPLICATE_INVOICE' } }`

---

### BUG-004: `recordPayment()` Does NOT Append Transaction to Ledger
**File:** `lib/mockApi.ts`
**Test:** `__tests__/integration/flows/credit.test.ts`
**Description:**
After calling `mockCreditApi.recordPayment(accountId, { amount, mode, paymentDate })`, the payment correctly reduces `totalOutstanding` on the account. However, `getLedger(customerId).transactions` does NOT gain a new entry for this payment. The ledger is therefore incomplete — it shows the balance changed but has no transaction record to explain it.
**Observed:** `transactions.length` before and after `recordPayment()` are equal
**Expected:** Each payment should append a `{ type: 'credit', amount, createdAt, ... }` transaction

---

## 🟡 MEDIUM Severity Bugs

### BUG-005: Aging Summary `totalOutstanding` Is an Object `{amount, count}`, Not a Number
**File:** `lib/mockApi.ts` — `mockCreditApi.getAgingSummary()`
**Test:** `__tests__/integration/flows/credit.test.ts`
**Description:**
`CreditAccount.totalOutstanding` is typed as `number`. But `getAgingSummary().totalOutstanding` returns `{ amount: number, count: number }`. This type inconsistency means any component doing `summary.totalOutstanding + x` will produce `NaN` or `"[object Object]x"`.
**Observed:** `typeof summary.totalOutstanding === 'object'`
**Expected:** Should be `number` to match `CreditAccount.totalOutstanding`

---

### BUG-006: Credit Ledger Transactions Use `createdAt` Not `date`
**File:** `lib/mockApi.ts`, `mock/credit.mock.ts`
**Test:** `__tests__/integration/flows/credit.test.ts`
**Description:**
`CreditTransaction` records have a `createdAt` field (ISO string), but some components and the CLAUDE.md spec refer to a `date` field. There is no `date` property on credit transactions.
**Observed:** `tx.date === undefined`; actual field is `tx.createdAt`
**Impact:** Any UI displaying credit transaction dates using `tx.date` will show `undefined`.

---

### BUG-007: Credit Account IDs Are `credit-acc-XXX` but `getLedger()` Takes Customer ID
**File:** `lib/mockApi.ts`
**Test:** `__tests__/integration/flows/credit.test.ts`
**Description:**
`mockCreditApi.list()` returns accounts with `id: "credit-acc-001"`. But `mockCreditApi.getLedger(id)` expects a **customer ID** (e.g. `"cust-001"`), not a credit account ID. Passing `acc.id` to `getLedger()` throws `{ error: { code: 'NOT_FOUND' } }`.
**Impact:** Any component that calls `getLedger(account.id)` will always fail.

---

### BUG-008: Mock Sales Report — Channel Sales Don't Sum to `netSales`
**File:** `mock/reports.mock.ts`
**Test:** `__tests__/unit/mock-data/integrity.test.ts`
**Description:**
For every row in `mockSalesReportData`, `cashSales + upiSales + cardSales + creditSales` does NOT equal `netSales`. The discrepancy is ~560 per row. This means channel-wise totals on the Reports page will differ from the daily net total by a constant amount.
**Observed:** e.g. Mar 1: netSales=8240, channels sum to ~8800 (+560 difference)
**Expected:** All channel amounts must sum exactly to `netSales`

---

### BUG-009: Pagination Field Naming Inconsistency Across APIs
**File:** `lib/mockApi.ts`
**Test:** `__tests__/integration/api/purchases.test.ts`
**Description:**
- `mockSalesApi.list()` pagination returns `{ total, page, pageSize, totalPages }`
- `mockPurchasesApi.list()` pagination returns `{ totalRecords, page, pageSize, totalPages }`
- `mockCustomersApi.list()` returns `{ total, page, pageSize, totalPages }`
The `total` vs `totalRecords` inconsistency means UI components cannot use a shared pagination component without custom field mapping.

---

### BUG-010: `MasterProduct` Has No `batches` Field — Separate Lookup Required
**File:** `mock/products.mock.ts`, `types/index.ts`
**Test:** `__tests__/unit/mock-data/integrity.test.ts`
**Description:**
`mockProducts` is `MasterProduct[]` which has no `batches` property. To get batches, callers must use `mockProductsApi.getStock(productId, outletId)`. However, `mockProductsApi.search()` returns `ProductSearchResult[]` which DOES include `batches`. This means the two APIs return different shapes for the same product concept.
**Impact:** Any code importing `mockProducts` directly and accessing `.batches` will get `undefined`.

---

### BUG-011: Attendance Grace Period Hard-Coded to 10 Minutes in Mock Data
**File:** `mock/attendance.mock.ts`
**Test:** `__tests__/unit/mock-data/integrity.test.ts`
**Description:**
The `calcLate()` function in `attendance.mock.ts` hard-codes `const gracedStart = shiftStartMins + 10`. It does not read from `settingsStore.attendanceGraceMinutes` (which defaults to 10 but can be changed in Settings). This means changing the grace period in Settings has no effect on historical attendance status calculation.
**Impact:** `AttendanceSummaryTab` and `MonthlyAttendanceTab` will show incorrect `isLate` status if grace period is changed from 10 minutes.

---

## 🔵 LOW Severity Bugs

### BUG-012: `lib/validations/staff.ts` Does Not Exist
**File:** `lib/validations/` (missing)
**Test:** `__tests__/unit/validations/staff.test.ts`
**Description:**
There is no Zod validation schema for staff PIN format, staff creation, or role assignment. PIN input is sent directly to `mockStaffApi.verifyPin()` without format validation. A 3-digit PIN or alphabetic string would bypass the schema layer and only fail at the mock API level.

---

### BUG-013: Mock Purchase Invoice Batch Numbers Are Non-Deterministic
**File:** `mock/purchases.mock.ts`
**Test:** `__tests__/unit/mock-data/purchases.test.ts`
**Description:**
`generateItems()` uses `Math.random()` to generate batch numbers: `` `BJX00${Math.floor(Math.random() * 100)}` ``. This means batch numbers change on every module reload. Test snapshots and any batch-number-dependent logic will behave inconsistently.

---

### BUG-014: Sunita Devi PIN Documented as "3333" in Some Places, Actually "4821"
**File:** `mock/staff.mock.ts`
**Test:** `__tests__/unit/lib/mockApi.test.ts`, `__tests__/unit/validations/staff.test.ts`
**Description:**
Some specification documents reference PIN "3333" for Sunita Devi. The actual PIN in `mock/staff.mock.ts` is `staffPin: "4821"`. The test `verifyPin("3333")` correctly throws `INVALID_PIN`. Any onboarding documentation or user-facing materials referencing "3333" are incorrect.

---

### BUG-015: `printerType` Breaking Change — Old Values `thermal_80mm`/`thermal_57mm` No Longer Valid
**File:** `lib/validations/settings.ts`, `store/settingsStore.ts`
**Test:** `__tests__/unit/validations/settings.test.ts`
**Description:**
Stage 15 changed `printerType` from `'a4' | 'thermal_80mm' | 'thermal_57mm'` to `'a4' | 'thermal'` with a separate `thermalWidth: '58mm' | '80mm'` field. Any localStorage data persisted under the old schema will fail validation. There is no migration guard.
**Impact:** Users who had `printerType: 'thermal_80mm'` stored will silently get invalid state after app upgrade.

---

### BUG-016: `applyDiscountToItem()` Uses MRP × (1 - pct) Not Rate × (1 - pct)
**File:** `store/billingStore.ts:102`
**Description:**
```typescript
const discountedRate = item.mrp * (1 - discountPct / 100);
```
Discount is applied on MRP, not on the sale rate. In Indian pharmacy billing, discount is typically applied on `saleRate` (which may already be below MRP). Applying discount on MRP will under-bill the customer whenever `saleRate < mrp`.
**Example:** MRP=100, saleRate=85, 10% discount → should give 85×0.9=76.5, but gets 100×0.9=90.

---

## Missing Files

| Expected File | Status |
|---------------|--------|
| `lib/validations/staff.ts` | ❌ MISSING |
| `components/ui/collapsible.tsx` | ❌ MISSING (referenced in `customers/RefillAlertsBanner.tsx`) |
| `lib/GSTReportPDF.tsx` | ✅ Present (untracked) |
| `lib/reportExport.ts` | ✅ Present (untracked) |

---

## Coverage Summary

| Module | Statements | Branches | Functions |
|--------|-----------|---------|-----------|
| `lib/gst.ts` | 90.9% | 85.71% | 88.88% |
| `lib/mockApi.ts` | 53.26% | 46.88% | 51.72% |
| `store/billingStore.ts` | 75% | 72.72% | 58.06% |
| `store/authStore.ts` | 90% | 100% | 85.71% |
| `store/settingsStore.ts` | 66.66% | 0% | 58.82% |
| `lib/validations/attendance.ts` | 100% | 100% | 100% |
| `lib/validations/settings.ts` | 100% | 100% | 100% |
| **All files** | **29.88%** | **26.79%** | **32.75%** |

> Note: Hooks (0%), components, and page files are excluded from the current test scope. A full test suite with React Testing Library would be needed to reach >70% coverage.
