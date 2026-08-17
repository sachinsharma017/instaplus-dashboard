async function testEndpoints() {
  const key = '5ca54dcc04msh8f71e095b1153d0p1e6deajsn4dcd2ca05787';
  const targetUrl = 'https://www.instagram.com/reel/Dae2FIxzr1g/';
  const shortcode = 'Dae2FIxzr1g';

  const endpoints = [
    {
      url: `https://instagram-scraper-api2.p.rapidapi.com/v1/post_info?code_or_id_or_url=${encodeURIComponent(shortcode)}`,
      host: 'instagram-scraper-api2.p.rapidapi.com'
    },
    {
      url: `https://instagram-bulk-scraper-latest.p.rapidapi.com/web_profile_info?username=dr.sharmarobin`,
      host: 'instagram-bulk-scraper-latest.p.rapidapi.com'
    },
    {
      url: `https://instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com/get-info?url=${encodeURIComponent(targetUrl)}`,
      host: 'instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com'
    },
    {
      url: `https://instagram-data1.p.rapidapi.com/post/info?url=${encodeURIComponent(targetUrl)}`,
      host: 'instagram-data1.p.rapidapi.com'
    }
  ];

  for (const ep of endpoints) {
    try {
      console.log('Testing endpoint:', ep.host);
      const res = await fetch(ep.url, {
        headers: {
          'X-RapidAPI-Key': key,
          'X-RapidAPI-Host': ep.host
        }
      });
      const text = await res.text();
      console.log(`Status (${ep.host}):`, res.status);
      console.log(`Response Snippet (${ep.host}):`, text.slice(0, 250));
      if (res.status === 200 && text.startsWith('{')) {
        console.log('✅ MATCHED WORKING RAPIDAPI ENDPOINT:', ep.host);
      }
    } catch (err) {
      console.log('Error:', err.message);
    }
  }
}

testEndpoints();
