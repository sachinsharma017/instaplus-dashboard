async function parseHtml() {
  const url = 'https://www.instagram.com/reel/Davgz6iTyKARaKhlMQzUkJhlMTZEHQYdJRTd2I0/?hl=en';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });

  const html = await res.text();
  console.log('Searching HTML JSON payloads...');
  
  // Search for meta description
  const metaDesc = html.match(/<meta name="description" content="([^"]+)"/i);
  console.log('Meta Desc:', metaDesc ? metaDesc[1] : 'NONE');

  // Search for caption / likes / comments in HTML
  const likesMatch = html.match(/([0-9,KkMm.]+)\s*likes?/i);
  const commentsMatch = html.match(/([0-9,KkMm.]+)\s*comments?/i);
  const ownerMatch = html.match(/"username":"([A-Za-z0-9_.]+)"/i);
  const playsMatch = html.match(/"video_play_count":([0-9]+)/i);

  console.log('Likes Match:', likesMatch ? likesMatch[1] : 'NONE');
  console.log('Comments Match:', commentsMatch ? commentsMatch[1] : 'NONE');
  console.log('Owner Match:', ownerMatch ? ownerMatch[1] : 'NONE');
  console.log('Plays Match:', playsMatch ? playsMatch[1] : 'NONE');
}

parseHtml().catch(console.error);
