async function testProfile() {
  const username = '_yati_shekhawat_';
  const url = `https://www.instagram.com/${username}/`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });

  const html = await res.text();
  console.log('Profile HTML length:', html.length);

  // Meta description tag
  const ogDesc = html.match(/meta property="og:description" content="([^"]+)"/i) || html.match(/name="description" content="([^"]+)"/i);
  console.log('OG Description:', ogDesc ? ogDesc[1] : 'null');

  // Meta title tag
  const ogTitle = html.match(/meta property="og:title" content="([^"]+)"/i) || html.match(/<title>([^<]+)<\/title>/i);
  console.log('OG Title:', ogTitle ? ogTitle[1] : 'null');

  // JSON LD parse
  const jsonLdMatch = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/i);
  if (jsonLdMatch) {
    console.log('JSON-LD found:', jsonLdMatch[1]);
  }
}

testProfile();
