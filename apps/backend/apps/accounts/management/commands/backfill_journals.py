"""
Management command to backfill journal entries for existing transactions.

When the auto journal posting feature is first deployed, all existing sales,
purchases, and vouchers won't have JournalEntry records. This command
retroactively creates those entries to ensure a complete audit trail.

Usage:
    python manage.py backfill_journals
"""

import logging
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.core.models import Outlet
from apps.billing.models import SaleInvoice
from apps.purchases.models import PurchaseInvoice
from apps.accounts.models import Voucher, JournalEntry
from apps.accounts.journal_service import (
    post_sale_invoice,
    post_purchase_invoice,
    post_voucher,
)

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Backfill journal entries for existing sales, purchases, and vouchers'

    def add_arguments(self, parser):
        parser.add_argument(
            '--outlet-id',
            type=str,
            help='Optional outlet ID to backfill; if not specified, backfills all outlets',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Print what would be done without actually creating entries',
        )

    def handle(self, *args, **options):
        outlet_id = options.get('outlet_id')
        dry_run = options.get('dry_run', False)

        # Get outlets to process
        if outlet_id:
            try:
                outlets = [Outlet.objects.get(id=outlet_id)]
            except Outlet.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Outlet {outlet_id} not found'))
                return
        else:
            outlets = Outlet.objects.filter(is_active=True)

        if not outlets:
            self.stdout.write(self.style.WARNING('No active outlets found'))
            return

        total_sales = 0
        total_purchases = 0
        total_vouchers = 0
        failed_sales = 0
        failed_purchases = 0
        failed_vouchers = 0

        for outlet in outlets:
            self.stdout.write(f'\n--- Processing Outlet: {outlet.name} ---')

            # ── Sales Invoices ──
            self.stdout.write('Processing SaleInvoices...')
            sales = SaleInvoice.objects.filter(outlet=outlet).order_by('invoice_date')
            for idx, sale in enumerate(sales, 1):
                # Check if already journaled
                if JournalEntry.objects.filter(
                    outlet=outlet, source_type='SALE', source_id=sale.id
                ).exists():
                    continue

                if dry_run:
                    self.stdout.write(f'  [{idx}] Would post {sale.invoice_no}')
                    total_sales += 1
                else:
                    try:
                        with transaction.atomic():
                            post_sale_invoice(sale)
                        self.stdout.write(f'  [{idx}] Posted {sale.invoice_no}')
                        total_sales += 1
                    except Exception as e:
                        logger.error(f'Failed to post sale {sale.id}: {e}')
                        self.stdout.write(
                            self.style.ERROR(f'  [{idx}] ERROR posting {sale.invoice_no}: {e}')
                        )
                        failed_sales += 1

            # ── Purchase Invoices ──
            self.stdout.write('Processing PurchaseInvoices...')
            purchases = PurchaseInvoice.objects.filter(outlet=outlet).order_by('invoice_date')
            for idx, purchase in enumerate(purchases, 1):
                # Check if already journaled
                if JournalEntry.objects.filter(
                    outlet=outlet, source_type='PURCHASE', source_id=purchase.id
                ).exists():
                    continue

                if dry_run:
                    self.stdout.write(f'  [{idx}] Would post {purchase.invoice_no}')
                    total_purchases += 1
                else:
                    try:
                        with transaction.atomic():
                            post_purchase_invoice(purchase)
                        self.stdout.write(f'  [{idx}] Posted {purchase.invoice_no}')
                        total_purchases += 1
                    except Exception as e:
                        logger.error(f'Failed to post purchase {purchase.id}: {e}')
                        self.stdout.write(
                            self.style.ERROR(f'  [{idx}] ERROR posting {purchase.invoice_no}: {e}')
                        )
                        failed_purchases += 1

            # ── Vouchers ──
            self.stdout.write('Processing Vouchers...')
            vouchers = Voucher.objects.filter(outlet=outlet).order_by('date')
            for idx, voucher in enumerate(vouchers, 1):
                # Check if already journaled
                if JournalEntry.objects.filter(
                    outlet=outlet, source_type='VOUCHER', source_id=voucher.id
                ).exists():
                    continue

                if dry_run:
                    self.stdout.write(f'  [{idx}] Would post {voucher.voucher_no}')
                    total_vouchers += 1
                else:
                    try:
                        with transaction.atomic():
                            post_voucher(voucher)
                        self.stdout.write(f'  [{idx}] Posted {voucher.voucher_no}')
                        total_vouchers += 1
                    except Exception as e:
                        logger.error(f'Failed to post voucher {voucher.id}: {e}')
                        self.stdout.write(
                            self.style.ERROR(f'  [{idx}] ERROR posting {voucher.voucher_no}: {e}')
                        )
                        failed_vouchers += 1

        # Summary
        self.stdout.write('\n' + '=' * 60)
        if dry_run:
            self.stdout.write(self.style.SUCCESS('DRY RUN - No entries were created'))
        self.stdout.write(f'SaleInvoices:       {total_sales} posted, {failed_sales} failed')
        self.stdout.write(f'PurchaseInvoices:   {total_purchases} posted, {failed_purchases} failed')
        self.stdout.write(f'Vouchers:           {total_vouchers} posted, {failed_vouchers} failed')
        self.stdout.write('=' * 60)

        if failed_sales or failed_purchases or failed_vouchers:
            self.stdout.write(
                self.style.WARNING(
                    f'\nWarning: {failed_sales + failed_purchases + failed_vouchers} '
                    'entries failed. Check logs for details.'
                )
            )
        else:
            self.stdout.write(self.style.SUCCESS('\nBackfill completed successfully!'))
