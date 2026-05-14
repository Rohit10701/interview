# Solution Thought Process: API Key Management and Usage Control System

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a monolithic backend module that authenticates API keys, enforces hourly and daily usage limits per user, supports subscription tier changes, and works correctly under concurrent requests.

## 2. Identify Core Components
- ApiKey entity, User entity, SubscriptionTier entity, UsageWindow counter.
- ApiKeyService for creation, hashing, rotation, and revocation.
- TierService or SubscriptionRepository for fetching current limits.
- RateLimiter interface with fixed-window or sliding-window implementation.
- UsageStore abstraction backed by in-memory map for interview code and Redis/SQL for production.
- AuthMiddleware that wires authentication, scope check, rate limit, and usage logging.

## 3. Design The Main Flow
1. Start by clarifying whether limits are per user, per key, or per endpoint. The sample says per user, so keep user_id as the counter key.
2. Separate authentication from limiting. A common weak answer mixes API key lookup, counter math, and database writes in one function.
3. Store only key hashes and a display prefix. Return the raw key only at creation time.
4. Use current tier at request time or a short TTL cache. If a user upgrades, the next cache refresh should see the new limits.
5. For a 30-minute interview, fixed windows are acceptable if you mention boundary burst issues. Sliding window or token bucket is a follow-up.
6. Make counter updates atomic. In Redis this is INCR plus EXPIRE or a Lua script; in memory use a lock; in SQL use transactions/upserts.
7. Record usage asynchronously if the interviewer cares about latency, but do not make the core allow/deny decision async and lossy.

## 4. Data Structures And Storage
```sql
CREATE TABLE subscription_tiers (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    hourly_limit INT NOT NULL CHECK (hourly_limit > 0),
    daily_limit INT NOT NULL CHECK (daily_limit > 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    tier_id BIGINT NOT NULL REFERENCES subscription_tiers(id)
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    key_prefix TEXT NOT NULL,
    key_hash TEXT NOT NULL UNIQUE,
    scopes TEXT[] NOT NULL DEFAULT '{}',
    expires_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    revoke_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_used_at TIMESTAMPTZ
);

CREATE TABLE api_usage_events (
    id BIGSERIAL PRIMARY KEY,
    api_key_id UUID NOT NULL REFERENCES api_keys(id),
    user_id BIGINT NOT NULL REFERENCES users(id),
    endpoint TEXT NOT NULL,
    status_code INT NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from dataclasses import dataclass
from datetime import datetime, timezone
import hashlib
import secrets
import threading
from typing import Protocol


@dataclass(frozen=True)
class Tier:
    name: str
    hourly_limit: int
    daily_limit: int


@dataclass(frozen=True)
class ApiKeyRecord:
    key_id: str
    user_id: str
    key_hash: str
    key_prefix: str
    scopes: set[str]
    revoked: bool = False


class KeyRepository(Protocol):
    def find_by_hash(self, key_hash: str) -> ApiKeyRecord | None: ...


class FixedWindowUsageStore:
    def __init__(self):
        self._counts: dict[tuple[str, str, int], int] = {}
        self._lock = threading.Lock()

    def increment_and_check(self, user_id: str, window: str, bucket: int, limit: int) -> bool:
        key = (user_id, window, bucket)
        with self._lock:
            current = self._counts.get(key, 0)
            if current >= limit:
                return False
            self._counts[key] = current + 1
            return True


class ApiKeyMiddleware:
    def __init__(self, keys: KeyRepository, tier_service, usage_store: FixedWindowUsageStore):
        self.keys = keys
        self.tier_service = tier_service
        self.usage_store = usage_store

    def allow(self, raw_key: str, required_scope: str, now: datetime | None = None) -> bool:
        now = now or datetime.now(timezone.utc)
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
        record = self.keys.find_by_hash(key_hash)
        if record is None or record.revoked or required_scope not in record.scopes:
            return False
        tier = self.tier_service.get_tier_for_user(record.user_id)
        hour_bucket = int(now.timestamp() // 3600)
        day_bucket = int(now.timestamp() // 86400)
        return (
            self.usage_store.increment_and_check(record.user_id, "hour", hour_bucket, tier.hourly_limit)
            and self.usage_store.increment_and_check(record.user_id, "day", day_bucket, tier.daily_limit)
        )


def generate_api_key() -> tuple[str, str, str]:
    raw = "sk_live_" + secrets.token_urlsafe(32)
    return raw, raw[:12], hashlib.sha256(raw.encode()).hexdigest()
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
import crypto from "node:crypto";

class FixedWindowUsageStore {
  #counts = new Map();

  incrementAndCheck(userId, windowName, bucket, limit) {
    const key = `${userId}:${windowName}:${bucket}`;
    const current = this.#counts.get(key) ?? 0;
    if (current >= limit) return false;
    this.#counts.set(key, current + 1);
    return true;
  }
}

class ApiKeyMiddleware {
  constructor({ keyRepository, tierService, usageStore }) {
    this.keyRepository = keyRepository;
    this.tierService = tierService;
    this.usageStore = usageStore;
  }

  allow(rawKey, requiredScope, now = new Date()) {
    const keyHash = crypto.createHash("sha256").update(rawKey).digest("hex");
    const record = this.keyRepository.findByHash(keyHash);
    if (!record || record.revoked || !record.scopes.has(requiredScope)) return false;

    const tier = this.tierService.getTierForUser(record.userId);
    const epochSeconds = Math.floor(now.getTime() / 1000);
    const hourBucket = Math.floor(epochSeconds / 3600);
    const dayBucket = Math.floor(epochSeconds / 86400);

    return (
      this.usageStore.incrementAndCheck(record.userId, "hour", hourBucket, tier.hourlyLimit) &&
      this.usageStore.incrementAndCheck(record.userId, "day", dayBucket, tier.dailyLimit)
    );
  }
}

function generateApiKey() {
  const raw = `sk_live_${crypto.randomBytes(32).toString("base64url")}`;
  const keyHash = crypto.createHash("sha256").update(raw).digest("hex");
  return { raw, prefix: raw.slice(0, 12), keyHash };
}
```

JavaScript interview notes:
- Use `class` when identity and behavior belong together.
- Use `Map` and `Set` instead of plain objects for arbitrary keys.
- Use private fields for internals when it keeps the public API clean.
- If async persistence is involved, make transaction boundaries explicit with `async`/`await`.
- Avoid framework details unless the interviewer asks for Express/Nest/Fastify integration.

## 7. Test Cases To Mention
- Free user gets 50 successful hourly requests and the 51st is denied.
- The same user with two keys still shares the same user-level budget.
- A Pro upgrade changes future limits without recreating keys.
- Two concurrent requests at limit - 1 allow only one extra request.
- A revoked key is denied before rate limit checks.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
