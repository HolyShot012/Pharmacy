from rest_framework import serializers
from .models import (
    User, UserMedicalHistory, StatusDimension, Prescription, PrescriptionApproval,
    Product, PrescriptionItem, Branch, Inventory, Order, OrderItem, PaymentMethod,
    Payment, UserActivityLog, UserPointTransaction, UserUiInteraction, UserSearchLog,
    UserProductView
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['user_id', 'first_name', 'last_name', 'email', 'phone_number', 'current_address',
                  'province', 'city', 'avatar_url', 'preferred_theme', 'role', 'birth_date', 'created_at']

class UserMedicalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserMedicalHistory
        fields = ['history_id', 'user', 'condition', 'type', 'note', 'recorded_at']

class StatusDimensionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StatusDimension
        fields = ['status_id', 'entity_type', 'status_name', 'description']

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = ['prescription_id', 'image_url', 'classification', 'status', 'submitted_at', 'patient', 'doctor']

class PrescriptionApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionApproval
        fields = ['approval_id', 'prescription', 'approved_by', 'decision', 'comment', 'approved_at']

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['product_id', 'name', 'category', 'price', 'quantity', 'manufacturer',
                  'prescription', 'class_level', 'need_approval', 'expiration_date']

class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = ['prescription_items_id', 'prescription', 'product', 'dosage_amount', 'unit', 'unit_price']

class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ['branch_id', 'name', 'address', 'province', 'latitude', 'longitude']

class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['inventory_id', 'product', 'branch', 'available_qty', 'reserved_qty', 'updated_at']

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['order_id', 'user', 'branch', 'prescription', 'status', 'created_at']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['order_item_id', 'order', 'product', 'quantity', 'price']

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['method_id', 'method_name', 'description']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['payment_id', 'order', 'amount', 'method', 'status', 'paid_at', 'insurance_included', 'insurance_amount']

class UserActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserActivityLog
        fields = ['activity_id', 'user', 'time_spent_seconds', 'points_earned', 'recorded_at']

class UserPointTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPointTransaction
        fields = ['transaction_id', 'user', 'source', 'points', 'recorded_at']

class UserUiInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserUiInteraction
        fields = ['interaction_id', 'user', 'component', 'value', 'action', 'occurred_at']

class UserSearchLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSearchLog
        fields = ['search_id', 'user', 'keyword', 'category', 'search_filters', 'results_count', 'searched_at']

class UserProductViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProductView
        fields = ['view_id', 'user', 'product', 'viewed_at']