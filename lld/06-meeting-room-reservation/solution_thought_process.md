# Solution Thought Process: Meeting Room Reservation System

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a meeting room booking module where users can search available rooms, reserve a room for a time interval, cancel bookings, and list bookings.

## 2. Identify Core Components
- Room, Booking, User.
- RoomSearchService.
- BookingService with book and cancel.
- AvailabilityRepository using interval overlap query.
- ConflictDetector function.

## 3. Design The Main Flow
1. Clarify the interval convention. Use half-open intervals [start, end) so a meeting ending at 10:00 does not conflict with one starting at 10:00.
2. Search can return candidates based on current data, but final booking must re-check conflict inside a transaction.
3. Model TimeRange as a value object. It makes overlap logic easy to test.
4. In SQL, express conflict as existing.starts_at < requested_end AND requested_start < existing.ends_at.
5. For PostgreSQL, mention exclusion constraints as a strong senior signal.
6. Recurring meetings are a follow-up: generate occurrences and book atomically or store a recurrence rule with exception handling.

## 4. Data Structures And Storage
```sql
CREATE TABLE rooms (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    building TEXT NOT NULL,
    floor_no INT NOT NULL,
    capacity INT NOT NULL CHECK (capacity > 0),
    amenities TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    room_id BIGINT NOT NULL REFERENCES rooms(id),
    user_id BIGINT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('ACTIVE', 'CANCELLED')),
    CHECK (ends_at > starts_at)
);

-- PostgreSQL production option:
-- EXCLUDE USING gist (room_id WITH =, tstzrange(starts_at, ends_at) WITH &&)
-- WHERE (status = 'ACTIVE');
```

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class TimeRange:
    start: datetime
    end: datetime

    def overlaps(self, other: "TimeRange") -> bool:
        return self.start < other.end and other.start < self.end


@dataclass
class Booking:
    booking_id: str
    room_id: str
    user_id: str
    time_range: TimeRange
    status: str = "ACTIVE"


class InMemoryBookingRepository:
    def __init__(self):
        self.bookings: list[Booking] = []

    def has_conflict(self, room_id: str, requested: TimeRange) -> bool:
        return any(
            booking.room_id == room_id
            and booking.status == "ACTIVE"
            and booking.time_range.overlaps(requested)
            for booking in self.bookings
        )
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class TimeRange {
  constructor(start, end) {
    if (end <= start) throw new Error("invalid_time_range");
    this.start = start;
    this.end = end;
  }

  overlaps(other) {
    return this.start < other.end && other.start < this.end;
  }
}

class InMemoryBookingRepository {
  constructor() {
    this.bookings = [];
  }

  hasConflict(roomId, requested) {
    return this.bookings.some((booking) =>
      booking.roomId === roomId &&
      booking.status === "ACTIVE" &&
      booking.timeRange.overlaps(requested)
    );
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
- 10-11 and 11-12 do not overlap.
- 10-11 and 10:30-11:30 overlap.
- Cancelled booking does not block future booking.
- Two concurrent inserts for same room/time result in one success.
- Room search filters by capacity and amenity.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
