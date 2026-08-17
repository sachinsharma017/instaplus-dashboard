import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { useAnalytics } from '../../context/AnalyticsContext';

export default function EngagementChart() {
  const { timeSeries, darkMode } = useAnalytics();

  return (
    <div className="glass-panel rounded-2xl p-5 shadow-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">Engagement Breakdown Over Time</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">Likes, Comments, Shares & Saves distribution</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: darkMode ? '#94a3b8' : '#475569' }} />
            <Bar dataKey="likes" name="Likes" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="saves" name="Saves" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            <Bar dataKey="shares" name="Shares" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="comments" name="Comments" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
