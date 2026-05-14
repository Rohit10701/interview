# Solution Thought Process: Text Editor with Undo and Redo

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a simple text editor that supports insert, delete, cursor movement, undo, and redo.

## 2. Identify Core Components
- TextBuffer.
- Editor.
- Command interface with execute and undo.
- InsertCommand, DeleteCommand.
- UndoStack and RedoStack.

## 3. Design The Main Flow
1. Use Command pattern: each edit knows how to execute and undo itself.
2. Editor orchestrates stacks; buffer owns text operations.
3. Insert inverse is delete of inserted range. Delete inverse needs to store deleted text.
4. New command after undo clears redo stack.
5. For large documents, mention rope or gap buffer. Do not implement unless asked.
6. Cursor state must be restored by commands if cursor is in scope.

## 4. Data Structures And Storage
No SQL. Optional persistence can store document snapshots plus command history.

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
class InsertCommand:
    def __init__(self, buffer, position: int, text: str):
        self.buffer = buffer
        self.position = position
        self.text = text

    def execute(self):
        self.buffer.insert(self.position, self.text)

    def undo(self):
        self.buffer.delete(self.position, self.position + len(self.text))


class Editor:
    def __init__(self, buffer):
        self.buffer = buffer
        self.undo_stack = []
        self.redo_stack = []

    def apply(self, command):
        command.execute()
        self.undo_stack.append(command)
        self.redo_stack.clear()

    def undo(self):
        command = self.undo_stack.pop()
        command.undo()
        self.redo_stack.append(command)
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class InsertCommand {
  constructor(buffer, position, text) {
    Object.assign(this, { buffer, position, text });
  }
  execute() { this.buffer.insert(this.position, this.text); }
  undo() { this.buffer.delete(this.position, this.position + this.text.length); }
}

class Editor {
  constructor(buffer) {
    this.buffer = buffer;
    this.undoStack = [];
    this.redoStack = [];
  }
  apply(command) {
    command.execute();
    this.undoStack.push(command);
    this.redoStack = [];
  }
  undo() {
    const command = this.undoStack.pop();
    if (!command) return;
    command.undo();
    this.redoStack.push(command);
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
- Insert abc then undo returns empty text.
- Delete b from abc then undo restores abc.
- Undo then redo reapplies change.
- New insert after undo clears redo.
- Cursor returns to expected position after undo.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
