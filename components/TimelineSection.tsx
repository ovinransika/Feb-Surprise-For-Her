import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Star, Music, Camera, Plane } from 'lucide-react';
import { TimelineEvent } from '../types';

const icons = {
  heart: Heart,
  star: Star,
  music: Music,
  camera: Camera,
  plane: Plane,
};

interface Props {
  events: TimelineEvent[];
}

const TimelineSection: React.FC<Props> = ({ events }) => {
  return (
    <section className="py-20 px-4 max-w-4xl mx-auto relative z-10">
      <h2 className="text-3xl md:text-4xl font-serif text-rose-800 text-center mb-16">Our Journey</h2>
      
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-rose-200 transform md:-translate-x-1/2"></div>

        <div className="space-y-12">
          {events.map((event, index) => {
            const Icon = icons[event.icon] || Heart;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row items-start md:items-center relative ${
                  isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Content */}
                <div className={`ml-12 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12 text-right'}`}>
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-rose-100 hover:shadow-xl transition-shadow border border-white">
                    <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-bold mb-2">
                      {event.date}
                    </span>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{event.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>
                  </div>
                </div>

                {/* Icon Marker */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-10 h-10 bg-rose-500 rounded-full border-4 border-rose-100 z-10 shadow-md">
                  <Icon size={16} className="text-white" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;