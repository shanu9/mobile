# AgentScribe — Mobile (iOS + Android)

A thin **Capacitor** native shell around the hosted web app
(`https://agentcoresystem.com/scribe/live`). Same approach as the Electron
desktop build: the native layer exists for **microphone permission** and
**background audio** (keeping capture alive when the screen locks or the user
switches to their meeting app) — the two things a mobile *browser* cannot do.
Everything else is the live web app, so product updates ship instantly with no
app-store resubmission.

## What you need first
- **Android:** Android Studio. Google Play Developer account ($25 one-time) to
  publish. No paid account needed to build/test on your own device.
- **iOS:** a Mac with Xcode. Apple Developer Program ($99/yr) to run on a device
  and publish.
- Start with **Android** — it's the cheaper gate and supports true background
  audio via a foreground service.

## One-time setup
```bash
cd mobile
npm install
npx cap add android      # and/or: npx cap add ios
npx cap sync
```

## Build & run
```bash
npm run open:android     # opens Android Studio → Run on device/emulator
npm run open:ios         # opens Xcode → Run (Mac only)
```

## Step 4 — background audio (the reliability bit)
Browsers suspend JS when backgrounded; native does not, once configured:

- **Android:** add a **foreground service** with `microphone` type and the
  `FOREGROUND_SERVICE` + `RECORD_AUDIO` permissions in
  `android/app/src/main/AndroidManifest.xml`. A small persistent notification
  ("AgentScribe is recording") keeps capture alive while backgrounded.
- **iOS:** in Xcode → target → **Signing & Capabilities → Background Modes**,
  tick **Audio, AirPlay, and Picture in Picture**. Add
  `NSMicrophoneUsageDescription` to `Info.plist`.

> The hosted web app already handles transcription, retries, and reconnects.
> Background mode just prevents the OS from freezing the page mid-meeting.

## Updating the app
Because the shell loads the hosted URL, **shipping a web deploy updates the app
instantly** — no rebuild. Only rebuild/resubmit when you change native config
(permissions, icons, background mode, app version).

## Store assets
- App icon + splash: `npx @capacitor/assets generate` (add `@capacitor/assets`).
- Listing copy, screenshots, privacy policy URL → use `/scribe/privacy`.

## Signing (publishing)
- **Android:** generate an upload keystore, configure `signingConfigs` in
  `android/app/build.gradle`, then **Build → Generate Signed Bundle (.aab)** →
  upload to Play Console.
- **iOS:** Xcode → Archive → Distribute App → App Store Connect.
