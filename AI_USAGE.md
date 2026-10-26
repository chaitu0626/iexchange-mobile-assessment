# AI Usage in the iExchange Assessment

## 1. Overview

I used ChatGPT, Cursor, and the VS Code AI Agent as development assistants while building the iExchange full-stack mobile assessment. They supported planning, coding, debugging, codebase inspection, and documentation in different ways. I retained responsibility for implementation decisions, testing, reviewing suggested changes, and final verification.

This document distinguishes the supplied implementation notes and original prompt excerpts from details that cannot be confirmed. The supplied combined implementation document contains selected prompts and the 57-case test plan, but not a complete history of every prompt or detailed execution records for every test case.

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

The table summarizes documented objectives using the supplied implementation document and repository. Entries are **verified summaries, not reconstructed verbatim prompts**. The supplied document identifies its quoted AI prompts as instructions to the VS Code AI Agent. For other phases, the available records do not reliably map ChatGPT or Cursor to a specific task, so those rows remain labeled AI-assisted. Commit history identifies milestones but does not prove which tool generated particular code.

| Development phase | Objective | Verified prompt/task summary | Tool attribution and AI contribution | Developer verification |
|---|---|---|---|---|
| Project setup | Establish the mobile and backend project structure. | Summary from task records: set up a React Native/Expo TypeScript app and a Node.js/Express TypeScript backend. | AI-assisted; the specific tool is not recorded for this phase. | Reviewed package scripts and project layout; setup is reflected in the initial setup commits. |
| SQLite and backend foundation | Configure the API and local database. | Summary from task records and commits: initialize Express and SQLite, create the database structure, and seed fictional job data. | VS Code AI Agent prompts are documented for backend setup and Jobs database work. | Reviewed the database initialization, schema, and seed code in the backend. |
| Backend APIs | Provide authentication and jobs endpoints for the app. | Summary from task records and commits: implement auth and jobs APIs, controllers, services, and routes. | VS Code AI Agent prompts are documented for the Jobs APIs and authentication backend. | Compared implemented routes and behavior with the documented API; used backend checks and API testing. |
| Authentication | Register and authenticate users, protect Saved Jobs, and persist the mobile session. | Verified summary of the requirement: use bcryptjs, signed JWTs with an environment-provided secret, Bearer-token middleware, appropriate error responses, and no password hashes in API responses. | VS Code AI Agent authentication prompt is documented below. | Reviewed auth, middleware, and SecureStore flows; authentication and protected API behavior were included in API testing. |
| Navigation | Connect the app’s main screens and navigation destinations. | Summary from task records and commits: establish React Navigation and initial screens, then connect Jobs, Profile, authentication, and job details flows. | A VS Code AI Agent navigation prompt is present in the supplied source document; it is not reproduced below. | Checked navigation configuration and exercised navigation during Android testing. |
| Jobs and Search | List and search jobs and display job details. | Summary from task records and commits: integrate Jobs APIs, search, and Job Details; the implementation includes debounced search. | A VS Code AI Agent Jobs integration prompt is present in the supplied source document; it is not reproduced below. | Reviewed service routes and screen behavior; Search and Job Details were included in Android testing. |
| Saved Jobs and Profile | Support saving jobs and guest/authenticated profile states. | Summary from task records and commits: complete Saved Jobs and Profile integration, with protected save/unsave operations. | A VS Code AI Agent Saved Jobs prompt is documented; Profile phase attribution is not separately recorded. | Reviewed authenticated route protection and client state handling; Saved Jobs and Profile were included in API/Android testing. |
| Testing and corrections | Check behavior and address issues found during implementation. | Summary from task records: use Postman and Android testing, run TypeScript and lint checks, and refine logout and Saved Jobs refresh behavior. | VS Code AI Agent prompt is documented for the final three-issue correction; no specific tool is attributed to the broader testing phase. | Retained task records report TypeScript checks and frontend lint were run; Android/Postman were used. Detailed test execution results are maintained separately. |
| Security and documentation | Review Git history and prepare assessment documentation. | Summary from task records: investigate SQLite WAL/SHM files in Git history, verify a cleanup workflow, and document the project. | VS Code AI Agent prompts are documented for the read-only audit and cleanup preflight; tool attribution for other documentation work is not established. | Reviewed path/ref verification reports and documentation. No credentials, database records, or private backup locations are included here. |

### Actual AI Prompts

The following are verbatim excerpts from the supplied `iExchange.docx`, which contains the combined implementation, prompt, and test-case material. The document identifies these prompts as instructions given to the VS Code AI Agent. Excerpts are kept short for readability; no wording has been reconstructed.

#### Backend Express and SQLite setup

**Tool:** VS Code AI Agent
**Purpose:** Establish the backend structure and core server/database modules.

> Set up the backend using Express and SQLite (better-sqlite3).
>
> Create a clean backend folder structure with routes, controllers, services, and database modules.

**Result and verification:** The implementation notes describe the backend foundation, database initialization, health endpoint, and centralized error handling. The resulting backend structure and scripts were reviewed; later backend TypeScript checks were recorded.

#### Jobs database, seeding, and REST endpoints

**Tool:** VS Code AI Agent
**Purpose:** Add SQLite jobs and saved-jobs tables, seed fictional listings, and implement jobs endpoints.

> Implement the Jobs backend for my iExchange-inspired React Native assessment.
>
> Seed 12 realistic fictional job listings. Avoid duplicate records when the server restarts.
>
> Ensure /api/jobs/saved is registered before /api/jobs/:id to prevent route conflicts.

**Result and verification:** The supplied implementation notes report 12 seeded jobs, a `React` search returning four jobs, successful lookup by a valid ID, and HTTP 404 for an invalid job ID. These are reported results in the source document, not a separately attached raw Postman export.

#### JWT authentication and registration/login

**Tool:** VS Code AI Agent
**Purpose:** Add secure registration/login and protect the existing Saved Jobs APIs.

> Implement authentication in my existing Node.js + Express + TypeScript + SQLite backend.
>
> Hash passwords using bcryptjs. Never store plaintext passwords.
>
> Never return password hashes in API responses.

**Result and verification:** The implementation notes describe registration, login, password hashing, JWT authentication, and protected routes. They report that authentication requests were tested using Postman and registration/login were subsequently verified after the route issue below was corrected.

#### Registration endpoint returned HTTP 404

**Tool:** VS Code AI Agent
**Purpose:** Investigate why registration returned 404 while the jobs endpoint worked.

> My Node.js + Express + TypeScript backend is returning 404 for POST /api/auth/register.
>
> The existing GET /api/jobs endpoint works correctly.
>
> Please investigate and fix this issue.

**Result and verification:** The supplied notes say the authentication route configuration and implementation were corrected. They do not establish a more specific root cause. Registration and login were subsequently verified using Postman, as reported in those notes.

#### Final three-issue correction

**Tool:** VS Code AI Agent
**Purpose:** Correct tracked SQLite sidecars, logout ordering, and missed Saved Jobs refresh without redesigning the app.

> Fix the three identified issues from the final code review of my iExchange React Native full-stack application.
>
> The project is already working. Do not redesign screens or add features.
>
> If deletion fails, the app incorrectly shows Guest Profile.
>
> Only switch to Guest Profile after secure deletion succeeds.
>
> Refresh Saved Jobs when the Jobs bottom tab gains focus and Saved Jobs is selected.

**Result and verification:** The changes added WAL/SHM ignore patterns and removed the sidecars from Git tracking without deleting the local files; changed logout to delete the SecureStore session before clearing in-memory auth and permit retry on failure; and refreshes Saved Jobs when its parent tab regains focus. The recorded checks after this correction were frontend and backend `npx tsc --noEmit` and frontend `npm run lint`; the task notes report those checks passed.

#### Git history security audit and cleanup preflight

**Tool:** VS Code AI Agent
**Purpose:** Inspect database runtime files in history and plan a safe, approval-gated cleanup.

> Perform a read-only Git security audit for my iExchange assessment repository.
>
> Do not print any passwords, password hashes, JWTs, or private user data.
>
> Help me safely clean sensitive SQLite runtime files from the Git history of my iExchange assessment repository.
>
> Stop after the preflight report and wait for my approval.

**Result and verification:** The audit identified WAL/SHM files in history and cautioned that removing them only from the latest tree would not remove prior versions. After explicit approval, the cleanup record states that backups were verified, history was rewritten in a disposable mirror, affected refs and source-tree preservation were checked, and only the intended `main` branch was updated using explicit `--force-with-lease` protection. No private backup locations or database contents are reproduced here.

## 5. AI-Generated Code and Manual Review

AI assistance was used across the frontend and backend work, including navigation and screen integration, API client and service work, authentication, SQLite-backed APIs, and Saved Jobs/Profile behavior. The project also contains developer-directed changes and subsequent refinements.

I treated generated or suggested code as a draft, not as automatically correct. I reviewed changes against the existing project structure and requirements, checked routes and configuration against the implementation, and used type checks, lint, API testing, and Android testing where applicable. The available Git commits document feature milestones; they do not identify the authorship of individual lines.

### Developer responsibility

I specified the feature requirements, supplied follow-up issue reports (including the registration 404 and the three final corrections), inspected the implementation, and requested targeted changes rather than accepting a broad redesign. The supplied implementation notes report that I tested APIs using Postman and tested the Android application. I also reviewed the security findings and required verified backups, a disposable-mirror cleanup, and checks before approving the history update. The records support those actions, but do not establish that every generated change was correct or that every Android test case passed.

## 6. Issues and Corrections

### Registration endpoint returned 404

The supplied implementation notes report that `POST /api/auth/register` initially returned HTTP 404 while `GET /api/jobs` worked. The investigation checked the Express app and route registration, including whether authentication routes and controllers existed. The notes say the authentication route configuration and implementation were corrected, but do not identify a narrower root cause. The notes subsequently report successful registration and login verification in Postman.

### Logout reliability and Saved Jobs refresh

The supplied issue report identified that logout cleared in-memory authentication before deleting the session from SecureStore, which could show Guest Profile if deletion failed. It also reported that returning to the Jobs bottom tab could miss a Saved Jobs refresh when that subtab was already selected. The targeted correction prompt requested SecureStore deletion before clearing authentication, preservation of auth state with an error/retry on deletion failure, avoidance of duplicate logout requests, and refresh on Jobs-tab focus while Saved Jobs is selected.

The resulting code implements those behaviors. The correction record lists frontend and backend `npx tsc --noEmit`, frontend `npm run lint`, Git status, and confirmation that SQLite runtime files were no longer tracked; retained task notes report the TypeScript and lint checks passed. This documents the recorded verification, not a claim that unrelated behavior was exhaustively tested.

### SQLite runtime files in Git history

A security review identified SQLite WAL/SHM runtime files in Git history. Removing them from the latest commit alone was insufficient because earlier versions remained in history. Before rewriting, backups were created and verified. The cleanup was performed in a disposable mirror; checks covered the targeted paths, relevant refs, and preservation of the source tree. After verification and approval, GitHub `main` was updated with explicit `--force-with-lease` protection.

The cleanup record reports that the mirror checks passed before the update. This document intentionally excludes database contents, credentials, and backup locations. The history cleanup demonstrates why AI-assisted analysis and commands for destructive Git operations required review, verified backups, and explicit approval.

## 7. Testing and Validation

- **Backend API:** The supplied notes report Postman checks for registration/login and jobs APIs. They record fetching 12 seeded jobs, a `React` search returning four matches, valid job details retrieval, invalid job ID returning 404, and registration/login succeeding after the 404 correction. Detailed raw Postman results are not attached.
- **Android functional and integration testing:** The supplied notes and developer report describe Android testing across application/navigation, authentication, jobs/search/details, Saved Jobs, and Profile flows.
- **Test plan:** The supplied document includes 57 Android test cases and their expected results. It explicitly states that execution status must be recorded separately; detailed per-case results were not supplied. No pass/fail totals are claimed.
- **TypeScript and lint:** The correction records call for frontend and backend `npx tsc --noEmit` and frontend `npm run lint`; retained task notes report those checks passed after the logout/Saved Jobs correction. The supplied implementation notes also report frontend static checks passed. Per-run logs are not attached.

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
