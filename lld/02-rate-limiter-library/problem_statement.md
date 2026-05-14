# Rate Limiter Library

## Level
Medium, 45 minutes

## Common Interview Context
API gateway, payments, observability, platform engineering

## Problem Statement
Design a reusable rate limiter library that supports multiple algorithms and can be used by services to allow or reject requests by client id.

## Functional Requirements
- Support fixed window, sliding window log, and token bucket as interchangeable strategies.
- Allow different limits per client or endpoint.
- Expose allow_request(client_id, endpoint, timestamp) returning allow/deny and retry metadata.
- The implementation should be thread-safe for in-process use.
- Old buckets or old request timestamps should be cleaned up.

## Non-Functional Requirements
- The library should not know about HTTP frameworks.
- The strategy interface must be small enough to test independently.
- Token bucket should support bursts while fixed window should be simple and memory efficient.
- Clock injection is preferred over direct calls to now() for deterministic tests.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
