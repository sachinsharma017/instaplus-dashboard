import React from 'react';
import { Award, Film, Layers, Image as ImageIcon, Heart, MessageSquare, Share2, Bookmark, Eye } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export default function BestContentGrid() {
  const { highlights } = useAnalytics();

  if (!highlights.bestReel) return null;

  const categories = [
    { title: 'Best Reel Overall', icon: Film, post: highlights.bestReel, color: 'text-pink-500', badge: '🔥 Top Reel' },
    { title: 'Best Carousel Post', icon: Layers, post: highlights.bestCarousel, color: 'text-amber-500', badge: '⭐ Top Slides' },
    { title: 'Best Single Image', icon: ImageIcon, post: highlights.bestPost, color: 'text-sky-500', badge: '📈 Top Image' },
    { title: 'Most Liked Content', icon: Heart, post: highlights.mostLiked, color: 'text-rose-500', badge: `${highlights.mostLiked?.likes.toLocaleString()} Likes` },
    { title: 'Most Commented Content', icon: MessageSquare, post: highlights.mostCommented, color: 'text-purple-500', badge: `${highlights.mostCommented?.comments.toLocaleString()} Comments` },
    { title: 'Most Shared Content', icon: Share2, post: highlights.mostShared, color: 'text-emerald-500', badge: `${highlights.mostShared?.shares.toLocaleString()} Shares` },
    { title: 'Most Saved Content', icon: Bookmark, post: highlights.mostSaved, color: 'text-amber-500', badge: `${highlights.mostSaved?.saves.toLocaleString()} Saves` },
    { title: 'Highest Reach Content', icon: Eye, post: highlights.highestReach, color: 'text-indigo-500', badge: `${highlights.highestReach?.reach.toLocaleString()} Reach` }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="mb-4">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-pink-500" />
          Best Content Hall of Fame
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Category winners across all key performance dimensions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          const post = cat.post;
          if (!post) return null;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200 dark:border-slate-700/60 hover:border-pink-500/40 transition shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                  {cat.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                  {cat.badge}
                </span>
              </div>

              <div className="flex gap-3 items-center">
                <img 
                  src={post.thumbnail || post.mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'} 
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'; }}
                  alt={post.caption} 
                  className="w-12 h-16 rounded-lg object-cover flex-shrink-0 shadow-md" 
                />
                <div className="overflow-hidden">
                  <p className="text-[11px] text-slate-900 dark:text-slate-200 line-clamp-2 leading-snug font-semibold mb-1">
                    "{post.caption}"
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>Score: <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{post.score}/100</strong></span>
                    <span>•</span>
                    <span>{post.type}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
