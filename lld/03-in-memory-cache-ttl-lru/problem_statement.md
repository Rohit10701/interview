# In-Memory Cache with TTL and LRU Eviction

## Level
Medium, 45-60 minutes

## Common Interview Context
Backend platform, infrastructure, startup machine coding rounds

## Problem Statement
Design an in-memory cache that supports get, put, delete, TTL expiry, maximum capacity, and LRU eviction.

## Functional Requirements
- get(key) returns value if present and not expired; it also marks the key as recently used.
- put(key, value, ttl_seconds) inserts or updates a key.
- When capacity is exceeded, evict the least recently used non-expired entry.
- Expired entries should not be returned and should eventually be removed.
- Implementation should be safe for concurrent callers.

## Non-Functional Requirements
- get and put should be O(1) average time.
- The cache should not depend on real time directly in tests.
- Eviction policy should be replaceable if asked.
- Avoid a background thread unless needed; lazy expiry is acceptable for interviews.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
