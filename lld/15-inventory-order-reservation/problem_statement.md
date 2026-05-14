# Inventory and Order Reservation System

## Level
Medium-Hard, 60 minutes

## Common Interview Context
Ecommerce, warehouse, marketplace startup rounds

## Problem Statement
Design an inventory reservation module where checkout reserves stock, payment confirms it, and abandoned reservations release stock.

## Functional Requirements
- Products have available stock by SKU.
- Checkout reserves requested quantity for a short TTL.
- Payment confirmation converts reservation to sold.
- Expired or cancelled reservation releases stock.
- Concurrent checkouts must not oversell.
- Support order lines with multiple SKUs.

## Non-Functional Requirements
- Atomic stock decrement or row lock is required.
- Reservation state must be explicit.
- Multi-SKU reservation should be all-or-nothing.
- Inventory events are useful for audit and reconciliation.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
