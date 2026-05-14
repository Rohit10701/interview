# Gotchas And Overlooked Points: Multi-Floor Parking Lot

## Common Misses
- Allocating a spot before marking it occupied atomically.
- Putting fee calculation inside Ticket instead of a pricing policy.
- No ticket status, allowing double payment or double exit.
- Not handling lost ticket, maintenance spot, or occupied spot display.
- Overengineering with every possible vehicle before solving happy path.

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
