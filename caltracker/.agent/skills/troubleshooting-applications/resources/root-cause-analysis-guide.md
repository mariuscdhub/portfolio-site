# Root Cause Analysis Guide

When the source of an error is not obvious, use these techniques to trace it.

## 1. Binary Search Strategy

**Applicability:** Codebase changes, long logs, or large datasets.

- **Git Bisect:** Find the commit that introduced the bug.
    - `git bisect start`
    - `git bisect bad` (current commit)
    - `git bisect good <commit-sha>` (last known good commit)
- **Comment Out Code:** Systematically comment out half the code to isolate the issue.

## 2. Backward Tracing (Call Stack Analysis)

**Applicability:** Runtime errors, crashes, exceptions.

- **Start:** Identify the error message or crash point.
- **Trace Up:** Look at the function that called the failing code.
- **Inspect Inputs:** What data was passed to the failing function? Was it valid?
- **Repeat:** Follow the data backward until you find where it became invalid.

## 3. Logging & Instrumentation (The "print" method)

**Applicability:** Logic errors, state issues, complex flows.

- **Instrument Boundaries:** Log inputs and outputs at function/module boundaries.
- **Validate Assumptions:** Log values you *think* you know (e.g., `print(f"User ID: {user_id}")`).
- **Trace Execution Path:** Add logs to verify which branches are taken (`print("Entered branch A")`).

## 4. Rubber Duck Debugging

**Applicability:** Stuck, confused, or "it should work but doesn't".

- **Explain Aloud:** explain the code line-by-line to an inanimate object (or write it down).
- **Question Assumptions:** "I *assume* this variable is an integer... let me verify that."
