import express from 'express';
import { PROFILES } from '../data/mockData.js';
import { getMetaConfig, fetchLiveMedia } from '../services/metaApi.js';

const router = express.Router();

// Get content posts with sorting, filtering, and content score calculations
router.get('/posts', async (req, res) => {
  const { profileId = 'ecommerce', type, sortBy = 'score', sortDir = 'desc' } = req.query;
  const config = getMetaConfig();

  let posts = null;
  if (config.isConfigured) {
    posts = await fetchLiveMedia(30);
  }

  const profile = PROFILES[profileId] || PROFILES.ecommerce;
  if (!posts || posts.length === 0) {
    posts = [...profile.posts];
  }

  if (type && type !== 'All') {
    posts = posts.filter(p => p.type.toLowerCase() === type.toLowerCase());
  }

  // Sort logic
  posts.sort((a, b) => {
    let valA = a[sortBy] ?? a.score;
    let valB = b[sortBy] ?? b.score;
    if (sortDir === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });

  // Calculate Best Content Highlights
  const bestReel = posts.filter(p => p.type === 'Reel').sort((a, b) => b.score - a.score)[0] || posts[0];
  const bestPost = posts.filter(p => p.type === 'Image').sort((a, b) => b.score - a.score)[0] || posts[0];
  const bestCarousel = posts.filter(p => p.type === 'Carousel').sort((a, b) => b.score - a.score)[0] || posts[0];
  
  const mostLiked = [...posts].sort((a, b) => b.likes - a.likes)[0];
  const mostCommented = [...posts].sort((a, b) => b.comments - a.comments)[0];
  const mostShared = [...posts].sort((a, b) => b.shares - a.shares)[0];
  const mostSaved = [...posts].sort((a, b) => b.saves - a.saves)[0];
  const highestReach = [...posts].sort((a, b) => b.reach - a.reach)[0];

  res.json({
    isLive: Boolean(config.isConfigured),
    posts,
    highlights: {
      bestReel,
      bestPost,
      bestCarousel,
      mostLiked,
      mostCommented,
      mostShared,
      mostSaved,
      highestReach
    }
  });
});

export default router;

