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

- [ ] **Mobile layout for Chords view** — 4-chord layout is unreadable on phones/tablets; needs responsive stacking or horizontal scroll
- [ ] **Metronome fails silently** — AudioContext blocked by browser autoplay policy with no user feedback; add an error/prompt state
- [ ] **Tooltip scroll tracking** — tooltip stays at original DOM position if user scrolls while it's open; needs scroll listener or repositioning
- [ ] **WelcomeModal: add Escape key to close**
- [ ] **Dark mode transition** — theme switch is jarring; add a short CSS transition
- [ ] **Triads mode onboarding** — no guidance on which string group to start with; beginners will be lost
- [ ] **Inlay dots off-center** — single and double inlay dot formulas use arbitrary `-6` offset; should be derived from dot radius

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

<!-- Move completed items here with date -->

