# Solution Thought Process: Multi-Floor Parking Lot

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a parking lot system with multiple floors, different spot types, vehicle types, ticket generation, fee calculation, and real-time availability.

## 2. Identify Core Components
- Vehicle, ParkingSpot, ParkingFloor, ParkingTicket, ParkingLot.
- SpotAllocationStrategy.
- PricingStrategy.
- TicketRepository and SpotRepository for persistence boundary.
- ParkingService for park and unpark use cases.

## 3. Design The Main Flow
1. Avoid starting with inheritance. First identify flows: park, unpark, display availability.
2. Model spot fit rules separately so bus/car/motorcycle logic does not leak everywhere.
3. Use allocation and pricing strategies. This is the main design-pattern signal.
4. Protect spot allocation with a lock or database transaction. The critical section is find spot plus mark occupied.
5. Ticket should be the source of truth for an active parking session.
6. For SQL production, use SELECT FOR UPDATE SKIP LOCKED or an atomic update to claim a spot.

## 4. Data Structures And Storage
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

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from dataclasses import dataclass
from datetime import datetime
import threading
import uuid


@dataclass
class Spot:
    spot_id: str
    spot_type: str
    occupied: bool = False


@dataclass(frozen=True)
class Ticket:
    ticket_id: str
    vehicle_no: str
    spot_id: str
    entry_time: datetime


class FirstAvailableStrategy:
    def find_spot(self, spots, vehicle_type: str) -> Spot | None:
        for spot in spots:
            if not spot.occupied and can_fit(vehicle_type, spot.spot_type):
                return spot
        return None


def can_fit(vehicle_type: str, spot_type: str) -> bool:
    order = {"MOTORCYCLE": 1, "CAR": 2, "LARGE": 3}
    return order[spot_type] >= order[vehicle_type]


class ParkingService:
    def __init__(self, spots: list[Spot], allocation_strategy):
        self.spots = spots
        self.allocation_strategy = allocation_strategy
        self._lock = threading.Lock()

    def park(self, vehicle_no: str, vehicle_type: str, now: datetime) -> Ticket:
        with self._lock:
            spot = self.allocation_strategy.find_spot(self.spots, vehicle_type)
            if spot is None:
                raise ValueError("no_spot_available")
            spot.occupied = True
        return Ticket(str(uuid.uuid4()), vehicle_no, spot.spot_id, now)
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class Spot {
  constructor({ spotId, spotType }) {
    this.spotId = spotId;
    this.spotType = spotType;
    this.occupied = false;
  }
}

const sizeRank = { MOTORCYCLE: 1, CAR: 2, LARGE: 3 };
const canFit = (vehicleType, spotType) => sizeRank[spotType] >= sizeRank[vehicleType];

class FirstAvailableStrategy {
  findSpot(spots, vehicleType) {
    return spots.find((spot) => !spot.occupied && canFit(vehicleType, spot.spotType)) ?? null;
  }
}

class ParkingService {
  constructor({ spots, allocationStrategy, idGenerator }) {
    this.spots = spots;
    this.allocationStrategy = allocationStrategy;
    this.idGenerator = idGenerator;
  }

  park(vehicleNo, vehicleType, now = new Date()) {
    const spot = this.allocationStrategy.findSpot(this.spots, vehicleType);
    if (!spot) throw new Error("no_spot_available");
    spot.occupied = true;
    return { ticketId: this.idGenerator(), vehicleNo, spotId: spot.spotId, entryTime: now };
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
- Car cannot take motorcycle spot if sizing says it does not fit.
- Two entries at the same time cannot get the same spot.
- Exit calculates fee and frees the spot.
- Paid ticket cannot be paid again.
- Availability changes after park and unpark.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
