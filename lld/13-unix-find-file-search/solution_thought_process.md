# Solution Thought Process: Unix Find File Search with Filters

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a file search utility similar to Unix find that can traverse a file tree and filter files by name, extension, size, modified time, and boolean combinations of filters.

## 2. Identify Core Components
- FileNode with name, size, modified_at, is_directory, children.
- Specification/Filter interface with matches(file).
- AndFilter, OrFilter, NotFilter.
- FileSearcher.
- TraversalStrategy optional follow-up.

## 3. Design The Main Flow
1. This problem tests composition more than file APIs. Do not spend time on OS-specific system calls.
2. Represent every predicate as a Filter/Specification with matches(node).
3. Compose filters recursively: And, Or, Not are themselves filters.
4. Traversal should not know filter internals. It only calls matches.
5. For large trees, return an iterator/generator instead of materializing all results.
6. Mention symbolic links and cycles as real file-system follow-ups.

## 4. Data Structures And Storage
No SQL for in-memory file tree. If backed by a database, index path, extension, size, and modified_at.

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from dataclasses import dataclass, field
from typing import Protocol


@dataclass
class FileNode:
    name: str
    size: int
    is_dir: bool = False
    children: list["FileNode"] = field(default_factory=list)


class Filter(Protocol):
    def matches(self, node: FileNode) -> bool: ...


class ExtensionFilter:
    def __init__(self, extension: str):
        self.extension = extension

    def matches(self, node: FileNode) -> bool:
        return not node.is_dir and node.name.endswith(self.extension)


class AndFilter:
    def __init__(self, *filters: Filter):
        self.filters = filters

    def matches(self, node: FileNode) -> bool:
        return all(filter_.matches(node) for filter_ in self.filters)
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class ExtensionFilter {
  constructor(extension) { this.extension = extension; }
  matches(node) { return !node.isDir && node.name.endsWith(this.extension); }
}

class AndFilter {
  constructor(...filters) { this.filters = filters; }
  matches(node) { return this.filters.every((filter) => filter.matches(node)); }
}

class FileSearcher {
  search(root, filter) {
    const result = [];
    const stack = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (filter.matches(node)) result.push(node);
      if (node.isDir) stack.push(...node.children);
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
- Extension filter returns only .txt files.
- AND filter combines extension and min size.
- OR filter matches either condition.
- NOT filter excludes hidden files.
- Search traverses nested directories.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
