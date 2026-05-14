# Interviewer Expectations: Meeting Room Reservation System

## What They Are Testing
- Room, Booking, User.
- RoomSearchService.
- BookingService with book and cancel.
- AvailabilityRepository using interval overlap query.
- ConflictDetector function.

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

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Using <= in overlap logic and incorrectly blocking back-to-back meetings.
- Checking availability and inserting booking in separate non-transactional steps.
- Ignoring cancelled bookings in conflict checks.
- Storing local times without timezone normalization.
- Not validating end > start.
