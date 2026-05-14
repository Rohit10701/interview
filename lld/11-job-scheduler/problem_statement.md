# Job Scheduler

## Level
Medium-Hard, 60 minutes

## Common Interview Context
Backend infrastructure, workflow, ads, data platform interviews

## Problem Statement
Design an in-process job scheduler that can schedule one-time and recurring jobs, execute due jobs, retry failed jobs, and avoid duplicate execution.

## Functional Requirements
- Jobs have id, payload, run_at, status, retry count, and max retries.
- Scheduler picks due jobs in priority/time order.
- Support recurring jobs using a simple interval.
- Failed jobs retry with delay until max retries.
- Multiple scheduler workers should not execute the same job at the same time.

## Non-Functional Requirements
- Use a priority queue for in-memory scheduling.
- For DB-backed scheduling, claim jobs atomically.
- Job handlers should be registered by type.
- Execution should be idempotent or guarded by job status.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
