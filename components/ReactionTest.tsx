import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GameState, Score } from '../types';
import { Zap, MousePointer2, AlertCircle, Timer } from 'lucide-react';
import Stats from './Stats';

const ReactionTest: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [history, setHistory] = useState<Score[]>([]);
  
  // Use a ref for the timeout ID so we can clear it if the user clicks early
  const timeoutRef = useRef<number | null>(null);

  const startWaiting = useCallback(() => {
    setGameState(GameState.WAITING);
    // Random delay between 2000ms and 5000ms
    const randomDelay = Math.floor(Math.random() * 3000) + 2000;
    
    timeoutRef.current = window.setTimeout(() => {
      setStartTime(Date.now());
      setGameState(GameState.NOW);
    }, randomDelay);
  }, []);

  const handleClick = () => {
    if (gameState === GameState.IDLE) {
      startWaiting();
      return;
    }

    if (gameState === GameState.WAITING) {
      // User clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setGameState(GameState.TOO_EARLY);
      return;
    }

    if (gameState === GameState.NOW) {
      const now = Date.now();
      setEndTime(now);
      setGameState(GameState.RESULT);
      
      const newScore: Score = {
        id: crypto.randomUUID(),
        ms: now - startTime,
        timestamp: now
      };
      
      setHistory(prev => [newScore, ...prev].slice(0, 50)); // Keep last 50
      return;
    }

    if (gameState === GameState.RESULT || gameState === GameState.TOO_EARLY) {
      startWaiting();
      return;
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Determine styles based on state
  const getStyles = () => {
    switch (gameState) {
      case GameState.WAITING:
        return {
          bg: 'bg-rose-600',
          icon: <Timer className="w-24 h-24 mb-6 text-rose-200 animate-pulse" />,
          title: 'Wait for Green...',
          subtitle: 'Do not click yet!',
          textColor: 'text-white'
        };
      case GameState.NOW:
        return {
          bg: 'bg-emerald-500',
          icon: <Zap className="w-32 h-32 mb-6 text-emerald-100 animate-bounce" />,
          title: 'CLICK!',
          subtitle: 'Click now!',
          textColor: 'text-white'
        };
      case GameState.RESULT:
        return {
          bg: 'bg-slate-800',
          icon: <Timer className="w-24 h-24 mb-6 text-blue-400" />,
          title: `${endTime - startTime} ms`,
          subtitle: 'Click to try again',
          textColor: 'text-white'
        };
      case GameState.TOO_EARLY:
        return {
          bg: 'bg-orange-500',
          icon: <AlertCircle className="w-24 h-24 mb-6 text-orange-200" />,
          title: 'Too Early!',
          subtitle: 'Wait for the screen to turn green.',
          textColor: 'text-white'
        };
      case GameState.IDLE:
      default:
        return {
          bg: 'bg-slate-900',
          icon: <Zap className="w-24 h-24 mb-6 text-yellow-400" />,
          title: 'Reaction Test',
          subtitle: 'Click anywhere to begin',
          textColor: 'text-white'
        };
    }
  };

  const style = getStyles();

  return (
    <div 
      className={`w-full h-full min-h-screen transition-colors duration-200 ease-out cursor-pointer select-none flex flex-col items-center justify-center relative overflow-hidden ${style.bg}`}
      onMouseDown={handleClick}
      onTouchStart={(e) => {
         // Prevent default to stop potential double-firing or scrolling issues
         // e.preventDefault(); // Commented out as it might block other interactions, testing shows onMouseDown is usually sufficient or onClick. 
         // For a simple tap game, sticking to onMouseDown provides faster response than onClick.
         handleClick();
      }}
    >
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-pulse" style={{ animationDelay: '1s'}}></div>
        </div>

        {/* Main Content */}
        <div className={`relative z-10 flex flex-col items-center text-center p-8 max-w-lg ${style.textColor}`}>
            <div className="transition-transform duration-300 transform scale-100 hover:scale-105">
              {style.icon}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tight drop-shadow-sm">
              {style.title}
            </h1>
            
            <h2 className="text-xl md:text-2xl font-medium opacity-80">
              {style.subtitle}
            </h2>
            
            {gameState === GameState.IDLE && (
                <div className="mt-12 flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm animate-bounce">
                    <MousePointer2 size={20} />
                    <span className="font-semibold">Tap screen to start</span>
                </div>
            )}
        </div>

        {/* Stats Overlay */}
        <Stats history={history} onReset={() => setHistory([])} />
        
    </div>
  );
};

export default ReactionTest;