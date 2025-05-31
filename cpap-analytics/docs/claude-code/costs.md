# Claude Code Costs

## Overview

- **Average daily cost**: $6 per developer per day
- **90% of users**: Daily costs below $12
- **Claude Max subscription**: No need to monitor costs - subscription includes Claude Code usage

## Cost Tracking

### Check Current Session Usage
Use the `/cost` command in interactive mode:
```
> /cost
Current session: 125,000 tokens (~$3.50)
```

### Anthropic Console Users
For detailed tracking:
1. **Historical Usage** - Check in Console (requires Admin/Billing role)
2. **Workspace Spend Limits** - Set limits (requires Admin role)

## Cost Factors

### Primary Factors
1. **Codebase size** - Larger codebases = more context
2. **Query complexity** - Complex tasks use more tokens
3. **Number of files** - More files searched/modified = higher cost
4. **Conversation history** - Longer conversations accumulate tokens

### Secondary Factors
- **Compaction frequency** - How often context is compressed
- **Background processes** - Automatic operations
- **Model selection** - Different models have different costs

## Cost Reduction Strategies

### 1. Auto-Compact Feature
When context exceeds 95% capacity:
- Automatically compresses conversation
- Preserves essential context
- Toggle via `/config`

### 2. Manual Compaction
Use `/compact` command to:
- Reduce context size immediately
- Reset token count
- Maintain conversation continuity

### 3. Task Management
- **Break down complex tasks** into smaller operations
- **Clear history between tasks** using `/clear`
- **Use one-shot mode** for simple queries: `claude -p "query"`

### 4. Efficient Queries
Instead of:
```
> explain this entire codebase
```

Use:
```
> explain the authentication module in src/auth
```

## Background Token Usage

### Automatic Operations
- **Haiku generation**: ~1 cent per day
- **Conversation summarization**: During compaction
- **Command processing**: Minimal overhead
- **Total background**: Typically under $0.04 per session

## Cost Estimation

### By Activity Type

#### Low Cost (~$2-4/day)
- Bug fixes
- Code reviews
- Documentation updates
- Simple features

#### Medium Cost (~$5-8/day)
- Feature development
- Refactoring
- Test writing
- Architecture planning

#### High Cost (~$10-15/day)
- Large codebase analysis
- Complex debugging
- Multi-file refactoring
- Extensive code generation

## Enterprise Planning

### Pilot Program
Recommendation: "Start with a small pilot group to establish usage patterns"

1. Select 5-10 developers
2. Monitor for 2 weeks
3. Analyze usage patterns
4. Scale based on results

### Budget Planning
```
Monthly cost per developer = Daily average × Working days
Example: $6 × 22 days = $132/month
```

### Cost Controls
1. Set workspace spend limits
2. Monitor usage weekly
3. Train on efficient usage
4. Share best practices

## Cost Optimization Tips

### 1. Workspace Organization
- Keep relevant files together
- Use .gitignore effectively
- Remove unnecessary files

### 2. Query Optimization
- Be specific in requests
- Target specific files/directories
- Avoid open-ended questions

### 3. Session Management
- Clear between unrelated tasks
- Use compact regularly
- Close sessions when done

### 4. Tool Selection
- Use read-only tools when possible
- Batch related operations
- Avoid unnecessary web fetches

## Monitoring Best Practices

### Daily Monitoring
```bash
# Start of day
> /cost
# Before major task
> /compact
# End of day
> /cost
```

### Weekly Review
1. Check Console for usage trends
2. Identify high-cost operations
3. Share tips with team
4. Adjust practices as needed

## Common Cost Scenarios

### Scenario 1: New Feature Development
- Initial exploration: $2-3
- Implementation: $3-5
- Testing and refinement: $2-3
- **Total**: $7-11

### Scenario 2: Bug Investigation
- Reproduction: $1-2
- Root cause analysis: $2-4
- Fix implementation: $1-2
- **Total**: $4-8

### Scenario 3: Code Review
- File analysis: $1-2
- Suggestions: $1-2
- **Total**: $2-4

## ROI Considerations

When evaluating costs, consider:
- Time saved vs. manual coding
- Reduced debugging time
- Improved code quality
- Knowledge transfer acceleration
- Reduced context switching

Most teams report 2-5x productivity gains, making the investment highly positive.