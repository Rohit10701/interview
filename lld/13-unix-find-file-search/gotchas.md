# Gotchas And Overlooked Points: Unix Find File Search with Filters

## Common Misses
- Creating a separate method for every combination such as findByNameAndSize.
- Applying file-only filters to directories incorrectly.
- Recursive traversal can stack overflow on deep trees.
- Ignoring symlink cycles in real file systems.
- No way to short-circuit AND/OR filters.

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
