import pandas as pd
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mediflow.settings.dev')
django.setup()

from apps.inventory.models import MasterProduct

SCHEDULE_MAP = {
    'SURGICAL':    'Surgical',
    'NARCOTIC':    'Narcotic',
    'SCHEDULE H1': 'H1',
    'SCHEDULE H':  'H',
    'AYURVEDIC':   'Ayurvedic',
    'COSMETIC':    'Cosmetic',
}

VALID_GST = {0, 5, 12, 18}

df = pd.read_excel('/app/hsncodemaster.xlsx', sheet_name='hsncodemaster', dtype=str)
df = df.fillna('')

print(f"Total rows in file: {len(df)}")
print(f"Columns: {list(df.columns)}")

created = 0
skipped = 0
errors = 0
error_samples = []

# Pre-fetch existing names and hsn_codes for fast lookup
existing_names = set(MasterProduct.objects.values_list('name', flat=True))
existing_hsns  = set(MasterProduct.objects.values_list('hsn_code', flat=True))

for idx, row in df.iterrows():
    try:
        # --- Name ---
        name = str(row.get('Name', '')).strip()
        if not name or name.lower() == 'nan':
            skipped += 1
            continue

        # --- Skip duplicates by name or hsn_code ---
        raw_hsn = str(row.get('HSNCode', '')).strip()
        # Remove .0 suffix (e.g. "9018.0" → "9018")
        if raw_hsn.endswith('.0'):
            raw_hsn = raw_hsn[:-2]
        hsn_code = raw_hsn

        # Skip rows with no HSN at all (can't store empty unique value)
        if not hsn_code:
            skipped += 1
            continue

        if name in existing_names:
            skipped += 1
            continue

        # If HSN already used, make it unique using ItemID suffix
        if hsn_code in existing_hsns:
            item_id = str(row.get('ItemID', '')).strip().rstrip('.0')
            hsn_code = f"{hsn_code}-{item_id}" if item_id else f"{hsn_code}-{idx}"
            # If even the suffixed version exists, skip
            if hsn_code in existing_hsns:
                skipped += 1
                continue

        # --- Manufacturer ---
        manufacturer = str(row.get('Company', '')).strip()
        if manufacturer in ('#&*', '*', 'nan', ''):
            manufacturer = ''

        # --- GST rate ---
        try:
            gst_val = float(row.get('IGST', 12))
        except (ValueError, TypeError):
            gst_val = 12
        if int(gst_val) not in VALID_GST:
            gst_val = 12
        gst_rate = int(gst_val)

        # --- MRP ---
        try:
            mrp = float(row.get('M.R.P.', 0) or 0)
        except (ValueError, TypeError):
            mrp = 0.0

        # --- P.Rate ---
        try:
            p_rate = float(row.get('P.Rate', 0) or 0)
        except (ValueError, TypeError):
            p_rate = 0.0

        # --- default_sale_rate ---
        if mrp > 0:
            default_sale_rate = round(mrp * 0.95, 2)
        elif p_rate > 0:
            default_sale_rate = round(p_rate * 1.15, 2)
        else:
            default_sale_rate = 0.0

        # --- Composition ---
        salt = str(row.get('Salt', '')).strip()
        if salt.lower() in ('.', '..', 'nan', ''):
            composition = ''
        else:
            composition = salt

        # --- Category column → schedule_type ---
        raw_category = str(row.get('Category', '')).strip().upper()
        schedule_type = SCHEDULE_MAP.get(raw_category, 'OTC')

        # --- category field (raw value) ---
        category = str(row.get('Category', '')).strip()

        product = MasterProduct(
            name=name,
            composition=composition,
            manufacturer=manufacturer,
            category=category,
            drug_type='allopathy',
            schedule_type=schedule_type,
            hsn_code=hsn_code,
            gst_rate=gst_rate,
            pack_size=1,
            pack_unit='Piece',
            pack_type='other',
            mrp=mrp,
            default_sale_rate=default_sale_rate,
        )
        product.save()

        existing_names.add(name)
        if hsn_code:
            existing_hsns.add(hsn_code)

        created += 1

    except Exception as e:
        errors += 1
        if len(error_samples) < 5:
            error_samples.append(
                f"Row {idx} | Name={row.get('Name','')} | HSN={row.get('HSNCode','')} | Error: {e}"
            )
        continue

print(f"\n--- Import Complete ---")
print(f"Created : {created}")
print(f"Skipped : {skipped}")
print(f"Errors  : {errors}")

if error_samples:
    print("\nFirst errors:")
    for s in error_samples:
        print(" ", s)
