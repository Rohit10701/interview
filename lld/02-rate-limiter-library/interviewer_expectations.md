# Interviewer Expectations: Rate Limiter Library

## What They Are Testing
- RateLimitRule for limit, period, and burst.
- RateLimiter interface or abstract base.
- FixedWindowLimiter, SlidingWindowLogLimiter, TokenBucketLimiter.
- RuleResolver for per-client or per-endpoint configuration.
- Decision object containing allowed, remaining, retry_after_seconds, and reason.

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
No SQL is required for the core in-memory library. For distributed production use, store counters in Redis with TTL and keep rules in a config table.

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Only implementing one algorithm after the prompt asks for multiple strategies.
- Forgetting cleanup for old windows, causing unbounded memory growth.
- Returning only boolean instead of retry_after and remaining.
- Not making check plus increment atomic.
- Mixing HTTP request objects into the library and making it hard to reuse.
