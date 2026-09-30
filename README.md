# PlanIt

PlanIt is an offline-first Alarm, Reminder, and Daily Planner app for Android and iOS, with a target launch of 7 October 2026.

## Setup and running

```sh
npm install
npm start
```

Run a platform with `npm run android` or `npm run ios`.

## Architecture

- Expo + React Native + TypeScript
- Expo Router routes in `src/app`, with Today as the initial tab
- Central visual tokens in `src/constants`
- Local SQLite initialization in `src/services/database`
- SQLite will be the persistent source of truth; Zustand is available only for transient UI state when needed

## Not implemented yet

The database schema/data model, alarms and notifications, Google Drive backup, Quick Add, routines, reminders, task functionality, the Eisenhower Matrix, authentication, backend, and cloud synchronization are intentionally deferred. Native alarm and notification work will use a development build later.
