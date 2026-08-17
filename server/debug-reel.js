import * as cheerio from 'cheerio';

async function debugReel(shortcode) {
  const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  };

  const res = await fetch(embedUrl, { headers });
  const html = await res.text();
  const $ = cheerio.load(html);

  console.log('--- ALL META TAGS ---');
  $('meta').each((i, el) => {
    const prop = $(el).attr('property') || $(el).attr('name');
    const content = $(el).attr('content');
    if (prop || content) {
      console.log(`${prop}: ${content}`);
    }
  });

  console.log('--- ALL LINKS ---');
  $('a').each((i, el) => {
    console.log($(el).attr('href'), $(el).text().trim());
  });

  console.log('--- BODY TEXT PREVIEW ---');
  console.log($('body').text().slice(0, 500));
}

debugReel('Dae2FIxzr1g');
