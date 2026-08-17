import { chromium } from 'playwright';

async function testLdJson(shortcode) {
  const url = `https://www.instagram.com/reel/${shortcode}/`;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  const scriptData = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
    return scripts.map(s => s.innerText);
  });

  console.log('LD+JSON Scripts Found:', scriptData.length);
  scriptData.forEach((s, idx) => {
    console.log(`Script ${idx}:`, s.slice(0, 400));
  });

  await browser.close();
}

testLdJson('Dae2FIxzr1g');
