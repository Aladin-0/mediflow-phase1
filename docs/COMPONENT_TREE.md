# MediFlow — Component Tree

Visual hierarchy of components for each major page.

---

## /dashboard (Home — KPIs)

```
app/dashboard/page.tsx
└── DashboardSkeleton (loading state)
└── KPICards
    └── Card (4x: Sales, Bills, GST, Discount)
└── HourlySalesChart
    └── recharts BarChart
└── PaymentBreakdownChart
    └── recharts PieChart
└── TopSellingTable
    └── TanStack Table
```

---

## /dashboard/billing (POS Screen)

```
app/dashboard/billing/page.tsx
├── Header (Sidebar + nav)
├── BillingSearch
│   ├── Input (search box)
│   └── ProductCard (search results)
├── BillingCart
│   ├── CartItem (repeating rows)
│   │   ├── Input (qty)
│   │   ├── Input (discount %)
│   │   └── Button (remove)
│   └── CartSummary (totals)
├── CustomerSelector
│   └── Command (searchable dropdown)
│       └── CommandItem (customer results)
├── PaymentModal (Dialog)
│   ├── Tabs (cash/upi/card/credit/split)
│   │   ├── TabsContent (cash)
│   │   │   └── Input (amount tendered)
│   │   ├── TabsContent (upi)
│   │   │   └── Switch (payment confirmed)
│   │   ├── TabsContent (card)
│   │   │   └── Select (card type)
│   │   ├── TabsContent (credit)
│   │   │   └── Input (credit amount)
│   │   └── TabsContent (split)
│   │       └── Input × 4 (per method)
│   └── DialogFooter
│       └── Button (Confirm & Save)
├── ScheduleHModal (Dialog)
│   └── Form (react-hook-form)
│       ├── FormField (doctorName)
│       ├── FormField (doctorRegNo)
│       ├── FormField (patientName)
│       ├── FormField (patientAge)
│       ├── FormField (patientAddress)
│       └── FormField (prescriptionNo)
└── InvoicePreviewModal (Dialog)
    ├── InvoiceA4 (printable)
    └── InvoiceThermal (printable 80mm)
```

---

## /dashboard/inventory

```
app/dashboard/inventory/page.tsx
├── InventoryStatCards
│   └── Card × 4 (Total Products, Low Stock, Expiring, Value)
├── Tabs
│   ├── TabsContent (All Stock)
│   │   └── StockTable
│   │       ├── Input (search)
│   │       ├── Select (schedule filter)
│   │       └── TanStack Table
│   │           └── PermissionGate (Adjust button)
│   ├── TabsContent (Expiring Soon)
│   │   └── ExpiryTable
│   │       └── TanStack Table
│   └── TabsContent (Low Stock)
│       └── LowStockTable
│           └── Progress (stock level bar)
├── BatchDetailDrawer (Drawer)
│   ├── Batch info cards
│   ├── Stock + pricing details
│   └── Button (Adjust Stock)
└── StockAdjustmentModal (Dialog)
    └── Form (react-hook-form + zod)
        ├── RadioGroup (damage/theft/correction/return)
        ├── Input (qtyStrips)
        ├── Input (qtyLoose)
        └── Textarea (reason)
```

---

## /dashboard/purchases (Shell — Stage 9)

```
app/dashboard/purchases/page.tsx  [planned]
├── PayablesSummaryBanner
│   └── Stats: overdue / due this week / paid this month
├── Tabs
│   ├── TabsContent (Purchase Invoices)
│   │   └── PurchaseInvoiceList
│   │       ├── Filters (date, distributor, status, search)
│   │       └── TanStack Table (invoices)
│   ├── TabsContent (Distributors)
│   │   └── DistributorList
│   │       └── DistributorCard × 3
│   └── TabsContent (Payables)
│       └── PayablesList
│           ├── Overdue Section
│           └── Upcoming Payables Table
└── RecordPurchasePaymentModal (Dialog)

app/dashboard/purchases/new/page.tsx  [planned]
└── GRN Form
    ├── Section 1: Invoice Header
    │   ├── Combobox (distributor)
    │   ├── Input (invoice number)
    │   ├── DatePicker (invoice date)
    │   └── DatePicker (due date)
    ├── Section 2: Items Entry
    │   └── useFieldArray rows
    │       ├── Combobox (product search)
    │       ├── Input (batch no)
    │       ├── Input type=month (expiry)
    │       ├── Input (qty / free qty)
    │       ├── Input (purchase rate / MRP / sale rate)
    │       ├── Select (GST %)
    │       └── Readonly Amount field
    └── Section 3: Invoice Summary (sticky bar)
        └── Totals + Save buttons
```

---

## Shared Layout (All Dashboard Pages)

```
app/dashboard/layout.tsx (implied)
├── Sidebar
│   ├── Logo
│   ├── NavItem × N (each route)
│   └── User profile / logout
├── Header
│   ├── Breadcrumb
│   ├── Notification bell
│   └── Avatar/Role badge
└── OfflineBanner (conditional)
    └── Shows when navigator.onLine = false
```

---

## Shared Components

```
components/shared/
├── PermissionGate — wraps children, hides if no permission
├── RoleBadge — colored badge for staff role
├── Breadcrumb — auto-generated from route
├── DashboardSkeleton — loading placeholder
├── OfflineBanner — offline indicator + sync button
├── Header — top navigation bar
└── Sidebar — left navigation

components/ui/ (shadcn primitives)
├── button, input, label, badge
├── card, separator, skeleton
├── dialog, drawer, sheet
├── tabs, select, switch
├── form, radio-group, textarea
├── table, scroll-area
├── toast, toaster
├── tooltip, dropdown-menu
├── command, popover
├── avatar, alert
├── progress, slider
```
