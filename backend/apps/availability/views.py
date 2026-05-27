from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Availability
from .serializers import AvailabilitySerializer
from datetime import date, timedelta

class AvailabilityViewSet(viewsets.ModelViewSet):
    serializer_class = AvailabilitySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = Availability.objects.filter(
            member__organization=self.request.organization
        )
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date and end_date:
            queryset = queryset.filter(date__range=[start_date, end_date])
        
        return queryset
    
    @action(detail=False, methods=['post'])
    def bulk_update(self, request):
        """Submit availability for multiple dates"""
        member_id = request.data.get('member_id')
        dates = request.data.get('dates', [])
        
        availabilities = []
        for date_str in dates:
            avail, created = Availability.objects.update_or_create(
                member_id=member_id,
                date=date_str,
                defaults={'status': 'available'}
            )
            availabilities.append(avail)
        
        serializer = self.get_serializer(availabilities, many=True)
        return Response(serializer.data)
