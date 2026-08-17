import * as cheerio from 'cheerio';

async function inspectEmbedJson(shortcode) {
  const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  };

  const res = await fetch(embedUrl, { headers });
  const html = await res.text();

  // Search for script tags containing JSON
  const matches = html.match(/window\.__additionalDataLoaded\('([^']+)',\s*({[\s\S]*?})\);/g) ||
                  html.match(/{"graphql":[\s\S]*?}/g) ||
                  html.match(/"owner":\s*({[^}]+})/g) ||
                  html.match(/"username":"([^"]+)"/g);

  console.log('Matches found:', matches ? matches.length : 0);

  if (matches) {
    matches.slice(0, 10).forEach((m, idx) => console.log(`Match ${idx}:`, m.slice(0, 150)));
  }

  // Check for any text inside script tags containing 'owner' or 'username'
  const $ = cheerio.load(html);
  $('script').each((i, el) => {
    const text = $(el).html();
    if (text.includes('username') || text.includes('owner')) {
      const uMatch = text.match(/"username":"([^"]+)"/i);
      const fMatch = text.match(/"full_name":"([^"]+)"/i);
      const lMatch = text.match(/"like_count":([0-9]+)/i) || text.match(/"like_count":\s*([0-9]+)/i);
      if (uMatch) {
        console.log('✅ FOUND USERNAME IN SCRIPT:');
        console.log('Username:', uMatch[1]);
        if (fMatch) console.log('Full Name:', fMatch[1]);
        if (lMatch) console.log('Like Count:', lMatch[1]);
      }
    }
  });
}

inspectEmbedJson('Dae2FIxzr1g');
