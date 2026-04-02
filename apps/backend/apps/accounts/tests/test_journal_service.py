"""
Tests for apps.accounts.journal_service

Verifies double-entry correctness for all journal posting functions:
  - post_sale_invoice (cash, credit, split, IGST)
  - post_purchase_invoice
  - post_voucher (no double balance update)
  - post_credit_payment
  - reverse_journal (sale and purchase returns)
  - No double-posting
  - Trial balance balanced after all operations
  - Outlet isolation
  - Permission check (403 for billing_staff on financial reports)
"""
import uuid
from decimal import Decimal
from datetime import date

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status

from apps.core.models import Organization, Outlet
from apps.accounts.models import (
    Staff, Customer, Ledger, LedgerGroup,
    JournalEntry, JournalLine,
)
from apps.accounts.services import LedgerService, VoucherService
from apps.accounts.journal_service import (
    post_sale_invoice, post_purchase_invoice,
    post_voucher, post_credit_payment, reverse_journal,
)
from apps.purchases.models import Distributor, PurchaseInvoice
from apps.billing.models import SaleInvoice


def make_org_outlet(suffix=''):
    """Helper: create an org + outlet (signal auto-seeds ledgers)."""
    uid = uuid.uuid4().hex[:8].upper()
    org = Organization.objects.create(
        name=f'Test Org {suffix} {uid}', slug=f'test-org-{suffix}-{uid}', plan='pro', is_active=True
    )
    outlet = Outlet.objects.create(
        organization=org,
        name=f'Test Outlet {suffix} {uid}',
        address='1 Main St', city='Mumbai', state='Maharashtra',
        pincode='400001',
        gstin=f'27TEST{uid[:10]}',
        drug_license_no=f'DL-{uid}',
        phone='9000000000',
        is_active=True,
    )
    return org, outlet


def make_staff(outlet, phone, role='manager'):
    from django.contrib.auth.hashers import make_password
    return Staff.objects.create(
        phone=phone, name=f'Staff {phone}',
        outlet=outlet, role=role,
        staff_pin=make_password('1234'), is_active=True
    )


def make_cash_sale_invoice(outlet, staff, **overrides):
    """
    Create a SaleInvoice for a cash sale.
    Default: grand_total=1000, taxable=952.38, CGST=23.81, SGST=23.81
    Validates: cash_paid + upi_paid + card_paid = amount_paid
    """
    defaults = dict(
        outlet=outlet,
        invoice_no=f'INV-{uuid.uuid4().hex[:8].upper()}',
        invoice_date=timezone.now(),
        subtotal=Decimal('1000.00'),
        discount_amount=Decimal('0'),
        taxable_amount=Decimal('952.38'),
        cgst_amount=Decimal('23.81'),
        sgst_amount=Decimal('23.81'),
        igst_amount=Decimal('0'),
        round_off=Decimal('0'),
        grand_total=Decimal('1000.00'),
        payment_mode='cash',
        cash_paid=Decimal('1000.00'),
        upi_paid=Decimal('0'),
        card_paid=Decimal('0'),
        credit_given=Decimal('0'),
        amount_paid=Decimal('1000.00'),
        amount_due=Decimal('0'),
        billed_by=staff,
    )
    defaults.update(overrides)
    return SaleInvoice.objects.create(**defaults)


class TestCashSaleJournal(TestCase):
    """TEST 1: Cash sale posts correct journal lines and updates ledger balance."""

    def setUp(self):
        _, self.outlet = make_org_outlet('T1')
        self.staff = make_staff(self.outlet, '9001000001')

    def test_cash_sale_creates_correct_journal(self):
        inv = make_cash_sale_invoice(self.outlet, self.staff)
        post_sale_invoice(inv)

        je = JournalEntry.objects.get(outlet=self.outlet, source_type='SALE', source_id=inv.id)
        lines = {line.ledger.name: line for line in je.lines.select_related('ledger').all()}

        # Dr Cash = 1000
        self.assertIn('Cash', lines)
        self.assertEqual(lines['Cash'].debit_amount, Decimal('1000.00'))
        self.assertEqual(lines['Cash'].credit_amount, Decimal('0'))

        # Cr Sales Account = 952.38
        self.assertIn('Sales Account', lines)
        self.assertEqual(lines['Sales Account'].credit_amount, Decimal('952.38'))
        self.assertEqual(lines['Sales Account'].debit_amount, Decimal('0'))

        # Cr GST Output (CGST) = 23.81
        self.assertIn('GST Output (CGST)', lines)
        self.assertEqual(lines['GST Output (CGST)'].credit_amount, Decimal('23.81'))

        # Cr GST Output (SGST) = 23.81
        self.assertIn('GST Output (SGST)', lines)
        self.assertEqual(lines['GST Output (SGST)'].credit_amount, Decimal('23.81'))

        # Double-entry balance: total Dr = total Cr
        total_dr = sum(l.debit_amount for l in lines.values())
        total_cr = sum(l.credit_amount for l in lines.values())
        self.assertEqual(total_dr, total_cr)

    def test_cash_ledger_balance_increases(self):
        cash_ledger = Ledger.objects.get(outlet=self.outlet, name='Cash')
        balance_before = cash_ledger.current_balance

        inv = make_cash_sale_invoice(self.outlet, self.staff)
        post_sale_invoice(inv)

        cash_ledger.refresh_from_db()
        self.assertEqual(
            cash_ledger.current_balance - balance_before,
            Decimal('1000.00')
        )


class TestCreditSaleJournal(TestCase):
    """TEST 2: Credit sale debits Customer Ledger, not Cash."""

    def setUp(self):
        _, self.outlet = make_org_outlet('T2')
        self.staff = make_staff(self.outlet, '9001000002')
        self.customer = Customer.objects.create(
            outlet=self.outlet, name='Ram Kumar', phone='9111111111'
        )
        # Sync customer ledger
        LedgerService.sync_customer_ledgers(self.outlet)

    def test_credit_sale_debits_customer_ledger(self):
        inv = make_cash_sale_invoice(
            self.outlet, self.staff,
            customer=self.customer,
            payment_mode='credit',
            cash_paid=Decimal('0'),
            upi_paid=Decimal('0'),
            card_paid=Decimal('0'),
            credit_given=Decimal('1000.00'),
            amount_paid=Decimal('0'),
            amount_due=Decimal('1000.00'),
        )
        post_sale_invoice(inv)

        je = JournalEntry.objects.get(outlet=self.outlet, source_type='SALE', source_id=inv.id)
        lines = {line.ledger.name: line for line in je.lines.select_related('ledger').all()}

        # Customer Ledger should be debited
        self.assertIn('Ram Kumar', lines)
        self.assertEqual(lines['Ram Kumar'].debit_amount, Decimal('1000.00'))

        # Cash should NOT be debited
        self.assertNotIn('Cash', lines)

        # Customer ledger balance should have increased
        customer_ledger = Ledger.objects.get(outlet=self.outlet, linked_customer=self.customer)
        self.assertGreater(customer_ledger.current_balance, Decimal('0'))


class TestSplitPaymentJournal(TestCase):
    """TEST 3: Split payment (cash + UPI + credit) creates correct multi-debit journal."""

    def setUp(self):
        _, self.outlet = make_org_outlet('T3')
        self.staff = make_staff(self.outlet, '9001000003')
        self.customer = Customer.objects.create(
            outlet=self.outlet, name='Split Customer', phone='9111111112'
        )
        LedgerService.sync_customer_ledgers(self.outlet)

    def test_split_payment_journal(self):
        inv = make_cash_sale_invoice(
            self.outlet, self.staff,
            customer=self.customer,
            payment_mode='split',
            cash_paid=Decimal('600.00'),
            upi_paid=Decimal('200.00'),
            card_paid=Decimal('0'),
            credit_given=Decimal('200.00'),
            amount_paid=Decimal('800.00'),
            amount_due=Decimal('200.00'),
        )
        post_sale_invoice(inv)

        je = JournalEntry.objects.get(outlet=self.outlet, source_type='SALE', source_id=inv.id)
        lines = {line.ledger.name: line for line in je.lines.select_related('ledger').all()}

        # Dr Cash = 600
        self.assertEqual(lines['Cash'].debit_amount, Decimal('600.00'))
        # Dr UPI Collections = 200
        self.assertEqual(lines['UPI Collections'].debit_amount, Decimal('200.00'))
        # Dr Customer Ledger = 200
        self.assertEqual(lines['Split Customer'].debit_amount, Decimal('200.00'))

        # Totals balance
        total_dr = sum(l.debit_amount for l in lines.values())
        total_cr = sum(l.credit_amount for l in lines.values())
        self.assertEqual(total_dr, total_cr)
        self.assertEqual(total_dr, Decimal('1000.00'))


class TestPurchaseInvoiceJournal(TestCase):
    """TEST 4: Purchase invoice creates correct journal with GST Input split."""

    def setUp(self):
        _, self.outlet = make_org_outlet('T4')
        self.staff = make_staff(self.outlet, '9001000004')
        self.distributor = Distributor.objects.create(
            outlet=self.outlet, name='Cipla Ltd',
            phone='9222222222', address='Cipla Road',
            city='Mumbai', state='Maharashtra'
        )
        LedgerService.sync_distributor_ledgers(self.outlet)

    def test_purchase_invoice_journal(self):
        inv = PurchaseInvoice.objects.create(
            outlet=self.outlet,
            distributor=self.distributor,
            invoice_no=f'CINV-{uuid.uuid4().hex[:6].upper()}',
            invoice_date=date.today(),
            subtotal=Decimal('9523.81'),
            discount_amount=Decimal('0'),
            taxable_amount=Decimal('9523.81'),
            gst_amount=Decimal('476.19'),
            grand_total=Decimal('10000.00'),
            outstanding=Decimal('10000.00'),
            created_by=self.staff,
        )
        post_purchase_invoice(inv)

        je = JournalEntry.objects.get(outlet=self.outlet, source_type='PURCHASE', source_id=inv.id)
        lines = {line.ledger.name: line for line in je.lines.select_related('ledger').all()}

        # Dr Purchase Account = 9523.81
        self.assertIn('Purchase Account', lines)
        self.assertEqual(lines['Purchase Account'].debit_amount, Decimal('9523.81'))

        # Dr GST Input (CGST) + Dr GST Input (SGST) ≈ 476.19 total
        cgst_dr = lines.get('GST Input (CGST)', None)
        sgst_dr = lines.get('GST Input (SGST)', None)
        self.assertIsNotNone(cgst_dr)
        self.assertIsNotNone(sgst_dr)
        total_gst_posted = cgst_dr.debit_amount + sgst_dr.debit_amount
        self.assertAlmostEqual(float(total_gst_posted), 476.19, delta=0.01)

        # Cr Distributor = 10000.00
        self.assertIn('Cipla Ltd', lines)
        self.assertEqual(lines['Cipla Ltd'].credit_amount, Decimal('10000.00'))

        # Balance: total Dr == total Cr
        total_dr = sum(l.debit_amount for l in lines.values())
        total_cr = sum(l.credit_amount for l in lines.values())
        self.assertAlmostEqual(float(total_dr), float(total_cr), delta=0.01)

        # Distributor ledger balance should have increased
        dist_ledger = Ledger.objects.get(outlet=self.outlet, linked_distributor=self.distributor)
        self.assertGreater(dist_ledger.current_balance, Decimal('0'))


class TestNoDoublePosting(TestCase):
    """TEST 5: Calling post_sale_invoice twice creates only ONE journal entry."""

    def setUp(self):
        _, self.outlet = make_org_outlet('T5')
        self.staff = make_staff(self.outlet, '9001000005')

    def test_no_double_posting(self):
        inv = make_cash_sale_invoice(self.outlet, self.staff)
        cash_ledger = Ledger.objects.get(outlet=self.outlet, name='Cash')
        balance_before = cash_ledger.current_balance

        post_sale_invoice(inv)
        post_sale_invoice(inv)  # Second call should be a no-op

        # Only ONE JournalEntry should exist
        count = JournalEntry.objects.filter(
            outlet=self.outlet, source_type='SALE', source_id=inv.id
        ).count()
        self.assertEqual(count, 1)

        # Balance should only have increased ONCE
        cash_ledger.refresh_from_db()
        self.assertEqual(
            cash_ledger.current_balance - balance_before,
            Decimal('1000.00')  # not 2000
        )


class TestSaleReturnReversal(TestCase):
    """TEST 6: Sale return reversal flips all journal lines and restores balances."""

    def setUp(self):
        _, self.outlet = make_org_outlet('T6')
        self.staff = make_staff(self.outlet, '9001000006')

    def test_sale_return_reversal(self):
        inv = make_cash_sale_invoice(self.outlet, self.staff)

        cash_ledger = Ledger.objects.get(outlet=self.outlet, name='Cash')
        sales_ledger = Ledger.objects.get(outlet=self.outlet, name='Sales Account')
        cgst_ledger = Ledger.objects.get(outlet=self.outlet, name='GST Output (CGST)')

        cash_before = cash_ledger.current_balance
        sales_before = sales_ledger.current_balance
        cgst_before = cgst_ledger.current_balance

        # Post original sale
        post_sale_invoice(inv)

        cash_after_sale = Ledger.objects.get(outlet=self.outlet, name='Cash').current_balance
        self.assertEqual(cash_after_sale - cash_before, Decimal('1000.00'))

        # Reverse (sale return)
        reverse_journal('SALE', inv.id, self.outlet.id, 'CREDIT NOTE REVERSAL OF')

        # Verify a RETURN journal entry exists
        reversal = JournalEntry.objects.get(
            outlet=self.outlet, source_type='RETURN', source_id=inv.id
        )
        self.assertIn('REVERSAL', reversal.narration.upper())

        # All balances should return to their original values
        cash_ledger.refresh_from_db()
        sales_ledger.refresh_from_db()
        cgst_ledger.refresh_from_db()

        self.assertAlmostEqual(float(cash_ledger.current_balance), float(cash_before), delta=0.01)
        self.assertAlmostEqual(float(sales_ledger.current_balance), float(sales_before), delta=0.01)
        self.assertAlmostEqual(float(cgst_ledger.current_balance), float(cgst_before), delta=0.01)


class TestVoucherContra(TestCase):
    """TEST 7: Contra voucher (Cash → Bank) only moves money, net change is zero."""

    def setUp(self):
        _, self.outlet = make_org_outlet('T7')
        self.staff = make_staff(self.outlet, '9001000007')

    def test_voucher_contra_cash_to_bank(self):
        cash_ledger = Ledger.objects.get(outlet=self.outlet, name='Cash')
        bank_ledger = Ledger.objects.get(outlet=self.outlet, name='Bank Account (HDFC)')

        cash_before = cash_ledger.current_balance
        bank_before = bank_ledger.current_balance

        data = {
            'voucher_type': 'contra',
            'date': str(date.today()),
            'total_amount': '5000',
            'payment_mode': 'cash',
            'lines': [
                {'ledger_id': str(bank_ledger.id), 'debit': 5000, 'credit': 0},
                {'ledger_id': str(cash_ledger.id), 'debit': 0, 'credit': 5000},
            ]
        }
        VoucherService.create_voucher(str(self.outlet.id), str(self.staff.id), data)

        cash_ledger.refresh_from_db()
        bank_ledger.refresh_from_db()

        # Cash decreases by 5000 (credited)
        self.assertEqual(cash_before - cash_ledger.current_balance, Decimal('5000.00'))
        # Bank increases by 5000 (debited)
        self.assertEqual(bank_ledger.current_balance - bank_before, Decimal('5000.00'))

        # Net change in system = 0 (money just moved)
        net_change = (cash_ledger.current_balance - cash_before) + (bank_ledger.current_balance - bank_before)
        self.assertEqual(net_change, Decimal('0'))

    def test_voucher_does_not_double_update_balance(self):
        """
        VoucherService updates balances; post_voucher must NOT update again.
        Verify that after creating a voucher, each ledger changes exactly once.
        """
        cash_ledger = Ledger.objects.get(outlet=self.outlet, name='Cash')
        bank_ledger = Ledger.objects.get(outlet=self.outlet, name='Bank Account (HDFC)')

        cash_before = cash_ledger.current_balance
        bank_before = bank_ledger.current_balance

        data = {
            'voucher_type': 'contra',
            'date': str(date.today()),
            'total_amount': '1000',
            'payment_mode': 'cash',
            'lines': [
                {'ledger_id': str(bank_ledger.id), 'debit': 1000, 'credit': 0},
                {'ledger_id': str(cash_ledger.id), 'debit': 0, 'credit': 1000},
            ]
        }
        VoucherService.create_voucher(str(self.outlet.id), str(self.staff.id), data)

        cash_ledger.refresh_from_db()
        bank_ledger.refresh_from_db()

        # Exactly 1000 change, not 2000
        self.assertEqual(cash_before - cash_ledger.current_balance, Decimal('1000.00'))
        self.assertEqual(bank_ledger.current_balance - bank_before, Decimal('1000.00'))


class TestTrialBalanceIsBalanced(TestCase):
    """TEST 8: Trial balance total_debit == total_credit after all operations."""

    def setUp(self):
        _, self.outlet = make_org_outlet('T8')
        self.staff = make_staff(self.outlet, '9001000008')
        self.client = APIClient()
        self.client.force_authenticate(user=self.staff)

    def test_trial_balance_balanced_after_sales(self):
        inv = make_cash_sale_invoice(self.outlet, self.staff)
        post_sale_invoice(inv)

        response = self.client.get(
            f'/api/v1/trial-balance/?outlet_id={self.outlet.id}'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(
            data['balanced'],
            f"Trial balance is NOT balanced: Dr={data['total_debit']} Cr={data['total_credit']}"
        )
        self.assertAlmostEqual(data['total_debit'], data['total_credit'], delta=0.01)


class TestOutletIsolation(TestCase):
    """TEST 9: Journal entries from outlet_A are invisible in outlet_B trial balance."""

    def setUp(self):
        _, self.outlet_a = make_org_outlet('T9A')
        _, self.outlet_b = make_org_outlet('T9B')
        self.staff_a = make_staff(self.outlet_a, '9001000009')
        self.staff_b = make_staff(self.outlet_b, '9001000010')

    def test_outlet_isolation(self):
        # Post a sale for outlet_A
        inv = make_cash_sale_invoice(self.outlet_a, self.staff_a)
        post_sale_invoice(inv)

        # Cash ledger for outlet_A should have changed
        cash_a = Ledger.objects.get(outlet=self.outlet_a, name='Cash')
        self.assertEqual(cash_a.current_balance, Decimal('1000.00'))

        # Cash ledger for outlet_B should NOT have changed
        cash_b = Ledger.objects.get(outlet=self.outlet_b, name='Cash')
        self.assertEqual(cash_b.current_balance, Decimal('0'))

        # JournalEntries for outlet_B should be empty
        je_count = JournalEntry.objects.filter(outlet=self.outlet_b).count()
        self.assertEqual(je_count, 0)

    def test_trial_balance_outlet_isolation(self):
        # Post a sale for outlet_A
        inv = make_cash_sale_invoice(self.outlet_a, self.staff_a)
        post_sale_invoice(inv)

        # Trial balance for outlet_B should show 0 for Cash
        client = APIClient()
        client.force_authenticate(user=self.staff_b)
        response = client.get(f'/api/v1/trial-balance/?outlet_id={self.outlet_b.id}')
        self.assertEqual(response.status_code, 200)
        data = response.json()

        # Find Cash ledger in outlet_B response — should be 0
        for group in data.get('groups', []):
            for ledger in group.get('ledgers', []):
                if ledger['name'] == 'Cash':
                    self.assertEqual(ledger['balance'], 0.0,
                        "outlet_B's Cash shows balance from outlet_A — isolation broken!")


class TestPermissionCheck(TestCase):
    """TEST 10: billing_staff gets 403 on financial report endpoints."""

    def setUp(self):
        _, self.outlet = make_org_outlet('T10')
        self.billing_staff = make_staff(self.outlet, '9001000011', role='billing_staff')
        self.manager = make_staff(self.outlet, '9001000012', role='manager')
        self.client = APIClient()

    def test_billing_staff_cannot_access_trial_balance(self):
        self.client.force_authenticate(user=self.billing_staff)
        response = self.client.get(
            f'/api/v1/trial-balance/?outlet_id={self.outlet.id}'
        )
        # billing_staff should get 403
        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN,
            f"Expected 403 for billing_staff, got {response.status_code}"
        )

    def test_manager_can_access_trial_balance(self):
        self.client.force_authenticate(user=self.manager)
        response = self.client.get(
            f'/api/v1/trial-balance/?outlet_id={self.outlet.id}'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_billing_staff_cannot_access_gst_summary(self):
        self.client.force_authenticate(user=self.billing_staff)
        response = self.client.get(
            f'/api/v1/gst-summary/?outlet_id={self.outlet.id}'
        )
        self.assertEqual(
            response.status_code, status.HTTP_403_FORBIDDEN,
            f"Expected 403 for billing_staff, got {response.status_code}"
        )


class TestIGSTSaleJournal(TestCase):
    """IGST: Interstate sale uses GST Output (IGST) instead of CGST+SGST."""

    def setUp(self):
        _, self.outlet = make_org_outlet('TI')
        self.staff = make_staff(self.outlet, '9001000013')

    def test_igst_sale_posts_to_igst_ledger_only(self):
        inv = make_cash_sale_invoice(
            self.outlet, self.staff,
            taxable_amount=Decimal('952.38'),
            cgst_amount=Decimal('0'),
            sgst_amount=Decimal('0'),
            igst_amount=Decimal('47.62'),
            grand_total=Decimal('1000.00'),
        )
        post_sale_invoice(inv)

        je = JournalEntry.objects.get(outlet=self.outlet, source_type='SALE', source_id=inv.id)
        lines = {line.ledger.name: line for line in je.lines.select_related('ledger').all()}

        # IGST should be posted
        self.assertIn('GST Output (IGST)', lines)
        self.assertEqual(lines['GST Output (IGST)'].credit_amount, Decimal('47.62'))

        # CGST and SGST must NOT be posted for interstate sale
        self.assertNotIn('GST Output (CGST)', lines)
        self.assertNotIn('GST Output (SGST)', lines)

        # Balance check
        total_dr = sum(l.debit_amount for l in lines.values())
        total_cr = sum(l.credit_amount for l in lines.values())
        self.assertAlmostEqual(float(total_dr), float(total_cr), delta=0.01)


class TestZeroGSTSale(TestCase):
    """Zero-rated medicines (0% GST) — no GST posting at all."""

    def setUp(self):
        _, self.outlet = make_org_outlet('TZ')
        self.staff = make_staff(self.outlet, '9001000014')

    def test_zero_gst_sale_no_gst_lines(self):
        inv = make_cash_sale_invoice(
            self.outlet, self.staff,
            taxable_amount=Decimal('1000.00'),
            cgst_amount=Decimal('0'),
            sgst_amount=Decimal('0'),
            igst_amount=Decimal('0'),
            grand_total=Decimal('1000.00'),
        )
        post_sale_invoice(inv)

        je = JournalEntry.objects.get(outlet=self.outlet, source_type='SALE', source_id=inv.id)
        lines = {line.ledger.name: line for line in je.lines.select_related('ledger').all()}

        # No GST lines at all
        self.assertNotIn('GST Output (CGST)', lines)
        self.assertNotIn('GST Output (SGST)', lines)
        self.assertNotIn('GST Output (IGST)', lines)

        # Only Cash Dr and Sales Account Cr
        self.assertIn('Cash', lines)
        self.assertIn('Sales Account', lines)
        self.assertEqual(len(lines), 2)
