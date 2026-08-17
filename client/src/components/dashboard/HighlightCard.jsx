import React from 'react';
import { Flame, Eye, Heart, Bookmark, Share2 } from 'lucide-react';
import { getProxiedImageUrl } from '../../utils/imageProxy';

export default function HighlightCard({ title, badge, post, type = 'reel' }) {
  if (!post) return null;

  const views = Number(post.views) || Number(post.reach) || 0;
  const likes = Number(post.likes) || 0;
  const saves = Number(post.saves) || 0;
  const shares = Number(post.shares) || 0;

  const reelFallbackCover = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600';
  const rawImg = post.thumbnail || post.mediaUrl || '';
  const proxiedImg = getProxiedImageUrl(rawImg, reelFallbackCover);

  return (
    <div className="glass-panel rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 hover:border-pink-500/40 transition-all duration-300 shadow-xl shadow-pink-500/5 border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>

      <div className="flex items-center justify-between mb-3 relative z-10">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</span>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-500/15 text-pink-600 dark:text-pink-400 border border-pink-500/30 flex items-center gap-1">
          <Flame className="w-3 h-3 text-pink-500" />
          {badge}
        </span>
      </div>

      <div className="flex items-start gap-4 relative z-10">
        <div className="relative w-20 h-28 rounded-xl overflow-hidden shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform bg-slate-950 ring-2 ring-pink-500/20">
          <img 
            src={proxiedImg} 
            referrerPolicy="no-referrer"
            onError={(e) => { e.target.src = reelFallbackCover; }}
            alt={post.caption} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
            <span className="text-[10px] font-bold text-white uppercase bg-pink-600/90 px-1.5 py-0.5 rounded backdrop-blur">
              {post.type || 'Reel'}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2 mb-3 font-semibold leading-relaxed">
            "{post.caption || 'Instagram Content'}"
          </p>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
              <Eye className="w-3.5 h-3.5 text-sky-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{views.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{likes.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
              <Bookmark className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{saves.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
              <Share2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{shares.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
