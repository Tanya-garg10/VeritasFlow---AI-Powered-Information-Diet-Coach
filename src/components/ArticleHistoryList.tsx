import React, { useState } from 'react';
import { Newspaper, ChevronDown, ChevronUp, Trash2, Clock, Globe, Shield } from 'lucide-react';
import { ContentItem } from '../types';

interface ArticleHistoryListProps {
  items: ContentItem[];
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export default function ArticleHistoryList({ items, onDeleteItem, onClearAll }: ArticleHistoryListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['All', 'Politics', 'Technology', 'Science', 'Health & Wellness', 'Climate & Environment', 'Finance & Economy', 'Social Issues'];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getSentimentStyle = (label: string) => {
    switch (label) {
      case 'Positive': return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
      case 'Negative': return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
      default: return 'bg-slate-800/80 text-slate-300 border-slate-700/60';
    }
  };

  const getBiasBadgeStyle = (level: string) => {
    if (level.includes('Extreme') || level.includes('Polarized')) {
      return 'bg-purple-950/45 text-purple-300 border-purple-500/30';
    }
    if (level.includes('Leaning') || level.includes('Loaded')) {
      return 'bg-amber-950/45 text-amber-300 border-amber-500/30';
    }
    return 'bg-indigo-950/45 text-indigo-300 border-indigo-500/30';
  };

  return (
    <div className="space-y-4" id="article-history-module">
      {/* Category Toggle Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
        <div className="flex overflow-x-auto pb-1.5 sm:pb-0 gap-1.5 scrollbar-thin max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        {items.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-rose-400 hover:text-rose-305 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-500/20 transition-all cursor-pointer flex items-center justify-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Flush Clean</span>
          </button>
        )}
      </div>

      {filteredItems.length === 0 ? (
        <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-12 text-center" id="empty-history">
          <Newspaper className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="font-bold text-white text-sm">No items logged in this category</h3>
          <p className="text-slate-400 text-xs mt-1">Select another directory or use the intake engine to analyze a post.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4" id="bento-history-grid">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white/5 border rounded-3xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'border-indigo-500/40 bg-white/10 shadow-[0_4px_30px_rgba(99,102,241,0.08)]' : 'border-white/10 hover:border-white/20 hover:bg-white/8 shadow-2xs'
                }`}
                id={`article-${item.id}`}
              >
                {/* Header layout */}
                <div 
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-indigo-300 border border-white/5">
                        {item.category}
                      </span>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-800 text-slate-200">
                        {item.platform}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getSentimentStyle(item.sentiment.label)}`}>
                        {item.sentiment.label} ({item.sentiment.score > 0 ? `+${item.sentiment.score.toFixed(1)}` : item.sentiment.score.toFixed(1)})
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {item.title}
                    </h4>

                    <div className="flex items-center space-x-4 text-xs text-slate-400">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-500 flex-shrink-0" />
                        {item.timeSpent} mins focused
                      </span>
                      <span className="flex items-center">
                        <Globe className="w-3.5 h-3.5 mr-1 text-slate-500 flex-shrink-0" />
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {item.filterBubbleMetric.bubbleIndex > 50 && (
                        <span className="text-rose-450 font-bold bg-rose-500/10 px-1.5 py-0.5 border border-rose-500/15 rounded-md text-[10px]">
                          ⚠️ Bubble warning: {item.filterBubbleMetric.bubbleIndex}%
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto justify-end border-t border-white/5 md:border-0 pt-3 md:pt-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}
                      className="p-1.5 bg-white/5 hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 rounded-lg cursor-pointer transition-all border border-white/5"
                      title="Delete log"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="text-slate-400 p-1 bg-white/5 border border-white/5 rounded-lg">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-300" /> : <ChevronDown className="w-4 h-4 text-slate-300" />}
                    </div>
                  </div>
                </div>

                {/* Expanded parameters */}
                {isExpanded && (
                  <div className="bg-[#020204]/40 border-t border-white/10 p-5 space-y-4">
                    {/* Raw Text Snippet */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Intake text matched:</span>
                      <blockquote className="text-xs text-slate-300 bg-black/40 border border-white/5 rounded-xl p-3 max-h-24 overflow-y-auto leading-relaxed italic">
                        "{item.content}"
                      </blockquote>
                    </div>

                    {/* Gemini Frame and Bias Evaluation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Audit Framing</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBiasBadgeStyle(item.biasAnalysis.biasLevel)}`}>
                            {item.biasAnalysis.biasLevel} ({item.biasAnalysis.biasScore}/100)
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-300 font-semibold">
                          Frame strategy: <span className="text-indigo-400 underline decoration-indigo-200/20 mr-2">{item.biasAnalysis.primaryFrame}</span>
                        </p>
                        <p className="text-xs text-slate-405 leading-normal bg-black/20 p-2.5 rounded-lg border border-white/5">
                          {item.biasAnalysis.explanation}
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider block">Echo Chambers & Isolation</span>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-lg font-bold text-white">{item.filterBubbleMetric.bubbleIndex}%</span>
                          <span className="text-[10px] text-slate-400">bubble probability index</span>
                        </div>
                        <p className="text-xs text-slate-405 leading-normal bg-black/20 p-2.5 rounded-lg border border-white/5">
                          {item.filterBubbleMetric.bubbleRiskExplanation}
                        </p>
                      </div>
                    </div>

                    {/* Suggested Diverse Perspectives */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block flex items-center">
                        <Shield className="w-3.5 h-3.5 mr-1" />
                        Perspectives Diversified (Corrective Reading recommendation to clear bias)
                      </span>

                      {item.alternativePerspectives && item.alternativePerspectives.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {item.alternativePerspectives.map((alt, index) => (
                            <div key={index} className="bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/15 rounded-xl p-3.5 flex flex-col justify-between space-y-2.5 transition-colors">
                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/15 border border-indigo-500/20 px-2 py-0.5 rounded-sm tracking-wider">
                                    {alt.source}
                                  </span>
                                  <span className="text-[9px] font-semibold text-slate-450 italic">
                                    {alt.stance}
                                  </span>
                                </div>
                                <h5 className="text-xs font-bold text-white leading-tight mb-1">
                                  {alt.title}
                                </h5>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                  {alt.summary}
                                </p>
                              </div>
                              <a
                                href={alt.credibleUrlFallback}
                                target="_blank"
                                rel="referrer"
                                referrerPolicy="no-referrer"
                                className="inline-flex items-center bg-white/5 hover:bg-white/10 text-indigo-300 border border-white/10 text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all w-max self-end cursor-pointer"
                              >
                                View Alternative Data
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-450 italic">This content is judged sufficiently balanced. No priority corrective recommendations required.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
