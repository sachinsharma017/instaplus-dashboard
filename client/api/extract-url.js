import { API_BASE } from '../src/apiConfig';

export default async function handler(req, res) {
  // Support CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.body || {};
  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'Please provide a valid Instagram URL.' });
  }

  try {
    const resp = await fetch(`${API_BASE}/api/extract-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const json = await resp.json(); // { success:true, data:{...} }
    if (!json.success) throw new Error(json.error || 'Unknown error');
    // Return ONLY the inner data object to the client UI
    return res.status(200).json({ success: true, data: json.data });
  } catch (err) {
    console.error('Error in URL extraction client endpoint:', err);
    return res.status(500).json({ error: err.message || 'Failed to extract Instagram data.' });
  }
}
