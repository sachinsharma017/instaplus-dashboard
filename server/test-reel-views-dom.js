import { chromium } from 'playwright';

async function inspectReelDom(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });

  console.log('Navigating to:', url);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);

  const html = await page.content();
  console.log('HTML Length:', html.length);

  // Search for view count / play count in script tags or text content
  const playMatches = html.match(/([0-9,kM.]+)\s*(plays|views|video_view_count|play_count)/gi);
  console.log('Regex Play Matches:', playMatches);

  const scripts = await page.$$eval('script', els => els.map(e => e.textContent));
  for (const s of scripts) {
    if (s.includes('play_count') || s.includes('video_view_count') || s.includes('view_count')) {
      const match = s.match(/"(?:play_count|video_view_count|view_count)":\s*([0-9]+)/);
      if (match) {
        console.log('✅ FOUND EXACT VIEW COUNT IN SCRIPT TAG:', match[1]);
      }
    }
  }

  await browser.close();
}

inspectReelDom('https://www.instagram.com/reel/Dae2FIxzr1g/');
