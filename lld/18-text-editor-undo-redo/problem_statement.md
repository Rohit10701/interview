# Text Editor with Undo and Redo

## Level
Medium, 45 minutes

## Common Interview Context
Microsoft/Google style data structure plus design round

## Problem Statement
Design a simple text editor that supports insert, delete, cursor movement, undo, and redo.

## Functional Requirements
- Maintain editable text and cursor position.
- Support insert text at cursor and delete range/backspace.
- Support undo and redo of editing commands.
- New edit after undo should clear redo stack.
- Commands should be extensible.

## Non-Functional Requirements
- Command pattern is the main design signal.
- The text buffer can start as a string/list, but mention gap buffer/rope for large documents.
- Undo should restore both text and cursor position.
- Avoid duplicating inverse logic across editor and commands.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
