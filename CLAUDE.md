# NeckNinja - Project Context

## Overview
NeckNinja is a guitar learning web app for visualizing scales, chords, and triads on the fretboard. Built with React, TypeScript, and Vite.

## Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via utility classes)
- **Icons**: lucide-react

## Project Structure
```
App.tsx              # Main app component with mode switching and stateful subviews/controls
components/
  Fretboard.tsx           # Horizontal fretboard for scales and All Notes (24-fret chromatic map)
  VerticalScaleFretboard.tsx  # Vertical fretboard layout for scale patterns
  VerticalChordChart.tsx  # Vertical fretboard for chord voicings
  TriadFretboard.tsx      # Vertical fretboard for triad visualization
  TriadChart.tsx          # Mini voicing diagrams for triads
  TabGenerator.tsx        # Tab notation generator
  Tooltip.tsx             # Portal-based tooltip component (hover/focus triggered)
  WelcomeModal.tsx        # Onboarding modal shown on first visit (localStorage key: nn_welcomed)
constants.ts         # Note definitions, scales, chords, tuning data
types.ts             # TypeScript type definitions
utils/               # Utility functions
```

## Key Features
- **Three modes**: Scales, Chords, Triads — all standalone tabs in the mode switcher
- **Scales mode -> Available Views**:
  - `Scale Pattern` (CAGED position flow) — horizontal or vertical layout toggle (`scaleLayout`)
  - `All Notes` (chromatic notes on all strings to fret 24)
- **All Notes controls**:
  - Clickable string labels (`6th` to `1st`) to isolate one string
  - Neck width (`- / +`) control to expand horizontal fret spacing
- **ABC button**: Toggles note name display (A, B, C, etc.)
- **R35 button** (Triads mode): Toggles interval labels (R, 3, 5)
- **Position selector** (Scale Pattern view): Filter by CAGED position (default: `'Full Neck'`)
- **String group selector** (Triads mode): Filter by string groups (1-2-3, 2-3-4, etc.)
- **Dark/Light mode**: Toggle in header
- **Help button** (`?` / `HelpCircle` icon): Reopens WelcomeModal
- **WelcomeModal**: Shown automatically on first visit; dismissed state persisted via `localStorage` key `nn_welcomed`
- **Tooltip**: Wraps any element; renders via React portal to `document.body`
- **State persistence**: URL query params restore current mode/settings/chords when the same URL is reopened; includes `scaleLayout` param

## Running the App
```bash
npm install
npm run dev
```

## Common Patterns

### Fretboard Coordinate System (Vertical fretboards)
- Fret lines drawn at: `nutHeight + fretNum * fretHeight`
- Notes/inlays positioned at: `nutHeight + fret * fretHeight - fretHeight / 2`
- The `- fretHeight / 2` centers elements in the fret space ABOVE the fret line

### Display Priority (Triads mode)
When both ABC and R35 are on, ABC (note names) takes priority over R35 (intervals).
