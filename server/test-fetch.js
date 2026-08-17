async function testFetch() {
  try {
    const res = await fetch('https://www.instagram.com/dr.sharmarobin/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    const html = await res.text();
    const metaTitle = html.match(/<meta property="og:title" content="([^"]+)"/i);
    const metaDesc = html.match(/<meta property="og:description" content="([^"]+)"/i);
    console.log('Title:', metaTitle ? metaTitle[1] : 'None');
    console.log('Desc:', metaDesc ? metaDesc[1] : 'None');
  } catch (err) {
    console.error('Error:', err);
  }
}
testFetch();
