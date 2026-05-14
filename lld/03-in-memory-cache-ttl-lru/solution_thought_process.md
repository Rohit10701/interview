# Solution Thought Process: In-Memory Cache with TTL and LRU Eviction

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design an in-memory cache that supports get, put, delete, TTL expiry, maximum capacity, and LRU eviction.

## 2. Identify Core Components
- CacheEntry containing key, value, expires_at.
- Hash map for key to entry/node.
- Doubly linked list or OrderedDict/Map to maintain recency.
- Clock abstraction.
- EvictionPolicy interface if the interviewer asks for LFU/FIFO follow-up.

## 3. Design The Main Flow
1. Call out the classic data structure pair: hash map for lookup and recency list for eviction.
2. Clarify TTL semantics: absolute expiry time, lazy deletion on get, and optional cleanup on put.
3. Use OrderedDict in Python and Map insertion order in JS for interview clarity; mention a custom doubly linked list if the interviewer wants from-scratch implementation.
4. On get, expired means miss and removal. Non-expired get must refresh recency.
5. On put, update existing key and move to most recent. Then evict until capacity is valid.
6. Use a lock around compound operations. Even in JS, if used in a multi-worker environment, external synchronization or single-thread ownership is needed.

## 4. Data Structures And Storage
No SQL. This is intentionally an in-memory data structure LLD. Mention Redis only as production comparison.

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from collections import OrderedDict
from dataclasses import dataclass
import threading
import time


@dataclass
class Entry:
    value: object
    expires_at: float | None


class TTLCache:
    def __init__(self, capacity: int, clock=time.time):
        self.capacity = capacity
        self.clock = clock
        self._items: OrderedDict[str, Entry] = OrderedDict()
        self._lock = threading.RLock()

    def get(self, key: str):
        with self._lock:
            entry = self._items.get(key)
            if entry is None:
                return None
            if entry.expires_at is not None and entry.expires_at <= self.clock():
                self._items.pop(key, None)
                return None
            self._items.move_to_end(key)
            return entry.value

    def put(self, key: str, value, ttl_seconds: int | None = None) -> None:
        with self._lock:
            expires_at = None if ttl_seconds is None else self.clock() + ttl_seconds
            self._items[key] = Entry(value, expires_at)
            self._items.move_to_end(key)
            while len(self._items) > self.capacity:
                self._items.popitem(last=False)
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class TTLCache {
  #items = new Map();

  constructor({ capacity, clock = () => Date.now() }) {
    this.capacity = capacity;
    this.clock = clock;
  }

  get(key) {
    const entry = this.#items.get(key);
    if (!entry) return undefined;
    if (entry.expiresAtMs !== null && entry.expiresAtMs <= this.clock()) {
      this.#items.delete(key);
      return undefined;
    }
    this.#items.delete(key);
    this.#items.set(key, entry);
    return entry.value;
  }

  put(key, value, ttlSeconds = null) {
    const expiresAtMs = ttlSeconds === null ? null : this.clock() + ttlSeconds * 1000;
    if (this.#items.has(key)) this.#items.delete(key);
    this.#items.set(key, { value, expiresAtMs });
    while (this.#items.size > this.capacity) {
      const oldestKey = this.#items.keys().next().value;
      this.#items.delete(oldestKey);
    }
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
- put a,b then get a then put c with capacity 2 evicts b.
- Expired key returns miss and is removed.
- Updating an existing key does not increase size.
- TTL update extends expiry.
- Capacity overflow evicts only as many keys as needed.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
