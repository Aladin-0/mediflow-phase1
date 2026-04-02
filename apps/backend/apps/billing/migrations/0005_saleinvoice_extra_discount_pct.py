from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('billing', '0004_notificationlog'),
    ]

    operations = [
        migrations.AddField(
            model_name='saleinvoice',
            name='extra_discount_pct',
            field=models.DecimalField(
                decimal_places=2,
                default=0,
                help_text='Cart-level extra discount percentage',
                max_digits=5,
            ),
        ),
    ]
