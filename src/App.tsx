import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Info, 
  CheckCircle,
  Scale,
  BrainCircuit,
  LayoutDashboard
} from 'lucide-react';
import { ContentItem, DietSummary } from './types';
import MetricCards from './components/MetricCards';
import DashboardCharts from './components/DashboardCharts';
import AddContentForm from './components/AddContentForm';
import ArticleHistoryList from './components/ArticleHistoryList';
import AlternativeExplorer from './components/AlternativeExplorer';
import WellnessCoach from './components/WellnessCoach';

export default function App() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [summary, setSummary] = useState<DietSummary>({
    overallScore: 85,
    diversityScore: 75,
    streakDays: 4,
    totalTime: 62,
    bubbleRisk: 'Moderate',
    insights: []
  });
  const [activeTab, setActiveTab] = useState<'history' | 'explore' | 'coach'>('history');
  
  // Slide 5: User Consent toggles for extension monitoring simulation
  const [consentTelemetry, setConsentTelemetry] = useState(true);
  const [consentDataCollection, setConsentDataCollection] = useState(true);
  const [consentPopupLogs, setConsentPopupLogs] = useState(false);
  const [consentSavedText, setConsentSavedText] = useState(false);

  // Load items on mount
  const fetchTelemetry = async () => {
    try {
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
      }
      
      const summaryResponse = await fetch('/api/diet-summary');
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json();
        setSummary(summaryData);
      }
    } catch (err) {
      console.error('Error fetching data from full-stack api:', err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  const handleAddSuccess = (newItems: ContentItem[]) => {
    setItems(newItems);
    // Recompute summaries immediately
    fetchTelemetry();
  };

  const handleDeleteItem = async (id: string) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
        fetchTelemetry();
      }
    } catch (err) {
      console.error('Error deleting content log:', err);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to flush all historical tracked reading records? This will clear visual telemetry.')) {
      return;
    }
    try {
      const response = await fetch('/api/content', {
        method: 'DELETE'
      });
      if (response.ok) {
        setItems([]);
        fetchTelemetry();
      }
    } catch (err) {
      console.error('Error flushing database logs:', err);
    }
  };

  const handleConsentSave = (e: React.FormEvent) => {
    e.preventDefault();
    setConsentSavedText(true);
    setTimeout(() => setConsentSavedText(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white" id="veritasflow-layout">
      
      {/* 1. Brand header bar */}
      <header className="sticky top-0 z-40 bg-[#07070a]/80 backdrop-blur-md border-b border-white/10" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10 border border-indigo-400/20">
              <span className="text-white font-extrabold text-lg tracking-wider">V</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-black tracking-tight text-white">VeritasFlow</h1>
                <span className="bg-indigo-500/10 text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/25">
                  Slide Project Showcase
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">The Information Diet Coach • Conscious Consumption</p>
            </div>
          </div>

          {/* Social Impact / Productivity highlight badge */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Category Focus</span>
              <span className="text-xs font-semibold text-slate-300 leading-normal">Social Impact & Productivity Upgrade</span>
            </div>
            
            <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-semibold text-slate-300">Active telemetry</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. Main content grids */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" id="main-content">
        
        {/* Pitch Tagline Hero Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c0d14] via-[#0d0e1b] to-[#04040a] text-white relative overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(99,102,241,0.06)]" id="pitch-tagline-card">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-12 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-2">
            <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-950/60 px-2.5 py-1 rounded-md border border-indigo-500/30 w-max block">
              Tagline Philosophy
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              "Helping users consume information consciously, not compulsively."
            </h2>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed font-normal">
              Social algorithms capture attention through outrage. VeritasFlow intervenes on political confirmation bias and doomsday threads, providing dynamic side-by-side comparative views and screen pacings to stabilize mental wellness.
            </p>
          </div>
        </div>

        {/* 3. Metric cards row */}
        <MetricCards summary={summary} />

        {/* 4. Recharts Visual Analytics row */}
        <div className="space-y-3" id="visual-dashboard-section">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white uppercase tracking-wider">Dietary Telemetry Stream</h2>
              <p className="text-xs text-slate-400">Live breakdown of tracked bias matrices and mental stress duration factors.</p>
            </div>
            {items.length > 0 && (
              <span className="text-xs font-semibold text-slate-400">
                {items.length} items logged this session
              </span>
            )}
          </div>
          <DashboardCharts items={items} />
        </div>

        {/* 5. Split console work block */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="console-subgrids">
          
          {/* LEFT SECTION (Col 1 & 2): Core tabs panels */}
          <div className="lg:col-span-2 space-y-4" id="interventions-container">
            
            {/* Header section with buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-3">
              <div>
                <h2 className="text-base font-extrabold text-white uppercase tracking-wider">Interventions Console</h2>
                <p className="text-xs text-slate-400 font-medium">Activate cognitive shields, neutralize bias circles, and consult coach logs.</p>
              </div>
              
              {/* Tab Selector buttons */}
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold w-max self-start sm:self-center">
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeTab === 'history' 
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-300" />
                  <span>My Dwell Audits</span>
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeTab === 'explore' 
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Equilibrium Explorer</span>
                </button>
                <button
                  onClick={() => setActiveTab('coach')}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all cursor-pointer ${
                    activeTab === 'coach' 
                      ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-300" />
                  <span>AI Wellness Coach</span>
                </button>
              </div>
            </div>

            {/* Render selected tabs */}
            <div className="transition-all duration-300">
              {activeTab === 'history' && (
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start space-x-3">
                    <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-200 space-y-1">
                      <p className="font-bold">Understanding Bias Demarcation:</p>
                      <p className="leading-relaxed">
                        Entries marked with <span className="font-bold text-amber-100">Extreme</span> or <span className="font-bold text-amber-100">Polarized</span> tags contain alarmist frames. Click on them to reveal underlying semantic strategies and read the corrective diverse sources.
                      </p>
                    </div>
                  </div>
                  <ArticleHistoryList 
                    items={items} 
                    onDeleteItem={handleDeleteItem} 
                    onClearAll={handleClearAll} 
                  />
                </div>
              )}

              {activeTab === 'explore' && <AlternativeExplorer />}

              {activeTab === 'coach' && <WellnessCoach />}
            </div>

          </div>

          {/* RIGHT SECTION: Dwell analyzer & user configs */}
          <div className="space-y-6" id="intake-and-consent-section">
            
            {/* 1. AddContent form */}
            <AddContentForm onAddSuccess={handleAddSuccess} />

            {/* 2. Slide 5 Consent and Policy Management Module */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-md" id="user-consent-card">
              <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10 mb-4">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Consent & Pacing Hub</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Slide 5 Architecture Layer</p>
                </div>
              </div>

              <form onSubmit={handleConsentSave} className="space-y-4">
                <div className="space-y-3">
                  
                  {/* Extension simulation trigger */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5 max-w-[80%]">
                      <span className="text-xs font-semibold text-slate-200 block">Browser Extension Linkage</span>
                      <p className="text-[11px] text-slate-400 leading-normal">Simulate the background grab of dwell metadata and web tokens (Slide 5-6).</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={consentTelemetry} 
                        onChange={() => setConsentTelemetry(!consentTelemetry)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 border border-white/5" />
                    </label>
                  </div>

                  {/* Outrage filter alerts */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5 max-w-[80%]">
                      <span className="text-xs font-semibold text-slate-200 block">Outrage Warning Overlays</span>
                      <p className="text-[11px] text-slate-400 leading-normal">Trigger dynamic visual flags when the system detects extreme bias scores during browsing.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={consentDataCollection} 
                        onChange={() => setConsentDataCollection(!consentDataCollection)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 border border-white/5" />
                    </label>
                  </div>

                  {/* Temporary cookie tracker fallback */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5 max-w-[80%]">
                      <span className="text-xs font-semibold text-slate-200 block">Anonymize Profile</span>
                      <p className="text-[11px] text-slate-400 leading-normal">Removes account and location indicators when querying alternative reading APIs.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={consentPopupLogs} 
                        onChange={() => setConsentPopupLogs(!consentPopupLogs)}
                        className="sr-only peer" 
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500 border border-white/5" />
                    </label>
                  </div>

                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold flex items-center">
                    <Lock className="w-3 h-3 mr-1" /> GDPR Compliant
                  </span>
                  <button
                    type="submit"
                    className="bg-white/5 hover:bg-white/10 text-indigo-300 font-bold text-[10px] py-1.5 px-3 rounded-lg cursor-pointer transition-all border border-white/10 hover:text-white"
                  >
                    Update Shield configs
                  </button>
                </div>

                {consentSavedText && (
                  <p className="text-[10px] text-emerald-300 font-bold flex items-center justify-center space-x-1 animate-pulse pt-2 text-center bg-emerald-500/10 rounded-lg py-1 border border-emerald-500/20">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Telemetry configurations refreshed!</span>
                  </p>
                )}
              </form>
            </div>



          </div>

        </div>

      </main>

      {/* 6. Footer section */}
      <footer className="bg-black/40 border-t border-white/10 py-8 text-center text-xs text-slate-500 mt-12" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-slate-350">VeritasFlow – The Information Diet Coach </p>
          <p className="max-w-md mx-auto leading-relaxed">
            Intervening constructively before clickbait and polarization take over our collective cognitive focus. Powered by Google AI Studio.
          </p>
        </div>
      </footer>

    </div>
  );
}
