# Solution Thought Process: Movie Ticket Booking System

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a movie ticket booking module where users browse shows, select seats, temporarily lock seats, pay, and receive confirmed tickets.

## 2. Identify Core Components
- Movie, Theatre, Screen, Seat, Show.
- SeatHold, Booking, Payment.
- SeatInventoryService.
- BookingService with hold, confirm, expire.
- PaymentGateway interface and webhook handler.

## 3. Design The Main Flow
1. Make seat state explicit: available, held, booked. This prevents vague boolean flags.
2. Use short-lived holds for checkout. Do not mark booked before payment succeeds.
3. Hold operation must be atomic for all selected seats. Either all seats are held or none are.
4. Confirm booking only if hold_id matches and hold has not expired.
5. Payment flow should be idempotent because callbacks can retry.
6. In SQL, claim seats with conditional update where status is available or expired hold. Verify row count equals requested seat count.

## 4. Data Structures And Storage
```sql
CREATE TABLE show_seats (
    show_id BIGINT NOT NULL,
    seat_id BIGINT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('AVAILABLE', 'HELD', 'BOOKED')),
    hold_id UUID,
    hold_expires_at TIMESTAMPTZ,
    booking_id UUID,
    PRIMARY KEY (show_id, seat_id)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    user_id BIGINT NOT NULL,
    show_id BIGINT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING_PAYMENT', 'CONFIRMED', 'FAILED', 'EXPIRED')),
    total_cents INT NOT NULL CHECK (total_cents >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from dataclasses import dataclass
from datetime import datetime, timedelta
import uuid


@dataclass
class ShowSeat:
    show_id: str
    seat_id: str
    status: str = "AVAILABLE"
    hold_id: str | None = None
    hold_expires_at: datetime | None = None


class SeatInventoryService:
    def hold(self, seats: list[ShowSeat], now: datetime, ttl_seconds: int = 300) -> str:
        hold_id = str(uuid.uuid4())
        for seat in seats:
            if seat.status == "BOOKED":
                raise ValueError("seat_booked")
            if seat.status == "HELD" and seat.hold_expires_at and seat.hold_expires_at > now:
                raise ValueError("seat_held")
        for seat in seats:
            seat.status = "HELD"
            seat.hold_id = hold_id
            seat.hold_expires_at = now + timedelta(seconds=ttl_seconds)
        return hold_id
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class SeatInventoryService {
  hold(seats, now = new Date(), ttlSeconds = 300) {
    const holdId = crypto.randomUUID();
    for (const seat of seats) {
      if (seat.status === "BOOKED") throw new Error("seat_booked");
      if (seat.status === "HELD" && seat.holdExpiresAt > now) throw new Error("seat_held");
    }
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000);
    for (const seat of seats) {
      seat.status = "HELD";
      seat.holdId = holdId;
      seat.holdExpiresAt = expiresAt;
    }
    return holdId;
  }
}
```

JavaScript interview notes:
- Use `class` when identity and behavior belong together.
- Use `Map` and `Set` instead of plain objects for arbitrary keys.
- Use private fields for internals when it keeps the public API clean.
- If async persistence is involved, make transaction boundaries explicit with `async`/`await`.
- Avoid framework details unless the interviewer asks for Express/Nest/Fastify integration.

## 7. Test Cases To Mention
- Two users try same seat; only one hold succeeds.
- Expired hold can be acquired by another user.
- Payment success confirms held seats.
- Payment failure releases held seats.
- Retrying the same payment callback does not double-confirm.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
