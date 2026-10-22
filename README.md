# WeatheryBrave

A fast, privacy-first, zero-telemetry **New Tab** extension for **Brave Browser** (and Chromium browsers via Manifest V3).

## Features
- **Instant Startup (`< 16ms`)**: Zero-FOUC synchronous theme boot + `stale-while-revalidate` local weather cache.
- **Zero Telemetry & Strict Privacy**: No analytics, no tracking, no unsolicited geolocation prompts, and zero runtime npm dependencies.
- **Open-Meteo Weather**: Current conditions + 5-day forecast with city search (no API key required).
- **6 Built-in Themes**: `brave-dark`, `midnight-oled`, `nordic-frost`, `solar-warm`, `clean-light`, and `auto-system`.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

## Load in Brave Browser
1. Run `npm run build` (outputs to `dist/`).
2. Open `brave://extensions` in Brave Browser.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select the `dist/` folder.
