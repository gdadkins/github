import pytest
from fastapi.testclient import TestClient


@pytest.mark.unit
@pytest.mark.auth
class TestAuthEndpoints:
    """Test authentication endpoints."""

    def test_register_new_user(self, client: TestClient):
        """Test user registration with valid data."""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "newpass123"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "newuser"
        assert data["email"] == "newuser@example.com"
        assert "id" in data
        assert "hashed_password" not in data  # Should not expose password

    def test_register_duplicate_username(self, client: TestClient, test_user):
        """Test registration with existing username fails."""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "testuser",  # Same as test_user
                "email": "different@example.com",
                "password": "newpass123"
            }
        )
        assert response.status_code == 400
        assert "Username already registered" in response.json()["detail"]

    def test_register_duplicate_email(self, client: TestClient, test_user):
        """Test registration with existing email fails."""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "differentuser",
                "email": "test@example.com",  # Same as test_user
                "password": "newpass123"
            }
        )
        assert response.status_code == 400
        assert "Email already registered" in response.json()["detail"]

    def test_register_invalid_email(self, client: TestClient):
        """Test registration with invalid email format fails."""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "newuser",
                "email": "not-an-email",
                "password": "newpass123"
            }
        )
        assert response.status_code == 422  # Validation error

    def test_register_weak_password(self, client: TestClient):
        """Test registration with weak password fails."""
        response = client.post(
            "/api/auth/register",
            json={
                "username": "newuser",
                "email": "newuser@example.com",
                "password": "123"  # Too short
            }
        )
        assert response.status_code == 422  # Validation error

    def test_login_valid_credentials(self, client: TestClient, test_user):
        """Test login with valid credentials."""
        response = client.post(
            "/api/auth/login",
            json={"username": "testuser", "password": "testpass123"}
        )
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"

    def test_login_invalid_username(self, client: TestClient):
        """Test login with non-existent username fails."""
        response = client.post(
            "/api/auth/login",
            json={"username": "nonexistent", "password": "testpass123"}
        )
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]

    def test_login_invalid_password(self, client: TestClient, test_user):
        """Test login with wrong password fails."""
        response = client.post(
            "/api/auth/login",
            json={"username": "testuser", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        assert "Incorrect username or password" in response.json()["detail"]

    def test_login_missing_fields(self, client: TestClient):
        """Test login with missing fields fails."""
        response = client.post(
            "/api/auth/login",
            json={"username": "testuser"}  # Missing password
        )
        assert response.status_code == 422  # Validation error

    def test_get_profile_with_valid_token(self, client: TestClient, auth_headers, test_user):
        """Test getting user profile with valid token."""
        response = client.get("/api/auth/profile", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == test_user.username
        assert data["email"] == test_user.email
        assert data["id"] == test_user.id

    def test_get_profile_without_token(self, client: TestClient):
        """Test getting profile without token fails."""
        response = client.get("/api/auth/profile")
        assert response.status_code == 401

    def test_get_profile_with_invalid_token(self, client: TestClient):
        """Test getting profile with invalid token fails."""
        response = client.get(
            "/api/auth/profile",
            headers={"Authorization": "Bearer invalid-token"}
        )
        assert response.status_code == 401

    def test_logout_with_valid_token(self, client: TestClient, auth_headers):
        """Test logout with valid token."""
        response = client.post("/api/auth/logout", headers=auth_headers)
        assert response.status_code == 200
        assert response.json()["message"] == "Successfully logged out"

    def test_logout_without_token(self, client: TestClient):
        """Test logout without token fails."""
        response = client.post("/api/auth/logout")
        assert response.status_code == 401