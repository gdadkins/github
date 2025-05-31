import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.core.database import get_db, Base
from app.models.user import User
from app.models.session import Session as CPAPSession
from app.core.security import get_password_hash


# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={
        "check_same_thread": False,
    },
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client():
    """Create a test client for FastAPI app."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def test_user(db_session):
    """Create a test user."""
    user = User(
        username="testuser",
        email="test@example.com",
        hashed_password=get_password_hash("testpass123")
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_user_token(client, test_user):
    """Get JWT token for test user."""
    response = client.post(
        "/api/auth/login",
        json={"username": "testuser", "password": "testpass123"}
    )
    assert response.status_code == 200
    return response.json()["access_token"]


@pytest.fixture
def auth_headers(test_user_token):
    """Get authorization headers for API calls."""
    return {"Authorization": f"Bearer {test_user_token}"}


@pytest.fixture
def sample_cpap_sessions(db_session, test_user):
    """Create sample CPAP sessions for testing."""
    from datetime import datetime, timedelta
    
    sessions = []
    base_date = datetime.now() - timedelta(days=30)
    
    for i in range(30):
        session = CPAPSession(
            user_id=test_user.id,
            date=base_date + timedelta(days=i),
            duration_hours=7.5 + (i % 3) * 0.5,  # 7.5-8.5 hours
            ahi=5.2 + (i % 5) * 0.8,  # 5.2-8.4 AHI
            leak_rate=2.1 + (i % 3) * 0.3,  # 2.1-2.7 leak rate
            pressure_95=12.5 + (i % 4) * 0.5,  # 12.5-14 pressure
            central_apneas=i % 3,  # 0-2 central apneas
            obstructive_apneas=2 + (i % 4),  # 2-5 obstructive apneas
            hypopneas=8 + (i % 6),  # 8-13 hypopneas
            compliance_hours=7.2 + (i % 3) * 0.4  # 7.2-8.0 compliance
        )
        sessions.append(session)
        db_session.add(session)
    
    db_session.commit()
    return sessions