# 30-Minute Interview Answer: API Key Management And Usage Control

## Time Budget

In a 30-minute interview, the usable design time is closer to 20-22 minutes because intro, reading the prompt, and clarifying scope consume time.

- 0-5 min: clarify scope and constraints.
- 5-10 min: identify entities and services.
- 10-18 min: explain main request flow and data structures.
- 18-24 min: handle concurrency and edge cases.
- 24-30 min: tests, trade-offs, and follow-ups.

Do not try to fully implement creation, rotation, audit logging, scopes, SQL, Redis, and two languages in this slot. Mention the extensions, but keep the core answer focused.

## Clarified Scope

I would first state the narrowed version:

> I will design a monolithic backend module that authenticates an API key and enforces fixed-window hourly and daily request limits per user. Users can have multiple keys, but the usage budget is shared at the user level. I will store only hashed keys. I will handle revoked and expired keys. I will make the counter update atomic so concurrent requests cannot exceed the limit.

Out of scope for the first pass:

- full key rotation flow
- detailed audit pipeline
- distributed Redis implementation
- sliding-window/token-bucket algorithms
- complete JavaScript and Python implementations

Those can be discussed as follow-ups.

## Core Objects

```python
from dataclasses import dataclass
from datetime import datetime, timezone
from enum import Enum
import hashlib
import secrets
import threading


class KeyStatus(Enum):
    ACTIVE = "ACTIVE"
    REVOKED = "REVOKED"


@dataclass(frozen=True)
class Tier:
    name: str
    hourly_limit: int
    daily_limit: int


@dataclass
class ApiKeyRecord:
    id: str
    user_id: str
    key_hash: str
    key_prefix: str
    status: KeyStatus
    expires_at: datetime | None = None
    last_used_at: datetime | None = None
```

## Main Components

- `ApiKeyRepository`: stores and finds API key records by hash.
- `TierService`: returns the user's current tier limits.
- `UsageStore`: atomically checks and increments hourly and daily counters.
- `ApiKeyAuthenticator`: owns the request-time flow.

The important design choice is that rate-limit correctness lives inside `UsageStore`, not in scattered application code.

## Main Request Flow

```python
class ApiKeyAuthenticator:
    def __init__(self, key_repo, tier_service, usage_store):
        self.key_repo = key_repo
        self.tier_service = tier_service
        self.usage_store = usage_store

    def allow_request(self, raw_key: str, now: datetime | None = None) -> bool:
        now = now or datetime.now(timezone.utc)
        key_hash = hashlib.sha256(raw_key.encode()).hexdigest()

        key = self.key_repo.find_by_hash(key_hash)
        if key is None:
            return False
        if key.status != KeyStatus.ACTIVE:
            return False
        if key.expires_at is not None and key.expires_at <= now:
            return False

        tier = self.tier_service.get_tier_for_user(key.user_id)
        allowed = self.usage_store.allow_and_increment(
            user_id=key.user_id,
            now=now,
            hourly_limit=tier.hourly_limit,
            daily_limit=tier.daily_limit,
        )

        if allowed:
            self.key_repo.update_last_used_at(key.id, now)

        return allowed
```

## Atomic Fixed-Window Usage Store

For interview code, an in-memory dictionary plus a lock is enough. In production, this boundary can become Redis Lua or a SQL transaction.

```python
class FixedWindowUsageStore:
    def __init__(self):
        self._counts: dict[tuple[str, str, int], int] = {}
        self._lock = threading.Lock()

    def allow_and_increment(
        self,
        user_id: str,
        now: datetime,
        hourly_limit: int,
        daily_limit: int,
    ) -> bool:
        hour_bucket = int(now.timestamp() // 3600)
        day_bucket = int(now.timestamp() // 86400)
        hour_key = (user_id, "hour", hour_bucket)
        day_key = (user_id, "day", day_bucket)

        with self._lock:
            hour_count = self._counts.get(hour_key, 0)
            day_count = self._counts.get(day_key, 0)

            if hour_count >= hourly_limit or day_count >= daily_limit:
                return False

            self._counts[hour_key] = hour_count + 1
            self._counts[day_key] = day_count + 1
            return True
```

This avoids the common bug where the hourly counter is incremented and then the daily check fails, leaving a partially consumed request.

## API Key Creation

```python
def create_raw_key() -> tuple[str, str, str]:
    raw_key = "sk_" + secrets.token_urlsafe(32)
    key_prefix = raw_key[:10]
    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    return raw_key, key_prefix, key_hash
```

Only `key_hash` and `key_prefix` are stored. The raw key is shown once at creation time.

## Minimal Schema To Mention

```sql
users(id, email, tier_id)
tiers(id, name, hourly_limit, daily_limit, updated_at)
api_keys(id, user_id, key_hash, key_prefix, status, expires_at, revoked_at, created_at, last_used_at)
usage_counters(user_id, window_type, bucket_start, count)
```

For SQL correctness, `usage_counters` should have a unique key on:

```sql
(user_id, window_type, bucket_start)
```

Then the check and increment should happen inside one transaction, locking both the hourly and daily rows before deciding.

## Edge Cases

- Unknown key: deny.
- Revoked key: deny before touching counters.
- Expired key: deny before touching counters.
- Same user with multiple keys: share the same counters because the counter key is `user_id`.
- Tier upgrade: future calls read the current tier from `TierService`; a short TTL cache is acceptable.
- Concurrent requests at `limit - 1`: only one should be allowed.
- Old windows: counters can expire by TTL in Redis or be deleted by cleanup job in SQL.

## Tests To Say Out Loud

- A user with hourly limit 2 gets two allowed requests and the third is denied.
- Two different keys for the same user share the same limit.
- A revoked key is denied and does not consume usage.
- An expired key is denied and does not consume usage.
- Two concurrent requests when only one request remains should allow one and deny one.

## Follow-Ups

If the interviewer gives more time, I would extend this with:

- scopes per API key
- key rotation with old key grace period
- Redis Lua script for atomic distributed counters
- usage audit events through an async queue or outbox
- sliding-window or token-bucket rate limiting
- per-endpoint or per-key rate limits

## JavaScript Mapping If Asked

I would not write a second full implementation in a 30-minute slot. I would explain the mapping:

- Python `dict` becomes JavaScript `Map`.
- Python `set` becomes JavaScript `Set`.
- `datetime` becomes `Date`.
- repositories become async classes if backed by a database.
- the same `UsageStore.allowAndIncrement(...)` boundary must stay atomic.
