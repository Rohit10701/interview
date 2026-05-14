# Solution Thought Process: Payment Wallet with Ledger

## 1. Clarify The Scope
Start by repeating the problem in one sentence, then clarify the boundary:
- Is this in-memory machine coding, persistent backend module, or distributed service?
- What is the primary operation that must be correct?
- What data must be strongly consistent?
- What can be eventually consistent?
- What follow-ups should be mentioned but not implemented first?

For this problem: Design a wallet system that supports deposits, withdrawals, transfers between wallets, balance lookup, and transaction history.

## 2. Identify Core Components
- Wallet, Transaction, LedgerEntry.
- WalletService with deposit, withdraw, transfer.
- LedgerRepository.
- IdempotencyRepository.
- BalanceService.

## 3. Design The Main Flow
1. Money problem means first say integer cents and idempotency.
2. Use a database transaction for transfer. Lock wallets in deterministic order to avoid deadlocks.
3. Check sufficient funds under the lock, not before.
4. Record transaction and ledger entries. Balance is a cached derived value that must match ledger.
5. Idempotency key protects against client retries and payment gateway callbacks.
6. Discuss reconciliation: periodically compare wallet balance with ledger sum.

## 4. Data Structures And Storage
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

Use in-memory collections for a timed coding round unless the prompt explicitly asks for persistence. Still explain how the SQL or Redis version would protect correctness if the domain has concurrent writes.

## 5. Python Implementation Shape
```python
class WalletService:
    def __init__(self, wallet_repo, transaction_repo):
        self.wallet_repo = wallet_repo
        self.transaction_repo = transaction_repo

    def transfer(self, from_wallet_id: str, to_wallet_id: str, amount_cents: int, idempotency_key: str):
        existing = self.transaction_repo.find_by_key(idempotency_key)
        if existing:
            return existing
        if amount_cents <= 0:
            raise ValueError("invalid_amount")
        # In production this whole block is one DB transaction.
        from_wallet = self.wallet_repo.get_for_update(from_wallet_id)
        to_wallet = self.wallet_repo.get_for_update(to_wallet_id)
        if from_wallet.balance_cents < amount_cents:
            raise ValueError("insufficient_funds")
        from_wallet.balance_cents -= amount_cents
        to_wallet.balance_cents += amount_cents
        tx = self.transaction_repo.create_transfer(idempotency_key, from_wallet, to_wallet, amount_cents)
        self.wallet_repo.save(from_wallet)
        self.wallet_repo.save(to_wallet)
        return tx
```

Python interview notes:
- Use `dataclass` for plain data objects when it improves readability.
- Use `Protocol` or `ABC` when an interface is important to the design.
- Use `Enum` for states when invalid strings would create bugs.
- Inject clock/repositories/providers for deterministic tests.
- Use locks only around the critical section, not the whole application flow.

## 6. JavaScript Implementation Shape
```javascript
class WalletService {
  constructor({ walletRepo, transactionRepo }) {
    Object.assign(this, { walletRepo, transactionRepo });
  }

  async transfer(fromWalletId, toWalletId, amountCents, idempotencyKey) {
    const existing = await this.transactionRepo.findByKey(idempotencyKey);
    if (existing) return existing;
    if (amountCents <= 0) throw new Error("invalid_amount");
    return this.walletRepo.transaction(async (tx) => {
      const fromWallet = await tx.getWalletForUpdate(fromWalletId);
      const toWallet = await tx.getWalletForUpdate(toWalletId);
      if (fromWallet.balanceCents < amountCents) throw new Error("insufficient_funds");
      fromWallet.balanceCents -= amountCents;
      toWallet.balanceCents += amountCents;
      return tx.createTransfer(idempotencyKey, fromWallet, toWallet, amountCents);
    });
  }
}
```

JavaScript interview notes:
- Use `class` when identity and behavior belong together.
- Use `Map` and `Set` instead of plain objects for arbitrary keys.
- Use private fields for internals when it keeps the public API clean.
- If async persistence is involved, make transaction boundaries explicit with `async`/`await`.
- Avoid framework details unless the interviewer asks for Express/Nest/Fastify integration.

## 7. Test Cases To Mention
- Withdrawal with insufficient funds fails.
- Transfer moves money exactly once.
- Duplicate idempotency key returns original transaction.
- Concurrent withdrawals cannot overdraw.
- Ledger entries balance debit and credit.

## 8. How To Explain It In 90 Seconds
My design has data objects for the domain, a service for the main use case, and replaceable strategies/repositories for choices likely to change. The critical correctness point is handled in the storage/data-structure layer, not by hoping the application code runs serially. I would first implement the happy path, then add validation, edge cases, and concurrency tests.

## 9. Follow-Up Discussion
Good follow-ups are usually about scale, concurrency, extensibility, and observability. Answer them by naming the exact boundary that changes: in-memory store to Redis/SQL, simple strategy to pluggable strategy, synchronous side effect to event/outbox, or naive scan to indexed lookup.
