# Gotchas And Overlooked Points: Leaderboard and Hit Counter

## Common Misses
- No deterministic tie-breaker.
- Rank by zero-based index when product expects one-based rank.
- Heap stale entries after score updates.
- Sorting whole dataset for every top_k without acknowledging complexity.
- Rolling hit counter keeps all events forever instead of buckets.

## Questions Interviewers May Ask
- What breaks if two requests happen at the same time?
- What state transitions are invalid?
- What should be stored versus derived?
- What happens on retry, timeout, cancellation, or partial failure?
- Which part would you replace first for production scale?

## How To Recover If You Miss Something
- Say the missing case out loud as soon as you notice it.
- Add a focused invariant, for example: "one active booking per room interval" or "wallet balance cannot go negative".
- Put the invariant in the right place: database constraint, lock, state machine, strategy, or test.
- Do not rewrite the whole design. Patch the design with the smallest responsible component.

## Quick Self-Check
- Can I name the aggregate/root object?
- Can I name the critical operation?
- Can I state the invariant in one sentence?
- Can I show where concurrency is controlled?
- Can I write 3 useful tests without needing a full framework?
