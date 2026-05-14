# Feature Flag and Experimentation System

## Level
Medium, 45-60 minutes

## Common Interview Context
SaaS platform, growth, startup infrastructure

## Problem Statement
Design a feature flag evaluation module that supports boolean flags, percentage rollout, user targeting rules, and A/B experiment variants.

## Functional Requirements
- Create flags with default value and enabled/disabled state.
- Evaluate a flag for a user context.
- Support allowlists, attribute rules, percentage rollout, and variants.
- Same user should receive stable result across requests.
- Flag updates should affect future evaluations.
- Return reason metadata for debugging.

## Non-Functional Requirements
- Evaluation should be fast and side-effect free.
- Rules should be ordered and composable.
- Percentage rollout must use stable hashing, not random per request.
- Config can be cached but needs versioning or TTL.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
