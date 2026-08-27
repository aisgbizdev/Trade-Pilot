---
name: Orval query options need queryKey
description: Generated orval React Query hooks require an explicit queryKey when you override any query option in this monorepo.
---

When calling an orval-generated `useGet*` hook with a `query: {...}` options object, you must also pass `queryKey` — use the generated `get*QueryKey(params)` helper. Without it, typecheck fails with `Property 'queryKey' is missing in type ... but required in type 'UseQueryOptions<...>'`.

**Why:** The orval generator in this repo emits the React Query options type with `queryKey` as required (it does not default it for overrides). The runtime falls back to the auto-generated key, but TypeScript does not know that.

**How to apply:**
- Import both the hook and its query-key getter from `@workspace/api-client-react`:
  `import { useGetFoo, getGetFooQueryKey } from "@workspace/api-client-react";`
- Always set `query.queryKey: getGetFooQueryKey(params)` when overriding any other query option (`staleTime`, `refetchOnWindowFocus`, etc.).
- When mocking `@workspace/api-client-react` in a vitest file, mock both the hook and the matching `get*QueryKey` getter, or any component that imports the getter will throw at module load.
