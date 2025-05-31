# Claude Code Troubleshooting

## Common Installation Issues

### Linux Permission Problems

**Issue**: Permission errors when installing npm packages globally

**Solution**: Create a user-writable npm prefix in home directory

```bash
# Create directory for global packages
mkdir -p ~/.npm-global

# Configure npm to use new directory
npm config set prefix '~/.npm-global'

# Add to PATH in your shell configuration file
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
# or for zsh
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc

# Reload shell configuration
source ~/.bashrc  # or source ~/.zshrc
```

### Installation Verification

Run the doctor command to check installation:
```bash
claude /doctor
```

## Authentication Issues

### General Authentication Problems

If experiencing authentication issues:

1. **Logout and restart**:
   ```bash
   claude
   > /logout
   # Close Claude Code
   # Restart and complete authentication
   ```

2. **Remove authentication file** (if problems persist):
   ```bash
   rm -rf ~/.config/claude-code/auth.json
   ```

3. **Check API key** (for direct API usage):
   ```bash
   echo $ANTHROPIC_API_KEY
   ```

### Session Token Issues

If getting "session expired" errors:
- Use `/login` to re-authenticate
- Check network connectivity
- Verify API access isn't blocked

## Performance and Stability

### High Resource Usage

**Symptoms**: Slow responses, high CPU/memory usage

**Solutions**:
1. **Reduce context size**:
   ```bash
   > /compact
   ```

2. **Clear conversation history**:
   ```bash
   > /clear
   ```

3. **Close and restart** between major tasks

4. **Add to .gitignore**:
   ```
   # Large directories
   node_modules/
   build/
   dist/
   .next/
   ```

### Unresponsive Commands

If Claude Code becomes unresponsive:

1. **Cancel current operation**: Press `Ctrl+C`
2. **Force quit if needed**: Press `Ctrl+C` multiple times
3. **Close terminal and restart** if completely frozen

## Terminal-Specific Issues

### JetBrains Terminal ESC Key Problem

**Issue**: ESC key switches focus instead of working in Claude

**Fix**:
1. Go to Settings → Tools → Terminal
2. Click "Configure terminal keybindings"
3. Find "Switch focus to Editor" 
4. Delete the ESC shortcut

### Windows Terminal Issues

**Copy/Paste problems**:
- Use `Ctrl+Shift+C` to copy
- Use `Ctrl+Shift+V` to paste
- Right-click for paste menu

### WSL Integration

If using WSL:
```bash
# Ensure proper line endings
git config --global core.autocrlf input

# Fix permission issues
chmod +x ~/.npm-global/bin/claude
```

## Tool-Specific Issues

### Bash Tool Timeouts

**Issue**: Commands timing out prematurely

**Solution**: Increase timeout in settings
```json
{
  "BASH_DEFAULT_TIMEOUT_MS": 300000
}
```

### File Access Denied

**Issue**: Cannot read/write certain files

**Solutions**:
1. Check file permissions
2. Verify file path is correct
3. Ensure not trying to access system files
4. Add to allowed-tools in settings

### Web Fetch Failures

**Issue**: Cannot fetch web content

**Check**:
1. Network connectivity
2. Proxy settings
3. Firewall rules
4. URL accessibility

## Configuration Issues

### Settings Not Loading

**Check order**:
1. Local project settings: `.claude/settings.local.json`
2. Project settings: `.claude/settings.json`
3. User settings: `~/.claude/settings.json`

**Validate JSON**:
```bash
# Check for JSON syntax errors
python -m json.tool .claude/settings.json
```

### Environment Variables Not Working

**Ensure proper export**:
```bash
# In .bashrc or .zshrc
export ANTHROPIC_API_KEY="your-key"
export ANTHROPIC_MODEL="claude-3-sonnet"
```

**Verify loaded**:
```bash
claude
> /config
```

## Common Error Messages

### "Model not found"
- Check model name spelling
- Verify model access permissions
- Use `/model` to see available models

### "Rate limit exceeded"
- Wait a few minutes
- Check API usage in console
- Consider workspace limits

### "Context window exceeded"
- Use `/compact` immediately
- Clear unnecessary history
- Break task into smaller parts

### "Permission denied"
- Tool requires approval
- Check allowed-tools settings
- Run with appropriate permissions

## Getting More Help

### 1. Use Built-in Help
```bash
> /help
> /bug  # Report issues
```

### 2. Check Documentation
- Review settings documentation
- Check security guide
- Read tutorials

### 3. Community Resources
- GitHub issues
- Discord community
- Stack Overflow

### 4. Debug Information
Collect for bug reports:
```bash
# Version info
claude --version

# System info
uname -a
node --version
npm --version

# Configuration
claude /config

# Installation check
claude /doctor
```

## Quick Fixes Checklist

- [ ] Run `/doctor` to check installation
- [ ] Try `/compact` for performance issues
- [ ] Use `/clear` to reset conversation
- [ ] Check `.gitignore` for large directories
- [ ] Verify network connectivity
- [ ] Validate JSON in settings files
- [ ] Ensure proper file permissions
- [ ] Update to latest version
- [ ] Restart Claude Code
- [ ] Check terminal compatibility