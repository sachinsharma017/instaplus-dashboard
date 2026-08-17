import { chromium } from 'playwright';

async function debugReel() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  
  // Intercept all JSON / API network responses
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('graphql') || url.includes('api/v1') || url.includes('info')) {
      try {
        const text = await response.text();
        if (text.includes('xdt_shortcode_media') || text.includes('video_play_count') || text.includes('user')) {
          console.log('INTERCEPTED GRAPHQL RESPONSE:', url);
          console.log(text.slice(0, 1000));
        }
      } catch (e) {}
    }
  });

  console.log('Opening Reel URL...');
  await page.goto('https://www.instagram.com/reel/Davgz6iTyKARaKhlMQzUkJhlMTZEHQYdJRTd2I0/?hl=en', {
    waitUntil: 'networkidle',
    timeout: 15000
  }).catch(e => console.log('Goto notice:', e.message));

  console.log('Page Title:', await page.title());
  console.log('Page URL:', page.url());

  // Extract all text content
  const bodyText = await page.innerText('body').catch(() => '');
  console.log('Body Text Snippet:', bodyText.slice(0, 500));

  await browser.close();
}

debugReel().catch(console.error);
