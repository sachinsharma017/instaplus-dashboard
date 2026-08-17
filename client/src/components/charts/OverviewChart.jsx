import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAnalytics } from '../../context/AnalyticsContext';

export default function OverviewChart() {
  const { timeSeries, darkMode } = useAnalytics();

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Views & Reach Trend</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Total impression views vs unique account reach over time</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-pink-500 shadow-sm"></span>
            <span className="text-slate-800 dark:text-slate-300">Views</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-sky-400 shadow-sm"></span>
            <span className="text-slate-800 dark:text-slate-300">Reach</span>
          </div>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E1306C" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#E1306C" stopOpacity={0.0}/>
              </linearGradient>
              <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#cbd5e1"} opacity={0.6} />
            <XAxis dataKey="date" stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={11} tickLine={false} />
            <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} fontSize={11} tickLine={false} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: darkMode ? '#0f172a' : '#ffffff', 
                borderColor: darkMode ? '#334155' : '#e2e8f0', 
                borderRadius: '12px', 
                color: darkMode ? '#f8fafc' : '#0f172a',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
              }}
              formatter={(val) => [val.toLocaleString(), '']}
            />
            <Area type="monotone" dataKey="views" stroke="#E1306C" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" name="Views" />
            <Area type="monotone" dataKey="reach" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorReach)" name="Reach" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
