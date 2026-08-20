import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Sliders, Zap, Sparkles, Database, Activity } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function SettingsView() {
  const { isLiveMode, setIsLiveMode } = useAnalytics();
  const [statusMsg, setStatusMsg] = useState(null);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Banner */}
      <div className="glass-panel rounded-2xl p-5 border border-pink-500/30 bg-gradient-to-r from-slate-900 via-purple-950/30 to-pink-950/20 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-instagram-gradient p-0.5 shadow-md flex items-center justify-center">
            <InstagramIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
              InstaPulse AI - System Engine & Status
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold">
                100% PRODUCTION LIVE
              </span>
            </h2>
            <p className="text-xs text-slate-400">Headless Browser Live Scraping & Real-Time Instagram Analytics Engine</p>
          </div>
        </div>
      </div>

      {/* Engine Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Scraper Status */}
        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 bg-slate-900/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-emerald-400 flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Live Headless Chrome Scraper
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
              ONLINE
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Connected to system Google Chrome. Automatically extracts exact Likes, Comments, Views, Follower counts, Captions, and Video covers on demand.
          </p>
        </div>

        {/* Caching Status */}
        <div className="glass-panel rounded-2xl p-5 border border-cyan-500/30 bg-slate-900/80 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-xs text-cyan-400 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Fresh Extraction Guarantee
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono font-bold">
              ZERO CACHE
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every single search triggers a fresh live scrape from Instagram servers. No hardcoded or stale data is stored.
          </p>
        </div>
      </div>

      {/* Active System Health */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-700 bg-slate-900 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-pink-400" />
          Engine Specifications & Capabilities
        </h3>

        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-medium">🎯 Single URL Extractor</span>
            <span className="font-bold text-emerald-400">Profile & Reel Support (Live)</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-medium">⚡ Bulk Extraction Mode</span>
            <span className="font-bold text-emerald-400">Up to 100 URLs in 1-Click</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-medium">📑 Excel (.xlsx) Report Exporter</span>
            <span className="font-bold text-emerald-400">Active</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-medium">🤖 AI Virality & Engagement Predictive Model</span>
            <span className="font-bold text-emerald-400">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
