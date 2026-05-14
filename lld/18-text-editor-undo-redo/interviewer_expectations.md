# Interviewer Expectations: Text Editor with Undo and Redo

## What They Are Testing
- TextBuffer.
- Editor.
- Command interface with execute and undo.
- InsertCommand, DeleteCommand.
- UndoStack and RedoStack.

## Minimum Strong Answer
- Starts with clarifying scope and choosing the main consistency boundary.
- Identifies the core nouns and separates data objects from services.
- Gives the main happy-path flow before discussing every edge case.
- Names the data structure or SQL transaction that protects correctness.
- Mentions tests that prove the design works.

## Higher-Signal Answer
- Uses small interfaces for volatile choices such as strategy, repository, provider, clock, or payment gateway.
- Makes state transitions explicit instead of allowing arbitrary status mutation.
- Handles retries, idempotency, concurrency, and stale data where the domain needs it.
- Explains one simpler interview version and one production version.
- Knows when not to overuse patterns.

## Data Model / SQL Signal
No SQL. Optional persistence can store document snapshots plus command history.

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Undo only changes text but not cursor.
- Redo stack not cleared after a new edit.
- Delete command does not store deleted content, so undo is impossible.
- Using immutable full-string copies for every keystroke without acknowledging performance.
- Commands directly mutate editor stacks, mixing responsibilities.
