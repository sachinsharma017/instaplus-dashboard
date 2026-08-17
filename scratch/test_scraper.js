import { chromium } from 'playwright';

async function testUrl() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();
  console.log('Navigating to Reel URL...');
  
  await page.goto('https://www.instagram.com/reel/Davgz6iTyKARaKhlMQzUkJhlMTZEHQYdJRTd2I0/?hl=en', {
    waitUntil: 'domcontentloaded',
    timeout: 10000
  }).catch(e => console.log('Goto notice:', e.message));

  await page.waitForTimeout(2000);

  const title = await page.title();
  const finalUrl = page.url();
  const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content').catch(() => null);
  const ogDesc = await page.getAttribute('meta[property="og:description"]', 'content').catch(() => null);

  console.log('=== SCRAPER DEBUG OUTPUT ===');
  console.log('Title:', title);
  console.log('Final URL:', finalUrl);
  console.log('og:title:', ogTitle);
  console.log('og:description:', ogDesc);

  await browser.close();
}

testUrl().catch(console.error);
