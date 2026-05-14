# Standard LLD Answer Template

Use this structure when answering any problem in this pack.

## 1. Clarify
- Restate the problem in one sentence.
- Ask 2-4 scope questions.
- State assumptions if the interviewer says "you decide".
- Identify the critical correctness invariant.

## 2. Requirements
- Functional requirements: what the system must do.
- Non-functional requirements: concurrency, latency, consistency, extensibility.
- Out of scope: what you will not solve in the first version.

## 3. Core Model
- Entities/value objects.
- Services/use-case classes.
- Repositories/storage boundaries.
- Strategies/policies for replaceable logic.
- Events if side effects should be asynchronous.

## 4. Data Structures Or SQL
- In-memory maps, heaps, queues, linked lists, sets, graphs, or trees.
- SQL tables, keys, constraints, indexes, and transaction boundaries where relevant.
- Explain why the chosen structure protects the invariant.

## 5. Main Flow
- Write pseudocode for the most important operation.
- Show validation, state transition, storage update, and response.
- Keep side effects like notification/payment/logging behind interfaces.

## 6. Concurrency And Failure
- Atomic check-and-set, lock, transaction, unique constraint, row lock, compare-and-swap, or Redis script.
- Idempotency key for retried client calls.
- Retry/backoff only for safe operations.
- Timeout/expiry/cancellation behavior.

## 7. Tests
- Happy path.
- Boundary/validation.
- Concurrency conflict.
- Idempotency/retry.
- State transition edge case.

## 8. Trade-Offs
- Simple interview version.
- Production version.
- What changes if scale increases 10x?
