import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const GAME_DURATION = 30;

const MiniGameSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [hearts, setHearts] = useState<{ id: number; x: number; speed: number }[]>([]);
  const requestRef = useRef<number>();
  const lastSpawnTime = useRef<number>(0);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setHearts([]);
    lastSpawnTime.current = Date.now();
  };

  const catchHeart = (id: number) => {
    setHearts((prev) => prev.filter((h) => h.id !== id));
    setScore((s) => s + 1);
    // Visual feedback could be added here
  };

  const updateGame = useCallback(() => {
    if (!isPlaying) return;

    const now = Date.now();
    
    // Spawn hearts
    if (now - lastSpawnTime.current > 800) { // Spawn rate
      setHearts((prev) => [
        ...prev,
        { id: now, x: Math.random() * 80 + 10, speed: Math.random() * 0.5 + 0.5 },
      ]);
      lastSpawnTime.current = now;
    }

    // Move hearts is handled by CSS animation for smoother performance, 
    // but we remove them from state to keep DOM clean handled by onAnimationComplete in framer motion
    
    requestRef.current = requestAnimationFrame(updateGame);
  }, [isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(updateGame);
      const timer = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsPlaying(false);
            clearInterval(timer);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        clearInterval(timer);
      };
    }
  }, [isPlaying, updateGame]);

  return (
    <section className="py-20 px-4 z-10 relative bg-gradient-to-b from-transparent to-white/50">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-3xl font-serif text-rose-800 mb-6">Catch My Love!</h2>
        
        {!isPlaying && timeLeft === GAME_DURATION && (
          <div className="bg-white/90 p-8 rounded-2xl shadow-xl border border-rose-100">
            <p className="text-gray-600 mb-6">Catch as many falling hearts as you can in 30 seconds!</p>
            <button
              onClick={startGame}
              className="bg-rose-500 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-rose-600 hover:scale-105 transition-all shadow-lg shadow-rose-200"
            >
              Start Game
            </button>
          </div>
        )}

        {!isPlaying && timeLeft === 0 && (
          <div className="bg-white/90 p-8 rounded-2xl shadow-xl border border-rose-100 animate-in fade-in zoom-in">
            <h3 className="text-2xl font-bold text-rose-600 mb-2">Time's Up!</h3>
            <p className="text-4xl font-bold text-gray-800 mb-4">{score}</p>
            <p className="text-gray-600 italic">"That's how much I adore you! (Times infinity) 💗"</p>
            <button
              onClick={startGame}
              className="mt-6 text-rose-500 underline hover:text-rose-700"
            >
              Play Again
            </button>
          </div>
        )}

        {isPlaying && (
          <div className="relative h-[400px] bg-rose-50 rounded-2xl border-2 border-rose-200 overflow-hidden cursor-crosshair shadow-inner">
            <div className="absolute top-4 left-4 font-bold text-rose-600 text-xl">Score: {score}</div>
            <div className="absolute top-4 right-4 font-bold text-gray-500 text-xl">Time: {timeLeft}s</div>
            
            <AnimatePresence>
              {hearts.map((heart) => (
                <motion.button
                  key={heart.id}
                  initial={{ top: -50, opacity: 1 }}
                  animate={{ top: '120%' }}
                  exit={{ scale: 1.5, opacity: 0 }}
                  transition={{ duration: 4 / heart.speed, ease: 'linear' }}
                  className="absolute p-2 hover:scale-110 active:scale-95 transition-transform outline-none touch-manipulation"
                  style={{ left: `${heart.x}%` }}
                  onMouseDown={() => catchHeart(heart.id)}
                  onTouchStart={(e) => { e.preventDefault(); catchHeart(heart.id); }} // Prevent scroll on touch
                  onAnimationComplete={() => {
                     // Cleanup if missed
                     setHearts(prev => prev.filter(h => h.id !== heart.id));
                  }}
                >
                  <Heart className="fill-rose-500 text-rose-600 drop-shadow-md" size={32} />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default MiniGameSection;