from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from .models import Medicine
from .serializer import MedicineSerializer


@api_view(['GET'])
def get_medicines(request):
   
    medicines = Medicine.objects.all()
    serializer = MedicineSerializer(medicines, many=True)

    return Response(serializer.data)

@api_view(['POST'])  
def add_medicine(request):
    serializer = MedicineSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def medicine_detail(request, pk):
    try:
        medicine = Medicine.objects.get(pk=pk)
    except Medicine.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        serializer = MedicineSerializer(medicine)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = MedicineSerializer(medicine, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        medicine.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

