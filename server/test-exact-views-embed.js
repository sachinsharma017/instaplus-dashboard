import { chromium } from 'playwright';

async function testExtractExactViews() {
  const shortcode = 'Dae2FIxzr1g'; // Ganesh Soni reel
  const reelUrl = `https://www.instagram.com/reel/${shortcode}/`;

  console.log('--- Testing Method 1: Instagram Embed Page ---');
  try {
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
    const res = await fetch(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    console.log('Embed HTML snippet length:', html.length);
    
    // Look for view count in embed HTML
    const viewMatches = html.match(/([0-9,kM.]+)\s*(views|plays|view_count|play_count)/gi);
    console.log('Embed view matches:', viewMatches);

    const playCountMatch = html.match(/"video_play_count":\s*([0-9]+)/) || html.match(/"play_count":\s*([0-9]+)/) || html.match(/"view_count":\s*([0-9]+)/);
    if (playCountMatch) {
      console.log('✅ FOUND EXACT VIEW COUNT IN EMBED HTML:', playCountMatch[1]);
    }
  } catch (err) {
    console.log('Embed err:', err.message);
  }

  console.log('\n--- Testing Method 2: Playwright Full Browser Page Execution ---');
  try {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    let jsonExactViews = null;
    page.on('response', async (res) => {
      try {
        const u = res.url();
        if (u.includes('graphql') || u.includes('/api/v1/') || u.includes('web_info')) {
          const text = await res.text().catch(() => '');
          const m = text.match(/"video_play_count":\s*([0-9]+)/) || text.match(/"play_count":\s*([0-9]+)/) || text.match(/"view_count":\s*([0-9]+)/);
          if (m) {
            jsonExactViews = parseInt(m[1], 10);
            console.log('✅ FOUND EXACT VIEW COUNT IN NETWORK JSON:', jsonExactViews);
          }
        }
      } catch (e) {}
    });

    await page.goto(`https://www.instagram.com/p/${shortcode}/embed/captioned/`, { waitUntil: 'networkidle', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(2000);

    const embedViewsText = await page.evaluate(() => {
      const el = document.querySelector('.SocialProof') || document.querySelector('.WatchAgain') || document.querySelector('.ViewCount');
      return el ? el.innerText : document.body.innerText;
    }).catch(() => '');
    console.log('Playwright Embed Body snippet:', embedViewsText.slice(0, 300));

    await browser.close();
  } catch (err) {
    console.log('Playwright err:', err.message);
  }
}

testExtractExactViews();
