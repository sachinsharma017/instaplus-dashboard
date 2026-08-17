import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Film, 
  Users, 
  Swords, 
  Sparkles, 
  Lightbulb, 
  FileText, 
  Settings,
  ShieldCheck,
  CheckCircle2,
  Link2
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { getProxiedImageUrl } from '../../utils/imageProxy';

const InstagramIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Sidebar() {
  const { activeTab, setActiveTab, profileData, isLiveMode } = useAnalytics();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'extractor', label: 'URL Data Extractor', icon: Link2, badge: '100 URLs', highlight: true },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'content', label: 'Content Performance', icon: Film, badge: 'Viral' },
    { id: 'audience', label: 'Audience & Timing', icon: Users },
    { id: 'competitors', label: 'Competitors', icon: Swords },
    { id: 'ai', label: 'AI Marketing Assistant', icon: Sparkles, highlight: true },
    { id: 'ideas', label: 'Content Ideas', icon: Lightbulb },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'settings', label: 'Meta API & Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col justify-between h-screen shrink-0">
      <div>
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-instagram-gradient p-0.5 shadow-lg shadow-pink-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[10px] flex items-center justify-center">
              <InstagramIcon className="w-5 h-5 text-pink-500" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-white tracking-tight">InstaPlus</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-400 border border-pink-500/30 font-mono">AI PLUS</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Instagram URL Extractor & AI Analytics</p>
          </div>
        </div>

        {/* Account Profile Card */}
        <div className="p-3 mx-3 my-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img 
              src={getProxiedImageUrl(profileData.avatar, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250')} 
              referrerPolicy="no-referrer"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'; }}
              alt={profileData.name} 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-500/30 flex-shrink-0"
            />
            <div className="truncate">
              <div className="flex items-center gap-1">
                <span className="font-bold text-xs text-slate-100 truncate">{profileData.name}</span>
                {profileData.verified && <CheckCircle2 className="w-3 h-3 text-sky-500 flex-shrink-0" />}
              </div>
              <span className="text-[11px] text-slate-400 font-mono font-medium">{profileData.handle}</span>
            </div>
          </div>
        </div>

        {/* API Status Badge */}
        <div className="px-5 mb-2">
          <div className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center justify-between ${isLiveMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-sky-500/10 text-sky-400 border border-sky-500/30'}`}>
            <span className="flex items-center gap-1.5 font-bold">
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveMode ? 'bg-emerald-500 animate-ping' : 'bg-sky-500'}`}></span>
              {isLiveMode ? 'Live Meta Graph API' : 'Real Account Mode'}
            </span>
            <ShieldCheck className="w-3.5 h-3.5 opacity-70" />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 mt-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  const mainContainer = document.getElementById('main-scroll-container');
                  if (mainContainer) mainContainer.scrollTop = 0;
                  window.scrollTo(0, 0);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive 
                    ? 'bg-instagram-gradient text-white shadow-md shadow-pink-500/20 font-bold' 
                    : item.highlight
                    ? 'text-pink-400 hover:bg-pink-500/10'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3 pointer-events-none">
                  <Icon className={`w-4 h-4 pointer-events-none ${isActive ? 'text-white' : item.highlight ? 'text-pink-400' : 'text-slate-400'}`} />
                  <span className="pointer-events-none">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full pointer-events-none ${
                    isActive ? 'bg-white/20 text-white' : 'bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <span>v2.4.0 • Enterprise</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            System Ready
          </span>
        </div>
      </div>
    </aside>
  );
}
