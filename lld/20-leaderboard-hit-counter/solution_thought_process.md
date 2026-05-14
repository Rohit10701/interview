# Solution Thought Process: Leaderboard and Hit Counter

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a leaderboard service that records score updates, returns top K users, supports user rank lookup, and optionally tracks rolling hit counts.

## 2. Identify Core Components
- ScoreEntry.
- LeaderboardService.
- ScoreStore abstraction.
- RankingPolicy for tie-breaks.
- RollingHitCounter using buckets or deque.

## 3. Design The Main Flow
1. Clarify update volume and rank query volume. Data structure choice depends on this.
2. For a simple machine coding answer, map plus sort is acceptable if you state complexity.
3. For better LLD, introduce ScoreStore so implementation can be Redis sorted set or balanced tree.
4. Tie-breaking should be deterministic: score desc, then earliest update or user_id.
5. Hit counter rolling window can use timestamp buckets: bucket second -> count, evict old buckets.
6. Top K with frequent updates can use sorted set; heap has stale-entry complexity.

## 4. Data Structures And Storage
```sql
CREATE TABLE leaderboard_scores (
    leaderboard_id TEXT NOT NULL,
    user_id BIGINT NOT NULL,
    score BIGINT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (leaderboard_id, user_id)
);

CREATE INDEX leaderboard_score_idx
ON leaderboard_scores (leaderboard_id, score DESC, updated_at ASC);
```

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
class Leaderboard:
    def __init__(self):
        self.scores: dict[str, int] = {}

    def record_score(self, user_id: str, delta: int) -> None:
        self.scores[user_id] = self.scores.get(user_id, 0) + delta

    def top_k(self, k: int) -> list[tuple[str, int]]:
        return sorted(self.scores.items(), key=lambda item: (-item[1], item[0]))[:k]

    def rank(self, user_id: str) -> int | None:
        ordered = self.top_k(len(self.scores))
        for index, (candidate, _) in enumerate(ordered, start=1):
            if candidate == user_id:
                return index
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
class Leaderboard {
  constructor() {
    this.scores = new Map();
  }

  recordScore(userId, delta) {
    this.scores.set(userId, (this.scores.get(userId) ?? 0) + delta);
  }

  topK(k) {
    return [...this.scores.entries()]
      .sort(([userA, scoreA], [userB, scoreB]) => scoreB - scoreA || userA.localeCompare(userB))
      .slice(0, k);
  }

  rank(userId) {
    const ordered = this.topK(this.scores.size);
    const index = ordered.findIndex(([candidate]) => candidate === userId);
    return index === -1 ? null : index + 1;
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
- Scores sort descending.
- Ties sort by user id or defined tie-breaker.
- Rank returns 1 for top user.
- Score delta updates existing user.
- Rolling hit count excludes hits older than window.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
