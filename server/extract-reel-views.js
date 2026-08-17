import { chromium } from 'playwright';

async function extractExactViews(shortcode) {
  const url = `https://www.instagram.com/reel/${shortcode}/`;
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});

  // Extract all text content and search for play/view count
  const data = await page.evaluate(() => {
    const text = document.body.innerText || '';
    const html = document.body.innerHTML || '';
    
    // Look for numbers before "views" or "plays" e.g. "1,420 plays" or "12.5K views"
    const playMatch = text.match(/([0-9,kM.]+)\s+(plays|views|play)/i);
    const scriptMatch = html.match(/"video_view_count":\s*([0-9]+)/i) || html.match(/"play_count":\s*([0-9]+)/i) || html.match(/"view_count":\s*([0-9]+)/i);

    return {
      playMatch: playMatch ? playMatch[1] : null,
      scriptMatch: scriptMatch ? scriptMatch[1] : null,
      textSnippet: text.slice(0, 400)
    };
  });

  console.log('--- EXACT REEL VIEWS SCRAPED ---');
  console.log('Play Match from DOM text:', data.playMatch);
  console.log('Script Match from JSON:', data.scriptMatch);
  console.log('Snippet:', data.textSnippet);

  await browser.close();
}

extractExactViews('Dae2FIxzr1g');
