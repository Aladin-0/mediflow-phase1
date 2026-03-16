from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
import uuid

from apps.core.models import Organization, Outlet
from apps.accounts.models import Staff, Customer


class CustomerSearchViewTestCase(TestCase):
    """Test suite for CustomerSearchView endpoint."""

    def setUp(self):
        """Create test data: organization, outlet, staff, customers."""
        self.client = APIClient()

        # Create organization
        self.org = Organization.objects.create(
            name="Test Pharmacy Chain",
            slug="test-pharmacy",
            plan="pro",
            is_active=True
        )

        # Create outlet with unique drug_license_no
        self.outlet = Outlet.objects.create(
            organization=self.org,
            name="Test Outlet",
            address="123 Main St",
            city="Mumbai",
            state="Maharashtra",
            pincode="400001",
            gstin="27AAPCT1234E1Z0",
            drug_license_no=f"DLN-{uuid.uuid4().hex[:12].upper()}",
            phone="9876543210",
            is_active=True
        )

        # Create staff member for authentication
        self.staff = Staff.objects.create(
            phone="9876543210",
            name="Rajesh Patil",
            outlet=self.outlet,
            role="super_admin",
            staff_pin="0000",
            is_active=True
        )

        # Create customers
        self.customer1 = Customer.objects.create(
            outlet=self.outlet,
            name="Amit Kumar",
            phone="9999888877",
            address="456 Oak Ave, Mumbai",
            dob=date(1990, 5, 15),
            gstin="18AABCT1234E1Z0",
            fixed_discount=5.0,
            credit_limit=10000.0,
            outstanding=2500.0,
            total_purchases=15000.0,
            is_chronic=True,
            is_active=True
        )

        self.customer2 = Customer.objects.create(
            outlet=self.outlet,
            name="Priya Sharma",
            phone="8888777766",
            address="789 Pine St, Mumbai",
            dob=date(1985, 3, 20),
            gstin="27AABCT1234E1Z1",
            fixed_discount=3.0,
            credit_limit=5000.0,
            outstanding=500.0,
            total_purchases=8000.0,
            is_chronic=False,
            is_active=True
        )

        # Inactive customer
        self.customer_inactive = Customer.objects.create(
            outlet=self.outlet,
            name="Ramesh Singh",
            phone="7777666655",
            address="321 Elm St, Mumbai",
            dob=date(1992, 7, 10),
            fixed_discount=0,
            credit_limit=0,
            outstanding=0,
            total_purchases=0,
            is_chronic=False,
            is_active=False
        )

    def test_search_requires_authentication(self):
        """Verify JWT authentication is required."""
        response = self.client.get(f"/api/v1/auth/customers/search/?q=amit&outletId={self.outlet.id}")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_search_with_authentication(self):
        """Verify search works with valid JWT token."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        access_token = login_response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=amit&outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_minimum_query_length_zero(self):
        """Verify empty query returns empty list."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=&outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_minimum_query_length_one_char(self):
        """Verify single character query returns empty list."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=a&outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_search_by_customer_name(self):
        """Verify search by customer name (case-insensitive)."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=AMIT&outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Amit Kumar")

    def test_search_by_partial_name(self):
        """Verify search by partial customer name."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=shar&outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Priya Sharma")

    def test_search_by_phone(self):
        """Verify search by customer phone."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=9999888877&outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["phone"], "9999888877")

    def test_inactive_customers_excluded(self):
        """Verify inactive customers are not included in search results."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=singh&outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return empty list since Ramesh Singh is inactive
        self.assertEqual(response.data, [])

    def test_multiple_customers_search(self):
        """Verify search can return multiple matching customers."""
        # Create another customer with similar name
        Customer.objects.create(
            outlet=self.outlet,
            name="Amit Singh",
            phone="6666555544",
            address="999 Maple St, Mumbai",
            dob=date(1988, 1, 1),
            fixed_discount=2.0,
            credit_limit=3000.0,
            outstanding=0,
            total_purchases=5000.0,
            is_chronic=False,
            is_active=True
        )

        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=amit&outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_outlet_not_found(self):
        """Verify 404 when outlet does not exist."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        fake_outlet_id = uuid.uuid4()
        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=amit&outletId={fake_outlet_id}"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("detail", response.data)

    def test_response_structure(self):
        """Verify response includes all required customer fields."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=amit&outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        customer = response.data[0]

        required_fields = [
            "id", "name", "phone", "address", "dob", "gstin",
            "fixedDiscount", "creditLimit", "outstanding",
            "totalPurchases", "isChronic", "isActive", "createdAt"
        ]
        for field in required_fields:
            self.assertIn(field, customer, f"Missing field: {field}")

    def test_credit_details_accuracy(self):
        """Verify customer credit details are accurate."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/auth/customers/search/?q=amit&outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        customer = response.data[0]

        self.assertEqual(customer["creditLimit"], 10000.0)
        self.assertEqual(customer["outstanding"], 2500.0)
        self.assertEqual(customer["fixedDiscount"], 5.0)
        self.assertTrue(customer["isChronic"])
