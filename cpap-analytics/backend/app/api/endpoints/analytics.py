"""
CPAP Analytics Platform - Analytics Endpoints
API endpoints for CPAP data analytics and insights
"""

from fastapi import APIRouter, HTTPException
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from pydantic import BaseModel

router = APIRouter()

class TrendData(BaseModel):
    """Trend data model"""
    date: date
    value: float
    metric: str

class ComplianceMetrics(BaseModel):
    """Compliance metrics model"""
    compliance_rate: float
    total_nights: int
    compliant_nights: int
    average_usage_hours: float
    target_hours: float

class SleepQualityMetrics(BaseModel):
    """Sleep quality metrics model"""
    average_ahi: float
    ahi_trend: str  # "improving", "stable", "worsening"
    pressure_optimization: float
    leak_rate_average: float
    sleep_efficiency: float

@router.get("/compliance", response_model=ComplianceMetrics)
async def get_compliance_metrics(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    """Get CPAP compliance metrics"""
    # Mock data - in real implementation, this would calculate from database
    return ComplianceMetrics(
        compliance_rate=94.3,
        total_nights=90,
        compliant_nights=85,
        average_usage_hours=7.8,
        target_hours=4.0
    )

@router.get("/sleep-quality", response_model=SleepQualityMetrics)
async def get_sleep_quality_metrics(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
):
    """Get sleep quality metrics"""
    # Mock data
    return SleepQualityMetrics(
        average_ahi=3.2,
        ahi_trend="improving",
        pressure_optimization=87.5,
        leak_rate_average=1.2,
        sleep_efficiency=88.7
    )

@router.get("/trends/{metric}")
async def get_trend_data(
    metric: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    granularity: str = "daily"
) -> List[TrendData]:
    """Get trend data for a specific metric"""
    
    # Validate metric
    valid_metrics = ["ahi", "usage_hours", "pressure", "leak_rate", "compliance"]
    if metric not in valid_metrics:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid metric. Valid options: {', '.join(valid_metrics)}"
        )
    
    # Mock trend data
    mock_data = []
    for i in range(30):
        trend_date = date(2024, 3, i + 1) if i < 31 else date(2024, 4, i - 30)
        if metric == "ahi":
            value = 3.5 - (i * 0.02)  # Improving trend
        elif metric == "usage_hours":
            value = 7.0 + (i * 0.03)  # Improving trend
        elif metric == "pressure":
            value = 12.0 + (i * 0.01)
        elif metric == "leak_rate":
            value = 2.0 - (i * 0.01)  # Improving trend
        else:  # compliance
            value = 90.0 + (i * 0.1)
            
        mock_data.append(TrendData(
            date=trend_date,
            value=round(value, 2),
            metric=metric
        ))
    
    return mock_data[:30]  # Return 30 days of data

@router.get("/insights")
async def get_insights() -> Dict[str, Any]:
    """Get AI-powered insights and recommendations"""
    return {
        "insights": [
            {
                "type": "positive",
                "title": "Excellent Compliance",
                "description": "Your compliance rate of 94.3% is excellent. Keep up the great work!",
                "priority": "low"
            },
            {
                "type": "recommendation",
                "title": "Optimize Sleep Schedule",
                "description": "Consider going to bed 30 minutes earlier for better sleep quality.",
                "priority": "medium"
            },
            {
                "type": "alert",
                "title": "Slight Increase in Leak Rate",
                "description": "Your mask leak rate has increased slightly. Check mask fit.",
                "priority": "medium"
            }
        ],
        "generated_at": datetime.now().isoformat(),
        "data_period": {
            "start": "2024-01-01",
            "end": "2024-03-31"
        }
    }

@router.get("/reports/monthly")
async def get_monthly_report(year: int = 2024, month: int = 3) -> Dict[str, Any]:
    """Generate monthly CPAP usage report"""
    return {
        "report_period": f"{year}-{month:02d}",
        "summary": {
            "total_nights": 31,
            "usage_nights": 29,
            "compliance_rate": 93.5,
            "average_ahi": 3.1,
            "average_usage_hours": 7.8,
            "total_usage_hours": 226.2
        },
        "highlights": [
            "Best AHI week: March 15-21 (avg 2.8)",
            "Longest usage night: March 20 (9.2 hours)",
            "Most consistent week: March 8-14"
        ],
        "recommendations": [
            "Continue current treatment settings",
            "Monitor mask seal during first hour of sleep",
            "Consider sleep position optimization"
        ],
        "generated_at": datetime.now().isoformat()
    }

@router.get("/compare")
async def compare_periods(
    period1_start: date,
    period1_end: date,
    period2_start: date,
    period2_end: date
) -> Dict[str, Any]:
    """Compare two time periods"""
    return {
        "comparison": {
            "period1": {
                "start": period1_start.isoformat(),
                "end": period1_end.isoformat(),
                "compliance_rate": 91.2,
                "average_ahi": 3.8,
                "average_usage": 7.2
            },
            "period2": {
                "start": period2_start.isoformat(),
                "end": period2_end.isoformat(),
                "compliance_rate": 94.3,
                "average_ahi": 3.1,
                "average_usage": 7.8
            },
            "improvements": {
                "compliance_rate": "+3.1%",
                "ahi_reduction": "-0.7",
                "usage_increase": "+0.6 hours"
            }
        }
    }
