import React from 'react';
import { AnalyticsProvider, useAnalytics } from './context/AnalyticsContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Components
import MetricCard from './components/dashboard/MetricCard';
import HighlightCard from './components/dashboard/HighlightCard';
import InsightsBanner from './components/dashboard/InsightsBanner';
import OverviewChart from './components/charts/OverviewChart';
import EngagementChart from './components/charts/EngagementChart';
import FollowersChart from './components/charts/FollowersChart';
import HeatmapChart from './components/charts/HeatmapChart';
import ContentTable from './components/content/ContentTable';
import BestContentGrid from './components/content/BestContentGrid';
import AudienceView from './components/audience/AudienceView';
import CompetitorTable from './components/competitors/CompetitorTable';
import AssistantChat from './components/ai/AssistantChat';
import ContentIdeas from './components/ideas/ContentIdeas';
import ReportView from './components/reports/ReportView';
import SettingsView from './components/settings/SettingsView';
import UrlExtractorView from './components/extractor/UrlExtractorView';
import QuickUrlWidget from './components/dashboard/QuickUrlWidget';

// Icons
import { 
  Users, 
  TrendingUp, 
  Eye, 
  Target, 
  Heart, 
  MessageSquare, 
  Share2, 
  Bookmark, 
  Percent, 
  MousePointerClick, 
  Link, 
  Film 
} from 'lucide-react';

function DashboardContent() {
  const { activeTab, metrics, highlights, profileData, darkMode } = useAnalytics();

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div id="main-scroll-container" className={`flex-1 overflow-y-auto ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-slate-100 via-white to-pink-50/30 text-slate-900'} p-6 transition-colors duration-300`}>
      {/* 1. Main Dashboard View */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Insights Banner */}
          <InsightsBanner />

          {/* Quick URL Extractor Bar */}
          <QuickUrlWidget />

          {/* 12 Core KPI Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Total Followers" 
              value={profileData.totalFollowers} 
              growth={metrics.followersGrowthPct} 
              icon={Users} 
              tooltip="Total account followers count"
            />
            <MetricCard 
              title="Followers Growth" 
              value={metrics.followersGrowth} 
              growth={metrics.followersGrowthPct} 
              icon={TrendingUp} 
              tooltip="Net new followers gained in selected period"
            />
            <MetricCard 
              title="Total Views" 
              value={metrics.totalViews} 
              growth={metrics.totalViewsGrowthPct} 
              icon={Eye} 
              tooltip="Total impression views across all posts & reels"
            />
            <MetricCard 
              title="Total Reach" 
              value={metrics.totalReach} 
              growth={metrics.totalReachGrowthPct} 
              icon={Target} 
              tooltip="Unique Instagram accounts reached"
            />
            <MetricCard 
              title="Total Likes" 
              value={metrics.totalLikes} 
              growth={metrics.totalLikesGrowthPct} 
              icon={Heart} 
              tooltip="Aggregate likes received across content"
            />
            <MetricCard 
              title="Total Comments" 
              value={metrics.totalComments} 
              growth={metrics.totalCommentsGrowthPct} 
              icon={MessageSquare} 
              tooltip="Aggregate comments posted by audience"
            />
            <MetricCard 
              title="Total Shares" 
              value={metrics.totalShares} 
              growth={metrics.totalSharesGrowthPct} 
              icon={Share2} 
              tooltip="Direct message & story shares count"
            />
            <MetricCard 
              title="Total Saves" 
              value={metrics.totalSaves} 
              growth={metrics.totalSavesGrowthPct} 
              icon={Bookmark} 
              tooltip="Post saves & bookmarks count"
            />
            <MetricCard 
              title="Engagement Rate" 
              value={metrics.engagementRate} 
              growth={metrics.engagementRateGrowthPct} 
              icon={Percent} 
              isPct={true}
              tooltip="(Likes + Comments + Shares + Saves) / Total Reach * 100"
            />
            <MetricCard 
              title="Profile Visits" 
              value={metrics.profileVisits} 
              growth={metrics.profileVisitsGrowthPct} 
              icon={MousePointerClick} 
              tooltip="Profile page visits from content impressions"
            />
            <MetricCard 
              title="Website Link Clicks" 
              value={metrics.websiteClicks} 
              growth={metrics.websiteClicksGrowthPct} 
              icon={Link} 
              tooltip="External bio link & CTA website clickthroughs"
            />
            <MetricCard 
              title="Best Content Format" 
              value={profileData.topContentType} 
              growth={14.2} 
              icon={Film} 
              formatNumber={false}
              tooltip="Content format yielding highest average reach"
            />
          </div>

          {/* Hero Spotlight Cards: Top Reel & Top Post */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <HighlightCard 
              title="Top Performing Reel Spotlight" 
              badge="Highest Virality" 
              post={highlights.bestReel} 
              type="reel"
            />
            <HighlightCard 
              title="Top Performing Carousel Spotlight" 
              badge="Highest Save Intent" 
              post={highlights.bestCarousel} 
              type="carousel"
            />
          </div>

          {/* Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <OverviewChart />
            <EngagementChart />
          </div>
        </div>
      )}

      {/* URL Extractor View */}
      {activeTab === 'extractor' && (
        <UrlExtractorView />
      )}

      {/* 2. Analytics View */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <OverviewChart />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <EngagementChart />
            <FollowersChart />
          </div>
        </div>
      )}

      {/* 3. Content Performance View */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <BestContentGrid />
          <ContentTable />
        </div>
      )}

      {/* 4. Audience & Timing View */}
      {activeTab === 'audience' && (
        <AudienceView />
      )}

      {/* 5. Competitors View */}
      {activeTab === 'competitors' && (
        <CompetitorTable />
      )}

      {/* 6. AI Assistant View */}
      {activeTab === 'ai' && (
        <AssistantChat />
      )}

      {/* 7. Content Ideas View */}
      {activeTab === 'ideas' && (
        <ContentIdeas />
      )}

      {/* 8. Reports View */}
      {activeTab === 'reports' && (
        <ReportView />
      )}

      {/* 9. Settings View */}
      {activeTab === 'settings' && (
        <SettingsView />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AnalyticsProvider>
      <div className="flex h-screen overflow-hidden font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <DashboardContent />
        </div>
      </div>
    </AnalyticsProvider>
  );
}
