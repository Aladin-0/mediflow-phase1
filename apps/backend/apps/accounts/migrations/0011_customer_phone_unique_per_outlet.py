from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0010_journalentry_journalline'),
    ]

    operations = [
        # C7: prevent duplicate phone numbers within the same outlet
        migrations.AlterUniqueTogether(
            name='customer',
            unique_together={('outlet', 'phone')},
        ),
    ]
