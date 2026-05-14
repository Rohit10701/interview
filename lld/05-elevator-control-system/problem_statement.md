# Elevator Control System

## Level
Medium-Hard, 45-60 minutes

## Common Interview Context
Microsoft, Adobe, Oracle style object modeling rounds

## Problem Statement
Design an elevator system for a building with multiple elevators, floor requests, internal cabin requests, direction handling, and scheduling.

## Functional Requirements
- Users can request an elevator from a floor with desired direction.
- Passengers inside an elevator can select destination floors.
- The system assigns requests to elevators using a scheduling strategy.
- Elevators move step by step and open doors at scheduled stops.
- Support idle, moving up, moving down, and maintenance states.
- The scheduling strategy should be replaceable.

## Non-Functional Requirements
- The model should be event-driven enough to simulate ticks.
- Avoid one giant ElevatorSystem class.
- Handle duplicate requests to the same floor gracefully.
- Design should allow future priority elevators or service mode.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
