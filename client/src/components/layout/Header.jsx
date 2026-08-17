import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Calendar, 
  Download, 
  Sun, 
  Moon, 
  Sparkles, 
  Building2,
  Edit3,
  X,
  Check
} from 'lucide-react';
import { useAnalytics } from '../../context/AnalyticsContext';

export default function Header() {
  const { 
    activeTab,
    setActiveTab,
    profileId, 
    setProfileId, 
    period, 
    setPeriod, 
    availableProfiles, 
    darkMode, 
    setDarkMode,
    profileData,
    metrics,
    updateCustomProfile
  } = useAnalytics();

  const [showEditModal, setShowEditModal] = useState(false);
  const [nameInput, setNameInput] = useState(profileData.name);
  const [handleInput, setHandleInput] = useState(profileData.handle);
  const [followersInput, setFollowersInput] = useState(profileData.totalFollowers);
  const [categoryInput, setCategoryInput] = useState(profileData.category);

  // Advanced Metric Inputs
  const [viewsInput, setViewsInput] = useState(metrics.totalViews || 0);
  const [reachInput, setReachInput] = useState(metrics.totalReach || 0);
  const [likesInput, setLikesInput] = useState(metrics.totalLikes || 0);
  const [commentsInput, setCommentsInput] = useState(metrics.totalComments || 0);
  const [sharesInput, setSharesInput] = useState(metrics.totalShares || 0);
  const [savesInput, setSavesInput] = useState(metrics.totalSaves || 0);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const l = Number(likesInput) || 0;
    const c = Number(commentsInput) || 0;
    const sh = Number(sharesInput) || 0;
    const sa = Number(savesInput) || 0;
    const r = Number(reachInput) || 1;

    // Recalculate exact Engagement Rate %
    const calcER = Number((((l + c + sh + sa) / r) * 100).toFixed(2));

    updateCustomProfile({
      name: nameInput,
      handle: handleInput.startsWith('@') ? handleInput : `@${handleInput}`,
      totalFollowers: Number(followersInput) || 0,
      category: categoryInput,
      customMetrics: {
        totalViews: Number(viewsInput) || 0,
        totalReach: r,
        totalLikes: l,
        totalComments: c,
        totalShares: sh,
        totalSaves: sa,
        engagementRate: calcER
      }
    });
    setShowEditModal(false);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 no-print shadow-sm">
      {/* Left: Account Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col justify-center">
          <span className="text-[10px] uppercase tracking-wider font-extrabold text-pink-400 block leading-tight">ACTIVE PROFILE</span>
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1 mt-0.5 shadow-sm">
            <Building2 className="w-3.5 h-3.5 text-pink-500 shrink-0" />
            <span className="text-xs font-extrabold text-slate-100 truncate max-w-[200px] sm:max-w-[300px]">
              {profileData.name} <span className="font-mono text-slate-400 text-[11px]">({profileData.handle})</span>
            </span>
          </div>
        </div>

        {/* Edit My Account Details Button */}
        <button
          onClick={() => {
            setNameInput(profileData.name);
            setHandleInput(profileData.handle);
            setFollowersInput(profileData.totalFollowers);
            setCategoryInput(profileData.category);
            setViewsInput(metrics.totalViews);
            setReachInput(metrics.totalReach);
            setLikesInput(metrics.totalLikes);
            setCommentsInput(metrics.totalComments);
            setSharesInput(metrics.totalShares);
            setSavesInput(metrics.totalSaves);
            setShowEditModal(true);
          }}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/15 border border-pink-500/30 text-pink-400 text-xs font-bold hover:bg-pink-500/25 transition shadow-sm"
          title="Set your real Instagram account followers, views, likes & metrics"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit My Real Metrics</span>
        </button>
      </div>



      {/* Right: Date Filter, Theme Toggle & Export Action */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Date Range Selector */}
        <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1 text-xs shadow-inner">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 ${
                period === item.id 
                  ? 'bg-slate-700 text-pink-400 shadow-md border border-pink-500/20' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* URL Data Extractor Quick Button */}
        <button
          onClick={() => setActiveTab('extractor')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/30 transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Extract Post URL</span>
        </button>

        {/* Theme Dark/Light Switcher */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-pink-400 transition"
          title="Toggle Light/Dark Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Generate Report Button */}
        <button
          onClick={() => setActiveTab('reports')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-instagram-gradient text-white text-xs font-semibold shadow-md shadow-pink-500/20 hover:opacity-90 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">
          <form 
            onSubmit={handleSaveProfile} 
            className="bg-slate-900 border border-slate-700/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-5 my-auto max-h-[85vh] overflow-y-auto custom-scrollbar text-slate-100"
          >
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-pink-400" />
                Set Your Real Account Metrics & Profile
              </h3>
              <p className="text-xs text-slate-400 mt-1">Apne Instagram profile ke exact followers, views, aur likes daalo:</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Account Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-pink-500"
                    placeholder="e.g. Manisha Sharma"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Instagram Handle</label>
                  <input
                    type="text"
                    required
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono outline-none focus:border-pink-500"
                    placeholder="@manisha_sharma0115"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Total Followers</label>
                  <input
                    type="number"
                    required
                    value={followersInput}
                    onChange={(e) => setFollowersInput(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono outline-none focus:border-pink-500"
                    placeholder="177"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Category</label>
                  <input
                    type="text"
                    required
                    value={categoryInput}
                    onChange={(e) => setCategoryInput(e.target.value)}
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 outline-none focus:border-pink-500"
                    placeholder="Personal Blog / Creator"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <span className="font-bold text-pink-400 text-xs block mb-2.5">Apne Asli Numbers Daalo (Real Metrics):</span>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Total Views</label>
                    <input
                      type="number"
                      value={viewsInput}
                      onChange={(e) => setViewsInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Total Reach</label>
                    <input
                      type="number"
                      value={reachInput}
                      onChange={(e) => setReachInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Total Likes</label>
                    <input
                      type="number"
                      value={likesInput}
                      onChange={(e) => setLikesInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Total Comments</label>
                    <input
                      type="number"
                      value={commentsInput}
                      onChange={(e) => setCommentsInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Total Shares</label>
                    <input
                      type="number"
                      value={sharesInput}
                      onChange={(e) => setSharesInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Total Saves</label>
                    <input
                      type="number"
                      value={savesInput}
                      onChange={(e) => setSavesInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-instagram-gradient text-white text-xs font-bold shadow-md shadow-pink-500/20 hover:opacity-90 transition"
              >
                <Check className="w-4 h-4" />
                <span>Save Real Metrics</span>
              </button>
            </div>
          </form>
        </div>,
        document.body
      )}
    </header>
  );
}
