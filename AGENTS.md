# AGENTS.md — WeatheryBrave Architecture & Development Guidelines

## 1. Project Vision & Philosophy
**WeatheryBrave** is a free, open-source, privacy-first **New Tab** extension designed for **Brave Browser** (and compatible Chromium browsers via Manifest V3). It provides a fast, distraction-free weather widget alongside a clean clock, date, and minimalist status/greeting.

Every architectural decision and line of code must adhere to these core pillars:
- **Zero Telemetry & Strict Privacy**: No analytics, no crash reporters, no tracking pixels, no fingerprinting, and no unsolicited network calls. Location is configured manually via city search (or explicit opt-in coordinates)—never trigger `navigator.geolocation` prompts automatically.
- **No-Annoyance UX**: No onboarding popups, no review/donation nagging, no notification permissions, no background service workers draining RAM unless strictly required, and no layout shifts (CLS = 0) when opening a new tab.
- **Instant Startup (`< 16ms` Initial Paint)**: Opening a new tab must feel native and instantaneous. Cached state renders synchronously on the first frame; weather updates happen asynchronously in the background (`stale-while-revalidate`).
- **SOLID & Clean Code**: Strict separation of concerns, small single-purpose modules, dependency inversion via TypeScript interfaces, and zero runtime framework bloat.
- **Easy-to-Manage Open Source**: Minimal dependency tree, standard tooling, deterministic builds, and self-documenting code that contributors can understand in minutes.

---

## 2. Tech Stack & Constraints
- **Platform**: Chromium Extension **Manifest V3** (`chrome_url_overrides.newtab`).
- **Language**: **Vanilla TypeScript** (`strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`).
- **Bundler**: **Vite** (configured for static extension builds with zero external runtime dependencies).
- **Styling**: **Native CSS3** using CSS Custom Properties (Variables) for instant theme switching. No CSS-in-JS, no heavy CSS frameworks.
- **Icons & Graphics**: Inline SVG sprite or lightweight monochrome/duotone SVG components. Zero external font/icon CDN requests (`font-src 'self'`).
- **Weather API**: **Open-Meteo API** (`https://api.open-meteo.com` & `https://geocoding-api.open-meteo.com`) — free, open-source, no API keys required.
- **Testing**: **Vitest** for unit testing domain logic, formatters, caching, and API adapters.

> **Hard Constraint**: `dependencies` in `package.json` MUST remain empty (`{}`). Only `devDependencies` (TypeScript, Vite, Vitest, linter/formatter) are permitted.

---

## 3. Architecture & SOLID Principles

### Directory Structure
```text
weatheryBrave/
├── public/
│   ├── manifest.json          # MV3 manifest (minimal permissions)
│   └── icons/                 # Static extension icons (16, 32, 48, 128)
├── src/
│   ├── core/                  # Domain models, interfaces (ports), pure business logic
│   │   ├── models/            # WeatherData, LocationConfig, ThemeId, UserSettings
│   │   ├── ports/             # IWeatherProvider, IGeocodingProvider, IStorageAdapter, IClock
│   │   └── services/          # WeatherSyncService, TimeFormatter, GreetingService
│   ├── infra/                 # External adapters implementing core/ports
│   │   ├── api/               # OpenMeteoWeatherProvider, OpenMeteoGeocodingProvider
│   │   ├── storage/           # LocalStorageAdapter / ChromeStorageAdapter
│   │   └── system/            # SystemClock
│   ├── ui/                    # DOM components, presenters, and event binding
│   │   ├── components/        # ClockWidget, WeatherWidget, LocationModal, SettingsDrawer
│   │   ├── themes/            # ThemeManager + theme CSS definitions
│   │   └── dom/               # Safe DOM helpers (no innerHTML with untrusted data)
│   ├── styles/
│   │   ├── base.css           # Reset, layout grid, typography
│   │   └── themes.css         # CSS variables for all built-in themes
│   └── main.ts                # Composition Root (wires dependencies and boots UI)
├── tests/                     # Unit tests mirroring src/core and src/infra
├── index.html                 # New Tab entry point with inline critical theme boot script
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Applying SOLID in Vanilla TypeScript
1. **Single Responsibility Principle (SRP)**:
   - API clients only fetch and validate DTOs and map them to domain models.
   - Storage adapters only serialize, validate, and persist data.
   - UI components only render state to DOM nodes and emit user intent events.
2. **Open/Closed Principle (OCP)**:
   - Adding a new theme requires only adding a CSS variable block in `src/styles/themes.css` and registering its metadata in `ThemeRegistry`—no widget logic changes.
   - Adding an alternative weather provider requires implementing `IWeatherProvider` without modifying `WeatherWidget` or `WeatherSyncService`.
3. **Liskov Substitution Principle (LSP)**:
   - Any implementation of `IWeatherProvider` or `IStorageAdapter` (e.g., `InMemoryStorageAdapter` for tests vs. `LocalStorageAdapter` for runtime) must behave identically under contract tests (`tests/contracts/`).
4. **Interface Segregation Principle (ISP)**:
   - Keep interfaces narrow: separate `IWeatherProvider` (forecast lookup by coordinates) from `IGeocodingProvider` (city name search) and `ISettingsStore` from `IWeatherCacheStore`.
5. **Dependency Inversion Principle (DIP)**:
   - High-level services (`WeatherSyncService`, UI presenters) depend exclusively on interfaces in `src/core/ports/`.
   - Concrete implementations (`OpenMeteoWeatherProvider`, `LocalStorageAdapter`) are instantiated and injected only in `src/main.ts` (the Composition Root).

---

## 4. Performance & Caching Strategy ("Fast Working")
A New Tab page is opened dozens of times a day. It must never show a blank screen, theme flash (FOUC), or loading spinner when cached data exists.

1. **Zero-FOUC Theme Boot**:
   - Store the active theme ID in `localStorage` under a synchronous key (`wb_theme`).
   - Apply `document.documentElement.dataset.theme` before first paint so the background color matches the user's theme on frame 0.
2. **Stale-While-Revalidate Weather Cache**:
   - On startup, synchronously read cached weather payload (`wb_weather_cache`) from storage and render immediately (`< 5ms`).
   - Check cache timestamp:
     - **Fresh (`< 30 minutes`)**: Do **not** make a network request.
     - **Stale (`>= 30 minutes`)**: Render cached data immediately, then silently fetch updated data from Open-Meteo in the background and smoothly update the DOM.
   - **Offline / Network Error Resilience**: If the network is unavailable or Open-Meteo fails, keep displaying the cached forecast with a subtle, non-intrusive "Last updated X ago" indicator—never replace valid cached data with an error screen.
3. **Resource & Timer Discipline**:
   - Clock ticks align to the minute boundary (or second boundary only if seconds are toggled on) using a single timer that pauses via the `visibilitychange` event when the tab is hidden.

---

## 5. Multi-Theme System
Themes must be lightweight, accessible (WCAG AA contrast minimum), and driven purely by CSS Custom Properties on `:root[data-theme="<id>"]`:

- **Required Semantic Tokens**:
  - `--bg-primary`, `--bg-surface`, `--bg-elevated`
  - `--text-primary`, `--text-secondary`, `--text-muted`
  - `--accent-primary`, `--border-subtle`, `--shadow-soft`
- **Built-in Themes**:
  1. `brave-dark` (Default): Deep carbon/slate dark palette inspired by Brave's native dark UI.
  2. `midnight-oled`: Pure `#000000` background with crisp low-glare typography for OLED screens.
  3. `nordic-frost`: Calm, low-contrast cool slate palette (Nord-inspired).
  4. `solar-warm`: Soft warm paper/sepia light theme that doesn't blind users in daylight.
  5. `clean-light`: Minimalist high-clarity daylight theme.
  6. `auto-system`: Follows `prefers-color-scheme` automatically.

---

## 6. Security, Privacy & Manifest V3 Rules
- **Minimal Permissions**:
  - `manifest.json` must request **zero** invasive permissions (only `["search"]` to delegate queries to the user's default browser search engine).
  - Never request `tabs`, `history`, `bookmarks`, `geolocation`, or `<all_urls>`.
  - `host_permissions` must be scoped strictly to `https://api.open-meteo.com/*` and `https://geocoding-api.open-meteo.com/*`.
- **Content Security Policy (CSP)**:
  - Enforce strict CSP in `manifest.json`: `script-src 'self'; object-src 'self'; connect-src https://api.open-meteo.com https://geocoding-api.open-meteo.com; style-src 'self'; img-src 'self' data:; font-src 'self'`.
- **DOM Safety**:
  - Never use `innerHTML` with API responses or user input. Always use `textContent`, `document.createElement`, or safe SVG builders.

---

## 7. Coding Standards & Conventions for AI Agents
- **No Magic Values**: All TTL durations, API endpoints, WMO weather code mappings, and default settings belong in typed configuration constants.
- **Explicit Error Handling**: Use typed `Result<T, E>` objects for network and storage operations instead of throwing unhandled exceptions across boundaries.
- **Pure Functions First**: Formatting temperatures (`°C` / `°F`), wind speed (`km/h`, `m/s`, `mph`), time (`12h` / `24h`), and WMO weather code descriptions must be pure functions in `src/core/` with 100% unit test coverage.
- **Small Files**: Keep individual `.ts` files under ~180 lines. If a component grows larger, split presentation, state calculation, and sub-elements into focused modules.
- **Comments**: Document *why* a decision exists (e.g., cache TTL backoff, Brave-specific MV3 quirks), not *what* trivial syntax does.

---

## 8. Development & Verification Workflow
When implementing features or fixes in this repository, agents must follow this sequence:
1. **Model & Contract First**: Define or update interfaces in `src/core/models` and `src/core/ports`.
2. **Test Core Logic**: Write unit tests in `tests/` for new domain services, WMO weather mappers, or adapters.
3. **Implement Adapter / UI**: Build the infrastructure adapter or DOM component adhering to DIP and SRP.
4. **Verify Quality Gates**:
   - `npm run typecheck` (`tsc --noEmit`) — zero TypeScript errors.
   - `npm test` (`vitest run`) — all unit tests pass.
   - `npm run build` — production bundle builds cleanly into `dist/` ready for `brave://extensions` ("Load unpacked") and Chrome Web Store ZIP packaging.
