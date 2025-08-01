from django.db import models
from django.contrib.auth.models import User
import uuid

# Define models in a logical order based on dependencies

class Branches(models.Model):
    branch_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    province = models.CharField(max_length=50, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 'branches'

class Products(models.Model):
    product_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    manufacturer = models.CharField(max_length=100, blank=True, null=True)
    prescription = models.CharField(max_length=50, blank=True, null=True)
    class_level = models.IntegerField(blank=True, null=True)
    need_approval = models.BooleanField()
    expiration_date = models.DateField(blank=True, null=True)

    class Meta:
        db_table = 'products'

class StatusDimension(models.Model):
    status_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    entity_type = models.CharField(max_length=50)
    status_name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True, null=True)

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
    inventory_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branches, on_delete=models.CASCADE)
    available_qty = models.IntegerField()
    reserved_qty = models.IntegerField()
    updated_at = models.DateTimeField()

    class Meta:
        db_table = 'inventory'

class Prescriptions(models.Model):
    prescription_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    image_url = models.CharField(max_length=200, blank=True, null=True)
    classification = models.IntegerField()
    status = models.ForeignKey(StatusDimension, on_delete=models.CASCADE)
    submitted_at = models.DateTimeField()
    patient = models.ForeignKey(Users, on_delete=models.CASCADE)
    doctor = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='prescriptions_doctor_set')

    class Meta:
        db_table = 'prescriptions'

class Orders(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    branch = models.ForeignKey(Branches, on_delete=models.CASCADE)
    prescription = models.ForeignKey(Prescriptions, on_delete=models.SET_NULL, blank=True, null=True)
    status = models.ForeignKey(StatusDimension, on_delete=models.CASCADE)
    created_at = models.DateTimeField()

    class Meta:
        db_table = 'orders'

class OrderItems(models.Model):
    order_item_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Orders, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'order_items'

class PaymentMethods(models.Model):
    method_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    method_name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        db_table = 'payment_methods'

class Payments(models.Model):
    payment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Orders, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.ForeignKey(PaymentMethods, on_delete=models.CASCADE)
    status = models.ForeignKey(StatusDimension, on_delete=models.CASCADE)
    paid_at = models.DateTimeField()
    insurance_included = models.BooleanField()
    insurance_amount = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 'payments'

class PrescriptionApprovals(models.Model):
    approval_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prescription = models.ForeignKey(Prescriptions, on_delete=models.CASCADE)
    approved_by = models.ForeignKey(Users, on_delete=models.CASCADE, db_column='approved_by')
    decision = models.CharField(max_length=50)
    comment = models.CharField(max_length=500, blank=True, null=True)
    approved_at = models.DateTimeField()

    class Meta:
        db_table = 'prescription_approvals'

class PrescriptionItems(models.Model):
    prescription_items_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prescription = models.ForeignKey(Prescriptions, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    dosage_amount = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = 'prescription_items'

class UserActivityLogs(models.Model):
    activity_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    time_spent_seconds = models.IntegerField()
    points_earned = models.IntegerField(blank=True, null=True)
    recorded_at = models.DateTimeField()

    class Meta:
        db_table = 'user_activity_logs'

class UserMedicalHistory(models.Model):
    history_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    condition = models.CharField(max_length=100)
    type = models.CharField(max_length=50, blank=True, null=True)
    note = models.CharField(max_length=500, blank=True, null=True)
    recorded_at = models.DateTimeField()

    class Meta:
        db_table = 'user_medical_history'

class UserPointTransactions(models.Model):
    transaction_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    source = models.CharField(max_length=50)
    points = models.IntegerField()
    recorded_at = models.DateTimeField()

    class Meta:
        db_table = 'user_point_transactions'

class UserProductViews(models.Model):
    view_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField()

    class Meta:
        db_table = 'user_product_views'

class UserSearchLogs(models.Model):
    search_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    keyword = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    search_filters = models.CharField(max_length=200, blank=True, null=True)
    results_count = models.IntegerField(blank=True, null=True)
    searched_at = models.DateTimeField()

    class Meta:
        db_table = 'user_search_logs'

class UserUiInteractions(models.Model):
    interaction_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    component = models.CharField(max_length=50)
    value = models.CharField(max_length=200, blank=True, null=True)
    action = models.CharField(max_length=50)
    occurred_at = models.DateTimeField()

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

