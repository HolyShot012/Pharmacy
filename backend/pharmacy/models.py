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


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class Branches(models.Model):
    branch_id = models.AutoField(primary_key=True)
    name = models.CharField()
    address = models.CharField()
    province = models.CharField(blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'branches'


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
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


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Inventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    product = models.ForeignKey('Products', models.DO_NOTHING)
    branch = models.ForeignKey(Branches, models.DO_NOTHING)
    available_qty = models.IntegerField()
    reserved_qty = models.IntegerField()
    updated_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'inventory'


class OrderItems(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    order = models.ForeignKey('Orders', models.DO_NOTHING)
    product = models.ForeignKey('Products', models.DO_NOTHING)
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=65535, decimal_places=65535)

    class Meta:
        managed = False
        db_table = 'order_items'


class Orders(models.Model):
    order_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    branch = models.ForeignKey(Branches, models.DO_NOTHING)
    prescription = models.ForeignKey('Prescriptions', models.DO_NOTHING, blank=True, null=True)
    status = models.ForeignKey('StatusDimension', models.DO_NOTHING)
    created_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'orders'


class PaymentMethods(models.Model):
    method_id = models.AutoField(primary_key=True)
    method_name = models.CharField()
    description = models.CharField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payment_methods'


class Payments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Orders, models.DO_NOTHING)
    amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    method = models.ForeignKey(PaymentMethods, models.DO_NOTHING)
    status = models.ForeignKey('StatusDimension', models.DO_NOTHING)
    paid_at = models.DateTimeField()
    insurance_included = models.BooleanField()
    insurance_amount = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'payments'


class PrescriptionApprovals(models.Model):
    approval_id = models.AutoField(primary_key=True)
    prescription = models.ForeignKey('Prescriptions', models.DO_NOTHING)
    approved_by = models.ForeignKey('Users', models.DO_NOTHING, db_column='approved_by')
    decision = models.CharField()
    comment = models.CharField(blank=True, null=True)
    approved_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'prescription_approvals'


class PrescriptionItems(models.Model):
    prescription_items_id = models.AutoField(primary_key=True)
    prescription = models.ForeignKey('Prescriptions', models.DO_NOTHING)
    product = models.ForeignKey('Products', models.DO_NOTHING)
    dosage_amount = models.DecimalField(max_digits=65535, decimal_places=65535)
    unit = models.CharField()
    unit_price = models.DecimalField(max_digits=65535, decimal_places=65535)

    class Meta:
        managed = False
        db_table = 'prescription_items'


class Prescriptions(models.Model):
    prescription_id = models.AutoField(primary_key=True)
    image_url = models.CharField(blank=True, null=True)
    classification = models.IntegerField()
    status = models.ForeignKey('StatusDimension', models.DO_NOTHING)
    submitted_at = models.DateTimeField()
    patient = models.ForeignKey('Users', models.DO_NOTHING)
    doctor = models.ForeignKey('Users', models.DO_NOTHING, related_name='prescriptions_doctor_set')

    class Meta:
        managed = False
        db_table = 'prescriptions'


class Products(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField()
    category = models.CharField(blank=True, null=True)
    price = models.DecimalField(max_digits=65535, decimal_places=65535)
    quantity = models.DecimalField(max_digits=65535, decimal_places=65535)
    manufacturer = models.CharField(blank=True, null=True)
    prescription = models.CharField(blank=True, null=True)
    class_level = models.IntegerField(blank=True, null=True)
    need_approval = models.BooleanField()
    expiration_date = models.DateField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'products'


class StatusDimension(models.Model):
    status_id = models.AutoField(primary_key=True)
    entity_type = models.CharField()
    status_name = models.CharField()
    description = models.CharField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'status_dimension'


class UserActivityLogs(models.Model):
    activity_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    time_spent_seconds = models.IntegerField()
    points_earned = models.IntegerField(blank=True, null=True)
    recorded_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_activity_logs'


class UserMedicalHistory(models.Model):
    history_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    condition = models.CharField()
    type = models.CharField(blank=True, null=True)
    note = models.CharField(blank=True, null=True)
    recorded_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_medical_history'


class UserPointTransactions(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    source = models.CharField()
    points = models.IntegerField()
    recorded_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_point_transactions'


class UserProductViews(models.Model):
    view_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    product = models.ForeignKey(Products, models.DO_NOTHING)
    viewed_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_product_views'


class UserSearchLogs(models.Model):
    search_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    keyword = models.CharField(blank=True, null=True)
    category = models.CharField(blank=True, null=True)
    search_filters = models.CharField(blank=True, null=True)
    results_count = models.IntegerField(blank=True, null=True)
    searched_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_search_logs'


class UserUiInteractions(models.Model):
    interaction_id = models.AutoField(primary_key=True)
    user = models.ForeignKey('Users', models.DO_NOTHING)
    component = models.CharField()
    value = models.CharField(blank=True, null=True)
    action = models.CharField()
    occurred_at = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'user_ui_interactions'


class Users(models.Model):
    id = models.OneToOneField(AuthUser, models.DO_NOTHING, db_column='id', primary_key=True)
    first_name = models.CharField()
    last_name = models.CharField()
    email = models.CharField(unique=True)
    phone_number = models.CharField(blank=True, null=True)
    current_address = models.CharField(blank=True, null=True)
    province = models.CharField(blank=True, null=True)
    city = models.CharField(blank=True, null=True)
    avatar_url = models.CharField(blank=True, null=True)
    preferred_theme = models.CharField(blank=True, null=True)
    role = models.CharField()
    birth_date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField()
    username = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'users'
