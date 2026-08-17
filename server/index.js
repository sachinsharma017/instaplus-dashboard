import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import analyticsRoutes from './routes/analytics.js';
import contentRoutes from './routes/content.js';
import aiRoutes from './routes/ai.js';
import authRoutes from './routes/auth.js';
import urlExtractorRoutes from './routes/urlExtractor.js';
import generateIdeasRoutes from './routes/generateIdeas.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check / status route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'InstaPlus Analytics API',
    time: new Date().toISOString()
  });
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'InstaPulse AI Backend',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/extract-url', urlExtractorRoutes);
app.use('/api/generate-ideas', generateIdeasRoutes);

// Image Proxy Endpoint
app.get('/api/proxy-image', async (req, res) => {
  let imageUrl = '';

  if (req.originalUrl.includes('?url=')) {
    imageUrl = decodeURIComponent(req.originalUrl.split('?url=')[1]);
  } else {
    imageUrl = req.query.url;
  }

  if (!imageUrl) {
    return res.status(400).send('Missing url parameter');
  }

  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
        Accept:
          'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    });

    if (!response.ok) {
      console.log(
        'Proxy image fetch HTTP failed:',
        response.status,
        imageUrl.slice(0, 80)
      );

      return res.status(response.status).send('Failed to fetch image');
    }

    const contentType =
      response.headers.get('content-type') || 'image/jpeg';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.send(buffer);
  } catch (err) {
    console.error('Image proxy error:', err.message);
    res.status(500).send('Image proxy error');
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 InstaPulse AI Server running on port ${PORT}`);
});