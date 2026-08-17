import * as cheerio from 'cheerio';

async function testEmbed() {
  const url = 'https://www.instagram.com/p/C4m8K99xYZ_/embed/captioned/';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    console.log('Title:', $('title').text());
    console.log('Username text:', $('.UsernameText, .Username').text() || $('a[href*="instagram.com"]').text());
    
    // Find all text nodes containing numbers or likes
    let textContent = $('body').text();
    console.log('Text preview:', textContent.slice(0, 300));
  } catch (err) {
    console.error(err);
  }
}

testEmbed();
