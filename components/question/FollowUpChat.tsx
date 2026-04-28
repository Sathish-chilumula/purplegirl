'use client';

import React, { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FollowUpChatProps {
  questionTitle: string;
  categoryName: string;
}

export default function FollowUpChat({ questionTitle, categoryName }: FollowUpChatProps) {
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: categoryName,
          questionTopic: questionTitle,
          query: userMessage,
          history: messages 
        }),
      });

      if (!response.ok) throw new Error('API Error');
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.answer }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'ai', content: "The ink has run dry. Please try your whisper again later. 💜" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--abyss)] border border-[rgba(140,26,26,0.1)] rounded-2xl p-6 md:p-8 shadow-sm mb-16 overflow-hidden">
      <div className="flex items-center gap-3 mb-6 border-b border-[rgba(201,168,76,0.05)] pb-4">
        <div className="bg-[var(--crimson)] p-2 rounded-full opacity-80">
          <Sparkles className="w-5 h-5 text-[var(--void)]" />
        </div>
        <div>
          <h2 className="font-cinzel font-bold text-sm tracking-widest text-[var(--ink)] uppercase">Whisper Again</h2>
          <p className="text-[10px] font-im-fell italic text-[var(--ink-dim)]">Deepen your understanding of the cipher</p>
        </div>
      </div>

      <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center p-6 text-[var(--ink-dim)] italic font-im-fell text-lg">
            "Every question is a key to a door you haven't opened yet."
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={i} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-xl font-im-fell text-lg leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[var(--crimson)] text-[var(--void)] rounded-tr-sm border border-[rgba(140,26,26,0.4)] shadow-lg shadow-[rgba(0,0,0,0.1)]' 
                    : 'bg-[var(--chamber)] text-[var(--ink)] rounded-tl-sm border border-[rgba(140,26,26,0.08)]'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-[var(--chamber)] text-[var(--ink)] p-4 rounded-xl rounded-tl-sm border border-[rgba(140,26,26,0.08)] flex items-center gap-3">
               <div className="dots"><span></span><span></span><span></span></div>
               <span className="text-sm font-cinzel font-bold italic text-[var(--ink-dim)] uppercase tracking-widest">Consulting</span>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={sendMessage} className="relative flex items-center">
        <div className="absolute left-4 font-im-fell text-[var(--crimson)] opacity-60 text-xl">¶</div>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your follow-up whisper..."
          className="w-full bg-[var(--void)] border border-[rgba(140,26,26,0.15)] rounded-sm py-4 pl-10 pr-14 text-lg font-im-fell text-[var(--ink)] focus:outline-none focus:border-[var(--crimson)] placeholder:text-[var(--ink-dim)] placeholder:italic"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || loading}
          className="absolute right-3 p-3 bg-[var(--crimson)] hover:bg-[var(--crimson-mid)] text-[var(--void)] rounded-sm transition-all disabled:opacity-50 shadow-md"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
