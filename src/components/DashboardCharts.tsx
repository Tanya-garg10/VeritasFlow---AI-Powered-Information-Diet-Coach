import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { AlertCircle } from 'lucide-react';
import { ContentItem } from '../types';

interface DashboardChartsProps {
  items: ContentItem[];
}

const CATEGORY_COLORS: { [key: string]: string } = {
  'Politics': '#818cf8', // Indigo
  'Technology': '#a78bfa', // Violet
  'Science': '#34d399', // Emerald
  'Health & Wellness': '#f472b6', // Pink
  'Climate & Environment': '#22d3ee', // Cyan
  'Finance & Economy': '#fbbf24', // Amber
  'Social Issues': '#fb7185', // Rose
  'Other': '#94a3b8' // Slate-400
};

const PLATFORM_COLORS: { [key: string]: string } = {
  'X / Twitter': '#6366f1', // Indigo glow
  'Reddit': '#f97316', // Orange-red
  'YouTube': '#ef4444', // Red
  'News Outlets': '#06b6d4', // Cyan
  'Medium / Blogs': '#34d399', // green
  'Other': '#94a3b8' // Slate-400
};

export default function DashboardCharts({ items }: DashboardChartsProps) {
  
  // Aggregate categories
  const categoryMap: { [key: string]: number } = {};
  // Aggregate platforms
  const platformMap: { [key: string]: number } = {};
  // Aggregate sentiment
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;

  items.forEach(item => {
    // Category mapping
    const cat = item.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + item.timeSpent;

    // Platform mapping
    const plat = item.platform || 'Other';
    platformMap[plat] = (platformMap[plat] || 0) + item.timeSpent;

    // Sentiment aggregates
    if (item.sentiment.label === 'Positive') positiveCount += item.timeSpent;
    else if (item.sentiment.label === 'Negative') negativeCount += item.timeSpent;
    else neutralCount += item.timeSpent;
  });

  const categoryData = Object.keys(categoryMap).map(name => ({
    name,
    value: categoryMap[name],
    color: CATEGORY_COLORS[name] || '#94a3b8'
  })).sort((a, b) => b.value - a.value);

  const platformData = Object.keys(platformMap).map(name => ({
    name,
    minutes: platformMap[name],
    color: PLATFORM_COLORS[name] || '#94a3b8'
  }));

  const sentimentTotal = positiveCount + neutralCount + negativeCount;
  const posPercent = sentimentTotal ? Math.round((positiveCount / sentimentTotal) * 100) : 0;
  const neuPercent = sentimentTotal ? Math.round((neutralCount / sentimentTotal) * 100) : 0;
  const negPercent = sentimentTotal ? Math.round((negativeCount / sentimentTotal) * 100) : 0;

  if (items.length === 0) {
    return (
      <div className="bg-white/5 border border-dashed border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl" id="empty-state-charts">
        <AlertCircle className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
        <p className="text-sm font-semibold text-white">No telemetry data logged today</p>
        <p className="text-xs text-slate-400 mt-1">Please insert an article snippet in the side intake form to populate your interactive charts.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts-container">
      {/* Chart 1: Category Distribution */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all hover:bg-white/8 hover:border-white/20 shadow-xs" id="chart-category-disp">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Diet Category Matrix</h3>
          <p className="text-xs text-slate-400">Distribution of absolute minutes spent by category.</p>
        </div>
        
        <div className="h-48 md:h-52 my-3">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
                labelStyle={{ display: 'none' }}
                formatter={(value) => [`${value} min`, 'Duration']} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs text-slate-300">
          {categoryData.slice(0, 4).map((entry, idx) => (
            <div key={idx} className="flex items-center space-x-1.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="truncate">{entry.name}: <span className="font-semibold text-white">{entry.value}m</span></span>
            </div>
          ))}
          {categoryData.length > 4 && (
            <div className="text-[10px] text-indigo-300 flex items-center col-span-2 mt-1">
              + {categoryData.length - 4} other categories tracked in session
            </div>
          )}
        </div>
      </div>

      {/* Chart 2: Channel Screen Time */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all hover:bg-white/8 hover:border-white/20 shadow-xs" id="chart-channel-disp">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Channel Exposure</h3>
          <p className="text-xs text-slate-400">Total duration focused per network medium.</p>
        </div>

        <div className="h-52 my-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={platformData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} stroke="#334155" />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} stroke="#334155" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
                formatter={(value) => [`${value} min`, 'Dwell Time']} 
              />
              <Bar dataKey="minutes">
                {platformData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 uppercase tracking-wider">
          <span>Target: Minimize social dwell</span>
          <span className="font-bold text-indigo-400">Limit: 45m/day</span>
        </div>
      </div>

      {/* Chart 3: Emotional Sentiment Fuel */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between transition-all hover:bg-white/8 hover:border-white/20 shadow-xs" id="chart-sentiment-disp">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Emotional Balance</h3>
          <p className="text-xs text-slate-400">Mental ratio triggered by tone weights.</p>
        </div>

        <div className="my-auto py-4 space-y-4">
          {/* Negative Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-rose-400 rounded-full mr-1.5 shadow-[0_0_8px_rgba(251,113,133,0.5)]" />Negative (Anxiety/Outrage)</span>
              <span className="text-rose-450 font-bold">{negPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-rose-400 h-full transition-all duration-500 shadow-[0_0_8px_rgba(251,113,133,0.5)]" style={{ width: `${negPercent}%` }} />
            </div>
          </div>

          {/* Neutral Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-slate-500 rounded-full mr-1.5 shadow-[0_0_8px_rgba(148,163,184,0.5)]" />Neutral (Objective Facts)</span>
              <span className="text-slate-300 font-bold">{neuPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-slate-500 h-full transition-all duration-500 shadow-[0_0_8px_rgba(148,163,184,0.5)]" style={{ width: `${neuPercent}%` }} />
            </div>
          </div>

          {/* Positive Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center"><span className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-1.5 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />Positive (Constructive)</span>
              <span className="text-emerald-450 font-bold">{posPercent}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full transition-all duration-500 shadow-[0_0_8px_rgba(52,211,153,0.5)]" style={{ width: `${posPercent}%` }} />
            </div>
          </div>
        </div>

        <div className="text-xs text-indigo-300 text-center leading-normal pt-3 border-t border-white/5 mt-2 bg-indigo-950/20 rounded-xl p-2.5 border border-indigo-900/40">
          {negPercent > 45 
            ? '⚠️ High Outrage Alert: High density of alarmist frames. Take a deep cognitive breath!' 
            : '🌳 Balanced Tone. Safe dose maintained. Keep prioritizing objective fact reporting.'}
        </div>
      </div>
    </div>
  );
}
