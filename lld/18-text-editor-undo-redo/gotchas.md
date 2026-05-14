# Gotchas And Overlooked Points: Text Editor with Undo and Redo

## Common Misses
- Undo only changes text but not cursor.
- Redo stack not cleared after a new edit.
- Delete command does not store deleted content, so undo is impossible.
- Using immutable full-string copies for every keystroke without acknowledging performance.
- Commands directly mutate editor stacks, mixing responsibilities.

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
