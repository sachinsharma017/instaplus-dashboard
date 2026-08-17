async function testMobileProfile() {
  const username = '_yati_shekhawat_';
  const targetUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;

  const headers = {
    'X-IG-App-ID': '936619743392459',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin'
  };

  const res = await fetch(targetUrl, { headers });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response length:', text.length);
  if (res.ok && text.startsWith('{')) {
    const data = JSON.parse(text);
    const u = data?.data?.user;
    if (u) {
      console.log('Full Name:', u.full_name);
      console.log('Followers:', u.edge_followed_by?.count);
      console.log('Following:', u.edge_follow?.count);
      console.log('Posts:', u.edge_owner_to_timeline_media?.count);
      console.log('Bio:', u.biography);
      console.log('Avatar:', u.profile_pic_url_hd);
      console.log('Recent 3 Posts:');
      const edges = u.edge_owner_to_timeline_media?.edges || [];
      edges.slice(0, 3).forEach((e, i) => {
        const node = e.node;
        console.log(`Post ${i+1}: likes=${node.edge_liked_by?.count}, comments=${node.edge_media_to_comment?.count}, views=${node.video_view_count}`);
      });
    }
  } else {
    console.log('Response text:', text.slice(0, 300));
  }
}

testMobileProfile();
