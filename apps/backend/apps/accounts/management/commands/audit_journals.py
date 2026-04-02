"""
Management command: python manage.py audit_journals

Checks every JournalEntry to verify that total debits == total credits.
Exits with code 1 if any unbalanced entries are found (CI/CD friendly).
"""
import sys
from decimal import Decimal

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Audit all JournalEntries to verify double-entry balance (total debits = total credits)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--outlet',
            type=str,
            help='Filter by outlet ID (UUID)',
        )

    def handle(self, *args, **options):
        from apps.accounts.models import JournalEntry

        qs = JournalEntry.objects.prefetch_related('lines').order_by('date', 'created_at')

        outlet_id = options.get('outlet')
        if outlet_id:
            qs = qs.filter(outlet_id=outlet_id)

        total = qs.count()
        unbalanced = 0

        self.stdout.write(f'Checking {total} journal entries...')

        for je in qs:
            lines = list(je.lines.all())
            total_dr = sum(line.debit_amount for line in lines)
            total_cr = sum(line.credit_amount for line in lines)

            if abs(total_dr - total_cr) > Decimal('0.01'):
                unbalanced += 1
                self.stdout.write(
                    self.style.ERROR(
                        f'UNBALANCED | JournalEntry {je.id} | '
                        f'{je.source_type} {je.source_id} | '
                        f'outlet {je.outlet_id} | date {je.date} | '
                        f'Dr={total_dr} Cr={total_cr} diff={total_dr - total_cr}'
                    )
                )

        summary = f'\n{total} entries checked, {unbalanced} unbalanced found.'

        if unbalanced > 0:
            self.stdout.write(self.style.ERROR(summary))
            sys.exit(1)
        else:
            self.stdout.write(self.style.SUCCESS(summary))
