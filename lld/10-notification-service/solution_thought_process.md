# Solution Thought Process: Notification Service

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a notification module that can send email, SMS, and push notifications using templates, user preferences, retries, and provider fallback.

## 2. Identify Core Components
- NotificationRequest, Template, RenderedMessage.
- PreferenceService.
- TemplateRenderer.
- ChannelSender interface with EmailSender, SmsSender, PushSender.
- RetryPolicy and ProviderRouter.
- NotificationRepository for idempotency and attempt history.

## 3. Design The Main Flow
1. Break the pipeline into request, preference, render, deliver, record attempt.
2. Use Strategy/Adapter for providers so Twilio/SES/Firebase details do not enter core logic.
3. Use idempotency key to avoid duplicate sends on retries.
4. Suppression is a valid terminal state when user opted out or quiet hours apply.
5. Retries should record every attempt and should not block the caller.
6. Provider fallback should be explicit per channel; do not retry endlessly.

## 4. Data Structures And Storage
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

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from abc import ABC, abstractmethod


class ChannelSender(ABC):
    @abstractmethod
    def send(self, recipient: str, subject: str, body: str) -> None:
        raise NotImplementedError


class NotificationService:
    def __init__(self, preferences, renderer, senders, repository):
        self.preferences = preferences
        self.renderer = renderer
        self.senders = senders
        self.repository = repository

    def enqueue(self, request):
        existing = self.repository.find_by_idempotency_key(request.idempotency_key)
        if existing:
            return existing
        notification = self.repository.create_pending(request)
        return notification

    def process(self, notification):
        channels = self.preferences.channels_for(notification.user_id, notification.event_type)
        message = self.renderer.render(notification.event_type, notification.data)
        for channel in channels:
            self.senders[channel].send(notification.recipient, message.subject, message.body)
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class NotificationService {
  constructor({ preferences, renderer, senders, repository }) {
    Object.assign(this, { preferences, renderer, senders, repository });
  }

  enqueue(request) {
    const existing = this.repository.findByIdempotencyKey(request.idempotencyKey);
    if (existing) return existing;
    return this.repository.createPending(request);
  }

  process(notification) {
    const channels = this.preferences.channelsFor(notification.userId, notification.eventType);
    const message = this.renderer.render(notification.eventType, notification.data);
    for (const channel of channels) {
      this.senders.get(channel).send(notification.recipient, message.subject, message.body);
    }
  }
}
```

JavaScript interview notes:
- Use `class` when identity and behavior belong together.
- Use `Map` and `Set` instead of plain objects for arbitrary keys.
- Use private fields for internals when it keeps the public API clean.
- If async persistence is involved, make transaction boundaries explicit with `async`/`await`.
- Avoid framework details unless the interviewer asks for Express/Nest/Fastify integration.

## 7. Test Cases To Mention
- Opted-out user is suppressed.
- Same idempotency key returns existing notification.
- Email provider failure records failed attempt and schedules retry.
- Template variables render correctly.
- Fallback provider is used after configured failure.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
