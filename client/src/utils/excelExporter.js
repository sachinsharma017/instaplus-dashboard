import * as XLSX from 'xlsx';

/**
 * Export Executive Audit Report to Excel (.xlsx) workbook
 */
export function exportReportToExcel(profileData, metrics, posts, period = '30d') {
  const workbook = XLSX.utils.book_new();

  // 1. Executive Summary & KPIs Sheet
  const kpiData = [
    ['INSTAPULSE AI - EXECUTIVE INSTAGRAM AUDIT REPORT'],
    ['Account Name', profileData.name || 'Instagram Profile'],
    ['Handle', profileData.handle || '@profile'],
    ['Category', profileData.category || 'Creator'],
    ['Report Date', new Date().toLocaleDateString()],
    ['Period Analyzed', `Last ${period}`],
    [],
    ['KEY PERFORMANCE INDICATORS (KPIs)'],
    ['Metric Name', 'Value', 'Growth / Benchmark'],
    ['Total Followers', profileData.totalFollowers || 0, `+${metrics.followersGrowthPct || 0}%`],
    ['Total Views', metrics.totalViews || 0, `+${metrics.totalViewsGrowthPct || 0}% vs prior`],
    ['Total Reach', metrics.totalReach || 0, `+${metrics.totalReachGrowthPct || 0}% vs prior`],
    ['Total Likes', metrics.totalLikes || 0, `+${metrics.totalLikesGrowthPct || 0}% vs prior`],
    ['Total Comments', metrics.totalComments || 0, `+${metrics.totalCommentsGrowthPct || 0}% vs prior`],
    ['Total Shares', metrics.totalShares || 0, `+${metrics.totalSharesGrowthPct || 0}% vs prior`],
    ['Total Saves', metrics.totalSaves || 0, `+${metrics.totalSavesGrowthPct || 0}% vs prior`],
    ['Engagement Rate (%)', `${metrics.engagementRate || 0}%`, 'Industry Benchmark: 3.2%'],
    ['Profile Visits', metrics.profileVisits || 0, `+${metrics.profileVisitsGrowthPct || 0}%`],
    ['Website Clicks', metrics.websiteClicks || 0, `+${metrics.websiteClicksGrowthPct || 0}%`]
  ];

  const kpiSheet = XLSX.utils.aoa_to_sheet(kpiData);
  XLSX.utils.book_append_sheet(workbook, kpiSheet, 'Executive Summary & KPIs');

  // 2. Posts Performance Sheet
  const postsRows = (posts || []).map((p, idx) => ({
    '#': idx + 1,
    'Post ID': p.id || `post-${idx + 1}`,
    'Type': p.type || 'Post',
    'Date Published': p.date || 'Recent',
    'Caption': p.caption || '',
    'Views': p.views || 0,
    'Likes': p.likes || 0,
    'Comments': p.comments || 0,
    'Shares': p.shares || 0,
    'Saves': p.saves || 0,
    'Reach': p.reach || 0,
    'Engagement Rate (%)': p.engagementRate ? `${p.engagementRate}%` : `${(((p.likes + p.comments + p.shares + p.saves) / Math.max(p.reach || 1, 1)) * 100).toFixed(2)}%`,
    'Virality Score': p.score || 85,
    'Badge': p.badge || 'Standard'
  }));

  const postsSheet = XLSX.utils.json_to_sheet(postsRows);
  XLSX.utils.book_append_sheet(workbook, postsSheet, 'Content Performance');

  // Generate Excel file and trigger browser download
  const filename = `${(profileData.handle || 'instagram').replace('@', '')}_analytics_report_${period}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

/**
 * Export Bulk URL Extraction Results (up to 100 URLs) to Excel (.xlsx) workbook
 */
export function exportBulkUrlsToExcel(batchResults, batchStats = {}) {
  const workbook = XLSX.utils.book_new();

  // 1. Batch Overview Sheet
  const summaryData = [
    ['INSTAPULSE AI - BULK INSTAGRAM URL ANALYSIS REPORT'],
    ['Extraction Date', new Date().toLocaleString()],
    ['Total Processed URLs', batchResults.length],
    ['Total Batch Views', batchStats.totalViews || 0],
    ['Total Batch Likes', batchStats.totalLikes || 0],
    ['Total Batch Comments', batchStats.totalComments || 0],
    ['Total Batch Shares', batchStats.totalShares || 0],
    ['Total Batch Saves', batchStats.totalSaves || 0],
    ['Average Engagement Rate (%)', `${batchStats.avgER || 0}%`],
    []
  ];

  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Batch Summary');

  // 2. Extracted Posts Data Sheet
  const rows = batchResults.map((item, idx) => ({
    '#': idx + 1,
    'Author Name': item.authorName || 'Instagram Creator',
    'Author Handle': item.authorHandle || '@creator',
    'Content Type': item.type || 'Reel',
    'Views': item.views || 0,
    'Likes': item.likes || 0,
    'Comments': item.comments || 0,
    'Shares': item.shares || 0,
    'Saves': item.saves || 0,
    'Reach': item.reach || 0,
    'Engagement Rate (%)': item.engagementRate ? `${item.engagementRate}%` : '0%',
    'Virality Score': item.viralityScore || 85,
    'Fetch Source': item.fetchSource || 'Extracted',
    'Caption': item.caption || '',
    'Hashtags': (item.hashtags || []).join(', '),
    'Instagram URL': item.url || ''
  }));

  const dataSheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, dataSheet, '100 Instagram URLs Data');

  const filename = `bulk_instagram_analytics_${batchResults.length}_urls_${Date.now()}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
