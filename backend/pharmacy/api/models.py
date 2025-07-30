# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class ApiMedicine(models.Model):
    id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=50)
    quantity = models.IntegerField()
    expiry_date = models.DateField()

    class Meta:
        managed = False
        db_table = 'api_medicine'


class Branches(models.Model):
    branch_id = models.UUIDField(primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=200)
    province = models.CharField(max_length=50, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'branches'


class DjangoContentType(models.Model):
    name = models.CharField(max_length=100)
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class Inventory(models.Model):
    inventory_id = models.UUIDField(primary_key=True)
    product = models.ForeignKey('Products', models.DO_NOTHING)
    branch = models.ForeignKey(Branches, models.DO_NOTHING)
    available_qty = models.IntegerField()
    reserved_qty = models.IntegerField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'inventory'


class OrderItems(models.Model):
    order_item_id = models.UUIDField(primary_key=True)
    order = models.ForeignKey('Orders', models.DO_NOTHING)
    product = models.ForeignKey('Products', models.DO_NOTHING)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'order_items'


class Orders(models.Model):
    order_id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    branch = models.ForeignKey(Branches, models.DO_NOTHING)
    prescription = models.ForeignKey('Prescriptions', models.DO_NOTHING, blank=True, null=True)
    status = models.ForeignKey('StatusDimension', models.DO_NOTHING)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'orders'


class PaymentMethods(models.Model):
    method_id = models.UUIDField(primary_key=True)
    method_name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payment_methods'


class Payments(models.Model):
    payment_id = models.UUIDField(primary_key=True)
    order = models.ForeignKey(Orders, models.DO_NOTHING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.ForeignKey(PaymentMethods, models.DO_NOTHING)
    status = models.ForeignKey('StatusDimension', models.DO_NOTHING)
    paid_at = models.DateTimeField()
    insurance_included = models.BooleanField()
    insurance_amount = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payments'


class PrescriptionApprovals(models.Model):
    approval_id = models.UUIDField(primary_key=True)
    prescription = models.ForeignKey('Prescriptions', models.DO_NOTHING)
    approved_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='approved_by')
    decision = models.CharField(max_length=50)
    comment = models.CharField(max_length=500, blank=True, null=True)
    approved_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'prescription_approvals'


class PrescriptionItems(models.Model):
    prescription_items_id = models.UUIDField(primary_key=True)
    prescription = models.ForeignKey('Prescriptions', models.DO_NOTHING)
    product = models.ForeignKey('Products', models.DO_NOTHING)
    dosage_amount = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(max_length=20)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        managed = False
        db_table = 'prescription_items'


class Prescriptions(models.Model):
    prescription_id = models.UUIDField(primary_key=True)
    image_url = models.CharField(max_length=200, blank=True, null=True)
    classification = models.IntegerField()
    status = models.ForeignKey('StatusDimension', models.DO_NOTHING)
    submitted_at = models.DateTimeField()
    patient = models.ForeignKey('Users', models.DO_NOTHING)
    doctor = models.ForeignKey('Users', models.DO_NOTHING, related_name='prescriptions_doctor_set')

    class Meta:
        managed = False
        db_table = 'prescriptions'


class Products(models.Model):
    product_id = models.UUIDField(primary_key=True)
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
        managed = False
        db_table = 'products'


class StatusDimension(models.Model):
    status_id = models.UUIDField(primary_key=True)
    entity_type = models.CharField(max_length=50)
    status_name = models.CharField(max_length=50)
    description = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'status_dimension'


class UserActivityLogs(models.Model):
    activity_id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    time_spent_seconds = models.IntegerField()
    points_earned = models.IntegerField(blank=True, null=True)
    recorded_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_activity_logs'


class UserMedicalHistory(models.Model):
    history_id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    condition = models.CharField(max_length=100)
    type = models.CharField(max_length=50, blank=True, null=True)
    note = models.CharField(max_length=500, blank=True, null=True)
    recorded_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_medical_history'


class UserPointTransactions(models.Model):
    transaction_id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    source = models.CharField(max_length=50)
    points = models.IntegerField()
    recorded_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_point_transactions'


class UserProductViews(models.Model):
    view_id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    product = models.ForeignKey(Products, models.DO_NOTHING)
    viewed_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_product_views'


class UserSearchLogs(models.Model):
    search_id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    keyword = models.CharField(max_length=100, blank=True, null=True)
    category = models.CharField(max_length=50, blank=True, null=True)
    search_filters = models.CharField(max_length=200, blank=True, null=True)
    results_count = models.IntegerField(blank=True, null=True)
    searched_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_search_logs'


class UserUiInteractions(models.Model):
    interaction_id = models.UUIDField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    component = models.CharField(max_length=50)
    value = models.CharField(max_length=200, blank=True, null=True)
    action = models.CharField(max_length=50)
    occurred_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_ui_interactions'


class Users(models.Model):
    user_id = models.UUIDField(primary_key=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.CharField(unique=True, max_length=100)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    current_address = models.CharField(max_length=200, blank=True, null=True)
    province = models.CharField(max_length=50, blank=True, null=True)
    city = models.CharField(max_length=50, blank=True, null=True)
    avatar_url = models.CharField(max_length=200, blank=True, null=True)
    preferred_theme = models.CharField(max_length=20, blank=True, null=True)
    role = models.CharField(max_length=50)
    birth_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField()


    class Meta:
        managed = False
        db_table = 'users'