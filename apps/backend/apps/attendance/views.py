import logging
from datetime import datetime, timedelta, time
from decimal import Decimal
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils import timezone
from django.db import transaction

from apps.attendance.models import AttendanceRecord
from apps.accounts.models import Staff
from apps.core.models import Outlet

logger = logging.getLogger(__name__)

# Default shift timings (can be moved to AttendanceSettings model later)
DEFAULT_SHIFT_START = time(9, 0)  # 9:00 AM
DEFAULT_SHIFT_END = time(18, 0)   # 6:00 PM
LATE_GRACE_PERIOD_MINUTES = 10


class AttendanceCheckInView(APIView):
    """
    POST /api/v1/attendance/check-in/

    Record staff check-in/check-out with optional selfie photo.
    Validates staffPin, checks shift timing, and creates AttendanceRecord.

    Request body:
    {
        "outletId": "...",
        "staffId": "...",
        "staffPin": "0000",
        "type": "check_in" | "check_out",
        "selfieUrl": "data:image/jpeg;base64,..." (optional)
    }

    Response: AttendanceRecord (201 Created) or error (400/401/404/500)
    """

    def post(self, request, *args, **kwargs):
        """Record attendance check-in or check-out."""

        try:
            payload = request.data
            outlet_id = payload.get('outletId')
            staff_id = payload.get('staffId')
            staff_pin = payload.get('staffPin')
            check_type = payload.get('type', 'check_in')
            selfie_url = payload.get('selfieUrl')

            # Validate outlet exists
            try:
                outlet = Outlet.objects.get(id=outlet_id)
            except Outlet.DoesNotExist:
                logger.warning(f"Outlet {outlet_id} not found")
                return Response(
                    {'error': {'code': 'OUTLET_NOT_FOUND', 'message': 'Outlet not found'}},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Validate staff exists and pin matches
            try:
                staff = Staff.objects.get(id=staff_id, outlet=outlet)
            except Staff.DoesNotExist:
                logger.warning(f"Staff {staff_id} not found for outlet {outlet_id}")
                return Response(
                    {'error': {'code': 'STAFF_NOT_FOUND', 'message': 'Staff not found'}},
                    status=status.HTTP_404_NOT_FOUND
                )

            # Validate PIN
            if staff.staff_pin != staff_pin:
                logger.warning(f"Invalid PIN for staff {staff.name}")
                return Response(
                    {'error': {'code': 'INVALID_PIN', 'message': 'Invalid staff PIN'}},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            today = timezone.now().date()
            current_time = timezone.now().time()

            logger.info(f"Processing {check_type} for {staff.name} at {outlet.name}")

            # Use transaction for consistency
            with transaction.atomic():
                # Get or create today's attendance record
                record, created = AttendanceRecord.objects.get_or_create(
                    outlet=outlet,
                    staff=staff,
                    date=today,
                    defaults={'status': 'present'}
                )

                if check_type == 'check_in':
                    # Validate no previous check-in today
                    if record.check_in_time:
                        logger.warning(f"Staff {staff.name} already checked in today")
                        return Response(
                            {'error': {'code': 'ALREADY_CHECKED_IN', 'message': 'Already checked in today'}},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    # Record check-in time
                    record.check_in_time = current_time
                    record.check_in_photo = selfie_url

                    # Calculate if late (with grace period)
                    grace_end = datetime.combine(today, DEFAULT_SHIFT_START) + timedelta(minutes=LATE_GRACE_PERIOD_MINUTES)
                    current_datetime = datetime.combine(today, current_time)

                    if current_datetime > grace_end:
                        record.is_late = True
                        late_delta = current_datetime - datetime.combine(today, DEFAULT_SHIFT_START)
                        record.late_by_minutes = int(late_delta.total_seconds() / 60)
                        record.status = 'late'
                        logger.info(f"{staff.name} checked in late by {record.late_by_minutes} minutes")
                    else:
                        record.status = 'present'
                        logger.info(f"{staff.name} checked in on time")

                elif check_type == 'check_out':
                    # Validate check-in exists
                    if not record.check_in_time:
                        logger.warning(f"No check-in record for {staff.name} today")
                        return Response(
                            {'error': {'code': 'NOT_CHECKED_IN', 'message': 'No check-in record found for today'}},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    # Validate no previous check-out
                    if record.check_out_time:
                        logger.warning(f"Staff {staff.name} already checked out today")
                        return Response(
                            {'error': {'code': 'ALREADY_CHECKED_OUT', 'message': 'Already checked out today'}},
                            status=status.HTTP_400_BAD_REQUEST
                        )

                    # Record check-out time
                    record.check_out_time = current_time
                    record.check_out_photo = selfie_url

                    # Calculate working hours
                    check_in_datetime = datetime.combine(today, record.check_in_time)
                    check_out_datetime = datetime.combine(today, current_time)
                    working_seconds = (check_out_datetime - check_in_datetime).total_seconds()
                    working_hours = Decimal(str(round(working_seconds / 3600, 2)))
                    record.working_hours = working_hours

                    logger.info(f"{staff.name} checked out after {working_hours} hours")

                record.save()
                logger.info(f"Attendance record saved for {staff.name}")

            # Serialize response
            result = self._serialize_attendance_record(record)
            return Response(result, status=status.HTTP_201_CREATED)

        except Exception as e:
            logger.error(f"Error processing attendance: {e}", exc_info=True)
            return Response(
                {'error': {'code': 'INTERNAL_ERROR', 'message': 'Failed to process attendance'}},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _serialize_attendance_record(self, record):
        """Serialize AttendanceRecord to response shape."""
        return {
            'id': str(record.id),
            'staffId': str(record.staff_id),
            'staff': {
                'id': str(record.staff.id),
                'name': record.staff.name,
                'role': record.staff.role,
            },
            'outletId': str(record.outlet_id),
            'date': record.date.isoformat(),
            'checkInTime': record.check_in_time.isoformat() if record.check_in_time else None,
            'checkOutTime': record.check_out_time.isoformat() if record.check_out_time else None,
            'status': record.status,
            'isLate': record.is_late,
            'lateByMinutes': record.late_by_minutes,
            'workingHours': float(record.working_hours) if record.working_hours else None,
            'checkInPhoto': record.check_in_photo,
            'checkOutPhoto': record.check_out_photo,
            'notes': record.notes,
            'createdAt': record.created_at.isoformat(),
        }
