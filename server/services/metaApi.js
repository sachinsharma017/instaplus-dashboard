/**
 * Meta Graph API Integration Service for Instagram Graph API
 * Documentation: https://developers.facebook.com/docs/instagram-api/
 */

const GRAPH_API_VERSION = 'v19.0';
const BASE_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;

/**
 * Check if Meta API credentials are configured in process.env
 */
export function getMetaConfig() {
  const accessToken = process.env.META_ACCESS_TOKEN || process.env.INSTAGRAM_ACCESS_TOKEN || '';
  const instagramAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || process.env.META_INSTAGRAM_ACCOUNT_ID || '';
  const appId = process.env.META_APP_ID || '';
  const appSecret = process.env.META_APP_SECRET || '';

  const isConfigured = Boolean(accessToken && instagramAccountId);

  return {
    isConfigured,
    accessToken,
    instagramAccountId,
    appId,
    appSecret,
    mode: isConfigured ? 'LIVE_META_API' : 'MOCK_DEMO_MODE'
  };
}

/**
 * Fetch Instagram Business/Creator Profile Information
 */
export async function fetchLiveProfile() {
  const { accessToken, instagramAccountId, isConfigured } = getMetaConfig();

  if (!isConfigured) {
    return null;
  }

  try {
    const fields = 'id,username,name,profile_picture_url,followers_count,follows_count,media_count,biography,website';
    const url = `${BASE_URL}/${instagramAccountId}?fields=${fields}&access_token=${accessToken}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error('Meta API Error (Profile):', data.error);
      return { error: data.error.message, code: data.error.code };
    }

    return {
      id: data.id,
      username: data.username,
      name: data.name || data.username,
      handle: `@${data.username}`,
      avatar: data.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      totalFollowers: data.followers_count || 0,
      followingCount: data.follows_count || 0,
      mediaCount: data.media_count || 0,
      biography: data.biography || '',
      verified: true,
      category: 'Live Instagram Account'
    };
  } catch (err) {
    console.error('Failed to fetch Meta API Profile:', err.message);
    return null;
  }
}

/**
 * Fetch Instagram Posts / Media list
 */
export async function fetchLiveMedia(limit = 25) {
  const { accessToken, instagramAccountId, isConfigured } = getMetaConfig();

  if (!isConfigured) {
    return null;
  }

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count';
    const url = `${BASE_URL}/${instagramAccountId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error('Meta API Error (Media):', data.error);
      return null;
    }

    const rawMediaList = data.data || [];

    // Map Meta API media to dashboard standard post format
    const posts = await Promise.all(
      rawMediaList.map(async (item) => {
        let type = 'Image';
        if (item.media_type === 'VIDEO') type = 'Reel';
        if (item.media_type === 'CAROUSEL_ALBUM') type = 'Carousel';

        // Calculate score based on engagement
        const likes = item.like_count || 0;
        const comments = item.comments_count || 0;

        // Estimate reach & shares based on standard engagement ratios if insights restricted
        const estReach = Math.round((likes + comments) * 12.5) + 150;
        const estShares = Math.round(comments * 1.5) + 5;
        const estSaves = Math.round(likes * 0.18) + 2;

        const engagementRate = ((likes + comments + estShares + estSaves) / Math.max(estReach, 100)) * 100;
        const score = Math.min(Math.round(engagementRate * 18 + 50), 99);

        return {
          id: item.id,
          caption: item.caption || 'No caption provided',
          type,
          mediaUrl: item.media_url || item.thumbnail_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
          thumbnail: item.thumbnail_url || item.media_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
          permalink: item.permalink,
          date: item.timestamp ? new Date(item.timestamp).toISOString().split('T')[0] : 'Today',
          likes,
          comments,
          shares: estShares,
          saves: estSaves,
          reach: estReach,
          impressions: Math.round(estReach * 1.25),
          engagementRate: Number(engagementRate.toFixed(2)),
          score
        };
      })
    );

    return posts;
  } catch (err) {
    console.error('Failed to fetch Meta API Media:', err.message);
    return null;
  }
}

/**
 * Fetch Meta Account Insights Summary
 */
export async function fetchLiveInsights(period = '30d') {
  const { accessToken, instagramAccountId, isConfigured } = getMetaConfig();

  if (!isConfigured) {
    return null;
  }

  try {
    // Meta insights metrics for instagram business account
    const metricsParam = 'impressions,reach,profile_views';
    const url = `${BASE_URL}/${instagramAccountId}/insights?metric=${metricsParam}&period=day&access_token=${accessToken}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.warn('Insights endpoint returned error (may require additional permissions):', data.error.message);
      return null;
    }

    return data.data;
  } catch (err) {
    console.error('Failed to fetch Live Insights:', err.message);
    return null;
  }
}
