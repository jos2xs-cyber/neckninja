# Fretboard Jedi

Fretboard Jedi is a guitar practice web app for visualizing scales, chord shapes, and triad layouts, with built-in progression helpers and solo scale suggestions.

## Features

- **Scales mode**
  - **Available Views**:
    - `Scale Pattern`: Explore scales across the neck or by CAGED position
    - `All Notes`: Chromatic note map across all strings up to the 24th fret
  - In `All Notes` view:
    - Click `6th` to `1st` string labels to isolate a single string
    - Use `Neck Width` (`- / +`) to increase horizontal spacing for practice
  - Toggle note labels (`ABC`) and connection overlays (`Scale Pattern` view)
  - Generate tab output and export tab/fretboard images (`Scale Pattern` view)

- **Chords mode**
  - Build up to 4 chords manually
  - Apply progression presets by key
  - Switch progression context with a **Major / Minor** toggle
  - Practice helpers:
    - metronome with BPM control
    - progression playback/highlight cycling
    - copyable share link (URL state)
  - Get **Solo Scale Suggestions**:
    - global progression scales
    - per-chord target scales

- **Triads mode**
  - Visualize major/minor triads
  - Filter by string group (`1-2-3`, `2-3-4`, etc.)
  - Toggle interval labels (`R35`)

- **General**
  - Dark/light theme toggle
  - Responsive UI for desktop and mobile
  - URL-based state persistence (mode/settings/chords restore when reopening the same URL)

## Run Locally

**Prerequisites:** Node.js 18+ (recommended)

1. Install dependencies
   ```bash
   npm install
   ```

2. Start dev server
   ```bash
   npm run dev
   ```

3. Open
   - http://localhost:5173

## Build

```bash
npm run build
```

## Quality Checks

```bash
npm run typecheck
npm run check
```

## Deploy (Cloudflare Pages)

- Build command: `npm run build`
- Build output directory: `dist`
- Security/caching headers are provided in `public/_headers`
- CI checks run in `.github/workflows/ci.yml`

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS (utility classes)
- lucide-react (icons)
