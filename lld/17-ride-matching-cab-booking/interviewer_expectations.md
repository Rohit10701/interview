# Interviewer Expectations: Ride Matching and Cab Booking

## What They Are Testing
- Driver, Rider, Location, RideRequest, Trip.
- DriverLocationIndex.
- MatchingStrategy.
- TripStateMachine.
- DispatchService.

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

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Assigning driver by reading status then updating later without atomic compare.
- No offer timeout.
- Driver accepts an offer that was already cancelled or reassigned.
- Matching scans every driver without acknowledging index.
- Trip cancellation does not release driver.
