# Plan: personal TestFlight build

Goal: run the app on my own iPhone through TestFlight. Accounts, payments and App Store listing work are out of scope.

## Testing without Xcode or a simulator

Two options, neither needs Xcode:

- **Expo Go (free, available now).** Install Expo Go from the App Store, log in with the same Expo account as the CLI (`pnpm exec expo login`), run `pnpm start` on the Mac and scan the QR code. Only Metro runs locally. Every native module the app uses (Skia, datetimepicker, picker, slider, sqlite, notifications, linear-gradient, reanimated) ships inside Expo Go for SDK 57. Use this to check steps 1–4 as they land.
- **EAS cloud build + TestFlight (step 5).** Expo's servers build and upload the app, so the Mac only runs `eas` commands. After adding `expo-updates`, JS-only changes reach the installed build with `eas update`, no rebuild needed.

## 1. Move persisted state out of SecureStore — done (`041c35a`)

`fasting-store.ts` saves every completed fast as one JSON string in the iOS Keychain. Expo warns when a SecureStore value is over 2 KB, which is about 20 fasts.

- Switch both Zustand stores to `expo-sqlite/kv-store` (a drop-in AsyncStorage-style API backed by the `expo-sqlite` already installed).
- Do this before real data is on the phone, so nothing has to be migrated.
- Drizzle, `DatabaseProvider` and React Query have no users. Remove them unless step 1 ends up wanting real tables.

## 2. Goal notification — done (`97c48bd`)

Nothing tells you when a fast reaches its goal.

- Add `expo-notifications` and ask for permission on the first fast start.
- Schedule a local notification at `startedAt + fastHours` on `startFast`.
- Reschedule on `adjustStart` and `setProtocol`/`setCustomProtocol` while a fast is active, and cancel on `endFast`.
- The app schedules no other notifications, so a sync cancels all scheduled ones instead of storing an id.

## 3. Streak pill fix — done (`0aca68e`)

The Timer tab's streak pill shows `streakCount`, which goes up by one on every `endFast` and never resets or drops on delete. Stats calculates streaks properly in `computeStreaks` (`src/features/history/hooks/use-history.ts`).

- Move `computeStreaks` somewhere shared and use it for the pill.
- Remove `streakCount` from the store and bump the persist version.

## 4. App identity and small fixes — done except testing the custom protocol

- Replace `assets/images/icon.png` (still the Expo default) with a 1024×1024 icon without transparency. Update `splash-icon.png` and the splash background colours to match. The current icon is a stand-in; replace it whenever there's a real one.
- Set `ios.supportsTablet` to `false` unless iPad support is wanted.
- Read the version in Settings from `expo-constants` instead of the hardcoded `1.0.0`.
- Try the custom protocol modal (recovered from the backup, never run).

## 5. TestFlight — done

First build (1.0.0, build 2, commit `f7c09f4`) is on TestFlight. EAS holds the signing credentials, and `eas.json` has the App Store Connect app ID, so later builds need no Apple prompts.

## Shipping changes

- **JS-only changes** (screens, logic, styles): `eas update --channel production --message "..."`. The TestFlight build downloads the update on launch and applies it on the next launch.
- **Native changes** (adding or upgrading a package with native code, `app.json` changes such as the icon or plugins, or a new `version`): `eas build -p ios --profile production --auto-submit`. The build number goes up automatically.
- Updates only reach builds with the same runtime version. The runtime follows `version` in `app.json`, so bumping it requires a new build.

## Later, only if publishing

Privacy policy URL, App Privacy answers, age rating, screenshots, external testers (they go through Beta App Review), and a "not medical advice" note for the ketosis zones.
