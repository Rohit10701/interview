# Research Notes

The question set and rubrics were cross-checked against common public LLD and machine-coding resources on May 13, 2026.

## Sources Used
- CodeZym LLD problem list: https://codezym.com/
  - Used to cross-check common interview categories such as parking lot, hit counter, food ordering, Unix find, chess/text editor, spreadsheet, elevator, ticket booking, wallet, cache, pub-sub, feature-like platform problems, and company-style breadth.
- Low Level Design Mastery machine coding guide: https://www.lowleveldesignmastery.com/blog/machine-coding-round/
  - Used for practice-loop shape: read problem, design first, implement core models/services, then driver/tests.
- Low Level Design Mastery top LLD questions: https://www.lowleveldesignmastery.com/blog/low-level-design-interview-questions/
  - Used to cross-check medium/hard split and recurring problems such as rate limiter, meeting room reservation, restaurant ordering, elevator, payment processor, notification service, task scheduler, and cache manager.
- GitHub machine-coding topic: https://github.com/topics/machine-coding
  - Used to validate that public prep repositories cluster around OOP, design patterns, SOLID, LLD, and machine-coding practice.
- Tech Interview API key management article: https://www.techinterview.org/post/3233468239/lld-api-key-management/
  - Used as a comparison point for API key lifecycle topics: hashing, scopes, rate limiting, revocation, rotation, key prefixes, and usage logging.
- PEP 8: https://peps.python.org/pep-0008/
  - Used for Python style guidance around readability, indentation, imports, naming, and consistency.
- MDN JavaScript Classes: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
  - Used for JavaScript class terminology and encapsulation guidance.
- MDN JavaScript Modules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules
  - Used for JavaScript modularity guidance.
- PostgreSQL constraints documentation: https://www.postgresql.org/docs/current/ddl-constraints.html
  - Used to ground SQL recommendations around primary keys, foreign keys, check constraints, and data integrity.

## Sample DOCX Calibration
Your sample prompt is a 30-minute backend LLD, not a full high-level system design. The expected answer is roughly:
- core classes/modules,
- schema or in-memory data structures,
- middleware/service pseudocode,
- dynamic config/tier changes,
- concurrency correctness.

This pack keeps that format but adds more interviewer-grade detail and gotchas.
