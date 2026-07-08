This file provides rules and guidelines for system architecture for projects. 

## System Design 

- Every system must have a clearly defined role for each component. LLMs make decisions, tools execute actions, databases store state, and sub-agents handle delegated tasks. Do not mix these responsibilities.
- Data flow must be explicit and traceable. For every feature, be able to answer: where does the data come from, what transforms it, where does it go, and where is it stored?
- Each component must be treated as a potential failure point. For every component in the system, define what happens if it becomes unavailable — the system must not have undefined behavior when a component fails.
- Sub-agents and models must have a single, clearly scoped responsibility. A sub-agent that does too many things becomes unpredictable and hard to debug.
- State must live in the database, not in the agent. An agent that holds state in memory cannot be restarted, scaled, or recovered without data loss.
- When multiple models or sub-agents are involved, define the handoff contract explicitly: what is passed, in what format, and what the receiving agent is expected to do with it.
- Never assume a component is available. Design every integration point with the assumption that the other side can fail, be slow, or return unexpected data.

## Tool and Contract Design

- Every tool must have an explicit contract that defines its inputs, outputs, and error states. A tool without a contract will be used incorrectly.
- Input contracts must specify: the name of each parameter, its type, whether it is required or optional, and any constraints on its value (e.g. max length, allowed values).
- Output contracts must specify: the structure of a successful response and the structure of an error response. Both must be defined — not just the happy path.
- Never leave a contract field vague or loosely typed. If a field is ambiguous, the LLM will infer its meaning and that inference will be wrong in edge cases.
- Tool names and parameter names must be descriptive and unambiguous. A tool called `process()` with a parameter called `data` has no contract. A tool called `sendInvoiceEmail()` with a parameter called `invoiceId` does.
- A tool must do one thing. If a tool has branching behavior based on a mode or type parameter, split it into separate tools.
- Tools must never return raw internal errors to the LLM. Catch internal errors and return a structured error response that matches the contract.
- If a tool's output changes shape depending on conditions, that is two different outputs — define both explicitly in the contract.

## Reliability Engineering 

- Every external API call must have a timeout. Define the maximum time to wait and what happens when that time is exceeded.
- Every external API call must have retry logic. On failure, retry with exponential backoff — wait longer between each attempt rather than retrying immediately.
- Set a maximum retry limit. After a defined number of retries, stop and return a structured failure — do not retry indefinitely.
- Implement circuit breakers on external dependencies. If a service fails repeatedly within a time window, stop calling it for a defined period before trying again. This prevents cascading failures across the system.
- Every integration point must have a fallback. Define what the system returns or does when an external service is unavailable — even if the fallback is a clear error message to the user.
- Distinguish between retryable and non-retryable errors. A network timeout is retryable. A 400 bad request is not — retrying it will always fail and wastes resources.
- Log every failure with the service name, the error returned, the number of retries attempted, and the final outcome.
- Never let an agent hang on a blocked call. All async operations must have a timeout and a defined behavior when that timeout is hit.
- Test failure paths explicitly. For every external dependency, write or document what happens when it returns a failure, a timeout, and an unexpected response shape.