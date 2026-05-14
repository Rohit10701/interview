# Notification Service

## Level
Medium, 45 minutes

## Common Interview Context
SaaS, ecommerce, consumer apps, platform teams

## Problem Statement
Design a notification module that can send email, SMS, and push notifications using templates, user preferences, retries, and provider fallback.

## Functional Requirements
- Clients request notification by event type and recipient.
- System resolves template and channel preferences.
- Support email, SMS, and push channels.
- Failed sends should retry with backoff and provider fallback where configured.
- Do not send duplicate notifications for the same idempotency key.
- Store delivery attempts for audit.

## Non-Functional Requirements
- Sending should be asynchronous when possible.
- Providers should be hidden behind interfaces.
- Template rendering should be separated from channel delivery.
- Respect opt-out and quiet hours.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
