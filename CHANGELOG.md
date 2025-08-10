# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2025-08-10

### Added
- Support for OpenAI API key authentication via `OPENAI_API_KEY` environment variable
- Ability to use pay-as-you-go billing instead of ChatGPT Plus login
- Enhanced logging to show whether API key authentication is being used

### Changed
- Updated documentation with API key configuration examples

## [0.1.0] - 2025-08-10

### Added
- Initial release of codex-cli-architect-mcp
- Three powerful AI-powered tools:
  - **Code Review Tool** (`codex_review`) - Perform comprehensive code reviews focusing on security, performance, readability, and best practices
  - **Code Explanation Tool** (`codex_explain`) - Get clear explanations of code snippets or programming concepts
  - **Technical Consultation Tool** (`codex_consult`) - Receive expert advice on architecture decisions, design patterns, and technology choices
- Integration with OpenAI Codex CLI using `--full-auto` and `--sandbox read-only` modes
- Full Model Context Protocol (MCP) server implementation
- TypeScript implementation with complete type safety
- Comprehensive test suite with Vitest
- Support for custom AI models via environment variables
- Structured logging with Winston
- Zod schema validation for all tool inputs

### Technical Details
- Built with MCP SDK for seamless integration with AI assistants
- Uses union types for type-safe tool handling
- Implements proper error handling and timeout management
- Supports file path specifications and context-aware code analysis