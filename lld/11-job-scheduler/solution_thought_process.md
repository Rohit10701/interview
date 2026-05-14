# Solution Thought Process: Job Scheduler

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design an in-process job scheduler that can schedule one-time and recurring jobs, execute due jobs, retry failed jobs, and avoid duplicate execution.

## 2. Identify Core Components
- Job, JobStatus, JobHandler.
- JobRepository.
- Scheduler loop.
- RetryPolicy.
- HandlerRegistry.
- Clock abstraction.

## 3. Design The Main Flow
1. Clarify in-memory versus persistent scheduler. Most interviewers want both: code in-memory, explain DB production.
2. Use min-heap ordered by run_at for due job selection.
3. Separate scheduling from handling. The scheduler should not know email/payment/business logic.
4. For retries, update attempts and next run_at. When attempts exceed max, mark DEAD.
5. For multiple workers, use claim semantics: update status from SCHEDULED to RUNNING where id matches and status is still SCHEDULED.
6. Recurring jobs can create the next scheduled occurrence after successful execution.

## 4. Data Structures And Storage
```sql
CREATE TABLE jobs (
    id UUID PRIMARY KEY,
    job_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    run_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('SCHEDULED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'DEAD')),
    attempts INT NOT NULL DEFAULT 0,
    max_attempts INT NOT NULL DEFAULT 3,
    locked_by TEXT,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX jobs_due_idx ON jobs (run_at) WHERE status = 'SCHEDULED';
```

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
import heapq
from dataclasses import dataclass, field
from datetime import datetime


@dataclass(order=True)
class ScheduledJob:
    run_at: datetime
    job_id: str = field(compare=False)
    job_type: str = field(compare=False)
    payload: dict = field(compare=False)
    attempts: int = field(default=0, compare=False)


class InMemoryScheduler:
    def __init__(self, handlers):
        self.heap: list[ScheduledJob] = []
        self.handlers = handlers

    def schedule(self, job: ScheduledJob) -> None:
        heapq.heappush(self.heap, job)

    def run_due_once(self, now: datetime) -> int:
        ran = 0
        while self.heap and self.heap[0].run_at <= now:
            job = heapq.heappop(self.heap)
            self.handlers[job.job_type](job.payload)
            ran += 1
        return ran
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class MinHeap {
  constructor(compare) { this.items = []; this.compare = compare; }
  push(item) { this.items.push(item); this.#bubbleUp(this.items.length - 1); }
  peek() { return this.items[0]; }
  pop() {
    if (this.items.length <= 1) return this.items.pop();
    const top = this.items[0];
    this.items[0] = this.items.pop();
    this.#bubbleDown(0);
    return top;
  }
  #bubbleUp(index) { /* standard heap bubble-up */ }
  #bubbleDown(index) { /* standard heap bubble-down */ }
}

class Scheduler {
  constructor({ handlers }) {
    this.handlers = handlers;
    this.heap = new MinHeap((a, b) => a.runAt - b.runAt);
  }

  runDueOnce(now = new Date()) {
    let ran = 0;
    while (this.heap.peek() && this.heap.peek().runAt <= now) {
      const job = this.heap.pop();
      this.handlers.get(job.jobType)(job.payload);
      ran += 1;
    }
    return ran;
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
- Jobs execute in run_at order.
- Future job is not executed early.
- Failure schedules retry with incremented attempts.
- Max attempts moves job to DEAD.
- Two workers cannot claim the same persisted job.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
