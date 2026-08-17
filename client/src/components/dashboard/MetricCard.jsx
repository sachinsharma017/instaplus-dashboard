import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

export default function MetricCard({ title, value, growth, icon: Icon, tooltip, isPct = false, formatNumber = true }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isPositive = growth >= 0;

  const displayVal = typeof value === 'number' && formatNumber
    ? value.toLocaleString() 
    : value;

  return (
    <div className="rounded-2xl p-4 relative group hover:-translate-y-1 hover:border-pink-500/40 transition-all duration-300 shadow-xl border border-slate-700/60 bg-slate-900/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-slate-400">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{title}</span>
          {tooltip && (
            <div className="relative">
              <Info 
                className="w-3.5 h-3.5 cursor-pointer text-slate-400 hover:text-pink-500 transition" 
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              />
              {showTooltip && (
                <div className="absolute left-0 bottom-full mb-2 w-48 p-2 rounded-xl bg-slate-900 text-slate-100 border border-slate-700 text-[11px] shadow-2xl z-50 pointer-events-none">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div className="text-2xl font-extrabold text-white font-mono tracking-tight">
          {displayVal}{isPct ? '%' : ''}
        </div>
        
        {growth !== undefined && (
          <div className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPositive 
              ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
              : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{isPositive ? '+' : ''}{growth}%</span>
          </div>
        )}
      </div>

      <div className="mt-2 text-[11px] text-slate-500 font-medium">
        vs. previous period
      </div>
    </div>
  );
}
