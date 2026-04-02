"""
Management command: python manage.py verify_ledger_balances [--fix] [--outlet UUID]

Compares each Ledger.current_balance against the sum derived from its JournalLine history.
Catches any discrepancies that indicate a double-posting or skipped posting bug.

Usage:
  python manage.py verify_ledger_balances              # Report only
  python manage.py verify_ledger_balances --fix        # Report and correct
  python manage.py verify_ledger_balances --outlet <uuid>  # Single outlet
"""
from decimal import Decimal

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Verify Ledger.current_balance matches the sum of its JournalLine history'

    def add_arguments(self, parser):
        parser.add_argument(
            '--fix',
            action='store_true',
            help='Correct mismatched balances (sets current_balance to computed value)',
        )
        parser.add_argument(
            '--outlet',
            type=str,
            help='Filter by outlet ID (UUID)',
        )

    def handle(self, *args, **options):
        from django.db.models import Sum
        from apps.accounts.models import Ledger, JournalLine

        fix = options['fix']
        outlet_id = options.get('outlet')

        qs = Ledger.objects.select_related('group').order_by('outlet_id', 'name')
        if outlet_id:
            qs = qs.filter(outlet_id=outlet_id)

        checked = 0
        mismatches = 0

        for ledger in qs:
            checked += 1

            agg = JournalLine.objects.filter(ledger=ledger).aggregate(
                total_dr=Sum('debit_amount'),
                total_cr=Sum('credit_amount'),
            )
            total_dr = agg['total_dr'] or Decimal('0')
            total_cr = agg['total_cr'] or Decimal('0')

            # Expected balance = opening_balance ± journal movements
            # Asset/Expense: Dr increases balance, Cr decreases
            # Liability/Income: Cr increases balance, Dr decreases
            nature = ledger.group.nature
            if nature in ('asset', 'expense'):
                expected = ledger.opening_balance + (total_dr - total_cr)
            else:
                expected = ledger.opening_balance + (total_cr - total_dr)

            diff = ledger.current_balance - expected

            if abs(diff) > Decimal('0.01'):
                mismatches += 1
                self.stdout.write(
                    self.style.WARNING(
                        f'MISMATCH | Ledger "{ledger.name}" '
                        f'(outlet {ledger.outlet_id}) | '
                        f'stored={ledger.current_balance} '
                        f'expected={expected} diff={diff}'
                    )
                )
                if fix:
                    ledger.current_balance = expected
                    ledger.save(update_fields=['current_balance'])
                    self.stdout.write(f'  → Fixed: {ledger.current_balance} → {expected}')

        summary = f'\n{checked} ledgers checked, {mismatches} mismatches found.'

        if mismatches > 0 and not fix:
            summary += ' Run with --fix to correct.'
            self.stdout.write(self.style.WARNING(summary))
        elif mismatches > 0 and fix:
            summary += ' All corrected.'
            self.stdout.write(self.style.SUCCESS(summary))
        else:
            self.stdout.write(self.style.SUCCESS(summary))
