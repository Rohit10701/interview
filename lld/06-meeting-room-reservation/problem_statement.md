# Meeting Room Reservation System

## Level
Medium, 45 minutes

## Common Interview Context
SaaS, enterprise tools, startup backend LLD

## Problem Statement
Design a meeting room booking module where users can search available rooms, reserve a room for a time interval, cancel bookings, and list bookings.

## Functional Requirements
- Rooms have capacity, building/floor, and amenities.
- Users can search by time range, capacity, and optional amenities.
- A booking reserves exactly one room for a non-overlapping interval.
- Users can cancel their bookings.
- Concurrent booking attempts for the same room and time must not double-book.
- Optional follow-up: recurring meetings.

## Non-Functional Requirements
- Interval overlap logic must be correct.
- Database constraints or transactions matter more than in-memory checks.
- Search can be approximate first, then booking must be strongly consistent.
- Time zones should be normalized for storage.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
