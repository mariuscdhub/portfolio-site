# Universal Error Handling Patterns

## Circuit Breaker Pattern

Prevent cascading failures in distributed systems.

```python
# Conceptual Python Implementation
class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.state = "CLOSED"
        self.failures = 0
        # ... implementation details ...

    def call(self, func):
        if self.state == "OPEN":
            raise Exception("Circuit is OPEN")
        try:
            result = func()
            self.on_success()
            return result
        except Exception:
            self.on_failure()
            raise
```

## Error Aggregation

Collect multiple errors instead of failing on the first one. useful for validation.

```typescript
// Conceptual TypeScript Implementation
class ErrorCollector {
  private errors: Error[] = [];

  add(error: Error) {
    this.errors.push(error);
  }

  throwIfAny() {
    if (this.errors.length > 0) {
      throw new AggregateError(this.errors);
    }
  }
}
```

## Graceful Degradation

Provide fallback functionality when errors occur.

```python
# Conceptual Python Implementation
def with_fallback(primary_func, fallback_func):
    try:
        return primary_func()
    except Exception:
        # Log error
        return fallback_func()
```
