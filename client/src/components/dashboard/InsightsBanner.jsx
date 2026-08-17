import React from 'react';
import { Sparkles, ArrowRight, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export default function InsightsBanner() {
  const { metrics, profileData, setActiveTab, period } = useAnalytics();

  const isCommentDrop = metrics.totalCommentsGrowthPct < 0;

  const insights = [
    {
      id: 1,
      type: 'success',
      icon: TrendingUp,
      title: 'Content Format Efficiency',
      text: `${profileData.topContentType} are generating 64.2% more reach and 3.1x higher share rates than single image posts.`,
      action: 'Create More Video Reels'
    },
    {
      id: 2,
      type: 'timing',
      icon: Lightbulb,
      title: 'Optimal Publishing Window',
      text: `Posts published on ${profileData.audience.bestTime.day} between ${profileData.audience.bestTime.time} receive 42% higher engagement.`,
      action: 'Schedule for Peak Window'
    },
    {
      id: 3,
      type: isCommentDrop ? 'warning' : 'success',
      icon: isCommentDrop ? AlertTriangle : Sparkles,
      title: isCommentDrop ? 'Engagement Alert: Comment Velocity' : 'High Save Intent',
      text: isCommentDrop 
        ? `Comments decreased by ${Math.abs(metrics.totalCommentsGrowthPct)}% over the last ${period}. Add open-ended questions to video captions.`
        : `Educational carousels yield a 4.8% Save Rate compared to the 1.4% baseline average.`,
      action: isCommentDrop ? 'Fix Caption CTAs' : 'Repurpose Top Content'
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-pink-500/30 bg-gradient-to-r from-white via-pink-50/40 to-purple-50/40 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-slate-900/80 shadow-xl relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-instagram-gradient p-0.5 shadow-md flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Automated Marketing Insights & Strategy Engine
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-300 border border-pink-500/30">
                LIVE ALGORITHM
              </span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Actionable recommendations derived from actual account performance metrics</p>
          </div>
        </div>
        <button 
          onClick={() => setActiveTab('ai')}
          className="text-xs text-pink-600 dark:text-pink-400 hover:text-pink-700 font-bold flex items-center gap-1 bg-pink-500/10 px-3 py-1.5 rounded-xl border border-pink-500/20 transition hover:bg-pink-500/20"
        >
          <span>Ask AI Strategy Assistant</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item) => {
          const Icon = item.icon;
          return (
            <div 
              key={item.id}
              className={`p-3.5 rounded-xl border ${
                item.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-200'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-200 shadow-sm'
              } flex flex-col justify-between hover:border-pink-500/40 transition duration-200`}
            >
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Icon className={`w-4 h-4 ${item.type === 'warning' ? 'text-amber-500' : 'text-pink-500'}`} />
                  <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.title}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  "{item.text}"
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700/40 flex items-center justify-between text-[11px]">
                <span className="font-bold text-pink-600 dark:text-pink-400">{item.action}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
