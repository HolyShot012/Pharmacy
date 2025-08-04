from django.db import models
from django.contrib.auth.models import User
import uuid
from django.core.validators import MinValueValidator


class Branches(models.Model):
    branch_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    province = models.CharField(max_length=100, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    class Meta:
        db_table = 'branches'

class Products(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)
    manufacturer = models.CharField(max_length=255, blank=True, null=True)
    class_level = models.IntegerField(blank=True, null=True)
    no_approval = models.BooleanField(default=True)
    expiration_date = models.DateField(blank=True, null=True)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'products'

class StatusDimension(models.Model):
    status_id = models.AutoField(primary_key=True)
    entity_type = models.CharField(max_length=50)
    status_name = models.CharField(max_length=50)
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'status_dimension'

class Users(models.Model):
    ROLE_CHOICES = [
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
        ('pharmacist', 'Pharmacist'),
        ('admin', 'Admin'),
    ]
    id = models.OneToOneField(User, on_delete=models.CASCADE, db_column='id', primary_key=True)
 
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    current_address = models.CharField(max_length=200, blank=True, null=True)
    province = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    avatar_url = models.CharField(max_length=200, blank=True, null=True)
    preferred_theme = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    birth_date = models.DateField(blank=True, null=True)


    class Meta:
        db_table = 'users'

class Inventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    product = models.ForeignKey('Products', on_delete=models.CASCADE)
    branch = models.ForeignKey(Branches, on_delete=models.CASCADE)
    available_qty = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    reserved_qty = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'inventory'  

class Prescriptions(models.Model):
    prescription_id = models.AutoField(primary_key=True)
    image_url = models.URLField(max_length=255, blank=True, null=True)
    classification = models.IntegerField()
    status = models.ForeignKey('StatusDimension', on_delete=models.RESTRICT)
    submitted_at = models.DateTimeField(auto_now_add=True)
    patient = models.ForeignKey('Users', on_delete=models.CASCADE)
    doctor = models.ForeignKey('Users', on_delete=models.CASCADE, related_name='prescriptions_doctor_set')

    class Meta:
        db_table = 'prescriptions'

class Orders(models.Model):
    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', on_delete=models.CASCADE)
    branch = models.ForeignKey(Branches, on_delete=models.CASCADE)
    prescription = models.ForeignKey('Prescriptions', on_delete=models.CASCADE, blank=True, null=True)
    status = models.ForeignKey('StatusDimension', on_delete=models.RESTRICT)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'orders'

class OrderItems(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    order = models.ForeignKey('Orders', on_delete=models.CASCADE)
    product = models.ForeignKey('Products', on_delete=models.CASCADE)
    quantity = models.IntegerField(validators=[MinValueValidator(1)])
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'order_items'

class PaymentMethods(models.Model):
    method_id = models.AutoField(primary_key=True)
    method_name = models.CharField(max_length=100)
    description = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        db_table = 'payment_methods'

class Payments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Orders, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.ForeignKey(PaymentMethods, on_delete=models.RESTRICT)
    status = models.ForeignKey('StatusDimension', on_delete=models.RESTRICT)
    paid_at = models.DateTimeField(auto_now_add=True)
    insurance_included = models.BooleanField(default=False)
    insurance_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        db_table = 'payments'

class PrescriptionApprovals(models.Model):
    approval_id = models.AutoField(primary_key=True)
    prescription = models.ForeignKey('Prescriptions', on_delete=models.CASCADE)
    approved_by = models.ForeignKey('Users', on_delete=models.CASCADE)
    decision = models.CharField(max_length=50)
    comment = models.CharField(max_length=255, blank=True, null=True)
    approved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'prescription_approvals'

class PrescriptionItems(models.Model):
    prescription_items_id = models.AutoField(primary_key=True)
    prescription = models.ForeignKey('Prescriptions', on_delete=models.CASCADE)
    product = models.ForeignKey('Products', on_delete=models.CASCADE)
    dosage_amount = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=50)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'prescription_items'

class UserActivityLogs(models.Model):
    activity_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', on_delete=models.CASCADE)
    time_spent_seconds = models.IntegerField(validators=[MinValueValidator(0)])
    points_earned = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(0)])
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_activity_logs'

class UserMedicalHistory(models.Model):
    history_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', on_delete=models.CASCADE)
    condition = models.CharField(max_length=255)
    type = models.CharField(max_length=100, blank=True, null=True)
    note = models.CharField(max_length=255, blank=True, null=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_medical_history'

class UserPointTransactions(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', on_delete=models.CASCADE)
    source = models.CharField(max_length=100)
    points = models.IntegerField(validators=[MinValueValidator(0)])
    recorded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_point_transactions'

class UserProductViews(models.Model):
    view_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_product_views'

class UserSearchLogs(models.Model):
    search_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', on_delete=models.CASCADE)
    keyword = models.CharField(max_length=255, blank=True, null=True)
    category = models.CharField(max_length=100, blank=True, null=True)
    search_filters = models.CharField(max_length=255, blank=True, null=True)
    results_count = models.IntegerField(blank=True, null=True, validators=[MinValueValidator(0)])
    searched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_search_logs'

class UserUiInteractions(models.Model):
    interaction_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', on_delete=models.CASCADE)
    component = models.CharField(max_length=100)
    value = models.CharField(max_length=255, blank=True, null=True)
    action = models.CharField(max_length=100)
    occurred_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_ui_interactions'

class ApiMedicine(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    quantity = models.IntegerField()
    expiry_date = models.DateField()

    class Meta:
        db_table = 'api_medicine'

