# Solution Thought Process: Ride Matching and Cab Booking

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a ride booking module where riders request rides, nearby available drivers are matched, drivers accept, and trip state is tracked.

## 2. Identify Core Components
- Driver, Rider, Location, RideRequest, Trip.
- DriverLocationIndex.
- MatchingStrategy.
- TripStateMachine.
- DispatchService.

## 3. Design The Main Flow
1. Keep matching strategy separate from trip lifecycle. Distance sorting is enough for MVP.
2. Driver availability is the contention point. Claim driver with compare-and-set: AVAILABLE -> OFFERED.
3. Trip has state transitions and cannot jump from requested to completed.
4. Offer timeout should return driver to AVAILABLE if trip not accepted.
5. Location index can be grid/geohash in production; for LLD, an interface is enough.
6. Acceptance must verify the offered driver is accepting the matching trip.

## 4. Data Structures And Storage
```sql
CREATE TABLE drivers (
    id BIGSERIAL PRIMARY KEY,
    status TEXT NOT NULL CHECK (status IN ('OFFLINE', 'AVAILABLE', 'OFFERED', 'ON_TRIP')),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE trips (
    id UUID PRIMARY KEY,
    rider_id BIGINT NOT NULL,
    driver_id BIGINT REFERENCES drivers(id),
    status TEXT NOT NULL,
    pickup_lat DOUBLE PRECISION NOT NULL,
    pickup_lng DOUBLE PRECISION NOT NULL,
    destination_lat DOUBLE PRECISION NOT NULL,
    destination_lng DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
class MatchingStrategy:
    def candidates(self, pickup, drivers):
        available = [driver for driver in drivers if driver.status == "AVAILABLE"]
        return sorted(available, key=lambda driver: distance(pickup, driver.location))


class DispatchService:
    def __init__(self, driver_repo, trip_repo, matching_strategy):
        self.driver_repo = driver_repo
        self.trip_repo = trip_repo
        self.matching_strategy = matching_strategy

    def offer(self, trip_id: str):
        trip = self.trip_repo.get(trip_id)
        for driver in self.matching_strategy.candidates(trip.pickup, self.driver_repo.all_near(trip.pickup)):
            if self.driver_repo.mark_offered_if_available(driver.id, trip.id):
                trip.driver_id = driver.id
                trip.status = "OFFERED"
                self.trip_repo.save(trip)
                return driver
        raise ValueError("no_driver_available")
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class MatchingStrategy {
  candidates(pickup, drivers) {
    return drivers
      .filter((driver) => driver.status === "AVAILABLE")
      .sort((a, b) => distance(pickup, a.location) - distance(pickup, b.location));
  }
}

class DispatchService {
  constructor({ driverRepo, tripRepo, matchingStrategy }) {
    Object.assign(this, { driverRepo, tripRepo, matchingStrategy });
  }

  async offer(tripId) {
    const trip = await this.tripRepo.get(tripId);
    const nearby = await this.driverRepo.allNear(trip.pickup);
    for (const driver of this.matchingStrategy.candidates(trip.pickup, nearby)) {
      if (await this.driverRepo.markOfferedIfAvailable(driver.id, trip.id)) {
        trip.driverId = driver.id;
        trip.status = "OFFERED";
        await this.tripRepo.save(trip);
        return driver;
      }
    }
    throw new Error("no_driver_available");
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
- Nearest available driver is offered.
- Driver already ON_TRIP is skipped.
- Two ride requests cannot claim same driver.
- Offer timeout releases driver.
- Only assigned driver can accept trip.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
