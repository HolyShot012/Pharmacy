from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, RegexValidator
from django.contrib.postgres.fields import JSONField

class User(AbstractUser):
    class Roles(models.TextChoices):
        USER = 'user', 'User'
        ADMIN = 'admin', 'Admin'
        PHARMACIST = 'pharmacist', 'Pharmacist'
        DOCTOR = 'doctor', 'Doctor'
        ACCOUNTANT = 'accountant', 'Accountant'
        MANAGER = 'manager', 'Manager'

    base_role = Roles.USER

    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=75)
    last_name = models.CharField(max_length=75)
    email = models.EmailField(unique=True)
    phone_number = PhoneNumberField(unique=True)
    current_address = models.CharField(max_length=255)
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    avatar_url = models.URLField(blank=True, null=True)
    preferred_theme = models.CharField(
        max_length=50,
        default='light',
        
    )
    role = models.CharField(max_length=50, default=base_role, choices=Roles.choices)
    birth_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        db_table = 'user'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone_number']),
        ]

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created and instance.role == User.Roles.USER:
        UserProfile.objects.create(user=instance)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'user_profile'
        indexes = [models.Index(fields=['user'])]

class UserUiInteractions(models.Model):
    interaction_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')
    component_name = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    action = models.CharField(
        max_length=50,
        
    )
    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_ui_interactions'
        ordering = ['-occurred_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['occurred_at']),
        ]

class UserSearchLogs(models.Model):
    search_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='search_logs')
    keyword = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)
    search_filters = JSONField(blank=True, null=True)
    results_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    search_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_search_logs'
        ordering = ['-search_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['keyword']),
            models.Index(fields=['search_at']),
        ]

class UserMedicalHistory(models.Model):
    class ConditionTypes(models.TextChoices):
        CHRONIC = 'chronic', 'Chronic'
        ACUTE = 'acute', 'Acute'
        ALLERGY = 'allergy', 'Allergy'

    history_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_history')
    condition_name = models.CharField(max_length=255)
    type = models.CharField(max_length=100, choices=ConditionTypes.choices)
    notes = models.TextField(blank=True, null=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.condition_name} - {self.type}"

    class Meta:
        db_table = 'user_medical_history'
        ordering = ['-recorded_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['recorded_at']),
        ]

class UserPointTransactions(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='point_transactions')
    source = models.CharField(max_length=100)
    related_id = models.IntegerField()
    points = models.IntegerField(validators=[MinValueValidator(0)])
    reason = models.TextField(blank=True, null=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_point_transactions'
        ordering = ['-recorded_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['recorded_at']),
        ]

class UserActivityLogs(models.Model):
    class ActivityTypes(models.TextChoices):
        VIEW = 'view', 'View'
        PURCHASE = 'purchase', 'Purchase'
        LOGIN = 'login', 'Login'

    activity_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs')
    activity_type = models.CharField(max_length=50, choices=ActivityTypes.choices)
    time_spent_seconds = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    points_earned = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.activity_type} at {self.recorded_at}"

    class Meta:
        db_table = 'user_activity_logs'
        ordering = ['-recorded_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['recorded_at']),
        ]

class Branches(models.Model):
    branch_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    address = models.CharField(max_length=255)
    province = models.CharField(max_length=100)
    # latitude = models.FloatField(null=True, blank=True)
    # longitude = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = 'branches'
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['province']),
        ]

class Products(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    manufacturer = models.CharField(max_length=255, blank=True, null=True)
    class_level = models.IntegerField(
        default=1,
        choices=[(1, 'Class 1'), (2, 'Class 2'), (3, 'Class 3')]
    )
    need_rx = models.BooleanField(default=False)
    expiration_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = 'products'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['category']),
            models.Index(fields=['created_at']),
        ]

class UserProductViews(models.Model):
    view_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_views')
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='views')
    viewed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} viewed {self.product.name} at {self.viewed_at}"

    class Meta:
        db_table = 'user_product_views'
        ordering = ['-viewed_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['product']),
            models.Index(fields=['viewed_at']),
        ]
        unique_together = [['user', 'product']]

class Prescriptions(models.Model):
    prescription_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    prescription_date = models.DateTimeField(auto_now_add=True)
    type = models.CharField(
        max_length=100,
        choices=[('regular', 'Regular'), ('controlled', 'Controlled'), ('emergency', 'Emergency')],
        default='regular'
    )
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=50,
        choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')],
        default='pending'
    )
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Prescription {self.prescription_id} for {self.user.first_name} {self.user.last_name}"

    class Meta:
        db_table = 'prescriptions'
        ordering = ['-prescription_date']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['prescription_date']),
            models.Index(fields=['status']),
        ]

class PrescriptionItems(models.Model):
    prescription_item_id = models.AutoField(primary_key=True)
    prescription = models.ForeignKey(Prescriptions, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='prescription_items')
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    dosage_amount = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    dosage_unit = models.ForeignKey('DosageUnits', on_delete=models.PROTECT, related_name='prescription_items')
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.product.name} in Prescription {self.prescription.prescription_id}"

    class Meta:
        db_table = 'prescription_items'
        ordering = ['prescription_item_id']
        indexes = [
            models.Index(fields=['prescription']),
            models.Index(fields=['product']),
        ]
        unique_together = [['prescription', 'product']]

class PrescriptionApprovals(models.Model):
    approval_id = models.AutoField(primary_key=True)
    prescription = models.ForeignKey(Prescriptions, on_delete=models.CASCADE, related_name='approvals')
    approved_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescription_approvals')
    role = models.CharField(max_length=50, choices=User.Roles.choices)
    decision = models.CharField(
        max_length=50,
        choices=[('approved', 'Approved'), ('rejected', 'Rejected')]
    )
    comments = models.TextField(blank=True, null=True)
    approved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'prescription_approvals'
        ordering = ['-approved_at']
        indexes = [
            models.Index(fields=['prescription']),
            models.Index(fields=['approved_by']),
            models.Index(fields=['approved_at']),
        ]

class StatusDimensions(models.Model):
    status_id = models.AutoField(primary_key=True)
    entity_type = models.CharField(max_length=100)
    status_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'status_dimensions'
        ordering = ['entity_type', 'status_name']
        indexes = [
            models.Index(fields=['entity_type']),
            models.Index(fields=['status_name']),
        ]
        unique_together = [['entity_type', 'status_name']]

class Orders(models.Model):
    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    prescription = models.ForeignKey(Prescriptions, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    branch = models.ForeignKey(Branches, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.ForeignKey(StatusDimensions, on_delete=models.CASCADE, related_name='orders')

    def __str__(self):
        return f"Order {self.order_id} by {self.user.first_name} {self.user.last_name}"

    class Meta:
        db_table = 'orders'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user']),
            models.Index(fields=['prescription']),
            models.Index(fields=['created_at']),
        ]

class OrderItems(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.IntegerField(default=1, validators=[MinValueValidator(1)])
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])

    def __str__(self):
        return f"{self.product.name} in Order {self.order.order_id}"

    class Meta:
        db_table = 'order_items'
        ordering = ['order_item_id']
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['product']),
        ]
        unique_together = [['order', 'product']]

class Payments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name='payments')
    status = models.ForeignKey(StatusDimensions, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    paid_at = models.DateTimeField(auto_now_add=True)
    insurance_included = models.BooleanField(default=False)
    method = models.ForeignKey('PaymentMethods', on_delete=models.CASCADE, related_name='payments')

    class Meta:
        db_table = 'payments'
        ordering = ['-paid_at']
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['paid_at']),
        ]

class PaymentMethods(models.Model):
    method_id = models.AutoField(primary_key=True)
    method_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.method_name

    class Meta:
        db_table = 'payment_methods'
        ordering = ['method_name']
        indexes = [models.Index(fields=['method_name'])]

class Inventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    product = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='inventory')
    branch = models.ForeignKey(Branches, on_delete=models.CASCADE, related_name='inventory')
    available_quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    reserved_quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.product.name} at {self.branch.name} - Available: {self.available_quantity}"

    class Meta:
        db_table = 'inventory'
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['product']),
            models.Index(fields=['branch']),
        ]
        unique_together = [['product', 'branch']]

class DosageUnits(models.Model):
    unit_id = models.AutoField(primary_key=True)
    unit_name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.unit_name

    class Meta:
        db_table = 'dosage_units'
        ordering = ['unit_name']
        indexes = [models.Index(fields=['unit_name'])]