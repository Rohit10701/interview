# Solution Thought Process: Inventory and Order Reservation System

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design an inventory reservation module where checkout reserves stock, payment confirms it, and abandoned reservations release stock.

## 2. Identify Core Components
- SkuInventory, Reservation, ReservationLine.
- InventoryService.
- ReservationRepository.
- OrderService integration.
- ExpiryJob.

## 3. Design The Main Flow
1. Inventory requires reservation, not direct sold, because checkout and payment are separate.
2. Reserve all SKUs in one transaction. If any SKU is insufficient, reserve none.
3. Lock SKUs in sorted order to reduce deadlock risk.
4. Represent quantities as available, reserved, sold or derive available from stock minus reservations.
5. Expiry job scans held reservations past expires_at and releases them idempotently.
6. Confirmation moves reserved to sold only if reservation is still HELD.

## 4. Data Structures And Storage
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

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
class InventoryService:
    def reserve(self, items: dict[str, int], order_id: str):
        # Production: one DB transaction, lock SKUs in sorted order.
        for sku, qty in sorted(items.items()):
            row = self.inventory_repo.get_for_update(sku)
            if row.available_qty < qty:
                raise ValueError(f"insufficient_stock:{sku}")
        reservation = self.reservation_repo.create(order_id, items)
        for sku, qty in sorted(items.items()):
            row = self.inventory_repo.get_for_update(sku)
            row.available_qty -= qty
            row.reserved_qty += qty
            self.inventory_repo.save(row)
        return reservation
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class InventoryService {
  constructor({ inventoryRepo, reservationRepo }) {
    Object.assign(this, { inventoryRepo, reservationRepo });
  }

  async reserve(items, orderId) {
    const skus = Object.keys(items).sort();
    return this.inventoryRepo.transaction(async (tx) => {
      for (const sku of skus) {
        const row = await tx.getInventoryForUpdate(sku);
        if (row.availableQty < items[sku]) throw new Error(`insufficient_stock:${sku}`);
      }
      const reservation = await tx.createReservation(orderId, items);
      for (const sku of skus) {
        await tx.moveAvailableToReserved(sku, items[sku]);
      }
      return reservation;
    });
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
- Reserve 2 from stock 5 leaves available 3 reserved 2.
- Reserve 6 from stock 5 fails with no mutation.
- Two concurrent reserves for last unit allow one success.
- Expire reservation releases stock.
- Confirm reservation moves reserved to sold.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
