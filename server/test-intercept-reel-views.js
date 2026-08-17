import { chromium } from 'playwright';

async function interceptReelViews(url) {
  console.log('Testing Playwright Network Interception on:', url);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  let exactViews = null;

  page.on('response', async (res) => {
    try {
      const resUrl = res.url();
      if (resUrl.includes('graphql') || resUrl.includes('/api/v1/') || resUrl.includes('web_info') || resUrl.includes('info')) {
        const text = await res.text().catch(() => '');
        if (text.includes('video_play_count') || text.includes('play_count') || text.includes('view_count')) {
          const m = text.match(/"(?:video_play_count|play_count|view_count)":\s*([0-9]+)/);
          if (m) {
            exactViews = parseInt(m[1], 10);
            console.log('🎉🎉 EXPLICIT EXACT VIEWS INTERCEPTED FROM NETWORK:', exactViews);
          }
        }
      }
    } catch (e) {}
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(4000);

  // If network interception didn't catch it yet, check DOM spans for "6.8M", "17.5K", "views", "plays"
  if (!exactViews) {
    const textContent = await page.evaluate(() => document.body.innerText).catch(() => '');
    const mText = textContent.match(/([0-9,kM.]+)\s*(plays|views)/i);
    console.log('DOM Text Match:', mText);
  }

  await browser.close();
  return exactViews;
}

interceptReelViews('https://www.instagram.com/reel/Dae2FIxzr1g/');
