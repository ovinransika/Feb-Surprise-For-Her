import React, { useState, useEffect, useRef } from 'react';
import { PenTool, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  letterParagraphs: string[];
  senderName: string;
}

const LoveLetterSection: React.FC<Props> = ({ letterParagraphs, senderName }) => {
  const [displayText, setDisplayText] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [copied, setCopied] = useState(false);
  const fullText = letterParagraphs.join('\n\n') + `\n\n— ${senderName}`;
  const indexRef = useRef(0);

  const startWriting = () => {
    if (isWriting) return;
    setDisplayText('');
    indexRef.current = 0;
    setIsWriting(true);
  };

  useEffect(() => {
    if (isWriting && indexRef.current < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + fullText.charAt(indexRef.current));
        indexRef.current++;
      }, 30); // Typing speed
      return () => clearTimeout(timeout);
    } else if (indexRef.current >= fullText.length) {
      setIsWriting(false);
    }
  }, [isWriting, displayText, fullText]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-20 px-4 max-w-2xl mx-auto z-10 relative">
      <div className="bg-[#fff9f0] p-8 md:p-12 rounded-sm shadow-2xl relative rotate-1 transform transition-transform hover:rotate-0">
        {/* Paper texture overlay could go here */}
        <div className="absolute top-0 left-0 w-full h-2 bg-rose-200/50"></div>
        
        <h2 className="text-3xl font-serif text-gray-800 mb-6 flex items-center gap-3">
          <span className="text-4xl">📜</span> A Note For You
        </h2>

        <div className="min-h-[300px] font-serif text-lg md:text-xl text-gray-700 leading-relaxed whitespace-pre-wrap">
          {displayText || <span className="text-gray-300 italic">Tap the button below to generate your letter...</span>}
          {isWriting && <span className="animate-pulse">|</span>}
        </div>

        <div className="mt-8 flex gap-4 border-t border-gray-200 pt-6">
          <button
            onClick={startWriting}
            disabled={isWriting}
            className="flex items-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-full hover:bg-rose-700 transition-colors disabled:opacity-50 font-medium"
          >
            <PenTool size={18} />
            {displayText ? 'Rewrite' : 'Write Letter'}
          </button>
          
          {displayText && !isWriting && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 text-rose-600 hover:bg-rose-50 px-4 py-2 rounded-full transition-colors"
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default LoveLetterSection;