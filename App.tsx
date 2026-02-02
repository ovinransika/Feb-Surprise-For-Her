import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

import FloatingHearts from './components/FloatingHearts';
import TimelineSection from './components/TimelineSection';
import FlipCardSection from './components/FlipCardSection';
import LoveLetterSection from './components/LoveLetterSection';
import MiniGameSection from './components/MiniGameSection';
import ProposalSection from './components/ProposalSection';
import EditPanel from './components/EditPanel';

import { AppConfig, DEFAULT_CONFIG } from './types';

// Simple lightweight confetti implementation without external heavy libs
const fireConfetti = () => {
  const colors = ['#f43f5e', '#ec4899', '#fb7185', '#ffd700', '#ffffff'];
  for (let i = 0; i < 100; i++) {
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.top = '-10px';
    el.style.width = Math.random() * 10 + 5 + 'px';
    el.style.height = Math.random() * 10 + 5 + 'px';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.zIndex = '9999';
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    el.style.pointerEvents = 'none';
    
    // Animation
    const duration = Math.random() * 3 + 2;
    el.style.transition = `transform ${duration}s ease-in, opacity ${duration}s ease-in`;
    document.body.appendChild(el);

    // Trigger fall
    requestAnimationFrame(() => {
      el.style.transform = `translate(${Math.random() * 100 - 50}px, 110vh) rotate(${Math.random() * 360}deg)`;
      el.style.opacity = '0';
    });

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(el);
    }, duration * 1000);
  }
};

const App: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load config from localStorage
    const saved = localStorage.getItem('valentine-config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Merge with default to ensure new fields (like whatsappNumber) exist and updated date ideas are present
        // We explicitly overwrite dateIdeas with default because they were changed in requirements 
        // and aren't user-editable in the UI yet.
        setConfig({
            ...DEFAULT_CONFIG,
            ...parsed,
            dateIdeas: DEFAULT_CONFIG.dateIdeas 
        });
      } catch (e) {
        console.error('Failed to load config');
      }
    }
  }, []);

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    localStorage.setItem('valentine-config', JSON.stringify(newConfig));
  };

  const handleOpen = () => {
    setIsOpened(true);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 font-sans text-gray-900 overflow-x-hidden selection:bg-rose-200">
      <FloatingHearts />
      <EditPanel config={config} onSave={handleSaveConfig} />

      {/* Hero / Landing */}
      <div className="h-screen flex items-center justify-center relative z-10 px-4">
        <AnimatePresence>
          {!isOpened ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -50 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-serif text-rose-600 mb-6 drop-shadow-sm">
                Hey {config.recipientName}...
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-10 font-light">
                I made something special for you 💌
              </p>
              <button
                onClick={handleOpen}
                className="bg-rose-500 hover:bg-rose-600 text-white text-lg font-semibold py-3 px-10 rounded-full shadow-lg shadow-rose-300 transition-all hover:scale-105"
              >
                Open It
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-10 left-0 right-0 text-center animate-bounce"
            >
              <ChevronDown className="mx-auto text-rose-400" size={32} />
              <span className="text-sm text-rose-400">Scroll Down</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Content Flow */}
      {isOpened && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative z-10 space-y-12 pb-24"
        >
          <TimelineSection events={config.timeline} />
          <FlipCardSection reasons={config.reasons} />
          <LoveLetterSection letterParagraphs={config.loveLetter} senderName={config.senderName} />
          <MiniGameSection />
          <ProposalSection config={config} onConfetti={fireConfetti} />
        </motion.div>
      )}

      {/* Footer */}
      <footer className="text-center py-8 text-rose-300 text-sm relative z-10">
        <p>Made with ♥ for {config.recipientName}</p>
      </footer>
    </div>
  );
};

export default App;