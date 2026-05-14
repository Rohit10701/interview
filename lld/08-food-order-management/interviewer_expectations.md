# Interviewer Expectations: Food Order Management System

## What They Are Testing
- MenuItem, CartItem, Order, OrderItem.
- OrderStateMachine.
- OrderService.
- PricingService.
- NotificationPublisher using Observer/Event pattern.
- IdempotencyStore for checkout.

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
CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id BIGINT NOT NULL,
    restaurant_id BIGINT NOT NULL,
    status TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    total_cents INT NOT NULL CHECK (total_cents >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, idempotency_key)
);

CREATE TABLE order_items (
    order_id UUID NOT NULL REFERENCES orders(id),
    menu_item_id BIGINT NOT NULL,
    item_name_snapshot TEXT NOT NULL,
    unit_price_cents INT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (order_id, menu_item_id)
);
```

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Allowing delivered order to move back to preparing.
- Using current menu price when displaying old orders.
- Sending notifications inside the DB transaction and failing the order if SMS fails.
- No idempotency key for checkout.
- Not distinguishing reject by restaurant from cancel by customer.
