"""
Management command: seed_test_products
Creates 10 test MasterProducts + 2 Batches each for the first active Outlet.
Usage: python manage.py seed_test_products [--outlet <outlet_id>]
"""
from datetime import date
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from apps.core.models import Outlet
from apps.inventory.models import MasterProduct, Batch


PRODUCTS = [
    {
        "name": "Paracetamol 500mg Tablet",
        "composition": "Paracetamol 500mg",
        "manufacturer": "Cipla",
        "category": "Analgesic",
        "drug_type": "allopathy",
        "schedule_type": "OTC",
        "hsn_code": "30049099",
        "gst_rate": "12.00",
        "pack_size": 10,
        "pack_unit": "tablet",
        "pack_type": "strip",
        "batches": [
            {"batch_no": "PCT2701", "mfg_date": date(2024, 1, 1), "expiry_date": date(2027, 1, 31), "mrp": "28.00", "purchase_rate": "14.00", "sale_rate": "26.00", "qty_strips": 50},
            {"batch_no": "PCT2702", "mfg_date": date(2024, 6, 1), "expiry_date": date(2027, 6, 30), "mrp": "30.00", "purchase_rate": "15.00", "sale_rate": "28.00", "qty_strips": 40},
        ],
    },
    {
        "name": "Amoxicillin 500mg Capsule",
        "composition": "Amoxicillin 500mg",
        "manufacturer": "Sun Pharma",
        "category": "Antibiotic",
        "drug_type": "allopathy",
        "schedule_type": "H",
        "hsn_code": "30042029",
        "gst_rate": "12.00",
        "pack_size": 10,
        "pack_unit": "capsule",
        "pack_type": "strip",
        "batches": [
            {"batch_no": "AMX2701", "mfg_date": date(2024, 2, 1), "expiry_date": date(2027, 2, 28), "mrp": "95.00", "purchase_rate": "50.00", "sale_rate": "90.00", "qty_strips": 30},
            {"batch_no": "AMX2702", "mfg_date": date(2024, 8, 1), "expiry_date": date(2027, 8, 31), "mrp": "98.00", "purchase_rate": "52.00", "sale_rate": "93.00", "qty_strips": 25},
        ],
    },
    {
        "name": "Amlodipine 5mg Tablet",
        "composition": "Amlodipine Besylate 5mg",
        "manufacturer": "Dr. Reddy's Laboratories",
        "category": "Antihypertensive",
        "drug_type": "allopathy",
        "schedule_type": "OTC",
        "hsn_code": "30049099-AML",
        "gst_rate": "12.00",
        "pack_size": 10,
        "pack_unit": "tablet",
        "pack_type": "strip",
        "batches": [
            {"batch_no": "AML2701", "mfg_date": date(2024, 1, 1), "expiry_date": date(2027, 1, 31), "mrp": "55.00", "purchase_rate": "28.00", "sale_rate": "52.00", "qty_strips": 60},
            {"batch_no": "AML2702", "mfg_date": date(2024, 7, 1), "expiry_date": date(2027, 7, 31), "mrp": "58.00", "purchase_rate": "30.00", "sale_rate": "55.00", "qty_strips": 35},
        ],
    },
    {
        "name": "Pantoprazole 40mg Tablet",
        "composition": "Pantoprazole Sodium 40mg",
        "manufacturer": "Lupin Ltd",
        "category": "Antacid",
        "drug_type": "allopathy",
        "schedule_type": "OTC",
        "hsn_code": "30049099-PAN",
        "gst_rate": "12.00",
        "pack_size": 10,
        "pack_unit": "tablet",
        "pack_type": "strip",
        "batches": [
            {"batch_no": "PNT2701", "mfg_date": date(2024, 3, 1), "expiry_date": date(2027, 3, 31), "mrp": "72.00", "purchase_rate": "36.00", "sale_rate": "68.00", "qty_strips": 45},
            {"batch_no": "PNT2702", "mfg_date": date(2024, 9, 1), "expiry_date": date(2027, 9, 30), "mrp": "75.00", "purchase_rate": "38.00", "sale_rate": "71.00", "qty_strips": 30},
        ],
    },
    {
        "name": "Metformin 500mg Tablet",
        "composition": "Metformin Hydrochloride 500mg",
        "manufacturer": "Ipca Laboratories",
        "category": "Antidiabetic",
        "drug_type": "allopathy",
        "schedule_type": "OTC",
        "hsn_code": "30049099-MET",
        "gst_rate": "12.00",
        "pack_size": 10,
        "pack_unit": "tablet",
        "pack_type": "strip",
        "batches": [
            {"batch_no": "MET2701", "mfg_date": date(2024, 2, 1), "expiry_date": date(2027, 2, 28), "mrp": "45.00", "purchase_rate": "22.00", "sale_rate": "42.00", "qty_strips": 55},
            {"batch_no": "MET2702", "mfg_date": date(2024, 8, 1), "expiry_date": date(2028, 2, 28), "mrp": "48.00", "purchase_rate": "24.00", "sale_rate": "45.00", "qty_strips": 40},
        ],
    },
    {
        "name": "Knee Cap Medium",
        "composition": "Neoprene Knee Support",
        "manufacturer": "Visco Healthcare",
        "category": "Orthopaedic Support",
        "drug_type": "fmcg",
        "schedule_type": "OTC",
        "hsn_code": "90211000",
        "gst_rate": "5.00",
        "pack_size": 1,
        "pack_unit": "piece",
        "pack_type": "box",
        "batches": [
            {"batch_no": "KCM2701", "mfg_date": date(2024, 1, 1), "expiry_date": date(2028, 1, 31), "mrp": "280.00", "purchase_rate": "150.00", "sale_rate": "265.00", "qty_strips": 25},
            {"batch_no": "KCM2702", "mfg_date": date(2024, 6, 1), "expiry_date": date(2028, 6, 30), "mrp": "290.00", "purchase_rate": "155.00", "sale_rate": "275.00", "qty_strips": 20},
        ],
    },
    {
        "name": "Digital Thermometer",
        "composition": "Digital Clinical Thermometer",
        "manufacturer": "Dr. Morepen",
        "category": "Diagnostic Device",
        "drug_type": "fmcg",
        "schedule_type": "OTC",
        "hsn_code": "90251120",
        "gst_rate": "12.00",
        "pack_size": 1,
        "pack_unit": "piece",
        "pack_type": "box",
        "batches": [
            {"batch_no": "DTH2701", "mfg_date": date(2024, 1, 1), "expiry_date": date(2028, 12, 31), "mrp": "195.00", "purchase_rate": "100.00", "sale_rate": "185.00", "qty_strips": 30},
            {"batch_no": "DTH2702", "mfg_date": date(2024, 7, 1), "expiry_date": date(2028, 12, 31), "mrp": "199.00", "purchase_rate": "105.00", "sale_rate": "188.00", "qty_strips": 25},
        ],
    },
    {
        "name": "Dettol Antiseptic 500ml",
        "composition": "Chloroxylenol 4.8% w/v",
        "manufacturer": "Reckitt Benckiser",
        "category": "Antiseptic",
        "drug_type": "fmcg",
        "schedule_type": "OTC",
        "hsn_code": "38089400",
        "gst_rate": "18.00",
        "pack_size": 1,
        "pack_unit": "bottle",
        "pack_type": "bottle",
        "batches": [
            {"batch_no": "DET2701", "mfg_date": date(2024, 2, 1), "expiry_date": date(2027, 2, 28), "mrp": "185.00", "purchase_rate": "130.00", "sale_rate": "175.00", "qty_strips": 35},
            {"batch_no": "DET2702", "mfg_date": date(2024, 8, 1), "expiry_date": date(2027, 8, 31), "mrp": "190.00", "purchase_rate": "133.00", "sale_rate": "180.00", "qty_strips": 28},
        ],
    },
    {
        "name": "Volini Gel 30g",
        "composition": "Diclofenac Diethylamine 1.16% w/w",
        "manufacturer": "Ranbaxy Laboratories",
        "category": "Topical Analgesic",
        "drug_type": "allopathy",
        "schedule_type": "OTC",
        "hsn_code": "30051090",
        "gst_rate": "12.00",
        "pack_size": 1,
        "pack_unit": "tube",
        "pack_type": "tube",
        "batches": [
            {"batch_no": "VOL2701", "mfg_date": date(2024, 3, 1), "expiry_date": date(2027, 3, 31), "mrp": "125.00", "purchase_rate": "75.00", "sale_rate": "118.00", "qty_strips": 40},
            {"batch_no": "VOL2702", "mfg_date": date(2024, 9, 1), "expiry_date": date(2027, 9, 30), "mrp": "128.00", "purchase_rate": "77.00", "sale_rate": "121.00", "qty_strips": 30},
        ],
    },
    {
        "name": "Glucometer Strips 50s",
        "composition": "Glucose Oxidase Enzyme Test Strips",
        "manufacturer": "Roche Diagnostics",
        "category": "Diagnostic Consumable",
        "drug_type": "fmcg",
        "schedule_type": "OTC",
        "hsn_code": "38221990",
        "gst_rate": "12.00",
        "pack_size": 50,
        "pack_unit": "strip",
        "pack_type": "box",
        "batches": [
            {"batch_no": "GLS2701", "mfg_date": date(2024, 1, 1), "expiry_date": date(2027, 1, 31), "mrp": "850.00", "purchase_rate": "600.00", "sale_rate": "810.00", "qty_strips": 25},
            {"batch_no": "GLS2702", "mfg_date": date(2024, 7, 1), "expiry_date": date(2027, 7, 31), "mrp": "870.00", "purchase_rate": "615.00", "sale_rate": "825.00", "qty_strips": 20},
        ],
    },
]


class Command(BaseCommand):
    help = "Seed 10 test products with 2 batches each for invoice testing"

    def add_arguments(self, parser):
        parser.add_argument("--outlet", type=str, help="Outlet ID (UUID). Defaults to first active outlet.")
        parser.add_argument("--clear", action="store_true", help="Delete existing seeded batches before re-seeding.")

    def handle(self, *args, **options):
        outlet_id = options.get("outlet")
        if outlet_id:
            try:
                outlet = Outlet.objects.get(pk=outlet_id)
            except Outlet.DoesNotExist:
                raise CommandError(f"Outlet {outlet_id} not found.")
        else:
            outlet = Outlet.objects.filter(is_active=True).first()
            if not outlet:
                raise CommandError("No active outlet found. Create an outlet first.")

        self.stdout.write(f"Using outlet: {outlet.name} ({outlet.id})\n")

        created_products = 0
        skipped_products = 0
        created_batches = 0

        with transaction.atomic():
            for p in PRODUCTS:
                batch_data = p.pop("batches")

                master, created = MasterProduct.objects.get_or_create(
                    hsn_code=p["hsn_code"],
                    name=p["name"],
                    defaults=p,
                )
                if created:
                    created_products += 1
                    self.stdout.write(f"  [NEW]  MasterProduct: {master.name}")
                else:
                    skipped_products += 1
                    self.stdout.write(f"  [SKIP] MasterProduct already exists: {master.name}")

                for b in batch_data:
                    batch_no = b["batch_no"]
                    batch, b_created = Batch.objects.get_or_create(
                        outlet=outlet,
                        product=master,
                        batch_no=batch_no,
                        defaults={**b, "outlet": outlet, "product": master},
                    )
                    if b_created:
                        created_batches += 1
                        self.stdout.write(
                            f"         Batch {batch_no}: {batch.qty_strips} strips, MRP ₹{batch.mrp}, exp {batch.expiry_date}"
                        )
                    else:
                        self.stdout.write(f"         Batch {batch_no}: already exists, skipped")

                # restore batch_data for idempotency
                p["batches"] = batch_data

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. Products created: {created_products}, skipped: {skipped_products}. "
            f"Batches created: {created_batches}."
        ))
