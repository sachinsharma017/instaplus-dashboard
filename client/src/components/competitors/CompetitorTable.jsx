import React, { useState } from 'react';
import {
  Swords, Plus, Trash2, Loader2, Link2, Users,
  Heart, MessageCircle, Eye, TrendingUp, CheckCircle2, AlertCircle, X
} from 'lucide-react';
import { API_BASE } from '../../apiConfig';

function fmt(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 10000000) return (num / 10000000).toFixed(1) + ' Cr';
  if (num >= 100000)   return (num / 100000).toFixed(1) + ' L';
  if (num >= 1000)     return (num / 1000).toFixed(1) + 'K';
  return Number(num).toLocaleString('en-IN');
}

export default function CompetitorTable() {
  const [urlInput, setUrlInput] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCompetitor = async () => {
    const url = urlInput.trim();
    if (!url) return;
    if (competitors.find(c => c.url === url)) {
      setError('Yeh URL already add hai!');
      return;
    }
    if (competitors.length >= 5) {
      setError('Maximum 5 competitors add kar sakte ho.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/api/extract-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const resData = await res.json();

      if (!resData.success || resData.error || (resData.data && resData.data.isPrivate)) {
        setError(resData.error || '🔒 Private ya restricted account/post hai.');
        setLoading(false);
        return;
      }

      setCompetitors(prev => [...prev, { ...resData.data, url }]);
      setUrlInput('');
    } catch (err) {
      setError('Server se connect nahi ho pa raha. Backend chal raha hai?');
    }
    setLoading(false);
  };

  const remove = (url) => setCompetitors(prev => prev.filter(c => c.url !== url));

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* URL Input */}
      <div className="p-5 rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-pink-400" />
          <h2 className="font-extrabold text-base text-white">Competitor Analysis</h2>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-400 border border-pink-500/30 font-bold ml-auto">
            {competitors.length}/5 Added
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Kisi bhi Instagram Post, Reel ya Profile URL paste karo — real data fetch hoga.
        </p>

        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2.5">
            <Link2 className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={urlInput}
              onChange={e => { setUrlInput(e.target.value); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && fetchCompetitor()}
              placeholder="https://www.instagram.com/reel/... ya @username"
              className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-600 outline-none"
            />
            {urlInput && (
              <button onClick={() => setUrlInput('')} className="text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={fetchCompetitor}
            disabled={loading || !urlInput.trim()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {loading ? 'Fetching...' : 'Add'}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Empty State */}
      {competitors.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center">
            <Swords className="w-7 h-7 text-pink-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Koi Competitor Add Nahi Hua</h3>
            <p className="text-sm text-slate-400 mt-1">
              Upar Instagram URL paste karo — real data fetch hoga aur yahan dikhega.
            </p>
          </div>
        </div>
      )}

      {/* Competitor Cards */}
      {competitors.length > 0 && (
        <>
          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {competitors.map((c, idx) => (
              <div key={idx} className="relative p-5 rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-lg space-y-4 hover:border-pink-500/30 transition">
                {/* Remove button */}
                <button
                  onClick={() => remove(c.url)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Profile */}
                <div className="flex items-center gap-3 pr-8">
                  {c.avatar ? (
                    <img
                      src={`${API_BASE}/api/proxy-image?url=${encodeURIComponent(c.avatar)}`}
                      onError={e => { e.target.style.display='none'; }}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-pink-500/30 shrink-0"
                      alt={c.authorName}
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-white truncate">{c.authorName || 'Instagram Account'}</div>
                    <div className="text-xs text-slate-400 font-mono truncate">{c.authorHandle || ''}</div>
                  </div>
                </div>

                {/* Source badge */}
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-2 py-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Live Extracted Data
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Users,          label: 'Followers', val: fmt(c.followers),      color: 'text-pink-400' },
                    { icon: Eye,            label: 'Views',     val: fmt(c.views),          color: 'text-purple-400' },
                    { icon: Heart,          label: 'Likes',     val: fmt(c.likes),          color: 'text-rose-400' },
                    { icon: MessageCircle,  label: 'Comments',  val: fmt(c.comments),       color: 'text-sky-400' },
                    { icon: TrendingUp,     label: 'ER %',      val: `${Number(c.engagementRate||0).toFixed(2)}%`, color: 'text-emerald-400' },
                    { icon: Eye,            label: 'Reach',     val: fmt(c.reach),          color: 'text-amber-400' },
                  ].map(({ icon: Icon, label, val, color }) => (
                    <div key={label} className="bg-slate-800/60 rounded-xl p-2.5 space-y-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold uppercase">
                        <Icon className={`w-3 h-3 ${color}`} />
                        {label}
                      </div>
                      <div className={`text-sm font-extrabold font-mono ${color}`}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* Caption snippet */}
                {c.caption && (
                  <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2 line-clamp-2">
                    {c.caption.slice(0, 100)}{c.caption.length > 100 ? '…' : ''}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-pink-400" />
                Head-to-Head Comparison
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Account</th>
                    <th className="py-3 px-3">Followers</th>
                    <th className="py-3 px-3">Views</th>
                    <th className="py-3 px-3">Likes</th>
                    <th className="py-3 px-3">Comments</th>
                    <th className="py-3 px-3">Reach</th>
                    <th className="py-3 px-3">ER %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {competitors.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{c.authorName || '—'}</div>
                        <div className="text-[10px] text-slate-500">{c.authorHandle || ''}</div>
                      </td>
                      <td className="py-3 px-3 text-pink-400 font-bold">{fmt(c.followers)}</td>
                      <td className="py-3 px-3 text-purple-400">{fmt(c.views)}</td>
                      <td className="py-3 px-3 text-rose-400">{fmt(c.likes)}</td>
                      <td className="py-3 px-3 text-sky-400">{fmt(c.comments)}</td>
                      <td className="py-3 px-3 text-amber-400">{fmt(c.reach)}</td>
                      <td className="py-3 px-3 text-emerald-400 font-bold">{Number(c.engagementRate||0).toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
