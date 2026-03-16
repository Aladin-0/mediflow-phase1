from django.urls import path
from apps.purchases.views import DistributorListView, DistributorDetailView, DistributorLedgerView

urlpatterns = [
    path('distributors/', DistributorListView.as_view(), name='distributor-list'),
    path('distributors/<uuid:distributor_id>/', DistributorDetailView.as_view(), name='distributor-detail'),
    path('distributors/<uuid:distributor_id>/ledger/', DistributorLedgerView.as_view(), name='distributor-ledger'),
]
