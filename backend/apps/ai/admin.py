from django.contrib import admin
from .models import AITrainingData, AIRecommendation

@admin.register(AITrainingData)
class AITrainingDataAdmin(admin.ModelAdmin):
    list_display = ['organization', 'data_type', 'created_at']

@admin.register(AIRecommendation)
class AIRecommendationAdmin(admin.ModelAdmin):
    list_display = ['organization', 'recommendation_type', 'confidence_score', 'created_at']
