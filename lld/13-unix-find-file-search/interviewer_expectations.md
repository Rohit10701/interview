# Interviewer Expectations: Unix Find File Search with Filters

## What They Are Testing
- FileNode with name, size, modified_at, is_directory, children.
- Specification/Filter interface with matches(file).
- AndFilter, OrFilter, NotFilter.
- FileSearcher.
- TraversalStrategy optional follow-up.

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
No SQL for in-memory file tree. If backed by a database, index path, extension, size, and modified_at.

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Creating a separate method for every combination such as findByNameAndSize.
- Applying file-only filters to directories incorrectly.
- Recursive traversal can stack overflow on deep trees.
- Ignoring symlink cycles in real file systems.
- No way to short-circuit AND/OR filters.
