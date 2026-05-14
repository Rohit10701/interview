# Interviewer Expectations: Multi-Floor Parking Lot

## What They Are Testing
- Vehicle, ParkingSpot, ParkingFloor, ParkingTicket, ParkingLot.
- SpotAllocationStrategy.
- PricingStrategy.
- TicketRepository and SpotRepository for persistence boundary.
- ParkingService for park and unpark use cases.

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
CREATE TABLE parking_spots (
    id BIGSERIAL PRIMARY KEY,
    floor_no INT NOT NULL,
    spot_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE')),
    UNIQUE (floor_no, id)
);

CREATE TABLE parking_tickets (
    id UUID PRIMARY KEY,
    vehicle_no TEXT NOT NULL,
    spot_id BIGINT NOT NULL REFERENCES parking_spots(id),
    entry_time TIMESTAMPTZ NOT NULL,
    exit_time TIMESTAMPTZ,
    amount_cents INT,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'PAID', 'LOST', 'CANCELLED'))
);
```

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Allocating a spot before marking it occupied atomically.
- Putting fee calculation inside Ticket instead of a pricing policy.
- No ticket status, allowing double payment or double exit.
- Not handling lost ticket, maintenance spot, or occupied spot display.
- Overengineering with every possible vehicle before solving happy path.
