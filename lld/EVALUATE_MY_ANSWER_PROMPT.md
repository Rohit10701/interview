# Quick LLD Answer Evaluation Prompt

Use this when you want fast feedback in chat without writing a long prompt.

```text
Eval LLD: <folder-name>
Here is my answer:
<paste my design, code, pseudocode, or explanation>
```

## Evaluation Standard
Please evaluate my answer against:
- `<folder-name>/problem_statement.md`
- `<folder-name>/interviewer_expectations.md`
- `<folder-name>/solution_thought_process.md`
- `<folder-name>/gotchas.md`
- `STANDARD_LLD_ANSWER_TEMPLATE.md`
- `CODE_QUALITY_RECAP.md`

## Output Format
- Score out of 10.
- What I did well.
- Missing requirements.
- Design/code quality issues.
- Concurrency, SQL, or state bugs.
- Gotchas I missed.
- A revised interview-ready answer outline.
- 3 follow-up questions the interviewer might ask.

## Scoring
- 9-10: interview-ready, clear trade-offs, handles edge cases and concurrency.
- 7-8: good structure, some missed edge cases or production details.
- 5-6: understandable but incomplete, likely needs interviewer hints.
- 3-4: mostly happy path, weak boundaries or incorrect invariants.
- 0-2: does not solve the core problem.
