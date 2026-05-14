# Ride Matching and Cab Booking

## Level
Medium-Hard, 60 minutes

## Common Interview Context
Uber/Lyft/Ola marketplace LLD

## Problem Statement
Design a ride booking module where riders request rides, nearby available drivers are matched, drivers accept, and trip state is tracked.

## Functional Requirements
- Drivers can update location and availability.
- Rider requests a ride from pickup to destination.
- System finds candidate drivers near pickup.
- Driver can accept or reject an offer.
- Trip moves through requested, offered, accepted, started, completed, cancelled.
- Avoid assigning one driver to two trips concurrently.

## Non-Functional Requirements
- Location indexing can be simplified but should be acknowledged.
- Driver assignment must be atomic.
- State machine should validate transitions.
- Timeouts release offers if no driver accepts.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
