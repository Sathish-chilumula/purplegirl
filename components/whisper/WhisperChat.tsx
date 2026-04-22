'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ShieldAlert } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isCrisis?: boolean;
}

export default function WhisperChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi. You are in Whisper Mode. This space is completely private—nothing you say here is saved, and there is no database history. What\'s on your mind?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      
      const res = await fetch('/api/whisper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, chatHistory })
      });

      if (!res.ok) throw new Error('API Error');

      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response,
        isCrisis: data.crisis
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I am so sorry, but I am having trouble connecting right now. If you need immediate help, please call 112.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#110A14] text-gray-200">
      
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] md:max-w-[75%] rounded-[2rem] px-6 py-4 ${
              msg.role === 'user' 
                ? 'bg-purple-900/40 text-purple-100 rounded-tr-sm border border-purple-800/50' 
                : msg.isCrisis 
                  ? 'bg-rose-950/60 text-rose-100 rounded-tl-sm border border-rose-900/50 ring-1 ring-rose-500/20' 
                  : 'bg-white/5 text-gray-200 rounded-tl-sm border border-white/10'
            }`}>
              
              {msg.isCrisis && (
                <div className="flex items-center gap-2 mb-3 text-rose-400 font-bold text-sm uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" />
                  Crisis Detected
                </div>
              )}
              
              {msg.content.split('\n').map((line, j) => (
                <p key={j} className={j > 0 ? "mt-3" : ""}>
                  {line.includes('**') ? (
                    // Very naive bolding for the crisis message numbers
                    <span dangerouslySetInnerHTML={{__html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')}} />
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white/5 rounded-[2rem] rounded-tl-sm px-6 py-4 border border-white/10 flex gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500/50 animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 rounded-full bg-purple-500/50 animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 rounded-full bg-purple-500/50 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 md:p-6 bg-[#1A0F1D] border-t border-white/5">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type securely... (History is cleared on refresh)"
            className="w-full bg-white/5 border border-white/10 rounded-full pl-6 pr-14 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-purple-600/80 hover:bg-purple-500 text-white flex items-center justify-center disabled:opacity-50 disabled:hover:bg-purple-600/80 transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-[-2px]" />}
          </button>
        </form>
        <p className="text-center text-xs text-gray-600 mt-4">
          Data is never saved. Do not refresh unless you want to erase this conversation.
        </p>
      </div>
    </div>
  );
}
