import { fetchLiveInstagramData } from '../src/services/realTimeInstagramScraper.js';

export default async function handler(req, res) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { url, rapidApiKey } = req.body || {};
    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Please provide a valid Instagram URL.' });
    }

    const data = await fetchLiveInstagramData(url, rapidApiKey || '', false);
    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error in URL extraction serverless endpoint:', err);
    return res.status(500).json({ error: 'Failed to extract Instagram URL data.', details: err.message });
  }
}
