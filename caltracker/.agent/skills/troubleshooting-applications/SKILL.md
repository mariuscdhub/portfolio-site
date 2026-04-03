---
name: troubleshooting-applications
description: Use when encountering any bug, test failure, or unexpected behavior. Enforces finding the root cause before attempting fixes.
---

# Troubleshooting Applications

## When to use this skill
- Test failures.
- Bugs in production.
- Unexpected behavior.
- Performance problems.
- Build failures.
- Integration issues.

## The Iron Law

> **NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST**

If you haven't completed Phase 1, you cannot propose fixes. Symptom fixes are failure.

## Workflow (The 4 Phases)

You MUST complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation
**Goal:** Understand WHAT is broken and WHY.
1.  **Read Error Messages Carefully**: Don't skip stack traces.
2.  **Reproduce Consistently**: Can you trigger it reliably? What are the steps?
3.  **Check Recent Changes**: What changed recently? (Git diff, config).
4.  **Gather Evidence**: Add logging to trace data flow.
5.  **Trace Data Flow**: Use the `root-cause-tracing.md` guide.

### Phase 2: Pattern Analysis
**Goal:** Understand how it *should* work.
1.  **Find Working Examples**: Compare against similar working code.
2.  **Compare Against References**: Read documentation/specs.
3.  **Identify Differences**: List every difference between working and broken.

### Phase 3: Hypothesis and Testing
**Goal:** Form a single theory and test it minimally.
1.  **Form Single Hypothesis**: "I think X is the cause because Y". Use the `debugging-log_template.md`.
2.  **Test Minimally**: Change one variable at a time.
3.  **Verify**: Did the test confirm the hypothesis?

### Phase 4: Implementation
**Goal:** Fix the root cause, not the symptom.
1.  **Create Failing Test Case**: Use `test-driven-development` if available.
2.  **Implement Single Fix**: Address the root cause.
3.  **Verify Fix**: Ensure the test passes and no regressions.
4.  **Stop if 3+ Fixes Fail**: If you try 3 fixes and they fail, **STOP**. Question the architecture.

## Instructions
- **Don't Guess**: Random fixes waste time.
- **Scientific Method**: Observe -> Hypothesize -> Test -> Conclude.
- **Document**: Keep a log of what you tried.

## Resources
- [Debugging Log Template](resources/debugging-log_template.md)
- [Root Cause Analysis Guide](resources/root-cause-analysis-guide.md)
