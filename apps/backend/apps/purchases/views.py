import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q

from apps.purchases.models import Distributor
from apps.billing.models import LedgerEntry
from apps.core.models import Outlet

logger = logging.getLogger(__name__)


class DistributorListView(APIView):
    """
    GET /api/v1/purchases/distributors/?outletId=xxx

    List all active distributors for an outlet.
    Returns list of distributor profiles with credit terms.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """
        Get list of distributors.

        Query parameters:
        - outletId: Outlet UUID to filter distributors

        Returns:
        [
            {
                "id": "...",
                "name": "...",
                "gstin": "...",
                "phone": "...",
                "email": "...",
                "address": "...",
                "city": "...",
                "state": "...",
                "creditDays": 30,
                "openingBalance": 0,
                "balanceType": "CR",
                "isActive": true,
                "createdAt": "2026-03-17T..."
            }
        ]
        """

        outlet_id = request.query_params.get('outletId')

        # Validate outlet
        try:
            outlet = Outlet.objects.get(id=outlet_id)
        except Outlet.DoesNotExist:
            return Response(
                {'detail': f'Outlet {outlet_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        logger.info(f"Fetching distributors for outlet: {outlet.name}")

        # Get all active distributors for this outlet
        distributors = Distributor.objects.filter(
            outlet=outlet,
            is_active=True
        ).order_by('name')

        logger.info(f"Found {distributors.count()} active distributors")

        # Serialize distributors
        results = []
        for distributor in distributors:
            result = {
                'id': str(distributor.id),
                'name': distributor.name,
                'gstin': distributor.gstin,
                'phone': distributor.phone,
                'email': distributor.email,
                'address': distributor.address,
                'city': distributor.city,
                'state': distributor.state,
                'creditDays': distributor.credit_days,
                'openingBalance': float(distributor.opening_balance) if distributor.opening_balance else 0,
                'balanceType': distributor.balance_type,
                'isActive': distributor.is_active,
                'createdAt': distributor.created_at.isoformat(),
            }
            results.append(result)

        return Response(results, status=status.HTTP_200_OK)


class DistributorDetailView(APIView):
    """
    GET /api/v1/purchases/distributors/{id}/?outletId=xxx

    Get distributor details by ID.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, distributor_id, *args, **kwargs):
        """Get distributor details."""
        outlet_id = request.query_params.get('outletId')

        try:
            outlet = Outlet.objects.get(id=outlet_id)
        except Outlet.DoesNotExist:
            return Response(
                {'detail': f'Outlet {outlet_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            distributor = Distributor.objects.get(id=distributor_id, outlet=outlet)
        except Distributor.DoesNotExist:
            return Response(
                {'detail': f'Distributor {distributor_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        result = {
            'id': str(distributor.id),
            'name': distributor.name,
            'gstin': distributor.gstin,
            'drugLicenseNo': distributor.drug_license_no,
            'phone': distributor.phone,
            'email': distributor.email,
            'address': distributor.address,
            'city': distributor.city,
            'state': distributor.state,
            'creditDays': distributor.credit_days,
            'openingBalance': float(distributor.opening_balance) if distributor.opening_balance else 0,
            'balanceType': distributor.balance_type,
            'isActive': distributor.is_active,
            'createdAt': distributor.created_at.isoformat(),
        }

        return Response(result, status=status.HTTP_200_OK)


class DistributorLedgerView(APIView):
    """
    GET /api/v1/purchases/distributors/{id}/ledger/?outletId=xxx

    Get distributor ledger entries with running balance.
    Returns list of all debit/credit entries for the distributor.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, distributor_id, *args, **kwargs):
        """
        Get distributor ledger.

        Query parameters:
        - outletId: Outlet UUID to filter ledger

        Returns:
        {
            "distributor": {...},
            "ledger": [
                {
                    "id": "...",
                    "date": "2026-03-17",
                    "entryType": "purchase",
                    "referenceNo": "PU-001",
                    "description": "Purchase invoice",
                    "debit": 5000.0,
                    "credit": 0,
                    "runningBalance": 5000.0,
                    "createdAt": "2026-03-17T..."
                }
            ],
            "summary": {
                "totalDebit": 50000.0,
                "totalCredit": 10000.0,
                "runningBalance": 40000.0
            }
        }
        """

        outlet_id = request.query_params.get('outletId')

        try:
            outlet = Outlet.objects.get(id=outlet_id)
        except Outlet.DoesNotExist:
            return Response(
                {'detail': f'Outlet {outlet_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        try:
            distributor = Distributor.objects.get(id=distributor_id, outlet=outlet)
        except Distributor.DoesNotExist:
            return Response(
                {'detail': f'Distributor {distributor_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        logger.info(f"Fetching ledger for distributor: {distributor.name}")

        # Get ledger entries for this distributor
        ledger_entries = LedgerEntry.objects.filter(
            outlet=outlet,
            distributor=distributor,
            entity_type='distributor'
        ).order_by('date', 'created_at')

        logger.info(f"Found {ledger_entries.count()} ledger entries")

        # Serialize ledger entries
        ledger_list = []
        total_debit = 0
        total_credit = 0
        running_balance = 0

        for entry in ledger_entries:
            ledger_list.append({
                'id': str(entry.id),
                'date': entry.date.isoformat(),
                'entryType': entry.entry_type,
                'referenceNo': entry.reference_no,
                'description': entry.description,
                'debit': float(entry.debit),
                'credit': float(entry.credit),
                'runningBalance': float(entry.running_balance),
                'createdAt': entry.created_at.isoformat(),
            })
            total_debit += entry.debit
            total_credit += entry.credit
            running_balance = entry.running_balance

        # Distributor summary
        distributor_data = {
            'id': str(distributor.id),
            'name': distributor.name,
            'gstin': distributor.gstin,
            'phone': distributor.phone,
            'email': distributor.email,
            'address': distributor.address,
            'city': distributor.city,
            'state': distributor.state,
            'creditDays': distributor.credit_days,
            'openingBalance': float(distributor.opening_balance) if distributor.opening_balance else 0,
            'balanceType': distributor.balance_type,
            'isActive': distributor.is_active,
        }

        result = {
            'distributor': distributor_data,
            'ledger': ledger_list,
            'summary': {
                'totalDebit': float(total_debit),
                'totalCredit': float(total_credit),
                'runningBalance': float(running_balance),
            }
        }

        return Response(result, status=status.HTTP_200_OK)
