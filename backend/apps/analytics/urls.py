from django.urls import path
from .views import DashboardMetricsView, FairnessAnalyticsView

urlpatterns = [
    path('analytics/dashboard/', DashboardMetricsView.as_view(), name='dashboard-metrics'),
    path('analytics/fairness/', FairnessAnalyticsView.as_view(), name='fairness-analytics'),
]
