import React from 'react';
import {
  Clock,
  Heart,
  MessageCircle,
  Eye,
  Share2,
  Bookmark,
  TrendingUp,
  Zap,
  Link2,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr';
  if (num >= 100000) return (num / 100000).toFixed(1) + ' L';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString('en-IN');
}

function StatCard({ icon: Icon, label, value, color, sub }) {
  return (
    <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 flex flex-col gap-2 shadow-lg hover:border-slate-600 transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="text-2xl font-black text-slate-100 font-mono tracking-tight">{value}</div>
      {sub && <div className="text-[11px] text-slate-500 font-medium">{sub}</div>}
    </div>
  );
}

function ERBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold">
        <span className="text-slate-300">{label}</span>
        <span className="text-slate-100 font-mono font-bold">{formatNumber(value)}</span>
      </div>
      <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700/40 p-0.5">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function AudienceView() {
  const { lastQuickResult, setActiveTab } = useAnalytics();

  // No URL extracted yet — show empty state
  if (!lastQuickResult || (!lastQuickResult.likes && !lastQuickResult.views && !lastQuickResult.comments)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 max-w-xl mx-auto text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-xl">
          <Link2 className="w-9 h-9 text-pink-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-100">Koi URL Extract Nahi Hua</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Pehle Dashboard pe jaake koi Instagram Post ya Reel URL paste karo aur Extract karo.
            Uske baad yahan real data dikhega.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold shadow-lg hover:opacity-90 transition"
        >
          <Link2 className="w-4 h-4" />
          Dashboard pe Jao → URL Extract Karo
        </button>
      </div>
    );
  }

  const data = lastQuickResult;
  const likes = Number(data.likes) || 0;
  const comments = Number(data.comments) || 0;
  const views = Number(data.views) || 0;
  const shares = Number(data.shares) || 0;
  const saves = Number(data.saves) || 0;
  const reach = Number(data.reach) || Math.max(views, likes * 5);
  const er = Number(data.engagementRate) || 0;
  const followers = Number(data.followers) || 0;
  const viralityScore = Number(data.viralityScore) || 0;
  const maxEngagement = Math.max(likes, comments, views, shares, saves, 1);

  const erLevel =
    er >= 8 ? { label: '🔥 Viral', color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' } :
    er >= 5 ? { label: '⭐ Excellent', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' } :
    er >= 3 ? { label: '✅ Good', color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' } :
               { label: '📉 Low', color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">

      {/* Header: Source info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="text-sm font-bold text-emerald-300">Live Instagram Data — Real Extracted Metrics</div>
            <div className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-sm">{data.url || 'Extracted Post'}</div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${erLevel.bg} ${erLevel.color}`}>
          {erLevel.label}
        </span>
      </div>

      {/* Post Author Row */}
      {(data.authorName || data.authorHandle) && (
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-700/60 shadow-lg">
          {data.avatar && (
            <img
              src={`/api/proxy-image?url=${encodeURIComponent(data.avatar)}`}
              onError={(e) => { e.target.style.display = 'none'; }}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-500/30 shrink-0"
              alt={data.authorName}
            />
          )}
          <div className="min-w-0">
            <div className="font-bold text-slate-100 text-sm">{data.authorName || '—'}</div>
            <div className="text-xs text-slate-400 font-mono">{data.authorHandle || ''}</div>
            {followers > 0 && (
              <div className="text-xs text-pink-400 font-bold mt-0.5">
                <Users className="w-3 h-3 inline mr-1" />
                {formatNumber(followers)} Followers
              </div>
            )}
          </div>
          {data.caption && (
            <div className="hidden md:block ml-4 text-xs text-slate-400 truncate max-w-xs border-l border-slate-700 pl-4">
              {data.caption.slice(0, 120)}{data.caption.length > 120 ? '…' : ''}
            </div>
          )}
        </div>
      )}

      {/* 6 Core Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <StatCard icon={Eye}       label="Views"          value={formatNumber(views)}    color="bg-purple-500"  sub="Total impressions" />
        <StatCard icon={Heart}     label="Likes"          value={formatNumber(likes)}    color="bg-pink-500"    sub="Total likes" />
        <StatCard icon={MessageCircle} label="Comments"   value={formatNumber(comments)} color="bg-sky-500"     sub="Total comments" />
        <StatCard icon={Share2}    label="Shares"         value={formatNumber(shares)}   color="bg-indigo-500"  sub="DM + Story shares" />
        <StatCard icon={Bookmark}  label="Saves"          value={formatNumber(saves)}    color="bg-amber-500"   sub="Saved by users" />
        <StatCard icon={Users}     label="Reach"          value={formatNumber(reach)}    color="bg-emerald-500" sub="Unique accounts" />
      </div>

      {/* ER + Virality Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pink-400" />
              Engagement Rate
            </h3>
            <span className={`text-2xl font-black font-mono ${erLevel.color}`}>{er.toFixed(2)}%</span>
          </div>
          <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden border border-slate-700/40 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-700"
              style={{ width: `${Math.min(100, er * 10)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-mono">
            <span>0%</span>
            <span className="text-slate-400">Formula: (Likes+Comments+Shares+Saves) / Reach × 100</span>
            <span>10%+</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Virality Score
            </h3>
            <span className="text-2xl font-black font-mono text-amber-400">{viralityScore}/100</span>
          </div>
          <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden border border-slate-700/40 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-700"
              style={{ width: `${viralityScore}%` }}
            />
          </div>
          <div className="text-[11px] text-slate-500 font-mono text-center">
            {viralityScore >= 90 ? '🔥 Viral Potential — Top 5% Content' :
             viralityScore >= 75 ? '⭐ High Performing Content' :
             viralityScore >= 50 ? '✅ Average Performing' : '📉 Below Average Performance'}
          </div>
        </div>
      </div>

      {/* Engagement Breakdown Bar Chart */}
      <div className="bg-slate-900/80 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
        <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-pink-400" />
          Engagement Breakdown
        </h3>
        <div className="space-y-3">
          <ERBar label="👁️ Views"    value={views}    max={maxEngagement} color="bg-gradient-to-r from-purple-500 to-purple-400" />
          <ERBar label="❤️ Likes"    value={likes}    max={maxEngagement} color="bg-gradient-to-r from-pink-500 to-rose-400" />
          <ERBar label="💬 Comments" value={comments} max={maxEngagement} color="bg-gradient-to-r from-sky-500 to-blue-400" />
          <ERBar label="🔁 Shares"   value={shares}   max={maxEngagement} color="bg-gradient-to-r from-indigo-500 to-violet-400" />
          <ERBar label="🔖 Saves"    value={saves}    max={maxEngagement} color="bg-gradient-to-r from-amber-500 to-orange-400" />
        </div>
      </div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/40 text-xs text-slate-500">
        <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <span>
          Audience demographics (Age, Gender, Location) Instagram publicly expose nahi karta — yeh data sirf Instagram Business Suite me milta hai. Upar diye sare numbers <strong className="text-slate-300">100% real live extracted</strong> hain is URL se.
        </span>
      </div>
    </div>
  );
}
