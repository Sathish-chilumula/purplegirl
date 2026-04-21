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
      setMessages(prev => [...prev, { role: 'ai', content: "Oops! I'm having trouble connecting right now. 💜 Give me a moment and try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-purple-100 rounded-3xl p-6 md:p-8 shadow-sm mb-16 overflow-hidden">
      <div className="flex items-center gap-3 mb-6 border-b border-purple-50 pb-4">
        <div className="bg-purple-100 p-2 rounded-full">
          <Sparkles className="w-5 h-5 text-purple-primary" />
        </div>
        <div>
          <h2 className="font-bold text-xl text-text-primary">Follow-up with AI Sister</h2>
          <p className="text-xs text-text-secondary">Ask for clarification or deeper advice</p>
        </div>
      </div>

      <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="text-center p-6 text-gray-400 text-sm">
            Still confused? Ask me anything related to this topic anonymously!
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
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-purple-primary text-white rounded-tr-sm' 
                    : 'bg-[#FAF5FF] text-text-primary rounded-tl-sm border border-purple-50'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-[#FAF5FF] text-text-primary p-4 rounded-2xl rounded-tl-sm border border-purple-50 flex items-center gap-2">
               <Loader2 className="w-4 h-4 text-purple-primary animate-spin" />
               <span className="text-sm font-medium italic text-gray-500">Thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={sendMessage} className="relative flex items-center">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="E.g. What if I can't afford that?"
          className="w-full bg-[#FAF5FF] border border-purple-100 rounded-full py-3 pl-5 pr-14 text-sm focus:outline-none focus:ring-2 focus:ring-purple-primary/50 placeholder:text-gray-400"
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || loading}
          className="absolute right-2 p-2 bg-purple-primary hover:bg-purple-700 text-white rounded-full transition-colors disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
