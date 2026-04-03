from django.urls import path
from apps.accounts.views import (
    LoginView, CustomerSearchView, CustomerDetailView,
    SwitchOutletView
)

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('switch-outlet/', SwitchOutletView.as_view(), name='switch-outlet'),
    path('customers/search/', CustomerSearchView.as_view(), name='customer-search'),
    path('customers/<uuid:customer_id>/', CustomerDetailView.as_view(), name='customer-detail'),
    path('customers/<uuid:pk>/outstanding/', CustomerOutstandingInvoicesView.as_view(), name='customer-outstanding'),
]
