import React, { useMemo } from 'react';
import { NoteName, ChordType, Position } from '../types';
import { NOTES, CHORDS, POSITION_COLORS, POSITION_NAMES, STRING_TUNING_INDICES } from '../constants';
import clsx from 'clsx';

interface SelectedChord {
  id: number;
  root: NoteName;
  chordType: ChordType;
}

interface VerticalChordChartProps {
  chords: SelectedChord[];
  triadsOnly: boolean;
  activeChordId?: number | null;
  settings: {
    showNoteNames: boolean;
  };
}

// Get note at a specific string and fret
const getNoteAtFret = (stringIndex: number, fret: number): NoteName => {
  const openNoteIndex = STRING_TUNING_INDICES[stringIndex];
  const currentNoteIndex = (openNoteIndex + fret) % 12;
  return NOTES[currentNoteIndex];
};

// Get interval from root
const getIntervalFromRoot = (root: NoteName, note: NoteName): number => {
  const rootIdx = NOTES.indexOf(root);
  const noteIdx = NOTES.indexOf(note);
  return (noteIdx - rootIdx + 12) % 12;
};

// Get Position 1 start fret for a root
const getPosition1StartFret = (root: NoteName): number => {
  const rootIdx = NOTES.indexOf(root);
  const lowEIdx = 7; // E
  return (rootIdx - lowEIdx + 12) % 12;
};

// CAGED position fret offsets relative to P1 root
const CAGED_OFFSETS = [
  { pos: 1, name: 'E', minOffset: -1, maxOffset: 3 },
  { pos: 2, name: 'D', minOffset: 2, maxOffset: 5 },
  { pos: 3, name: 'C', minOffset: 4, maxOffset: 8 },
  { pos: 4, name: 'A', minOffset: 7, maxOffset: 10 },
  { pos: 5, name: 'G', minOffset: 9, maxOffset: 13 },
];

interface ChordNote {
  stringIndex: number;
  fret: number;
  note: NoteName;
  interval: number;
  isRoot: boolean;
  positionIndex: number;
}

// Triad intervals: Root, Minor 3rd, Major 3rd, Perfect 5th
const TRIAD_INTERVALS = [0, 3, 4, 7];

const generateChordNotes = (root: NoteName, chordType: ChordType, triadsOnly: boolean = false): ChordNote[] => {
  const definition = CHORDS[chordType];
  const notes: ChordNote[] = [];
  const p1Start = getPosition1StartFret(root);
  const maxFret = 17;

  // Filter to triad intervals only when enabled
  const allowedIntervals = triadsOnly
    ? definition.intervals.filter(i => TRIAD_INTERVALS.includes(i))
    : definition.intervals;

  for (let stringIdx = 0; stringIdx < 6; stringIdx++) {
    for (let fret = 0; fret <= maxFret; fret++) {
      const note = getNoteAtFret(stringIdx, fret);
      const interval = getIntervalFromRoot(root, note);

      if (!allowedIntervals.includes(interval)) continue;

      // Determine position based on fret location
      let posIndex = 0;
      for (const offset of CAGED_OFFSETS) {
        const minFret = p1Start + offset.minOffset;
        const maxFret = p1Start + offset.maxOffset;

        // Check base range, octave up, and octave down
        if ((fret >= minFret && fret <= maxFret) ||
            (fret >= minFret + 12 && fret <= maxFret + 12) ||
            (fret >= minFret - 12 && fret <= maxFret - 12)) {
          posIndex = offset.pos;
          break;
        }
      }

      if (posIndex === 0) posIndex = 1;

      notes.push({
        stringIndex: stringIdx,
        fret,
        note,
        interval,
        isRoot: interval === 0,
        positionIndex: posIndex,
      });
    }
  }

  return notes;
};

// Single vertical fretboard column
const FretboardColumn: React.FC<{
  chordId: number;
  root: NoteName;
  chordType: ChordType;
  triadsOnly: boolean;
  showNoteNames: boolean;
  totalChords: number;
  isActive: boolean;
}> = ({ chordId, root, chordType, triadsOnly, showNoteNames, totalChords, isActive }) => {
  const notes = useMemo(() => generateChordNotes(root, chordType, triadsOnly), [root, chordType, triadsOnly]);

  const maxFret = 17;
  const fretHeight = 36;
  const stringSpacing = totalChords >= 4 ? 42 : totalChords === 3 ? 36 : 32;
  const nutHeight = 8;
  const labelWidth = 98;
  const fretNumberWidth = 26;
  const leftRailWidth = labelWidth + fretNumberWidth;
  const fretboardWidth = stringSpacing * 5 + 40; // 6 strings

  const p1Start = getPosition1StartFret(root);

  // Calculate shape label positions
  const shapeLabels = CAGED_OFFSETS.map(offset => {
    let centerFret = p1Start + Math.floor((offset.minOffset + offset.maxOffset) / 2);
    // Handle octave wrapping
    if (centerFret < 0) centerFret += 12;
    if (centerFret > maxFret) centerFret -= 12;

    return {
      pos: offset.pos,
      name: `${POSITION_NAMES[offset.pos as 1|2|3|4|5]}`,
      fret: Math.max(1, Math.min(centerFret, maxFret - 1)),
      color: POSITION_COLORS[offset.pos as 1|2|3|4|5],
    };
  }).filter(label => label.fret >= 0 && label.fret <= maxFret);

  // Get chord quality label
  const getChordLabel = () => {
    switch (chordType) {
      case ChordType.MAJOR:
        return `${root} Major`;
      case ChordType.MINOR:
        return `${root} minor`;
      case ChordType.DOMINANT_7:
        return `${root}7`;
      case ChordType.MAJOR_7:
        return `${root}maj7`;
      case ChordType.MINOR_7:
        return `${root}m7`;
      case ChordType.MINOR_7_FLAT_5:
        return `${root}m7b5`;
      case ChordType.DIMINISHED:
        return `${root}dim`;
      default:
        return `${root} ${CHORDS[chordType].name}`;
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-col items-center rounded-lg p-2 transition-colors",
        isActive && "bg-violet-50 dark:bg-violet-900/20 ring-1 ring-violet-400 dark:ring-violet-500"
      )}
      data-chord-id={chordId}
    >
      {/* Header */}
      <div className="mb-2 text-center">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Example: {getChordLabel()}
        </span>
      </div>

      <div className="flex">
        {/* Shape Labels (left side) */}
        <div className="relative" style={{ width: leftRailWidth, height: (maxFret + 1) * fretHeight + nutHeight }}>
          {shapeLabels.map((label) => (
            <div
              key={`label-${label.pos}`}
              className="absolute flex items-center gap-1 text-xs whitespace-nowrap"
              style={{
                top: nutHeight + label.fret * fretHeight - 8,
                right: fretNumberWidth + 8,
              }}
            >
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ backgroundColor: label.color }}
              />
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                {label.name}
              </span>
            </div>
          ))}

          {/* Fret Numbers (left of neck) */}
          {Array.from({ length: maxFret }).map((_, i) => {
            const fretNum = i + 1;
            return (
              <div
                key={`left-fretnum-${fretNum}`}
                className="absolute text-xs text-slate-600 dark:text-slate-300 font-mono font-bold z-20 bg-white/80 dark:bg-slate-900/70 rounded px-1"
                style={{
                  top: nutHeight + fretNum * fretHeight - fretHeight / 2 - 6,
                  right: 2,
                }}
              >
                {fretNum}
              </div>
            );
          })}
        </div>

        {/* Fretboard */}
        <div
          className="relative bg-white border border-slate-300 dark:border-slate-600 rounded"
          style={{
            width: fretboardWidth,
            height: (maxFret + 1) * fretHeight + nutHeight,
          }}
        >
          {/* Nut */}
          <div
            className="absolute left-0 right-0 top-0 bg-slate-200 dark:bg-slate-500 border-b-2 border-slate-400 dark:border-slate-300"
            style={{ height: nutHeight }}
          />

          {/* Frets (horizontal lines) */}
          {Array.from({ length: maxFret + 1 }).map((_, fretNum) => (
            <div
              key={`fret-${fretNum}`}
              className="absolute left-0 right-0 border-b border-slate-400 dark:border-slate-500"
              style={{ top: nutHeight + fretNum * fretHeight }}
            />
          ))}

          {/* Strings (vertical lines) */}
          {Array.from({ length: 6 }).map((_, stringIdx) => (
            <div
              key={`string-${stringIdx}`}
              className="absolute top-0 bottom-0 bg-gradient-to-r from-slate-400 to-slate-500"
              style={{
                left: 20 + stringIdx * stringSpacing,
                width: 1 + (5 - stringIdx) * 0.3,
              }}
            />
          ))}

          {/* Inlay dots */}
          {[3, 5, 7, 9, 15].map(fret => (
            <div
              key={`inlay-${fret}`}
              className="absolute w-3 h-3 rounded-full bg-black/55"
              style={{
                top: nutHeight + fret * fretHeight - fretHeight / 2 - 6,
                left: fretboardWidth / 2 - 6,
              }}
            />
          ))}
          {/* Double dot at 12 */}
          <div
            className="absolute w-3 h-3 rounded-full bg-black/55"
            style={{
              top: nutHeight + 12 * fretHeight - fretHeight / 2 - 6,
              left: fretboardWidth / 2 - 20,
            }}
          />
          <div
            className="absolute w-3 h-3 rounded-full bg-black/55"
            style={{
              top: nutHeight + 12 * fretHeight - fretHeight / 2 - 6,
              left: fretboardWidth / 2 + 8,
            }}
          />

          {/* Notes */}
          {notes.map((note, idx) => {
            const x = 20 + note.stringIndex * stringSpacing;
            const y = note.fret === 0
              ? nutHeight / 2
              : nutHeight + note.fret * fretHeight - fretHeight / 2;
            const color = POSITION_COLORS[note.positionIndex as 1|2|3|4|5];

            return (
              <div
                key={`note-${idx}`}
                className={clsx(
                  "absolute w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md",
                  note.isRoot && "ring-2 ring-white w-7 h-7"
                )}
                style={{
                  left: x - (note.isRoot ? 14 : 12),
                  top: y - (note.isRoot ? 14 : 12),
                  backgroundColor: color,
                }}
              >
                {showNoteNames && note.note}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const VerticalChordChart: React.FC<VerticalChordChartProps> = ({
  chords,
  triadsOnly,
  activeChordId = null,
  settings,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 overflow-x-auto">
      <div className="flex gap-6 justify-between w-full min-w-max">
        {chords.map((chord) => (
          <FretboardColumn
            key={chord.id}
            chordId={chord.id}
            root={chord.root}
            chordType={chord.chordType}
            triadsOnly={triadsOnly}
            showNoteNames={settings.showNoteNames}
            totalChords={chords.length}
            isActive={activeChordId === chord.id}
          />
        ))}
      </div>
    </div>
  );
};

export default VerticalChordChart;
