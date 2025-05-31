# Claude Code Tutorials

## Common Workflows

### 1. Resume Previous Conversations

#### Automatic Resume (Most Recent)
```bash
claude --continue
# or
claude -c
```

#### Select Specific Conversation
```bash
claude --resume
# Shows list of past conversations to choose from
```

Benefits:
- Preserves full conversation context
- Maintains tool state
- Continues where you left off

### 2. Understand New Codebases

#### Initial Exploration
```bash
claude
> What's the overall architecture of this project?
> Explain the main components and how they interact
> What are the key design patterns used here?
```

#### Specific Investigation
```bash
> Where is user authentication handled?
> Show me the database schema
> What testing framework is used?
```

#### Best Practices
- Start with broad questions
- Drill down into specifics
- Ask about conventions and patterns

### 3. Fix Bugs and Refactor

#### Bug Fixing Workflow
```bash
claude
> I'm getting error: "TypeError: Cannot read property 'id' of undefined" 
> when clicking the submit button on the user form
```

Claude will:
1. Analyze the error
2. Search for relevant code
3. Identify root cause
4. Suggest and implement fix

#### Refactoring Example
```bash
> Refactor the user service to use async/await instead of callbacks
> Make sure to maintain all existing functionality
```

#### Modernization
```bash
> Update this component from class-based to functional React with hooks
> Preserve all current behavior and props
```

### 4. Work with Images

#### Methods to Share Images
1. **Drag and drop** into terminal
2. **Paste** from clipboard
3. **Provide path**: `Look at ~/Desktop/screenshot.png`

#### Use Cases
```bash
> Here's a mockup - implement this UI component
> Analyze this architecture diagram and suggest improvements
> Convert this flowchart into working code
```

### 5. Extended Thinking

#### Trigger Deep Analysis
Use phrases like:
- "think step by step"
- "think carefully"
- "think deeply about"

#### Example
```bash
> Think deeply about the security implications of this authentication flow
> and suggest comprehensive improvements
```

Benefits:
- More thorough analysis
- Better edge case handling
- Comprehensive solutions
- Architectural insights

### 6. Project Memory

#### Create Project Memory
```bash
# Create CLAUDE.md in project root
echo "# Project Instructions" > CLAUDE.md
echo "Always use TypeScript strict mode" >> CLAUDE.md
echo "Follow REST naming conventions" >> CLAUDE.md
```

#### Quick Memory Addition
```bash
> # Always run tests before committing
# Claude will ask where to save this memory
```

#### Memory File Structure
```markdown
# Project Instructions

## Coding Standards
- Use TypeScript strict mode
- Follow PEP 8 for Python

## Common Commands
- Run tests: npm test
- Build: npm run build
- Deploy: ./deploy.sh

## Architecture Decisions
- Use JWT for authentication
- PostgreSQL for production
- React Query for data fetching
```

### 7. Model Context Protocol (MCP)

#### Configure MCP Server
In `.claude/mcp_settings.json`:
```json
{
  "servers": {
    "database": {
      "command": "node",
      "args": ["path/to/db-server.js"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}
```

#### Use MCP Tools
```bash
> Query the production database for user statistics
> Connect to the Redis cache and check key patterns
```

## Workflow Examples

### Feature Development Workflow
```bash
# 1. Start with context
claude
> I need to add a password reset feature

# 2. Claude explores existing code
> Let me examine the current authentication system...

# 3. Implementation plan
> I'll implement this in stages:
> 1. Add password reset token to user model
> 2. Create reset request endpoint
> 3. Build reset form component
> 4. Add email sending logic

# 4. Iterative implementation
> Starting with the database model...
```

### Debugging Workflow
```bash
# 1. Share the problem
> The app crashes when uploading large files

# 2. Provide details
> Error: "PayloadTooLargeError: request entity too large"
> Happens with files over 10MB

# 3. Claude investigates
> Let me check the upload configuration...

# 4. Solution implemented
> I've updated the upload limits in both frontend and backend
```

### Code Review Workflow
```bash
# 1. Request review
claude review

# 2. Claude analyzes recent changes
> Reviewing your recent changes...

# 3. Feedback provided
> Found 3 areas for improvement:
> 1. Missing error handling in upload function
> 2. SQL query could be optimized with index
> 3. Consider extracting magic numbers to constants
```

## Advanced Tips

### 1. Batch Operations
```bash
> Update all API endpoints to use the new error format
> and add proper TypeScript types
```

### 2. Test-Driven Development
```bash
> Write tests for the user service, then implement
> the missing functionality to make them pass
```

### 3. Documentation Generation
```bash
> Generate API documentation for all endpoints in
> the auth module using OpenAPI format
```

### 4. Performance Optimization
```bash
> Analyze the dashboard component for performance issues
> and implement optimizations
```

## Best Practices Summary

1. **Be Specific** - Clear, detailed requests get better results
2. **Provide Context** - Share error messages, logs, requirements
3. **Iterative Approach** - Build complex features step by step
4. **Use Memory** - Store project conventions and commands
5. **Leverage Images** - Visual context helps with UI work
6. **Think Deeply** - Use extended thinking for complex problems
7. **Resume Sessions** - Continue conversations for context