import React, { useState } from 'react';
import { Settings, X, Save, Plus, Trash2, Copy, FileText } from 'lucide-react';
import { AppConfig, DEFAULT_CONFIG, TimelineEvent } from '../types';

interface Props {
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

const EditPanel: React.FC<Props> = ({ config, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localConfig, setLocalConfig] = useState<AppConfig>(config);
  const [activeTab, setActiveTab] = useState<'general' | 'timeline' | 'reasons' | 'letter' | 'proposal'>('general');

  const handleSave = () => {
    onSave(localConfig);
    setIsOpen(false);
  };

  const copyConfigToClipboard = () => {
    const json = JSON.stringify(localConfig, null, 2);
    // Wrap it in the TS export syntax
    const code = `export const DEFAULT_CONFIG: AppConfig = ${json};`;
    navigator.clipboard.writeText(code);
    alert("Configuration code copied! You can paste this into types.ts to make these changes permanent in the source code.");
  };

  // Reasons Handlers
  const handleReasonChange = (id: string, text: string) => {
    setLocalConfig(prev => ({
      ...prev,
      reasons: prev.reasons.map(r => r.id === id ? { ...r, text } : r)
    }));
  };

  const addReason = () => {
    const newId = Date.now().toString();
    setLocalConfig(prev => ({
      ...prev,
      reasons: [...prev.reasons, { id: newId, text: '' }]
    }));
  };

  const removeReason = (id: string) => {
    setLocalConfig(prev => ({
      ...prev,
      reasons: prev.reasons.filter(r => r.id !== id)
    }));
  };

  // Timeline Handlers
  const handleTimelineChange = (id: string, field: keyof TimelineEvent, value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      timeline: prev.timeline.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const addTimelineEvent = () => {
    const newId = Date.now().toString();
    setLocalConfig(prev => ({
      ...prev,
      timeline: [...prev.timeline, { 
        id: newId, 
        date: 'Date', 
        title: 'New Memory', 
        description: 'Description...', 
        icon: 'heart' 
      }]
    }));
  };

  const removeTimelineEvent = (id: string) => {
    setLocalConfig(prev => ({
      ...prev,
      timeline: prev.timeline.filter(t => t.id !== id)
    }));
  };

  // Letter Handler
  const handleLetterChange = (value: string) => {
    setLocalConfig(prev => ({
      ...prev,
      loveLetter: value.split('\n\n')
    }));
  };

  if (!isOpen) {
    // Settings icon hidden as requested
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
      
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b bg-rose-50/50">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <Settings size={18} className="text-rose-500" /> Customize App
          </h2>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b overflow-x-auto no-scrollbar">
          {(['general', 'timeline', 'reasons', 'letter', 'proposal'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab 
                  ? 'border-rose-500 text-rose-600 bg-rose-50/30' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
          
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Your Name</label>
                <input 
                  type="text" 
                  value={localConfig.senderName}
                  onChange={e => setLocalConfig(prev => ({ ...prev, senderName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Recipient Name</label>
                <input 
                  type="text" 
                  value={localConfig.recipientName}
                  onChange={e => setLocalConfig(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                />
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-center">
                 <h3 className="text-sm font-bold text-gray-500 uppercase">Our Journey Events</h3>
                 <button onClick={addTimelineEvent} className="text-xs flex items-center gap-1 bg-rose-100 text-rose-600 px-2 py-1 rounded hover:bg-rose-200 transition-colors">
                    <Plus size={12} /> Add Event
                 </button>
              </div>
              
              <div className="space-y-4">
                {localConfig.timeline.map((event) => (
                  <div key={event.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group">
                    <button 
                      onClick={() => removeTimelineEvent(event.id)}
                      className="absolute top-2 right-2 text-gray-300 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <label className="block text-[10px] text-gray-400 font-bold mb-1">DATE</label>
                        <input
                          type="text"
                          value={event.date}
                          onChange={e => handleTimelineChange(event.id, 'date', e.target.value)}
                          className="w-full border-b border-gray-200 p-1 text-sm focus:border-rose-500 outline-none bg-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-gray-400 font-bold mb-1">ICON</label>
                        <select
                          value={event.icon}
                          onChange={e => handleTimelineChange(event.id, 'icon', e.target.value)}
                          className="w-full border-b border-gray-200 p-1 text-sm focus:border-rose-500 outline-none bg-transparent"
                        >
                          <option value="heart">Heart</option>
                          <option value="star">Star</option>
                          <option value="music">Music</option>
                          <option value="camera">Camera</option>
                          <option value="plane">Plane</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-3">
                        <label className="block text-[10px] text-gray-400 font-bold mb-1">TITLE</label>
                        <input
                          type="text"
                          value={event.title}
                          onChange={e => handleTimelineChange(event.id, 'title', e.target.value)}
                          className="w-full border-b border-gray-200 p-1 text-sm font-medium focus:border-rose-500 outline-none bg-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] text-gray-400 font-bold mb-1">DESCRIPTION</label>
                        <textarea
                          value={event.description}
                          onChange={e => handleTimelineChange(event.id, 'description', e.target.value)}
                          className="w-full border border-gray-200 rounded p-2 text-sm focus:border-rose-500 outline-none resize-none"
                          rows={2}
                        />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reasons Tab */}
          {activeTab === 'reasons' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-center mb-2">
                 <h3 className="text-sm font-bold text-gray-500 uppercase">Reasons I Love You</h3>
                 <button onClick={addReason} className="text-xs flex items-center gap-1 bg-rose-100 text-rose-600 px-2 py-1 rounded hover:bg-rose-200 transition-colors">
                    <Plus size={12} /> Add Reason
                 </button>
              </div>

              {localConfig.reasons.map((reason, index) => (
                <div key={reason.id} className="flex gap-2 items-start group">
                   <div className="flex-1">
                     <textarea
                      value={reason.text}
                      onChange={e => handleReasonChange(reason.id, e.target.value)}
                      className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-200 outline-none shadow-sm transition-all"
                      rows={2}
                      placeholder={`Reason #${index + 1}`}
                     />
                   </div>
                   <button 
                    onClick={() => removeReason(reason.id)}
                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors mt-1"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              ))}
            </div>
          )}

          {/* Letter Tab */}
          {activeTab === 'letter' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Love Letter <span className="text-rose-400 font-normal normal-case">(Paragraphs separated by empty lines)</span>
                </label>
                <textarea
                  value={localConfig.loveLetter.join('\n\n')}
                  onChange={e => handleLetterChange(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none h-64 leading-relaxed"
                  placeholder="Write your heart out..."
                />
              </div>
            </div>
          )}

          {/* Proposal Tab */}
          {activeTab === 'proposal' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Proposal Message</label>
                <textarea
                  value={localConfig.proposalMessage}
                  onChange={e => setLocalConfig(prev => ({ ...prev, proposalMessage: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none h-32"
                  placeholder="The message shown after she says Yes..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">WhatsApp Number</label>
                <input
                  type="text"
                  value={localConfig.whatsappNumber || "94772245080"}
                  onChange={e => setLocalConfig(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
                  placeholder="e.g., 94772245080"
                />
                <p className="text-[10px] text-gray-400 mt-1">Number to send the "Yes" message to (No + symbol).</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-gray-50 flex flex-col gap-2">
          <button 
            onClick={handleSave}
            className="w-full bg-rose-600 text-white py-3 rounded-xl font-bold hover:bg-rose-700 shadow-lg shadow-rose-200 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save & Apply
          </button>
          
          <button 
            onClick={copyConfigToClipboard}
            className="w-full bg-white text-gray-600 border border-gray-200 py-2 rounded-xl text-xs font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <Copy size={14} /> Copy Config Code (For Developers)
          </button>
          
          <div className="mt-1 flex justify-center">
            <button 
                onClick={() => {
                    if(confirm('Are you sure? This will reset all your customizations.')) {
                        setLocalConfig(DEFAULT_CONFIG);
                    }
                }}
                className="text-[10px] text-gray-400 hover:text-gray-600 underline"
            >
                Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPanel;