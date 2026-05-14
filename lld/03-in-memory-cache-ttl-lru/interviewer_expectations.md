# Interviewer Expectations: In-Memory Cache with TTL and LRU Eviction

## What They Are Testing
- CacheEntry containing key, value, expires_at.
- Hash map for key to entry/node.
- Doubly linked list or OrderedDict/Map to maintain recency.
- Clock abstraction.
- EvictionPolicy interface if the interviewer asks for LFU/FIFO follow-up.

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
No SQL. This is intentionally an in-memory data structure LLD. Mention Redis only as production comparison.

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Forgetting that get should update recency.
- Keeping expired entries forever and evicting valid entries before expired entries.
- Not handling update of existing key correctly, causing duplicate nodes in a custom list.
- Using real time directly in tests, making tests flaky.
- Ignoring capacity zero or negative capacity validation.
