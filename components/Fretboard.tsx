import React, { useMemo, useRef } from 'react';
import { FretboardNote, Position, Settings, Mode, ScaleType, ChordType } from '../types';
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
  onExportRef?: (ref: React.RefObject<HTMLDivElement>) => void;
}

const Fretboard: React.FC<FretboardProps> = ({ root, type, mode, position, settings, onExportRef }) => {
  const fretboardRef = useRef<HTMLDivElement>(null);
  
  // Expose ref to parent if requested
  React.useEffect(() => {
    if (onExportRef) onExportRef(fretboardRef);
  }, [onExportRef]);

  const notes = useMemo(() => 
    generateFretboard(root, type, position, mode), 
    [root, type, position, mode]
  );

  // Constants for rendering
  const FRETS = 22;
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
      return 60 * Math.pow(0.985, i);
  };

  const fretWidths = Array.from({ length: FRETS + 1 }, (_, i) => getFretWidth(i)); 

  const getFretPosition = (fretIndex: number) => {
      let pos = 0;
      for (let i = 0; i < fretIndex; i++) {
          pos += fretWidths[i];
      }
      return pos;
  };
  
  const totalWidth = getFretPosition(FRETS + 1);

  const renderConnections = () => {
    if (position === 'Full Neck' || !settings.showConnections) return null;
    
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
        className="relative bg-white transition-colors duration-300 select-none overflow-hidden"
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

        {/* Notes */}
        {notes.map((note, idx) => {
            const fretCenter = note.fret === 0 
                ? 8 
                : getFretPosition(note.fret) - (fretWidths[note.fret-1] / 2);
            
            const stringTop = getStringTop(note.stringIndex); 
            
            const colorKey = position === 'Full Neck' ? note.positionIndex : position;
            const baseColor = POSITION_COLORS[colorKey as 1|2|3|4|5] || POSITION_COLORS[1];

            if (note.opacity < 0.5) return null; 

            return (
                <div
                    key={`note-${idx}`}
                    className={clsx(
                        "absolute w-7 h-7 -ml-3.5 -mt-3.5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg transition-all duration-300 cursor-default group z-20",
                        note.isRoot && "ring-2 ring-white w-8 h-8 -ml-4 -mt-4 z-30",
                        note.isRoot && position !== 'Full Neck' && "animate-pulse-slow"
                    )}
                    style={{
                        left: `${fretCenter}px`,
                        top: `${stringTop}px`,
                        backgroundColor: baseColor,
                        opacity: note.opacity
                    }}
                >
                    {settings.showNoteNames && <span>{note.note}</span>}
                    {note.isRoot && <div className="absolute inset-0 rounded-full border-2 border-white opacity-50 animate-ping" />}
                    
                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-40">
                         {note.interval === 0 ? 'Root' : `Interval: ${note.interval}`}
                    </div>
                </div>
            );
        })}

        {renderConnections()}

      </div>
    </div>
  );
};

export default Fretboard;
