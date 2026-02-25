import React, { useMemo } from 'react';
import { NoteName, ChordType } from '../types';
import { NOTES, STRING_TUNING_INDICES } from '../constants';
import clsx from 'clsx';

interface TriadChartProps {
  root: NoteName;
  quality: 'Major' | 'Minor';
  showNoteNames: boolean;
}

// String groups for 3-string triads (indices: 0=Low E, 1=A, 2=D, 3=G, 4=B, 5=high e)
const STRING_GROUPS = [
  { id: 1, name: 'e-B-G', strings: [5, 4, 3] },   // high to low: e, B, G
  { id: 2, name: 'B-G-D', strings: [4, 3, 2] },   // B, G, D
  { id: 3, name: 'G-D-A', strings: [3, 2, 1] },   // G, D, A
  { id: 4, name: 'D-A-E', strings: [2, 1, 0] },   // D, A, Low E
];

type Inversion = 'root' | '1st' | '2nd';

interface TriadNote {
  string: number;      // string index (0-5)
  fret: number;
  interval: 'R' | '3' | '5';
  note: NoteName;
}

// Get the note name at a specific fret on a string
const getNoteAtFret = (stringIndex: number, fret: number): NoteName => {
  const openNoteIndex = STRING_TUNING_INDICES[stringIndex];
  const currentNoteIndex = (openNoteIndex + fret) % 12;
  return NOTES[currentNoteIndex];
};

// Find the fret where a specific note occurs on a string (within a range)
const getFretForNote = (stringIndex: number, targetNote: NoteName, minFret: number = 0, maxFret: number = 15): number => {
  const openNoteIndex = STRING_TUNING_INDICES[stringIndex];
  const targetIndex = NOTES.indexOf(targetNote);

  for (let fret = minFret; fret <= maxFret; fret++) {
    const currentNoteIndex = (openNoteIndex + fret) % 12;
    if (currentNoteIndex === targetIndex) {
      return fret;
    }
  }
  return -1;
};

// Get the notes of a triad
const getTriadNotes = (root: NoteName, quality: 'Major' | 'Minor'): { R: NoteName; third: NoteName; fifth: NoteName } => {
  const rootIndex = NOTES.indexOf(root);
  const thirdInterval = quality === 'Major' ? 4 : 3;
  const fifthInterval = 7;

  return {
    R: root,
    third: NOTES[(rootIndex + thirdInterval) % 12],
    fifth: NOTES[(rootIndex + fifthInterval) % 12],
  };
};

// Generate triad voicing for a string group and inversion
const getTriadVoicing = (
  root: NoteName,
  quality: 'Major' | 'Minor',
  stringGroup: { strings: number[] },
  inversion: Inversion
): TriadNote[] => {
  const triad = getTriadNotes(root, quality);
  const [highString, midString, lowString] = stringGroup.strings;

  // Determine which note goes on which string based on inversion
  // In voicings, we think from low to high string
  let noteAssignments: { string: number; interval: 'R' | '3' | '5'; targetNote: NoteName }[];

  switch (inversion) {
    case 'root':
      // Root on lowest string, 3rd in middle, 5th on highest
      noteAssignments = [
        { string: lowString, interval: 'R', targetNote: triad.R },
        { string: midString, interval: '3', targetNote: triad.third },
        { string: highString, interval: '5', targetNote: triad.fifth },
      ];
      break;
    case '1st':
      // 3rd on lowest, 5th in middle, Root on highest
      noteAssignments = [
        { string: lowString, interval: '3', targetNote: triad.third },
        { string: midString, interval: '5', targetNote: triad.fifth },
        { string: highString, interval: 'R', targetNote: triad.R },
      ];
      break;
    case '2nd':
      // 5th on lowest, Root in middle, 3rd on highest
      noteAssignments = [
        { string: lowString, interval: '5', targetNote: triad.fifth },
        { string: midString, interval: 'R', targetNote: triad.R },
        { string: highString, interval: '3', targetNote: triad.third },
      ];
      break;
  }

  // Find frets for each note, starting from low string and trying to keep voicing compact
  const result: TriadNote[] = [];
  let baseFret = 0;

  // Find starting fret from the lowest string
  const lowFret = getFretForNote(noteAssignments[0].string, noteAssignments[0].targetNote, 0, 12);
  baseFret = lowFret;

  for (const assignment of noteAssignments) {
    // Search within a reasonable range from base fret to keep voicing compact
    let fret = getFretForNote(assignment.string, assignment.targetNote, Math.max(0, baseFret - 2), baseFret + 5);

    // If not found in preferred range, expand search
    if (fret === -1) {
      fret = getFretForNote(assignment.string, assignment.targetNote, 0, 15);
    }

    if (fret !== -1) {
      result.push({
        string: assignment.string,
        fret,
        interval: assignment.interval,
        note: assignment.targetNote,
      });
    }
  }

  return result;
};

// Find the base fret for displaying a voicing (lowest fret minus 1, but at least 1)
const getVoicingBaseFret = (voicing: TriadNote[]): number => {
  if (voicing.length === 0) return 1;
  const minFret = Math.min(...voicing.map(n => n.fret));
  return Math.max(1, minFret);
};

// Get slash notation for chord (e.g., C/E for C major 1st inversion)
const getChordName = (root: NoteName, quality: 'Major' | 'Minor', inversion: Inversion): string => {
  const triad = getTriadNotes(root, quality);
  const qualitySuffix = quality === 'Minor' ? 'm' : '';

  switch (inversion) {
    case 'root':
      return `${root}${qualitySuffix}`;
    case '1st':
      return `${root}${qualitySuffix}/${triad.third}`;
    case '2nd':
      return `${root}${qualitySuffix}/${triad.fifth}`;
  }
};

// Mini fretboard component for a single voicing
const MiniVoicing: React.FC<{
  voicing: TriadNote[];
  stringGroup: { strings: number[] };
  chordName: string;
  inversionLabel: string;
  showNoteNames: boolean;
}> = ({ voicing, stringGroup, chordName, inversionLabel, showNoteNames }) => {
  const baseFret = getVoicingBaseFret(voicing);
  const displayFrets = 4; // Show 4 frets

  const fretHeight = 28;
  const stringSpacing = 24;
  const topPadding = 20;
  const leftPadding = 24;
  const rightPadding = 8;
  const width = leftPadding + (2 * stringSpacing) + rightPadding;
  const height = topPadding + (displayFrets * fretHeight) + 10;

  // Colors for intervals
  const intervalColors: Record<string, string> = {
    'R': '#ef4444',  // Red for root
    '3': '#3b82f6',  // Blue for third
    '5': '#22c55e',  // Green for fifth
  };

  return (
    <div className="flex flex-col items-center">
      {/* Chord name */}
      <div className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-0.5">
        {chordName}
      </div>
      {/* Inversion label */}
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
        {inversionLabel}
      </div>

      <div
        className="relative bg-amber-100 dark:bg-amber-900/40 border border-slate-300 dark:border-slate-600 rounded"
        style={{ width, height }}
      >
        {/* Fret number label */}
        <div
          className="absolute text-xs font-mono text-slate-500 dark:text-slate-400"
          style={{ left: 4, top: topPadding + fretHeight / 2 - 6 }}
        >
          {baseFret}
        </div>

        {/* Fret lines (horizontal) */}
        {Array.from({ length: displayFrets + 1 }).map((_, i) => (
          <div
            key={`fret-${i}`}
            className={clsx(
              "absolute border-b",
              i === 0 && baseFret === 1
                ? "border-slate-400 dark:border-slate-300 border-b-4"
                : "border-slate-400 dark:border-slate-500"
            )}
            style={{
              left: leftPadding - 4,
              right: rightPadding - 4,
              top: topPadding + i * fretHeight,
            }}
          />
        ))}

        {/* String lines (vertical) - only 3 strings */}
        {stringGroup.strings.map((_, idx) => (
          <div
            key={`string-${idx}`}
            className="absolute bg-gradient-to-r from-slate-400 to-slate-500"
            style={{
              left: leftPadding + idx * stringSpacing,
              top: topPadding,
              bottom: 10,
              width: 1.5,
            }}
          />
        ))}

        {/* Notes */}
        {voicing.map((note, idx) => {
          const stringIdx = stringGroup.strings.indexOf(note.string);
          if (stringIdx === -1) return null;

          const fretOffset = note.fret - baseFret;
          if (fretOffset < 0 || fretOffset >= displayFrets) return null;

          const x = leftPadding + stringIdx * stringSpacing;
          const y = topPadding + fretOffset * fretHeight + fretHeight / 2;
          const color = intervalColors[note.interval];
          const isRoot = note.interval === 'R';

          return (
            <div
              key={`note-${idx}`}
              className={clsx(
                "absolute rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-md transform -translate-x-1/2 -translate-y-1/2",
                isRoot ? "w-7 h-7 ring-2 ring-white" : "w-6 h-6"
              )}
              style={{
                left: x,
                top: y,
                backgroundColor: color,
              }}
            >
              {showNoteNames ? note.note : note.interval}
            </div>
          );
        })}
      </div>

      {/* Interval legend below */}
      <div className="flex gap-1 mt-2 text-[10px]">
        {voicing
          .sort((a, b) => stringGroup.strings.indexOf(b.string) - stringGroup.strings.indexOf(a.string))
          .map((note, idx) => (
          <span
            key={idx}
            className="px-1.5 py-0.5 rounded font-medium text-white"
            style={{ backgroundColor: intervalColors[note.interval] }}
          >
            {note.interval}
          </span>
        ))}
      </div>
    </div>
  );
};

// String group section showing all 3 inversions
const StringGroupSection: React.FC<{
  root: NoteName;
  quality: 'Major' | 'Minor';
  stringGroup: typeof STRING_GROUPS[0];
  showNoteNames: boolean;
}> = ({ root, quality, stringGroup, showNoteNames }) => {
  const inversions: { type: Inversion; label: string }[] = [
    { type: 'root', label: 'Root Pos.' },
    { type: '1st', label: '1st Inv.' },
    { type: '2nd', label: '2nd Inv.' },
  ];

  return (
    <div className="flex flex-col">
      {/* String group header */}
      <div className="text-center mb-3">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Strings {stringGroup.name}
        </div>
      </div>

      {/* Inversions row */}
      <div className="flex gap-3 justify-center">
        {inversions.map(({ type, label }) => {
          const voicing = getTriadVoicing(root, quality, stringGroup, type);
          const chordName = getChordName(root, quality, type);

          return (
            <MiniVoicing
              key={type}
              voicing={voicing}
              stringGroup={stringGroup}
              chordName={chordName}
              inversionLabel={label}
              showNoteNames={showNoteNames}
            />
          );
        })}
      </div>
    </div>
  );
};

const TriadChart: React.FC<TriadChartProps> = ({ root, quality, showNoteNames }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-slate-800 dark:text-white">
          {root} {quality} Triad Voicings
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          3-string shapes across all string groups
        </p>
        {/* Interval legend */}
        <div className="flex gap-4 justify-center mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-[#ef4444] ring-2 ring-white" />
            <span className="text-xs text-slate-600 dark:text-slate-300">Root</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-[#3b82f6]" />
            <span className="text-xs text-slate-600 dark:text-slate-300">3rd</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-[#22c55e]" />
            <span className="text-xs text-slate-600 dark:text-slate-300">5th</span>
          </div>
        </div>
      </div>

      {/* String groups grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {STRING_GROUPS.map((group) => (
          <StringGroupSection
            key={group.id}
            root={root}
            quality={quality}
            stringGroup={group}
            showNoteNames={showNoteNames}
          />
        ))}
      </div>
    </div>
  );
};

export default TriadChart;
