---
name: Mobile Expo auth pattern
description: How the Trade Pilot mobile app authenticates with the api-server and patterns to follow for future screens.
---

## Auth model
- api-server uses opaque session tokens. login/register return `{ token, user }` in the response body.
- Mobile stores token in AsyncStorage via `AuthContext`. Token is given to `setAuthTokenGetter` so all generated hooks attach `Authorization: Bearer <token>` automatically.
- Logout calls `POST /api/auth/logout` directly (raw fetch) before calling `signOut()` to clear local state.

## Generated mutation hook calling convention
All orval-generated mutation hooks wrap the body in `{ data: Body }`:
```ts
mutate({ data: { instrument, timeframe, mode } });
```
NOT `mutate({ instrument, timeframe, mode })`. This applies to useLogin, useRegister, useCreateAnalysis, etc.

## CreateAnalysisBody requirements
`mode` is required (not optional) in `CreateAnalysisBody`. Always pass `user?.selectedMode ?? "beginner"` from AuthContext.

## Route paths
- Use `"/(tabs)"` not `"/(tabs)/"` for Redirect and router.replace — the typed routes system rejects the trailing slash.

## Colors
- `useColors()` returns `{ ...palette, radius }` — the `radius` key (14px brand radius) is returned alongside color tokens.
- Light primary: `#a86c05`, Dark primary: `#f5c518` (gold).

## LangContext
- Language preference stored in AsyncStorage key `@trade_pilot_lang`.
- `useLang()` returns `{ lang, t, setLang }` — `t` is the full locale object matching `Locale` type from `locales/en.ts`.

**Why:** These patterns are non-obvious from the generated API and will trip up future screens if not followed.
