# NeuroAI Mobile (Expo / React Native)

A native Android-first mobile application for the NeuroAI neonatal EEG
platform, built with **Expo SDK 57**, **React Native**, **TypeScript** and
**Expo Router**.

> **Current increment: Phase 2A + 2B (Doctor experience, demonstration data).**
> The backend is **not** connected, no ML model runs, and no file is uploaded.
> Everything that looks like patient data is fictional and marked with a
> “DEMONSTRATION DATA” banner.

This directory is self-contained. Nothing in `../Frontend` (the website or
the Python backend) was modified.

---

## What is implemented

| Area | Status |
|---|---|
| Expo + TypeScript + Expo Router project | ✅ |
| Light/dark theme system (website palette, `src/theme`) | ✅ |
| Reusable UI kit (Screen, Card, StatCard, Button, Badge, Chip, inputs, progress bar, loading/empty/error states, MockBanner, Disclaimer) | ✅ |
| Demo login (local, clearly labelled, SecureStore-persisted) | ✅ |
| Bottom-tab navigation + stack screens | ✅ |
| Dashboard with statistics and quick actions | ✅ |
| Patient list with search | ✅ |
| Patient profile with recordings | ✅ |
| EEG file selection (Expo Document Picker) + filename/size/extension validation | ✅ |
| Demonstration upload progress (nothing is transmitted) | ✅ |
| Waveform viewer: mock traces, channel selection, time navigation, amplitude scale | ✅ |
| Analysis status screen (model **not** connected, all outputs marked unavailable) | ✅ |
| Reports list + detail with native PDF preview (expo-print) | ✅ |
| Settings (theme, session, data source, scientific boundary) | ✅ |
| Patient (parent) experience | ⛔ Phase 2C |
| Real backend API calls / real authentication | ⛔ Phase 2D |
| APK / AAB / EAS build profiles | ⛔ Phase 2E |

## Scientific boundary (by design)

* The analysis screen reports `model_not_configured` and lists every output
  as **unavailable** — there are no seizure probabilities, candidate events,
  burden figures or confidence values anywhere in this app.
* **Channel-level seizure scores and localisation are never shown**; the UI
  states that the planned model produces epoch-level outputs only and that
  localisation is unsupported.
* Mock waveforms are synthesised on-device. They are not recordings and are
  labelled as such in the UI and in accessibility text.
* `src/data/source.ts` is the single switch between mock and future live
  data. No endpoint is called and none is invented.

---

## Requirements

* **Node.js 20+** (tested with Node 24) and npm
* **Expo Go** on your Android phone (Play Store / App Store), or an Android
  emulator (Android Studio)

## Install

```bash
cd mobile
npm install
```

## Run (development)

```bash
npx expo start          # or: npm start
```

Other scripts:

```bash
npm run android     # start and open on Android emulator/device
npm run ios         # iOS (requires macOS + Xcode later)
npm run web         # browser preview
npm run lint        # ESLint (expo lint)
npm run typecheck   # tsc --noEmit
```

## Test on a physical Android phone

1. Install **Expo Go** from the Google Play Store on the phone.
2. Make sure the phone and your computer are on the **same Wi-Fi network**.
3. Run `npx expo start` in this directory.
4. Scan the QR code shown in the terminal with the Expo Go app
   (Android scans QR codes directly in Expo Go).
5. The app loads the **demo login** screen — tap
   *“Enter the demo doctor experience”* (any non-empty credentials work;
   nothing is verified and no request is sent).
6. If the QR code fails (isolated/corporate networks, VPN), use a tunnel:
   `npx expo start --tunnel`.

Test flow worth exercising: **Dashboard → EEG tab → select a patient →
“Choose an EEG file” → start the demonstration upload → open the waveform
viewer → Analysis status → Reports → preview a PDF → Settings → switch to
dark theme → sign out.**

## Project structure

```
mobile/
├── app.json                 Expo config (scheme, Android package, plugins)
├── src/
│   ├── app/                 Expo Router routes (file-based navigation)
│   │   ├── _layout.tsx      Providers + authentication gate
│   │   ├── login.tsx        Demo login
│   │   └── (doctor)/        Bottom tabs: dashboard, patients, eeg,
│   │                        reports, settings + stack screens
│   ├── theme/               Design tokens + ThemeProvider (light/dark)
│   ├── components/          Reusable UI kit
│   ├── features/eeg/        Waveform renderer (react-native-svg) + mock
│   │                        trace generator (modular → replaceable by Skia)
│   ├── data/                Typed repositories, mock fixtures, source switch
│   ├── auth/                Auth adapter interface, demo adapter, API stub
│   ├── storage/             SecureStore-backed preferences
│   ├── hooks/               useAsync
│   └── config/env.ts        auth mode + reserved API base URL
└── package.json
```

## Dependencies (intentionally minimal)

`expo`, `expo-router`, `@expo/vector-icons`, `expo-document-picker`,
`expo-secure-store`, `expo-print`, `react-native-svg`, plus the Expo Router
runtime set (`react-native-screens`, `react-native-safe-area-context`,
`expo-linking`, `expo-constants`, `expo-status-bar`, `expo-splash-screen`).

All versions are SDK-57 aligned (`npx expo install --check` passes).

## Known limitations (honest list)

* **No backend connection.** Login is a local demo session; upload progress
  is simulated; reports are locally rendered fictional documents.
* **No ML model.** Nothing in this app produces or displays seizure output.
* **Patient/parent screens are not built yet** (Phase 2C).
* **No build profiles yet** — `eas.json`, APK/AAB and iOS builds are Phase 2E.
* PDF preview uses the system print pipeline (`expo-print`); download/share
  needs a native sharing module and a real file, reserved for a later phase.
* The demo flow targets Android/iOS; `Alert.alert` confirmation dialogs are
  not interactive on the web preview.

## Not modified

The existing website (`../Frontend/frontend`) and the Python backend
(`../Frontend/backend`) are untouched, as is the ML adapter stub. Nothing
has been pushed to GitHub.
