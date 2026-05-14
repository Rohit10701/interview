# Interviewer Expectations: API Key Management and Usage Control System

## What They Are Testing
- ApiKey entity, User entity, SubscriptionTier entity, UsageWindow counter.
- ApiKeyService for creation, hashing, rotation, and revocation.
- TierService or SubscriptionRepository for fetching current limits.
- RateLimiter interface with fixed-window or sliding-window implementation.
- UsageStore abstraction backed by in-memory map for interview code and Redis/SQL for production.
- AuthMiddleware that wires authentication, scope check, rate limit, and usage logging.

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
CREATE TABLE subscription_tiers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    hourly_limit INT NOT NULL CHECK (hourly_limit > 0),
    daily_limit INT NOT NULL CHECK (daily_limit > 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    tier_id BIGINT NOT NULL REFERENCES subscription_tiers(id)
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    key_prefix TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revoke_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_used_at TIMESTAMPTZ
);

CREATE TABLE api_usage_events (
    id BIGSERIAL PRIMARY KEY,
    api_key_id UUID NOT NULL REFERENCES api_keys(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    endpoint TEXT NOT NULL,
    status_code INT NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Using remaining counters instead of window buckets makes resets and concurrent updates harder to reason about.
- Incrementing hourly and daily counters separately can partially consume one counter if the second check fails. A senior answer calls this out and uses atomic multi-key logic in production.
- Caching tier limits forever breaks dynamic tier changes.
- Storing the raw API key is a security failure.
- Forgetting key revocation, expiry, rotation, and scopes makes the system look like a toy.
