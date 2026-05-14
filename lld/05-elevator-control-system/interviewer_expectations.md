# Interviewer Expectations: Elevator Control System

## What They Are Testing
- ElevatorCar, Door, Request, Direction, ElevatorState.
- Dispatcher or SchedulerStrategy.
- ElevatorController for accepting requests and advancing time.
- Request queues per elevator, usually separated into up stops and down stops.

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
Usually no SQL in a 45-minute LLD. If persistence is requested, store elevator events and maintenance state, not every tick as a transaction.

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Treating all requests as FIFO, causing absurd elevator movement.
- No direction model, so the elevator reverses too often.
- Duplicate floor requests creating duplicate stops or repeated door opens.
- Ignoring idle elevators and request assignment.
- Trying to solve global optimization before basic behavior works.
