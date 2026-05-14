# Interviewer Expectations: Expense Sharing System Like Splitwise

## What They Are Testing
- User, Group, Expense, Split.
- SplitStrategy interface.
- LedgerEntry for debit/credit.
- BalanceService for net and simplified balances.
- ExpenseService for add and reverse.

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
CREATE TABLE expenses (
    id UUID PRIMARY KEY,
    group_id BIGINT,
    paid_by BIGINT NOT NULL,
    amount_cents BIGINT NOT NULL CHECK (amount_cents > 0),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE expense_splits (
    expense_id UUID NOT NULL REFERENCES expenses(id),
    user_id BIGINT NOT NULL,
    owed_cents BIGINT NOT NULL CHECK (owed_cents >= 0),
    PRIMARY KEY (expense_id, user_id)
);

CREATE TABLE ledger_entries (
    id BIGSERIAL PRIMARY KEY,
    expense_id UUID NOT NULL REFERENCES expenses(id),
    from_user BIGINT NOT NULL,
    to_user BIGINT NOT NULL,
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
- Using float for currency.
- Exact/percentage splits not summing to total.
- Losing audit trail by only storing final balances.
- Not handling payer also being a participant.
- Deleting expenses instead of reversing them.
