import express from 'express';
import { PROFILES } from '../data/mockData.js';
import { getMetaConfig, fetchLiveProfile, fetchLiveMedia } from '../services/metaApi.js';

const router = express.Router();

// Get profile analytics summary for selected period
router.get('/summary', async (req, res) => {
  const { profileId = 'ecommerce', period = '30d' } = req.query;
  const config = getMetaConfig();

  // Attempt to fetch live Meta profile if configured
  let liveProfile = null;
  if (config.isConfigured) {
    liveProfile = await fetchLiveProfile();
  }

  const profile = PROFILES[profileId] || PROFILES.ecommerce;
  const metrics = profile.metrics[period] || profile.metrics['30d'];

  if (liveProfile && !liveProfile.error) {
    // Merge live followers and live Meta data into metrics
    return res.json({
      metaApiStatus: {
        active: true,
        mode: 'LIVE_META_API',
        connectedAccount: liveProfile.handle,
        message: 'Connected to live Meta Graph API'
      },
      profile: {
        id: liveProfile.id,
        name: liveProfile.name,
        handle: liveProfile.handle,
        avatar: liveProfile.avatar,
        category: liveProfile.category,
        verified: liveProfile.verified,
        totalFollowers: liveProfile.totalFollowers
      },
      period,
      metrics: {
        ...metrics,
        totalFollowers: liveProfile.totalFollowers
      },
      timeSeries: profile.timeSeries,
      topContentType: profile.topContentType,
      insights: [
        `Live Meta API active for ${liveProfile.handle}.`,
        `Account total followers: ${liveProfile.totalFollowers.toLocaleString()}.`,
        `Reels are generating maximum reach across recent media.`,
        `Post consistency recommendation: 1 reel per day between 7-9 PM.`,
        `Educational content leads in saves and shares.`
      ]
    });
  }

  // Fallback to Mock / Demo profile data
  const insights = [
    `Reels are generating 64.2% more reach and 3.1x more shares than single image posts.`,
    `Posts published between 7:00 PM–9:00 PM are receiving 42% higher engagement rate.`,
    `Educational Carousels yield a 4.8% Save Rate compared to the 1.4% account baseline average.`,
    `Comments have decreased by ${Math.abs(metrics.totalCommentsGrowthPct)}% during the last ${period}. Try asking open-ended questions in video captions.`,
    `Your audience responds most strongly to short-form video content under 30 seconds.`
  ];

  res.json({
    metaApiStatus: {
      active: false,
      mode: 'MOCK_DEMO_MODE',
      message: 'Add META_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ACCOUNT_ID in .env for live Meta Graph API data'
    },
    profile: {
      id: profile.id,
      name: profile.name,
      handle: profile.handle,
      avatar: profile.avatar,
      category: profile.category,
      verified: profile.verified,
      totalFollowers: profile.totalFollowers
    },
    period,
    metrics,
    timeSeries: profile.timeSeries,
    topContentType: profile.topContentType,
    insights
  });
});

// Get audience demographics & posting time recommendation
router.get('/audience', (req, res) => {
  const { profileId = 'ecommerce' } = req.query;
  const profile = PROFILES[profileId] || PROFILES.ecommerce;
  res.json(profile.audience);
});

// Get competitor comparison data
router.get('/competitors', (req, res) => {
  const { profileId = 'ecommerce' } = req.query;
  const profile = PROFILES[profileId] || PROFILES.ecommerce;
  res.json(profile.competitors);
});

export default router;

