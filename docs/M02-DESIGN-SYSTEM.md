# M02 — Terminal UI Design System

## Token Reference

Tokens are CSS custom properties defined in `src/app/global.css`, scoped to `:root` (dark, default) and `[data-theme="light"]`.

| Token | Purpose |
|---|---|
| `--bg-0` … `--bg-3` | Background layers, darkest to lightest |
| `--fg-0` … `--fg-muted` | Foreground text, highest to lowest emphasis |
| `--border`, `--border-strong` | Panel/divider borders |
| `--accent`, `--accent-dim` | Brand amber-orange |
| `--ok`, `--warn`, `--danger`, `--info` | Status colors |

Theme is toggled via `useSettingsStore` (Zustand, persisted to localStorage) and applied to `<html data-theme="...">` by `ThemeProvider`.

## Components (`src/components/terminal/`)

- **Panel** — base container with corner-tick decoration
- **StatusBar** — top chrome: UTC clock, ⌘K trigger, theme toggle
- **Ticker** — horizontal scrolling market/data strip
- **KpiCard** — labeled metric with delta indicator
- **LedBadge** — status pill with optional pulse animation
- **RiskGauge** — semicircular 0–100 risk score gauge
- **DataTable** — generic typed table with custom cell renderers
- **CommandPalette** — ⌘K modal, fuzzy-filters registered commands

## Hotkeys

Registered via `useHotkeys` (`src/hooks/useHotkeys.ts`). Combos use `mod` for Cmd/Ctrl.
Currently bound: `mod+k` (command palette), `escape` (close palette).

## Showcase

Visit `/design` to see all components rendered with sample data.