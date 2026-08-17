async function findSubscribedApi() {
  const key = '5ca54dcc04msh8f71e095b1153d0p1e6deajsn4dcd2ca05787';

  const candidates = [
    { host: 'instagram-scraper-api2.p.rapidapi.com', url: 'https://instagram-scraper-api2.p.rapidapi.com/v1/post_info?code_or_id_or_url=Dae2FIxzr1g' },
    { host: 'instagram-looter2.p.rapidapi.com', url: 'https://instagram-looter2.p.rapidapi.com/post?url=https://www.instagram.com/reel/Dae2FIxzr1g/' },
    { host: 'instagram-scraper-2022.p.rapidapi.com', url: 'https://instagram-scraper-2022.p.rapidapi.com/ig/post_info/?shortcode=Dae2FIxzr1g' },
    { host: 'instagram-statistics-api.p.rapidapi.com', url: 'https://instagram-statistics-api.p.rapidapi.com/community' },
    { host: 'instagram-media-downloader.p.rapidapi.com', url: 'https://instagram-media-downloader.p.rapidapi.com/v2/post_info?url=https://www.instagram.com/reel/Dae2FIxzr1g/' },
    { host: 'instagram-api-20231.p.rapidapi.com', url: 'https://instagram-api-20231.p.rapidapi.com/api/post_info/Dae2FIxzr1g' },
    { host: 'instagram-reels-downloader.p.rapidapi.com', url: 'https://instagram-reels-downloader.p.rapidapi.com/reel?url=https://www.instagram.com/reel/Dae2FIxzr1g/' },
    { host: 'instagram-bulk-scraper-api.p.rapidapi.com', url: 'https://instagram-bulk-scraper-api.p.rapidapi.com/v1/post_info?url=https://www.instagram.com/reel/Dae2FIxzr1g/' }
  ];

  for (const c of candidates) {
    try {
      const res = await fetch(c.url, {
        headers: {
          'X-RapidAPI-Key': key,
          'X-RapidAPI-Host': c.host
        }
      });
      console.log(`Host: ${c.host} | Status: ${res.status}`);
      if (res.status === 200) {
        const text = await res.text();
        console.log('✅✅ ACTIVE SUBSCRIBED API FOUND:', c.host);
        console.log('Sample Output:', text.slice(0, 300));
        return { host: c.host, url: c.url, data: text };
      }
    } catch (err) {}
  }
}

findSubscribedApi();
