# Interviewer Expectations: Notification Service

## What They Are Testing
- NotificationRequest, Template, RenderedMessage.
- PreferenceService.
- TemplateRenderer.
- ChannelSender interface with EmailSender, SmsSender, PushSender.
- RetryPolicy and ProviderRouter.
- NotificationRepository for idempotency and attempt history.

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
```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY,
    idempotency_key TEXT NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    event_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'SENT', 'FAILED', 'SUPPRESSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE notification_attempts (
    id BIGSERIAL PRIMARY KEY,
    notification_id UUID NOT NULL REFERENCES notifications(id),
    channel TEXT NOT NULL,
    provider TEXT NOT NULL,
    status TEXT NOT NULL,
    error_message TEXT,
    attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- No idempotency, causing duplicate emails/SMS.
- Provider-specific code scattered across business logic.
- Ignoring user opt-out preferences.
- Not storing attempts, making failures impossible to debug.
- Retrying permanent failures such as invalid phone number forever.
