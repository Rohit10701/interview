# Solution Thought Process: Spreadsheet Formula Engine

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a spreadsheet core that stores cell values and formulas, evaluates dependencies, and updates dependent cells when a cell changes.

## 2. Identify Core Components
- CellAddress, Cell.
- FormulaParser.
- DependencyGraph with edges from dependency to dependent.
- Evaluator.
- Spreadsheet service.

## 3. Design The Main Flow
1. Scope formula grammar aggressively. State you support references, plus, and SUM range first.
2. Parse formula to dependencies. Do not use string search spread across evaluator.
3. Maintain dependency graph in both directions: dependencies and dependents.
4. When cell changes, replace its dependencies, detect cycles, then recompute affected dependents in topological order.
5. Cache computed values for fast get_cell.
6. Cycle detection is mandatory: A1 depends on B1 and B1 depends on A1 should be rejected.

## 4. Data Structures And Storage
```sql
CREATE TABLE sheets (
    id UUID PRIMARY KEY,
    owner_id BIGINT NOT NULL,
    name TEXT NOT NULL
);

CREATE TABLE cells (
    sheet_id UUID NOT NULL REFERENCES sheets(id),
    address TEXT NOT NULL,
    raw_input TEXT NOT NULL,
    computed_value NUMERIC,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (sheet_id, address)
);
```

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from collections import defaultdict, deque


class DependencyGraph:
    def __init__(self):
        self.dependents = defaultdict(set)
        self.dependencies = defaultdict(set)

    def replace_dependencies(self, cell: str, deps: set[str]) -> None:
        for old in self.dependencies[cell]:
            self.dependents[old].discard(cell)
        self.dependencies[cell] = deps
        for dep in deps:
            self.dependents[dep].add(cell)
        self._ensure_no_cycle()

    def affected_cells(self, cell: str) -> list[str]:
        result, queue = [], deque([cell])
        seen = {cell}
        while queue:
            current = queue.popleft()
            for nxt in self.dependents[current]:
                if nxt not in seen:
                    seen.add(nxt)
                    result.append(nxt)
                    queue.append(nxt)
        return result
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class DependencyGraph {
  constructor() {
    this.dependents = new Map();
    this.dependencies = new Map();
  }

  replaceDependencies(cell, deps) {
    for (const oldDep of this.dependencies.get(cell) ?? []) {
      this.dependents.get(oldDep)?.delete(cell);
    }
    this.dependencies.set(cell, new Set(deps));
    for (const dep of deps) {
      if (!this.dependents.has(dep)) this.dependents.set(dep, new Set());
      this.dependents.get(dep).add(cell);
    }
    this.ensureNoCycle();
  }

  affectedCells(cell) {
    const queue = [cell];
    const seen = new Set([cell]);
    const result = [];
    while (queue.length > 0) {
      const current = queue.shift();
      for (const next of this.dependents.get(current) ?? []) {
        if (!seen.has(next)) {
          seen.add(next);
          result.push(next);
          queue.push(next);
        }
      }
    }
    return result;
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
- A1=1, B1=A1+2 gives B1=3.
- Changing A1 updates B1.
- Changing B1 formula removes old dependency on A1.
- A1=B1 and B1=A1 is rejected.
- SUM(A1:A3) updates when A2 changes.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
