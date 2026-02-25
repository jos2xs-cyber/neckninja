import React, { useState } from 'react';
import { Position, ScaleType, ChordType, NoteName, Settings, TabConfig, Mode } from '../types';
import { getTabContent, generateFretboard } from '../utils/musicLogic';
import { Download, Copy, Check } from 'lucide-react';
import * as htmlToImage from 'html-to-image';

interface TabGeneratorProps {
  root: NoteName;
  type: ScaleType | ChordType;
  mode: Mode;
  position: Position;
  fretboardRef: React.RefObject<HTMLDivElement>;
}

const TabGenerator: React.FC<TabGeneratorProps> = ({ root, type, mode, position, fretboardRef }) => {
  const [config, setConfig] = useState<TabConfig>({ direction: 'Ascending' });
  const [generatedTab, setGeneratedTab] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const tabRef = React.useRef<HTMLPreElement>(null);

  const handleGenerate = () => {
    const notes = generateFretboard(root, type, position, mode);
    const content = getTabContent(root, type, position, config.direction, notes);
    setGeneratedTab(content);
  };

  const copyToClipboard = () => {
    if (generatedTab) {
      navigator.clipboard.writeText(generatedTab);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadTabImage = async () => {
    if (tabRef.current) {
      const dataUrl = await htmlToImage.toPng(tabRef.current, { backgroundColor: '#1e293b' }); // Dark background for image
      const link = document.createElement('a');
      link.download = `ScaleShed_Tab_${root}_${type.replace(/\s/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  const downloadFretboardImage = async () => {
    if (fretboardRef.current) {
       const dataUrl = await htmlToImage.toPng(fretboardRef.current, { 
           backgroundColor: '#292524',
           width: fretboardRef.current.scrollWidth,
           height: fretboardRef.current.scrollHeight
       });
       const link = document.createElement('a');
       link.download = `ScaleShed_Fretboard_${root}_${type.replace(/\s/g, '_')}.png`;
       link.href = dataUrl;
       link.click();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <span>📝</span> Tab Generator
        </h3>
      </div>
      
      <div className="p-4 space-y-4 flex-1 flex flex-col">
        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          {(['Ascending', 'Descending', 'Up & Down'] as const).map(dir => (
            <button
              key={dir}
              onClick={() => setConfig({ direction: dir })}
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                config.direction === dir
                  ? 'bg-violet-600 text-white font-medium'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {dir}
            </button>
          ))}
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-bold rounded-lg shadow-md transition-all active:scale-[0.98]"
        >
          Generate Tab
        </button>

        {/* Output */}
        {generatedTab && (
          <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative group flex-1">
                <pre 
                    ref={tabRef}
                    className="w-full h-full min-h-[200px] p-4 bg-slate-900 text-green-400 font-mono text-sm md:text-base rounded-lg overflow-x-auto custom-scrollbar border border-slate-700 shadow-inner"
                >
                    {`Scale Shed Tab\n${root} ${type}\nMode: ${mode}\nPosition: ${position}\nPattern: ${config.direction}\n\n${generatedTab}`}
                </pre>
                <button 
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-2 bg-slate-800/80 text-slate-300 rounded hover:bg-slate-700 transition-colors backdrop-blur-sm"
                    title="Copy to Clipboard"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            </div>

            <div className="flex gap-2 mt-4">
                <button 
                    onClick={downloadTabImage}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                >
                    <Download size={16} /> Tab Img
                </button>
                <button 
                    onClick={downloadFretboardImage}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors"
                >
                    <Download size={16} /> Neck Img
                </button>
            </div>
          </div>
        )}
         {!generatedTab && (
             <div className="flex-1 flex items-center justify-center text-slate-400 text-sm italic border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                 Select settings and generate tab...
             </div>
         )}
      </div>
    </div>
  );
};

export default TabGenerator;