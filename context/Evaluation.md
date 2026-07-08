
## Observability and Logging

**Logging**
- Every log entry must include: a timestamp in UTC, a severity level, the service or agent name, and a correlation ID that can be used to trace the request across components.
- Use consistent severity levels and apply them precisely:
    - `DEBUG` — detailed internal state useful during development only
    - `INFO` — normal operations and significant state changes
    - `WARN` — unexpected but recoverable situations
    - `ERROR` — failures that require attention
    - `FATAL` — failures that cause the system to stop
- Never log credentials, tokens, passwords, or PII. This applies to all environments including development and staging.
- Every external API call must produce a log entry that includes: the service called, the action attempted, the response status, and the response time.
- Every agent decision must be logged with enough context to understand why it was made: what input was received, what the agent interpreted, and what action it took.
- Logs must be structured (JSON format). Do not write freeform log strings that cannot be parsed or queried.

**Tracing**
- Every request that passes through more than one component must carry a correlation ID from entry to exit. This ID must be generated at the entry point and passed through every downstream call.
- When an agent calls a sub-agent or tool, the correlation ID must be passed to the child call. Every log entry in the chain must reference the same ID.
- Trace the full lifecycle of every agent action: when it was received, when each tool was called, when each tool responded, and when the final output was returned.

**Metrics**
- Every agent and service must expose the following core metrics: request count, error rate, and response time (p50, p95, p99).
- Track and alert on: error rate exceeding a defined threshold, response time exceeding the defined SLA, retry rate increasing above baseline, and circuit breaker state changes.
- External dependency health must be tracked separately from internal service health. A slow third-party API must be distinguishable from a slow internal service in your metrics.

**Alerting**
- Alerts must be actionable. Do not create an alert that fires without a defined response procedure.
- Every alert must have a severity, an owner, and a defined escalation path.
- Alert on anomalies, not just thresholds. A sudden drop in request volume is as worth alerting on as a spike in errors.

## Testing and Evaluation

**General**
- Every piece of code that contains logic must have a corresponding test. Untested logic is undefined behaviour in production.
- Tests must be independent. A test must not rely on the output or state of another test to pass.
- Tests must be deterministic. A test that passes sometimes and fails other times is not a valid test — fix or remove it.
- Test file structure must mirror source file structure. A test for `invoiceService.js` lives at `invoiceService.test.js` in the same or parallel directory.

**Agent & LLM Testing**
- Agent behaviour must be tested with fixed, deterministic inputs. Do not test against live LLM calls in automated test suites — responses are non-deterministic and will cause flaky tests.
- Test the tool layer independently of the LLM. Every tool must have unit tests that verify it behaves correctly given valid input, invalid input, and failure conditions.
- Maintain an eval set: a collection of real or representative inputs with defined expected outputs or behaviours. Run this set on every significant change to a prompt, model, or retrieval pipeline.
- When an agent produces a wrong or unexpected output in production, that case must be added to the eval set before the fix is implemented.
- Test retrieval pipelines independently: given a known query, verify that the expected chunks are retrieved and ranked correctly.