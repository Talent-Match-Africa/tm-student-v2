# Performance Optimization

Server render initial pages and send only required records to client
components. Keep filters and pagination bounded by API limits. Avoid client
waterfalls and duplicate profile requests. Lazy-load feature-heavy dialogs and
charts when introduced.

Use `next/image` for public media, stable dimensions for cards and skeletons,
and route-level loading files. Private API responses use `no-store`; never
cache signed document access.
