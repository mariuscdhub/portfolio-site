---
name: handling-errors
description: Master error handling patterns across languages including exceptions, Result types, error propagation, and graceful degradation to build resilient applications. Use when implementing error handling, designing APIs, or improving application reliability.
---

# Error Handling Patterns

## When to use this skill
- Implementing error handling in new features.
- Designing error-resilient APIs.
- Debugging production issues.
- Improving application reliability.
- Creating better error messages for users and developers.
- Implementing retry and circuit breaker patterns.
- Handling async/concurrent errors.
- Building fault-tolerant distributed systems.

## Workflow
1.  **Identify the Context**: Determine the language (Python, TS, Rust, Go) and the type of error (Recoverable vs Unrecoverable).
2.  **Select the Pattern**: Choose the appropriate pattern (Exception hierarchy, Result type, Circuit Breaker, etc.).
3.  **Implement**: Use the language-specific resource for implementation details.
4.  **Refine**: Apply best practices (Fail Fast, Clean Up, etc.).

## Instructions
- **Consult Language Specifics**: Always check the language-specific guide for idiomatic patterns.
- **Fail Gracefully**: Ensure the application can recover or fail safely.
- **Log Meaningfully**: Errors should provide context for debugging.

## Resources
### Language-Specific Guides
- [Python Patterns](resources/handling-errors-python.md)
- [TypeScript/JavaScript Patterns](resources/handling-errors-typescript.md)
- [Rust Patterns](resources/handling-errors-rust.md)
- [Go Patterns](resources/handling-errors-go.md)

### General Patterns
- [Universal Patterns (Circuit Breaker, Aggregation, Degradation)](resources/universal-patterns.md)
- [Best Practices & Pitfalls](resources/best-practices.md)
