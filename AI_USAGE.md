# AI Usage in the iExchange Assessment

## 1. Overview

I used ChatGPT, Cursor, and the VS Code AI Agent as development assistants while building the iExchange full-stack mobile assessment. They supported planning, coding, debugging, codebase inspection, and documentation in different ways. I retained responsibility for implementation decisions, testing, reviewing suggested changes, and final verification.

This document distinguishes what is visible in the project and retained task records from details that cannot be confirmed because a complete prompt archive and test report are not present in the repository.

## 2. AI Tools Used

| Tool | Purpose |
|---|---|
| ChatGPT | Requirement analysis, technical explanations, architecture planning, prompt preparation, debugging guidance, and review of implementation approaches. |
| Cursor | AI-assisted coding, code suggestions, implementation, refactoring, and debugging. |
| VS Code AI Agent | Codebase inspection, feature implementation, corrections, verification assistance, documentation, and Git history cleanup. |

The ChatGPT and Cursor activities above reflect my confirmation of how I used those tools. The VS Code AI Agent activities are supported by the available task records. Git, npm, TypeScript, lint, Postman, and Android tools were used as development or verification tools; they are not listed as AI tools.

## 3. Development Workflow

The project followed an iterative workflow:

**Requirement analysis and planning → Prompt preparation → AI-assisted coding → Code review → Testing → Corrections → Final verification**

I used ChatGPT for planning, explanations, and prompt preparation; Cursor for AI-assisted coding and debugging; and the VS Code AI Agent for codebase inspection, implementation support, corrections, verification assistance, and documentation. I reviewed and validated the resulting implementation rather than accepting AI-generated code without checking it. The exact tool used for each historical task is not always recorded; the prompt-history table marks those cases as AI-assisted rather than guessing.

## 4. Prompt History

The table summarizes documented objectives using available task/conversation records and the repository. Entries are **verified summaries, not reconstructed verbatim prompts**. The available records do not reliably map ChatGPT or Cursor to individual implementation phases, so those rows are labeled AI-assisted where the specific tool cannot be established. Commit history identifies milestones but does not prove which tool generated particular code.

| Development phase | Objective | Verified prompt/task summary | Tool attribution and AI contribution | Developer verification |
|---|---|---|---|---|
| Project setup | Establish the mobile and backend project structure. | Summary from task records: set up a React Native/Expo TypeScript app and a Node.js/Express TypeScript backend. | AI-assisted; the specific tool is not recorded for this phase. | Reviewed package scripts and project layout; setup is reflected in the initial setup commits. |
| SQLite and backend foundation | Configure the API and local database. | Summary from task records and commits: initialize Express and SQLite, create the database structure, and seed fictional job data. | AI-assisted; the specific tool is not recorded for this phase. | Reviewed the database initialization, schema, and seed code in the backend. |
| Backend APIs | Provide authentication and jobs endpoints for the app. | Summary from task records and commits: implement auth and jobs APIs, controllers, services, and routes. | AI-assisted; the specific tool is not recorded for this phase. | Compared implemented routes and behavior with the documented API; used backend checks and API testing. |
| Authentication | Register and authenticate users, protect Saved Jobs, and persist the mobile session. | Verified summary of the requirement: use bcryptjs, signed JWTs with an environment-provided secret, Bearer-token middleware, appropriate error responses, and no password hashes in API responses. | AI-assisted; the specific tool is not recorded for this phase. | Reviewed auth, middleware, and SecureStore flows; authentication and protected API behavior were included in API testing. |
| Navigation | Connect the app’s main screens and navigation destinations. | Summary from task records and commits: establish React Navigation and initial screens, then connect Jobs, Profile, authentication, and job details flows. | AI-assisted; the specific tool is not recorded for this phase. | Checked navigation configuration and exercised navigation during Android testing. |
| Jobs and Search | List and search jobs and display job details. | Summary from task records and commits: integrate Jobs APIs, search, and Job Details; the implementation includes debounced search. | AI-assisted; the specific tool is not recorded for this phase. | Reviewed service routes and screen behavior; Search and Job Details were included in Android testing. |
| Saved Jobs and Profile | Support saving jobs and guest/authenticated profile states. | Summary from task records and commits: complete Saved Jobs and Profile integration, with protected save/unsave operations. | AI-assisted; the specific tool is not recorded for this phase. | Reviewed authenticated route protection and client state handling; Saved Jobs and Profile were included in API/Android testing. |
| Testing and corrections | Check behavior and address issues found during implementation. | Summary from task records: use Postman and Android testing, run TypeScript and lint checks, and refine logout and Saved Jobs refresh behavior. | AI-assisted; the specific tool is not recorded for this phase. | Retained task records report TypeScript checks and frontend lint were run; Android/Postman were used. Detailed test execution results are maintained separately. |
| Security and documentation | Review Git history and prepare assessment documentation. | Summary from task records: investigate SQLite WAL/SHM files in Git history, verify a cleanup workflow, and document the project. | VS Code AI Agent assistance is reflected in the available task records; earlier tool attribution for individual cleanup steps is not established. | Reviewed path/ref verification reports and documentation. No credentials, database records, or private backup locations are included here. |

## 5. AI-Generated Code and Manual Review

AI assistance was used across the frontend and backend work, including navigation and screen integration, API client and service work, authentication, SQLite-backed APIs, and Saved Jobs/Profile behavior. The project also contains developer-directed changes and subsequent refinements.

I treated generated or suggested code as a draft, not as automatically correct. I reviewed changes against the existing project structure and requirements, checked routes and configuration against the implementation, and used type checks, lint, API testing, and Android testing where applicable. The available Git commits document feature milestones; they do not identify the authorship of individual lines.

## 6. Issues and Corrections

### Logout reliability and Saved Jobs refresh

The commit history includes a correction titled “Fix logout reliability and Saved Jobs refresh.” The resulting implementation deletes the locally stored session before clearing in-memory authentication, prevents duplicate concurrent logout operations, reports a failed logout so it can be retried, and refreshes Saved Jobs when returning to that view.

This verifies that the behavior was corrected in the implementation. The detailed original failure report and exact corrective prompt are not preserved in the repository, so this document does not speculate about the initial symptom. Retained implementation notes report that frontend/backend TypeScript checks and frontend lint passed after the changes.

### SQLite runtime files in Git history

A Git history review found SQLite WAL/SHM runtime files in historical commits. Because database sidecars may contain sensitive application state, removing them only from the latest tree was not sufficient. The recorded cleanup workflow preserved backups outside the repository, rewrote history in a disposable mirror, checked that the targeted paths and affected refs were accounted for, compared the cleaned source tree, and pushed only the intended `main` branch using an explicit force-with-lease expectation.

The retained cleanup report states that the cleaned history and source-tree checks passed before the GitHub update. This document intentionally excludes database contents, sensitive object details, credentials, and backup locations. The history cleanup is an example of why AI-assisted analysis and proposed commands required careful human review and explicit verification before potentially destructive Git operations.

## 7. Testing and Validation

- **Backend API:** Postman was used to exercise the API, including authentication and jobs workflows.
- **Android functional and integration testing:** Android testing covered navigation, Login, Signup, Search, Job Details, Saved Jobs, and Profile flows.
- **Test plan:** Testing used the existing 57-case Android test plan. Its detailed execution records are maintained separately; this document does not claim that all cases passed or report pass/fail totals.
- **TypeScript and lint:** Frontend and backend TypeScript checks use `npx tsc --noEmit`; frontend lint uses `npm run lint`. Retained task notes report these checks were run, but standalone per-run reports are not included here.

## 8. Lessons Learned

- Different AI tools can support different parts of the work: planning and technical explanations, implementation suggestions, debugging, and verification assistance.
- Clear requirements and specific prompts make the suggestions more relevant and reduce ambiguity.
- AI-generated code and suggested commands still need careful review against the project and its security requirements.
- Incremental development makes changes easier to inspect, test, and correct.
- Manual API and Android testing complements TypeScript and lint checks; none of these alone proves the entire application works.
- Security-sensitive work, including authentication, local data, and Git history cleanup, requires explicit human verification and safe handling.
- Documentation should distinguish verified behavior from suggestions and report only test results supported by available records.

## 9. Limitations of AI Assistance

AI-generated code can misunderstand project conventions, omit edge cases, or produce commands whose effects depend on the repository state. It cannot establish that a feature works merely by generating code, and a commit message is not proof of test coverage or authorship. Historical conversation records and detailed test reports are incomplete, so some prompt history and test outcomes cannot be reproduced here.

For these reasons, I reviewed changes against the codebase, used tests and checks appropriate to the affected areas, and avoided reporting unverified prompt details or pass/fail results.
