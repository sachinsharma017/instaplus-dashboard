async function testRealInstagramProfile(username) {
  const targetUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`;
  
  const headers = {
    'X-IG-App-ID': '936619743392459',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin'
  };

  try {
    console.log('Testing direct fetch for username:', username);
    const res = await fetch(targetUrl, { headers });
    const text = await res.text();
    
    if (text.startsWith('{')) {
      const data = JSON.parse(text);
      const user = data?.data?.user;
      if (user) {
        console.log('✅ SUCCESS! Real Instagram Profile Found:');
        console.log('Username:', user.username);
        console.log('Full Name:', user.full_name);
        console.log('Followers:', user.edge_followed_by?.count);
        console.log('Following:', user.edge_follow?.count);
        console.log('Posts:', user.edge_owner_to_timeline_media?.count);
        console.log('Avatar:', user.profile_picture_url);
        return user;
      }
    } else {
      console.log('Response is HTML/Redirect, testing CORS proxy...');
    }
  } catch (err) {
    console.log('Direct error:', err.message);
  }

  // Fallback to CORS Proxy
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl, { headers });
    const text = await res.text();
    if (text.startsWith('{')) {
      const data = JSON.parse(text);
      const user = data?.data?.user;
      if (user) {
        console.log('✅ PROXY SUCCESS! Real Instagram Profile Found:');
        console.log('Username:', user.username);
        console.log('Full Name:', user.full_name);
        console.log('Followers:', user.edge_followed_by?.count);
        return user;
      }
    }
  } catch (err) {
    console.log('Proxy error:', err.message);
  }

  return null;
}

testRealInstagramProfile('cristiano');
testRealInstagramProfile('dr.sharmarobin');
