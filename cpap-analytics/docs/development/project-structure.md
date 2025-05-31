# CPAP Analytics Platform - Complete Project Structure

## 📁 Repository Organization

This document shows how to organize all the documentation and code files for your CPAP Analytics Platform project.

```
cpap-analytics/
├── README.md                    # Main project README (created earlier)
├── LICENSE                      # MIT License file
├── CONTRIBUTING.md              # Contribution guidelines
├── CODE_OF_CONDUCT.md          # Community standards
├── SECURITY.md                 # Security policy
├── .gitignore                  # Git ignore file
├── .gitattributes              # Git attributes
├── .editorconfig               # Editor configuration
├── .env.example                # Example environment variables
├── cpap-analytics.code-workspace # VS Code workspace file
│
├── .github/                    # GitHub specific files
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   ├── feature_request.md
│   │   └── config.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── workflows/              # GitHub Actions
│   │   ├── ci.yml             # Continuous Integration
│   │   ├── codeql.yml         # Security scanning
│   │   └── release.yml        # Release automation
│   ├── CODEOWNERS
│   └── dependabot.yml
│
├── .vscode/                    # VS Code configuration
│   ├── settings.json          # Workspace settings
│   ├── launch.json            # Debug configurations
│   ├── tasks.json             # Task definitions
│   ├── extensions.json        # Recommended extensions
│   └── snippets/              # Code snippets
│       ├── python.code-snippets
│       └── typescript.code-snippets
│
├── docs/                       # Documentation
│   ├── README.md              # Documentation index
│   ├── ROADMAP.md             # Product roadmap (created earlier)
│   ├── ARCHITECTURE.md        # System architecture
│   ├── API.md                 # API reference (created earlier)
│   ├── DEVELOPER_GUIDE.md     # Developer guide (created earlier)
│   ├── USER_GUIDE.md          # User manual
│   ├── INSTALLATION.md        # Installation guide
│   ├── TROUBLESHOOTING.md     # Common issues
│   ├── DATA_FORMATS.md        # CPAP data specifications
│   ├── SECURITY.md            # Security documentation
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── wiki/                  # Wiki pages (created earlier)
│   │   ├── Home.md
│   │   ├── Getting-Started.md
│   │   └── ...
│   └── images/                # Documentation images
│       ├── architecture.png
│       ├── dashboard.png
│       └── logo.png
│
├── backend/                    # Python backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py           # FastAPI application
│   │   ├── config.py         # Configuration
│   │   ├── dependencies.py   # Dependency injection
│   │   ├── api/              # API routes
│   │   │   ├── __init__.py
│   │   │   ├── v1/
│   │   │   │   ├── __init__.py
│   │   │   │   ├── auth.py
│   │   │   │   ├── sessions.py
│   │   │   │   ├── analytics.py
│   │   │   │   └── devices.py
│   │   │   └── deps.py       # API dependencies
│   │   ├── core/             # Core functionality
│   │   │   ├── __init__.py
│   │   │   ├── security.py
│   │   │   ├── database.py
│   │   │   └── exceptions.py
│   │   ├── models/           # Database models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── session.py
│   │   │   ├── device.py
│   │   │   └── analytics.py
│   │   ├── schemas/          # Pydantic schemas
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── session.py
│   │   │   └── analytics.py
│   │   ├── parsers/          # CPAP data parsers
│   │   │   ├── __init__.py
│   │   │   ├── base.py       # Base parser class
│   │   │   ├── resmed.py     # ResMed parser
│   │   │   ├── philips.py    # Philips parser
│   │   │   └── utils.py
│   │   ├── analytics/        # Smart Insights Engine (NEW)
│   │   │   ├── __init__.py
│   │   │   ├── insights_engine.py  # Rule-based analysis engine
│   │   │   ├── metrics.py          # Metrics calculations
│   │   │   └── mask_fit.py         # Mask fit analysis
│   │   ├── ml/               # Machine learning
│   │   │   ├── __init__.py
│   │   │   ├── models.py
│   │   │   ├── training.py
│   │   │   └── inference.py
│   │   └── utils/            # Utilities
│   │       ├── __init__.py
│   │       ├── logging.py
│   │       └── validators.py
│   ├── tests/                # Tests
│   │   ├── __init__.py
│   │   ├── conftest.py      # Pytest configuration
│   │   ├── test_api/
│   │   ├── test_parsers/
│   │   ├── test_analytics/
│   │   └── test_ml/
│   ├── alembic/             # Database migrations
│   │   ├── alembic.ini
│   │   ├── env.py
│   │   └── versions/
│   ├── scripts/             # Utility scripts
│   │   ├── init_db.py
│   │   ├── import_data.py
│   │   └── generate_sample_data.py
│   ├── requirements.txt     # Production dependencies
│   ├── requirements-dev.txt # Development dependencies
│   ├── pytest.ini          # Pytest configuration
│   ├── .env.example        # Environment variables example
│   └── Dockerfile          # Docker configuration
│
├── frontend/                # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── manifest.json
│   ├── src/
│   │   ├── index.tsx       # Entry point  
│   │   ├── App.tsx         # Main app with advanced layout system ✨ ENHANCED
│   │   ├── components/     # Reusable components
│   │   │   ├── Dashboard.tsx # Main dashboard with professional design ✨ ENHANCED
│   │   │   ├── Login.tsx   # Modern authentication with glass card design ✨ ENHANCED
│   │   │   ├── ErrorBoundary.tsx # Error handling
│   │   │   ├── LoadingSpinner.tsx # Professional loading states ✨ ENHANCED
│   │   │   ├── layout/     # ✨ NEW: Advanced Layout System Components
│   │   │   │   ├── AppLayout.tsx # Main layout wrapper with ambient effects & shortcuts
│   │   │   │   ├── Sidebar.tsx # Collapsible navigation with user profile
│   │   │   │   ├── TopNavBar.tsx # Header with search and notifications
│   │   │   │   ├── CommandPalette.tsx # ⌘K quick actions with fuzzy search
│   │   │   │   ├── QuickActions.tsx # Contextual action buttons
│   │   │   │   ├── NotificationCenter.tsx # Real-time notification system
│   │   │   │   ├── AppLayout.css # Layout-specific styles
│   │   │   │   ├── Sidebar.css # Sidebar styles with glass morphism
│   │   │   │   ├── TopNavBar.css # Navigation bar styles
│   │   │   │   ├── CommandPalette.css # Command palette styles
│   │   │   │   ├── QuickActions.css # Quick actions styles
│   │   │   │   ├── NotificationCenter.css # Notification styles
│   │   │   │   └── index.ts # Layout component exports
│   │   │   ├── widgets/    # ✨ NEW: Modular Widget Components
│   │   │   │   ├── MetricCard.tsx # Professional metric display cards
│   │   │   │   ├── MetricCard.css # Metric card specific styles
│   │   │   │   └── index.ts # Widget exports
│   │   │   ├── charts/     # Data visualization components ✨ CURRENT
│   │   │   │   ├── AHITrendChart.tsx # AHI trends with insights & dynamic ticks
│   │   │   │   ├── SleepQualityChart.tsx # Quality & duration analysis
│   │   │   │   ├── TherapyInsights.tsx # ML-style recommendations
│   │   │   │   ├── ComplianceHeatmap.tsx # Calendar compliance tracking
│   │   │   │   ├── EventBreakdownChart.tsx # Sleep event type analysis
│   │   │   │   └── index.ts # Chart exports
│   │   │   ├── SmartInsights.tsx # NEW: Rule-based intelligent insights component
│   │   │   ├── DateRangeSelector.tsx # Enhanced dropdown with fixed z-index ✨ ENHANCED
│   │   │   ├── common/
│   │   │   └── forms/
│   │   ├── pages/          # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Sessions.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── Settings.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useAnalytics.ts
│   │   │   └── useSessions.ts
│   │   ├── services/       # API services
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   └── analytics.ts
│   │   ├── store/          # State management
│   │   │   ├── index.ts
│   │   │   └── slices/
│   │   ├── types/          # TypeScript types
│   │   │   ├── index.ts
│   │   │   ├── api.ts
│   │   │   └── models.ts
│   │   ├── utils/          # Utility functions
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   └── validators.ts
│   │   └── styles/         # ✨ ENHANCED: Modern Design System
│   │       ├── index.css   # Professional design system with Inter font & components
│   │       ├── design-system.css # ✨ NEW: Complete design tokens & glass morphism
│   │       └── tailwind.css
│   ├── .env.example        # Environment example
│   ├── package.json        # Dependencies
│   ├── tsconfig.json       # TypeScript config
│   ├── tailwind.config.js  # Tailwind config
│   ├── .eslintrc.js       # ESLint config
│   ├── .prettierrc        # Prettier config
│   └── Dockerfile         # Docker configuration
│
├── mobile/                 # React Native app (future)
│   └── README.md
│
├── docker/                 # Docker configurations
│   ├── docker-compose.yml  # Development compose
│   ├── docker-compose.prod.yml # Production compose
│   └── nginx.conf         # Nginx configuration
│
├── scripts/               # Project-wide scripts
│   ├── setup.sh          # Full project setup
│   ├── setup-backend.sh  # Backend setup
│   ├── setup-frontend.sh # Frontend setup
│   ├── dev.sh           # Start development
│   ├── test.sh          # Run all tests
│   ├── build.sh         # Build for production
│   └── deploy.sh        # Deployment script
│
├── data/                  # Data directory (git-ignored)
│   ├── samples/          # Sample CPAP data
│   ├── imports/          # Imported data
│   └── exports/          # Generated reports
│
└── tests/                # End-to-end tests
    ├── e2e/
    └── integration/
```

## 🚀 Initial Setup Commands

Create this project structure with these commands:

```bash
# Create main directories
mkdir -p cpap-analytics/{backend,frontend,docs,scripts,.github,.vscode,docker,tests,data}
cd cpap-analytics

# Initialize git repository
git init
git branch -M main

# Create main documentation files
touch README.md LICENSE CONTRIBUTING.md CODE_OF_CONDUCT.md SECURITY.md
touch .gitignore .gitattributes .editorconfig .env.example

# Create backend structure
mkdir -p backend/{app,tests,alembic,scripts}
mkdir -p backend/app/{api,core,models,schemas,parsers,analytics,ml,utils}
mkdir -p backend/app/api/v1
touch backend/{requirements.txt,requirements-dev.txt,pytest.ini,Dockerfile}

# Create frontend structure
mkdir -p frontend/{public,src}
mkdir -p frontend/src/{components,pages,hooks,services,store,types,utils,styles}
touch frontend/{package.json,tsconfig.json,tailwind.config.js,.eslintrc.js,.prettierrc,Dockerfile}

# Create documentation structure
mkdir -p docs/{wiki,images}
touch docs/{README.md,ROADMAP.md,ARCHITECTURE.md,API.md,DEVELOPER_GUIDE.md}

# Create GitHub templates
mkdir -p .github/{ISSUE_TEMPLATE,workflows}
touch .github/{CODEOWNERS,dependabot.yml,PULL_REQUEST_TEMPLATE.md}

# Create VS Code configuration
touch .vscode/{settings.json,launch.json,tasks.json,extensions.json}
mkdir -p .vscode/snippets

# Create project scripts
touch scripts/{setup.sh,dev.sh,test.sh,build.sh,deploy.sh}
chmod +x scripts/*.sh
```

## 📝 Essential Configuration Files

### .gitignore
```gitignore
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.env
.env.*
!.env.example

# JavaScript/TypeScript
node_modules/
build/
dist/
.next/
*.log
npm-debug.log*

# IDE
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Project specific
data/
!data/samples/
*.db
*.sqlite
*.log
coverage/
.coverage
htmlcov/
.pytest_cache/
```

### cpap-analytics.code-workspace
```json
{
  "folders": [
    {
      "name": "Backend",
      "path": "backend"
    },
    {
      "name": "Frontend", 
      "path": "frontend"
    },
    {
      "name": "Documentation",
      "path": "docs"
    },
    {
      "name": "Root",
      "path": "."
    }
  ],
  "settings": {
    "files.exclude": {
      "**/__pycache__": true,
      "**/node_modules": true,
      "**/.pytest_cache": true
    }
  },
  "extensions": {
    "recommendations": [
      "ms-python.python",
      "dbaeumer.vscode-eslint",
      "esbenp.prettier-vscode",
      "bradlc.vscode-tailwindcss"
    ]
  }
}
```

### scripts/setup.sh
```bash
#!/bin/bash
set -e

echo "🚀 Setting up CPAP Analytics Platform..."

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "Python 3 is required but not installed."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "Node.js is required but not installed."; exit 1; }
command -v git >/dev/null 2>&1 || { echo "Git is required but not installed."; exit 1; }

# Setup backend
echo "📦 Setting up backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install -r requirements-dev.txt
python scripts/init_db.py
cd ..

# Setup frontend
echo "📦 Setting up frontend..."
cd frontend
npm install
cd ..

# Create data directories
echo "📁 Creating data directories..."
mkdir -p data/{samples,imports,exports}

# Copy environment files
echo "🔧 Setting up environment files..."
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

echo "✅ Setup complete!"
echo ""
echo "To start development:"
echo "  ./scripts/dev.sh"
echo ""
echo "Or manually:"
echo "  Backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo "  Frontend: cd frontend && npm start"
```

## 🎯 Next Steps

1. **Copy all the created documentation** into your project structure
2. **Initialize the repository**:
   ```bash
   cd cpap-analytics
   git init
   git add .
   git commit -m "Initial commit: Complete project structure and documentation"
   ```

3. **Set up GitHub repository**:
   ```bash
   git remote add origin https://github.com/gdadkins/cpap-analytics.git
   git push -u origin main
   ```

4. **Start development** following the VS Code Setup Guide

5. **Begin with the Python data reader** to test with your actual CPAP SD card data

This comprehensive structure gives you:
- ✅ Professional documentation
- ✅ Clear project organization  
- ✅ Development best practices
- ✅ Ready for collaboration
- ✅ Scalable architecture
- ✅ VS Code optimized workflow

You now have everything needed to build a production-quality CPAP analytics platform! 🚀