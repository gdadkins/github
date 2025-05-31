# Claude Code Overview

Claude Code is an "agentic coding tool that lives in your terminal, understands your codebase, and helps you code faster through natural language commands."

## Key Capabilities

- **Edit files and fix bugs** across a codebase
- **Answer questions** about code architecture and logic
- **Execute and fix** tests, linting, and other commands
- **Search git history** and manage commits/PRs
- **Browse documentation** via web search

## Installation

```bash
npm install -g @anthropic-ai/claude-code
```

## Unique Features

- **Direct terminal integration** - Works directly in your terminal environment
- **No additional servers required** - Direct API connections only
- **Enterprise-ready** - Supports Amazon Bedrock and Google Vertex AI
- **Security-focused design** - Tiered permission system for safety

## Example Use Cases

```bash
# Ask about authentication system
claude
> how does our authentication system work?

# Create a commit
claude commit

# Fix type errors
claude "fix the type errors in the auth module"
```

## Core Principles

The tool emphasizes:
- Security and safety through permission controls
- Context awareness of your codebase
- Seamless workflow integration
- Natural language interactions

Claude Code is designed to help developers understand and modify code more efficiently through natural language interactions while maintaining security and control.