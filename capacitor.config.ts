import type { CapacitorConfig } from "@capacitor/cli";

// AgentScribe mobile shell.
//
// Strategy (mirrors the Electron desktop build): ship the SAME hosted web app
// inside a thin native shell instead of duplicating assets. The native layer's
// only jobs are (1) microphone permission and (2) keeping audio capture alive
// when the screen locks / the user switches to their meeting app — the two
// things mobile browsers can't do. Everything else is the existing web app,
// which means instant updates with no app-store resubmission.
const config: CapacitorConfig = {
  appId: "com.agentscribe.app",
  appName: "AgentScribe",
  // webDir is only the offline fallback; the live app is loaded from server.url.
  webDir: "public",
  server: {
    url: "https://agentcoresystem.com/scribe/live",
    cleartext: false,
  },
  ios: {
    // Background-audio capability is enabled in Xcode (see README, step 4).
    contentInset: "always",
  },
  android: {
    // A foreground service keeps the mic alive in the background (see README).
    allowMixedContent: false,
  },
  plugins: {},
};

export default config;
