import React, { useRef } from 'react';
import { Download, Printer, FileText, CheckCircle2, Award, Sparkles, TrendingUp, FileSpreadsheet } from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { exportReportToExcel } from '../../utils/excelExporter';

export default function ReportView() {
  const { profileData, metrics, posts, period, highlights, audience } = useAnalytics();
  const reportRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    exportReportToExcel(profileData, metrics, posts, period);
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Post ID,Type,Date,Caption,Views,Likes,Comments,Shares,Saves,Reach,Content Score,Badge\n";
    posts.forEach(p => {
      const cleanCaption = `"${p.caption.replace(/"/g, '""')}"`;
      csvContent += `${p.id},${p.type},${p.date},${cleanCaption},${p.views},${p.likes},${p.comments},${p.shares},${p.saves},${p.reach},${p.score},${p.badge}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${profileData.handle}_instagram_report_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="glass-panel rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print shadow-xl">
        <div>
          <h2 className="font-extrabold text-base text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-pink-400" />
            Executive Marketing Performance Report
          </h2>
          <p className="text-xs text-slate-400">Generate, print or export full multi-section analytical audit report</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export to Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold hover:border-pink-500/40 transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-instagram-gradient text-white text-xs font-bold shadow-lg shadow-pink-500/20 hover:opacity-90 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Executive Report Container */}
      <div ref={reportRef} className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-8 shadow-2xl text-slate-200">
        {/* Report Header */}
        <div className="border-b border-slate-800 pb-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black text-white tracking-tight">InstaPulse AI</span>
              <span className="px-2 py-0.5 rounded text-xs bg-pink-500/20 text-pink-400 font-bold border border-pink-500/30">AUDIT REPORT</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100">{profileData.name} ({profileData.handle})</h1>
            <p className="text-xs text-slate-400">Category: {profileData.category} • Period Analyzed: Last {period}</p>
          </div>

          <div className="text-right text-xs font-mono text-slate-400">
            <div>Report Date: {new Date().toLocaleDateString()}</div>
            <div>Status: <span className="text-emerald-400 font-semibold">Verified Executive Audit</span></div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-pink-400 border-b border-slate-800 pb-1">
            1. Executive Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-300">
            During the analyzed <strong>{period}</strong> timeframe, <strong>{profileData.name}</strong> achieved a total account reach of <strong>{metrics.totalReach.toLocaleString()}</strong> unique accounts with an overall <strong>Engagement Rate of {metrics.engagementRate}%</strong>. Video content (specifically <strong>{profileData.topContentType}</strong>) drove 64.2% of total reach and 72% of saves.
          </p>
        </section>

        {/* Section 2: KPI Summary */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-pink-400 border-b border-slate-800 pb-1">
            2. Key Performance Indicators (KPIs)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">Total Followers</span>
              <strong className="text-base font-mono text-white">{profileData.totalFollowers.toLocaleString()}</strong>
              <span className="text-[10px] text-emerald-400 block">+{metrics.followersGrowthPct}% growth</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">Total Reach</span>
              <strong className="text-base font-mono text-white">{metrics.totalReach.toLocaleString()}</strong>
              <span className="text-[10px] text-emerald-400 block">+{metrics.totalReachGrowthPct}% vs prior</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">Engagement Rate</span>
              <strong className="text-base font-mono text-pink-400">{metrics.engagementRate}%</strong>
              <span className="text-[10px] text-emerald-400 block">Industry benchmark: 3.2%</span>
            </div>
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <span className="text-[11px] text-slate-400 block">Website Clicks</span>
              <strong className="text-base font-mono text-white">{metrics.websiteClicks.toLocaleString()}</strong>
              <span className="text-[10px] text-emerald-400 block">+{metrics.websiteClicksGrowthPct}% growth</span>
            </div>
          </div>
        </section>

        {/* Section 3: Content Performance Highlights */}
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-pink-400 border-b border-slate-800 pb-1">
            3. Best Performing Content
          </h2>
          {highlights.bestReel && (
            <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex gap-4 items-center text-xs">
              <img src={highlights.bestReel.thumbnail} alt="Top Reel" className="w-16 h-20 rounded-lg object-cover" />
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-pink-500/20 text-pink-300 font-mono">
                  {highlights.bestReel.badge} (Score: {highlights.bestReel.score}/100)
                </span>
                <p className="font-semibold text-slate-100 my-1">"{highlights.bestReel.caption}"</p>
                <div className="flex gap-4 font-mono text-slate-400 text-[11px]">
                  <span>Views: {highlights.bestReel.views.toLocaleString()}</span>
                  <span>Saves: {highlights.bestReel.saves.toLocaleString()}</span>
                  <span>Shares: {highlights.bestReel.shares.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Section 4: Strategic Recommendations */}
        <section className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-pink-400 border-b border-slate-800 pb-1">
            4. Strategic Marketing Recommendations & Next Month Plan
          </h2>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Video Focus</strong>: Double down on 15–30 second Reels showcasing fast transformations and problem-solving tips.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Optimal Schedule</strong>: Publish main pillar content on <strong>{audience.bestTime.day} at {audience.bestTime.time}</strong> to maximize initial 1-hour engagement velocity.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Caption CTAs</strong>: Incorporate direct opinion questions at the end of video captions to boost comment volume back above baseline.</span>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
