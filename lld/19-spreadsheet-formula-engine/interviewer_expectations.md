# Interviewer Expectations: Spreadsheet Formula Engine

## What They Are Testing
- CellAddress, Cell.
- FormulaParser.
- DependencyGraph with edges from dependency to dependent.
- Evaluator.
- Spreadsheet service.

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
CREATE TABLE sheets (
    id UUID PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE cells (
    sheet_id UUID NOT NULL REFERENCES sheets(id),
    address TEXT NOT NULL,
    raw_input TEXT NOT NULL,
    computed_value NUMERIC,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (sheet_id, address)
);
```

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Recomputing every cell on each change.
- Not removing old dependencies when formula changes.
- No cycle detection.
- Parsing ranges incorrectly or expanding huge ranges without limits.
- Using queue.shift in JS for huge queues without noting it can be O(n); use index pointer if needed.
