from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=50, null=False)
    last_name = models.CharField(max_length=50, null=False)
    email = models.CharField(max_length=100, unique=True, null=False)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    current_address = models.CharField(max_length=200, blank=True, null=True)
    province = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    avatar_url = models.CharField(max_length=200, blank=True, null=True)
    preferred_theme = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=50, null=False)
    birth_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['created_at']),
        ]
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == 'patient':
        UserProfile.objects.create(user=instance)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)
    class Meta:
        db_table = 'user_profiles'
        indexes = [
            models.Index(fields=['user']),
        ]

class UserMedicalHistory(models.Model):
    history_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    condition = models.CharField(max_length=100, null=False)
    type = models.CharField(max_length=50, blank=True, null=True)
    note = models.CharField(max_length=500, blank=True, null=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_medical_history'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['condition']),
            models.Index(fields=['recorded_at']),
        ]

class StatusDimension(models.Model):
    status_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entity_type = models.CharField(max_length=50, null=False)
    status_name = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        db_table = 'status_dimension'
        indexes = [
            models.Index(fields=['entity_type']),
            models.Index(fields=['status_name']),
        ]

class Prescription(models.Model):
    prescription_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image_url = models.CharField(max_length=200, blank=True, null=True)
    classification = models.IntegerField(null=False)
    status = models.ForeignKey(StatusDimension, on_delete=models.RESTRICT)
    submitted_at = models.DateTimeField(auto_now_add=True)
    patient = models.ForeignKey(User, related_name='patient_prescriptions', on_delete=models.CASCADE)
    doctor = models.ForeignKey(User, related_name='doctor_prescriptions', on_delete=models.RESTRICT)

    class Meta:
        db_table = 'prescriptions'
        indexes = [
            models.Index(fields=['patient']),
            models.Index(fields=['doctor']),
            models.Index(fields=['status']),
            models.Index(fields=['submitted_at']),
        ]

class PrescriptionApproval(models.Model):
    approval_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    approved_by = models.ForeignKey(User, on_delete=models.RESTRICT)
    decision = models.CharField(max_length=50, null=False)
    comment = models.CharField(max_length=500, blank=True, null=True)
    approved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'prescription_approvals'
        indexes = [
            models.Index(fields=['prescription']),
            models.Index(fields=['approved_by']),
            models.Index(fields=['approved_at']),
        ]

class Product(models.Model):
    product_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, null=False)
    category = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    manufacturer = models.CharField(max_length=100, blank=True, null=True)
    prescription = models.CharField(max_length=50, blank=True, null=True)
    class_level = models.IntegerField(blank=True, null=True)
    need_approval = models.BooleanField(default=False)
    expiration_date = models.DateField(blank=True, null=True)

    class Meta:
        db_table = 'products'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category']),
            models.Index(fields=['price']),
        ]

class PrescriptionItem(models.Model):
    prescription_items_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.RESTRICT)
    dosage_amount = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    unit = models.CharField(max_length=20, null=False)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, null=False)

    class Meta:
        db_table = 'prescription_items'
        indexes = [
            models.Index(fields=['prescription']),
            models.Index(fields=['product']),
        ]

class Branch(models.Model):
    branch_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, null=False)
    address = models.CharField(max_length=200, null=False)
    province = models.CharField(max_length=50, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 'branches'
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['province']),
        ]

class Inventory(models.Model):
    inventory_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.RESTRICT)
    available_qty = models.IntegerField(default=0, null=False)
    reserved_qty = models.IntegerField(default=0, null=False)
    updated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'inventory'
        indexes = [
            models.Index(fields=['product']),
            models.Index(fields=['branch']),
            models.Index(fields=['updated_at']),
        ]

class Order(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branch, on_delete=models.RESTRICT)
    prescription = models.ForeignKey(Prescription, on_delete=models.SET_NULL, null=True)
    status = models.ForeignKey(StatusDimension, on_delete=models.RESTRICT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'orders'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['branch']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]

class OrderItem(models.Model):
    order_item_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.RESTRICT)
    quantity = models.IntegerField(null=False)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=False)

    class Meta:
        db_table = 'order_items'
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['product']),
        ]

class PaymentMethod(models.Model):
    method_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    method_name = models.CharField(max_length=50, null=False)
    description = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        db_table = 'payment_methods'
        indexes = [
            models.Index(fields=['method_name']),
        ]

class Payment(models.Model):
    payment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=False)
    method = models.ForeignKey(PaymentMethod, on_delete=models.RESTRICT)
    status = models.ForeignKey(StatusDimension, on_delete=models.RESTRICT)
    paid_at = models.DateTimeField(auto_now_add=True)
    insurance_included = models.BooleanField(default=False)
    insurance_amount = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'payments'
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['method']),
            models.Index(fields=['status']),
            models.Index(fields=['paid_at']),
        ]

class UserActivityLog(models.Model):
    activity_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    time_spent_seconds = models.IntegerField(null=False)
    points_earned = models.IntegerField(blank=True, null=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_activity_logs'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['recorded_at']),
        ]

class UserPointTransaction(models.Model):
    transaction_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    source = models.CharField(max_length=50, null=False)
    points = models.IntegerField(null=False)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_point_transactions'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['recorded_at']),
        ]

class UserUiInteraction(models.Model):
    interaction_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    component = models.CharField(max_length=50, null=False)
    value = models.CharField(max_length=200, blank=True, null=True)
    action = models.CharField(max_length=50, null=False)
    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_ui_interactions'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['component']),
            models.Index(fields=['occurred_at']),
        ]

class UserSearchLog(models.Model):
    search_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    keyword = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    search_filters = models.CharField(max_length=200, blank=True, null=True)
    results_count = models.IntegerField(blank=True, null=True)
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_search_logs'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['keyword']),
            models.Index(fields=['searched_at']),
        ]

class UserProductView(models.Model):
    view_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_product_views'
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['product']),
            models.Index(fields=['viewed_at']),
        ]