# Interviewer Expectations: Movie Ticket Booking System

## What They Are Testing
- Movie, Theatre, Screen, Seat, Show.
- SeatHold, Booking, Payment.
- SeatInventoryService.
- BookingService with hold, confirm, expire.
- PaymentGateway interface and webhook handler.

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

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Holding some seats and failing on others without rollback.
- Keeping database locks open during payment.
- Not expiring held seats.
- Not making payment confirmation idempotent.
- No unique state per show-seat, which allows duplicate booking rows.
