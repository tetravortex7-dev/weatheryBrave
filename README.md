<div align="center">
  <img src="public/icons/icon-128.png" alt="WeatheryBrave" width="88" height="88" />
  <h1>WeatheryBrave</h1>
  <p>Clean, fast, privacy-first New Tab page for <strong>Brave</strong> & Chromium browsers.</p>
</div>

---

## What's Inside

- **Clock & Greeting** — Clean `24h` / `12h` clock with date and optional custom greeting.
- **Default Search Bar** — Uses your browser's default search engine (or navigates directly when you type a URL).
- **Quick Pins** — Up to 8 minimalist shortcuts right below search (`Alt + 1` … `Alt + 8`).
- **Weather Forecast** — Current conditions, sunrise/sunset, UV index, and a 5-day forecast (click any day to expand the hourly forecast). Powered by [Open-Meteo](https://open-meteo.com/) with no API key required.
- **Brave Wallpapers & 6 Themes** — Rotating official Brave New Tab wallpapers with frosted-glass widgets, or solid color themes (`Brave Dark`, `Midnight OLED`, `Nordic Frost`, `Solar Warm`, `Clean Light`, `Auto`).
- **100% Private** — Zero telemetry, no analytics, no automatic geolocation prompts, and no tracking permissions.

---

## Keyboard Shortcuts

- `/` — Focus search bar
- `Enter` / `Ctrl + Enter` — Search in current tab / new tab
- `Alt + 1` … `Alt + 8` — Open Quick Pin
- `Esc` — Clear search or close modal

---

## Install in Brave / Chrome

1. Build the extension:
   ```bash
   npm install
   npm run build
   ```
2. Open `brave://extensions` (or `chrome://extensions`).
3. Turn on **Developer mode** (top right).
4. Click **Load unpacked** and select the `dist` folder.

---

## License

[MIT](./LICENSE)
