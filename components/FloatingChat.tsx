'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Speak, sister. The cipher is open.' }
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'The connection has faded. Try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full bg-pg-violet-700 text-pg-gold-300 shadow-lg hover:bg-pg-violet-600 hover:scale-110 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open Oracle Chat"
      >
        <MessageSquare size={24} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] max-w-[calc(100vw-3rem)] bg-pg-parch-50 border-2 border-pg-violet-800/30 shadow-[0_20px_40px_rgba(90,48,160,0.25)] rounded-t-xl rounded-bl-xl overflow-hidden flex flex-col transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
        style={{ height: '500px', maxHeight: 'calc(100vh - 6rem)' }}
      >
        {/* Header */}
        <div className="bg-pg-violet-900 text-pg-gold-300 p-4 flex justify-between items-center border-b border-pg-violet-700">
          <div>
            <h3 className="font-cinzel font-bold tracking-widest text-sm">The Oracle</h3>
            <p className="text-[10px] uppercase tracking-widest opacity-70">Awaiting your whisper</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-pg-gold-300 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('/images/bg-parchment.png')] bg-cover bg-center" style={{ backgroundColor: 'rgba(253, 250, 243, 0.9)', backgroundBlendMode: 'overlay' }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[80%] p-3 rounded-md shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-pg-ink-800 text-pg-parch-100 rounded-tr-none' 
                    : 'bg-pg-parch-100 border border-pg-parch-300 text-pg-ink-900 rounded-tl-none font-im-fell text-[17px] leading-relaxed'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-pg-parch-100 border border-pg-parch-300 text-pg-violet-700 p-3 rounded-md rounded-tl-none font-im-fell text-[17px] italic animate-pulse">
                Consulting the codex...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-pg-parch-100 border-t border-pg-parch-300 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the Sisterhood..."
            className="flex-1 bg-white border border-pg-parch-300 rounded px-3 py-2 text-pg-ink-900 placeholder:text-pg-ink-400 focus:outline-none focus:border-pg-violet-500 font-im-fell"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-pg-violet-800 text-pg-gold-300 p-2 rounded hover:bg-pg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center w-10"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </>
  );
}
