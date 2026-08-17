import express from 'express';
import { PROFILES } from '../data/mockData.js';

const router = express.Router();

// AI Assistant query endpoint
router.post('/chat', (req, res) => {
  const { question, profileId = 'ecommerce', period = '30d' } = req.body;
  const profile = PROFILES[profileId] || PROFILES.ecommerce;
  const metrics = profile.metrics[period] || profile.metrics['30d'];
  const topPost = profile.posts[0];

  const q = (question || '').toLowerCase();
  let answer = "";

  if (q.includes("decrease") || q.includes("drop") || q.includes("why")) {
    answer = `Based on your ${period} account data for **${profile.handle}**:\n\n` +
      `• **Comments dropped by ${Math.abs(metrics.totalCommentsGrowthPct)}%** compared to the prior period.\n` +
      `• **Primary Cause**: Image posts published during this timeframe had shorter captions without clear Call-to-Action (CTA) question prompts.\n\n` +
      `**Actionable Fix**:\n` +
      `1. Transition static image posts into 3-to-5 slide **Educational Carousels**.\n` +
      `2. End every caption with a direct opinion question (e.g. *"Which slide matches your current setup?"*).\n` +
      `3. Post during your peak active window on **${profile.audience.bestTime.day} at ${profile.audience.bestTime.time}**.`;
  } else if (q.includes("promote") || q.includes("boost") || q.includes("reel")) {
    answer = `Analysis of your top content shows that **Reel ID ${topPost.id}** (*"${topPost.caption.substring(0, 45)}..."*) is your prime candidate for promotion:\n\n` +
      `• **Content Score**: ${topPost.score}/100 (${topPost.badge})\n` +
      `• **Total Reach**: ${topPost.reach.toLocaleString()} (${((topPost.reach / profile.totalFollowers) * 100).toFixed(1)}% of your follower base)\n` +
      `• **Saves**: ${topPost.saves.toLocaleString()} (Extremely high save-to-reach ratio of ${((topPost.saves / topPost.reach) * 100).toFixed(1)}%)\n\n` +
      `**Targeting Recommendation**: Promote to females aged 25-34 in New York, London, and Los Angeles for maximum ROI.`;
  } else if (q.includes("next week") || q.includes("ideas") || q.includes("post")) {
    answer = `Here is your high-converting content recommendation for next week based on your account's historical winners:\n\n` +
      `1. **Reel (Monday 6:30 PM)**: "3 Common mistakes in ${profile.category} (and how to fix them in 60s)".\n` +
      `2. **Carousel (Wednesday 7:30 PM)**: "Step-by-Step Breakdown: Before & After Transformation".\n` +
      `3. **Reel (Friday 8:00 PM)**: Behind-the-scenes quick clip showing product craftsmanship or team workflow.\n` +
      `4. **Story Series (Daily)**: Polls & Q&A stickers to boost comment velocity.`;
  } else if (q.includes("7-day") || q.includes("plan") || q.includes("calendar")) {
    answer = `### 📅 7-Day Instagram Strategic Content Plan\n\n` +
      `| Day | Content Type | Topic | Target Goal | Best Time |\n` +
      `|---|---|---|---|---|\n` +
      `| **Mon** | Reel | 5 Quick Hacks for ${profile.category} | Reach & Virality | ${profile.audience.bestTime.time} |\n` +
      `| **Tue** | Carousel | Myth vs Reality Infographic | High Saves | 7:00 PM |\n` +
      `| **Wed** | Story Poll | "Which color palette do you prefer?" | Engagement | 12:00 PM |\n` +
      `| **Thu** | Reel | Voiceover Tutorial & Walkthrough | Shares & Reach | ${profile.audience.bestTime.time} |\n` +
      `| **Fri** | Single Post | Product Spotlight & Offer | Website Clicks | 6:00 PM |\n` +
      `| **Sat** | Carousel | Community Showcase & UGC | Brand Trust | 11:00 AM |\n` +
      `| **Sun** | Story Series | Weekly Recap & Q&A Sticker | Direct Messages | 8:00 PM |`;
  } else {
    answer = `I analyzed your active **${period}** data for **${profile.name}**:\n\n` +
      `• Total Reach: **${metrics.totalReach.toLocaleString()}** (${metrics.totalReachGrowthPct > 0 ? '+' : ''}${metrics.totalReachGrowthPct}%)\n` +
      `• Engagement Rate: **${metrics.engagementRate}%**\n` +
      `• Best Content Type: **${profile.topContentType}**\n` +
      `• Peak Active Window: **${profile.audience.bestTime.day} at ${profile.audience.bestTime.time}**\n\n` +
      `How can I help optimize your marketing strategy further? Ask me for content ideas, promotion suggestions, or engagement diagnostics!`;
  }

  res.json({ answer, timestamp: new Date().toISOString() });
});

// AI Content Generator endpoint
router.get('/ideas', (req, res) => {
  const { profileId = 'ecommerce' } = req.query;
  const profile = PROFILES[profileId] || PROFILES.ecommerce;

  res.json({
    reels: [
      { title: `3 Unexpected ${profile.category} Tricks`, format: "15s Audio Sync + Fast Cuts", expectedReach: "High (🔥 Viral Potential)", hook: "Stop scrolling if you care about..." },
      { title: `Day in the Life: ${profile.name}`, format: "Voiceover + Cinematic B-Roll", expectedReach: "Medium-High", hook: "Ever wondered what happens behind the scenes?" },
      { title: "Before vs After Transformation", format: "Split screen comparison", expectedReach: "Very High", hook: "You won't believe this before and after..." }
    ],
    carousels: [
      { title: `The Ultimate ${profile.category} Checklist (Save for Later)`, slides: 5, expectedSaves: "Top 5%" },
      { title: "Common Mistakes Everyone Makes (And How to Fix Them)", slides: 7, expectedSaves: "Top 10%" }
    ],
    hashtags: [
      { tag: `#${profile.category.replace(/[^a-zA-Z]/g, '')}`, reachVolume: "2.4M posts" },
      { tag: "#MarketingInsights", reachVolume: "850K posts" },
      { tag: "#ContentCreator", reachVolume: "5.1M posts" },
      { tag: "#InstaGrowth", reachVolume: "1.2M posts" },
      { tag: "#ViralReels", reachVolume: "18.4M posts" }
    ],
    ctas: [
      "Save this post so you don't lose these key tips!",
      "Comment 'GUIDE' below and we'll DM you the direct link!",
      "Share this with a creator who needs to hear this today!"
    ]
  });
});

export default router;
