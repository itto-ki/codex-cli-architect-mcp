# Codex CLI Architect MCP

An MCP (Model Context Protocol) server implementation for OpenAI's Codex CLI,
enabling AI-powered coding assistance through standardized tool interfaces.

[![npm version](https://badge.fury.io/js/codex-cli-architect-mcp.svg)](https://www.npmjs.com/package/codex-cli-architect-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Technical Consultation**: Get expert advice on architecture, design
  patterns, and technology choices
- **Code Review**: Comprehensive code quality and security analysis
- **Code Explanation**: Clear explanations of code snippets and programming
  concepts
- **Read-Only File Access**: Can read files in the current workspace (directory and subdirectories)
- **Write Protection**: Uses Codex CLI's read-only sandbox mode to prevent file modifications
- **Sandboxed Execution**: Runs with platform-specific sandboxing (Apple Seatbelt on macOS, Landlock/seccomp on Linux)
- **No Code Modification**: Focuses on analysis and advice, not code generation

## Prerequisites

- Node.js 18+
- [Codex CLI](https://github.com/openai/codex) installed and logged in

## Usage with MCP Clients

### Claude Code

Register the MCP server with Claude Code:

```bash
# Using NPM package
claude mcp add codex -- npx codex-cli-architect-mcp

# With custom model configuration
claude mcp add codex -e CODEX_MODEL=gpt-5 -- npx codex-cli-architect-mcp

# With OpenAI API key
claude mcp add codex -e OPENAI_API_KEY=your-api-key-here -- npx codex-cli-architect-mcp
```

### Other MCP Clients

Configure the MCP server in your client's settings file:

```json
{
    "mcpServers": {
        "codex": {
            "command": "npx",
            "args": ["codex-cli-architect-mcp"],
            "env": {
                "OPENAI_API_KEY": "your-api-key-here",
                "CODEX_MODEL": "gpt-5",
                "CODEX_TIMEOUT": "300000"
            }
        }
    }
}
```

## Available Tools

The MCP server provides the following tools:

1. **codex_consult** - Technical consultation for architecture, design patterns,
   and implementation strategies
2. **codex_review** - Comprehensive code review for quality, security, and best
   practices
3. **codex_explain** - Get clear explanations of code snippets or programming
   concepts

These tools are exposed through the MCP protocol and can be used by any MCP-compatible client.

## Configuration

Environment variables:

- `OPENAI_API_KEY` - OpenAI API key for authentication (optional, uses ChatGPT login if not provided)
- `CODEX_MODEL` - Model to use (default: gpt-5)
- `CODEX_TIMEOUT` - Execution timeout in milliseconds (default: 300000)

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode
npm run dev

# Run tests
npm test
```

## License

MIT
