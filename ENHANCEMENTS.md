# NeckNinja — Enhancement & Bug Tracker

Checkboxes track approval/completion. Add a date and note when marking done.

---

## 🔴 Critical Bugs (fix before launch)

- [x] **Opacity logic broken in scale views** — out-of-position notes (opacity 0.15) were hidden by a `< 0.5` filter in Fretboard.tsx instead of rendering dimly; fixed by lowering threshold to `<= 0`

> **Investigated & not real:**
> - `applyProgressionPreset()` — function IS defined (App.tsx:451); false alarm
> - `copyShareLink()` — function IS defined (App.tsx:472); false alarm
> - Zoom not affecting note positions — `allNotesZoom` is a prop; `fretWidths` recalculates on every render; false alarm

---

## 🟠 High Priority (should fix before launch)

- [x] **Mobile layout for Chords view** — mobile carousel added: one chord at a time with prev/next buttons and dot indicators; auto-advances with practice mode; desktop layout unchanged (2026-03-10)
- [x] **Metronome fails silently** — now resumes suspended AudioContext on play; shows "Audio blocked" warning with instructions if it still fails (2026-03-10)
- [x] **Tooltip scroll tracking** — merged scroll/resize listeners into positioning effect; tooltip now follows trigger element on scroll (2026-03-10)
- [x] **WelcomeModal: add Escape key to close** — useEffect keydown listener added (2026-03-10)
- [x] **Dark mode transition** — global CSS rule `* { transition: background-color/color/border-color 200ms }` added to index.css; animation/transform classes excluded (2026-03-10)
- [x] **Triads mode onboarding** — tooltip added to String Group label with "start with 1-2-3" guidance (2026-03-10)
- [x] **Inlay dots off-center** — investigated: `-6` offset = half of 12px dot, math is correct; false alarm

---

## 🟡 Medium Priority (polish)

- [ ] **String filter persistence** — All Notes string filter resets inconsistently when switching scales in the same view
- [ ] **Position label clipping** — labels at the top/bottom edge of VerticalScaleFretboard get cut off too aggressively; add a buffer zone
- [ ] **Chord label formatting incomplete** — `getChordLabel()` doesn't cover all ChordType values; silently falls back to generic name if a new type is added
- [ ] **Better error feedback for invalid URL params** — currently fails silently
- [ ] **Add min fret window floor** — single CAGED position view can render too few frets; ensure at least ±2 frets of context
- [ ] **Diminished chord intervals** — constants.ts defines "Diminished 7" as [0,3,6,9] which is dim7, not a diminished triad [0,3,6]; verify intent

---

## 🟢 Enhancements & New Features

### Monetization / Growth
- [ ] **"Learn this scale on YouTube" link per scale** — contextual external link; good affiliate/traffic hook
- [ ] **Affiliate sidebar** — show recommended gear (beginner guitar, capo, etc.) contextually; e.g. when user is in Position 1 of a beginner scale
- [ ] **Email capture** — "Save my progression" prompt; builds list for future offers/launches
- [ ] **Export fretboard as image** — shareable diagrams drive organic reach on social/forums

### UX / Features
- [ ] **Scale practice presets (diagonal runs)** — predefined scale practice patterns that show a specific path across the neck, e.g. start on 6th string at fret 3 and work diagonally down to 1st string at fret 12; teaches how scale positions connect across strings rather than staying in a box
- [ ] **Audio playback of scale notes** — play scale ascending/descending; major UX upgrade and keeps users on page longer
- [ ] **Custom tuning support** — Drop D, Open G, DADGAD, etc.; broadens audience significantly
- [ ] **Keyboard shortcuts** — arrow keys to change position, space to toggle metronome, etc.
- [ ] **Arpeggio patterns on Triads** — show picking order overlay for common arpeggio patterns
- [ ] **Custom scale/chord creator** — power-user feature; let users define their own interval sets

### Code / Infra
- [ ] **Test suite** — unit tests for musicLogic.ts edge cases (open strings, octave wrapping, CAGED offsets); integration tests for URL state restore
- [ ] **Split App.tsx** — 1300+ lines is getting unwieldy; extract ControlPanel, PracticePanel into separate components
- [ ] **Stricter TypeScript** — remove `@ts-ignore`, replace `any` types, make `positionIndex` required on FretboardNote
- [ ] **README: add browser support + troubleshooting section** — especially for metronome / AudioContext issues

---

## ✅ Done

- **Opacity logic in Fretboard** — out-of-position notes now render at 15% opacity instead of being hidden (2026-03-10)
- **Horizontal/Vertical toggle in All Notes view** — layout toggle now applies to both Scale Pattern and All Notes; VerticalScaleFretboard supports `showAllNotes` mode with per-note colors and string filter buttons (2026-03-10)
- **WelcomeModal Escape key** — (2026-03-10)
- **Tooltip scroll/resize tracking** — (2026-03-10)
- **Dark mode transition** — smooth 200ms CSS transition via index.css (2026-03-10)
- **Metronome AudioContext** — resumes suspended context; shows user-facing blocked warning (2026-03-10)
- **Triads onboarding** — String Group tooltip guides beginners to start with 1-2-3 (2026-03-10)
- **Mobile WelcomeModal fix** — modal now slides up as a bottom sheet on iOS; `max-height: 100dvh` with scrollable body and pinned header/footer so "Got it" button is always reachable (2026-03-10)
- **Add Chord button relocated** — removed from top-right header; now a dashed placeholder card inline with the chord grid so the action is adjacent to its result (2026-03-10)
- **Chord limit raised to 5** — all guards, labels, URL parsing, and preset application updated; VerticalChordChart stringSpacing adjusted for 5-column layout (2026-03-10)
- **WelcomeModal → tabbed Help Guide** — expanded into 4-tab modal (Overview, Scales, Chords, Practice); covers progression presets, Core vs Full CAGED, metronome how-to, Play Progression, looper pedal tips, CAGED challenge; `?` button tooltip updated to "Help & Feature Guide" (2026-03-10)
- **Help guide copy refinements** — "Play Progression (Looper)" renamed to "Play Progression"; looper references updated to clarify it means a looper pedal; CAGED challenge tip reworded to "Using a looper pedal, create a loop..." (2026-03-10)

