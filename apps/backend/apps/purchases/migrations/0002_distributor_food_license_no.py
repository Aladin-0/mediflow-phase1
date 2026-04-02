from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('purchases', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='distributor',
            name='food_license_no',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
