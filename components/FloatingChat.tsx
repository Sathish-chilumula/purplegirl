'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Heart, X, Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey girl! I'm your digital big sister. No topic is too taboo here. What's on your mind? 💖" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }]
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch');
      
      const data = await res.json();
      setMessages(prev => [...prev, data.message]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "The connection dropped, girl. Try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Heart FAB */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-50 w-16 h-16 flex items-center justify-center rounded-full shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 heart-glow ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        style={{ background: 'var(--grad-heart)', backgroundSize: '400% 400%' }}
      >
        <Heart size={30} className="text-white fill-white" />
      </button>

      {/* Modern Chat Window */}
      <div 
        className={`fixed bottom-8 right-8 z-50 w-[380px] max-w-[calc(100vw-4rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-[0_20px_50px_rgba(76,29,149,0.3)] border border-slate-100 flex flex-col transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-purple-600 to-pink-500 rounded-t-3xl text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="font-syne font-bold text-lg leading-tight">PurpleGirl Chat</h3>
              <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">Safe • Anonymous • Real</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white rounded-tr-none' 
                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none leading-relaxed font-medium'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-slate-100 text-purple-600 p-4 rounded-2xl rounded-tl-none text-sm italic font-bold flex gap-2 items-center">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                Typing secrets...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-50 flex gap-2 items-center rounded-b-3xl">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me anything, girl..."
            className="flex-1 bg-slate-100 border-none rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 text-white p-3 rounded-2xl hover:bg-purple-700 disabled:opacity-50 disabled:scale-90 transition-all flex items-center justify-center shadow-lg shadow-purple-200"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
