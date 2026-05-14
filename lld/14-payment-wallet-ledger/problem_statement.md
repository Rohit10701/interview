# Payment Wallet with Ledger

## Level
Medium-Hard, 60 minutes

## Common Interview Context
Fintech, payments, marketplace wallet interviews

## Problem Statement
Design a wallet system that supports deposits, withdrawals, transfers between wallets, balance lookup, and transaction history.

## Functional Requirements
- Each user has a wallet balance.
- Deposit increases balance, withdrawal decreases balance if sufficient funds exist.
- Transfer debits one wallet and credits another atomically.
- Transaction history must be auditable.
- Duplicate client retries should not double-charge.
- Concurrent transfers must not create negative balances.

## Non-Functional Requirements
- Use integer cents or Decimal for money.
- Ledger entries are safer than only mutating balances.
- Idempotency key is required for external client calls.
- Database transaction and row locks are central to the design.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
