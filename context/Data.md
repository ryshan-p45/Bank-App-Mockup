This file contains rules and guidelines for developing data and retrieval components of projects. 
## Retrieval Engineering 

- RAG (Retrieval Augmented Generation) is the standard pattern for giving an agent access to knowledge. The agent does not store facts — it retrieves them at query time and uses them as context.
- The retrieval pipeline has four stages that must each be explicitly implemented: chunking, embedding, retrieval, and reranking. Do not skip or combine stages implicitly.

**Chunking**
- Every document must be split into chunks before embedding. Do not embed whole documents.
- Chunk size must be chosen based on the embedding model's context window and the nature of the content. A chunk that is too large loses precision. A chunk that is too small loses context.
- Chunks must preserve semantic boundaries. Split at paragraph or section breaks where possible — never mid-sentence or mid-thought.
- Each chunk must store metadata alongside the vector: at minimum the source document identifier, the position of the chunk within the document, and a timestamp. This is required for tracing where a retrieved result came from.
- If a document has structure (headings, sections, tables), that structure must be reflected in how it is chunked. A table should not be split across chunks.
- For long documents where a single chunk may lack enough surrounding context, implement overlapping chunks — each chunk shares some content with the previous one to prevent information being lost at boundaries.

**Embedding**
- The same embedding model must be used at index time and at query time. Using different models for each will produce incompatible vector spaces and return incorrect results.
- Never embed raw unprocessed text. Clean the input first: remove irrelevant boilerplate, normalise whitespace, and strip content that adds noise without meaning (e.g. navigation menus, footers, repeated headers).
- Document the embedding model name and version used for a given index. If the model changes, the entire index must be rebuilt.
- Embedding models represent meaning based on their training data. Be aware of the model's domain — a general-purpose embedding model will perform poorly on highly technical or domain-specific content.

**Retrieval**
- Retrieval must be based on semantic similarity, not keyword matching, unless the query is explicitly structured (e.g. filtering by metadata field).
- Always retrieve more chunks than you intend to use. Retrieve a candidate set and then rerank — do not rely on the top-k results from vector search alone.
- Define the maximum number of chunks that will be passed into the LLM context. Passing too many chunks degrades response quality and increases cost.
- Metadata filters must be applied before vector search where possible, not after. Filtering after retrieval wastes compute and may exclude relevant results.
- If a query returns no results above the similarity threshold, return an explicit empty result — do not pass low-confidence chunks into context and allow the LLM to hallucinate from them.

**Reranking**
- A reranker must be applied after initial vector retrieval. Vector similarity alone is not sufficient to rank results by relevance to the specific query.
- The reranker must evaluate each candidate chunk against the full query, not just against an embedding. Use a cross-encoder model or equivalent for this step.
- After reranking, apply a relevance cutoff. Chunks below the cutoff score must be dropped even if they were in the top-k retrieval results.
- The number of chunks passed to the LLM after reranking must be the minimum needed to answer the query. More context is not always better — it increases noise and cost.
- Log retrieval and reranking results during development. Record what was retrieved, what score each chunk received, and what was passed into context. This is the primary tool for debugging poor agent responses.

## SQL Queries 

- Every query must be parameterised. Never concatenate user input directly into a SQL string — this is a critical security vulnerability.
- Select only the columns you need. Never use `SELECT *` in production queries — it increases data transfer, breaks when schema changes, and makes queries harder to understand.
- Every query that can return multiple rows must have an explicit `LIMIT` clause unless a full table scan is intentional and documented.
- Joins must be explicit. Always specify the join type (`INNER`, `LEFT`, etc.) — never rely on implicit join behaviour.
- Queries used by agents must return structured, predictable output. If a query can return nulls, the consuming code must handle nulls explicitly — do not let them propagate silently.
- Indexes must exist on every column used in a `WHERE`, `JOIN`, or `ORDER BY` clause in a frequently run query. Missing indexes are the most common cause of slow queries at scale.
- Never run schema migrations inside application code at runtime. Migrations must be versioned, tracked, and run as a separate controlled step.
- Every query that writes data (`INSERT`, `UPDATE`, `DELETE`) must be wrapped in a transaction where more than one operation is involved. Partial writes must not be possible.
- Long-running queries must have a query timeout set at the database connection level. An agent must not be able to block on a query indefinitely.
- When an agent generates or constructs a SQL query dynamically, the query must be validated against a strict allowlist of permitted operations before execution. Agents must not be able to run `DROP`, `TRUNCATE`, or `ALTER` statements.