# Code Quality Recap For LLD Interviews

## What A Standard Answer Looks Like
A standard LLD answer is not just classes. It is a small working model with clear ownership:
- Entities hold domain data and small domain behavior.
- Services orchestrate use cases.
- Repositories hide storage.
- Strategies hide replaceable algorithms.
- State machines protect lifecycle transitions.
- Tests prove invariants.

## Junior-Looking Signals To Avoid
- One giant class that does validation, storage, pricing, notification, and formatting.
- Random strings for statuses without validation.
- No thought about concurrent requests.
- No idempotency for payment/order/wallet style problems.
- Only happy path, no cancellation/expiry/retry.
- Using floats for money.
- Hard-coding limits, prices, providers, or algorithms.
- Writing code before naming the main invariant.

## Strong 2.5-3 Year Signals
- You explain the first version and the production version separately.
- You use value objects for concepts like `TimeRange`, `Money`, `Location`, and `Rule`.
- You use interfaces for volatile dependencies: payment gateway, notification provider, repository, clock, ID generator.
- You use strategy only where the problem has real variation.
- You use explicit states and reject invalid transitions.
- You name the concurrency control: lock, transaction, unique constraint, row lock, CAS, Redis Lua script.

## Python Standards
- Use `dataclass` for simple immutable or mutable data holders.
- Use `Enum` for states and categories when typo bugs are likely.
- Use `Protocol` or `ABC` when you need a real interface.
- Use dependency injection by constructor parameters, not globals.
- Use `Decimal` or integer cents for money.
- Use `heapq` for schedulers/top-k candidates, `deque` for queues, `OrderedDict` for LRU, `set` for uniqueness, and dictionaries for indexes.
- Use decorators only when they reduce repeated cross-cutting logic such as authorization, retry, metrics, or transaction handling. Do not add decorators just to look advanced.
- Use context managers for resources or transaction-like scopes when useful.

## JavaScript Standards
- Use `class` for objects with identity and behavior.
- Use `Map`/`Set` for key-value indexes and uniqueness.
- Use private fields when hiding internal mutable structures improves the API.
- Use `async`/`await` for repository/provider calls and make transaction boundaries explicit.
- Use integer cents for money.
- Use modules and named exports in real projects; in interviews, keep code compact and readable.
- Avoid framework-specific Express/Nest code unless the interviewer asks. The LLD is the domain model and flow.

## SQL Standards
- Always include primary keys and foreign keys where relationships matter.
- Add `CHECK` constraints for positive amounts, valid statuses, and valid intervals.
- Add unique constraints for idempotency keys and natural uniqueness.
- Use indexes for query paths you mention.
- Use transactions for multi-row invariants.
- Use row locks or conditional updates for inventory, booking, wallet, and seat selection.
- Prefer append-only ledgers for financial history.

## Design Patterns Worth Knowing
- Strategy: pricing, allocation, matching, rate limiting algorithm, retry policy.
- State: order, trip, elevator, booking, payment lifecycle.
- Observer/Event: notifications, order status updates, audit events.
- Command: undo/redo, workflow actions, job handlers.
- Specification: file search filters, targeting rules.
- Adapter: external payment, SMS, email, push providers.
- Factory: creating channel senders, vehicles, pieces, commands when construction varies.

## Quick Rubric Before You Submit
- Can I draw the class boxes in 60 seconds?
- Can I explain the main flow without reading code?
- Did I isolate the part most likely to change?
- Did I protect the critical invariant?
- Did I include 5 tests, including a concurrency or retry case?
- Did I mention what I would simplify for the interview and change for production?
