from django.db import models
import uuid


class OutletFilteredManager(models.Manager):
    """Custom manager that filters queries by outletId for outlet-specific models."""

    def for_outlet(self, outlet_id):
        """Filter queryset by outlet_id."""
        return self.filter(outlet_id=outlet_id)


class Organization(models.Model):
    """Represents a multitenancy organization (e.g., pharmacy chain)."""

    PLAN_CHOICES = [
        ('starter', 'Starter'),
        ('pro', 'Pro'),
        ('enterprise', 'Enterprise'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    plan = models.CharField(max_length=20, choices=PLAN_CHOICES, default='starter')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'core_organization'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class Outlet(models.Model):
    """Represents a specific pharmacy branch/outlet."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='outlets')
    name = models.CharField(max_length=255)
    address = models.TextField()
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)
    gstin = models.CharField(max_length=15, unique=True)
    drug_license_no = models.CharField(max_length=100, unique=True)
    phone = models.CharField(max_length=20)
    logo_url = models.URLField(null=True, blank=True)
    invoice_footer = models.TextField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    objects = OutletFilteredManager()

    class Meta:
        db_table = 'core_outlet'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'is_active']),
        ]

    def __str__(self):
        return self.name
