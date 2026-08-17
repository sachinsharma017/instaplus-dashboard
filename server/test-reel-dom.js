import { chromium } from 'playwright';

async function testReelDom(url) {
  console.log('Testing Playwright DOM extraction for Reel Views on:', url);

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
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
    await page.waitForTimeout(4000);

    // Evaluate all spans, divs, and aria-labels for views/plays
    const pageText = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('span, div, a'));
      const textNodes = elements.map(el => el.innerText ? el.innerText.trim() : '').filter(Boolean);
      const viewsNodes = textNodes.filter(t => /view|play|like|comment/i.test(t));
      return {
        allViewsTexts: viewsNodes.slice(0, 30),
        bodyTextSnippet: document.body.innerText.slice(0, 800)
      };
    });

    console.log('--- REEL DOM EVALUATION RESULTS ---');
    console.log('Views/Plays Text Nodes:', pageText.allViewsTexts);
    console.log('Body Text Snippet:', pageText.bodyTextSnippet);
  } catch (err) {
    console.error('DOM Test Error:', err.message);
  } finally {
    await browser.close();
  }
}

testReelDom('https://www.instagram.com/reel/Dae2FIxzr1g/');
