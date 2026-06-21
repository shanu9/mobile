# AgentScribe — Android setup (step by step)

Goal: an installable Android app that wraps the hosted web app and **keeps
transcribing when the screen locks or you switch to your meeting app**. Testing
on your own phone needs **no paid account**; publishing to the Play Store needs
the $25 Google Play Developer account (one-time).

## 0. Install the tools (one time)
- [Android Studio](https://developer.android.com/studio) (includes the Android SDK).
- Node.js 18+ (you already have it for the website).
- Enable **Developer options + USB debugging** on your phone (Settings → About →
  tap "Build number" 7×).

## 1. Initialise the project
```bash
cd mobile
npm install
npx cap add android
npx cap sync
```
This creates `mobile/android/` — a real Android Studio project.

## 2. Open it
```bash
npm run open:android
```
Android Studio opens. Plug in your phone, pick it in the device dropdown, press
**Run ▶**. The app launches and loads `agentcoresystem.com/scribe/live`. At this
point recording works in the foreground.

## 3. Permissions + background audio (the important part)
Open `mobile/android/app/src/main/AndroidManifest.xml` and add, inside
`<manifest>` (above `<application>`):

```xml
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MICROPHONE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

A **foreground service** is what stops Android from freezing the WebView (and
the mic) when backgrounded. The simplest robust route is the community plugin:

```bash
npm install @capacitor-community/foreground-service
npx cap sync
```

Then, in the web app, start the service when recording begins and stop it on
Stop (a tiny bridge — I can wire this into the live page once `mobile/android`
exists). It shows a persistent "AgentScribe is recording" notification, which is
also the honest, store-compliant signal that capture is active.

## 4. Test the background case
Start a recording → lock the phone or switch to Zoom/Meet → talk → come back.
The transcript should contain what was said while away. That's the whole reason
for going native.

## 5. App icon + name
```bash
npm install @capacitor/assets --save-dev
# put a 1024×1024 icon at mobile/assets/icon.png, then:
npx @capacitor/assets generate --android
```

## 6. Build a signed release (to publish)
1. In Android Studio: **Build → Generate Signed Bundle / APK → Android App Bundle**.
2. Create an **upload keystore** (keep it safe — it's your app identity forever).
3. Upload the resulting `.aab` to the [Play Console](https://play.google.com/console)
   → create the app → fill listing (use `/scribe/privacy` as the privacy URL) →
   submit for review.

## When you're at step 1 done
Tell me `mobile/android` exists and I'll wire the foreground-service start/stop
into the live page (it's a small, conditional bridge that only activates inside
the native shell — the web build is unaffected).
