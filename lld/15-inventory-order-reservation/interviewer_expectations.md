# Interviewer Expectations: Inventory and Order Reservation System

## What They Are Testing
- SkuInventory, Reservation, ReservationLine.
- InventoryService.
- ReservationRepository.
- OrderService integration.
- ExpiryJob.

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
CREATE TABLE sku_inventory (
    sku TEXT PRIMARY KEY,
    available_qty INT NOT NULL CHECK (available_qty >= 0),
    reserved_qty INT NOT NULL CHECK (reserved_qty >= 0),
    sold_qty INT NOT NULL CHECK (sold_qty >= 0)
);

CREATE TABLE reservations (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('HELD', 'CONFIRMED', 'CANCELLED', 'EXPIRED')),
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE reservation_lines (
    reservation_id UUID NOT NULL REFERENCES reservations(id),
    sku TEXT NOT NULL REFERENCES sku_inventory(sku),
    qty INT NOT NULL CHECK (qty > 0),
    PRIMARY KEY (reservation_id, sku)
);
```

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Overselling because stock check and decrement are separate.
- Partial reservation for multi-item cart.
- No expiration path for abandoned checkout.
- Confirming expired reservations.
- Not making cancellation/expiry idempotent.
