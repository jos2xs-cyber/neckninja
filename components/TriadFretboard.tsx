import React, { useMemo } from 'react';
import { NoteName, TriadQuality, StringGroup } from '../types';
import { NOTES, STRING_TUNING_INDICES, POSITION_NAMES } from '../constants';
import clsx from 'clsx';

interface TriadFretboardProps {
  root: NoteName;
  quality: TriadQuality;
  showNoteNames: boolean;
  showIntervalLabels: boolean;
  stringGroup: StringGroup;
}

// Map string groups to string indices
// stringIndex 0 = Low E (6th), 1 = A (5th), 2 = D (4th), 3 = G (3rd), 4 = B (2nd), 5 = high E (1st)
const STRING_GROUP_INDICES: Record<StringGroup, number[]> = {
  'All': [0, 1, 2, 3, 4, 5],
  '1-2-3': [5, 4, 3],  // Strings 1, 2, 3 (high E, B, G)
  '2-3-4': [4, 3, 2],  // Strings 2, 3, 4 (B, G, D)
  '3-4-5': [3, 2, 1],  // Strings 3, 4, 5 (G, D, A)
  '4-5-6': [2, 1, 0],  // Strings 4, 5, 6 (D, A, low E)
};

// Interval colors matching the PDF style
const INTERVAL_COLORS = {
  root: '#ef4444',  // Red
  third: '#3b82f6', // Blue
  fifth: '#22c55e', // Green
};

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

interface TriadNote {
  stringIndex: number;
  fret: number;
  note: NoteName;
  interval: number;
  intervalName: 'root' | 'third' | 'fifth';
  positionIndex: number;
}

const generateTriadNotes = (root: NoteName, quality: TriadQuality): TriadNote[] => {
  // Major: 0, 4, 7 (R, M3, P5)
  // Minor: 0, 3, 7 (R, m3, P5)
  const intervals = quality === TriadQuality.MAJOR ? [0, 4, 7] : [0, 3, 7];
  const notes: TriadNote[] = [];
  const p1Start = getPosition1StartFret(root);
  const maxFret = 17;

  for (let stringIdx = 0; stringIdx < 6; stringIdx++) {
    for (let fret = 0; fret <= maxFret; fret++) {
      const note = getNoteAtFret(stringIdx, fret);
      const interval = getIntervalFromRoot(root, note);

      if (!intervals.includes(interval)) continue;

      // Determine interval name
      let intervalName: 'root' | 'third' | 'fifth';
      if (interval === 0) {
        intervalName = 'root';
      } else if (interval === 3 || interval === 4) {
        intervalName = 'third';
      } else {
        intervalName = 'fifth';
      }

      // Determine position based on fret location
      let posIndex = 0;
      for (const offset of CAGED_OFFSETS) {
        const minFret = p1Start + offset.minOffset;
        const maxFret = p1Start + offset.maxOffset;

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
        intervalName,
        positionIndex: posIndex,
      });
    }
  }

  return notes;
};

const TriadFretboard: React.FC<TriadFretboardProps> = ({
  root,
  quality,
  showNoteNames,
  showIntervalLabels,
  stringGroup,
}) => {
  const allNotes = useMemo(() => generateTriadNotes(root, quality), [root, quality]);

  // Filter notes by string group
  const notes = useMemo(() => {
    const allowedStrings = STRING_GROUP_INDICES[stringGroup];
    return allNotes.filter(note => allowedStrings.includes(note.stringIndex));
  }, [allNotes, stringGroup]);

  const maxFret = 17;
  const fretHeight = 44;      // Increased from 36
  const stringSpacing = 36;   // Increased from 28
  const nutHeight = 10;       // Increased from 8
  const labelWidth = 90;      // Increased from 80
  const fretboardWidth = stringSpacing * 5 + 50; // Wider fretboard

  const p1Start = getPosition1StartFret(root);

  // Calculate shape label positions
  const shapeLabels = CAGED_OFFSETS.map(offset => {
    let centerFret = p1Start + Math.floor((offset.minOffset + offset.maxOffset) / 2);
    if (centerFret < 0) centerFret += 12;
    if (centerFret > maxFret) centerFret -= 12;

    return {
      pos: offset.pos,
      name: `${offset.name}-Shape`,
      fret: Math.max(1, Math.min(centerFret, maxFret - 1)),
    };
  }).filter(label => label.fret >= 0 && label.fret <= maxFret);

  // Get interval label for display
  const getIntervalLabel = (intervalName: 'root' | 'third' | 'fifth'): string => {
    switch (intervalName) {
      case 'root': return 'R';
      case 'third': return '3';
      case 'fifth': return '5';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      {/* Header with legend */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {root} {quality} Triads
        </h2>
        <p className="text-base text-slate-500 dark:text-slate-400 mb-4">
          {stringGroup === 'All' ? 'Full fretboard view' : `Strings ${stringGroup}`} - colored by interval
        </p>

        {/* Legend */}
        <div className="flex justify-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: INTERVAL_COLORS.root }}>R</div>
            <span className="text-base text-slate-600 dark:text-slate-300">Root</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: INTERVAL_COLORS.third }}>3</div>
            <span className="text-base text-slate-600 dark:text-slate-300">{quality === TriadQuality.MAJOR ? 'Major' : 'Minor'} 3rd</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: INTERVAL_COLORS.fifth }}>5</div>
            <span className="text-base text-slate-600 dark:text-slate-300">Perfect 5th</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex">
          {/* Shape Labels (left side) */}
          <div className="relative" style={{ width: labelWidth, height: (maxFret + 1) * fretHeight + nutHeight }}>
            {shapeLabels.map((label) => (
              <div
                key={`label-${label.pos}`}
                className="absolute right-2 flex items-center gap-1 text-xs whitespace-nowrap"
                style={{
                  top: nutHeight + label.fret * fretHeight - 8,
                }}
              >
                <span className="text-slate-500 dark:text-slate-400 font-medium">
                  {label.name}
                </span>
              </div>
            ))}
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

            {/* Fret Numbers */}
            {Array.from({ length: maxFret }).map((_, i) => {
              const fretNum = i + 1;
              return (
                <div
                  key={`fretnum-${fretNum}`}
                  className="absolute text-[10px] text-slate-400 dark:text-slate-500 font-mono"
                  style={{
                    top: nutHeight + fretNum * fretHeight - fretHeight / 2 - 6,
                    left: -16,
                  }}
                >
                  {fretNum}
                </div>
              );
            })}

            {/* Strings (vertical lines) */}
            {Array.from({ length: 6 }).map((_, stringIdx) => (
              <div
                key={`string-${stringIdx}`}
                className="absolute top-0 bottom-0 bg-gradient-to-r from-slate-400 to-slate-500"
                style={{
                  left: 25 + stringIdx * stringSpacing,
                  width: 1 + (5 - stringIdx) * 0.4,
                }}
              />
            ))}

            {/* Inlay dots */}
            {[3, 5, 7, 9, 15].map(fret => (
              <div
                key={`inlay-${fret}`}
                className="absolute w-4 h-4 rounded-full bg-black/55"
                style={{
                  top: nutHeight + fret * fretHeight - fretHeight / 2 - 8,
                  left: fretboardWidth / 2 - 8,
                }}
              />
            ))}
            {/* Double dot at 12 */}
            <div
              className="absolute w-4 h-4 rounded-full bg-black/55"
              style={{
                top: nutHeight + 12 * fretHeight - fretHeight / 2 - 8,
                left: fretboardWidth / 2 - 24,
              }}
            />
            <div
              className="absolute w-4 h-4 rounded-full bg-black/55"
              style={{
                top: nutHeight + 12 * fretHeight - fretHeight / 2 - 8,
                left: fretboardWidth / 2 + 10,
              }}
            />

            {/* Notes */}
            {notes.map((note, idx) => {
              const x = 25 + note.stringIndex * stringSpacing;
              const y = note.fret === 0
                ? nutHeight / 2
                : nutHeight + note.fret * fretHeight - fretHeight / 2;
              const color = INTERVAL_COLORS[note.intervalName];
              const isRoot = note.intervalName === 'root';

              return (
                <div
                  key={`note-${idx}`}
                  className={clsx(
                    "absolute rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md",
                    isRoot ? "w-9 h-9 ring-2 ring-white" : "w-8 h-8"
                  )}
                  style={{
                    left: x - (isRoot ? 18 : 16),
                    top: y - (isRoot ? 18 : 16),
                    backgroundColor: color,
                  }}
                >
                  {showNoteNames
                    ? note.note
                    : showIntervalLabels
                      ? getIntervalLabel(note.intervalName)
                      : ''
                  }
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriadFretboard;
