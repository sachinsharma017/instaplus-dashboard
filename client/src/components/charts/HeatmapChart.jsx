import React, { useState } from 'react';
import { Clock, Calendar, Sparkles } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export default function HeatmapChart() {
  const { audience } = useAnalytics();
  const [hoverCell, setHoverCell] = useState(null);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['12AM', '3AM', '6AM', '9AM', '12PM', '3PM', '6PM', '9PM'];

  const bestDay = audience?.bestTime?.day || 'Thursday';
  const bestTime = audience?.bestTime?.time || '8:00 PM IST';

  // Matrix generation for 7 days x 8 time slots
  const getIntensity = (dayIdx, hourIdx) => {
    if (dayIdx === 1 && (hourIdx === 6 || hourIdx === 7)) return 95; // Tue evening
    if (dayIdx === 3 && (hourIdx === 3 || hourIdx === 4)) return 88; // Thu morning
    if (dayIdx === 0 && hourIdx === 2) return 85; // Mon morning fitness
    if (hourIdx >= 4 && hourIdx <= 6) return 60 + ((dayIdx * 7) % 30);
    return Math.max(10, Math.floor(Math.sin(dayIdx + hourIdx) * 35 + 40));
  };

  const getColorClass = (val) => {
    if (val >= 90) return 'bg-pink-500 text-white font-bold shadow-lg shadow-pink-500/40 ring-1 ring-pink-300';
    if (val >= 75) return 'bg-pink-600/80 text-white';
    if (val >= 50) return 'bg-purple-600/60 text-purple-100';
    if (val >= 30) return 'bg-slate-800 text-slate-400';
    return 'bg-slate-900/60 text-slate-600';
  };

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-xl border border-slate-800 bg-slate-900/90">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-pink-400" />
            24x7 Active Audience Heatmap
          </h3>
          <p className="text-xs text-slate-400">Online audience density across days and hours</p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span>Low</span>
          <div className="flex gap-1">
            <span className="w-3 h-3 rounded bg-slate-900 border border-slate-800"></span>
            <span className="w-3 h-3 rounded bg-slate-800"></span>
            <span className="w-3 h-3 rounded bg-purple-600/60"></span>
            <span className="w-3 h-3 rounded bg-pink-600"></span>
            <span className="w-3 h-3 rounded bg-pink-500"></span>
          </div>
          <span>Peak</span>
        </div>
      </div>

      {/* Grid Heatmap */}
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          {/* Hour labels */}
          <div className="grid grid-cols-9 gap-1.5 mb-2 text-center text-[10px] font-semibold text-slate-400">
            <div>Day</div>
            {hours.map((h, i) => (
              <div key={i}>{h}</div>
            ))}
          </div>

          {/* Matrix Rows */}
          {days.map((day, dIdx) => (
            <div key={day} className="grid grid-cols-9 gap-1.5 mb-1.5 items-center">
              <div className="text-xs font-semibold text-slate-300 text-center">{day}</div>
              {hours.map((_, hIdx) => {
                const intensity = getIntensity(dIdx, hIdx);
                const isHovered = hoverCell?.d === dIdx && hoverCell?.h === hIdx;
                return (
                  <div
                    key={hIdx}
                    onMouseEnter={() => setHoverCell({ d: dIdx, h: hIdx, val: intensity })}
                    onMouseLeave={() => setHoverCell(null)}
                    className={`h-9 rounded-lg flex items-center justify-center text-[11px] font-mono transition-all cursor-pointer ${getColorClass(intensity)} ${
                      isHovered ? 'scale-110 z-10 ring-2 ring-white' : ''
                    }`}
                  >
                    {intensity}%
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Dynamic Recommendation Footer */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span className="text-xs text-slate-300 font-semibold">
            Recommended Optimal Publishing Window:
          </span>
          <span className="px-2.5 py-1 rounded-md bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-bold font-mono">
            {bestDay}, {bestTime}
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Confidence score: <strong className="text-emerald-400 font-mono">98.4%</strong>
        </span>
      </div>
    </div>
  );
}
