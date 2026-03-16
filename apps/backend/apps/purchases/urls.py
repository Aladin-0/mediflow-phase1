from django.urls import path
from apps.purchases.views import (
    DistributorListView,
    DistributorDetailView,
    DistributorLedgerView,
    PurchaseCreateView,
    PurchaseListView,
)


# Create a combined view that handles both GET and POST on root purchases/ endpoint
class PurchasesView(PurchaseListView, PurchaseCreateView):
    def get(self, request, *args, **kwargs):
        return PurchaseListView.get(self, request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return PurchaseCreateView.post(self, request, *args, **kwargs)


urlpatterns = [
    path('', PurchasesView.as_view(), name='purchase-list-create'),
    path('distributors/', DistributorListView.as_view(), name='distributor-list'),
    path('distributors/<uuid:distributor_id>/', DistributorDetailView.as_view(), name='distributor-detail'),
    path('distributors/<uuid:distributor_id>/ledger/', DistributorLedgerView.as_view(), name='distributor-ledger'),
]
