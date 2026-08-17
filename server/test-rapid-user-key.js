async function checkUserKey() {
  const key = '5ca54dcc04msh8f71e095b1153d0p1e6deajsn4dcd2ca05787';
  const url = 'https://www.instagram.com/reel/Dae2FIxzr1g/';

  const hosts = [
    'instagram-scraper-api2.p.rapidapi.com',
    'instagram-bulk-scraper-latest.p.rapidapi.com',
    'instagram-downloader-download-instagram-videos-stories1.p.rapidapi.com',
    'instagram-data1.p.rapidapi.com',
    'instagram-looter2.p.rapidapi.com',
    'instagram-media-downloader.p.rapidapi.com',
    'instagram-reels-downloader.p.rapidapi.com',
    'instagram-scraper20.p.rapidapi.com',
    'instagram28.p.rapidapi.com',
    'instagram-profile-downloader.p.rapidapi.com',
    'instagram-scraper-api.p.rapidapi.com',
    'instagram-bulk-scraper.p.rapidapi.com',
    'instagram-data.p.rapidapi.com',
    'instagram-downloader-v2.p.rapidapi.com',
    'instagram-scraper-2023.p.rapidapi.com',
    'rocketapi-instagram.p.rapidapi.com',
    'instagram-api-20231.p.rapidapi.com',
    'instagram-statistics-api.p.rapidapi.com',
    'instagram-post-analytics.p.rapidapi.com',
    'instagram-scraper-2022.p.rapidapi.com'
  ];

  console.log('Testing user RapidAPI key across all hosts...');

  for (const host of hosts) {
    try {
      const testUrl = `https://${host}/`;
      const res = await fetch(testUrl, {
        headers: {
          'X-RapidAPI-Key': key,
          'X-RapidAPI-Host': host
        }
      });
      console.log(`Host: ${host} | Status: ${res.status}`);
      if (res.status !== 403 && res.status !== 401) {
        console.log('🎉🎉 SUBSCRIBED ACTIVE API HOST DETECTED:', host, 'Status:', res.status);
      }
    } catch (e) {
      console.log('Error testing host:', host, e.message);
    }
  }
}

checkUserKey();
