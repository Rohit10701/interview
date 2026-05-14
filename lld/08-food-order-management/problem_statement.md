# Food Order Management System

## Level
Medium, 45-60 minutes

## Common Interview Context
Startup marketplace, Uber/DoorDash/Swiggy style rounds

## Problem Statement
Design an order management module for a food delivery platform that accepts cart checkout, routes order status changes, and notifies customers and restaurants.

## Functional Requirements
- A customer creates an order from restaurant menu items.
- Restaurant can accept or reject the order.
- Order status moves through placed, accepted, preparing, ready, picked up, delivered, cancelled.
- Status transitions should be validated.
- Customers and restaurants should receive notifications on important status changes.
- Prices should be captured at order time, not read from mutable menu later.

## Non-Functional Requirements
- State transition logic should be centralized.
- Notifications should not block the order transaction.
- Idempotency matters for checkout retries.
- The design should support future delivery partner assignment.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
