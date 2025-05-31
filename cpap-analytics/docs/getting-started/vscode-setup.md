# CPAP Analytics Platform - VS Code Setup Guide

## 🚀 Quick Start with VS Code

This guide will get you up and running with the CPAP Analytics Platform in VS Code in under 10 minutes.

## 📋 Prerequisites

```bash
# Verify installations
code --version      # VS Code installed
python --version    # Python 3.8+
node --version      # Node.js 16+
git --version       # Git 2.0+
```

## 🛠️ Step 1: Clone and Open Project

```bash
# Clone the repository
git clone https://github.com/gdadkins/cpap-analytics.git
cd cpap-analytics

# Open in VS Code
code .
```

## 📦 Step 2: Install VS Code Extensions

When VS Code opens, you'll see a notification to install recommended extensions. Click "Install All".

Or manually install these essential extensions:

```bash
# Install via command line
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-azuretools.vscode-docker
code --install-extension eamodio.gitlens
code --install-extension yzhang.markdown-all-in-one
```

## 🐍 Step 3: Backend Setup

### Option A: Automated Setup (Recommended)
```bash
# In VS Code Terminal (Ctrl/Cmd + `)
./scripts/setup-backend.sh
```

### Option B: Manual Setup
```bash
# Create Python virtual environment
cd backend
python -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install -r requirements-dev.txt

# Initialize database
python scripts/init_db.py

# Create .env file
cp .env.example .env
```

### Configure Python Interpreter in VS Code

1. Press `Cmd/Ctrl + Shift + P`
2. Type "Python: Select Interpreter"
3. Choose `./backend/venv/bin/python`

## ⚛️ Step 4: Frontend Setup

```bash
# In a new terminal
cd frontend
npm install

# Create environment file
cp .env.example .env.local
```

## 🎯 Step 5: VS Code Workspace Configuration

### Create Workspace Settings

Create `.vscode/settings.json`:

```json
{
  // Python settings
  "python.defaultInterpreterPath": "${workspaceFolder}/backend/venv/bin/python",
  "python.linting.enabled": true,
  "python.linting.pylintEnabled": true,
  "python.formatting.provider": "black",
  "python.testing.pytestEnabled": true,
  "python.testing.pytestArgs": ["backend/tests"],
  
  // JavaScript/TypeScript settings
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  
  // Tailwind CSS
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ],
  
  // File associations
  "files.associations": {
    "*.css": "tailwindcss"
  },
  
  // Editor settings
  "editor.rulers": [88, 120],
  "editor.tabSize": 2,
  "[python]": {
    "editor.tabSize": 4
  },
  
  // Git settings
  "git.autofetch": true,
  "git.confirmSync": false,
  
  // Terminal settings
  "terminal.integrated.env.osx": {
    "PATH": "${workspaceFolder}/backend/venv/bin:${env:PATH}"
  },
  "terminal.integrated.env.linux": {
    "PATH": "${workspaceFolder}/backend/venv/bin:${env:PATH}"
  }
}
```

### Create Launch Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: FastAPI Backend",
      "type": "python",
      "request": "launch",
      "module": "uvicorn",
      "args": [
        "app.main:app",
        "--reload",
        "--port",
        "8000"
      ],
      "cwd": "${workspaceFolder}/backend",
      "env": {
        "PYTHONPATH": "${workspaceFolder}/backend"
      },
      "console": "integratedTerminal",
      "justMyCode": false
    },
    {
      "name": "React: Frontend",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend/src",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "name": "Python: Current File",
      "type": "python",
      "request": "launch",
      "program": "${file}",
      "console": "integratedTerminal"
    },
    {
      "name": "Python: Debug Tests",
      "type": "python",
      "request": "launch",
      "module": "pytest",
      "args": ["-v", "${file}"],
      "cwd": "${workspaceFolder}/backend",
      "console": "integratedTerminal"
    }
  ],
  "compounds": [
    {
      "name": "Full Stack",
      "configurations": ["Python: FastAPI Backend", "React: Frontend"],
      "stopAll": true
    }
  ]
}
```

### Create Tasks

Create `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "source venv/bin/activate && uvicorn app.main:app --reload",
      "options": {
        "cwd": "${workspaceFolder}/backend"
      },
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Start Frontend",
      "type": "npm",
      "script": "start",
      "path": "frontend/",
      "group": "build",
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "Run Tests",
      "type": "shell",
      "command": "pytest -v",
      "options": {
        "cwd": "${workspaceFolder}/backend"
      },
      "group": "test"
    },
    {
      "label": "Format Code",
      "type": "shell",
      "command": "black . && cd ../frontend && npm run format",
      "options": {
        "cwd": "${workspaceFolder}/backend"
      }
    },
    {
      "label": "Import CPAP Data",
      "type": "shell",
      "command": "python scripts/import_data.py",
      "options": {
        "cwd": "${workspaceFolder}/backend"
      },
      "problemMatcher": []
    }
  ]
}
```

## 🏃 Step 6: Running the Application

### Option 1: Using VS Code Tasks (Recommended)

1. Press `Cmd/Ctrl + Shift + P`
2. Type "Tasks: Run Task"
3. Select "Start Backend" and "Start Frontend"

### Option 2: Using Launch Configurations

1. Go to Run and Debug panel (`Cmd/Ctrl + Shift + D`)
2. Select "Full Stack" from dropdown
3. Press F5 or click green play button

### Option 3: Manual Terminal Commands

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2: Frontend
cd frontend
npm start
```

## 🧪 Step 7: Testing Your Setup

### Test Backend
```bash
# In backend directory
pytest tests/test_health.py -v

# Or use VS Code test explorer
# Click on the flask icon in the activity bar
```

### Test Frontend
```bash
# In frontend directory
npm test

# Run in watch mode
npm test -- --watch
```

### Test API
```bash
# With backend running
curl http://localhost:8000/health

# Should return:
# {"status":"healthy","timestamp":"2025-05-28T12:00:00Z"}
```

## 📝 Step 8: Import Sample Data

```bash
# Download sample data
cd backend
wget https://github.com/cpap-analytics/sample-data/raw/main/resmed-sample.zip
unzip resmed-sample.zip -d data/samples/

# Import to database
python scripts/import_sample_data.py
```

## 🎨 VS Code Tips & Tricks

### Keyboard Shortcuts

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Command Palette | `Cmd+Shift+P` | `Ctrl+Shift+P` |
| Quick Open File | `Cmd+P` | `Ctrl+P` |
| Toggle Terminal | `Ctrl+`` | `Ctrl+`` |
| Run Task | `Cmd+Shift+B` | `Ctrl+Shift+B` |
| Debug | `F5` | `F5` |
| Find in Files | `Cmd+Shift+F` | `Ctrl+Shift+F` |

### Useful Commands

```bash
# In Command Palette (Cmd/Ctrl + Shift + P)
"Python: Select Interpreter"
"Python: Run Python File in Terminal"
"Tasks: Run Task"
"Git: Commit"
"Markdown: Open Preview to the Side"
```

### Snippets

Create `.vscode/python.code-snippets`:

```json
{
  "CPAP Session Model": {
    "prefix": "cpapsession",
    "body": [
      "class ${1:SessionAnalysis}:",
      "    \"\"\"${2:Analyze CPAP session data}\"\"\"",
      "    ",
      "    def __init__(self, session_id: str):",
      "        self.session_id = session_id",
      "        self.data = self._load_session_data()",
      "    ",
      "    def analyze(self) -> Dict[str, Any]:",
      "        \"\"\"Run analysis on session data\"\"\"",
      "        return {",
      "            'ahi': self._calculate_ahi(),",
      "            'leak_rate': self._analyze_leaks(),",
      "            'quality_score': self._calculate_quality()",
      "        }"
    ]
  }
}
```

## 🐛 Troubleshooting

### Common Issues

**Python interpreter not found**
```bash
# Recreate virtual environment
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Port already in use**
```bash
# Find and kill process
# macOS/Linux:
lsof -i :8000
kill -9 <PID>

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Module import errors**
```bash
# Ensure PYTHONPATH is set
export PYTHONPATH="${PYTHONPATH}:${PWD}/backend"
```

## 📚 Next Steps

1. **Read the Documentation**
   - [Architecture Overview](docs/ARCHITECTURE.md)
   - [API Reference](docs/API.md)
   - [Contributing Guide](CONTRIBUTING.md)

2. **Join the Community**
   - [Discord Server](https://discord.gg/cpap-analytics)
   - [GitHub Discussions](https://github.com/cpap-analytics/discussions)

3. **Start Contributing**
   - Pick an issue labeled "good first issue"
   - Read the development guide
   - Submit your first PR!

## 🎉 You're Ready!

Your development environment is now set up. Visit:
- Backend API: http://localhost:8000/docs
- Frontend: http://localhost:3000
- API Documentation: http://localhost:8000/redoc

Happy coding! 🚀

---

*Need help? Check our [FAQ](docs/FAQ.md) or ask in [Discord](https://discord.gg/cpap-analytics)*