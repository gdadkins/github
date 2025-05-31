# Claude Code Memory Management

## Memory Types

### 1. Project Memory (`./CLAUDE.md`)
- Team-shared instructions for the project
- Version controlled with your codebase
- Example uses:
  - Project architecture documentation
  - Coding standards and conventions
  - Common workflows and procedures

### 2. User Memory (`~/.claude/CLAUDE.md`)
- Personal preferences across all projects
- Not version controlled
- Example uses:
  - Personal code styling preferences
  - Personal tooling shortcuts
  - Individual workflow preferences

## Memory Features

### Automatic Loading
- Memory files are automatically loaded when Claude Code launches
- No manual import needed for CLAUDE.md files

### File Imports
- Import additional files using `@path/to/import` syntax
- Supports recursive imports (max 5 hops)
- Works with relative and absolute paths

Example:
```markdown
See @README for project overview and @package.json for available npm commands
```

### Import Rules
- Imports within code spans/blocks are ignored
- Each file is only imported once (no circular imports)
- Import depth is limited to prevent infinite loops

## Memory Lookup Process

1. Recursively searches from current working directory up to root
2. Discovers CLAUDE.md files in subdirectories
3. Loads memories from parent directories automatically
4. Applies hierarchical inheritance (child overrides parent)

## Quick Memory Addition

Use `#` at the start of input to quickly add a memory:
```
# Always use async/await instead of promises
```

This will prompt you to select which memory file to store in.

## Viewing Loaded Memory

Use the `/memory` command to:
- View all loaded memory files
- See the full memory context
- Edit memory files directly

## Best Practices

### Be Specific
Instead of:
```markdown
Use good variable names
```

Use:
```markdown
- Variable names should be descriptive and use camelCase
- Boolean variables should start with 'is', 'has', or 'should'
- Arrays should use plural nouns
```

### Use Structured Markdown
```markdown
## Project Conventions

### API Endpoints
- Use RESTful naming conventions
- Return consistent error formats
- Include proper status codes

### Testing
- Write unit tests for all utility functions
- Use integration tests for API endpoints
- Maintain 80% code coverage
```

### Organize Under Headings
Group related instructions together:
```markdown
## Authentication
- Use JWT tokens for API authentication
- Store tokens in httpOnly cookies
- Implement refresh token rotation

## Database
- Use transactions for multi-step operations
- Always handle connection errors
- Index frequently queried columns
```

### Regular Updates
- Review memories periodically
- Remove outdated instructions
- Update based on project evolution

## Example CLAUDE.md Structure

```markdown
# Project Instructions for CPAP Analytics

## Architecture
- Frontend: React with TypeScript
- Backend: Flask/FastAPI dual implementation
- Database: SQLite (dev), PostgreSQL (prod)

## Coding Standards
- Use TypeScript strict mode
- Follow PEP 8 for Python code
- Implement proper error handling

## Common Tasks
### Adding New API Endpoint
1. Create route in appropriate blueprint
2. Add JWT protection if needed
3. Update TypeScript types
4. Add API documentation

### Database Changes
1. Update SQLAlchemy models
2. Create migration script
3. Update related schemas
4. Test with sample data

## Testing
- Run `npm test` for frontend
- Run `pytest` for backend
- Check coverage before commits
```