import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta


@pytest.mark.unit
@pytest.mark.api
class TestSessionsEndpoints:
    """Test CPAP sessions endpoints."""

    def test_get_analytics_with_valid_token(self, client: TestClient, auth_headers, sample_cpap_sessions):
        """Test getting analytics data with valid token and data."""
        response = client.get("/api/sessions/analytics", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert "summary" in data
        assert "trends" in data
        assert "recent_sessions" in data
        
        # Check summary structure
        summary = data["summary"]
        assert "total_sessions" in summary
        assert "avg_ahi" in summary
        assert "avg_duration" in summary
        assert "compliance_rate" in summary
        
        # Should have 30 sessions from fixture
        assert summary["total_sessions"] == 30
        assert len(data["trends"]) == 30
        assert len(data["recent_sessions"]) <= 10  # Limited to 10 most recent

    def test_get_analytics_without_token(self, client: TestClient):
        """Test getting analytics without token fails."""
        response = client.get("/api/sessions/analytics")
        assert response.status_code == 401

    def test_get_analytics_with_invalid_token(self, client: TestClient):
        """Test getting analytics with invalid token fails."""
        response = client.get(
            "/api/sessions/analytics",
            headers={"Authorization": "Bearer invalid-token"}
        )
        assert response.status_code == 401

    def test_get_analytics_no_data(self, client: TestClient, auth_headers):
        """Test getting analytics when user has no sessions."""
        response = client.get("/api/sessions/analytics", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        assert data["summary"]["total_sessions"] == 0
        assert len(data["trends"]) == 0
        assert len(data["recent_sessions"]) == 0

    def test_analytics_data_accuracy(self, client: TestClient, auth_headers, sample_cpap_sessions):
        """Test that analytics calculations are accurate."""
        response = client.get("/api/sessions/analytics", headers=auth_headers)
        assert response.status_code == 200
        
        data = response.json()
        summary = data["summary"]
        
        # Calculate expected values from sample data
        total_duration = sum(session.duration_hours for session in sample_cpap_sessions)
        expected_avg_duration = total_duration / len(sample_cpap_sessions)
        
        total_ahi = sum(session.ahi for session in sample_cpap_sessions)
        expected_avg_ahi = total_ahi / len(sample_cpap_sessions)
        
        # Allow for small floating point differences
        assert abs(summary["avg_duration"] - expected_avg_duration) < 0.1
        assert abs(summary["avg_ahi"] - expected_avg_ahi) < 0.1

    def test_trends_data_structure(self, client: TestClient, auth_headers, sample_cpap_sessions):
        """Test that trends data has correct structure."""
        response = client.get("/api/sessions/analytics", headers=auth_headers)
        assert response.status_code == 200
        
        trends = response.json()["trends"]
        assert len(trends) == 30  # Should have 30 trend points
        
        for trend in trends:
            assert "date" in trend
            assert "ahi" in trend
            assert "duration" in trend
            assert "quality_score" in trend
            
            # Validate data types
            assert isinstance(trend["ahi"], (int, float))
            assert isinstance(trend["duration"], (int, float))
            assert isinstance(trend["quality_score"], (int, float))
            
            # Quality score should be between 0 and 100
            assert 0 <= trend["quality_score"] <= 100

    def test_recent_sessions_structure(self, client: TestClient, auth_headers, sample_cpap_sessions):
        """Test that recent sessions have correct structure."""
        response = client.get("/api/sessions/analytics", headers=auth_headers)
        assert response.status_code == 200
        
        recent_sessions = response.json()["recent_sessions"]
        assert len(recent_sessions) <= 10  # Should be limited to 10
        
        for session in recent_sessions:
            assert "id" in session
            assert "date" in session
            assert "duration_hours" in session
            assert "ahi" in session
            assert "leak_rate" in session
            assert "compliance_hours" in session

    def test_recent_sessions_ordering(self, client: TestClient, auth_headers, sample_cpap_sessions):
        """Test that recent sessions are ordered by date (newest first)."""
        response = client.get("/api/sessions/analytics", headers=auth_headers)
        assert response.status_code == 200
        
        recent_sessions = response.json()["recent_sessions"]
        
        # Check that sessions are ordered by date (newest first)
        for i in range(len(recent_sessions) - 1):
            current_date = datetime.fromisoformat(recent_sessions[i]["date"].replace('Z', '+00:00'))
            next_date = datetime.fromisoformat(recent_sessions[i + 1]["date"].replace('Z', '+00:00'))
            assert current_date >= next_date

    def test_compliance_rate_calculation(self, client: TestClient, auth_headers, sample_cpap_sessions):
        """Test that compliance rate is calculated correctly."""
        response = client.get("/api/sessions/analytics", headers=auth_headers)
        assert response.status_code == 200
        
        summary = response.json()["summary"]
        
        # Calculate expected compliance rate (sessions with >= 4 hours)
        compliant_sessions = sum(1 for session in sample_cpap_sessions if session.compliance_hours >= 4.0)
        expected_compliance_rate = (compliant_sessions / len(sample_cpap_sessions)) * 100
        
        assert abs(summary["compliance_rate"] - expected_compliance_rate) < 0.1


@pytest.mark.integration
class TestSessionsIntegration:
    """Integration tests for sessions endpoints."""

    def test_full_analytics_workflow(self, client: TestClient):
        """Test complete workflow: register, login, upload data, get analytics."""
        # Register user
        register_response = client.post(
            "/api/auth/register",
            json={
                "username": "integrationuser",
                "email": "integration@example.com",
                "password": "integrationpass123"
            }
        )
        assert register_response.status_code == 200

        # Login
        login_response = client.post(
            "/api/auth/login",
            json={"username": "integrationuser", "password": "integrationpass123"}
        )
        assert login_response.status_code == 200
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}

        # Get analytics (should be empty initially)
        analytics_response = client.get("/api/sessions/analytics", headers=headers)
        assert analytics_response.status_code == 200
        assert analytics_response.json()["summary"]["total_sessions"] == 0

        # Note: In a full integration test, we would also test data upload
        # but that requires file upload functionality to be implemented