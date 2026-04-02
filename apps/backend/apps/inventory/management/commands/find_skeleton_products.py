from django.core.management.base import BaseCommand
from django.db.models import Q, Count
from apps.inventory.models import MasterProduct, Batch


class Command(BaseCommand):
    help = 'Find MasterProducts with missing HSN code, GST rate, or MRP (skeleton products)'

    def handle(self, *args, **options):
        skeletons = MasterProduct.objects.filter(
            Q(hsn_code__isnull=True) | Q(hsn_code='') |
            Q(gst_rate__isnull=True) |
            Q(mrp__isnull=True) | Q(mrp=0)
        ).order_by('created_at')

        count = skeletons.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS('No skeleton products found. All products have HSN, GST%, and MRP.'))
            return

        # Header
        self.stdout.write('')
        self.stdout.write(
            f"{'ID':<38} {'Name':<30} {'HSN':<12} {'GST%':<8} {'MRP':<10} {'Batches':<8} {'Created'}"
        )
        self.stdout.write('-' * 120)

        for product in skeletons:
            batch_count = Batch.objects.filter(product=product).count()
            hsn   = product.hsn_code or '(empty)'
            gst   = str(product.gst_rate) if product.gst_rate is not None else '(null)'
            mrp   = str(product.mrp)      if product.mrp      is not None else '(null)'
            name  = product.name[:28] + '..' if len(product.name) > 30 else product.name
            created = product.created_at.strftime('%Y-%m-%d') if product.created_at else '?'

            self.stdout.write(
                f"{str(product.id):<38} {name:<30} {hsn:<12} {gst:<8} {mrp:<10} {batch_count:<8} {created}"
            )

        self.stdout.write('')
        self.stdout.write(
            self.style.WARNING(
                f'{count} skeleton product(s) found. These need manual review in Inventory > Products.'
            )
        )
