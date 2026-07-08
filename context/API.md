## API Design Rules & Guidelines

**API Structure**
- Every endpoint must have a single, clearly defined purpose. An endpoint that does different things based on a flag or mode parameter must be split into separate endpoints.
- Use nouns for resource names, not verbs. `/invoices` is correct. `/getInvoices` is not.
- Use HTTP methods to express intent: `GET` to read, `POST` to create, `PUT` or `PATCH` to update, `DELETE` to remove. Never use `GET` for an operation that writes or deletes data.
- Use `PUT` for full replacement of a resource and `PATCH` for partial updates. Do not use them interchangeably.
- Nest resources only one level deep where possible. `/invoices/{id}/items` is acceptable. `/invoices/{id}/items/{itemId}/notes/{noteId}` is too deep — flatten it.
- Every endpoint must return a consistent response envelope. Define a standard structure for success responses and error responses and use it across the entire API without exception.

**Request & Response Design**
- Every request that accepts a body must validate that body before processing. Return a `400` with a descriptive error if validation fails — do not attempt to process invalid input.
- Response bodies must be typed and documented. Every field must have a defined name, type, and description. Optional fields must be explicitly marked as optional.
- Never return different response shapes for the same endpoint depending on conditions. If an endpoint can return two different shapes, it is two different endpoints.
- Dates and times must always be returned in ISO 8601 format (`2025-05-14T10:00:00Z`) and always in UTC. Never return locale-formatted dates from an API.
- Monetary values must be returned as integers in the smallest currency unit (e.g. cents, not dollars). Never return floats for money.
- Null and missing are not the same. A field explicitly set to `null` means the value is known to be empty. A missing field means the value was not included. Use them intentionally and consistently.
- Paginate every endpoint that can return more than one record. Define a consistent pagination pattern across the API — either cursor-based or offset-based — and do not mix them.

**Status Codes**
- Use status codes precisely and consistently:
    - `200` — request succeeded and a body is returned
    - `201` — resource was created
    - `204` — request succeeded with no body to return
    - `400` — client sent invalid input
    - `401` — client is not authenticated
    - `403` — client is authenticated but does not have permission
    - `404` — resource does not exist
    - `409` — conflict with current state (e.g. duplicate record)
    - `422` — input is valid in format but invalid in logic
    - `429` — client has exceeded rate limits
    - `500` — something failed on the server
- Never return a `200` with an error inside the body. If the request failed, the status code must reflect that.

**Versioning & Contracts**
- Every API must be versioned from the first release. Use URL versioning: `/v1/invoices`. Do not version via headers or query parameters.
- A published API contract must not have breaking changes applied to it. Breaking changes require a new version.
- A breaking change is: removing a field, changing a field's type, changing a field's name, or changing the behaviour of an endpoint. Adding a new optional field is not a breaking change.
- Deprecated endpoints must remain functional for a defined period before removal. Document the deprecation date and the replacement in the response headers and API documentation.

**Rate Limiting & Performance**
- Every public or agent-facing API must enforce rate limits. Return `429` with a `Retry-After` header when a client exceeds the limit.
- Every endpoint must have a defined maximum response time. Endpoints that may be slow must be made asynchronous — accept the request, return a job ID, and provide a separate endpoint to poll for the result.
- Expensive queries must never be triggered by a simple `GET` request without caching. Cache responses at the appropriate layer and document the cache TTL.