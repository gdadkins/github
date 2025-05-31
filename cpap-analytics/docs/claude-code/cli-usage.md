# Claude Code CLI Usage

## Interaction Modes

1. **Interactive mode**: Run `claude` to start a REPL session
2. **One-shot mode**: Use `claude -p "query"` for quick commands

## CLI Commands

### Basic Commands
- `claude` - Start interactive REPL
- `claude "query"` - Start REPL with initial prompt
- `claude -p "query"` - Run one-off query and exit
- `claude -c` - Continue most recent conversation
- `claude config` - Configure settings
- `claude update` - Update to latest version

### Important CLI Flags
- `--print` or `-p` - Print response without interactive mode
- `--output-format` - Specify response format (text, json, stream-json)
- `--verbose` - Enable detailed logging
- `--model` - Set session model (e.g., sonnet, opus)
- `--continue` - Load most recent conversation
- `--resume` - Select a specific past conversation to resume

## Slash Commands (Interactive Mode)

- `/bug` - Report bugs
- `/clear` - Clear conversation history
- `/config` - View/modify configuration
- `/cost` - Show token usage
- `/help` - Get usage help
- `/login` - Switch Anthropic accounts
- `/memory` - Edit memory files
- `/model` - Change AI model
- `/review` - Request code review
- `/vim` - Enter Vim editing mode
- `/compact` - Reduce context size
- `/doctor` - Check installation health
- `/logout` - Sign out of current account

## Special Features

### Quick Memory
- Use `#` prefix to quickly add content to memory files
- Example: `# Remember to always use TypeScript strict mode`

### Multiline Input
- Supports multiline commands in interactive mode
- Use appropriate syntax for your shell

### Vim Mode
- Enter with `/vim` command
- Supports subset of Vim keybindings
- Useful for editing longer prompts

### Terminal Configuration
- Configurable line break behavior
- Supports various terminal environments

## SDK Integration

Claude Code can be used programmatically in other applications. The SDK provides methods for:
- Initializing Claude Code sessions
- Sending prompts
- Receiving responses
- Managing conversation state

## Best Practices

1. Use one-shot mode (`-p`) for quick queries
2. Use interactive mode for extended development sessions
3. Leverage slash commands for common operations
4. Keep conversation history manageable with `/clear`
5. Use `/cost` to monitor token usage