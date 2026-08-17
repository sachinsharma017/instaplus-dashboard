import { chromium } from 'playwright';

async function testPlaywrightReel(url) {
  console.log('Launching headless browser to scrape Reel URL:', url);
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  try {
    console.log('Navigating to Reel page...');
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(3000);

    const title = await page.title();
    console.log('Page Title:', title);

    // Extract meta property og:title & og:description
    const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content').catch(() => null);
    const ogDesc = await page.getAttribute('meta[property="og:description"]', 'content').catch(() => null);
    const ogImage = await page.getAttribute('meta[property="og:image"]', 'content').catch(() => null);

    console.log('--- PLAYWRIGHT EXTRACTED RESULTS ---');
    console.log('og:title:', ogTitle);
    console.log('og:description:', ogDesc);
    console.log('og:image:', ogImage);

    // Also check page HTML for reel author username links
    const authorLink = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/reel/"] ~ a, header a[href*="/"], span > a[href*="/"]');
      return link ? link.getAttribute('href') : null;
    }).catch(() => null);

    console.log('Author Link evaluated:', authorLink);
  } catch (err) {
    console.error('Playwright Error:', err.message);
  } finally {
    await browser.close();
  }
}

testPlaywrightReel('https://www.instagram.com/reel/Dae2FIxzr1g/');
