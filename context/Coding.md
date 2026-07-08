This file outlines general rules and guidelines to follow when writing code.
## Documentation 

- Any block code that is written should have structured comments that explains how it works. 
- Comments should be concise and not verbose. But written to be easily understandable for someone less experienced. 
- Existing comments in blocks of code should not be erased when new code is generated unless the functionality is completely changed or replaced. 

## Code Design

- Prefer explicit over implicit. Avoid hidden state or logic that isn't immediately traceable.
- Break complex conditional logic into named functions that describe what they do in plain language.
- Avoid deep nesting. If a block exceeds 3 levels of indentation, refactor it.
- Isolate side effects (API calls, writes, sends) into their own functions. Never inline them inside logic or UI code.
- Do less rather than more when scope is unclear. A focused solution is easier to extend than an over-engineered one.

## Error Handling

- Catch errors as close to their origin as possible. Do not swallow them silently at the top level.
- Every error message shown to a user must say what went wrong and what they can do next.
- Every caught error must log enough context for a developer to reproduce it — include the function name, inputs, and the error message.
- Classify errors explicitly: can the agent recover on its own, does it need user input, or does it need a developer?

## Security

- Never hardcode API keys, secrets, or tokens. Always read them from environment variables.
- Never log passwords, tokens, or personally identifiable information (PII), including in development.
- Validate and sanitize all external inputs before use. Treat them as untrusted by default.
- Any action with a real-world consequence (sending a message, deleting a record, making a payment) must be explicitly confirmed before execution and must not be assumed from context.

## Agent Behavior

- State your assumptions before acting. If a request is ambiguous, pick the most reasonable interpretation, state it, then proceed.
- Ask for clarification only when two interpretations would produce meaningfully different code or outcomes. Do not ask for information you can reasonably infer.
- Escalate to a human when: an action is irreversible, the confidence in the correct path is low, or the user has expressed frustration more than once.
- Prefer reversible actions over irreversible ones. If both paths achieve the goal, take the one that can be undone.
- Never silently skip a requirement. If something cannot be done, say so and explain why.

## Product Thinking 

- The end user is a human, not a developer. When generating UI text, error messages, labels, or any copy that a user will read, write for clarity and plain language — not technical accuracy.
- A feature is not complete when the code works. It is complete when a user can accomplish the intended task without confusion or additional help.
- Every input a user can interact with must have a clear purpose. Do not generate UI elements, fields, or options that have no immediate function.
- When building a flow with multiple steps, every step must have a clear way to go back or cancel. Never trap a user in a state they cannot exit.
- Empty states are part of the product. When a list, dashboard, or feed has no data, generate a message that tells the user why it is empty and what they can do next.
- Loading states are part of the product. Any action that takes time must show feedback that something is happening.
- Do not optimize for the happy path only. For every feature, consider: what happens if the data is missing, the request fails, or the user does something unexpected?
- When a destructive action is triggered (delete, remove, disconnect), always generate a confirmation step with a clear description of what will be lost.
- Accessibility is not optional. Generated UI must use semantic HTML, include alt text for images, and ensure interactive elements are keyboard accessible.
- If a feature requires a user to understand something technical to use it, that is a design problem. Solve it at the UI or copy level before surfacing it to the user.