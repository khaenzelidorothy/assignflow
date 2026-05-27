from rest_framework.views import APIView
from rest_framework.response import Response
from django.db import connections
from django_redis import get_redis_connection

class HealthCheckView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        health_status = {
            'status': 'healthy',
            'database': self._check_database(),
            'cache': self._check_redis(),
            'version': '1.0.0',
        }
        return Response(health_status)

    def _check_database(self):
        try:
            connections['default'].cursor()
            return 'connected'
        except Exception:
            return 'disconnected'

    def _check_redis(self):
        try:
            redis = get_redis_connection('default')
            redis.ping()
            return 'connected'
        except Exception:
            return 'disconnected'
