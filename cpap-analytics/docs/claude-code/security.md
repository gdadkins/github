# Claude Code Security

## Overview

Claude Code implements a tiered permission system balancing power and safety. The security model is designed to protect against both accidental damage and potential security threats.

## Permission System

### Tool Categories

#### 1. Read-Only Tools (No Approval Needed)
- **Glob** - File pattern matching
- **Grep** - Content search
- **LS** - Directory listing
- **Read** - File reading
- **NotebookRead** - Jupyter notebook reading

#### 2. Approval-Required Tools
- **Bash** - Execute shell commands
- **Edit** - Modify existing files
- **Write** - Create new files
- **NotebookEdit** - Modify Jupyter notebooks
- **WebFetch** - Fetch web content

#### 3. Special Tools
- **Agent** - Complex multi-step tasks (uses above tools)

## Security Features

### Prompt Injection Protection
1. **Permission system** requiring explicit approvals
2. **Context-aware analysis** of instructions
3. **Input sanitization** for all commands
4. **Command blocklist** preventing risky operations

### Command Blocklist
Certain web fetch operations are blocked:
- `fetch("data:...` - Data URIs
- `fetch("file:...` - Local file access
- `fetch("javascript:...` - Script execution

### Network Security

#### Required Access
Claude Code requires access to:
- `api.anthropic.com` - Claude API
- `statsig.anthropic.com` - Feature flags
- `sentry.io` - Error reporting

#### Firewall Configuration
For development containers:
```bash
# Custom firewall restricting network access
# Isolation from main system
# Limited to approved endpoints only
```

## Dangerous Mode

For automated/unattended operation:
```bash
claude --dangerously-skip-permissions
```

**WARNING**: This bypasses all security prompts. Use only in:
- Isolated environments
- CI/CD pipelines
- Trusted automation scripts

## Best Practices

### 1. Review Commands
Always review suggested commands before approval:
- Check file paths
- Verify command arguments
- Understand potential impact

### 2. File Operations
- Verify file paths before writes
- Check edit operations for accuracy
- Be cautious with wildcard operations

### 3. Bash Commands
- Avoid piping untrusted content
- Review complex command chains
- Be careful with system modifications

### 4. Web Operations
- Only fetch from trusted sources
- Verify URLs before fetching
- Be cautious with API credentials

## Reporting Security Issues

If you encounter suspicious behavior:
1. Use `/bug` command to report
2. Include detailed description
3. Provide reproduction steps
4. Note any unusual patterns

## Security Configuration

### Restricting Tools
In `.claude/settings.json`:
```json
{
  "allowed-tools": [
    "Read",
    "Grep",
    "LS"
  ],
  "denied-tools": [
    "Bash(rm *)",
    "Write(/etc/*)"
  ]
}
```

### Permission Patterns
```json
{
  "allowed-tools": [
    "Read(*)",           // Allow all reads
    "Edit(*.md)",        // Only edit markdown
    "Bash(npm *)",       // Only npm commands
    "Write(src/*)"       // Only write in src
  ]
}
```

## Enterprise Security

### Deployment Options
1. **Direct API** - Standard security model
2. **Amazon Bedrock** - AWS security controls
3. **Google Vertex AI** - GCP security controls

### Compliance Features
- No data retention on Anthropic servers
- Direct API connections only
- Audit trail via terminal history
- Configurable permissions

## Security Limitations

**Important**: While these protections significantly reduce risk, no system is completely immune to all attacks.

### Known Limitations
1. Cannot prevent all malicious prompts
2. Relies on user vigilance
3. Terminal access implies trust
4. Some operations inherently risky

## Incident Response

If you suspect a security breach:
1. Stop Claude Code immediately
2. Review terminal history
3. Check modified files
4. Report to security team
5. Update permissions

## Security Checklist

- [ ] Review `.claude/settings.json` permissions
- [ ] Limit bash command access
- [ ] Restrict write permissions to necessary directories
- [ ] Regular security audits of allowed tools
- [ ] Monitor for unusual activity
- [ ] Keep Claude Code updated
- [ ] Use deny rules for sensitive paths
- [ ] Document security policies for team