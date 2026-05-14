# Movie Ticket Booking System

## Level
Medium-Hard, 60 minutes

## Common Interview Context
Consumer marketplace, payments, seat inventory interviews

## Problem Statement
Design a movie ticket booking module where users browse shows, select seats, temporarily lock seats, pay, and receive confirmed tickets.

## Functional Requirements
- Movies have shows at theatres/screens.
- Shows have seats with types and prices.
- Users can select available seats and place a temporary hold.
- Held seats expire if payment is not completed.
- Confirmed seats cannot be booked by another user.
- Concurrent users selecting the same seat must not both succeed.

## Non-Functional Requirements
- Seat locking and payment confirmation must be consistent.
- Holds should expire automatically or lazily.
- Payment is external and can fail or be delayed.
- Design should avoid long database locks while waiting for payment.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
