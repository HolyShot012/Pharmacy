from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework import status
from django.db import transaction
from django.utils import timezone
from .serializer import *
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Users, Branches
from django.db.models import Sum

@api_view(['POST'])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        instance = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        users = Users.objects.get(id=user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': users.phone_number,
                'current_address': users.current_address,
                'province': users.province,
                'city': users.city,
                'avatar_url': users.avatar_url,
                'preferred_theme': users.preferred_theme,
                'role': users.role,
                'birth_date': users.birth_date
            }
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    serializer = UserLogoutSerializer(data=request.data)
    if serializer.is_valid():
        return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    user = request.user
    Users.objects.get_or_create(id=user, defaults={'role': 'patient'})
    serializer = UsersSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
def get_branches(request):
    branches = Branches.objects.all()
    serializer = BranchesSerializer(branches, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

@api_view(['GET'])
def get_products(request):
    products = Products.objects.all()
    product_data = []
    
    for product in products:
        total_available = Inventory.objects.filter(
            product=product
        ).aggregate(total_qty=Sum('available_qty'))['total_qty'] or 0
        
        serializer = ProductsSerializer(product)
        product_data.append({
            **serializer.data,
            'available_quantity': total_available
        })
    
    paginator = StandardResultsSetPagination()
    paginated_data = paginator.paginate_queryset(product_data, request)
    return paginator.get_paginated_response(paginated_data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        with transaction.atomic():
            order_data = request.data.get('order')
            order_items_data = request.data.get('order_items', [])
            
            if not order_data or not isinstance(order_data, dict):
                raise ValueError('Invalid order data format')
            if not order_items_data or not isinstance(order_items_data, list):
                raise ValueError('Invalid order items data format')
            
            branch_id = order_data.get('branch')
            try:
                branch = Branches.objects.get(pk=branch_id)
            except Branches.DoesNotExist:
                raise ValueError('Invalid branch')
            
            try:
                default_status = StatusDimension.objects.get(
                    entity_type='order',
                    status_name='Processing'
                )
            except StatusDimension.DoesNotExist:
                raise ValueError('Default order status (Processing) not found')
            
            order_items_to_create = []
            inventory_updates = []
            for item_data in order_items_data:
                if not isinstance(item_data, dict) or 'product' not in item_data or 'quantity' not in item_data:
                    raise ValueError('Invalid order item format')
                
                product_id = item_data.get('product')
                quantity = item_data.get('quantity')
                
                try:
                    product = Products.objects.get(pk=product_id)
                except Products.DoesNotExist:
                    raise ValueError(f'Product {product_id} not found')
                
                inventory = Inventory.objects.filter(
                    product=product,
                    branch=branch
                ).first()
                
                if not inventory or inventory.available_qty < quantity:
                    raise ValueError(f'Insufficient stock for product {product.name} at branch {branch.name}')
                
                item_data['price'] = product.unit_price or 0
                order_items_to_create.append(item_data)
                inventory_updates.append((inventory, quantity))
            
            order_data['user'] = request.user.id
            order_data['status'] = default_status.pk
            order_data['created_at'] = timezone.now()
            order_serializer = OrdersSerializer(data=order_data)
            if not order_serializer.is_valid():
                raise ValueError(order_serializer.errors)
            order = order_serializer.save()
            
            order_items_created = []
            for item_data in order_items_to_create:
                item_data['order'] = order.pk
                item_serializer = OrderItemsSerializer(data=item_data)
                if not item_serializer.is_valid():
                    raise ValueError(f'Invalid order item data: {item_serializer.errors}')
                order_item = item_serializer.save()
                order_items_created.append(order_item)
            
            for inventory, quantity in inventory_updates:
                inventory.available_qty -= quantity
                inventory.reserved_qty += quantity
                inventory.save()
            
            return Response(
                {
                    'order': OrdersSerializer(order).data,
                    'order_items': OrderItemsSerializer(order_items_created, many=True).data
                },
                status=status.HTTP_201_CREATED
            )
    
    except ValueError as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )