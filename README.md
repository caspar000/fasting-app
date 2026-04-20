# Fasting App

## Stack

- Expo SDK 55 (React 19, RN 0.83, React Compiler)
- expo-router (file-based)
- NativeWind 4 + Tailwind (CSS-var-driven light/dark theming)
- Zustand (UI state, persisted via expo-secure-store)
- React Query (server/async state)
- Drizzle ORM + expo-sqlite (local database)
- Inter font family via @expo-google-fonts/inter

## Layout

```
app/                # Routes (expo-router)
  _layout.tsx       # Providers, font loading, splash
  global.css        # Tailwind entry + CSS vars for light/dark
  (tabs)/           # Tab navigator (Home, Settings)
  +not-found.tsx
src/
  core/             # Theme tokens, constants
  stores/           # Zustand stores
  providers/        # React context providers
  data/database/    # Drizzle client + schema
  hooks/            # Shared hooks
  features/         # Feature modules (components/ + hooks/)
  components/       # Shared primitives
```

## Cloning for a new app

1. Copy the repo; rename in `package.json`, `app.json` (name, slug, scheme, bundle IDs).
2. Replace palette values in `src/core/theme/colors.ts` and `app/global.css`.
3. Define tables in `src/data/database/schema/`, then:
   - `pnpm db:generate` to emit migrations
   - Swap the short-circuit in [src/providers/database-provider.tsx](src/providers/database-provider.tsx) for the commented `useMigrations(db, migrations)` call
4. Add feature modules under `src/features/`.

## Scripts

- `pnpm start` — Metro
- `pnpm ios` / `pnpm android` — dev build
- `pnpm lint` — expo lint
- `pnpm db:generate` — Drizzle migrations
