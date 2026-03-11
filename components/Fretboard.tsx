import React, { useMemo, useRef } from 'react';
import { FretboardNote, Position, Settings, Mode, ScaleType, ChordType, NoteName } from '../types';
import { POSITION_COLORS } from '../constants';
import { generateFretboard } from '../utils/musicLogic';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';

interface FretboardProps {
  root: any;
  type: ScaleType | ChordType;
  mode: Mode;
  position: Position;
  settings: Settings;
  showAllNotes?: boolean;
  allNotesZoom?: number;
  activeStringFilter?: number | null;
  onStringFilterChange?: (stringIndex: number | null) => void;
  activeNoteFilter?: NoteName | null;
  onNoteFilterChange?: (note: NoteName | null) => void;
  onExportRef?: (ref: React.RefObject<HTMLDivElement>) => void;
}

const NOTE_COLORS: Record<string, string> = {
  A: '#ef4444',
  'A#': '#f97316',
  B: '#eab308',
  C: '#84cc16',
  'C#': '#22c55e',
  D: '#14b8a6',
  'D#': '#06b6d4',
  E: '#3b82f6',
  F: '#6366f1',
  'F#': '#8b5cf6',
  G: '#d946ef',
  'G#': '#ec4899',
};

const STRING_ORDINAL_LABELS = [
  { stringIndex: 0, label: '6th' },
  { stringIndex: 1, label: '5th' },
  { stringIndex: 2, label: '4th' },
  { stringIndex: 3, label: '3rd' },
  { stringIndex: 4, label: '2nd' },
  { stringIndex: 5, label: '1st' },
];

const Fretboard: React.FC<FretboardProps> = ({
  root,
  type,
  mode,
  position,
  settings,
  showAllNotes = false,
  allNotesZoom = 1,
  activeStringFilter = null,
  onStringFilterChange,
  activeNoteFilter = null,
  onNoteFilterChange,
  onExportRef
}) => {
  const fretboardRef = useRef<HTMLDivElement>(null);
  
  // Expose ref to parent if requested
  React.useEffect(() => {
    if (onExportRef) onExportRef(fretboardRef);
  }, [onExportRef]);

  const notes = useMemo(() => 
    generateFretboard(root, type, position, mode, showAllNotes), 
    [root, type, position, mode, showAllNotes]
  );

  // Constants for rendering
  const FRETS = 24;
  const STRINGS = 6;
  const FRETBOARD_HEIGHT = 320;
  const TOP_PADDING = 24;
  const BOTTOM_PADDING = 24;
  const STRING_SPACING = (FRETBOARD_HEIGHT - TOP_PADDING - BOTTOM_PADDING) / (STRINGS - 1);

  const getStringTop = (stringIndex: number) => {
      // stringIndex: 0=Low E (bottom) ... 5=High E (top)
      return TOP_PADDING + (STRINGS - 1 - stringIndex) * STRING_SPACING;
  };
  
  const getFretWidth = (i: number) => {
      const zoom = showAllNotes ? allNotesZoom : 1;
      return 60 * zoom * Math.pow(0.985, i);
  };

  const fretWidths = Array.from({ length: FRETS + 1 }, (_, i) => getFretWidth(i)); 
  const stringLabelGutter = showAllNotes ? 64 : 0;

  const getFretPosition = (fretIndex: number) => {
      let pos = 0;
      for (let i = 0; i < fretIndex; i++) {
          pos += fretWidths[i];
      }
      return pos;
  };
  
  const totalWidth = getFretPosition(FRETS + 1);

  const renderConnections = () => {
    if (showAllNotes || position === 'Full Neck' || !settings.showConnections) return null;
    
    const visibleNotes = notes.filter(n => n.opacity === 1);
    if (visibleNotes.length === 0) return null;

    const maxFret = Math.max(...visibleNotes.map(n => n.fret));
    const edgeNotes = visibleNotes.filter(n => n.fret >= maxFret - 1);
    
    return edgeNotes.map((note, idx) => {
        const left = getFretPosition(note.fret) + (fretWidths[note.fret] / 2) + 25; 
        const top = getStringTop(note.stringIndex); 
        
        return (
            <div 
                key={`conn-${idx}`}
                className="absolute z-20 animate-pulse text-white/50 pointer-events-none"
                style={{ left: `${left}px`, top: `${top - 12}px` }}
            >
                <ArrowRight className="w-6 h-6 drop-shadow-lg" />
            </div>
        );
    });
  };

  return (
    <div className="w-full overflow-x-auto custom-scrollbar bg-slate-100 dark:bg-slate-800 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700 p-1">
      <div style={{ paddingLeft: `${stringLabelGutter}px` }}>
        <div
          className="relative h-8 border-b border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40"
          style={{ width: `${Math.max(totalWidth, 1000)}px` }}
        >
          {Array.from({ length: FRETS }).map((_, i) => {
            const center = getFretPosition(i + 1) - (fretWidths[i] / 2);
            return (
              <div
                key={`fret-strip-label-${i + 1}`}
                className="absolute text-xs font-mono font-bold text-slate-700 dark:text-slate-100 bg-white dark:bg-slate-800 rounded px-1.5 py-0.5 border border-slate-300 dark:border-slate-600 z-20 select-none"
                style={{ left: `${center - 11}px`, top: '4px' }}
              >
                {i + 1}
              </div>
            );
          })}
        </div>

        <div 
          ref={fretboardRef}
          className={clsx(
            "relative bg-white transition-colors duration-300 select-none",
            showAllNotes ? "overflow-visible" : "overflow-hidden"
          )}
          style={{ 
              width: `${Math.max(totalWidth, 1000)}px`,
              height: `${FRETBOARD_HEIGHT}px`,
              backgroundImage: 'none',
              backgroundSize: 'auto'
          }}
        >
        {/* Nut */}
        <div className="absolute left-0 top-0 bottom-0 w-4 bg-[#e5e5e5] border-r-2 border-slate-400 z-10 shadow-xl"></div>

        {/* Frets */}
        {Array.from({ length: FRETS }).map((_, i) => {
            const left = getFretPosition(i + 1);
            return (
                <div 
                    key={`fret-${i}`} 
                    className="absolute top-0 bottom-0 w-2 bg-gradient-to-r from-fret-light to-fret-dark border-l border-black/20"
                    style={{ left: `${left}px` }}
                />
            );
        })}

        {/* Inlays */}
        {[3, 5, 7, 9, 15, 17, 19, 21].map(fret => (
            <div key={`inlay-${fret}`} 
                 className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-black/55" 
                 style={{ left: `${getFretPosition(fret) - (fretWidths[fret-1] / 2) - 8}px` }} />
        ))}
         <div className="absolute top-1/3 -translate-y-1/2 w-4 h-4 rounded-full bg-black/55" 
                 style={{ left: `${getFretPosition(12) - (fretWidths[11] / 2) - 8}px` }} />
         <div className="absolute top-2/3 -translate-y-1/2 w-4 h-4 rounded-full bg-black/55" 
                 style={{ left: `${getFretPosition(12) - (fretWidths[11] / 2) - 8}px` }} />
         <div className="absolute top-1/3 -translate-y-1/2 w-4 h-4 rounded-full bg-black/55" 
                 style={{ left: `${getFretPosition(24) - (fretWidths[23] / 2) - 8}px` }} />
         <div className="absolute top-2/3 -translate-y-1/2 w-4 h-4 rounded-full bg-black/55" 
                 style={{ left: `${getFretPosition(24) - (fretWidths[23] / 2) - 8}px` }} />


        {/* Strings */}
        {Array.from({ length: STRINGS }).map((_, i) => (
          <div
            key={`string-${i}`}
            className="absolute left-0 right-0 bg-gradient-to-b from-slate-300 to-slate-500 shadow-sm"
            style={{
              // Top string (high E) is thinner; bottom string (low E) is thicker.
              height: `${1 + i * 0.6}px`,
              top: `${TOP_PADDING + i * STRING_SPACING}px`
            }}
          />
        ))}

        {showAllNotes && (
          <div className="absolute left-0 top-0 bottom-0 z-50">
            {STRING_ORDINAL_LABELS.map(({ stringIndex, label }) => {
              const isActive = activeStringFilter === stringIndex;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onStringFilterChange?.(isActive ? null : stringIndex)}
                  className={clsx(
                    "absolute -translate-y-1/2 text-[11px] font-bold border rounded px-1 transition-colors",
                    isActive
                      ? "text-white bg-violet-600 border-violet-600"
                      : "text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900/85 border-slate-300 dark:border-slate-600 hover:bg-violet-50 dark:hover:bg-violet-900/25"
                  )}
                  style={{ left: '-58px', top: `${getStringTop(stringIndex)}px` }}
                  title={`Show only ${label} string notes`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        )}

        {/* Notes */}
        {notes.map((note, idx) => {
            if (showAllNotes && activeStringFilter !== null && note.stringIndex !== activeStringFilter) {
              return null;
            }
            const openFretOffset = showAllNotes && note.fret === 0 ? -6 : 0;
            const firstFretOffset = showAllNotes && note.fret === 1 ? 5 : 0;
            const fretCenter = note.fret === 0
                ? 8 + openFretOffset
                : getFretPosition(note.fret) - (fretWidths[note.fret-1] / 2) + firstFretOffset;

            const stringTop = getStringTop(note.stringIndex);

            const colorKey = position === 'Full Neck' ? note.positionIndex : position;
            const baseColor = showAllNotes
              ? NOTE_COLORS[note.note] ?? '#64748b'
              : (POSITION_COLORS[colorKey as 1|2|3|4|5] || POSITION_COLORS[1]);

            if (note.opacity <= 0) return null;

            const isNoteFiltered = showAllNotes && activeNoteFilter !== null && note.note !== activeNoteFilter;
            const dotOpacity = isNoteFiltered ? 0.15 : note.opacity;
            const isActiveFiltered = showAllNotes && activeNoteFilter === note.note;

            return (
                <div
                    key={`note-${idx}`}
                    onClick={showAllNotes ? () => onNoteFilterChange?.(activeNoteFilter === note.note ? null : note.note) : undefined}
                    className={clsx(
                        "absolute w-8 h-8 -ml-4 -mt-4 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-all duration-300 z-20",
                        showAllNotes ? "cursor-pointer" : "cursor-default group",
                        note.isRoot && !showAllNotes && "ring-2 ring-white w-9 h-9 -ml-[18px] -mt-[18px] z-30",
                        note.isRoot && position !== 'Full Neck' && !showAllNotes && "animate-pulse-slow",
                        isActiveFiltered && "ring-2 ring-white scale-110 z-30"
                    )}
                    style={{
                        left: `${fretCenter}px`,
                        top: `${stringTop}px`,
                        backgroundColor: baseColor,
                        opacity: dotOpacity,
                    }}
                >
                    {settings.showNoteNames && <span>{note.note}</span>}
                    {note.isRoot && !showAllNotes && <div className="absolute inset-0 rounded-full border-2 border-white opacity-50 animate-ping" />}

                    {!showAllNotes && (
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-40">
                        {note.interval === 0 ? 'Root' : `Interval: ${note.interval}`}
                      </div>
                    )}
                </div>
            );
        })}

        {renderConnections()}

        </div>
      </div>
    </div>
  );
};

export default Fretboard;
