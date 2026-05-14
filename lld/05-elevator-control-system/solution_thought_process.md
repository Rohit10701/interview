# Solution Thought Process: Elevator Control System

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design an elevator system for a building with multiple elevators, floor requests, internal cabin requests, direction handling, and scheduling.

## 2. Identify Core Components
- ElevatorCar, Door, Request, Direction, ElevatorState.
- Dispatcher or SchedulerStrategy.
- ElevatorController for accepting requests and advancing time.
- Request queues per elevator, usually separated into up stops and down stops.

## 3. Design The Main Flow
1. Clarify whether you need to optimize scheduling or just model it. For LLD, a simple nearest-car strategy is enough if pluggable.
2. Represent direction and state explicitly. String flags scattered across code are a weak signal.
3. Separate external requests from internal destination requests, then normalize both into stops assigned to cars.
4. Use sorted stops if implementing exact movement order. Sets are fine for skeletons but a TreeSet/heap gives better ordering.
5. Explain what happens on each tick: move one floor, check stop, open door, update direction.
6. Mention safety states: maintenance, overload, emergency stop are follow-ups, not MVP.

## 4. Data Structures And Storage
Usually no SQL in a 45-minute LLD. If persistence is requested, store elevator events and maintenance state, not every tick as a transaction.

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from enum import Enum
from dataclasses import dataclass, field


class Direction(Enum):
    UP = "UP"
    DOWN = "DOWN"
    IDLE = "IDLE"


@dataclass
class ElevatorCar:
    car_id: str
    current_floor: int = 0
    direction: Direction = Direction.IDLE
    up_stops: set[int] = field(default_factory=set)
    down_stops: set[int] = field(default_factory=set)

    def add_stop(self, floor: int) -> None:
        if floor > self.current_floor:
            self.up_stops.add(floor)
            if self.direction is Direction.IDLE:
                self.direction = Direction.UP
        elif floor < self.current_floor:
            self.down_stops.add(floor)
            if self.direction is Direction.IDLE:
                self.direction = Direction.DOWN

    def step(self) -> list[str]:
        events = []
        if self.direction is Direction.UP:
            self.current_floor += 1
            if self.current_floor in self.up_stops:
                self.up_stops.remove(self.current_floor)
                events.append("door_open")
        elif self.direction is Direction.DOWN:
            self.current_floor -= 1
            if self.current_floor in self.down_stops:
                self.down_stops.remove(self.current_floor)
                events.append("door_open")
        if not self.up_stops and not self.down_stops:
            self.direction = Direction.IDLE
        return events
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
const Direction = Object.freeze({ UP: "UP", DOWN: "DOWN", IDLE: "IDLE" });

class ElevatorCar {
  constructor({ carId, currentFloor = 0 }) {
    this.carId = carId;
    this.currentFloor = currentFloor;
    this.direction = Direction.IDLE;
    this.upStops = new Set();
    this.downStops = new Set();
  }

  addStop(floor) {
    if (floor > this.currentFloor) {
      this.upStops.add(floor);
      if (this.direction === Direction.IDLE) this.direction = Direction.UP;
    } else if (floor < this.currentFloor) {
      this.downStops.add(floor);
      if (this.direction === Direction.IDLE) this.direction = Direction.DOWN;
    }
  }

  step() {
    const events = [];
    if (this.direction === Direction.UP) {
      this.currentFloor += 1;
      if (this.upStops.delete(this.currentFloor)) events.push("door_open");
    } else if (this.direction === Direction.DOWN) {
      this.currentFloor -= 1;
      if (this.downStops.delete(this.currentFloor)) events.push("door_open");
    }
    if (this.upStops.size === 0 && this.downStops.size === 0) this.direction = Direction.IDLE;
    return events;
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
- Idle elevator at floor 0 assigned a request at floor 3.
- Elevator moving up serves upward stops in order.
- Duplicate stop opens door once.
- After all stops are served, elevator becomes idle.
- Scheduler chooses nearest idle car among multiple cars.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
