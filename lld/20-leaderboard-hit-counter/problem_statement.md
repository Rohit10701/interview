# Leaderboard and Hit Counter

## Level
Medium, 45 minutes

## Common Interview Context
Gaming, analytics, social, product metrics interviews

## Problem Statement
Design a leaderboard service that records score updates, returns top K users, supports user rank lookup, and optionally tracks rolling hit counts.

## Functional Requirements
- record_score(user_id, delta) updates a user's score.
- top_k(k) returns users sorted by score desc and tie-breaker.
- rank(user_id) returns the current rank.
- Scores can update frequently.
- Optional: maintain hits in the last 5 minutes.

## Non-Functional Requirements
- In-memory answer can use heap plus maps or a sorted list for small scale.
- Production answer should mention Redis sorted sets.
- Tie-breaking must be deterministic.
- Rank lookup should not require sorting everything if scale matters.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
