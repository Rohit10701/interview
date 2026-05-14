# LLD Interview Practice Pack

This pack is modeled after the sample `API Key Management & Usage Control System (LLD).docx`: a practical 30-60 minute LLD prompt with required classes/modules, data structures or SQL, main flow pseudocode, concurrency handling, and edge cases.

The target level is 2.5-3 years of backend/full-stack experience, with some harder follow-ups so you can practice for both startup machine-coding rounds and higher-bar big-tech style LLD rounds.

## Folder Structure
Each problem folder has exactly these four files:
- `problem_statement.md`
- `interviewer_expectations.md`
- `solution_thought_process.md`
- `gotchas.md`

The `solution_thought_process.md` file contains both Python and JavaScript implementation shapes.

## Problems
| Folder | Problem | Level |
|---|---|---|
| 01-api-key-management-usage-control | API Key Management and Usage Control System | Medium, 30-45 minutes |
| 02-rate-limiter-library | Rate Limiter Library | Medium, 45 minutes |
| 03-in-memory-cache-ttl-lru | In-Memory Cache with TTL and LRU Eviction | Medium, 45-60 minutes |
| 04-parking-lot-multithreaded | Multi-Floor Parking Lot | Medium, 45-60 minutes |
| 05-elevator-control-system | Elevator Control System | Medium-Hard, 45-60 minutes |
| 06-meeting-room-reservation | Meeting Room Reservation System | Medium, 45 minutes |
| 07-movie-ticket-booking | Movie Ticket Booking System | Medium-Hard, 60 minutes |
| 08-food-order-management | Food Order Management System | Medium, 45-60 minutes |
| 09-expense-sharing-splitwise | Expense Sharing System Like Splitwise | Medium, 45 minutes |
| 10-notification-service | Notification Service | Medium, 45 minutes |
| 11-job-scheduler | Job Scheduler | Medium-Hard, 60 minutes |
| 12-middleware-router | Middleware Router | Medium, 45 minutes |
| 13-unix-find-file-search | Unix Find File Search with Filters | Medium, 45 minutes |
| 14-payment-wallet-ledger | Payment Wallet with Ledger | Medium-Hard, 60 minutes |
| 15-inventory-order-reservation | Inventory and Order Reservation System | Medium-Hard, 60 minutes |
| 16-feature-flag-experimentation | Feature Flag and Experimentation System | Medium, 45-60 minutes |
| 17-ride-matching-cab-booking | Ride Matching and Cab Booking | Medium-Hard, 60 minutes |
| 18-text-editor-undo-redo | Text Editor with Undo and Redo | Medium, 45 minutes |
| 19-spreadsheet-formula-engine | Spreadsheet Formula Engine | Medium-Hard, 60 minutes |
| 20-leaderboard-hit-counter | Leaderboard and Hit Counter | Medium, 45 minutes |

## Recommended Practice Loop
1. Open only `problem_statement.md`.
2. Spend 5 minutes clarifying requirements and writing assumptions.
3. Spend 10 minutes on entities, APIs, and data model.
4. Spend 20-30 minutes writing the main flow in Python or JavaScript.
5. Open `interviewer_expectations.md` and compare.
6. Open `solution_thought_process.md` and improve your answer.
7. Open `gotchas.md` last and add missing edge cases.

## Short Chat Evaluation Command
Use this in chat:

```text
Eval LLD: <folder-name>
Here is my answer:
<paste your design/code/thought process>
```

I can then evaluate against the local folder's four files and the rubric in `EVALUATE_MY_ANSWER_PROMPT.md`.
