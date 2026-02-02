import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw } from 'lucide-react';
import { Reason } from '../types';

interface Props {
  reasons: Reason[];
}

const FlipCardSection: React.FC<Props> = ({ reasons }) => {
  const [shuffledReasons, setShuffledReasons] = useState(reasons);

  const shuffle = () => {
    const shuffled = [...reasons].sort(() => 0.5 - Math.random());
    setShuffledReasons(shuffled);
  };

  return (
    <section className="py-20 px-4 max-w-5xl mx-auto z-10 relative">
      <div className="flex flex-col items-center mb-12">
        <h2 className="text-3xl md:text-4xl font-serif text-rose-800 text-center mb-4">Reasons I Love You</h2>
        <button 
          onClick={shuffle}
          className="flex items-center gap-2 text-rose-500 hover:text-rose-700 transition-colors text-sm font-semibold"
        >
          <RefreshCcw size={14} /> Shuffle Reasons
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {shuffledReasons.map((reason) => (
            <FlipCard key={reason.id} reason={reason} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};

const FlipCard: React.FC<{ reason: Reason }> = ({ reason }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="h-40 md:h-48 cursor-pointer perspective-1000 group"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full duration-500 preserve-3d transition-transform ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl shadow-lg flex items-center justify-center">
          <span className="text-5xl">💌</span>
          <p className="absolute bottom-4 text-white font-medium text-sm opacity-90">Tap to read</p>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 backface-hidden bg-white rounded-2xl shadow-xl flex items-center justify-center p-6 text-center border-2 border-rose-100"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <p className="text-rose-800 font-hand text-xl md:text-2xl leading-tight">
            "{reason.text}"
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FlipCardSection;