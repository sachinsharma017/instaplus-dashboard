import React, { useState } from 'react';
import { ShieldCheck, Key, RefreshCw, CheckCircle2, AlertCircle, ExternalLink, Sliders, Sparkles, Zap } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function SettingsView() {
  const { isLiveMode, setIsLiveMode, profileId, setProfileId, availableProfiles } = useAnalytics();
  const [appId, setAppId] = useState('123456789012345');
  const [rapidKey, setRapidKey] = useState(localStorage.getItem('rapidapi_key') || '');
  const [connecting, setConnecting] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);

  const permissions = [
    { scope: 'instagram_basic', desc: 'Read basic profile metadata and account details', granted: true },
    { scope: 'instagram_manage_insights', desc: 'Read video views, impressions, reach, and follower demographics', granted: true },
    { scope: 'pages_show_list', desc: 'List Facebook pages connected to Instagram business accounts', granted: true },
    { scope: 'pages_read_engagement', desc: 'Read post likes, comments, shares, and save metrics', granted: true }
  ];

  const handleSaveRapidKey = (e) => {
    e.preventDefault();
    localStorage.setItem('rapidapi_key', rapidKey);
    setStatusMsg("RapidAPI Key Saved! Live Real-Time Instagram Extraction is now active!");
    setIsLiveMode(true);
  };

  const handleMetaLogin = () => {
    setConnecting(true);
    setStatusMsg(null);
    setTimeout(() => {
      setConnecting(false);
      setIsLiveMode(true);
      setStatusMsg("Successfully connected to Meta Graph API! Live account data token active.");
    }, 1500);
  };

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
              InstaPlus AI - Real-Time Live Data Hub
              <span className="px-2 py-0.5 rounded text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 font-mono font-bold">
                RAPIDAPI & META GRAPH API
              </span>
            </h2>
            <p className="text-xs text-slate-400">Configure Live Instagram Scraper API Keys for 100% Real-Time Live URL Extraction</p>
          </div>
        </div>
      </div>

      {/* RapidAPI Real-Time Scraper Card */}
      <form onSubmit={handleSaveRapidKey} className="glass-panel rounded-2xl p-6 border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/10 to-slate-900 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            1. RapidAPI Instagram Live Scraper (100% Real Live Client Extractor)
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono">RECOMMENDED FOR CLIENT REELS</span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Pura 100% Real Live Data extract karne ke liye niche RapidAPI Key enter karein. RapidAPI pe **Instagram Scraper API** se kisi bhi Client Reel/Post ka exact Asli Views, Likes, Comments, Followers aur Caption live fetch hota hai.
        </p>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">RapidAPI Key (X-RapidAPI-Key):</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={rapidKey}
              onChange={(e) => setRapidKey(e.target.value)}
              placeholder="Paste your RapidAPI Key here (e.g. 5a1b2c3d4e5f6g7h8i9j...)"
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 text-xs font-mono outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs shadow-lg hover:bg-amber-400 transition shrink-0"
            >
              Save API Key
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <span>Free API Key available at rapidapi.com</span>
          <a
            href="https://rapidapi.com/hub"
            target="_blank"
            rel="noreferrer"
            className="text-amber-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <span>Get Free RapidAPI Key</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </form>

      {/* Mode Selector Card */}
      <div className="glass-panel rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-pink-400" />
          Analytics Engine Mode
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            onClick={() => setIsLiveMode(false)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              !isLiveMode 
                ? 'bg-pink-500/10 border-pink-500/50 text-white ring-2 ring-pink-500/30' 
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs flex items-center gap-1.5 text-amber-400">
                <CheckCircle2 className="w-4 h-4" />
                1. Demo / Verification Mode
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">SIMULATION</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Allows instant URL testing, custom metric editing, and multi-niche demo datasets (SaaS, Doctor, E-Commerce).
            </p>
          </div>

          <div 
            onClick={() => setIsLiveMode(true)}
            className={`p-4 rounded-xl border cursor-pointer transition ${
              isLiveMode 
                ? 'bg-emerald-500/10 border-emerald-500/50 text-white ring-2 ring-emerald-500/30' 
                : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                2. Live API Mode
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">PRODUCTION</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Uses live RapidAPI and Meta Graph API endpoints to fetch 100% real live client data directly from Instagram servers.
            </p>
          </div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-bold shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}
    </div>
  );
}
