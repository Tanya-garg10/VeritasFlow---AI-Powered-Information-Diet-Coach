import React, { useState } from 'react';
import { Search, Scale, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';

interface SideData {
  perspective: string;
  coreArguments: string[];
  rebuttal: string;
}

interface LookupResult {
  topic: string;
  sides: SideData[];
  coachingAdvice: string;
  simulation?: boolean;
}

export default function AlternativeExplorer() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/alternative-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      if (!response.ok) {
        throw new Error('Exploration failed. Please check backend connection.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search alternative perspectives.');
    } finally {
      setLoading(false);
    }
  };

  const sampleTopics = [
    'Remote Work Productivity Rates',
    'Carbon Tax Economic Redistribution',
    'AI Integration in Pediatric healthcare'
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl transition-all" id="perspective-explorer-module">
      <div className="flex items-center space-x-1.5 mb-2">
        <Scale className="w-5 h-5 text-indigo-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Perspective Equilibrium</h3>
      </div>
      <p className="text-xs text-slate-400 mb-4 leading-normal">
        Type any polarized or debated topic below. Server-side Gemini will neutralize framing and render competing claims objectively.
      </p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center bg-[#020204]/60 border border-white/10 rounded-xl px-2.5 focus-within:border-indigo-400/85">
          <Search className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="e.g. Universal Basic Income, Nuclear Energy Pros..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full bg-transparent border-0 py-2.5 text-xs text-white focus:outline-none placeholder-slate-550"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="bg-indigo-650 hover:bg-indigo-700 bg-gradient-to-r from-indigo-500 to-indigo-600 font-bold border-0 cursor-pointer text-white text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50"
        >
          {loading ? 'Synthesizing...' : 'Balance It'}
        </button>
      </form>

      {/* Suggested prompts */}
      {!result && !loading && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended topics:</span>
          <div className="flex flex-wrap gap-2">
            {sampleTopics.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTopic(item);
                }}
                className="text-[10px] bg-white/5 hover:bg-white/10 text-indigo-300 font-semibold py-1 px-2.5 rounded-lg border border-white/10 transition-all cursor-pointer"
              >
                🔍 {item}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 text-rose-300 text-xs p-3 rounded-lg border border-rose-500/20 mt-2">
          {error}
        </div>
      )}

      {loading && (
        <div className="py-12 text-center" id="explorer-loading">
          <div className="animate-spin rounded-full border-2 border-indigo-400 border-t-transparent w-6 h-6 mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-300">Rehearsing dual narratives objectively...</p>
          <p className="text-[10px] text-slate-400 mt-1">Stripping inflammatory vocabulary modifiers.</p>
        </div>
      )}

      {result && (
        <div className="mt-4 space-y-4 pt-4 border-t border-white/10" id="explorer-result">
          <div className="flex items-center space-x-1.5 bg-indigo-550/10 border border-indigo-500/20 rounded-xl p-3">
            <Sparkles className="w-4 h-4 text-indigo-300" />
            <p className="text-xs text-indigo-200 font-semibold leading-snug">
              Topic Analyzed: <span className="underline decoration-indigo-500/40">{result.topic}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.sides.map((side, sIdx) => (
              <div key={sIdx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-indigo-300 border-b border-white/5 pb-1.5 mb-2.5 uppercase tracking-wide flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2" />
                    {side.perspective}
                  </h4>
                  <ul className="space-y-1.5 mb-3">
                    {side.coreArguments.map((arg, aIdx) => (
                      <li key={aIdx} className="text-xs text-slate-300 pl-3 relative leading-relaxed">
                        <span className="absolute left-0 top-1 text-slate-500 text-[10px]">•</span>
                        {arg}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-lg p-2.5 mt-2">
                  <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider block mb-0.5">Key Limitation / Critique:</span>
                  <p className="text-xs text-slate-400 italic leading-snug">
                    "{side.rebuttal}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-950/40 text-indigo-100 rounded-xl p-4 border border-indigo-900/60 space-y-1.5">
            <div className="flex items-center space-x-1">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold tracking-wide uppercase text-emerald-400">Diet Coach Pacing Advice</span>
            </div>
            <p className="text-xs text-indigo-200 leading-relaxed">
              {result.coachingAdvice}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
