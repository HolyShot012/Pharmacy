from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    full_name = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=15, unique=True)
    current_address = models.CharField(max_length=255)
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    avatar_url = models.URLField(blank=True, null=True)
    preferred_themse = models.CharField(max_length=50, default='light')
    role = models.CharField(max_length = 50, choices = [
        ('admin', 'Admin'),
        ('pharmacist', 'Pharmacist'),
        ('user', 'user')
        ], default='user')
    password_hash = models.CharField(max_length=128)
    birhth_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.full_name

class User_UI_Interactions(models.Model):
    interaction_id = models.AutoField(primary_key=True)
    component_name = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    action = models.CharField(max_length=50)
    occured_at = models.DateTimeField(auto_now_add=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='interactions')

class User_Search_Logs(models.Model):
    search_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='search_logs')
    keyword = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)      
    search_filters = models.TextField(blank=True, null=True)  # JSON or text field for filters
    results_count = models.IntegerField(default=0)
    search_at = models.DateTimeField(auto_now_add=True)

class User_medical_history(models.Model):
    history_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='medical_history')
    condition_name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    note = models.CharField(max_length=500, blank=True, null=True)
    recorded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.condition} - {self.user_id.type}"
    
class User_point_transactions(models.Model):
    transaction_id = models.AutoField(primary_key=True)
    source = models.CharField(max_length=100)
    related_id  = models.IntegerField()
    points = models.IntegerField()
    reason = models.CharField(max_length=255, blank=True, null=True)
    recoreded_at = models.DateTimeField(auto_now_add=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='point_transactions')

class User_activity_logs(models.Model):
    activity_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='activity_logs')
    #article_id = models.IntegerField(blank=True, null=True)
    time_spent_seconds = models.IntegerField(default=0)
    points_earned = models.IntegerField(default=0)
    recorded_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.user_id.full_name} - {self.activity_type} at {self.occurred_at}"
    
class Branches(models.Model):
    branch_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True)
    address = models.CharField(max_length=255)
    province = models.CharField(max_length=100)
    # latitude and longitude fields for geolocation ?

class Products(models.Model):
    product_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    manufacturer = models.CharField(max_length=255, blank=True, null=True)
    class_level = models.IntegerField(default=0, choices=[

        (1, 'Class 1'),
        (2, 'Class 2'),
        (3, 'Class 3'),
    ])
    need_rx = models.BooleanField(default=False)
    expiration_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    # stock_quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class User_product_views(models.Model):
    view_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='product_views')
    product_id = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='views')
    viewed_at = models.DateTimeField(auto_now_add=True)
    # rating = models.IntegerField(default=0, choices=[(i, str(i)) for i in range(1, 6)])  # 1 to 5 stars
    # comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user_id.full_name} viewed {self.product_id.name} at {self.viewed_at}"

class Prescriptions(models.Model):
    prescription_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescriptions')
    prescription_date = models.DateTimeField(auto_now_add=True)
    classification = models.CharField(max_length=100, choices=[
        ('regular', 'Regular'),
        ('controlled', 'Controlled'),
        ('emergency', 'Emergency')
    ], default='regular')
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ], default='pending')
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Prescription {self.prescription_id} for {self.user_id.full_name}"

class Prescription_items(models.Model):
    prescription_item_id = models.AutoField(primary_key=True)
    prescription_id = models.ForeignKey(Prescriptions, on_delete=models.CASCADE, related_name='items')
    product_id = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='prescription_items')
    quantity = models.IntegerField(default=1)
    dosage_amount = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)


    def __str__(self):
        return f"{self.product_id.name} in Prescription {self.prescription_id.prescription_id}"

class Prescription_approvals(models.Model):
    approval_id = models.AutoField(primary_key=True)
    prescription_id = models.ForeignKey(Prescriptions, on_delete=models.CASCADE, related_name='approvals')
    approved_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='prescription_approvals')
    role = models.CharField(max_length=50)
    decision = models.CharField(max_length=50)
    comments = models.TextField(blank=True, null=True)
    approved_at = models.DateTimeField(auto_now_add=True)

class Status_dimensions(models.Model):
    status_id = models.AutoField(primary_key=True)
    entity_type = models.CharField(max_length=100)
    status_name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

class Orders(models.Model):
    order_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    prescription_id = models.ForeignKey(Prescriptions, on_delete=models.CASCADE, related_name='orders', null=True, blank=True)
    branch_id = models.ForeignKey(Branches, on_delete=models.CASCADE, related_name='orders')
    created_at = models.DateTimeField(auto_now_add=True)
    status_id = models.ForeignKey(Status_dimensions, on_delete=models.CASCADE, related_name='orders')

    def __str__(self):
        return f"Order {self.order_id} by {self.user_id.full_name}"

class Order_items(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name='items')
    product_id = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product_id.name} in Order {self.order_id.order_id}"   

class Payments(models.Model):
    payment_id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name='payments')
    status_id = models.ForeignKey(Status_dimensions, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places = 2)
    paid_at = models.DateTimeField(auto_now_add=True)
    insurance_included = models.BooleanField(default=False)
    method_id = models.ForeignKey('Payment_methods', on_delete=models.CASCADE, related_name='payments')

class Payment_methods(models.Model):
    method_id = models.AutoField(primary_key=True)
    method_name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.method_name
    

class Inventory(models.Model):
    inventory_id = models.AutoField(primary_key=True)
    product_id = models.ForeignKey(Products, on_delete=models.CASCADE, related_name='inventory')
    branch_id = models.ForeignKey(Branches, on_delete=models.CASCADE, related_name='inventory')
    available_quantity = models.IntegerField(default=0)
    reserved_quantity = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.product_id.name} at {self.branch_id.name} - Available: {self.available_quantity}"

class Dosage_units(models.Model):
    unit_id = models.AutoField(primary_key=True)
    unit_name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.unit_name