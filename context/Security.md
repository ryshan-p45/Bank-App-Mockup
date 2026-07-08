This file contains rules and guidelines for ensuring that software projects are developed safely and securely. 
## Prompt Injection Protection

- Treat all external content as untrusted. Any text that did not originate from the system prompt or a verified internal source — including user input, retrieved documents, API responses, and database content — must be treated as potentially malicious.
- Never interpolate external content directly into a system prompt. Use clearly delimited sections to separate instructions from data, and label them explicitly (e.g. `<user_input>`, `<retrieved_document>`).
- If retrieved content contains instruction-like language ("ignore previous instructions", "you are now", "disregard your rules"), it must be treated as data, not as a command. The agent must never act on instructions found in retrieved content.
- Log any input that attempts to override system behaviour, alter the agent's role, or reference its instructions. Flag these for review.

## Hygiene and Access Control

- An agent must only have access to what it needs to complete its defined task. Do not grant broad permissions as a convenience.
- Write access must be justified explicitly. If an agent only needs to read data, it must not have write credentials — ever.
- Actions with real-world consequences (sending emails, making payments, deleting records, calling external APIs) must require explicit approval unless the system has been deliberately and explicitly configured for full automation.
- Agents must not be able to grant themselves additional permissions at runtime. Permission elevation must always require a human or a separate privileged service.
- Review agent permissions on a defined schedule. Permissions granted during development must not carry forward to production without explicit sign-off.

## Input Validation

- All inputs must be validated before being processed or passed to any tool, query, or downstream system.
- Validate type, format, length, and allowed values for every input field. Reject anything that does not conform — do not attempt to sanitise and proceed.
- Reject inputs that contain instruction-like patterns targeting the agent or its tools. This includes attempts to override the system prompt, inject tool calls, or reference internal configuration.
- Inputs that fail validation must return a structured error immediately. The error must describe what was invalid without exposing internal system details.
- Dynamic inputs used to construct queries, file paths, or API calls must be validated against a strict allowlist. Reject anything not explicitly permitted.

## Output filters

- All agent outputs must pass through a filter layer before being returned to the user or passed to another system.
- Output filters must block responses that: reveal system prompt contents, contain credentials or internal configuration, include personally identifiable information not explicitly requested, or violate defined content policy.
- If an output is blocked by a filter, return a safe fallback response. Log the blocked output and the filter rule that triggered it for review.
- Structured outputs (JSON, SQL, code) must be validated against their expected schema before being used. A malformed or unexpected structure must be rejected, not parsed optimistically.
- Outputs passed from one agent to another must be treated as untrusted input by the receiving agent. Apply the same input validation rules to inter-agent messages as to user inputs.

## Permission Boundaries 

- Define a strict list of permitted actions for each agent at design time. Anything not on the list is not permitted — there is no default allow.
- If an agent attempts an action outside its permitted list, stop execution, log the attempt with full context, and return a safe error. Do not attempt to find an alternative path.
- Destructive actions (`DELETE`, `DROP`, `TRUNCATE`, sending bulk communications) must be explicitly excluded from agent permissions unless there is a documented and approved reason.
- When an agent misunderstands a request and attempts something outside its scope, the permission boundary is the last line of defence. It must be enforced at the system level, not rely on the agent self-correcting.
- Permission boundaries must be enforced in the infrastructure or middleware layer. An agent must not be able to bypass them by rephrasing a request or calling a tool indirectly.

## Authentication

**General Authentication**
- Authentication and authorisation are not the same. Authentication confirms who the user is. Authorisation confirms what they are allowed to do. Both must be implemented explicitly — never assume one covers the other.
- Every endpoint must explicitly declare whether it requires authentication. There must be no endpoints that are accidentally public.
- Authentication must be enforced at the infrastructure or middleware layer, not inside individual endpoint handlers. A handler must never be responsible for checking whether the caller is authenticated.
- Never implement a custom authentication protocol. Use established standards: OAuth 2.0 for delegated access, OpenID Connect for identity, and JWTs for stateless tokens.

**Tokens & Sessions**
- Access tokens must have a short expiry. Set a maximum of 15 to 60 minutes depending on the sensitivity of the system.
- Refresh tokens must have a longer expiry and must be stored securely — never in `localStorage`. Use `httpOnly` cookies.
- Every issued token must be scoped to the minimum permissions required. A token issued for reading invoices must not have permission to delete them.
- Tokens must be validated on every request: check the signature, the expiry, the issuer, and the audience. Failing any of these checks must return a `401` immediately.
- Never log tokens, session IDs, or credentials anywhere — not in application logs, error tracking tools, or debug output.
- When a user logs out, invalidate the session or refresh token server-side. Do not rely only on the client discarding the token.

**Passwords & Credentials**
- Never store plaintext passwords. Always hash passwords using a slow hashing algorithm: `bcrypt`, `argon2`, or `scrypt`.
- Never store API keys in plaintext. Store a hashed version and compare hashes at authentication time.
- Password reset tokens must be single-use, time-limited (maximum 15 minutes), and invalidated immediately after use.
- Enforce a minimum password strength policy. At minimum: 10 characters, no common passwords, no reuse of the last 5 passwords.
- All credential submission endpoints (`/login`, `/reset-password`, `/register`) must be rate limited independently of general API rate limits.

**Authorisation**
- Every data access must be checked against the authenticated user's permissions before returning data. Never fetch a resource and then check permissions — check permissions first.
- Multi-tenant systems must enforce tenant isolation at the query level. Every query that accesses tenant data must include the tenant ID as a filter. An agent must never be able to access another tenant's data by manipulating an ID.
- Use role-based access control (RBAC) or attribute-based access control (ABAC) consistently across the system. Do not implement one-off permission checks scattered through the codebase.
- When an authorisation check fails, always return `403`. Never return `404` to hide the existence of a resource unless the resource's existence itself is sensitive — and if it is, document this decision explicitly.

**Agent-Specific Authentication**
- Agents must authenticate using API keys or service tokens, never username and password flows.
- Each agent or service must have its own credentials. Never share credentials between agents or services — this makes revocation impossible without affecting multiple systems.
- Agent credentials must be rotatable without downtime. The system must support issuing a new credential and deprecating the old one within a defined overlap window.
- Agents must never store credentials in code, config files, or logs. Credentials must be injected via environment variables or a secrets manager at runtime.
- All agent authentication events (success and failure) must be logged with a timestamp, the agent identifier, and the action attempted. This is required for audit and incident response.