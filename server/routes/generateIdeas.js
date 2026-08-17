import express from 'express';
const router = express.Router();

/**
 * POST /api/generate-ideas
 * Body: { niche, apiKey }
 * Uses Groq API (FREE) to generate Instagram content ideas
 * Get free API key: https://console.groq.com
 */
router.post('/', async (req, res) => {
  const { niche, apiKey } = req.body;

  if (!niche || !niche.trim()) {
    return res.status(400).json({ error: 'Niche/topic required hai.' });
  }
  if (!apiKey || !apiKey.trim()) {
    return res.status(400).json({ error: 'Groq API key required hai.' });
  }

  const prompt = `You are an expert Instagram content strategist. Generate content ideas for an Instagram creator in the "${niche}" niche.

Respond ONLY with valid JSON in this exact format (no markdown, no extra text):
{
  "reelIdeas": [
    { "title": "...", "hook": "...", "format": "...", "virality": "..." },
    { "title": "...", "hook": "...", "format": "...", "virality": "..." },
    { "title": "...", "hook": "...", "format": "...", "virality": "..." }
  ],
  "carouselIdeas": [
    { "title": "...", "slides": 5, "value": "..." },
    { "title": "...", "slides": 7, "value": "..." }
  ],
  "hashtags": [
    { "tag": "#...", "volume": "..." },
    { "tag": "#...", "volume": "..." },
    { "tag": "#...", "volume": "..." },
    { "tag": "#...", "volume": "..." },
    { "tag": "#...", "volume": "..." },
    { "tag": "#...", "volume": "..." }
  ],
  "ctas": ["...", "...", "..."],
  "calendar": [
    { "day": "Mon", "type": "Reel",     "title": "...", "time": "8:00 PM" },
    { "day": "Tue", "type": "Carousel", "title": "...", "time": "7:00 PM" },
    { "day": "Wed", "type": "Story",    "title": "...", "time": "12:00 PM" },
    { "day": "Thu", "type": "Reel",     "title": "...", "time": "8:00 PM" },
    { "day": "Fri", "type": "Post",     "title": "...", "time": "6:00 PM" },
    { "day": "Sat", "type": "Carousel", "title": "...", "time": "11:00 AM" },
    { "day": "Sun", "type": "Story",    "title": "...", "time": "8:00 PM" }
  ]
}

Make ALL content very specific to the "${niche}" niche. Hooks must be scroll-stopping. All titles in English.`;

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 2048
      })
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.json().catch(() => ({}));
      const msg = errBody?.error?.message || `Groq API error: ${groqRes.status}`;
      return res.status(groqRes.status).json({ error: msg });
    }

    const groqData = await groqRes.json();
    const rawText = groqData?.choices?.[0]?.message?.content || '';

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      return res.status(500).json({ error: 'AI response parse nahi hua. Dobara try karo.', raw: rawText.slice(0, 300) });
    }

    return res.json({ success: true, data: parsed });

  } catch (err) {
    return res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

export default router;
