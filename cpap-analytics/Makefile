# CPAP Analytics - Development Makefile

.PHONY: help install test test-backend test-frontend test-all lint format clean dev build

# Default target
help:
	@echo "CPAP Analytics Development Commands"
	@echo "=================================="
	@echo "install       - Install all dependencies"
	@echo "test          - Run all tests"
	@echo "test-backend  - Run backend tests only"
	@echo "test-frontend - Run frontend tests only"
	@echo "lint          - Run linting on all code"
	@echo "format        - Format all code"
	@echo "dev           - Start development servers"
	@echo "build         - Build production assets"
	@echo "clean         - Clean build artifacts"

# Installation
install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install
	@echo "Dependencies installed successfully!"

# Testing
test: test-backend test-frontend
	@echo "All tests completed!"

test-backend:
	@echo "Running backend tests..."
	cd backend && python -m pytest tests/ -v --cov=app --cov-report=term-missing

test-backend-watch:
	@echo "Running backend tests in watch mode..."
	cd backend && python -m pytest tests/ -v --cov=app -f

test-frontend:
	@echo "Running frontend tests..."
	cd frontend && npm run test

test-frontend-watch:
	@echo "Running frontend tests in watch mode..."
	cd frontend && npm run test:watch

test-coverage:
	@echo "Running tests with coverage reports..."
	cd backend && python -m pytest tests/ -v --cov=app --cov-report=html --cov-report=term-missing
	cd frontend && npm run test:coverage
	@echo "Coverage reports generated in backend/htmlcov/ and frontend/coverage/"

# Linting and formatting
lint:
	@echo "Running backend linting..."
	cd backend && flake8 app/ tests/
	@echo "Running frontend linting..."
	cd frontend && npm run lint

format:
	@echo "Formatting backend code..."
	cd backend && black app/ tests/
	@echo "Frontend formatting is handled by ESLint --fix"
	cd frontend && npm run lint -- --fix

# Development
dev:
	@echo "Starting development servers..."
	@echo "Backend will run on http://localhost:5000"
	@echo "Frontend will run on http://localhost:5173"
	@echo "Use Ctrl+C to stop servers"
	make -j2 dev-backend dev-frontend

dev-backend:
	cd backend && python app/main.py

dev-frontend:
	cd frontend && npm run dev

# Build
build:
	@echo "Building frontend for production..."
	cd frontend && npm run build
	@echo "Build completed! Assets are in frontend/dist/"

# Database
db-init:
	@echo "Initializing database..."
	cd backend && python app/init_db.py

db-migrate:
	@echo "Running database migrations..."
	cd backend && alembic upgrade head

db-reset:
	@echo "Resetting database..."
	cd backend && rm -f cpap_analytics.db
	make db-init

# Cleanup
clean:
	@echo "Cleaning build artifacts..."
	cd backend && rm -rf __pycache__ .pytest_cache .coverage htmlcov/ *.pyc
	cd frontend && rm -rf node_modules/.cache dist/ coverage/
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete
	@echo "Cleanup completed!"

# Docker
docker-build:
	@echo "Building Docker images..."
	docker build -t cpap-analytics-backend ./backend
	docker build -t cpap-analytics-frontend ./frontend

docker-dev:
	@echo "Starting development environment with Docker Compose..."
	docker-compose -f docker-compose.dev.yml up

# Production deployment
deploy-staging:
	@echo "Deploying to staging..."
	# Add staging deployment commands

deploy-production:
	@echo "Deploying to production..."
	# Add production deployment commands

# Utility commands
check-deps:
	@echo "Checking for outdated dependencies..."
	cd backend && pip list --outdated
	cd frontend && npm outdated

update-deps:
	@echo "Updating dependencies..."
	cd backend && pip-review --local --auto
	cd frontend && npm update

# Security
security-scan:
	@echo "Running security scans..."
	cd backend && bandit -r app/
	cd frontend && npm audit

# Quick development workflow
quick-test:
	@echo "Running quick tests (unit tests only)..."
	cd backend && python -m pytest tests/ -v -m "not integration"
	cd frontend && npm test -- --watchAll=false

# Generate test data
generate-test-data:
	@echo "Generating test data..."
	cd backend && python scripts/generate_sample_data.py

# Performance testing
perf-test:
	@echo "Running performance tests..."
	# Add performance testing commands