"""Fairness scoring algorithms"""
import math

class FairnessCalculator:
    @staticmethod
    def calculate_fairness_score(member_profile):
        """Calculate overall fairness score"""
        score = 100
        
        # Reduce for high workload
        score -= member_profile.workload_score * 0.3
        
        # Reduce for burnout risk
        score -= member_profile.burnout_score * 0.4
        
        # Bonus for rotation completion
        if member_profile.consecutive_weeks_assigned == 0:
            score += 10
        
        return max(0, min(100, score))
    
    @staticmethod
    def calculate_burnout_risk(member_profile):
        """Calculate burnout risk score"""
        risk = 0
        risk += member_profile.consecutive_weeks_assigned * 10
        risk += member_profile.workload_score * 0.5
        return min(100, risk)
    
    @staticmethod
    def calculate_workload_score(total_assignments, period_days=30):
        """Calculate workload score based on recent assignments"""
        return min(100, total_assignments * 10)
