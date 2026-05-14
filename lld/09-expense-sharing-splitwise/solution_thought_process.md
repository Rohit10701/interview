# Solution Thought Process: Expense Sharing System Like Splitwise

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design an expense sharing module where users can create groups, add expenses, split by equal/exact/percentage shares, and view balances.

## 2. Identify Core Components
- User, Group, Expense, Split.
- SplitStrategy interface.
- LedgerEntry for debit/credit.
- BalanceService for net and simplified balances.
- ExpenseService for add and reverse.

## 3. Design The Main Flow
1. Use cents or Decimal, never float. This is the quickest way to show maturity in money problems.
2. Separate split calculation from ledger creation.
3. Store raw expense and splits for audit. Net balances can be computed or cached.
4. Equal split needs deterministic remainder handling because cents may not divide evenly.
5. Simplification is a graph/netting problem: compute net balance per user, then match debtors to creditors.
6. Reversal should create reversing ledger entries or mark expense reversed, not delete history silently.

## 4. Data Structures And Storage
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

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
from abc import ABC, abstractmethod


class SplitStrategy(ABC):
    @abstractmethod
    def split(self, amount_cents: int, users: list[str]) -> dict[str, int]:
        raise NotImplementedError


class EqualSplitStrategy(SplitStrategy):
    def split(self, amount_cents: int, users: list[str]) -> dict[str, int]:
        base, remainder = divmod(amount_cents, len(users))
        result = {user: base for user in users}
        for user in users[:remainder]:
            result[user] += 1
        return result


def ledger_for_expense(paid_by: str, splits: dict[str, int]) -> list[tuple[str, str, int]]:
    return [
        (user, paid_by, cents)
        for user, cents in splits.items()
        if user != paid_by and cents > 0
    ]
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class EqualSplitStrategy {
  split(amountCents, users) {
    const base = Math.floor(amountCents / users.length);
    let remainder = amountCents % users.length;
    const result = new Map();
    for (const user of users) {
      result.set(user, base + (remainder > 0 ? 1 : 0));
      remainder -= 1;
    }
    return result;
  }
}

function ledgerForExpense(paidBy, splits) {
  const entries = [];
  for (const [user, cents] of splits.entries()) {
    if (user !== paidBy && cents > 0) entries.push({ fromUser: user, toUser: paidBy, amountCents: cents });
  }
  return entries;
}
```

JavaScript interview notes:
- Use `class` when identity and behavior belong together.
- Use `Map` and `Set` instead of plain objects for arbitrary keys.
- Use private fields for internals when it keeps the public API clean.
- If async persistence is involved, make transaction boundaries explicit with `async`/`await`.
- Avoid framework details unless the interviewer asks for Express/Nest/Fastify integration.

## 7. Test Cases To Mention
- 100 cents split among 3 users becomes 34, 33, 33.
- Exact split sum mismatch is rejected.
- Payer does not owe themselves.
- Balances for A paid 300 for A,B,C show B owes A 100 and C owes A 100.
- Reversal cancels previous ledger effect.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
