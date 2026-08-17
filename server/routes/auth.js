import express from 'express';

const router = express.Router();

// Meta OAuth Authorization URL Generator
router.get('/meta/login', (req, res) => {
  const appId = process.env.META_APP_ID || '123456789012345';
  const redirectUri = encodeURIComponent(process.env.META_REDIRECT_URI || 'http://localhost:5000/api/auth/instagram/callback');
  const scope = encodeURIComponent('instagram_basic,instagram_manage_insights,pages_show_list,pages_read_engagement');

  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

  res.json({
    authUrl,
    appId,
    requiredScopes: [
      'instagram_basic',
      'instagram_manage_insights',
      'pages_show_list',
      'pages_read_engagement'
    ],
    status: 'OAuth setup initialized. Live API credentials can be supplied via environment variables.'
  });
});

// Callback handler for code exchange
router.get('/instagram/callback', (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ error: 'Authorization code missing' });
  }

  // Simulated token exchange response structure
  res.json({
    success: true,
    message: 'Meta OAuth authorization code received successfully.',
    accessToken: 'EAAC...mock_long_lived_user_access_token',
    expiresIn: 5184000, // 60 days
    connectedAccount: {
      id: '17841400000000000',
      username: 'aurahome.co',
      name: 'Aura Home & Living',
      accountType: 'BUSINESS'
    }
  });
});

export default router;
