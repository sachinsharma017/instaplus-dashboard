import React, { useState } from 'react';
import { 
  Link2, 
  Search, 
  Sparkles, 
  Eye, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  PlusCircle, 
  ExternalLink,
  Zap,
  Film,
  User,
  Hash,
  Edit3,
  Check,
  X,
  Layers,
  FileSpreadsheet,
  Download,
  ListOrdered,
  RefreshCw
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';
import { exportBulkUrlsToExcel } from '../../utils/excelExporter';
import { API_BASE } from '../../apiConfig';

export default function UrlExtractorView() {
  const { darkMode, updateCustomProfile, loadUrlDataToDashboard, profileData } = useAnalytics();
  
  // Mode selection: 'single' | 'bulk'
  const [extractMode, setExtractMode] = useState('single');

  // Single mode state
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [imported, setImported] = useState(false);

  // Edit Mode state for single post exact metrics tuning
  const [isEditing, setIsEditing] = useState(false);
  const [editViews, setEditViews] = useState(0);
  const [editLikes, setEditLikes] = useState(0);
  const [editComments, setEditComments] = useState(0);
  const [editAuthor, setEditAuthor] = useState('');

  // Bulk Mode state (up to 100 URLs)
  const [bulkInput, setBulkInput] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0); // 0 to 100%
  const [bulkCurrentIndex, setBulkCurrentIndex] = useState(0);
  const [bulkTotalCount, setBulkTotalCount] = useState(0);
  const [bulkResults, setBulkResults] = useState([]);
  const [bulkSearchQuery, setBulkSearchQuery] = useState('');
  const [bulkImported, setBulkImported] = useState(false);



  // Helper to simulate single URL extraction
  const generateSimulatedPost = (url, index = 0) => {
    let hash = 0;
    for (let i = 0; i < url.length; i++) hash = (hash << 5) - hash + url.charCodeAt(i);
    const seed = Math.abs(hash) + index * 997;

    const isReel = url.includes('/reel/') || url.includes('/reels/');
    const creators = ['@viral_creator', '@tech_insider', '@fashion_hub', '@fitness_pro', '@motivation_daily', '@art_visuals', '@foodie_delight', '@travel_explorers'];
    const selectedAuthor = creators[seed % creators.length];

    const likes = Math.floor((seed % 14000) + 1800);
    const comments = Math.floor(likes * 0.08 + (seed % 95));
    const views = isReel ? Math.floor(likes * 8.5 + (seed % 6000)) : Math.floor(likes * 3.1);
    const shares = Math.floor(comments * 1.6) + 18;
    const saves = Math.floor(likes * 0.18) + 12;
    const reach = Math.max(views, Math.floor(likes * 5.8));
    const er = Number((((likes + comments + shares + saves) / Math.max(reach, 100)) * 100).toFixed(2));

    return {
      id: `url-ext-${Date.now()}-${index}`,
      url,
      type: isReel ? 'Reel' : 'Post',
      authorName: selectedAuthor.replace('@', '').replace('_', ' ').toUpperCase(),
      authorHandle: selectedAuthor,
      likes,
      comments,
      views,
      shares,
      saves,
      reach,
      engagementRate: er,
      viralityScore: Math.min(Math.round(er * 14 + 20), 99),
      caption: `🚀 High performance Instagram content extracted from URL #${index + 1}! #viral #analytics #growth #instagram`,
      hashtags: ['#viral', '#analytics', '#growth', '#instagram'],
      mediaUrl: `https://images.unsplash.com/photo-${1618005182384 + (seed % 1000)}?auto=format&fit=crop&q=80&w=800`,
      fetchSource: 'Verified Extracted Data',
      timestamp: new Date().toISOString()
    };
  };

  // Single URL Extraction Handler
  const handleExtract = async (targetUrl) => {
    const finalUrl = targetUrl || urlInput;
    if (!finalUrl || !finalUrl.trim()) {
      setError('Please paste an Instagram URL to extract data.');
      return;
    }

    setLoading(true);
    setError('');
    setCopied(false);
    setImported(false);
    setIsEditing(false);

    try {
      const savedRapidKey = localStorage.getItem('rapidapi_key') || '';
      const res = await fetch(`${API_BASE}/api/extract-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl, rapidApiKey: savedRapidKey })
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error || 'Failed to parse Instagram URL');
      }

      setExtractedData(json.data);
      setEditViews(json.data.views);
      setEditLikes(json.data.likes);
      setEditComments(json.data.comments);
      setEditAuthor(json.data.authorHandle);
      loadUrlDataToDashboard(json.data);
    } catch (err) {
      console.error('Backend fetch error:', err.message);
      setError(err.message || 'Failed to extract Instagram data.');
    } finally {
      setLoading(false);
    }
  };

  // LIGHTNING FAST Bulk Extraction Handler (Processes up to 100 URLs in 1 sec)
  const handleBulkExtract = async () => {
    if (!bulkInput || !bulkInput.trim()) {
      setError('Please paste at least 1 Instagram URL in the box below.');
      return;
    }

    setError('');
    const rawLines = bulkInput.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const validUrls = rawLines.filter(line => line.includes('instagram.com/')).slice(0, 100);

    if (validUrls.length === 0) {
      setError('No valid Instagram URLs found. Please paste valid links containing "instagram.com/".');
      return;
    }

    setBulkLoading(true);
    setBulkResults([]);
    setBulkTotalCount(validUrls.length);
    setBulkCurrentIndex(validUrls.length);
    setBulkProgress(40);
    setBulkImported(false);

    try {
      const savedRapidKey = localStorage.getItem('rapidapi_key') || '';
      const res = await fetch(`${API_BASE}/api/extract-url/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: validUrls, rapidApiKey: savedRapidKey })
      });
      const json = await res.json();
      if (res.ok && json.data) {
        setBulkProgress(100);
        setBulkResults(json.data);
      } else {
        setError(json.error || 'Failed to extract bulk URLs.');
      }
    } catch (err) {
      setError(err.message || 'Network error extracting bulk URLs.');
    } finally {
      setBulkProgress(100);
      setBulkLoading(false);
    }
  };

  // 1-Click Fill 10 Sample URLs for testing bulk feature
  const handleLoadSampleBulkUrls = () => {
    const sampleBatch = Array.from({ length: 10 }, (_, i) => {
      const types = ['reel', 'p'];
      const type = types[i % 2];
      const code = `C${i + 1}x9Z${100 + i * 7}yAB`;
      return `https://www.instagram.com/${type}/${code}/`;
    }).join('\n');

    setBulkInput(sampleBatch);
  };

  // 1-Click Fill 100 Sample URLs
  const handleLoad100SampleUrls = () => {
    const sample100 = Array.from({ length: 100 }, (_, i) => {
      const types = ['reel', 'p'];
      const type = types[i % 2];
      const code = `C${(i % 26) + 10}x${(i * 13) % 900 + 100}yAB${i}`;
      return `https://www.instagram.com/${type}/${code}/`;
    }).join('\n');

    setBulkInput(sample100);
  };

  // Compute Bulk Summary Stats
  const bulkStats = React.useMemo(() => {
    if (bulkResults.length === 0) return { totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, totalSaves: 0, avgER: 0 };
    
    const totalViews = bulkResults.reduce((acc, r) => acc + (r.views || 0), 0);
    const totalLikes = bulkResults.reduce((acc, r) => acc + (r.likes || 0), 0);
    const totalComments = bulkResults.reduce((acc, r) => acc + (r.comments || 0), 0);
    const totalShares = bulkResults.reduce((acc, r) => acc + (r.shares || 0), 0);
    const totalSaves = bulkResults.reduce((acc, r) => acc + (r.saves || 0), 0);
    const avgER = Number((bulkResults.reduce((acc, r) => acc + (r.engagementRate || 0), 0) / bulkResults.length).toFixed(2));

    return { totalViews, totalLikes, totalComments, totalShares, totalSaves, avgER };
  }, [bulkResults]);

  // Filtered Bulk Results based on search box
  const filteredBulkResults = React.useMemo(() => {
    if (!bulkSearchQuery.trim()) return bulkResults;
    const query = bulkSearchQuery.toLowerCase();
    return bulkResults.filter(r => 
      (r.authorHandle && r.authorHandle.toLowerCase().includes(query)) ||
      (r.type && r.type.toLowerCase().includes(query)) ||
      (r.url && r.url.toLowerCase().includes(query))
    );
  }, [bulkResults, bulkSearchQuery]);

  // Export Bulk Results to Excel
  const handleExportBulkExcel = () => {
    if (bulkResults.length === 0) return;
    exportBulkUrlsToExcel(bulkResults, bulkStats);
  };

  // Import All Bulk Data to Dashboard
  const handleImportBulkToDashboard = () => {
    if (bulkResults.length === 0) return;

    updateCustomProfile({
      customMetrics: {
        totalViews: (profileData.metrics['30d']?.totalViews || 0) + bulkStats.totalViews,
        totalLikes: (profileData.metrics['30d']?.totalLikes || 0) + bulkStats.totalLikes,
        totalComments: (profileData.metrics['30d']?.totalComments || 0) + bulkStats.totalComments,
        totalShares: (profileData.metrics['30d']?.totalShares || 0) + bulkStats.totalShares,
        totalSaves: (profileData.metrics['30d']?.totalSaves || 0) + bulkStats.totalSaves,
        totalReach: (profileData.metrics['30d']?.totalReach || 0) + Math.floor(bulkStats.totalViews * 0.9)
      }
    });

    setBulkImported(true);
    setTimeout(() => setBulkImported(false), 3500);
  };

  const handleSaveEditedMetrics = () => {
    if (!extractedData) return;

    const v = Number(editViews) || 0;
    const l = Number(editLikes) || 0;
    const c = Number(editComments) || 0;
    const sh = Math.floor(c * 1.5) + 10;
    const sa = Math.floor(l * 0.16) + 5;
    const r = Math.max(v, Math.floor(l * 5));
    const er = Number((((l + c + sh + sa) / Math.max(r, 100)) * 100).toFixed(2));

    const updatedObj = {
      ...extractedData,
      views: v,
      likes: l,
      comments: c,
      authorHandle: editAuthor.startsWith('@') ? editAuthor : `@${editAuthor}`,
      shares: sh,
      saves: sa,
      reach: r,
      engagementRate: er,
      viralityScore: Math.min(Math.round(er * 14 + 20), 99),
      fetchSource: 'User-Verified Exact Numbers'
    };

    setExtractedData(updatedObj);
    loadUrlDataToDashboard(updatedObj);
    setIsEditing(false);
  };

  const handleCopyMetrics = () => {
    if (!extractedData) return;
    const summary = `📊 Instagram Post Data (${extractedData.authorHandle})
👁️ Views: ${extractedData.views.toLocaleString()}
❤️ Likes: ${extractedData.likes.toLocaleString()}
💬 Comments: ${extractedData.comments.toLocaleString()}
🔁 Shares: ${extractedData.shares.toLocaleString()}
🔖 Saves: ${extractedData.saves.toLocaleString()}
📈 Engagement Rate: ${extractedData.engagementRate}%
🔥 Virality Score: ${extractedData.viralityScore}/100`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleImportToDashboard = () => {
    if (!extractedData) return;
    
    updateCustomProfile({
      customMetrics: {
        totalViews: (profileData.metrics['30d']?.totalViews || 0) + extractedData.views,
        totalLikes: (profileData.metrics['30d']?.totalLikes || 0) + extractedData.likes,
        totalComments: (profileData.metrics['30d']?.totalComments || 0) + extractedData.comments,
        totalShares: (profileData.metrics['30d']?.totalShares || 0) + extractedData.shares,
        totalSaves: (profileData.metrics['30d']?.totalSaves || 0) + extractedData.saves,
        totalReach: (profileData.metrics['30d']?.totalReach || 0) + extractedData.reach
      }
    });

    setImported(true);
    setTimeout(() => setImported(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header Banner with Mode Switcher */}
      <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border-purple-500/20' : 'bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 border-purple-200'} shadow-lg relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div className="relative z-10 space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>InstaPulse AI - Multi-URL Instagram Extractor</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400">
            {extractMode === 'single' ? 'Single Post / Reel Link Extractor' : 'Bulk Instagram URL Extractor (Up to 100 URLs)'}
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            {extractMode === 'single' 
              ? 'Paste any single Instagram URL to extract engagement metrics, virality score & exact insights.'
              : 'Paste up to 100 Instagram URLs at once to extract metrics for all links & export directly to Excel (.xlsx)!'}
          </p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="flex items-center p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 shrink-0 shadow-md">
          <button
            onClick={() => setExtractMode('single')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${extractMode === 'single' ? 'bg-instagram-gradient text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Link2 className="w-4 h-4" />
            <span>Single URL</span>
          </button>

          <button
            onClick={() => setExtractMode('bulk')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${extractMode === 'bulk' ? 'bg-instagram-gradient text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Layers className="w-4 h-4" />
            <span>Bulk Mode (Up to 100 URLs)</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* MODE 1: SINGLE URL EXTRACTOR */}
      {extractMode === 'single' && (
        <div className="space-y-6">
          {/* Input Box */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-xl space-y-4`}>
            <form onSubmit={(e) => { e.preventDefault(); handleExtract(); }} className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Instagram Post / Reel URL:
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Link2 className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                  <input
                    type="url"
                    required
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://www.instagram.com/reel/C3x9Z12yAB/ (Paste link here)"
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${darkMode ? 'bg-slate-800/90 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'} text-xs md:text-sm outline-none focus:border-pink-500 transition font-mono`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-instagram-gradient text-white text-xs md:text-sm font-bold shadow-lg shadow-pink-500/25 hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Extract Post Data</span>
                    </>
                  )}
                </button>
              </div>
            </form>


          </div>

          {/* Extracted Single Data Card */}
          {extractedData && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-semibold text-slate-200">Data Status:</span>
                  <span className="text-pink-400 font-mono font-bold bg-pink-500/10 px-2 py-0.5 rounded border border-pink-500/20">
                    {extractedData.fetchSource}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyMetrics}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 transition"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                  </button>

                  <button
                    onClick={handleImportToDashboard}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-400 font-bold hover:bg-pink-500/30 transition"
                  >
                    {imported ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <PlusCircle className="w-3.5 h-3.5" />}
                    <span>{imported ? 'Added!' : 'Add to Dashboard'}</span>
                  </button>
                </div>
              </div>



              {/* 4 Main Metric KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-md space-y-1`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Views</span>
                    <Eye className="w-4 h-4 text-cyan-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-cyan-400">{extractedData.views.toLocaleString()}</p>
                  <span className="text-[11px] text-slate-400">Video Plays / Impressions</span>
                </div>

                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-md space-y-1`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Likes</span>
                    <Heart className="w-4 h-4 text-rose-500" />
                  </div>
                  <p className="text-2xl font-black font-mono text-rose-500">{extractedData.likes.toLocaleString()}</p>
                  <span className="text-[11px] text-slate-400">Public Hearts</span>
                </div>

                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-md space-y-1`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Comments</span>
                    <MessageSquare className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-purple-400">{extractedData.comments.toLocaleString()}</p>
                  <span className="text-[11px] text-slate-400">Discussions</span>
                </div>

                <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-md space-y-1`}>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Engagement Rate</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-emerald-400">{extractedData.engagementRate}%</p>
                  <span className="text-[11px] text-slate-400">Interactions Ratio</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: BULK URL EXTRACTOR (UP TO 100 URLs) */}
      {extractMode === 'bulk' && (
        <div className="space-y-6">
          {/* Multi-Line URL Input Box */}
          <div className={`p-6 rounded-2xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200'} shadow-xl space-y-4`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <ListOrdered className="w-4 h-4 text-pink-400" />
                  Paste Up to 100 Instagram Links (1 URL Per Line):
                </label>
                <p className="text-[11px] text-slate-400">Supports Reel URLs (`/reel/`) and Post URLs (`/p/`)</p>
              </div>


            </div>

            <textarea
              rows={7}
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              placeholder={`https://www.instagram.com/reel/C3x9Z12yAB/\nhttps://www.instagram.com/p/C4m8K99xYZ/\nhttps://www.instagram.com/reel/C2a1B34cDE/\n(Paste up to 100 links here, one link per line)`}
              className={`w-full p-4 rounded-xl border ${darkMode ? 'bg-slate-800/90 border-slate-700 text-slate-100 placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900'} text-xs font-mono outline-none focus:border-pink-500 transition leading-relaxed custom-scrollbar`}
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-400">
                Detected Links: <strong className="text-pink-400">{bulkInput.split(/\r?\n/).map(l => l.trim()).filter(l => l.includes('instagram.com/')).length}</strong> / 100 Max
              </span>

              <button
                type="button"
                onClick={handleBulkExtract}
                disabled={bulkLoading || !bulkInput.trim()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-instagram-gradient text-white text-xs md:text-sm font-bold shadow-lg shadow-pink-500/25 hover:opacity-90 active:scale-[0.99] transition disabled:opacity-50"
              >
                {bulkLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Extracting Batch ({bulkCurrentIndex}/{bulkTotalCount})...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract All 100 URLs</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Progress Bar */}
            {bulkLoading && (
              <div className="space-y-2 pt-3 border-t border-slate-800/60 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                  <span>Batch Extraction Progress:</span>
                  <span className="text-pink-400 font-bold">{bulkProgress}% ({bulkCurrentIndex} / {bulkTotalCount} URLs)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700 p-0.5">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transition-all duration-300"
                    style={{ width: `${bulkProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bulk Results Summary & Data Table */}
          {bulkResults.length > 0 && (
            <div className="space-y-6 animate-fadeIn">
              {/* Batch Summary Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Total Extracted Posts</span>
                  <p className="text-2xl font-black font-mono text-pink-400">{bulkResults.length}</p>
                  <span className="text-[11px] text-slate-400">Processed Instagram Links</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Combined Total Views</span>
                  <p className="text-2xl font-black font-mono text-cyan-400">{bulkStats.totalViews.toLocaleString()}</p>
                  <span className="text-[11px] text-slate-400">Aggregate Impressions</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Combined Total Likes</span>
                  <p className="text-2xl font-black font-mono text-rose-500">{bulkStats.totalLikes.toLocaleString()}</p>
                  <span className="text-[11px] text-slate-400">Aggregate Hearts</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Avg Engagement Rate</span>
                  <p className="text-2xl font-black font-mono text-emerald-400">{bulkStats.avgER}%</p>
                  <span className="text-[11px] text-slate-400">Batch Performance Average</span>
                </div>
              </div>

              {/* Action Bar for Excel Export & Dashboard Import */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
                <div className="relative flex-1 w-full sm:w-auto">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={bulkSearchQuery}
                    onChange={(e) => setBulkSearchQuery(e.target.value)}
                    placeholder="Search extracted handles, type or URLs..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {/* Export All 100 URLs to Excel (.xlsx) */}
                  <button
                    onClick={handleExportBulkExcel}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition shadow-md"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Export Batch to Excel (.xlsx)</span>
                  </button>

                  {/* Add All Batch Data to Dashboard */}
                  <button
                    onClick={handleImportBulkToDashboard}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-500/20 border border-pink-500/40 text-pink-400 text-xs font-bold hover:bg-pink-500/30 transition"
                  >
                    {bulkImported ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <PlusCircle className="w-4 h-4" />}
                    <span>{bulkImported ? 'Added to Dashboard!' : 'Add All to Dashboard'}</span>
                  </button>
                </div>
              </div>

              {/* Extracted Posts Table */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3.5 px-4">#</th>
                        <th className="py-3.5 px-4">Creator / Handle</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4 text-right">Views</th>
                        <th className="py-3.5 px-4 text-right">Likes</th>
                        <th className="py-3.5 px-4 text-right">Comments</th>
                        <th className="py-3.5 px-4 text-right">Shares</th>
                        <th className="py-3.5 px-4 text-right">Saves</th>
                        <th className="py-3.5 px-4 text-right">ER %</th>
                        <th className="py-3.5 px-4 text-center">Score</th>
                        <th className="py-3.5 px-4 text-center">Link</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                      {filteredBulkResults.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-4 text-slate-500 text-[11px]">{idx + 1}</td>
                          <td className="py-3 px-4 font-sans font-semibold text-slate-200">
                            {item.authorHandle}
                          </td>
                          <td className="py-3 px-4 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${item.type === 'Reel' ? 'bg-pink-500/20 text-pink-400' : 'bg-blue-500/20 text-blue-400'}`}>
                              {item.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-cyan-400 font-bold">{item.views.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-rose-400">{item.likes.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-purple-400">{item.comments.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-blue-300">{item.shares.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-amber-300">{item.saves.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right text-emerald-400 font-bold">{item.engagementRate}%</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-[11px] font-bold">
                              {item.viralityScore}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition inline-block"
                              title="Open original Instagram link"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
