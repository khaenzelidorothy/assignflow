import pytest
from scheduler.engine.allocator import SchedulingEngine

class TestSchedulingEngine:
    def test_engine_initialization(self):
        engine = SchedulingEngine()
        assert engine.assigned_members == []
    
    def test_find_best_member_empty(self):
        engine = SchedulingEngine()
        result = engine.find_best_member(None, [], {})
        assert result is None
