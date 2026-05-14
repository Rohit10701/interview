# Unix Find File Search with Filters

## Level
Medium, 45 minutes

## Common Interview Context
Amazon/Atlassian style LLD, file-system modeling

## Problem Statement
Design a file search utility similar to Unix find that can traverse a file tree and filter files by name, extension, size, modified time, and boolean combinations of filters.

## Functional Requirements
- Represent files and directories in a tree.
- Search recursively from a root directory.
- Support filters such as name, extension, min size, max size.
- Support AND, OR, and NOT combinations.
- Return matching files without exposing traversal details.

## Non-Functional Requirements
- Filters should be composable using Specification pattern.
- Traversal should be iterative or recursive with clear trade-off.
- The design should allow streaming results for large trees.
- Avoid hard-coding every filter combination.

## Expected Deliverables In The Interview
- Core classes/modules and their responsibilities.
- Data structures and, where relevant, SQL schema.
- Main flow pseudocode for the primary operation.
- Edge cases and concurrency/consistency handling.
- A short explanation of trade-offs and follow-up extensions.

## Language Practice Requirement
Explain the design in both Python and JavaScript terms. You do not need framework-specific code. Focus on classes, interfaces, repositories, state transitions, and testable functions.
