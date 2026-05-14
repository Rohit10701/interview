# Solution Thought Process: Middleware Router

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a middleware router that maps HTTP requests to handlers and supports chained middleware such as authentication, logging, validation, and error handling.

## 2. Identify Core Components
- Request, Response.
- Route, RouteMatcher.
- Middleware function/interface.
- Router with register and handle.
- ErrorHandler middleware.

## 3. Design The Main Flow
1. Define the middleware contract first: middleware(request, next) returns response.
2. Compose from right to left so middleware runs in registration order.
3. Keep path matching a separate concern. Simple split matching is okay; a trie is a follow-up.
4. State how middleware short-circuits: it returns response without calling next.
5. Add centralized error handling as the outermost middleware.
6. Mention route precedence: exact routes before parameter routes before wildcard.

## 4. Data Structures And Storage
No SQL. This is a framework/library design problem.

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from dataclasses import dataclass, field
from typing import Callable


@dataclass
class Request:
    method: str
    path: str
    params: dict[str, str] = field(default_factory=dict)


@dataclass
class Response:
    status: int
    body: object


Handler = Callable[[Request], Response]
Middleware = Callable[[Request, Handler], Response]


def compose(middlewares: list[Middleware], handler: Handler) -> Handler:
    current = handler
    for middleware in reversed(middlewares):
        next_handler = current
        current = lambda request, mw=middleware, nxt=next_handler: mw(request, nxt)
    return current
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
function compose(middlewares, handler) {
  return middlewares.reduceRight(
    (next, middleware) => (request) => middleware(request, next),
    handler
  );
}

class Router {
  constructor() {
    this.routes = [];
    this.middlewares = [];
  }

  use(middleware) { this.middlewares.push(middleware); }
  register(method, pathPattern, handler) { this.routes.push({ method, pathPattern, handler }); }

  handle(request) {
    const route = this.routes.find((candidate) => candidate.method === request.method);
    if (!route) return { status: 404, body: "not_found" };
    return compose(this.middlewares, route.handler)(request);
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
- Auth middleware can return 401 without handler call.
- Logging middleware runs before and after handler.
- /users/123 matches /users/:id with id=123.
- Unknown route returns 404.
- Thrown handler error becomes 500 response.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
