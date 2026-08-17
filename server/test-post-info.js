async function testPostInfo(shortcode) {
  const targetUrl = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;
  const headers = {
    'X-IG-App-ID': '936619743392459',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  };

  try {
    const res = await fetch(targetUrl, { headers });
    const text = await res.text();
    if (text.startsWith('{')) {
      const data = JSON.parse(text);
      const items = data?.items?.[0] || data?.graphql?.shortcode_media;
      if (items) {
        console.log('✅ REEL POST SUCCESS!');
        console.log('Likes:', items.like_count || items.edge_media_preview_like?.count);
        console.log('Comments:', items.comment_count || items.edge_media_to_comment?.count);
        console.log('Views:', items.view_count || items.video_view_count);
        console.log('User:', items.user?.username || items.owner?.username);
        return items;
      }
    }
  } catch (err) {
    console.error('Post error:', err.message);
  }
}

testPostInfo('C3x9Z12yAB_');
