import { fetchLiveInstagramData } from '../src/services/realTimeInstagramScraper.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { urls, rapidApiKey } = req.body || {};
    if (!Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of Instagram URLs.' });
    }

    const validUrls = urls.slice(0, 100);
    const results = await Promise.all(
      validUrls.map(u => fetchLiveInstagramData(u, rapidApiKey || '', true).catch(() => null))
    );

    return res.status(200).json({ success: true, data: results.filter(Boolean) });
  } catch (err) {
    return res.status(500).json({ error: 'Bulk extraction failed.', details: err.message });
  }
}
