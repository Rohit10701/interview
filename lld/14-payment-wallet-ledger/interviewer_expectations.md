# Interviewer Expectations: Payment Wallet with Ledger

## What They Are Testing
- Wallet, Transaction, LedgerEntry.
- WalletService with deposit, withdraw, transfer.
- LedgerRepository.
- IdempotencyRepository.
- BalanceService.

## Minimum Strong Answer
- Starts with clarifying scope and choosing the main consistency boundary.
- Identifies the core nouns and separates data objects from services.
- Gives the main happy-path flow before discussing every edge case.
- Names the data structure or SQL transaction that protects correctness.
- Mentions tests that prove the design works.

## Higher-Signal Answer
- Uses small interfaces for volatile choices such as strategy, repository, provider, clock, or payment gateway.
- Makes state transitions explicit instead of allowing arbitrary status mutation.
- Handles retries, idempotency, concurrency, and stale data where the domain needs it.
- Explains one simpler interview version and one production version.
- Knows when not to overuse patterns.

## Data Model / SQL Signal
```sql
CREATE TABLE wallets (
    id UUID PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    balance_cents BIGINT NOT NULL CHECK (balance_cents >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY,
    idempotency_key TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER')),
    status TEXT NOT NULL CHECK (status IN ('PENDING', 'SUCCEEDED', 'FAILED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ledger_entries (
    id BIGSERIAL PRIMARY KEY,
    transaction_id UUID NOT NULL REFERENCES wallet_transactions(id),
    wallet_id UUID NOT NULL REFERENCES wallets(id),
    direction TEXT NOT NULL CHECK (direction IN ('DEBIT', 'CREDIT')),
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0)
);
```

## Evaluation Rubric
- 30 percent: clear entities, ownership, and API boundaries.
- 25 percent: correct main flow and state transitions.
- 20 percent: data structure or SQL correctness.
- 15 percent: concurrency, idempotency, and edge cases.
- 10 percent: code quality, tests, and communication.

## Red Flags
- Negative balance under concurrent withdrawals.
- Debiting source but failing before crediting destination.
- No idempotency key, causing duplicate transfers.
- Using floats for money.
- Deleting or editing ledger entries instead of appending corrections.
