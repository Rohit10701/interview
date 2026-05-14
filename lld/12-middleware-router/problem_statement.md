# Middleware Router

## Level
Medium, 45 minutes

## Common Interview Context
Atlassian/API platform/startup backend rounds

## Problem Statement
Design a middleware router that maps HTTP requests to handlers and supports chained middleware such as authentication, logging, validation, and error handling.

## Functional Requirements
- Register routes by method and path pattern.
- Support path parameters such as /users/:id.
- Execute middleware in order before the route handler.
- Middleware can stop the chain by returning a response.
- Errors should be converted to a consistent error response.

## Non-Functional Requirements
- Route matching should be separated from middleware execution.
- Middleware should be composable and testable.
- The router should not depend on a specific web server.
- For many routes, a trie can replace linear scanning.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
