from django.db import models
from apps.organizations.models import Organization

class AITrainingData(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    data_type = models.CharField(max_length=50)
    features = models.JSONField()
    labels = models.JSONField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_training_data'

class AIRecommendation(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    recommendation_type = models.CharField(max_length=50)
    input_data = models.JSONField()
    recommendation = models.JSONField()
    confidence_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'ai_recommendations'
