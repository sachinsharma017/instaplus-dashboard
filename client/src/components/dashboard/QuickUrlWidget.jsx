import React, { useState } from 'react';
import { 
  Link2, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Sparkles, 
  RefreshCw, 
  ListOrdered, 
  FileSpreadsheet
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { getProxiedImageUrl } from '../../utils/imageProxy';
import { exportBulkUrlsToExcel } from '../../utils/excelExporter';

export default function QuickUrlWidget() {
  const { 
    setActiveTab, 
    loadUrlDataToDashboard, 
    extractedUrl, 
    setExtractedUrl, 
    lastQuickResult, 
    setLastQuickResult,
    updateCustomProfile,
    profileData
  } = useAnalytics();
  
  // Widget mode: 'single' | 'bulk'
  const [widgetMode, setWidgetMode] = useState('single');
  const [loading, setLoading] = useState(false);

  // Bulk State (Up to 100 URLs)
  const [bulkInput, setBulkInput] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkCurrentIndex, setBulkCurrentIndex] = useState(0);
  const [bulkTotalCount, setBulkTotalCount] = useState(0);
  const [bulkResults, setBulkResults] = useState([]);

  // Single Extract Handler
  const handleQuickExtract = async (e) => {
    if (e) e.preventDefault();
    if (!extractedUrl.trim()) return;

    let inputStr = extractedUrl.trim();
    if (!inputStr.startsWith('http://') && !inputStr.startsWith('https://') && inputStr.includes('instagram.com')) {
      inputStr = 'https://' + inputStr;
    }

    setLoading(true);
    setLastQuickResult(null);

    try {
      const savedRapidKey = localStorage.getItem('rapidapi_key') || '';
      const res = await fetch('http://localhost:5000/api/extract-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputStr, rapidApiKey: savedRapidKey })
      });
      const json = await res.json();
      if (json.data) {
        setLastQuickResult(json.data);
        loadUrlDataToDashboard(json.data);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log('API fetch notice:', err.message);
    }

    setLoading(false);
  };

  // LIGHTNING FAST Bulk Extraction Handler (Single Bulk Endpoint Call)
  const handleBulkExtractWidget = async () => {
    if (!bulkInput || !bulkInput.trim()) return;

    const rawLines = bulkInput.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const validUrls = rawLines.filter(line => line.includes('instagram.com/')).slice(0, 100);

    if (validUrls.length === 0) return;

    setBulkLoading(true);
    setBulkResults([]);
    setBulkTotalCount(validUrls.length);
    setBulkCurrentIndex(1);
    setBulkProgress(40);

    try {
      const savedRapidKey = localStorage.getItem('rapidapi_key') || '';
      const res = await fetch('http://localhost:5000/api/extract-url/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: validUrls, rapidApiKey: savedRapidKey })
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setBulkProgress(100);
        setBulkCurrentIndex(validUrls.length);
        setBulkResults(json.data);

        // Auto load metrics into dashboard
        const totalV = json.data.reduce((a, b) => a + (b.views || 0), 0);
        const totalL = json.data.reduce((a, b) => a + (b.likes || 0), 0);
        const totalC = json.data.reduce((a, b) => a + (b.comments || 0), 0);
        const totalSh = json.data.reduce((a, b) => a + (b.shares || 0), 0);
        const totalSa = json.data.reduce((a, b) => a + (b.saves || 0), 0);

        updateCustomProfile({
          customMetrics: {
            totalViews: (profileData.metrics['30d']?.totalViews || 0) + totalV,
            totalLikes: (profileData.metrics['30d']?.totalLikes || 0) + totalL,
            totalComments: (profileData.metrics['30d']?.totalComments || 0) + totalC,
            totalShares: (profileData.metrics['30d']?.totalShares || 0) + totalSh,
            totalSaves: (profileData.metrics['30d']?.totalSaves || 0) + totalSa,
            totalReach: (profileData.metrics['30d']?.totalReach || 0) + Math.floor(totalV * 0.9)
          }
        });
      }
    } catch (err) {
      console.log('Bulk API notice:', err.message);
    } finally {
      setBulkProgress(100);
      setBulkLoading(false);
    }
  };

  return (
    <div className="p-5 rounded-2xl border border-pink-500/30 dark:border-pink-500/40 bg-gradient-to-r from-white via-pink-50/20 to-purple-50/20 dark:from-slate-900 dark:via-purple-950/40 dark:to-slate-900 shadow-xl shadow-pink-500/5 space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-instagram-gradient p-0.5 shadow-md flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              🔗 InstaPlus Automated Reel & Profile Scraper
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 font-mono border border-emerald-500/30 font-bold">
                ⚡ ULTRA-FAST BATCH SCRAPER ACTIVE
              </span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Extract exact Creator Name, Likes, Comments, Followers & Views for 1 to 100 Instagram URLs:
            </p>
          </div>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-1 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700">
            <button
              onClick={() => setWidgetMode('single')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${widgetMode === 'single' ? 'bg-instagram-gradient text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Single Link</span>
            </button>
            <button
              onClick={() => setWidgetMode('bulk')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${widgetMode === 'bulk' ? 'bg-instagram-gradient text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Bulk 100 URLs</span>
            </button>
          </div>

          <button
            onClick={() => setActiveTab('extractor')}
            className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:text-pink-700 flex items-center gap-1 shrink-0 bg-pink-500/10 px-3 py-1.5 rounded-lg border border-pink-500/20 transition hover:bg-pink-500/20"
          >
            <span>Full Extractor Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* MODE 1: SINGLE URL INPUT */}
      {widgetMode === 'single' && (
        <form onSubmit={handleQuickExtract} className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              required
              value={extractedUrl}
              onChange={(e) => setExtractedUrl(e.target.value)}
              placeholder="Paste any Reel URL e.g. https://www.instagram.com/reel/Dbsj2NqIybS/ OR @username"
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono outline-none focus:border-pink-500 transition shadow-inner font-medium"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-instagram-gradient text-white text-xs font-bold shadow-lg shadow-pink-500/25 hover:opacity-95 transition disabled:opacity-50 flex items-center gap-2 shrink-0 btn-3d"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Scraping Live Data...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Auto-Scrape Reel Data</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* MODE 2: BULK 100 URLs INPUT */}
      {widgetMode === 'bulk' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ListOrdered className="w-4 h-4 text-pink-500" />
              Paste Up to 100 Instagram Links (One URL per line):
            </label>
            {bulkInput && (
              <button
                type="button"
                onClick={() => setBulkInput('')}
                className="text-[11px] font-semibold text-rose-500 hover:text-rose-400 transition"
              >
                Clear Links
              </button>
            )}
          </div>

          <textarea
            rows={5}
            value={bulkInput}
            onChange={(e) => setBulkInput(e.target.value)}
            placeholder={`https://www.instagram.com/reel/...\nhttps://www.instagram.com/p/...\n(Paste up to 100 links here, one URL per line)`}
            className="w-full p-3 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono outline-none focus:border-pink-500 transition leading-relaxed custom-scrollbar"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              Detected URLs: <strong className="text-pink-500 font-bold">{bulkInput.split(/\r?\n/).map(l => l.trim()).filter(l => l.includes('instagram.com/')).length}</strong> / 100 Max
            </span>

            <button
              type="button"
              onClick={handleBulkExtractWidget}
              disabled={bulkLoading || !bulkInput.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-instagram-gradient text-white text-xs font-bold shadow-lg shadow-pink-500/25 hover:opacity-95 transition disabled:opacity-50"
            >
              {bulkLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Extracting 100 URLs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Extract All URLs (Instant)</span>
                </>
              )}
            </button>
          </div>

          {/* Bulk Progress Bar */}
          {bulkLoading && (
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-300 font-mono">
                <span>Parallel Batch Engine Active:</span>
                <span className="text-pink-400 font-bold">Processing All {bulkTotalCount} URLs Instant...</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden border border-slate-700 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-300 animate-pulse"
                  style={{ width: `85%` }}
                />
              </div>
            </div>
          )}

          {/* Bulk Results Summary */}
          {bulkResults.length > 0 && !bulkLoading && (
            <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Successfully extracted all {bulkResults.length} Instagram URLs!
                </span>
                <button
                  onClick={() => exportBulkUrlsToExcel(bulkResults)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold hover:bg-emerald-500/30 transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export to Excel (.xlsx)</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-center">
                <div>
                  <small className="text-slate-400 block text-[10px]">Total Views</small>
                  <strong className="text-cyan-400">{bulkResults.reduce((a, b) => a + (b.views || 0), 0).toLocaleString()}</strong>
                </div>
                <div>
                  <small className="text-slate-400 block text-[10px]">Total Likes</small>
                  <strong className="text-rose-400">{bulkResults.reduce((a, b) => a + (b.likes || 0), 0).toLocaleString()}</strong>
                </div>
                <div>
                  <small className="text-slate-400 block text-[10px]">Total Comments</small>
                  <strong className="text-purple-400">{bulkResults.reduce((a, b) => a + (b.comments || 0), 0).toLocaleString()}</strong>
                </div>
                <div>
                  <small className="text-slate-400 block text-[10px]">Avg ER %</small>
                  <strong className="text-emerald-400">{(bulkResults.reduce((a, b) => a + (b.engagementRate || 0), 0) / bulkResults.length).toFixed(2)}%</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Single Extract Applied Result Card */}
      {widgetMode === 'single' && lastQuickResult && lastQuickResult.isPrivate ? (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-800 dark:text-amber-200 text-xs space-y-1 animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-700 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Private Account / Restricted Share Link</span>
          </div>
          <p className="leading-relaxed font-medium">
            {lastQuickResult.error || "This Reel URL is from a Private Account or a direct DM share link."}
          </p>
        </div>
      ) : widgetMode === 'single' && lastQuickResult && (
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/40 space-y-3 animate-fadeIn shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {lastQuickResult.avatar ? (
                <img 
                  src={getProxiedImageUrl(lastQuickResult.avatar, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250')} 
                  referrerPolicy="no-referrer"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'; }}
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border-2 border-pink-500 object-cover shadow-md" 
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-instagram-gradient flex items-center justify-center font-bold text-white text-xs shadow-md">
                  {lastQuickResult.authorName?.charAt(0)}
                </div>
              )}
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5">
                  {lastQuickResult.authorName}
                  <span className="font-mono text-pink-600 dark:text-pink-400 text-xs">({lastQuickResult.authorHandle})</span>
                </span>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lastQuickResult.fetchSource || '🟢 Playwright Automated Scraper'}</span>
                </p>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[10px] font-medium">Followers:</span>
              <span className="text-slate-900 dark:text-slate-100 font-extrabold text-sm">{(lastQuickResult.followers || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-50 dark:bg-slate-950/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block font-medium">Followers:</span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">{(lastQuickResult.followers || 0).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-cyan-600 dark:text-cyan-400 text-[10px] font-bold block">Reel Views (Exact):</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold text-sm block">{(lastQuickResult.views || 0).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-rose-600 dark:text-rose-400 text-[10px] font-bold block">Reel Likes (Exact):</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold text-sm">{(lastQuickResult.likes || 0).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-purple-600 dark:text-purple-400 text-[10px] font-bold block">Reel Comments (Exact):</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">{(lastQuickResult.comments || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
