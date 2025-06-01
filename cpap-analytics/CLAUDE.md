# Claude Code Development Guidelines for CPAP Analytics

## Core Philosophy

- Security basics always included
- Always reference and update TODO.md to ensure anything pending is marked complete.
- Always read and understand the codebase before implementing a new feature or bugfix
- Always adhere to efficient best practices structured, modular based component/module/code architecture and CSS for components/module/code for easier troubleshooting/implementations/updates. CSS files need to ALWAYS stay concise in nature even on a per individual basis.
- Never add the following to git updates or related: 🤖 Generated with [Claude Code](https://claude.ai/code) Co-Authored-By: Claude <noreply@anthropic.com>"
- Never use emojis in backend code as it will cause unicode errors. Keep frontend to a professional oriented minimal as long as it doesn't cause syntax/unicode/problems/errors.
- If you create any temporary new files, scripts, or helper files for iteration, clean up these files by removing them at the end of the task.
- When removing any code, make sure to verify if any methods/etc related to it can also be safely removed. The less tech debt, the better health our codebase will be.

## Code Refactoring Guidelines

When refactoring code, follow these principles:

- **SOLID principles**: Apply Single Responsibility Principle by breaking down large methods (>50 lines) into smaller, focused functions
- **DRY methodology**: Eliminate code duplication by creating shared utility functions
- **Extract constants**: Move magic numbers and configuration data to named constants
- **Separation of concerns**: Separate data processing from presentation logic
- **Static analysis**: Fix unused variables, type issues, and other warnings
- **Testing**: Verify functionality through comprehensive testing after each change

Goal: Improve maintainability, readability, and testability while preserving existing behavior.

## Common Issues & Solutions

### Authentication Error: "Cannot read properties of null (reading 'id')"
**Fixed: 2025-06-01**

**Root Cause**: The `useAuth` hook import conflict and null user prop handling in dashboard components.

**Solutions Applied**:
1. **Fixed useAuth Import Conflict**: Updated `Login.tsx` to import `useAuth` from `../App` instead of conflicting hook file
2. **Fixed Null User Prop**: Updated `App.tsx` `EnhancedDashboardWrapper` to pass actual `user` instead of `null`
3. **Added Null Safety**: Enhanced `EnhancedDashboard.tsx` with:
   - Early return for null user: `if (!user) return <div>Loading...</div>`
   - Safe property access: `user?.id || 0` instead of `user.id`
   - Updated dependency array: `[dashboardData, dateRange, user?.id]`

**Key Learning**: Always use optional chaining (`?.`) and nullish coalescing (`||`) when accessing user properties in React components to prevent runtime errors during authentication loading states.


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
