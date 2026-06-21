import React, { useState } from 'react';
import { PlusCircle, Link, FileText, Clock, Play } from 'lucide-react';
import { ContentItem } from '../types';

interface AddContentFormProps {
  onAddSuccess: (newItems: ContentItem[]) => void;
}

export default function AddContentForm({ onAddSuccess }: AddContentFormProps) {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState<'X / Twitter' | 'Reddit' | 'YouTube' | 'News Outlets' | 'Medium / Blogs' | 'Other'>('News Outlets');
  const [timeSpent, setTimeSpent] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Simulated live analysis labels shown over time during fetch
  const loadingStatusPhases = [
    'Initializing NLP ingestion pipeline...',
    'Scanning vocabulary for emotional activation and bias frame structures...',
    'Assigning political and informational polar scores via Gemini...',
    'Querying global facts for alternative credible counter-perspectives...',
    'Syncing digital footprint telemetry...'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please paste the content text or post copy-dump.');
      return;
    }

    setLoading(true);
    setError(null);
    let phaseIndex = 0;
    setStatusMessage(loadingStatusPhases[0]);

    // Staggered status message updates
    const interval = setInterval(() => {
      phaseIndex = (phaseIndex + 1) % loadingStatusPhases.length;
      setStatusMessage(loadingStatusPhases[phaseIndex]);
    }, 1500);

    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          content,
          platform,
          timeSpent
        })
      });

      if (!response.ok) {
        const errObj = await response.json();
        throw new Error(errObj.error || 'Server processing error');
      }

      const data = await response.json();
      onAddSuccess(data.items);
      
      // Reset form variables
      setUrl('');
      setContent('');
      setTimeSpent(10);
      setPlatform('News Outlets');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze text.');
    } finally {
      clearInterval(interval);
      setLoading(false);
      setStatusMessage('');
    }
  };

  const handlePrepopulate = (type: 'bias' | 'doom') => {
    if (type === 'bias') {
      setUrl('https://socialnetwork.com/unverified-claim/8724');
      setContent('We are being completely lied to! The mainstream media wants you to believe that renewable hydrogen cells are cleaner, but the hidden truth is they are installing electromagnetic grids to alter local micro-climates. It is a absolute climate weapon and nobody is talking about this!');
      setPlatform('X / Twitter');
      setTimeSpent(8);
    } else {
      setUrl('https://techforum.org/threads/unemployment-anxiety');
      setContent('There is fully zero market left for junior engineers. General intelligence LLMs write perfect assembly. The job boards are completely loaded with ghost listings. High tuition debt is a total loss now, might as well stop coding altogether.');
      setPlatform('Reddit');
      setTimeSpent(20);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl transition-all hover:bg-white/8 shadow-md" id="add-content-form-card">
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
            <PlusCircle className="w-4 h-4 mr-1.5 text-indigo-400" />
            Analyze New Intake
          </h2>
          <p className="text-xs text-slate-400">Insert an article snippet or social media post for real-time profiling.</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-500/10 text-rose-300 text-xs p-3 rounded-xl border border-rose-500/25 mb-4" id="form-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center space-y-4" id="form-loading">
          <div className="relative w-12 h-12 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
          </div>
          <div className="max-w-[85%] mx-auto">
            <p className="text-xs font-semibold text-indigo-300 animate-pulse">{statusMessage}</p>
            <p className="text-[10px] text-slate-400 mt-1">Our server-side Gemini is analyzing semantic stance parameters.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" id="intake-form">
          {/* Content Source Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Source Channel</label>
              <div className="relative">
                <select
                  value={platform}
                  onChange={(e: any) => setPlatform(e.target.value)}
                  className="w-full bg-[#020204]/60 border border-white/10 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-400/85"
                >
                  <option value="News Outlets">🗞️ News Outlets</option>
                  <option value="X / Twitter">📱 X / Twitter</option>
                  <option value="Reddit">👾 Reddit</option>
                  <option value="YouTube">📺 YouTube</option>
                  <option value="Medium / Blogs">✍️ Medium / Blogs</option>
                  <option value="Other">🌐 Other Medium</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Dwell Dosing ({timeSpent}m)</label>
              <div className="flex items-center space-x-2 bg-[#020204]/60 border border-white/10 rounded-xl px-2.5 py-1.5 h-[36px]">
                <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  type="range"
                  min="1"
                  max="60"
                  step="1"
                  value={timeSpent}
                  onChange={(e) => setTimeSpent(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-400 h-1 rounded-full cursor-pointer bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Source URL (optional) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Source URL (Optional)</label>
            <div className="flex items-center bg-[#020204]/60 border border-white/10 rounded-xl px-2.5 focus-within:border-indigo-400/85">
              <Link className="w-3.5 h-3.5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="url"
                placeholder="https://example.com/opinion-article"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-transparent border-0 py-2 text-xs text-white focus:outline-none placeholder-slate-550"
              />
            </div>
          </div>

          {/* Raw Content copy/pasted input */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">Article / Post Text Copy-Dump</label>
            <div className="flex items-start bg-[#020204]/60 border border-white/10 rounded-xl p-2.5 focus-within:border-indigo-400/85">
              <FileText className="w-4 h-4 text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
              <textarea
                placeholder="Paste the raw article, twitter thread, or post text you read. Gemini will analyze bias metrics, sentiment profiles, and generate alternative suggestions..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full bg-transparent border-0 p-0 text-xs text-white focus:outline-none min-h-[90px] placeholder-slate-550 leading-relaxed resize-none"
                required
              />
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex space-x-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-500 to-emerald-400 hover:from-indigo-600 hover:to-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run AI Audit</span>
            </button>
          </div>

          {/* Sandbox Helpers - Prepopulate buttons */}
          <div className="pt-3 border-t border-white/10">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Interactive Templates:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handlePrepopulate('bias')}
                className="text-[10px] bg-white/5 hover:bg-white/10 text-indigo-300 font-semibold py-1 px-2.5 rounded-lg border border-white/10 transition-all cursor-pointer"
              >
                ⚡ Partisan Tweet
              </button>
              <button
                type="button"
                onClick={() => handlePrepopulate('doom')}
                className="text-[10px] bg-white/5 hover:bg-white/10 text-rose-300 font-semibold py-1 px-2.5 rounded-lg border border-white/10 transition-all cursor-pointer"
              >
                🔥 Doomscrolling Panic
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
