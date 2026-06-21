import React from 'react';
import { Shield, Shuffle, AlertTriangle, Clock } from 'lucide-react';
import { DietSummary } from '../types';

interface MetricCardsProps {
  summary: DietSummary;
}

export default function MetricCards({ summary }: MetricCardsProps) {
  const getBubbleColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Moderate': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 55) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" id="veritasflow-metrics-grid">
      {/* 1. Information quality score */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl transition-all hover:bg-white/8 hover:border-white/20 shadow-xs" id="metric-quality-score">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Info Quality</span>
          <div className="p-2 bg-white/5 text-indigo-400 rounded-xl border border-white/5">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className={`text-4xl font-light tracking-tight ${getScoreColor(summary.overallScore)}`}>
            {summary.overallScore}%
          </span>
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">vs baseline</span>
        </div>
        <div className="mt-4 flex items-center space-x-1">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-500" 
              style={{ width: `${summary.overallScore}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 leading-normal">
          Measures factual complexity versus clickbait or outrage patterns.
        </p>
      </div>

      {/* 2. Perspective Diversity */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl transition-all hover:bg-white/8 hover:border-white/20 shadow-xs" id="metric-diversity">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Diversity Index</span>
          <div className="p-2 bg-white/5 text-emerald-400 rounded-xl border border-white/5">
            <Shuffle className="w-5 h-5 text-emerald-450" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-light tracking-tight text-white">
            {summary.diversityScore}%
          </span>
          <span className="text-[10px] text-emerald-400 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">+5% today</span>
        </div>
        <div className="mt-4 flex items-center space-x-1">
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-505 to-emerald-400 h-full transition-all duration-500" 
              style={{ width: `${summary.diversityScore}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3 leading-normal">
          Variety of digital categories and distribution of content frames.
        </p>
      </div>

      {/* 3. Filter Bubble Risk */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl transition-all hover:bg-white/8 hover:border-white/20 shadow-xs" id="metric-bubble">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Bubble Isolation</span>
          <div className="p-2 bg-white/5 rounded-xl border border-white/5">
            <AlertTriangle className="w-5 h-5 text-amber-450" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-light tracking-tight text-white">
            {summary.bubbleRisk}
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-md border font-bold uppercase tracking-wider ${getBubbleColor(summary.bubbleRisk)}`}>
            {summary.bubbleRisk === 'High' ? 'ALERT' : summary.bubbleRisk === 'Moderate' ? 'CAUTION' : 'SECURE'}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-5 leading-relaxed">
          {summary.bubbleRisk === 'High' 
            ? 'Severe narrative echo chamber detected. Extreme repetitive biases active.'
            : summary.bubbleRisk === 'Moderate'
            ? 'Moderate feed echoes. We suggest checking alternative science feeds.'
            : 'Excellent cognitive variation. Digital mind is clear of echo chambers.'}
        </p>
      </div>

      {/* 4. Active Screen Mindset (Time) */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl transition-all hover:bg-white/8 hover:border-white/20 shadow-xs" id="metric-duration">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">Dwell Dosing</span>
          <div className="p-2 bg-white/5 text-rose-400 rounded-xl border border-white/5">
            <Clock className="w-5 h-5 text-rose-400" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-4xl font-light tracking-tight text-white">
            {summary.totalTime} <span className="text-sm font-normal text-slate-400">m</span>
          </span>
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">dwell today</span>
        </div>
        <div className="mt-4">
          <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Status Report:</span>
          <p className="text-xs text-slate-400 leading-normal">
            {summary.totalTime > 60 
              ? '⚠️ High cognitive strain limit exceeded.' 
              : summary.totalTime > 30 
              ? '⚖️ Moderate mental fuel. Focus stabilized.' 
              : '🌳 Safe dosing. Mindfulness pacing maintained.'}
          </p>
        </div>
      </div>
    </div>
  );
}
