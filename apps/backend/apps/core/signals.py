from django.db.models.signals import post_save
from django.dispatch import receiver

from apps.core.models import Outlet


@receiver(post_save, sender=Outlet)
def on_outlet_created(sender, instance, created, **kwargs):
    if created:
        from apps.accounts.management.commands.seed_ledgers import seed_outlet_ledgers
        seed_outlet_ledgers(instance)
