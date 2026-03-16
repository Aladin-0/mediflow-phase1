from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils.translation import gettext_lazy as _
import uuid


class OutletFilteredManager(models.Manager):
    """Custom manager that filters queries by outletId for outlet-specific models."""

    def for_outlet(self, outlet_id):
        """Filter queryset by outlet_id."""
        return self.filter(outlet_id=outlet_id)


class StaffManager(BaseUserManager):
    """Custom manager for Staff user model."""

    def create_user(self, phone, password=None, **extra_fields):
        """Create and save a regular staff member."""
        if not phone:
            raise ValueError(_('Phone number is required'))
        user = self.model(phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        """Create and save a superuser staff member."""
        extra_fields.setdefault('role', 'super_admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone, password, **extra_fields)


class Staff(AbstractBaseUser, PermissionsMixin):
    """Custom User model for staff members with PIN auth and role-based permissions."""

    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('billing_staff', 'Billing Staff'),
        ('view_only', 'View Only'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    outlet = models.ForeignKey('core.Outlet', on_delete=models.CASCADE, related_name='staff_members')
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(null=True, blank=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='billing_staff')
    staff_pin = models.CharField(max_length=20, help_text='PIN for kiosk/quick auth')
    avatar_url = models.URLField(null=True, blank=True)
    max_discount = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    can_edit_rate = models.BooleanField(default=False)
    can_view_purchase_rates = models.BooleanField(default=False)
    can_create_purchases = models.BooleanField(default=False)
    can_access_reports = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    joining_date = models.DateTimeField(auto_now_add=True)
    last_login = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = StaffManager()
    outlet_objects = OutletFilteredManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = ['name']

    class Meta:
        db_table = 'accounts_staff'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['outlet', 'is_active']),
            models.Index(fields=['phone']),
        ]

    def __str__(self):
        return f"{self.name} ({self.get_role_display()})"


class Customer(models.Model):
    """Customer profile with credit and purchase history."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    outlet = models.ForeignKey('core.Outlet', on_delete=models.CASCADE, related_name='customers')
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    address = models.TextField(null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    gstin = models.CharField(max_length=15, null=True, blank=True, help_text='For B2B customers')

    # Credit terms
    fixed_discount = models.DecimalField(max_digits=5, decimal_places=2, default=0,
                                         help_text='Fixed discount % for this customer')
    credit_limit = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    outstanding = models.DecimalField(max_digits=12, decimal_places=2, default=0,
                                      help_text='Current outstanding balance')

    # Purchase history
    total_purchases = models.DecimalField(max_digits=12, decimal_places=2, default=0,
                                          help_text='Lifetime purchase value')
    is_chronic = models.BooleanField(default=False, help_text='Chronic patient with regular medications')
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = OutletFilteredManager()

    class Meta:
        db_table = 'accounts_customer'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['outlet', 'is_active']),
            models.Index(fields=['phone', 'outlet']),
        ]

    def __str__(self):
        return self.name


class Doctor(models.Model):
    """Doctor profile for prescription details on Schedule H drugs."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    outlet = models.ForeignKey('core.Outlet', on_delete=models.CASCADE, related_name='doctors')
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    reg_no = models.CharField(max_length=50, help_text='Medical registration number')
    qualification = models.CharField(max_length=255)
    specialty = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    objects = OutletFilteredManager()

    class Meta:
        db_table = 'accounts_doctor'
        ordering = ['name']
        indexes = [
            models.Index(fields=['outlet', 'is_active']),
        ]

    def __str__(self):
        return f"Dr. {self.name} ({self.specialty})"
