from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0005_saleinvoice_extra_discount_pct'),
    ]

    operations = [
        # C10: per-item return tracking replaces the invoice-level has_return flag
        migrations.AddField(
            model_name='saleitem',
            name='qty_returned',
            field=models.PositiveIntegerField(
                default=0,
                help_text='Total strips returned so far across all return transactions',
            ),
        ),
        migrations.RemoveField(
            model_name='saleinvoice',
            name='has_return',
        ),
    ]
