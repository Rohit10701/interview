# Solution Thought Process: Food Order Management System

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design an order management module for a food delivery platform that accepts cart checkout, routes order status changes, and notifies customers and restaurants.

## 2. Identify Core Components
- MenuItem, CartItem, Order, OrderItem.
- OrderStateMachine.
- OrderService.
- PricingService.
- NotificationPublisher using Observer/Event pattern.
- IdempotencyStore for checkout.

## 3. Design The Main Flow
1. Make Order aggregate own status. Keep menu, pricing, payment, and notification as collaborators.
2. Capture item name and price snapshots because menus change after checkout.
3. Use a state machine table/map rather than many scattered if statements.
4. On checkout, use an idempotency key so duplicate client retries return the same order.
5. Publish domain events after commit. In a full system use an outbox pattern.
6. Restaurant rejection and cancellation need refund/payment follow-up, but MVP can emit events.

## 4. Data Structures And Storage
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

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
class OrderStateMachine:
    allowed = {
        "PLACED": {"ACCEPTED", "REJECTED", "CANCELLED"},
        "ACCEPTED": {"PREPARING", "CANCELLED"},
        "PREPARING": {"READY", "CANCELLED"},
        "READY": {"PICKED_UP"},
        "PICKED_UP": {"DELIVERED"},
        "DELIVERED": set(),
        "REJECTED": set(),
        "CANCELLED": set(),
    }

    def transition(self, current: str, target: str) -> str:
        if target not in self.allowed[current]:
            raise ValueError(f"invalid_transition:{current}->{target}")
        return target


class OrderService:
    def __init__(self, repository, state_machine, event_bus):
        self.repository = repository
        self.state_machine = state_machine
        self.event_bus = event_bus

    def update_status(self, order_id: str, target_status: str):
        order = self.repository.get(order_id)
        order.status = self.state_machine.transition(order.status, target_status)
        self.repository.save(order)
        self.event_bus.publish("order.status_changed", order)
        return order
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class OrderStateMachine {
  allowed = new Map([
    ["PLACED", new Set(["ACCEPTED", "REJECTED", "CANCELLED"])],
    ["ACCEPTED", new Set(["PREPARING", "CANCELLED"])],
    ["PREPARING", new Set(["READY", "CANCELLED"])],
    ["READY", new Set(["PICKED_UP"])],
    ["PICKED_UP", new Set(["DELIVERED"])],
    ["DELIVERED", new Set()],
    ["REJECTED", new Set()],
    ["CANCELLED", new Set()],
  ]);

  transition(current, target) {
    if (!this.allowed.get(current).has(target)) {
      throw new Error(`invalid_transition:${current}->${target}`);
    }
    return target;
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
- PLACED -> ACCEPTED -> PREPARING is valid.
- DELIVERED -> CANCELLED is invalid.
- Menu price change does not change existing order item price.
- Duplicate checkout idempotency key returns same order.
- Status change publishes an event.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
