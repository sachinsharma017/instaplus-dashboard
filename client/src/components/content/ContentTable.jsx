import React, { useState } from 'react';
import { 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  TrendingUp, 
  ArrowUpDown, 
  Filter,
  Flame,
  Star,
  AlertTriangle,
  Film,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import ScoreBadge from './ScoreBadge';

export default function ContentTable() {
  const { posts } = useAnalytics();
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('score');
  const [sortOrder, setSortOrder] = useState('desc');

  let filtered = filterType === 'All' ? posts : posts.filter(p => p.type === filterType);

  filtered.sort((a, b) => {
    let valA = a[sortBy] ?? 0;
    let valB = b[sortBy] ?? 0;
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getTypeIcon = (type) => {
    if (type === 'Reel') return <Film className="w-3.5 h-3.5 text-pink-400" />;
    if (type === 'Carousel') return <Layers className="w-3.5 h-3.5 text-amber-400" />;
    return <ImageIcon className="w-3.5 h-3.5 text-sky-400" />;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-xl">
      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-100">Post & Reel Analytics Engine</h3>
          <p className="text-xs text-slate-400">Detailed metric breakdown, performance scores, and virality badges</p>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          {['All', 'Reel', 'Carousel', 'Image'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                filterType === t 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}s
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-700">
            <tr>
              <th className="py-3 px-3">Content</th>
              <th className="py-3 px-2">Type</th>
              <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => toggleSort('date')}>
                <div className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => toggleSort('score')}>
                <div className="flex items-center gap-1">Score <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => toggleSort('views')}>
                <div className="flex items-center gap-1">Views <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => toggleSort('likes')}>
                <div className="flex items-center gap-1">Likes <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => toggleSort('comments')}>
                <div className="flex items-center gap-1">Comments <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => toggleSort('shares')}>
                <div className="flex items-center gap-1">Shares <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-2 cursor-pointer hover:text-white" onClick={() => toggleSort('saves')}>
                <div className="flex items-center gap-1">Saves <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="py-3 px-2">Badge</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
            {filtered.map((post) => (
              <tr key={post.id} className="hover:bg-slate-100/80 dark:hover:bg-slate-800/40 transition">
                {/* Thumbnail & Caption */}
                <td className="py-3 px-3">
                  <div className="flex items-center gap-3 max-w-xs">
                    <img 
                      src={post.thumbnail || post.mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'} 
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'; }}
                      alt={post.caption} 
                      className="w-10 h-12 rounded-lg object-cover flex-shrink-0" 
                    />
                    <p className="text-slate-900 dark:text-slate-200 font-semibold line-clamp-2 text-[11px] leading-snug">{post.caption}</p>
                  </div>
                </td>

                {/* Type */}
                <td className="py-3 px-2">
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700">
                    {getTypeIcon(post.type)}
                    {post.type}
                  </span>
                </td>

                {/* Date */}
                <td className="py-3 px-2 text-slate-600 dark:text-slate-400 font-mono font-medium">{post.date}</td>

                {/* Score */}
                <td className="py-3 px-2">
                  <ScoreBadge score={post.score} post={post} />
                </td>

                {/* Metrics */}
                <td className="py-3 px-2 font-mono font-bold text-slate-900 dark:text-slate-100">{post.views.toLocaleString()}</td>
                <td className="py-3 px-2 font-mono text-rose-400">{post.likes.toLocaleString()}</td>
                <td className="py-3 px-2 font-mono text-purple-400">{post.comments.toLocaleString()}</td>
                <td className="py-3 px-2 font-mono text-emerald-400">{post.shares.toLocaleString()}</td>
                <td className="py-3 px-2 font-mono text-amber-400">{post.saves.toLocaleString()}</td>

                <td className="py-3 px-2">
                  {(() => {
                    const badgeStr = post.badge || (post.views > 1000000 ? '🔥 Viral' : post.score > 90 ? '⭐ Top Performing' : '📈 Growing');
                    return (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${
                        badgeStr.includes('Viral') 
                          ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' 
                          : badgeStr.includes('Top') 
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                          : badgeStr.includes('Growing')
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500/40'
                          : 'bg-slate-700/60 text-slate-400 border-slate-600'
                      }`}>
                        {badgeStr}
                      </span>
                    );
                  })()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
