# Gotchas And Overlooked Points: In-Memory Cache with TTL and LRU Eviction

## Common Misses
- Forgetting that get should update recency.
- Keeping expired entries forever and evicting valid entries before expired entries.
- Not handling update of existing key correctly, causing duplicate nodes in a custom list.
- Using real time directly in tests, making tests flaky.
- Ignoring capacity zero or negative capacity validation.

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
