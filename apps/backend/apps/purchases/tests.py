from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework import status
from datetime import date
import uuid

from apps.core.models import Organization, Outlet
from apps.accounts.models import Staff
from apps.purchases.models import Distributor
from apps.billing.models import LedgerEntry


class DistributorListViewTestCase(TestCase):
    """Test suite for DistributorListView endpoint."""

    def setUp(self):
        """Create test data: organization, outlet, staff, distributors."""
        self.client = APIClient()

        # Create organization
        self.org = Organization.objects.create(
            name="Test Pharmacy Chain",
            slug="test-pharmacy",
            plan="pro",
            is_active=True
        )

        # Create outlet
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

        # Create distributors
        self.dist1 = Distributor.objects.create(
            outlet=self.outlet,
            name="ABC Pharma",
            gstin="27AABCT1234E1Z0",
            drug_license_no="DL001",
            phone="9999888877",
            email="abc@pharma.com",
            address="456 Distributor Lane",
            city="Mumbai",
            state="Maharashtra",
            credit_days=30,
            opening_balance=5000.0,
            balance_type="CR",
            is_active=True
        )

        self.dist2 = Distributor.objects.create(
            outlet=self.outlet,
            name="XYZ Supplies",
            gstin="27AXYZT1234E1Z0",
            drug_license_no="DL002",
            phone="8888777766",
            email="xyz@supplies.com",
            address="789 Supplier Ave",
            city="Pune",
            state="Maharashtra",
            credit_days=45,
            opening_balance=0,
            balance_type="DR",
            is_active=True
        )

        # Inactive distributor
        self.dist_inactive = Distributor.objects.create(
            outlet=self.outlet,
            name="Old Distributor",
            phone="7777666655",
            address="321 Old St",
            city="Bangalore",
            state="Karnataka",
            credit_days=0,
            is_active=False
        )

    def test_list_requires_authentication(self):
        """Verify JWT authentication is required."""
        response = self.client.get(f"/api/v1/purchases/distributors/?outletId={self.outlet.id}")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_with_authentication(self):
        """Verify list works with valid JWT token."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        access_token = login_response.data["access"]

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/purchases/distributors/?outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 2)  # Only active distributors

    def test_inactive_distributors_excluded(self):
        """Verify inactive distributors are not included in list."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/purchases/distributors/?outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only have 2 active distributors
        self.assertEqual(len(response.data), 2)
        names = [d["name"] for d in response.data]
        self.assertNotIn("Old Distributor", names)

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
            f"/api/v1/purchases/distributors/?outletId={fake_outlet_id}"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("detail", response.data)

    def test_response_structure(self):
        """Verify response includes all required distributor fields."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/purchases/distributors/?outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        distributor = response.data[0]

        required_fields = [
            "id", "name", "gstin", "phone", "email", "address",
            "city", "state", "creditDays", "openingBalance", "balanceType", "isActive", "createdAt"
        ]
        for field in required_fields:
            self.assertIn(field, distributor, f"Missing field: {field}")

    def test_credit_terms_accuracy(self):
        """Verify distributor credit terms are accurate."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/purchases/distributors/?outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Find ABC Pharma
        dist = next(d for d in response.data if d["name"] == "ABC Pharma")

        self.assertEqual(dist["creditDays"], 30)
        self.assertEqual(dist["openingBalance"], 5000.0)
        self.assertEqual(dist["balanceType"], "CR")


class DistributorLedgerViewTestCase(TestCase):
    """Test suite for DistributorLedgerView endpoint."""

    def setUp(self):
        """Create test data: organization, outlet, staff, distributor, ledger entries."""
        self.client = APIClient()

        # Create organization
        self.org = Organization.objects.create(
            name="Test Pharmacy Chain",
            slug="test-pharmacy",
            plan="pro",
            is_active=True
        )

        # Create outlet
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

        # Create distributor
        self.distributor = Distributor.objects.create(
            outlet=self.outlet,
            name="ABC Pharma",
            gstin="27AABCT1234E1Z0",
            phone="9999888877",
            email="abc@pharma.com",
            address="456 Distributor Lane",
            city="Mumbai",
            state="Maharashtra",
            credit_days=30,
            opening_balance=10000.0,
            balance_type="CR",
            is_active=True
        )

        # Create ledger entries
        self.ledger1 = LedgerEntry.objects.create(
            outlet=self.outlet,
            entity_type="distributor",
            distributor=self.distributor,
            date=date(2026, 3, 1),
            entry_type="opening_balance",
            reference_no="OPENING",
            description="Opening balance",
            debit=10000.0,
            credit=0,
            running_balance=10000.0
        )

        self.ledger2 = LedgerEntry.objects.create(
            outlet=self.outlet,
            entity_type="distributor",
            distributor=self.distributor,
            date=date(2026, 3, 5),
            entry_type="purchase",
            reference_no="PU-001",
            description="Purchase invoice",
            debit=5000.0,
            credit=0,
            running_balance=15000.0
        )

        self.ledger3 = LedgerEntry.objects.create(
            outlet=self.outlet,
            entity_type="distributor",
            distributor=self.distributor,
            date=date(2026, 3, 10),
            entry_type="payment",
            reference_no="PAY-001",
            description="Payment made",
            debit=0,
            credit=3000.0,
            running_balance=12000.0
        )

    def test_ledger_requires_authentication(self):
        """Verify JWT authentication is required."""
        response = self.client.get(
            f"/api/v1/purchases/distributors/{self.distributor.id}/ledger/?outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_ledger(self):
        """Verify ledger endpoint returns all entries."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/purchases/distributors/{self.distributor.id}/ledger/?outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("distributor", response.data)
        self.assertIn("ledger", response.data)
        self.assertIn("summary", response.data)

        # Verify ledger entries
        self.assertEqual(len(response.data["ledger"]), 3)

    def test_ledger_running_balance(self):
        """Verify running balance is correctly calculated."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/purchases/distributors/{self.distributor.id}/ledger/?outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        ledger = response.data["ledger"]
        # Should be in order: opening, purchase, payment
        self.assertEqual(ledger[0]["runningBalance"], 10000.0)
        self.assertEqual(ledger[1]["runningBalance"], 15000.0)
        self.assertEqual(ledger[2]["runningBalance"], 12000.0)

    def test_ledger_summary(self):
        """Verify ledger summary totals are correct."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/purchases/distributors/{self.distributor.id}/ledger/?outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        summary = response.data["summary"]
        # Total debit: 10000 + 5000 = 15000
        # Total credit: 3000
        # Running balance: 12000
        self.assertEqual(summary["totalDebit"], 15000.0)
        self.assertEqual(summary["totalCredit"], 3000.0)
        self.assertEqual(summary["runningBalance"], 12000.0)

    def test_distributor_not_found(self):
        """Verify 404 when distributor does not exist."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        fake_dist_id = uuid.uuid4()
        response = self.client.get(
            f"/api/v1/purchases/distributors/{fake_dist_id}/ledger/?outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("detail", response.data)

    def test_ledger_entry_structure(self):
        """Verify ledger entry includes all required fields."""
        login_response = self.client.post(
            "/api/v1/auth/login/",
            {"phone": "9876543210", "password": "0000"},
            format="json"
        )
        access_token = login_response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        response = self.client.get(
            f"/api/v1/purchases/distributors/{self.distributor.id}/ledger/?outletId={self.outlet.id}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        entry = response.data["ledger"][0]
        required_fields = [
            "id", "date", "entryType", "referenceNo", "description",
            "debit", "credit", "runningBalance", "createdAt"
        ]
        for field in required_fields:
            self.assertIn(field, entry, f"Missing field: {field}")
