async function testEmbed() {
  const url = 'https://www.instagram.com/p/Da5MBxWvQ50/embed/captioned/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  const html = await res.text();
  console.log('HTML length:', html.length);

  // Look for likes
  const likeMatches = html.match(/\b([\d,.]+[KMB]?)\s*likes?\b/gi);
  console.log('likeMatches:', likeMatches);

  // Look for views
  const viewMatches = html.match(/\b([\d,.]+[KMB]?)\s*views?\b/gi);
  console.log('viewMatches:', viewMatches);

  // Look for owner handle
  const ownerMatches = html.match(/instagram\.com\/([a-zA-Z0-9._]{2,30})/gi);
  console.log('ownerMatches:', ownerMatches);

  // Search for any numbers or text inside the embed HTML
  const matchesInScript = html.match(/"edge_liked_by":\{"count":(\d+)\}/i) || html.match(/"edge_media_preview_like":\{"count":(\d+)\}/i) || html.match(/like_count":(\d+)/i);
  console.log('script likes match:', matchesInScript);

  const viewCountMatch = html.match(/"video_view_count":(\d+)/i) || html.match(/view_count":(\d+)/i) || html.match(/"play_count":(\d+)/i);
  console.log('script view count match:', viewCountMatch);
}

testEmbed();
