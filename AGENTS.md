# AGENTS.md — WeatheryBrave Architecture & Project Rules

> **CRITICAL RULE FOR ALL AI AGENTS & CONTRIBUTORS:**
> **Do NOT edit, modify, or rewrite this `AGENTS.md` file without explicit prior permission from the user.**
> All code in this repository must strictly obey the principles outlined below.

---

## 1. Core Principles & Philosophy

1. **Strict SOLID Principles**:
   - **S (Single Responsibility)**: Every module, class, and service must have exactly one reason to change. Separate presentation (DOM), business logic (core services), and external drivers (API, storage, clock).
   - **O (Open/Closed)**: Extend functionality by adding new implementations of interfaces or new CSS tokens, not by bloating existing classes with conditional cascades.
   - **L (Liskov Substitution)**: External adapters must satisfy interface contracts under tests (e.g., in-memory mocks vs browser storage).
   - **I (Interface Segregation)**: Keep interfaces narrow and focused. Do not combine unrelated capabilities into a single bloated interface.
   - **D (Dependency Inversion)**: High-level UI and domain layers must depend strictly on domain ports (`src/core/ports/`), never on concrete infrastructure adapters. All wiring happens exclusively in the Composition Root (`src/main.ts`).

2. **Localization Rule (Strict File Separation)**:
   - **Every supported language MUST reside in its own dedicated TypeScript file** under `src/core/i18n/locales/<lang>.ts`.
   - Never combine or inline translation dictionaries into a single monolithic file.
   - All locale files must implement the unified `TranslationDictionary` contract defined in `src/core/i18n/types.ts`.
   - The default resolution must respect the browser environment (`chrome.i18n.getUILanguage()` / `navigator.language`) with manual user override in settings.

3. **Performance & Privacy ("Zero Annoyance, No Telemetry")**:
   - **Zero runtime npm dependencies** (`dependencies: {}` in `package.json`).
   - Instant startup (`< 16ms`): Synchronous Zero-FOUC theme boot and Stale-While-Revalidate weather cache.
   - No telemetry, no background service worker RAM bloat, zero automatic geolocation prompts.

4. **Zero Comments Rule (Strict Clean Code)**:
   - **Do NOT add code comments** (no inline `//`, block `/* */`, or JSDoc comments) anywhere in the codebase.
   - Code must be completely self-documenting through strict TypeScript typing, clean design, and self-explanatory naming.
   - All comments must be removed and never added.

---

## 2. Directory Structure

```text
weatheryBrave/
├── public/                    # Static extension assets (manifest, icons, wallpapers)
├── src/
│   ├── core/                  # Domain layer (Zero DOM, zero browser API dependencies)
│   │   ├── i18n/              # Localization contracts & individual locale files
│   │   │   ├── types.ts       # TranslationDictionary contract & supported languages
│   │   │   ├── index.ts       # Language resolver (browser UI vs user preference)
│   │   │   └── locales/       # Strictly separated locale files (en.ts, ru.ts, etc.)
│   │   ├── models/            # Pure immutable data models
│   │   ├── ports/             # Domain interfaces (IWeatherProvider, ISettingsStore, etc.)
│   │   └── services/          # Pure business logic (formatting, sync algorithms)
│   ├── infra/                 # Adapters implementing core/ports
│   │   ├── api/               # Open-Meteo API implementations
│   │   ├── storage/           # LocalStorage & IndexedDB adapters
│   │   └── system/            # SystemClock, BrowserSearchProvider
│   ├── ui/                    # Presentation layer
│   │   ├── components/        # Isolated UI widgets emitting events
│   │   ├── dom/               # Safe DOM helpers & SVG icon builders
│   │   └── themes/            # CSS variable theme management
│   ├── styles/                # Native CSS custom properties & layout
│   └── main.ts                # Composition Root (wires dependencies and mounts DOM)
├── tests/                     # Unit tests
└── package.json
```

---

## 3. Verification Commands

Before completing any task, agents must verify that:
1. `npm run typecheck` passes with zero errors (`tsc --noEmit`).
2. `npm test` passes all unit tests (`vitest run`).
3. `npm run build` succeeds without warnings (`vite build`).
