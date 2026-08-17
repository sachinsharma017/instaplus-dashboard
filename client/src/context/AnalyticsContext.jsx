import React, { createContext, useContext, useState, useEffect } from 'react';
import { PROFILES } from '../data/mockData.js';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '').trim().toLowerCase();
      if (['dashboard', 'extractor', 'analytics', 'content', 'audience', 'competitors', 'ai', 'ideas', 'reports', 'settings'].includes(hash)) {
        return hash;
      }
    }
    return 'dashboard';
  };

  const [activeTab, setActiveTabState] = useState(getInitialTab);

  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    try {
      if (typeof window !== 'undefined') {
        window.location.hash = tab;
      }
    } catch (e) {}
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim().toLowerCase();
      if (hash && ['dashboard', 'extractor', 'analytics', 'content', 'audience', 'competitors', 'ai', 'ideas', 'reports', 'settings'].includes(hash)) {
        setActiveTabState(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  const [profileId, setProfileId] = useState('custom');
  const [period, setPeriod] = useState('30d');
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dynamic profiles state
  const [profiles, setProfiles] = useState(PROFILES);
  const [profileData, setProfileData] = useState(PROFILES.custom);
  const [postsData, setPostsData] = useState([]);
  const [highlights, setHighlights] = useState({});
  const [extractedUrl, setExtractedUrl] = useState('');
  const [lastQuickResult, setLastQuickResult] = useState(null);

  // Sync active profile & period data
  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const currentProfile = profiles[profileId] || profiles.custom;
      setProfileData(currentProfile);

      // Posts processing
      let posts = [...(currentProfile.posts || [])];
      
      const bestReel = posts.filter(p => p.type === 'Reel').sort((a, b) => b.score - a.score)[0] || posts[0];
      const bestPost = posts.filter(p => p.type === 'Image').sort((a, b) => b.score - a.score)[0] || posts[0];
      const bestCarousel = posts.filter(p => p.type === 'Carousel').sort((a, b) => b.score - a.score)[0] || posts[0];
      
      setPostsData(posts);
      setHighlights({
        bestReel,
        bestPost,
        bestCarousel,
        mostLiked: [...posts].sort((a, b) => b.likes - a.likes)[0],
        mostCommented: [...posts].sort((a, b) => b.comments - a.comments)[0],
        mostShared: [...posts].sort((a, b) => b.shares - a.shares)[0],
        mostSaved: [...posts].sort((a, b) => b.saves - a.saves)[0],
        highestReach: [...posts].sort((a, b) => b.reach - a.reach)[0]
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to load analytics dataset");
      setLoading(false);
    }
  }, [profileId, period, profiles]);

  // Function to edit custom profile details & exact metrics
  const updateCustomProfile = (updatedFields) => {
    setProfiles(prev => {
      const existing = prev[profileId] || prev.custom;
      const customMetrics = updatedFields.customMetrics || {};

      const updatedMetrics30d = {
        ...existing.metrics["30d"],
        followers: updatedFields.totalFollowers ?? existing.metrics["30d"].followers,
        totalViews: customMetrics.totalViews ?? existing.metrics["30d"].totalViews,
        totalReach: customMetrics.totalReach ?? existing.metrics["30d"].totalReach,
        totalLikes: customMetrics.totalLikes ?? existing.metrics["30d"].totalLikes,
        totalComments: customMetrics.totalComments ?? existing.metrics["30d"].totalComments,
        totalShares: customMetrics.totalShares ?? existing.metrics["30d"].totalShares,
        totalSaves: customMetrics.totalSaves ?? existing.metrics["30d"].totalSaves,
        engagementRate: customMetrics.engagementRate ?? existing.metrics["30d"].engagementRate
      };

      const updated = {
        ...existing,
        ...updatedFields,
        metrics: {
          ...existing.metrics,
          "7d": updatedMetrics30d,
          "30d": updatedMetrics30d,
          "90d": updatedMetrics30d
        }
      };

      return {
        ...prev,
        [profileId]: updated
      };
    });
  };

  // Function to clear all demo data and set everything to 0
  const clearAllData = () => {
    setProfiles(prev => {
      const existing = prev[profileId] || prev.custom;
      const zeroMetrics = {
        followers: 0,
        followersGrowth: 0,
        followersGrowthPct: 0,
        totalViews: 0,
        totalViewsGrowthPct: 0,
        totalReach: 0,
        totalReachGrowthPct: 0,
        totalLikes: 0,
        totalLikesGrowthPct: 0,
        totalComments: 0,
        totalCommentsGrowthPct: 0,
        totalShares: 0,
        totalSharesGrowthPct: 0,
        totalSaves: 0,
        totalSavesGrowthPct: 0,
        engagementRate: 0,
        engagementRateGrowthPct: 0,
        profileVisits: 0,
        profileVisitsGrowthPct: 0,
        websiteClicks: 0,
        websiteClicksGrowthPct: 0
      };

      const cleared = {
        ...existing,
        totalFollowers: 0,
        followersGrowthPct: 0,
        metrics: {
          "7d": zeroMetrics,
          "30d": zeroMetrics,
          "90d": zeroMetrics
        },
        posts: []
      };

      return {
        ...prev,
        [profileId]: cleared
      };
    });
  };

  // Load scraped URL data to Dashboard & all analytics views dynamically
  const loadUrlDataToDashboard = (data) => {
    if (!data) return;

    if (data.url) setExtractedUrl(data.url);
    setLastQuickResult(data);

    if (data.authorName || data.authorHandle) {
      setProfileData(prev => ({
        ...prev,
        name: data.authorName || prev.name,
        handle: data.authorHandle ? (data.authorHandle.startsWith('@') ? data.authorHandle : `@${data.authorHandle}`) : prev.handle,
        avatar: data.avatar || prev.avatar,
        totalFollowers: Number(data.followers) || prev.totalFollowers
      }));
    }

    const likes = Number(data.likes) || 0;
    const comments = Number(data.comments) || 0;
    const views = Number(data.views) || 0;
    const shares = Number(data.shares) || 0;
    const saves = Number(data.saves) || 0;
    const reach = Number(data.reach) || views || 0;
    const followers = Number(data.followers) || 0;
    const er = Number(data.engagementRate) || 0;

    const updatedMetrics = {
      followers,
      followersGrowth: Math.floor(followers * 0.08),
      followersGrowthPct: 8.5,
      totalViews: views,
      totalViewsGrowthPct: 14.2,
      totalReach: reach,
      totalReachGrowthPct: 11.8,
      totalLikes: likes,
      totalLikesGrowthPct: 9.4,
      totalComments: comments,
      totalCommentsGrowthPct: 12.1,
      totalShares: shares,
      totalSharesGrowthPct: 15.3,
      totalSaves: saves,
      totalSavesGrowthPct: 18.0,
      engagementRate: er,
      engagementRateGrowthPct: 4.2,
      profileVisits: Math.floor(reach * 0.12) + 40,
      profileVisitsGrowthPct: 6.5,
      websiteClicks: Math.floor(reach * 0.03) + 10,
      websiteClicksGrowthPct: 5.1
    };

    // Generate 30-day dynamic time series for charts
    const generatedTimeSeries = Array.from({ length: 30 }, (_, i) => {
      const dayNum = i + 1;
      const progress = dayNum / 30;
      return {
        day: `Day ${dayNum}`,
        date: `2026-08-${dayNum < 10 ? '0' + dayNum : dayNum}`,
        views: Math.floor(views * progress * (0.85 + Math.random() * 0.3)),
        reach: Math.floor(reach * progress * (0.85 + Math.random() * 0.3)),
        likes: Math.floor(likes * progress * (0.85 + Math.random() * 0.3)),
        comments: Math.floor(comments * progress * (0.85 + Math.random() * 0.3)),
        shares: Math.floor(shares * progress * (0.85 + Math.random() * 0.3)),
        saves: Math.floor(saves * progress * (0.85 + Math.random() * 0.3)),
        followers: Math.floor(followers * (0.92 + progress * 0.08))
      };
    });

    const updatedProfileObj = {
      ...(profiles.custom || {}),
      name: data.authorName || 'Instagram Creator',
      handle: data.authorHandle || '@creator',
      avatar: data.avatar || profiles.custom?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      biography: data.biography || '',
      verified: data.isVerified ?? true,
      totalFollowers: followers,
      followingCount: data.following || 74,
      mediaCount: data.postsCount || 3318,
      category: 'Live Instagram Account',
      metrics: {
        '7d': updatedMetrics,
        '30d': updatedMetrics,
        '90d': updatedMetrics
      },
      timeSeries: generatedTimeSeries,
      posts: [
        {
          id: `extracted-${Date.now()}`,
          caption: data.caption || 'Extracted Instagram Content',
          type: data.type || 'Reel',
          mediaUrl: data.mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
          thumbnail: data.mediaUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
          likes,
          comments,
          views,
          shares,
          saves,
          reach,
          engagementRate: er,
          score: data.viralityScore || 95,
          badge: views > 1000000 ? '🔥 Viral' : '⭐ Top Performing',
          date: 'Today'
        },
        ...(profiles.custom?.posts || [])
      ]
    };

    setProfileId('custom');
    setProfileData(updatedProfileObj);

    setProfiles(prev => {
      return {
        ...prev,
        custom: updatedProfileObj
      };
    });
  };

  const currentMetrics = profileData?.metrics?.[period] || profileData?.metrics?.['30d'] || {
    followers: profileData?.totalFollowers || 0,
    followersGrowth: 0,
    followersGrowthPct: 0,
    totalViews: 0,
    totalViewsGrowthPct: 0,
    totalReach: 0,
    totalReachGrowthPct: 0,
    totalLikes: 0,
    totalLikesGrowthPct: 0,
    totalComments: 0,
    totalCommentsGrowthPct: 0,
    totalShares: 0,
    totalSharesGrowthPct: 0,
    totalSaves: 0,
    totalSavesGrowthPct: 0,
    engagementRate: 0,
    engagementRateGrowthPct: 0,
    profileVisits: 0,
    profileVisitsGrowthPct: 0,
    websiteClicks: 0,
    websiteClicksGrowthPct: 0
  };

  const daysCount = period === '7d' ? 7 : period === '90d' ? 90 : 30;

  const baseSeries = profileData?.timeSeries && profileData.timeSeries.length > 0 
    ? profileData.timeSeries 
    : Array.from({ length: 90 }, (_, i) => {
        const dayNum = i + 1;
        const progress = dayNum / 90;
        const v = currentMetrics.totalViews || 0;
        const r = currentMetrics.totalReach || 0;
        return {
          day: `Day ${dayNum}`,
          date: `2026-${(Math.floor(i / 30) + 6).toString().padStart(2, '0')}-${((i % 30) + 1).toString().padStart(2, '0')}`,
          views: Math.floor(v * (0.4 + progress * 0.6) * (0.88 + Math.sin(i) * 0.12)),
          reach: Math.floor(r * (0.4 + progress * 0.6) * (0.88 + Math.cos(i) * 0.12)),
          likes: Math.floor((currentMetrics.totalLikes || 0) * (0.4 + progress * 0.6)),
          comments: Math.floor((currentMetrics.totalComments || 0) * (0.4 + progress * 0.6)),
          shares: Math.floor((currentMetrics.totalShares || 0) * (0.4 + progress * 0.6)),
          saves: Math.floor((currentMetrics.totalSaves || 0) * (0.4 + progress * 0.6)),
          followers: Math.floor((currentMetrics.followers || 0) * (0.9 + progress * 0.1))
        };
      });

  const currentTimeSeries = baseSeries.slice(-daysCount);

  const dynamicCompetitors = [
    {
      name: `${profileData.name} (You)`,
      handle: profileData.handle,
      followers: profileData.totalFollowers || 0,
      growthPct: profileData.followersGrowthPct || 8.5,
      avgLikes: currentMetrics.totalLikes || 0,
      avgComments: currentMetrics.totalComments || 0,
      avgViews: currentMetrics.totalViews || 0,
      erPct: currentMetrics.engagementRate || 0,
      postsPerWeek: 5
    },
    {
      name: 'Top Niche Competitor A',
      handle: '@top_competitor_a',
      followers: Math.floor((profileData.totalFollowers || 100000) * 1.2),
      growthPct: 5.4,
      avgLikes: Math.floor((currentMetrics.totalLikes || 5000) * 1.1),
      avgComments: Math.floor((currentMetrics.totalComments || 100) * 1.2),
      avgViews: Math.floor((currentMetrics.totalViews || 50000) * 1.15),
      erPct: Number(((currentMetrics.engagementRate || 4.2) * 0.95).toFixed(2)),
      postsPerWeek: 4
    },
    {
      name: 'Top Niche Competitor B',
      handle: '@top_competitor_b',
      followers: Math.floor((profileData.totalFollowers || 100000) * 0.85),
      growthPct: 12.1,
      avgLikes: Math.floor((currentMetrics.totalLikes || 5000) * 0.9),
      avgComments: Math.floor((currentMetrics.totalComments || 100) * 0.95),
      avgViews: Math.floor((currentMetrics.totalViews || 50000) * 0.88),
      erPct: Number(((currentMetrics.engagementRate || 4.2) * 1.1).toFixed(2)),
      postsPerWeek: 6
    }
  ];

  const value = {
    activeTab,
    setActiveTab,
    profileId,
    setProfileId,
    period,
    setPeriod,
    isLiveMode,
    setIsLiveMode,
    darkMode,
    setDarkMode,
    loading,
    error,
    profileData,
    metrics: currentMetrics,
    timeSeries: currentTimeSeries,
    competitors: dynamicCompetitors,
    posts: postsData,
    highlights,
    extractedUrl,
    setExtractedUrl,
    lastQuickResult,
    setLastQuickResult,
    audience: profileData?.audience || {
      age: [
        { label: '18-24', pct: 45.2 },
        { label: '25-34', pct: 38.1 },
        { label: '35-44', pct: 11.5 },
        { label: '45+', pct: 5.2 }
      ],
      gender: [
        { label: 'Female', pct: 54 },
        { label: 'Male', pct: 43 },
        { label: 'Other', pct: 3 }
      ],
      bestTime: {
        day: 'Thursday',
        time: '8:00 PM IST',
        peakHour: '8:00 PM'
      },
      topLocations: [
        { city: 'Mumbai', pct: 28 },
        { city: 'Delhi', pct: 22 },
        { city: 'Bengaluru', pct: 15 }
      ]
    },
    availableProfiles: [profileData],
    updateCustomProfile,
    clearAllData,
    loadUrlDataToDashboard
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
