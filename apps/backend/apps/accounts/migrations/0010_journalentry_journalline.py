# Generated manually for Auto Journal Posting feature on 2026-03-23

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0009_ledger_balancing_method_ledger_bill_export_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='JournalEntry',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('source_type', models.CharField(choices=[('SALE', 'Sale Invoice'), ('PURCHASE', 'Purchase Invoice'), ('VOUCHER', 'Voucher'), ('RETURN', 'Return / Reversal')], max_length=20)),
                ('source_id', models.UUIDField(help_text='ID of the SaleInvoice, PurchaseInvoice, Voucher, or source return')),
                ('date', models.DateField(help_text='Transaction date')),
                ('narration', models.TextField(blank=True, help_text='Transaction description')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('outlet', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='journal_entries', to='core.outlet')),
            ],
            options={
                'db_table': 'accounts_journalentry',
                'unique_together': {('outlet', 'source_type', 'source_id')},
            },
        ),
        migrations.CreateModel(
            name='JournalLine',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('debit_amount', models.DecimalField(decimal_places=2, default=0, help_text='Amount debited to this ledger (if any)', max_digits=12)),
                ('credit_amount', models.DecimalField(decimal_places=2, default=0, help_text='Amount credited to this ledger (if any)', max_digits=12)),
                ('journal_entry', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lines', to='accounts.journalentry')),
                ('ledger', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='journal_lines', to='accounts.ledger')),
            ],
            options={
                'db_table': 'accounts_journalline',
            },
        ),
        migrations.AddIndex(
            model_name='journalentry',
            index=models.Index(fields=['outlet', 'source_type', 'source_id'], name='accounts_jo_outlet_12345_idx'),
        ),
        migrations.AddIndex(
            model_name='journalentry',
            index=models.Index(fields=['outlet', 'date'], name='accounts_jo_outlet_date_idx'),
        ),
    ]
