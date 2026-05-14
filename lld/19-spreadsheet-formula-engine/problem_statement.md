# Spreadsheet Formula Engine

## Level
Medium-Hard, 60 minutes

## Common Interview Context
Microsoft/OpenAI-style product infrastructure interviews

## Problem Statement
Design a spreadsheet core that stores cell values and formulas, evaluates dependencies, and updates dependent cells when a cell changes.

## Functional Requirements
- Cells can contain literal numbers or formulas referencing other cells.
- Formula examples: =A1+B2, =SUM(A1:A3).
- Changing a cell should update dependent formulas.
- Detect cyclic dependencies.
- Expose get_cell and set_cell operations.

## Non-Functional Requirements
- Separate parsing, dependency graph, and evaluation.
- Use topological ordering for recalculation.
- Cache computed values but invalidate dependents on change.
- Do not build a full Excel parser in the interview.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
