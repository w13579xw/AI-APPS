import React, { useMemo } from 'react';
import { Score } from '../types';
import { Trophy, Activity, RotateCcw } from 'lucide-react';

interface StatsProps {
  history: Score[];
  onReset: () => void;
}

const Stats: React.FC<StatsProps> = ({ history, onReset }) => {
  const best = useMemo(() => {
    if (history.length === 0) return null;
    return Math.min(...history.map(h => h.ms));
  }, [history]);

  const average = useMemo(() => {
    if (history.length === 0) return null;
    const sum = history.reduce((acc, curr) => acc + curr.ms, 0);
    return Math.round(sum / history.length);
  }, [history]);

  if (history.length === 0) return null;

  return (
    <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center space-y-4 pointer-events-none animate-fade-in px-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex gap-8 shadow-xl border border-white/20 text-white pointer-events-auto">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-white/70 text-sm font-semibold mb-1">
            <Trophy size={16} />
            <span>BEST</span>
          </div>
          <span className="text-2xl font-bold">{best} ms</span>
        </div>
        
        <div className="w-px bg-white/20 h-full self-stretch" />
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 text-white/70 text-sm font-semibold mb-1">
            <Activity size={16} />
            <span>AVERAGE</span>
          </div>
          <span className="text-2xl font-bold">{average} ms</span>
        </div>
      </div>
      
      <button 
        onClick={(e) => {
            e.stopPropagation();
            onReset();
        }}
        className="pointer-events-auto text-white/50 hover:text-white text-sm flex items-center gap-2 transition-colors py-2 px-4 rounded-full hover:bg-white/10"
      >
        <RotateCcw size={14} />
        Reset Stats
      </button>
    </div>
  );
};

export default Stats;