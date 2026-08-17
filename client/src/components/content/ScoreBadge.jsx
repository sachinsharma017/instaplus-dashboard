import React, { useState } from 'react';
import { Award, Info, X, CheckCircle2 } from 'lucide-react';

export default function ScoreBadge({ score, post }) {
  const [showDrawer, setShowDrawer] = useState(false);

  const getBadgeStyle = (val) => {
    if (val >= 85) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    if (val >= 70) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    if (val >= 50) return 'bg-blue-500/20 text-blue-400 border-blue-500/40';
    return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
  };

  const getRatingLabel = (val) => {
    if (val >= 85) return 'Excellent (Viral Tier)';
    if (val >= 70) return 'Above Average (Top Performer)';
    if (val >= 50) return 'Moderate (Growing)';
    return 'Low Engagement (Action Required)';
  };

  return (
    <>
      <button
        onClick={() => setShowDrawer(true)}
        className={`px-2.5 py-1 rounded-lg border font-mono text-xs font-bold flex items-center gap-1.5 transition hover:scale-105 ${getBadgeStyle(score)}`}
        title="Click to view Content Performance Score formula breakdown"
      >
        <Award className="w-3.5 h-3.5" />
        <span>{score}/100</span>
      </button>

      {/* Modal Drawer Explanation */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowDrawer(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-instagram-gradient p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-pink-400 font-mono font-bold text-lg">
                  {score}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-base">Content Performance Score Breakdown</h4>
                <p className="text-xs text-pink-400 font-semibold">{getRatingLabel(score)}</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 mb-5">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <div className="flex justify-between font-semibold mb-1">
                  <span>Reach-to-Follower Ratio (25%)</span>
                  <span className="text-emerald-400 font-mono">
                    {post ? `${((post.reach / 148500) * 100).toFixed(1)}%` : '24.2%'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Measures how far outside your follower base Instagram algorithm pushed this post.</p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <div className="flex justify-between font-semibold mb-1">
                  <span>Save-to-Reach Ratio (30%)</span>
                  <span className="text-amber-400 font-mono">
                    {post ? `${((post.saves / post.reach) * 100).toFixed(1)}%` : '6.1%'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">High saves indicate strong educational value & bookmark intent.</p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <div className="flex justify-between font-semibold mb-1">
                  <span>Share Rate Velocity (25%)</span>
                  <span className="text-sky-400 font-mono">
                    {post ? `${((post.shares / post.reach) * 100).toFixed(1)}%` : '3.2%'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Direct message shares trigger viral algorithm recommendations.</p>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
                <div className="flex justify-between font-semibold mb-1">
                  <span>Overall Engagement Rate (20%)</span>
                  <span className="text-pink-400 font-mono">
                    {post ? `${(((post.likes + post.comments) / post.reach) * 100).toFixed(1)}%` : '5.8%'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Combined like and comment interaction density.</p>
              </div>
            </div>

            <button
              onClick={() => setShowDrawer(false)}
              className="w-full py-2.5 rounded-xl bg-pink-500 text-white font-semibold text-xs hover:bg-pink-600 transition"
            >
              Close Diagnostic Breakdown
            </button>
          </div>
        </div>
      )}
    </>
  );
}
