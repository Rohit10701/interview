# Expense Sharing System Like Splitwise

## Level
Medium, 45 minutes

## Common Interview Context
Common fintech/product LLD round

## Problem Statement
Design an expense sharing module where users can create groups, add expenses, split by equal/exact/percentage shares, and view balances.

## Functional Requirements
- Support groups and non-group expenses.
- A payer pays an amount on behalf of participants.
- Split strategies: equal, exact amount, and percentage.
- The system records who owes whom and can show simplified balances.
- Expenses can be listed and reversed if needed.

## Non-Functional Requirements
- Money arithmetic must avoid floating point errors.
- The split strategy should be replaceable.
- Audit trail matters: do not only store net balances.
- Balance computation can be derived from ledger entries.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
