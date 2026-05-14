# Solution Thought Process: Rate Limiter Library

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a reusable rate limiter library that supports multiple algorithms and can be used by services to allow or reject requests by client id.

## 2. Identify Core Components
- RateLimitRule for limit, period, and burst.
- RateLimiter interface or abstract base.
- FixedWindowLimiter, SlidingWindowLogLimiter, TokenBucketLimiter.
- RuleResolver for per-client or per-endpoint configuration.
- Decision object containing allowed, remaining, retry_after_seconds, and reason.

## 3. Design The Main Flow
1. Clarify if this is a library, middleware, or distributed system. For LLD, design the library boundary first.
2. Introduce a RateLimiter interface so the caller is not tied to fixed window.
3. Model configuration as Rule objects rather than hard-coded constants.
4. Return metadata, not just true/false, because callers need rate limit headers and retry behavior.
5. Talk through algorithm trade-offs: fixed window is simple but has boundary bursts, sliding log is accurate but memory heavy, token bucket handles bursts.
6. Inject clock and storage for testability and production substitution.
7. State what changes in Redis: atomic INCR/EXPIRE for fixed window, sorted sets for sliding log, Lua script for token bucket.

## 4. Data Structures And Storage
No SQL is required for the core in-memory library. For distributed production use, store counters in Redis with TTL and keep rules in a config table.

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from dataclasses import dataclass
import threading
import time


@dataclass(frozen=True)
class Rule:
    limit: int
    window_seconds: int
    burst: int | None = None


@dataclass(frozen=True)
class Decision:
    allowed: bool
    remaining: int
    retry_after_seconds: int
    reason: str = ""


class FixedWindowLimiter:
    def __init__(self, rule_resolver, clock=time.time):
        self.rule_resolver = rule_resolver
        self.clock = clock
        self._counts: dict[tuple[str, int], int] = {}
        self._lock = threading.Lock()

    def allow_request(self, client_id: str, endpoint: str) -> Decision:
        rule = self.rule_resolver(client_id, endpoint)
        now = int(self.clock())
        bucket = now // rule.window_seconds
        key = (f"{client_id}:{endpoint}", bucket)
        with self._lock:
            used = self._counts.get(key, 0)
            if used >= rule.limit:
                retry = ((bucket + 1) * rule.window_seconds) - now
                return Decision(False, 0, retry, "limit_exceeded")
            self._counts[key] = used + 1
            return Decision(True, rule.limit - used - 1, 0)
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class Decision {
  constructor({ allowed, remaining, retryAfterSeconds = 0, reason = "" }) {
    Object.assign(this, { allowed, remaining, retryAfterSeconds, reason });
  }
}

class FixedWindowLimiter {
  #counts = new Map();

  constructor({ ruleResolver, clock = () => Date.now() }) {
    this.ruleResolver = ruleResolver;
    this.clock = clock;
  }

  allowRequest(clientId, endpoint) {
    const rule = this.ruleResolver(clientId, endpoint);
    const nowSeconds = Math.floor(this.clock() / 1000);
    const bucket = Math.floor(nowSeconds / rule.windowSeconds);
    const key = `${clientId}:${endpoint}:${bucket}`;
    const used = this.#counts.get(key) ?? 0;
    if (used >= rule.limit) {
      const retryAfterSeconds = (bucket + 1) * rule.windowSeconds - nowSeconds;
      return new Decision({ allowed: false, remaining: 0, retryAfterSeconds, reason: "limit_exceeded" });
    }
    this.#counts.set(key, used + 1);
    return new Decision({ allowed: true, remaining: rule.limit - used - 1 });
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
- Limit of 3 per minute allows first 3 and denies 4th.
- Next bucket resets fixed-window counter.
- Different endpoints have independent limits if config says so.
- Two clients do not share counters.
- Injected clock makes boundary tests deterministic.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
