# Interviewer Expectations: Leaderboard and Hit Counter

## What They Are Testing
- ScoreEntry.
- LeaderboardService.
- ScoreStore abstraction.
- RankingPolicy for tie-breaks.
- RollingHitCounter using buckets or deque.

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
CREATE TABLE leaderboard_scores (
    leaderboard_id TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    score BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (leaderboard_id, user_id)
);

CREATE INDEX leaderboard_score_idx
ON leaderboard_scores (leaderboard_id, score DESC, updated_at ASC);
```

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- No deterministic tie-breaker.
- Rank by zero-based index when product expects one-based rank.
- Heap stale entries after score updates.
- Sorting whole dataset for every top_k without acknowledging complexity.
- Rolling hit counter keeps all events forever instead of buckets.
