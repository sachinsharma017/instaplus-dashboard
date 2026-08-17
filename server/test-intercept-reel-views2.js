import { chromium } from 'playwright';

async function testPlaywrightVideoView(url) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  let capturedViews = null;

  page.on('response', async (res) => {
    try {
      const urlStr = res.url();
      const text = await res.text().catch(() => '');
      if (text.includes('play_count') || text.includes('video_view_count') || text.includes('view_count')) {
        const m = text.match(/"(?:video_play_count|play_count|view_count)":\s*([0-9]+)/);
        if (m) {
          capturedViews = parseInt(m[1], 10);
          console.log('✅✅ CAPTURED EXACT LIVE VIEWS FROM INSTAGRAM NETWORK:', capturedViews);
        }
      }
    } catch (e) {}
  });

  console.log('Navigating to Reel:', url);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // Click on video to trigger player & fetch exact view data
  await page.click('video').catch(() => {});
  await page.waitForTimeout(3000);

  // Check all spans for text containing "plays" or "views"
  const spans = await page.$$eval('span', els => els.map(e => e.innerText));
  for (const s of spans) {
    if (s && (s.includes('plays') || s.includes('views') || s.includes('M') || s.includes('K'))) {
      if (/^[0-9,kM.]+\s*(plays|views)?$/i.test(s.trim())) {
        console.log('DOM View Span:', s.trim());
      }
    }
  }

  await browser.close();
  return capturedViews;
}

testPlaywrightVideoView('https://www.instagram.com/reel/Dae2FIxzr1g/');
