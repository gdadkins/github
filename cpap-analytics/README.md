# CPAP Analytics Platform

<p align="center">
  <strong>Open-source sleep therapy analytics for everyone</strong>
  <br>
  <br>
  <a href="docs/">Documentation</a> •
  <a href="TODO.md">Roadmap</a> •
  <a href="docs/api/reference.md">API Docs</a> •
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.8+-blue.svg" alt="Python 3.8+">
  <img src="https://img.shields.io/badge/react-18.0+-61dafb.svg" alt="React 18+">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License">
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome">
</p>

## 🎯 Mission

Democratize sleep therapy data analysis by providing CPAP users with professional-grade analytics tools. Transform raw CPAP data into actionable insights, helping users optimize their therapy.

## ✨ Key Features

### 📊 Comprehensive Analytics
- **Real-time Dashboard** - View therapy data with interactive visualizations
- **Advanced Metrics** - AHI trends, leak patterns, pressure analysis, and quality scoring
- **Session Analysis** - Detailed breakdown of individual therapy sessions
- **Data Export** - Export analytics and reports in multiple formats

### 🔒 Privacy First
- **Local Processing** - Your health data stays on your device
- **Secure Storage** - JWT authentication and encrypted data storage
- **No Cloud Dependencies** - Works completely offline

### 🛠️ Modern Architecture
- **FastAPI Backend** - ✅ **PRIMARY** - Modern async API with automatic documentation
- **React Frontend** - Professional design system with comprehensive data visualization
- **Responsive Design** - Mobile-first approach with glass morphism and modern UI

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/gdadkins/cpap-analytics.git
cd cpap-analytics

# Setup backend (FastAPI)
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd app && python main.py

# In a new terminal, setup frontend
cd frontend
npm install
npm run dev
```

**Access the Application:**
- **Frontend**: http://localhost:5173 (Vite default port)
- **Backend API**: http://localhost:5000 (or http://172.21.10.16:5000 in WSL)
- **Test Login**: Username `testuser`, Password `password123`

## 🏗️ Architecture

```
cpap-analytics/
├── backend/                 # Python backends
│   ├── app.py              # Flask application
│   ├── models/             # Flask SQLAlchemy models
│   ├── routes/             # Flask API blueprints
│   ├── app/                # FastAPI application
│   │   ├── api/            # FastAPI endpoints
│   │   ├── core/           # Core functionality
│   │   └── models/         # FastAPI models
│   └── scripts/            # Utility scripts
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service layer
│   │   └── types/          # TypeScript definitions
│   └── public/             # Static assets
├── docs/                   # Documentation
│   ├── getting-started/    # Setup guides
│   ├── development/        # Developer docs
│   ├── api/                # API reference
│   └── wiki/               # User guides
├── examples/               # Example code
└── TODO.md                 # Project roadmap and tasks
```

## 📋 Requirements

- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **Database**: SQLite (development), PostgreSQL (production ready)
- **Supported Devices**: 
  - ResMed AirSense 10/11 series
  - More devices coming soon

## 🛠️ Technology Stack

- **Backend**: Python, FastAPI, SQLAlchemy, Pydantic, NumPy, Pandas
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite, Recharts
- **Design System**: Inter font, CSS components, Glass morphism, Gradient backgrounds
- **Database**: SQLite/PostgreSQL
- **Authentication**: JWT with secure password hashing
- **Testing**: pytest, Jest, React Testing Library
- **Data Visualization**: Professional charts with dynamic filtering and insights

## 📚 Documentation

- [Quick Start Guide](docs/getting-started/quickstart.md) - Get up and running quickly
- [Installation Guide](docs/getting-started/installation.md) - Detailed setup instructions
- [Developer Guide](docs/development/guidelines.md) - Contributing and patterns
- [API Reference](docs/api/reference.md) - REST API documentation
- [Project Structure](docs/development/project-structure.md) - Codebase organization

## 🗺️ Roadmap

See our [TODO.md](TODO.md) for detailed task tracking. Current priorities:

- ✅ Core analytics dashboard with professional design
- ✅ User authentication and profiles  
- ✅ Advanced data visualizations and charts
- ✅ Professional UI/UX with modern design system
- ✅ Comprehensive testing infrastructure
- 📅 Machine learning insights
- 📅 Mobile app support
- 📅 Premium subscription features

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Quick Tips
- Follow patterns documented in [CLAUDE.md](CLAUDE.md)
- Check [TODO.md](TODO.md) for available tasks
- FastAPI backend is the primary and only supported backend
- Use the professional design system classes in frontend development
- All new UI components should follow the established design patterns

## ⚖️ License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## ⚠️ Medical Disclaimer

This software is for informational purposes only and is not a medical device. Always consult with your healthcare provider before making changes to your CPAP therapy.

## 🙏 Acknowledgments

- The CPAP community for feedback and testing
- All contributors who make this project possible

---

<p align="center">
  Made with ❤️ by the CPAP community, for the CPAP community
</p>
