# Error Handling

Normalize API failures before rendering. Internal, database, stack, host, and
environment details are replaced with safe status-specific messages.

Show field validation beside the relevant control. Show recoverable loading and
mutation failures inline without discarding user input. Use success toasts for
confirmed mutations and dialogs only for confirmation or workflow-blocking
errors.

Explicitly support `400`, `401`, `403`, `404`, `409`, `413`, `422`, `429`,
`500`, and `503`. Prevent repeated submissions while a mutation is pending.
