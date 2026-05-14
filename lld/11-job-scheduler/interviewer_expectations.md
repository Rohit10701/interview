# Interviewer Expectations: Job Scheduler

## What They Are Testing
- Job, JobStatus, JobHandler.
- JobRepository.
- Scheduler loop.
- RetryPolicy.
- HandlerRegistry.
- Clock abstraction.

## Minimum Strong Answer
- Starts with clarifying scope and choosing the main consistency boundary.
- Identifies the core nouns and separates data objects from services.
- Gives the main happy-path flow before discussing every edge case.
- Names the data structure or SQL transaction that protects correctness.
- Mentions tests that prove the design works.

## Higher-Signal Answer
- Uses small interfaces for volatile choices such as strategy, repository, provider, clock, or payment gateway.
- Makes state transitions explicit instead of allowing arbitrary status mutation.
- Handles retries, idempotency, concurrency, and stale data where the domain needs it.
- Explains one simpler interview version and one production version.
- Knows when not to overuse patterns.

## Data Model / SQL Signal
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    job_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    run_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('SCHEDULED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'DEAD')),
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    locked_by TEXT,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX jobs_due_idx ON jobs (run_at) WHERE status = 'SCHEDULED';
```

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Scanning all jobs every tick instead of using priority ordering.
- No atomic claim, causing duplicate execution.
- Retrying forever without max attempts.
- Losing jobs if process crashes after popping but before executing.
- No idempotency expectation for handlers.
