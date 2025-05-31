"""
Smart Insights Engine for CPAP Analytics
Transforms raw data into actionable intelligence and personalized recommendations
"""

from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime, timedelta, date
from enum import Enum
import statistics
import math

class InsightType(str, Enum):
    ACHIEVEMENT = "achievement"
    IMPROVEMENT = "improvement"
    CONCERN = "concern"
    RECOMMENDATION = "recommendation"
    TREND = "trend"
    ALERT = "alert"

class ConfidenceLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class ClinicalRelevance(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class SmartInsight:
    def __init__(
        self,
        insight_type: InsightType,
        title: str,
        message: str,
        confidence: ConfidenceLevel,
        clinical_relevance: ClinicalRelevance,
        actionable: bool = True,
        data_points: Optional[Dict[str, Any]] = None,
        next_steps: Optional[List[str]] = None,
        priority: int = 1
    ):
        self.type = insight_type
        self.title = title
        self.message = message
        self.confidence = confidence
        self.clinical_relevance = clinical_relevance
        self.actionable = actionable
        self.data_points = data_points or {}
        self.next_steps = next_steps or []
        self.priority = priority
        self.timestamp = datetime.utcnow()

    def to_dict(self) -> Dict[str, Any]:
        return {
            'type': self.type,
            'title': self.title,
            'message': self.message,
            'confidence': self.confidence,
            'clinical_relevance': self.clinical_relevance,
            'actionable': self.actionable,
            'data_points': self.data_points,
            'next_steps': self.next_steps,
            'priority': self.priority,
            'timestamp': self.timestamp.isoformat()
        }

class InsightsEngine:
    """AI-powered insights engine for CPAP therapy analysis"""
    
    def __init__(self):
        self.insights = []
        
    def analyze_therapy_data(self, sessions: List[Dict[str, Any]]) -> List[SmartInsight]:
        """
        Comprehensive analysis of CPAP therapy data
        Returns personalized, actionable insights
        """
        if not sessions:
            return []
            
        self.insights = []
        
        # Sort sessions by date for trend analysis
        sorted_sessions = sorted(sessions, key=lambda x: x['date'])
        
        # Run all analysis modules
        self._analyze_compliance_trends(sorted_sessions)
        self._analyze_ahi_patterns(sorted_sessions)
        self._analyze_therapy_quality(sorted_sessions)
        self._analyze_equipment_performance(sorted_sessions)
        self._analyze_sleep_duration_patterns(sorted_sessions)
        self._detect_concerning_patterns(sorted_sessions)
        self._generate_achievements(sorted_sessions)
        self._suggest_optimizations(sorted_sessions)
        
        # Sort by priority and clinical relevance
        self.insights.sort(key=lambda x: (x.priority, x.clinical_relevance == ClinicalRelevance.HIGH), reverse=True)
        
        return self.insights[:8]  # Return top 8 insights
    
    def _analyze_compliance_trends(self, sessions: List[Dict[str, Any]]):
        """Analyze therapy compliance patterns"""
        if len(sessions) < 7:
            return
            
        recent_week = sessions[-7:]
        compliance_hours = [s['duration_hours'] for s in recent_week if s['duration_hours']]
        
        if not compliance_hours:
            return
            
        avg_compliance = statistics.mean(compliance_hours)
        compliance_rate = len([h for h in compliance_hours if h >= 4]) / len(compliance_hours) * 100
        
        if compliance_rate >= 85:
            if avg_compliance >= 7:
                self.insights.append(SmartInsight(
                    InsightType.ACHIEVEMENT,
                    "🏆 Excellent Compliance",
                    f"Outstanding! You've averaged {avg_compliance:.1f} hours nightly this week with {compliance_rate:.0f}% compliance. You're in the top 15% of CPAP users.",
                    ConfidenceLevel.HIGH,
                    ClinicalRelevance.HIGH,
                    actionable=False,
                    data_points={'avg_hours': avg_compliance, 'compliance_rate': compliance_rate},
                    priority=5
                ))
            else:
                self.insights.append(SmartInsight(
                    InsightType.IMPROVEMENT,
                    "📈 Great Progress",
                    f"You're consistently using your CPAP ({compliance_rate:.0f}% compliance) but averaging {avg_compliance:.1f} hours. Try extending by 30 minutes each night.",
                    ConfidenceLevel.HIGH,
                    ClinicalRelevance.MEDIUM,
                    next_steps=[
                        "Set bedtime 30 minutes earlier",
                        "Use sleep hygiene techniques",
                        "Check comfort settings"
                    ],
                    priority=3
                ))
        elif compliance_rate < 50:
            self.insights.append(SmartInsight(
                InsightType.CONCERN,
                "⚠️ Compliance Below Target", 
                f"Your therapy usage is {compliance_rate:.0f}% this week. Insurance requires 70% compliance for coverage. Let's identify barriers.",
                ConfidenceLevel.HIGH,
                ClinicalRelevance.HIGH,
                next_steps=[
                    "Review mask fit and comfort",
                    "Check for air leaks",
                    "Consult your sleep specialist",
                    "Consider mask replacement"
                ],
                priority=10
            ))
    
    def _analyze_ahi_patterns(self, sessions: List[Dict[str, Any]]):
        """Analyze AHI trends and effectiveness"""
        if len(sessions) < 14:
            return
            
        recent_ahis = [s['ahi'] for s in sessions[-14:] if s['ahi'] is not None]
        if len(recent_ahis) < 7:
            return
            
        avg_ahi = statistics.mean(recent_ahis)
        recent_trend = self._calculate_trend(recent_ahis[-7:])
        
        if avg_ahi < 5:
            if recent_trend < -0.5:
                self.insights.append(SmartInsight(
                    InsightType.IMPROVEMENT,
                    "🎯 AHI Improving",
                    f"Excellent! Your AHI dropped to {avg_ahi:.1f} (normal range) and continues improving. Your therapy adjustments are working perfectly.",
                    ConfidenceLevel.HIGH,
                    ClinicalRelevance.HIGH,
                    actionable=False,
                    data_points={'current_ahi': avg_ahi, 'trend': recent_trend},
                    priority=4
                ))
            else:
                self.insights.append(SmartInsight(
                    InsightType.ACHIEVEMENT,
                    "✅ Optimal AHI Control",
                    f"Your AHI is excellently controlled at {avg_ahi:.1f} events/hour. This indicates very effective therapy - maintain your current routine.",
                    ConfidenceLevel.HIGH,
                    ClinicalRelevance.HIGH,
                    actionable=False,
                    priority=3
                ))
        elif avg_ahi > 10 and recent_trend > 0.5:
            self.insights.append(SmartInsight(
                InsightType.ALERT,
                "🚨 AHI Trending Higher",
                f"Your AHI has increased to {avg_ahi:.1f} events/hour. This suggests therapy effectiveness may be declining.",
                ConfidenceLevel.HIGH,
                ClinicalRelevance.HIGH,
                next_steps=[
                    "Check mask seal and fit",
                    "Review sleep position habits",
                    "Schedule pressure adjustment consultation",
                    "Examine recent lifestyle changes"
                ],
                priority=9
            ))
    
    def _analyze_therapy_quality(self, sessions: List[Dict[str, Any]]):
        """Analyze overall therapy quality and improvements"""
        if len(sessions) < 10:
            return
            
        recent_quality = [s.get('quality_score', 0) for s in sessions[-7:] if s.get('quality_score')]
        historical_quality = [s.get('quality_score', 0) for s in sessions[-30:-7] if s.get('quality_score')]
        
        if not recent_quality or not historical_quality:
            return
            
        recent_avg = statistics.mean(recent_quality)
        historical_avg = statistics.mean(historical_quality)
        improvement = recent_avg - historical_avg
        
        if improvement > 5:
            self.insights.append(SmartInsight(
                InsightType.IMPROVEMENT,
                "📊 Quality Score Rising",
                f"Your therapy quality improved by {improvement:.1f} points this week (now {recent_avg:.1f}%). Keep up the excellent work!",
                ConfidenceLevel.HIGH,
                ClinicalRelevance.MEDIUM,
                actionable=False,
                data_points={'improvement': improvement, 'current_quality': recent_avg},
                priority=3
            ))
        elif recent_avg >= 85:
            self.insights.append(SmartInsight(
                InsightType.ACHIEVEMENT,
                "⭐ Premium Quality Therapy",
                f"Outstanding {recent_avg:.1f}% quality score! You're achieving clinical-grade therapy outcomes.",
                ConfidenceLevel.HIGH,
                ClinicalRelevance.HIGH,
                actionable=False,
                priority=4
            ))
    
    def _analyze_equipment_performance(self, sessions: List[Dict[str, Any]]):
        """Analyze mask leaks and equipment issues"""
        recent_sessions = sessions[-7:]
        leaks = [s.get('mask_leak', 0) for s in recent_sessions if s.get('mask_leak') is not None]
        
        if not leaks:
            return
            
        avg_leak = statistics.mean(leaks)
        high_leak_nights = len([l for l in leaks if l > 24])
        
        if avg_leak > 24:
            self.insights.append(SmartInsight(
                InsightType.RECOMMENDATION,
                "🔧 Mask Fit Optimization",
                f"Your mask leak averages {avg_leak:.1f} L/min (target: <24). High leaks reduce therapy effectiveness.",
                ConfidenceLevel.HIGH,
                ClinicalRelevance.HIGH,
                next_steps=[
                    "Readjust mask straps (not too tight)",
                    "Check for worn mask cushions",
                    "Try different mask size/style",
                    "Clean mask components thoroughly"
                ],
                priority=7
            ))
        elif avg_leak < 10:
            self.insights.append(SmartInsight(
                InsightType.ACHIEVEMENT,
                "🎯 Perfect Mask Seal",
                f"Excellent mask fit with only {avg_leak:.1f} L/min average leak. Your equipment is optimally adjusted.",
                ConfidenceLevel.HIGH,
                ClinicalRelevance.MEDIUM,
                actionable=False,
                priority=2
            ))
    
    def _analyze_sleep_duration_patterns(self, sessions: List[Dict[str, Any]]):
        """Analyze sleep duration patterns and recommendations"""
        if len(sessions) < 7:
            return
            
        durations = [s['duration_hours'] for s in sessions[-14:] if s['duration_hours']]
        if not durations:
            return
            
        avg_duration = statistics.mean(durations)
        consistency = statistics.stdev(durations) if len(durations) > 1 else 0
        
        if avg_duration >= 8 and consistency < 1:
            self.insights.append(SmartInsight(
                InsightType.ACHIEVEMENT,
                "😴 Optimal Sleep Pattern",
                f"Perfect! You're averaging {avg_duration:.1f} hours with consistent timing. This maximizes therapy benefits.",
                ConfidenceLevel.HIGH,
                ClinicalRelevance.MEDIUM,
                actionable=False,
                priority=2
            ))
        elif avg_duration < 6:
            self.insights.append(SmartInsight(
                InsightType.RECOMMENDATION,
                "⏰ Sleep Duration Focus",
                f"You're averaging {avg_duration:.1f} hours nightly. Aim for 7-8 hours to maximize therapy effectiveness and health benefits.",
                ConfidenceLevel.HIGH,
                ClinicalRelevance.HIGH,
                next_steps=[
                    "Establish consistent bedtime routine",
                    "Limit screen time before bed",
                    "Create optimal sleep environment",
                    "Consider earlier bedtime"
                ],
                priority=6
            ))
    
    def _detect_concerning_patterns(self, sessions: List[Dict[str, Any]]):
        """Detect patterns that need clinical attention"""
        if len(sessions) < 5:
            return
            
        # Check for sudden changes
        recent_data = sessions[-5:]
        
        # Sudden AHI increase
        recent_ahis = [s['ahi'] for s in recent_data if s['ahi'] is not None]
        if len(recent_ahis) >= 3:
            if max(recent_ahis) > 15 and any(ahi < 8 for ahi in sessions[-15:-5] if sessions[-15:-5]):
                self.insights.append(SmartInsight(
                    InsightType.ALERT,
                    "⚠️ Sudden AHI Increase",
                    f"Your AHI spiked to {max(recent_ahis):.1f} recently. This sudden change warrants investigation.",
                    ConfidenceLevel.HIGH,
                    ClinicalRelevance.HIGH,
                    next_steps=[
                        "Review recent changes (weight, medications, sleep position)",
                        "Check equipment for malfunction",
                        "Contact sleep specialist if pattern continues",
                        "Monitor for next 3 nights"
                    ],
                    priority=8
                ))
    
    def _generate_achievements(self, sessions: List[Dict[str, Any]]):
        """Generate milestone achievements and positive reinforcement"""
        total_sessions = len(sessions)
        
        # Milestone achievements
        if total_sessions >= 30:
            avg_ahi = statistics.mean([s['ahi'] for s in sessions if s['ahi'] is not None])
            if avg_ahi < 5:
                self.insights.append(SmartInsight(
                    InsightType.ACHIEVEMENT,
                    "🎉 30-Day Success Milestone",
                    f"Congratulations! You've completed 30 days of therapy with excellent AHI control ({avg_ahi:.1f}). You're building lasting healthy habits.",
                    ConfidenceLevel.HIGH,
                    ClinicalRelevance.HIGH,
                    actionable=False,
                    priority=5
                ))
        
        # Weekly streak
        if len(sessions) >= 7:
            week_compliance = len([s for s in sessions[-7:] if s['duration_hours'] >= 4])
            if week_compliance == 7:
                self.insights.append(SmartInsight(
                    InsightType.ACHIEVEMENT,
                    "🔥 Perfect Week Streak",
                    "Amazing! Seven nights in a row of compliant therapy usage. You're mastering your sleep health routine.",
                    ConfidenceLevel.HIGH,
                    ClinicalRelevance.MEDIUM,
                    actionable=False,
                    priority=4
                ))
    
    def _suggest_optimizations(self, sessions: List[Dict[str, Any]]):
        """Generate optimization suggestions based on data patterns"""
        if len(sessions) < 14:
            return
            
        # Analyze patterns for optimization opportunities
        recent_sessions = sessions[-14:]
        
        # Pressure optimization opportunity
        pressures = [s.get('pressure_avg', 0) for s in recent_sessions if s.get('pressure_avg')]
        ahis = [s['ahi'] for s in recent_sessions if s['ahi'] is not None]
        
        if pressures and ahis and len(pressures) == len(ahis):
            if statistics.mean(ahis) > 7 and statistics.mean(pressures) < 12:
                self.insights.append(SmartInsight(
                    InsightType.RECOMMENDATION,
                    "🔧 Pressure Optimization Opportunity",
                    f"Your AHI averages {statistics.mean(ahis):.1f} with pressure at {statistics.mean(pressures):.1f} cmH₂O. A pressure adjustment might improve therapy.",
                    ConfidenceLevel.MEDIUM,
                    ClinicalRelevance.HIGH,
                    next_steps=[
                        "Discuss pressure titration with sleep specialist",
                        "Consider auto-adjusting CPAP mode",
                        "Monitor response to any changes",
                        "Keep detailed sleep diary"
                    ],
                    priority=6
                ))
    
    def _calculate_trend(self, values: List[float]) -> float:
        """Calculate linear trend direction for a series of values"""
        if len(values) < 2:
            return 0
            
        x_values = list(range(len(values)))
        n = len(values)
        
        sum_x = sum(x_values)
        sum_y = sum(values)
        sum_xy = sum(x * y for x, y in zip(x_values, values))
        sum_x2 = sum(x * x for x in x_values)
        
        try:
            slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x * sum_x)
            return slope
        except ZeroDivisionError:
            return 0

# Helper function for API endpoint
def generate_insights(sessions_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Generate insights for API consumption"""
    engine = InsightsEngine()
    insights = engine.analyze_therapy_data(sessions_data)
    return [insight.to_dict() for insight in insights]