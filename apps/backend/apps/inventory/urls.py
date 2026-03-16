from django.urls import path
from apps.inventory.views import ProductSearchView, InventoryListView

urlpatterns = [
    path('products/search/', ProductSearchView.as_view(), name='product-search'),
    path('inventory/', InventoryListView.as_view(), name='inventory-list'),
]
