import React, { useState, useRef, useEffect } from 'react';
import { HeartHandshake, Send, Sparkles, User, BrainCircuit } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function WellnessCoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: "Hello! I am your **VeritasFlow Information Diet Coach**. I scan your tracked media logs, identify systemic confirmation bias loops, and suggest healthy cognitive habits.\n\n*How can I help you build a more balanced digital mind today?*"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "Audit my current logged feed for doomscrolling traits.",
    "Give me 3 rules to break political filter bubbles.",
    "How does cognitive fatigue impact my daily decisions?"
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const updatedMessages = [...messages, { role: 'user' as const, text: textToSend }];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/coaching-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuestion: textToSend })
      });

      if (!response.ok) {
        throw new Error("Could not reach coaching node");
      }

      const data = await response.json();
      setMessages([...updatedMessages, { role: 'assistant', text: data.advice }]);
    } catch (err: any) {
      setMessages([...updatedMessages, {
        role: 'assistant',
        text: "⚠️ *Error reaching coaching engine.* Please check if your sever-side services are active, or query again shortly."
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Simple renderer to support bold text and bullet lists in coach responses
  const renderMessageContent = (text: string) => {
    return text.split('\n').map((line, idx) => {
      let trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-2" />;

      // Handle custom titles or markdown lists
      let isBullet = trimmed.startsWith('*') || trimmed.startsWith('-') || /^\d+\./.test(trimmed);
      let content = trimmed;
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        content = trimmed.substring(1).trim();
      }

      // Handle bold **text**
      const parts = content.split('**');
      const formattedParts = parts.map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} className="font-semibold text-indigo-300 bg-indigo-500/15 px-1 rounded-sm">{part}</strong>;
        }
        return part;
      });

      if (isBullet) {
        return (
          <div key={idx} className="flex items-start space-x-2 pl-3 py-1 text-slate-300">
            <span className="text-indigo-400 font-bold mt-0.5">•</span>
            <p className="text-xs leading-relaxed flex-1">{formattedParts}</p>
          </div>
        );
      }

      // Handle Headings
      if (trimmed.startsWith('###')) {
        return <h4 key={idx} className="text-xs font-bold text-white uppercase tracking-wide mt-3 mb-1.5">{formattedParts}</h4>;
      }

      return (
        <p key={idx} className="text-xs text-slate-305 leading-relaxed mb-1.5">{formattedParts}</p>
      );
    });
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col h-[530px]" id="wellness-coach-module">
      {/* Header layout */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10 flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#020204]/60 text-indigo-400 border border-white/10 flex items-center justify-center">
            <BrainCircuit className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Coach Pacing Engine</h3>
            <span className="text-[9px] uppercase font-bold text-emerald-400 flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse" />
              Online Coaching Node
            </span>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 scrollbar-thin" id="coach-messages">
        {messages.map((msg, index) => {
          const isAssistant = msg.role === 'assistant';
          return (
            <div
              key={index}
              className={`flex items-start space-x-2.5 max-w-[85%] ${
                isAssistant ? 'self-start' : 'self-end flex-row-reverse space-x-reverse ml-auto'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] ${
                isAssistant ? 'bg-[#020204]/60 border border-white/10 text-indigo-400' : 'bg-slate-800 text-slate-200'
              }`}>
                {isAssistant ? <BrainCircuit className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>
              <div className={`rounded-2xl p-3.5 ${
                isAssistant 
                  ? 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-sm shadow-2xs' 
                  : 'bg-indigo-650 text-white border border-indigo-500/20 rounded-tr-sm shadow-sm bg-gradient-to-r from-indigo-500 to-indigo-600'
              }`}>
                {isAssistant ? (
                  <div className="space-y-1">{renderMessageContent(msg.text)}</div>
                ) : (
                  <p className="text-xs leading-relaxed">{msg.text}</p>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex items-start space-x-2.5 max-w-[85%]">
            <div className="w-6 h-6 rounded-full bg-[#020204]/60 border border-white/10 text-indigo-400 flex items-center justify-center flex-shrink-0 animate-pulse">
              <BrainCircuit className="w-3.5 h-3.5" />
            </div>
            <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl rounded-tl-sm">
              <div className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts helper buttons */}
      {messages.length === 1 && (
        <div className="p-2 border-t border-white/10 flex-shrink-0">
          <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1.5">Click to consult coach:</span>
          <div className="flex flex-col gap-1.5">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(p)}
                className="text-[10px] text-indigo-300 bg-white/5 hover:bg-white/10 rounded-lg p-2 border border-white/10 text-left transition-all cursor-pointer truncate font-semibold"
              >
                🔮 {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage(input);
        }}
        className="pt-3 border-t border-white/10 flex items-center gap-1.5 flex-shrink-0"
      >
        <input
          type="text"
          placeholder="Ask about confirmation bias, screen timers, bubble metrics..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 bg-[#020204]/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400/85 disabled:opacity-50 placeholder-slate-550"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-indigo-650 hover:bg-indigo-700 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-2 h-[34px] w-[34px] flex items-center justify-center rounded-xl transition-all font-semibold cursor-pointer disabled:opacity-50 border-0 shadow-lg"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
