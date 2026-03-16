from django.urls import path
from apps.inventory.views import ProductSearchView

urlpatterns = [
    path('products/search/', ProductSearchView.as_view(), name='product-search'),
]
