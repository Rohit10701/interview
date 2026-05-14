# Solution Thought Process: Feature Flag and Experimentation System

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a feature flag evaluation module that supports boolean flags, percentage rollout, user targeting rules, and A/B experiment variants.

## 2. Identify Core Components
- FeatureFlag, Rule, Variant.
- EvaluationContext.
- RuleEvaluator.
- BucketingService using hash(flag_key, user_key).
- FlagRepository or ConfigProvider.
- EvaluationResult with value, variant, reason.

## 3. Design The Main Flow
1. Clarify whether this is a config storage problem or an evaluation SDK. For LLD, focus on evaluator.
2. Use ordered rules: first match wins, then fallback to default.
3. Stable bucketing is the key insight. Never use Math.random() or random.choice per request.
4. Return reason metadata such as FLAG_DISABLED, RULE_MATCH, FALLTHROUGH, TARGET_MATCH.
5. Cache flag config with version. Invalidate by polling, push updates, or TTL.
6. Experiments are variants with weighted buckets and exposure logging as a follow-up.

## 4. Data Structures And Storage
```sql
CREATE TABLE feature_flags (
    key TEXT PRIMARY KEY,
    enabled BOOLEAN NOT NULL,
    default_value JSONB NOT NULL,
    version INT NOT NULL DEFAULT 1,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE flag_rules (
    id BIGSERIAL PRIMARY KEY,
    flag_key TEXT NOT NULL REFERENCES feature_flags(key),
    priority INT NOT NULL,
    attribute TEXT NOT NULL,
    operator TEXT NOT NULL,
    expected_value JSONB NOT NULL,
    return_value JSONB NOT NULL
);
```

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
import hashlib


def bucket(flag_key: str, user_key: str) -> int:
    digest = hashlib.sha256(f"{flag_key}:{user_key}".encode()).hexdigest()
    return int(digest[:8], 16) % 100


class PercentageRule:
    def __init__(self, rollout_percent: int, value):
        self.rollout_percent = rollout_percent
        self.value = value

    def evaluate(self, flag_key: str, context: dict):
        user_key = context["user_key"]
        if bucket(flag_key, user_key) < self.rollout_percent:
            return self.value
        return None
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

function bucket(flagKey, userKey) {
  const digest = crypto.createHash("sha256").update(`${flagKey}:${userKey}`).digest("hex");
  return parseInt(digest.slice(0, 8), 16) % 100;
}

class PercentageRule {
  constructor({ rolloutPercent, value }) {
    Object.assign(this, { rolloutPercent, value });
  }

  evaluate(flagKey, context) {
    return bucket(flagKey, context.userKey) < this.rolloutPercent ? this.value : null;
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
- Disabled flag returns default.
- Allowlisted user gets enabled value.
- Same user gets same percentage result repeatedly.
- Increasing rollout from 10 to 20 only adds users, does not reshuffle all users.
- Rule priority determines winner.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
