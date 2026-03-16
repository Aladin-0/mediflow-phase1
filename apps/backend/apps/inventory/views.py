import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q, Sum
from django.utils import timezone

from apps.inventory.models import MasterProduct, Batch
from apps.core.models import Outlet

logger = logging.getLogger(__name__)


class ProductSearchView(APIView):
    """
    GET /api/v1/products/search/?q=paracetamol&outletId=xxx

    Search products by name, composition, or manufacturer.
    Returns ProductSearchResult with aggregated stock and batch details.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Search for products by query string.

        Query parameters:
        - q: Search query (minimum 2 characters)
        - outletId: Outlet UUID to filter batches

        Returns:
        [
            {
                "id": "...",
                "name": "Paracetamol",
                "composition": "...",
                "manufacturer": "...",
                "category": "...",
                "drugType": "...",
                "scheduleType": "...",
                "hsnCode": "...",
                "gstRate": 0,
                "packSize": 10,
                "packUnit": "tablet",
                "packType": "strip",
                "isFridge": false,
                "isDiscontinued": false,
                "outletProductId": "...",
                "totalStock": 150,
                "nearestExpiry": "2026-12-31",
                "isLowStock": false,
                "batches": [
                    {
                        "id": "...",
                        "outletId": "...",
                        "outletProductId": "...",
                        "batchNo": "BATCH123",
                        "expiryDate": "2026-12-31",
                        "mrp": 50.0,
                        "purchaseRate": 25.0,
                        "saleRate": 40.0,
                        "qtyStrips": 10,
                        "qtyLoose": 0,
                        "isActive": true,
                        "createdAt": "2026-03-17T..."
                    }
                ]
            }
        ]
        """

        query = request.query_params.get('q', '').strip()
        outlet_id = request.query_params.get('outletId')

        # Validate query length
        if len(query) < 2:
            logger.debug(f"Search query too short: {len(query)} chars")
            return Response([], status=status.HTTP_200_OK)

        # Validate outlet
        try:
            outlet = Outlet.objects.get(id=outlet_id)
        except Outlet.DoesNotExist:
            return Response(
                {'detail': f'Outlet {outlet_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        logger.info(f"Searching products for: {query} (outlet: {outlet.name})")

        # Search MasterProducts by name, composition, manufacturer (case-insensitive)
        query_lower = query.lower()
        products = MasterProduct.objects.filter(
            Q(name__icontains=query_lower) |
            Q(composition__icontains=query_lower) |
            Q(manufacturer__icontains=query_lower)
        ).distinct()

        logger.info(f"Found {products.count()} products matching: {query}")

        # Build response with batches and aggregated stock
        results = []

        for product in products:
            # Get batches for this product at this outlet, filtered by:
            # - Not expired
            # - Active
            # - Sort by expiry_date (FEFO)
            today = timezone.now().date()
            batches = Batch.objects.filter(
                product=product,
                outlet=outlet,
                is_active=True,
                expiry_date__gt=today
            ).order_by('expiry_date')

            # Aggregate stock
            total_stock = batches.aggregate(
                total=Sum('qty_strips')
            )['total'] or 0

            # Get nearest expiry date (first batch in FEFO order)
            nearest_expiry = (
                batches.first().expiry_date.isoformat()
                if batches.exists()
                else "2099-12-31"
            )

            # Determine if low stock (< 10 strips)
            is_low_stock = total_stock < 10

            # Serialize batches
            batch_list = [
                {
                    'id': str(batch.id),
                    'outletId': str(batch.outlet.id),
                    'outletProductId': str(batch.product.id),
                    'batchNo': batch.batch_no,
                    'mfgDate': batch.mfg_date.isoformat() if batch.mfg_date else None,
                    'expiryDate': batch.expiry_date.isoformat(),
                    'mrp': float(batch.mrp),
                    'purchaseRate': float(batch.purchase_rate),
                    'saleRate': float(batch.sale_rate),
                    'qtyStrips': batch.qty_strips,
                    'qtyLoose': batch.qty_loose,
                    'rackLocation': batch.rack_location,
                    'isActive': batch.is_active,
                    'createdAt': batch.created_at.isoformat(),
                }
                for batch in batches
            ]

            # Build ProductSearchResult
            result = {
                'id': str(product.id),
                'name': product.name,
                'composition': product.composition,
                'manufacturer': product.manufacturer,
                'category': product.category,
                'drugType': product.drug_type,
                'scheduleType': product.schedule_type,
                'hsnCode': product.hsn_code,
                'gstRate': float(product.gst_rate),
                'packSize': product.pack_size,
                'packUnit': product.pack_unit,
                'packType': product.pack_type,
                'barcode': product.barcode,
                'isFridge': product.is_fridge,
                'isDiscontinued': product.is_discontinued,
                'imageUrl': product.image_url,
                'outletProductId': str(product.id),
                'totalStock': total_stock,
                'nearestExpiry': nearest_expiry,
                'isLowStock': is_low_stock,
                'batches': batch_list,
            }

            results.append(result)

        logger.info(f"Returning {len(results)} products with stock data")
        return Response(results, status=status.HTTP_200_OK)
