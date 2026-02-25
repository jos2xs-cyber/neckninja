# Scale Shed - Project Context

## Overview
Scale Shed is a guitar learning web app for visualizing scales, chords, and triads on the fretboard. Built with React, TypeScript, and Vite.

## Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (via utility classes)
- **Icons**: lucide-react

## Project Structure
```
App.tsx              # Main app component with mode switching (Scale/Chord/Triads)
components/
  Fretboard.tsx      # Horizontal fretboard for scales (full neck view)
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
- **ABC button**: Toggles note name display (A, B, C, etc.)
- **R35 button** (Triads mode): Toggles interval labels (R, 3, 5)
- **Position selector** (Scales mode): Filter by CAGED position
- **String group selector** (Triads mode): Filter by string groups (1-2-3, 2-3-4, etc.)
- **Dark/Light mode**: Toggle in header

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
