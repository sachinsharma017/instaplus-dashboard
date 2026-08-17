import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { MapPin, Users, Globe } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export default function Demographics() {
  const { audience } = useAnalytics();

  const ageData = audience?.age || [
    { label: '18-24', pct: 45.2 },
    { label: '25-34', pct: 38.1 },
    { label: '35-44', pct: 11.5 },
    { label: '45+', pct: 5.2 }
  ];

  const genderData = audience?.gender || [
    { label: 'Female', pct: 54 },
    { label: 'Male', pct: 43 },
    { label: 'Other', pct: 3 }
  ];

  const locationData = audience?.topLocations || audience?.locations || [
    { city: 'Mumbai', pct: 28 },
    { city: 'Delhi', pct: 22 },
    { city: 'Bengaluru', pct: 15 }
  ];

  const GENDER_COLORS = ['#E1306C', '#38bdf8', '#a855f7'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Age Distribution */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 mb-1">Age Distribution</h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mb-4">Followers broken down by age groups</p>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <XAxis dataKey="label" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(val) => `${val}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(val) => [`${val}%`, 'Share']}
              />
              <Bar dataKey="pct" fill="#E1306C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gender Breakdown */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl flex flex-col justify-between border border-slate-800 bg-slate-900/80">
        <div>
          <h3 className="font-bold text-sm text-slate-100 mb-1">Gender Split</h3>
          <p className="text-xs text-slate-400 mb-4">Audience gender ratio</p>

          <div className="h-40 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={genderData} 
                  dataKey="pct" 
                  nameKey="label" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={45}
                  outerRadius={65} 
                  paddingAngle={5}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  formatter={(val) => [`${val}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex justify-around text-center pt-2 border-t border-slate-800 text-xs">
          {genderData.map((g, idx) => (
            <div key={g.label}>
              <span className="text-slate-400 block text-[11px]">{g.label}</span>
              <span className="font-bold font-mono text-slate-100" style={{ color: GENDER_COLORS[idx % GENDER_COLORS.length] }}>{g.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Locations */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl border border-slate-800 bg-slate-900/80">
        <h3 className="font-bold text-sm text-slate-100 mb-1 flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400" />
          Top Audience Locations
        </h3>
        <p className="text-xs text-slate-400 mb-4">Highest follower concentration by city</p>

        <div className="space-y-3">
          {locationData.map((loc, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-200 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-pink-400" />
                  {loc.city}
                </span>
                <span className="text-pink-400 font-mono">{loc.pct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-instagram-gradient rounded-full" style={{ width: `${loc.pct * 3}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
