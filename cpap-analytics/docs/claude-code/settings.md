# Claude Code Settings

## Configuration Hierarchy

Settings are loaded in order of precedence:
1. **User settings** in `~/.claude/settings.json` - Apply globally
2. **Project settings** in `.claude/settings.json` - Shared with team
3. **Local project settings** in `.claude/settings.local.json` - Project-specific, not version controlled
4. **Managed policy settings** - For enterprise deployments

## Configuration Management

### Using `claude config` Commands
- View current settings: `claude config`
- Set a setting: `claude config set <key> <value>`
- Use global flag: `claude config set -g <key> <value>`

### Key Configuration Options

#### General Settings
- `autoUpdaterStatus` - Control automatic updates
- `preferredNotifChannel` - Notification preferences
- `theme` - UI theme selection
- `verbose` - Enable detailed logging

#### Model Settings
- `ANTHROPIC_MODEL` - Default model selection
- `ANTHROPIC_MAX_TOKENS` - Maximum response tokens

#### Tool Settings
- `BASH_DEFAULT_TIMEOUT_MS` - Bash command timeout
- `BASH_DISABLED` - Disable bash tool
- `SEARCH_DISABLED` - Disable search capabilities

## Permissions Management

### Tool Permissions
Control which tools Claude can use without approval:

```json
{
  "allowed-tools": [
    "Tool(specifier)",
    "Bash(ls)",
    "Edit(*.md)"
  ]
}
```

### Permission Rules
- **"Allow" rules** - Permit tool usage without approval
- **"Deny" rules** - Block specific tools entirely
- Format: `Tool(optional-specifier)`

### Examples
```json
{
  "allowed-tools": [
    "Read",           // Allow all file reads
    "Bash(npm test)", // Allow only npm test command
    "Edit(*.json)",   // Allow editing JSON files only
    "Write(/tmp/*)"   // Allow writing to /tmp directory
  ]
}
```

## Environment Variables

### Authentication
- `ANTHROPIC_API_KEY` - API key for authentication
- `ANTHROPIC_BASE_URL` - Custom API endpoint

### Tool Configuration
- `BASH_DEFAULT_TIMEOUT_MS` - Default: 120000 (2 minutes)
- `BASH_MAX_TIMEOUT_MS` - Maximum: 600000 (10 minutes)
- `GLOB_IGNORE_PATTERNS` - Patterns to ignore in file searches

### Feature Flags
- `DISABLE_TELEMETRY` - Disable usage analytics
- `DISABLE_AUTO_UPDATE` - Disable automatic updates
- `UNIFIED_DIFF_FORMAT` - Use unified diff format

## Creating Settings Files

### User Settings (`~/.claude/settings.json`)
```json
{
  "theme": "dark",
  "verbose": false,
  "autoUpdaterStatus": "enabled",
  "allowed-tools": ["Read", "Grep", "LS"]
}
```

### Project Settings (`.claude/settings.json`)
```json
{
  "ANTHROPIC_MODEL": "claude-3-sonnet",
  "BASH_DEFAULT_TIMEOUT_MS": 300000,
  "allowed-tools": [
    "Read",
    "Write(src/*)",
    "Edit(src/*)",
    "Bash(npm *)",
    "Bash(yarn *)"
  ]
}
```

### Local Settings (`.claude/settings.local.json`)
```json
{
  "ANTHROPIC_API_KEY": "your-personal-key",
  "verbose": true
}
```

## Recommended Setup

### 1. Create User-Writable npm Prefix
```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### 2. Configure Terminal
- Use a terminal with good Unicode support
- Enable 256-color mode
- Configure appropriate fonts

### 3. Team Configuration
Create `.claude/settings.json` in your project:
```json
{
  "ANTHROPIC_MODEL": "claude-3-sonnet",
  "allowed-tools": [
    "Read",
    "Grep",
    "LS",
    "Edit(src/*)",
    "Write(src/*)",
    "Bash(npm run *)"
  ]
}
```

## Security Considerations

1. Never commit `.claude/settings.local.json`
2. Don't store API keys in shared settings
3. Be careful with tool permissions
4. Review allowed bash commands regularly
5. Use deny rules for sensitive operations

## Best Practices

1. Start with restrictive permissions
2. Add allowed tools as needed
3. Use project settings for team standards
4. Keep local settings for personal preferences
5. Document custom settings in README