import uuid
from datetime import datetime, timedelta
from decimal import Decimal
from apps.core.models import Outlet
from apps.inventory.models import MasterProduct, Batch

outlet = Outlet.objects.first()
print(f"Using outlet: {outlet}")

created = 0
skipped = 0

# Get first 30 products
products = list(MasterProduct.objects.all()[:30])

# Also include any "knee" products specifically
knee = list(MasterProduct.objects.filter(name__icontains='knee')[:10])
all_products = list({p.id: p for p in products + knee}.values())

# Expiry date: 1 year from now
expiry_date = (datetime.now() + timedelta(days=365)).date()

for product in all_products:
    # Calculate sensible default rates if not set
    default_sale_rate = product.default_sale_rate or Decimal('50.00')
    product_mrp = product.mrp or default_sale_rate
    purchase_rate = Decimal(str(round(float(default_sale_rate) * 0.8, 2)))

    batch, was_created = Batch.objects.get_or_create(
        outlet=outlet,
        product=product,
        defaults={
            'batch_no': f'TEST-{uuid.uuid4().hex[:8].upper()}',
            'expiry_date': expiry_date,
            'purchase_rate': purchase_rate,
            'mrp': product_mrp,
            'sale_rate': default_sale_rate,
            'qty_strips': 25,
            'qty_loose': 0,
            'is_active': True,
            'is_opening_stock': False,
        }
    )
    if was_created:
        created += 1
    else:
        skipped += 1

print(f"✅ Created: {created} batches")
print(f"⏭️  Skipped: {skipped} (already existed)")
print(f"Total batches for outlet: {Batch.objects.filter(outlet=outlet).count()}")
print(f"Total products with stock: {MasterProduct.objects.filter(batches__outlet=outlet).distinct().count()}")
