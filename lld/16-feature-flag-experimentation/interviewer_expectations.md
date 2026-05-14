# Interviewer Expectations: Feature Flag and Experimentation System

## What They Are Testing
- FeatureFlag, Rule, Variant.
- EvaluationContext.
- RuleEvaluator.
- BucketingService using hash(flag_key, user_key).
- FlagRepository or ConfigProvider.
- EvaluationResult with value, variant, reason.

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
CREATE TABLE feature_flags (
    key TEXT PRIMARY KEY,
    enabled BOOLEAN NOT NULL,
    default_value JSONB NOT NULL,
    version INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE flag_rules (
    id BIGSERIAL PRIMARY KEY,
    flag_key TEXT NOT NULL REFERENCES feature_flags(key),
    priority INT NOT NULL,
    attribute TEXT NOT NULL,
    operator TEXT NOT NULL,
    expected_value JSONB NOT NULL,
    return_value JSONB NOT NULL
);
```

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Random rollout changes user experience every request.
- No reason metadata, making debugging impossible.
- Rules not ordered, causing nondeterministic behavior.
- Caching config forever.
- Experiment exposure logged on every evaluation instead of once per user/experiment where required.
