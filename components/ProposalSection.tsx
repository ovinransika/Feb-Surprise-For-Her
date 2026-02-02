import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MessageCircle } from 'lucide-react';
import { AppConfig, DateIdea } from '../types';

interface Props {
  config: AppConfig;
  onConfetti: () => void;
}

const ProposalSection: React.FC<Props> = ({ config, onConfetti }) => {
  const [noBtnPosition, setNoBtnPosition] = useState({ x: 0, y: 0 });
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [isAccepted, setIsAccepted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<DateIdea | null>(null);
  
  const moveNoButton = () => {
    const x = (Math.random() - 0.5) * 200; // Move up to 100px left/right
    const y = (Math.random() - 0.5) * 200;
    setNoBtnPosition({ x, y });
    setNoHoverCount((prev) => prev + 1);
  };

  const handleYes = () => {
    setIsAccepted(true);
    onConfetti();
  };

  const sendToWhatsApp = () => {
    const dateChoice = selectedDate ? selectedDate.title : "anything you like";
    const text = `Hey Sansikehhh! I said YES! 💖\n\nI'm so excited! For our date, I pick: ${dateChoice} ${selectedDate?.icon || ''}`;
    const number = config.whatsappNumber || "94772245080";
    const url = `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="py-32 px-4 text-center z-10 relative">
      <AnimatePresence>
        {!isAccepted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <h2 className="text-4xl md:text-6xl font-serif text-rose-600 drop-shadow-sm leading-tight">
              Will You Be My <br /><span className="text-rose-500 font-hand">Valentine?</span>
            </h2>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 min-h-[120px]">
              <button
                onClick={handleYes}
                className="bg-rose-500 hover:bg-rose-600 text-white text-xl md:text-2xl font-bold py-4 px-12 rounded-full shadow-xl shadow-rose-300 transform hover:scale-110 transition-all duration-200 animate-pulse-slow"
              >
                Yes! 💖
              </button>

              <div className="relative">
                {noHoverCount >= 10 ? (
                  <p className="text-rose-400 italic text-sm animate-bounce">
                    Okay okay 😭 I'll ask nicely... please?
                  </p>
                ) : (
                  <motion.button
                    animate={{ x: noBtnPosition.x, y: noBtnPosition.y }}
                    onMouseEnter={moveNoButton}
                    onTouchStart={moveNoButton} // For mobile
                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium py-3 px-8 rounded-full transition-colors text-lg"
                  >
                    No 🙈
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border-2 border-rose-200"
          >
            <h3 className="text-4xl font-hand text-rose-600 mb-4">YAY! 💞</h3>
            <p className="text-xl text-gray-700 mb-8 font-serif leading-relaxed">
              {config.proposalMessage}
            </p>

            {/* Date Planner */}
            <div className="bg-rose-50 p-6 rounded-xl mb-8 text-left">
              <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Calendar size={16} /> Plan our date
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {config.dateIdeas.map((idea) => (
                  <button
                    key={idea.id}
                    onClick={() => setSelectedDate(idea)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      selectedDate?.id === idea.id
                        ? 'border-rose-500 bg-white shadow-md scale-105'
                        : 'border-transparent hover:bg-white hover:border-rose-200'
                    } ${idea.id === '5' ? 'md:col-span-2' : ''}`}
                  >
                    <span className="text-2xl block mb-1">{idea.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{idea.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={sendToWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl hover:bg-[#128C7E] transition-colors font-bold text-lg shadow-lg"
            >
              <MessageCircle size={24} /> Send News to Sansikehhh
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ProposalSection;