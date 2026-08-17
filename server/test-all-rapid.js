async function testAllRapid() {
  const key = '5ca54dcc04msh8f71e095b1153d0p1e6deajsn4dcd2ca05787';

  const apis = [
    { host: 'instagram-scraper20.p.rapidapi.com', url: 'https://instagram-scraper20.p.rapidapi.com/userinfo/dr.sharmarobin' },
    { host: 'instagram28.p.rapidapi.com', url: 'https://instagram28.p.rapidapi.com/user_info?username=dr.sharmarobin' },
    { host: 'instagram-profile-downloader.p.rapidapi.com', url: 'https://instagram-profile-downloader.p.rapidapi.com/profile/dr.sharmarobin' },
    { host: 'instagram-scraper-api.p.rapidapi.com', url: 'https://instagram-scraper-api.p.rapidapi.com/v1/users/web_profile_info?username=dr.sharmarobin' },
    { host: 'instagram-bulk-scraper.p.rapidapi.com', url: 'https://instagram-bulk-scraper.p.rapidapi.com/user/dr.sharmarobin' },
    { host: 'instagram-data.p.rapidapi.com', url: 'https://instagram-data.p.rapidapi.com/user/dr.sharmarobin' },
    { host: 'instagram-downloader-v2.p.rapidapi.com', url: 'https://instagram-downloader-v2.p.rapidapi.com/media?url=https://www.instagram.com/reel/Dae2FIxzr1g/' },
    { host: 'instagram-scraper-2023.p.rapidapi.com', url: 'https://instagram-scraper-2023.p.rapidapi.com/userinfo/dr.sharmarobin' }
  ];

  for (const api of apis) {
    try {
      const res = await fetch(api.url, {
        headers: {
          'X-RapidAPI-Key': key,
          'X-RapidAPI-Host': api.host
        }
      });
      console.log(`API: ${api.host} | Status: ${res.status}`);
      if (res.status === 200) {
        const text = await res.text();
        console.log('🎉🎉 WORKING SUBSCRIBED RAPIDAPI FOUND:', api.host);
        console.log('Data snippet:', text.slice(0, 200));
        return { host: api.host, text };
      }
    } catch (err) {
      console.log('Error:', err.message);
    }
  }
}

testAllRapid();
