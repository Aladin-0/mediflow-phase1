from django.urls import path
from apps.attendance.views import AttendanceCheckInView

urlpatterns = [
    path('check-in/', AttendanceCheckInView.as_view(), name='attendance-check-in'),
]
