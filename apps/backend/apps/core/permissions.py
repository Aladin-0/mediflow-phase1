from rest_framework.permissions import BasePermission

# Role hierarchy (highest to lowest):
#   super_admin → admin → manager → billing_staff → view_only

ADMIN_ROLES = {'super_admin', 'admin'}
MANAGER_ROLES = {'super_admin', 'admin', 'manager'}


class IsAdminStaff(BasePermission):
    """
    Allows access only to super_admin and admin roles.
    Used for: staff CRUD, reports, outlet settings, ledger management.
    """

    message = 'You do not have permission to perform this action. Admin role required.'

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, 'role')
            and request.user.role in ADMIN_ROLES
        )


class IsManagerOrAbove(BasePermission):
    """
    Allows access to super_admin, admin, and manager roles.
    Used for: purchases, sales returns, inventory adjustments.
    """

    message = 'You do not have permission to perform this action. Manager role or above required.'

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and hasattr(request.user, 'role')
            and request.user.role in MANAGER_ROLES
        )
