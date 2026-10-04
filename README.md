# Fasting App

## Stack

- Expo SDK 57 (React 19.2, RN 0.86, React Compiler)
- expo-router (file-based)
- NativeWind 4 + Tailwind (CSS-var-driven light/dark theming)
- Zustand (fasting + UI state, persisted to SQLite via `expo-sqlite/kv-store`)
- Inter + DM Sans via @expo-google-fonts, Skia for the progress ring
- pnpm 12 (settings live in `pnpm-workspace.yaml`, not `.npmrc` or `package.json`)

## Layout

```
app/                # Routes (expo-router)
  _layout.tsx       # Providers, font loading, splash
  global.css        # Tailwind entry + CSS vars for light/dark
  (tabs)/           # Tab navigator (Timer, Protocols, Stats, Settings)
  dev-fasts.tsx     # Developer-mode fast editor
  +not-found.tsx
src/
  core/             # Theme tokens, constants
  stores/           # Zustand stores + shared persist storage
  hooks/            # Shared hooks
  features/         # Feature modules (components/ + hooks/)
  components/       # Shared primitives
```

## Scripts

- `pnpm start` — Metro
- `pnpm ios` / `pnpm android` — dev build
- `pnpm lint` — expo lint
- `pnpm typecheck` — tsc
