---
name: Stage 17 — Accounts Voucher Module (Marg Clone)
description: Marg ERP voucher entry clone — all 4 layouts, BillAdjustmentModal, CreateLedgerModal, 34 Ledger fields
type: project
---

Marg ERP voucher entry system cloned. Updated in a second pass to exactly match Marg behavior.

**Backend (already existed, session resumed):**
- Migration 0008 already applied — LedgerGroup, Ledger, Voucher, VoucherLine, DebitNote, DebitNoteItem, CreditNote, CreditNoteItem
- Services: LedgerService, VoucherService, DebitNoteService, CreditNoteService
- API endpoints: /api/v1/ledger-groups/, /api/v1/ledgers/, /api/v1/vouchers/, /api/v1/debit-notes/, /api/v1/credit-notes/
- 11/11 new tests passing

**Frontend built this session:**
- `packages/types/index.ts` — Added: LedgerGroup, Ledger, VoucherLine, Voucher, DebitNote, DebitNoteItem, CreditNote, CreditNoteItem, LedgerStatement, LedgerTransaction
- `lib/apiClient.ts` — Added `voucherApi` (realVoucherApi) exported as `voucherApi`
- `components/shared/Sidebar.tsx` — Added sub-nav support; Accounts expands to show: Voucher Entry, Purchase Returns, Sale Returns, Ledgers
- `components/accounts/LedgerPicker.tsx` — Searchable dropdown filtered by voucherType
- `components/accounts/VoucherForm.tsx` — Full form with 4 type buttons, ledger lines, keyboard shortcuts (F4/F5/F6/F7, Ctrl+S, Esc)
- `app/dashboard/accounts/voucher-entry/page.tsx`
- `app/dashboard/accounts/purchase-returns/page.tsx` — List with status badges
- `app/dashboard/accounts/purchase-returns/new/page.tsx` — Debit note form
- `app/dashboard/accounts/sale-returns/page.tsx` — List
- `app/dashboard/accounts/sale-returns/new/page.tsx` — Credit note form
- `app/dashboard/accounts/ledgers/page.tsx` — Ledger list with sync button
- `app/dashboard/accounts/ledgers/[id]/page.tsx` — Ledger statement with date filter

**Marg clone additions (Phase A-I):**
- Ledger model: 34 new fields (contact, compliance, GST, settings incl. color, isHidden, balancingMethod)
- VoucherBillAdjustment model (migration 0009 applied)
- VoucherService updated: bill_adjustments in create_voucher, get_pending_bills method
- New endpoints: /ledgers/{id}/outstanding/ and /ledgers/{id}/pending-bills/
- VoucherForm.tsx: COMPLETELY REWRITTEN — 4 separate layouts, outstanding label, auto-open BillAdjustmentModal
- LedgerPicker.tsx: filterGroup prop (cashbank/party), Alt+C opens CreateLedgerModal, "No ledger" hint
- BillAdjustmentModal.tsx: NEW — FIFO auto-fill, Confirm/On Account
- CreateLedgerModal.tsx: NEW — all 4 Marg sections (Basic/Contact/Compliance/Settings)
- ledgers/page.tsx: color-coding, Create + Edit buttons, Show Hidden toggle
- LedgerPicker filterGroup='cashbank' → voucherType='contra' filter; 'party' → receipt/payment filter

**Known:**
- DebitNote/CreditNote forms use placeholder batch_id — requires batch picker for production use
- Type check: 0 errors in app code (44 pre-existing test file errors unchanged)

**Why:** Exact Marg ERP clone requested by user for Indian pharmacy voucher entry
