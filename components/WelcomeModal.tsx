import React from 'react';
import { Music, Layers, Triangle, X } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
}

const sections = [
  {
    icon: <Music size={20} className="text-violet-500" />,
    title: 'Scales',
    description:
      'Explore scales from pentatonics to Dorian, Blues, Mixolydian, and more — visualized across the whole neck or filtered down to a single position for focused study. Switch to All Notes view to see every note on every string up to fret 24, great for fretboard memorization.',
  },
  {
    icon: <Layers size={20} className="text-violet-500" />,
    title: 'Chords',
    description:
      'Select chords to build a progression, then use the fretboard visual to learn each chord all over the neck via CAGED shapes. Pro tip: loop your progression with the metronome and practice playing the same chord in a different shape each time, or solo over it and target the actual notes of whichever chord you\'re on.',
  },
  {
    icon: <Triangle size={20} className="text-violet-500" />,
    title: 'Triads',
    description:
      'See the 3-note building blocks of every chord across different string groups. Essential for melodic rhythm playing and chord inversions.',
  },
];

export default function WelcomeModal({ onClose }: WelcomeModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Welcome to NeckNinja</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Master the neck — one position at a time.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            NeckNinja is a free guitar fretboard tool with three sections. Here's what each one does:
          </p>

          <div className="space-y-3">
            {sections.map(({ icon, title, description }) => (
              <div
                key={title}
                className="flex gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700"
              >
                <div className="mt-0.5 shrink-0">{icon}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800 p-3.5">
            <p className="text-xs font-semibold text-violet-700 dark:text-violet-300">💡 Pro Tip — Start here</p>
            <p className="text-xs text-violet-600 dark:text-violet-400 mt-1 leading-relaxed">
              Go to <strong>Scales → Scale Pattern</strong>, pick a root note and <strong>Minor Pentatonic</strong>, then select Position 1. That single pattern is the foundation of most rock and blues soloing.
            </p>
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
            Hover over any button to see what it does. Click <strong>?</strong> in the header to reopen this guide.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-bold transition-colors"
          >
            Got it, let's play!
          </button>
        </div>
      </div>
    </div>
  );
}
