# Claude Code Development Guidelines for CPAP Analytics

## Core Philosophy
**Ship working solutions quickly and iterate**
- Bias toward action over analysis
- Security basics always included
- Always reference and update TODO.md to ensure anything pending is marked complete.
- Never include Claude Code attribution in git 🤖 Generated with [Claude Code](https://claude.ai/code)         Co-Authored-By: Claude <noreply@anthropic.com>"
- Always adhere to modular based component/module/code architecture and CSS for key components/module/code for easy of troubleshooting/implementations.
- If you create any temporary new files, scripts, or helper files for iteration, clean up these files by removing them at the end of the task.


## Project Overview
CPAP Analytics is a full-stack web application for analyzing CPAP therapy data with:
- **Backend**: ✅ **FastAPI-only architecture** (Flask backend successfully migrated and deprecated)
  - **Location**: `/backend/app/` (FastAPI main application)
  - **Features**: Async support, auto-documentation, Pydantic schemas, JWT authentication
  - **Migration Status**: Completed - all endpoints migrated to FastAPI
- **Frontend**: React + TypeScript + Vite + **Advanced Layout System**
  - **Architecture**: Modular component-based design with dedicated CSS modules
  - **Features**: Glass morphism UI, command palette, keyboard shortcuts, responsive sidebar
  - **Layout**: Professional enterprise-grade interface with interactive widgets
- **Database**: SQLite (development), PostgreSQL (production)
- **Authentication**: JWT-based with secure password hashing (FastAPI implementation)
- **Documentation**: Organized under `/docs` directory
- **Monetization**: Freemium SaaS model with B2B opportunities

### Standard Ports
- **Backend (FastAPI)**: 5000 (http://localhost:5000 - NEVER IN WSL) ✅ **PRIMARY**
- **Frontend (Vite)**: 5173 (http://localhost:5173 - ALWAYS use default port NEVER IN WSL)
- **Database (PostgreSQL)**: 5432 (production only)
- ~~**Backend (Flask)**: DEPRECATED~~ ❌

**IMPORTANT**: Always use these default ports. Kill any processes running on alternate ports (like 5174).

## Documentation Organization

- **CLAUDE.md** (this file): Development patterns, code examples, philosophy
- **[TODO.md](/TODO.md)**: Task tracking, progress, known issues
- **[Troubleshooting Guide](/docs/development/troubleshooting.md)**: Detailed problem-solving and common issues
- **[Project Structure](/docs/development/project-structure.md)**: Complete directory organization

## Testing & Development

- **Sample Data**: `/backend/scripts/generate_sample_data.py` - realistic CPAP data
- **Core Files**: `/backend/app/parsers/resmed.py`, `/frontend/src/components/charts/`
- Always update `TODO.md` when completing tasks

## Monetization
```python
# Subscription tiers
TIERS = {
    'free': {'price': 0, 'features': ['basic_analytics']},
    'premium': {'price': 999, 'features': ['ml_insights', 'pdf_export']},
    'pro': {'price': 1999, 'features': ['api_access', 'white_label']}
}

# Feature gating
@requires_subscription('premium')
def generate_pdf_report(user_id: int):
    # Premium feature logic
```

## Advanced Frontend Architecture

### Layout System Components
```typescript
// Core layout structure
/frontend/src/components/layout/
├── AppLayout.tsx          // Main layout wrapper with ambient effects
├── Sidebar.tsx            // Collapsible navigation with user profile
├── TopNavBar.tsx          // Header with search and notifications
├── CommandPalette.tsx     // ⌘K quick actions (fuzzy search)
├── QuickActions.tsx       // Contextual action buttons
├── NotificationCenter.tsx // Real-time notification system
└── index.ts              // Component exports
```

### Design System
```css
/* Modern design tokens in /frontend/src/styles/design-system.css */
:root {
  --color-primary-500: #3b82f6;
  --glass-bg: rgba(255, 255, 255, 0.1);
  --backdrop-blur: blur(16px);
}
```

### Keyboard Shortcuts
- **⌘K / Ctrl+K**: Open command palette
- **⌘B / Ctrl+B**: Toggle sidebar
- **⌘N / Ctrl+N**: Toggle notifications

### Component Architecture Principles
1. **Modular Design**: Each component has dedicated CSS file
2. **Glass Morphism**: Modern UI with backdrop blur effects
3. **Responsive**: Mobile-first responsive design
4. **Interactive**: Hover states, animations, smooth transitions
5. **Accessible**: ARIA labels, keyboard navigation

## Key Metrics
- **Business**: MRR, Churn, LTV
- **Technical**: API latency, Uptime
- **User**: DAU/MAU, Feature adoption
