# Fretboard Jedi

Fretboard Jedi is a guitar practice web app for visualizing scales, chord shapes, and triad layouts, with built-in progression helpers and solo scale suggestions.

## Features

- **Scales mode**
  - Explore scales across the neck or by CAGED position
  - Toggle note labels (`ABC`) and connection overlays
  - Generate tab output and export tab/fretboard images

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
