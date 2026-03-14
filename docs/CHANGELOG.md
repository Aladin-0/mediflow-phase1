# MediFlow — Stage-by-Stage Changelog

---

## Stage 1 — Project Scaffold & Auth (March 2026)
Files created:
- `apps/frontend/` — Next.js 14 project initialized
- `apps/backend/` — Django 4 project initialized
- `docker-compose.yml` — postgres + redis + backend + frontend
- `apps/frontend/app/layout.tsx`
- `apps/frontend/app/page.tsx`
- `apps/frontend/app/(auth)/login/page.tsx`
- `apps/frontend/app/(auth)/login/LoginForm.tsx`
- `apps/frontend/store/authStore.ts`
- `apps/frontend/middleware.ts`
- `apps/frontend/lib/auth.ts`
- `apps/frontend/lib/api.ts`
- `apps/frontend/lib/validations/auth.ts`
- `apps/frontend/types/index.ts` — Core types
- `apps/frontend/mock/staff.mock.ts`
- `apps/frontend/mock/organization.mock.ts`
- `apps/frontend/components/ui/` — shadcn base components

---

## Stage 2 — Dashboard Layout & Navigation (March 2026)
Files created:
- `apps/frontend/app/dashboard/page.tsx`
- `apps/frontend/app/dashboard/layout.tsx` (implied)
- `apps/frontend/components/shared/Sidebar.tsx`
- `apps/frontend/components/shared/Header.tsx`
- `apps/frontend/components/shared/OfflineBanner.tsx`
- `apps/frontend/components/shared/Breadcrumb.tsx`
- `apps/frontend/components/shared/PermissionGate.tsx`
- `apps/frontend/components/shared/RoleBadge.tsx`
- `apps/frontend/components/shared/DashboardSkeleton.tsx`
- `apps/frontend/store/settingsStore.ts`
- `apps/frontend/hooks/usePermissions.ts`
- `apps/frontend/hooks/usePageTitle.ts`
- `apps/frontend/hooks/useOutletId.ts`
- `apps/frontend/lib/offline-db.ts` — Dexie IndexedDB setup
- Shell pages: billing, inventory, purchases, customers, credit, staff, attendance, reports, settings

---

## Stage 3 — KPI Dashboard & Charts (March 2026)
Files created:
- `apps/frontend/mock/dashboard.mock.ts`
- `apps/frontend/mock/products.mock.ts` — 10 products, 13 batches
- `apps/frontend/mock/customers.mock.ts` — 6 customers
- `apps/frontend/mock/sales.mock.ts`
- `apps/frontend/hooks/useDashboard.ts`
- `apps/frontend/components/dashboard/KPICards.tsx`
- `apps/frontend/components/dashboard/HourlySalesChart.tsx`
- `apps/frontend/components/dashboard/PaymentBreakdownChart.tsx`
- `apps/frontend/components/dashboard/TopSellingTable.tsx`
- `apps/frontend/lib/mockApi.ts` — mockDashboardApi, mockAuthApi
- `apps/frontend/lib/apiClient.ts`
- `apps/frontend/lib/queryClient.ts`
- `apps/frontend/app/providers.tsx` — QueryClientProvider + Toaster

---

## Stage 4 — Billing POS (March 2026)
Files created:
- `apps/frontend/app/dashboard/billing/page.tsx`
- `apps/frontend/app/dashboard/billing/[id]/page.tsx`
- `apps/frontend/components/billing/BillingSearch.tsx`
- `apps/frontend/components/billing/BillingCart.tsx`
- `apps/frontend/components/billing/CustomerSelector.tsx`
- `apps/frontend/store/billingStore.ts`
- `apps/frontend/hooks/useProductSearch.ts`
- `apps/frontend/lib/gst.ts`
- `apps/frontend/lib/export.ts`
- Modified: `apps/frontend/mock/mockApi.ts` — mockProductsApi, mockSalesApi
- Modified: `apps/frontend/types/index.ts` — CartItem, BillTotals, PaymentSplit

---

## Stage 5 — Staff PIN + Attendance Shell (March 2026)
Files created/modified:
- `apps/frontend/mock/staff.mock.ts` — expanded with roles
- Staff PIN verification modal (part of billing page)
- `apps/frontend/app/dashboard/attendance/page.tsx` — shell
- `apps/frontend/app/dashboard/attendance/mark/page.tsx` — kiosk shell
- `apps/frontend/components/shared/RoleBadge.tsx`

---

## Stage 6 — Customer Selector + Credit Shell (March 2026)
Files created:
- `apps/frontend/mock/credit.mock.ts`
- `apps/frontend/components/billing/CustomerSelector.tsx`
- `apps/frontend/app/dashboard/credit/page.tsx` — shell
- Modified: `apps/frontend/components/ui/command.tsx`

---

## Stage 7 — Payment Modal + Invoice + Print (March 2026)
Files created:
- `apps/frontend/components/billing/PaymentModal.tsx`
- `apps/frontend/components/billing/ScheduleHModal.tsx`
- `apps/frontend/components/billing/InvoicePreviewModal.tsx`
- `apps/frontend/hooks/useSaveBill.ts`
- `apps/frontend/hooks/usePrintInvoice.ts`
- `apps/frontend/lib/validations/billing.ts`
- `apps/frontend/components/ui/dialog.tsx`
- `apps/frontend/components/ui/tabs.tsx`
- `apps/frontend/components/ui/switch.tsx`
- `apps/frontend/components/ui/slider.tsx`
- `apps/frontend/components/ui/form.tsx`
- Modified: `apps/frontend/lib/gst.ts` — getBillTotals + CGST/SGST return

---

## Stage 8 — Inventory Screen (March 2026)
Files created:
- `apps/frontend/app/dashboard/inventory/page.tsx`
- `apps/frontend/components/inventory/StockTable.tsx`
- `apps/frontend/components/inventory/ExpiryTable.tsx`
- `apps/frontend/components/inventory/LowStockTable.tsx`
- `apps/frontend/components/inventory/InventoryStatCards.tsx`
- `apps/frontend/components/inventory/BatchDetailDrawer.tsx`
- `apps/frontend/components/inventory/StockAdjustmentModal.tsx`
- `apps/frontend/hooks/useInventory.ts`
- `apps/frontend/hooks/useInventoryFilters.ts`
- `apps/frontend/hooks/useKeyboardShortcuts.ts`
- `apps/frontend/hooks/useDebounce.ts`
- `apps/frontend/lib/validations/inventory.ts`
- `apps/frontend/components/ui/drawer.tsx`
- `apps/frontend/components/ui/popover.tsx`
- `apps/frontend/components/ui/badge.tsx`
- `apps/frontend/components/ui/table.tsx`
- `apps/frontend/components/ui/textarea.tsx`
- `apps/frontend/components/ui/toast.tsx`
- `apps/frontend/components/ui/toaster.tsx`
- `apps/frontend/components/ui/radio-group.tsx`
- `apps/frontend/components/ui/scroll-area.tsx`
- `apps/frontend/hooks/use-toast.ts`
- Modified: `apps/frontend/lib/mockApi.ts` — mockInventoryApi
- Modified: `apps/frontend/lib/gst.ts` — BillTotals properties added
- Modified: `apps/frontend/types/index.ts` — StockFilters, StockAdjustmentPayload, ExpiryReportItem

---

## Stage 9 — Purchases / GRN (March 2026) [In Progress]
Files created:
- `apps/frontend/mock/purchases.mock.ts` — 5 invoices
- `apps/frontend/mock/distributors.mock.ts` — 3 distributors (updated)
- `apps/frontend/hooks/usePurchases.ts`
- `apps/frontend/lib/validations/purchases.ts`
- `apps/frontend/lib/purchase-calculations.ts`
- Modified: `apps/frontend/lib/mockApi.ts` — mockPurchasesApi + mockDistributorsApi
- Modified: `apps/frontend/lib/apiClient.ts` — purchasesApi, distributorsApi exports
- Modified: `apps/frontend/types/index.ts` — PurchaseItem, PurchaseInvoiceFull, PurchaseFormItem, CreatePurchasePayload, DistributorLedgerEntry, Distributor fields

Pending (components not yet built):
- `apps/frontend/app/dashboard/purchases/page.tsx` (full)
- `apps/frontend/app/dashboard/purchases/new/page.tsx` (GRN form)
- `apps/frontend/app/dashboard/purchases/[id]/page.tsx`
- `apps/frontend/components/purchases/` (all components)
