import os
import django
import sys

sys.path.append('/app')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediflow.settings.dev')
django.setup()

from apps.accounts.models import Staff
from apps.core.models import Outlet

def run():
    super_admin = Staff.objects.filter(role='super_admin').first()
    if not super_admin:
        print("No super admin found.")
        return
        
    org = super_admin.outlet.organization
    
    existing_outlet = Outlet.objects.filter(name="secound outlate").first()
    if existing_outlet:
        print(f"Outlet already exists: {existing_outlet.id}")
        return

    new_outlet = Outlet.objects.create(
        organization=org,
        name="secound outlate",
        address="123 Testing Road, Building C",
        city="Mumbai",
        state="Maharashtra",
        pincode="400001",
        gstin="27AADCB9999Z1Z1",
        drug_license_no="MH-MZ4-987654321",
        phone="9876543212"
    )
    print(f"Successfully created Second Outlet with ID: {new_outlet.id}")

if __name__ == '__main__':
    run()
