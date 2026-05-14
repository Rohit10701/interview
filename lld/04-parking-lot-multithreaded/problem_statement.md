# Multi-Floor Parking Lot

## Level
Medium, 45-60 minutes

## Common Interview Context
Classic big-tech and marketplace LLD rounds

## Problem Statement
Design a parking lot system with multiple floors, different spot types, vehicle types, ticket generation, fee calculation, and real-time availability.

## Functional Requirements
- Support motorcycles, cars, and large vehicles.
- Floors contain spots of multiple types.
- A vehicle parks and receives a ticket.
- On exit, calculate fee based on duration and pricing strategy.
- Availability should be queryable by floor and spot type.
- Concurrent entry/exit must not allocate the same spot twice.

## Non-Functional Requirements
- Allocation strategy should be replaceable: nearest floor, cheapest floor, random, reserved.
- Fee strategy should be replaceable without changing parking flow.
- Ticket lifecycle should prevent double exit payment.
- The design should work in-memory first but have clear persistence boundaries.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
