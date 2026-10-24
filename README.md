<div align="center">
  <img src="public/icons/icon-128.png" alt="WeatheryBrave" width="88" height="88" />
  <h1>WeatheryBrave</h1>
  <p><strong>A fast, privacy-first New Tab extension for Chromium browsers.</strong></p>
</div>

---

## Overview

**WeatheryBrave** is a clean, modern, and lightning-fast New Tab replacement designed for **Brave**, **Google Chrome**, and all Chromium-based browsers.

It brings together an accurate live weather forecast, curated high-resolution photography, customizable quick pins, and a distraction-free Zen mode — all loaded instantly with **zero telemetry** and **zero runtime dependencies**.

---

## Highlights

- ⚡ **Instant Load (< 16ms)**: Synchronous Zero-FOUC startup with no blank white screen.
- 🌤️ **Live Weather**: Accurate Open-Meteo forecast (5-day + interactive hourly view, UV index, sunrise/sunset) with no API keys required.
- 🖼️ **Stunning Wallpapers**: 40 curated offline Brave photographs or your own custom uploaded images with real-time Dim and Blur controls.
- 🧘 **Zen Mode**: Press `Z` (or double-click anywhere) to hide all widgets and enjoy clean photography.
- 📌 **Quick Pins**: Fast bookmarks with intuitive drag-and-drop reordering and `Alt + 1..8` hotkeys.
- 🌍 **12 Languages**: Full localization with automatic browser UI detection and localized tab titles (*«Новая вкладка»*, *«New Tab»*, *«Nueva pestaña»*, etc.).
- 🔒 **100% Private**: No tracking, no external analytics, no permissions bloat, and `0` runtime npm dependencies.

---

## Quick Start

```bash
# 1. Install dev dependencies
npm install

# 2. Build production bundle
npm run build
```

Then load the extension into your browser:
1. Navigate to `brave://extensions` (or `chrome://extensions`).
2. Enable **Developer mode** in the top-right corner.
3. Click **Load unpacked** and select the [`dist`](./dist) folder.

---

## Documentation

For full architecture details, SOLID design principles, and technical specifications, see **[project.md](./project.md)**.

---

## License

[MIT](./LICENSE)
