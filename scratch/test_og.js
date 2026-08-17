async function fetchOg() {
  const url = 'https://www.instagram.com/reel/Davgz6iTyKARaKhlMQzUkJhlMTZEHQYdJRTd2I0/?hl=en';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    }
  });

  const html = await res.text();
  console.log('HTML Length:', html.length);
  
  const titleMatch = html.match(/meta property="og:title" content="([^"]+)"/i);
  const descMatch = html.match(/meta property="og:description" content="([^"]+)"/i);
  const imageMatch = html.match(/meta property="og:image" content="([^"]+)"/i);

  console.log('OG TITLE:', titleMatch ? titleMatch[1] : 'NONE');
  console.log('OG DESC:', descMatch ? descMatch[1] : 'NONE');
  console.log('OG IMAGE:', imageMatch ? imageMatch[1] : 'NONE');
}

fetchOg().catch(console.error);
