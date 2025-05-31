# Claude Code Documentation

This directory contains a local copy of the Claude Code documentation, crawled from the official Anthropic documentation site.

## Contents

- **[Overview](overview.md)** - Introduction, installation, and key features
- **[CLI Usage](cli-usage.md)** - Commands, flags, and interaction modes
- **[Memory Management](memory.md)** - Project and user memory configuration
- **[Settings](settings.md)** - Configuration options and permissions
- **[Security](security.md)** - Permission system and safety features
- **[Costs](costs.md)** - Pricing and usage optimization
- **[Tutorials](tutorials.md)** - Common workflows and examples
- **[Troubleshooting](troubleshooting.md)** - Common issues and solutions
- **[Index](index.json)** - Structured documentation index

## Quick Start

### Installation
```bash
npm install -g @anthropic-ai/claude-code
```

### Basic Usage
```bash
# Start interactive mode
claude

# One-shot query
claude -p "explain this function"

# Continue last conversation
claude -c
```

### Key Commands
- `/help` - Get help
- `/cost` - Check token usage
- `/compact` - Reduce context size
- `/clear` - Clear conversation
- `/config` - View settings

## Documentation Source

This documentation was crawled from: https://docs.anthropic.com/en/docs/claude-code

Last updated: 2025-01-28

## Using This Documentation

The documentation is organized by topic area. Each markdown file contains comprehensive information about its subject. The `index.json` file provides a structured overview of all documentation sections and can be used programmatically to navigate the docs.

For the most up-to-date information, always refer to the official documentation at https://docs.anthropic.com/en/docs/claude-code