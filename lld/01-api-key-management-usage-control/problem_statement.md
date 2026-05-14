# API Key Management and Usage Control System

## Level
Medium, 30-45 minutes

## Common Interview Context
Developer platform, SaaS, fintech, infrastructure teams

## Problem Statement
Design a monolithic backend module that authenticates API keys, enforces hourly and daily usage limits per user, supports subscription tier changes, and works correctly under concurrent requests.

## Functional Requirements
- Users can own multiple API keys, but rate limits are enforced per user unless the interviewer changes it to per key.
- Subscription tiers define hourly and daily request limits.
- A key can be active, revoked, expired, or rotated.
- Middleware must authenticate the key, check scopes if present, enforce usage limits, and record usage.
- Tier changes must affect future requests without requiring service restart.
- Concurrent requests must not exceed the configured limit due to race conditions.

## Non-Functional Requirements
- Hot path should avoid a database read on every request where a cache is available.
- Raw API keys must never be stored after creation.
- Usage counters must reset by time window and should not grow forever.
- Auditability matters: last used time, usage events, revoke reason, and key prefix are useful.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
