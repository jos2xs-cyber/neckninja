import React, { useMemo } from 'react';
import { NoteName, ScaleType, Position, Settings } from '../types';
import { POSITION_COLORS, POSITION_NAMES } from '../constants';
import { generateFretboard } from '../utils/musicLogic';
import clsx from 'clsx';

interface VerticalScaleFretboardProps {
  root: NoteName;
  scaleType: ScaleType;
  position: Position;
  settings: Settings;
}

const VerticalScaleFretboard: React.FC<VerticalScaleFretboardProps> = ({
  root,
  scaleType,
  position,
  settings,
}) => {
  const allNotes = useMemo(
    () => generateFretboard(root, scaleType, position, 'Scale', false),
    [root, scaleType, position]
  );

  const activeNotes = useMemo(() => allNotes.filter(n => n.opacity >= 0.5), [allNotes]);

  const isFullNeck = position === 'Full Neck';

  // Determine visible fret window
  const { minFret, maxFret } = useMemo(() => {
    if (isFullNeck) return { minFret: 0, maxFret: 18 };
    const frets = activeNotes.filter(n => n.fret > 0).map(n => n.fret);
    if (frets.length === 0) return { minFret: 0, maxFret: 7 };
    return {
      minFret: Math.max(0, Math.min(...frets) - 1),
      maxFret: Math.min(24, Math.max(...frets) + 1),
    };
  }, [activeNotes, isFullNeck]);

  const fretHeight = 46;
  const stringSpacing = 48;
  const nutHeight = 8;
  const labelWidth = 92;
  const fretNumberWidth = 26;
  const leftRailWidth = labelWidth + fretNumberWidth;
  const fretboardWidth = stringSpacing * 5 + 40;
  const fretCount = maxFret - minFret;
  const totalHeight = fretCount * fretHeight + nutHeight;

  // Position labels for full-neck view
  const positionLabels = useMemo(() => {
    if (!isFullNeck) return [];
    const posMap: Record<number, number[]> = {};
    activeNotes.forEach(n => {
      if (n.fret > 0 && n.positionIndex) {
        if (!posMap[n.positionIndex]) posMap[n.positionIndex] = [];
        posMap[n.positionIndex].push(n.fret);
      }
    });
    return Object.entries(posMap).map(([pos, frets]) => ({
      posIndex: Number(pos) as 1 | 2 | 3 | 4 | 5,
      name: POSITION_NAMES[Number(pos) as 1 | 2 | 3 | 4 | 5],
      midFret: Math.round(frets.reduce((a, b) => a + b, 0) / frets.length),
      color: POSITION_COLORS[Number(pos) as 1 | 2 | 3 | 4 | 5],
    }));
  }, [activeNotes, isFullNeck]);

  const visibleNotes = activeNotes.filter(n => n.fret >= minFret && n.fret <= maxFret);

  const SINGLE_INLAY_FRETS = [3, 5, 7, 9, 15, 17, 19, 21];
  const DOUBLE_INLAY_FRETS = [12, 24];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex w-fit mx-auto overflow-x-auto">
      <div className="flex">
        {/* Left rail: position labels + fret numbers */}
        <div className="relative" style={{ width: leftRailWidth, height: totalHeight }}>
          {positionLabels.map(label => {
            const top = nutHeight + (label.midFret - minFret) * fretHeight - 8;
            if (top < 0 || top > totalHeight) return null;
            return (
              <div
                key={`pos-${label.posIndex}`}
                className="absolute flex items-center gap-1 text-xs whitespace-nowrap"
                style={{ top, right: fretNumberWidth + 8 }}
              >
                <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: label.color }} />
                <span className="text-slate-600 dark:text-slate-400 font-medium">{label.name}</span>
              </div>
            );
          })}

          {Array.from({ length: fretCount }).map((_, i) => {
            const fretNum = minFret + i + 1;
            return (
              <div
                key={`fretnum-${fretNum}`}
                className="absolute text-xs text-slate-600 dark:text-slate-300 font-mono font-bold z-20 bg-white/80 dark:bg-slate-900/70 rounded px-1"
                style={{
                  top: nutHeight + (fretNum - minFret) * fretHeight - fretHeight / 2 - 6,
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
          style={{ width: fretboardWidth, height: totalHeight }}
        >
          {/* Nut */}
          {minFret === 0 && (
            <div
              className="absolute left-0 right-0 top-0 bg-slate-300 dark:bg-slate-500 border-b-4 border-slate-500 dark:border-slate-300"
              style={{ height: nutHeight }}
            />
          )}

          {/* Fret lines */}
          {Array.from({ length: fretCount + 1 }).map((_, i) => (
            <div
              key={`fretline-${i}`}
              className="absolute left-0 right-0 border-b border-slate-400 dark:border-slate-500"
              style={{ top: nutHeight + i * fretHeight }}
            />
          ))}

          {/* Strings (vertical) */}
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

          {/* Single inlay dots */}
          {SINGLE_INLAY_FRETS.filter(f => f > minFret && f <= maxFret).map(fret => (
            <div
              key={`inlay-${fret}`}
              className="absolute w-3 h-3 rounded-full bg-black/20"
              style={{
                top: nutHeight + (fret - minFret) * fretHeight - fretHeight / 2 - 6,
                left: fretboardWidth / 2 - 6,
              }}
            />
          ))}

          {/* Double inlay dots at 12 and 24 */}
          {DOUBLE_INLAY_FRETS.filter(f => f > minFret && f <= maxFret).map(fret => (
            <React.Fragment key={`double-${fret}`}>
              <div
                className="absolute w-3 h-3 rounded-full bg-black/20"
                style={{
                  top: nutHeight + (fret - minFret) * fretHeight - fretHeight / 2 - 6,
                  left: fretboardWidth / 2 - 20,
                }}
              />
              <div
                className="absolute w-3 h-3 rounded-full bg-black/20"
                style={{
                  top: nutHeight + (fret - minFret) * fretHeight - fretHeight / 2 - 6,
                  left: fretboardWidth / 2 + 8,
                }}
              />
            </React.Fragment>
          ))}

          {/* Notes */}
          {visibleNotes.map((note, idx) => {
            const x = 20 + note.stringIndex * stringSpacing;
            const y = note.fret === 0
              ? nutHeight / 2
              : nutHeight + (note.fret - minFret) * fretHeight - fretHeight / 2;

            const colorKey = isFullNeck ? note.positionIndex : position;
            const color = POSITION_COLORS[colorKey as 1 | 2 | 3 | 4 | 5] || POSITION_COLORS[1];
            const isRoot = note.isRoot && !isFullNeck;
            const size = isRoot ? 30 : 24;
            const half = size / 2;

            return (
              <div
                key={`note-${idx}`}
                className={clsx(
                  'absolute rounded-full flex items-center justify-center font-bold text-white shadow-md z-10',
                  isRoot && 'ring-2 ring-white'
                )}
                style={{
                  width: size,
                  height: size,
                  left: x - half,
                  top: y - half,
                  backgroundColor: color,
                  fontSize: settings.showNoteNames ? 10 : undefined,
                }}
              >
                {settings.showNoteNames && note.note}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VerticalScaleFretboard;
