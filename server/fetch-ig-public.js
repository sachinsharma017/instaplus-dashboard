async function fetchProfile(username) {
  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
      }
    });
    const html = await res.text();
    const metaDesc = html.match(/<meta property="og:description" content="([^"]+)"/);
    const metaTitle = html.match(/<meta property="og:title" content="([^"]+)"/);
    const metaImage = html.match(/<meta property="og:image" content="([^"]+)"/);

    console.log('Meta Description:', metaDesc ? metaDesc[1] : 'Not found');
    console.log('Meta Title:', metaTitle ? metaTitle[1] : 'Not found');
    console.log('Meta Image:', metaImage ? metaImage[1] : 'Not found');
  } catch (err) {
    console.error('Error:', err);
  }
}

fetchProfile('sachinsharma017');
