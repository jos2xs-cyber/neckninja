# Fretboard Jedi - Project Context

## Overview
Fretboard Jedi is a guitar learning web app for visualizing scales, chords, and triads on the fretboard. Built with React, TypeScript, and Vite.

## Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via utility classes)
- **Icons**: lucide-react

## Project Structure
```
App.tsx              # Main app component with mode switching and stateful subviews/controls
components/
  Fretboard.tsx      # Horizontal fretboard for scales and All Notes (24-fret chromatic map)
  VerticalChordChart.tsx  # Vertical fretboard for chord voicings
  TriadFretboard.tsx      # Vertical fretboard for triad visualization
  TriadChart.tsx          # Mini voicing diagrams for triads
  TabGenerator.tsx        # Tab notation generator
constants.ts         # Note definitions, scales, chords, tuning data
types.ts             # TypeScript type definitions
utils/               # Utility functions
```

## Key Features
- **Three modes**: Scales, Chords, Triads (toggle via mode switcher)
- **Scales mode -> Available Views**:
  - `Scale Pattern` (CAGED position flow)
  - `All Notes` (chromatic notes on all strings to fret 24)
- **All Notes controls**:
  - Clickable string labels (`6th` to `1st`) to isolate one string
  - Neck width (`- / +`) control to expand horizontal fret spacing
- **ABC button**: Toggles note name display (A, B, C, etc.)
- **R35 button** (Triads mode): Toggles interval labels (R, 3, 5)
- **Position selector** (Scale Pattern view): Filter by CAGED position
- **String group selector** (Triads mode): Filter by string groups (1-2-3, 2-3-4, etc.)
- **Dark/Light mode**: Toggle in header
- **State persistence**: URL query params restore current mode/settings/chords when the same URL is reopened

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
