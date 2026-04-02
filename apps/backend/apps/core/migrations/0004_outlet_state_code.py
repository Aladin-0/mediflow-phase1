from django.db import migrations, models


def backfill_state_codes(apps, schema_editor):
    """Derive state_code for all existing Outlet rows."""
    STATE_CODES = {
        'Jammu & Kashmir': '01', 'Himachal Pradesh': '02', 'Punjab': '03',
        'Chandigarh': '04', 'Uttarakhand': '05', 'Haryana': '06',
        'Delhi': '07', 'Rajasthan': '08', 'Uttar Pradesh': '09',
        'Bihar': '10', 'Sikkim': '11', 'Arunachal Pradesh': '12',
        'Nagaland': '13', 'Manipur': '14', 'Mizoram': '15',
        'Tripura': '16', 'Meghalaya': '17', 'Assam': '18',
        'West Bengal': '19', 'Jharkhand': '20', 'Odisha': '21',
        'Chhattisgarh': '22', 'Madhya Pradesh': '23', 'Gujarat': '24',
        'Dadra & Nagar Haveli and Daman & Diu': '26',
        'Maharashtra': '27', 'Karnataka': '29', 'Goa': '30',
        'Lakshadweep': '31', 'Kerala': '32', 'Tamil Nadu': '33',
        'Puducherry': '34', 'Andaman & Nicobar Islands': '35',
        'Telangana': '36', 'Andhra Pradesh': '37', 'Ladakh': '38',
    }
    Outlet = apps.get_model('core', 'Outlet')
    for outlet in Outlet.objects.all():
        outlet.state_code = STATE_CODES.get(outlet.state, '')
        outlet.save(update_fields=['state_code'])


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_add_org_contact_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='outlet',
            name='state_code',
            field=models.CharField(
                blank=True,
                default='',
                help_text='2-digit GST state code, derived from state on save',
                max_length=2,
            ),
        ),
        migrations.RunPython(backfill_state_codes, migrations.RunPython.noop),
    ]
