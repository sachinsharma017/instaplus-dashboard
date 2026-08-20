
// Test ALL popular Instagram RapidAPIs to find which ones this key can access
const key = '5ca54dcc04msh8f71e095b1153d0p1e6deajsn4dcd2ca05787';
const shortcode = 'D7HR_3_NcCr';
const username = '_yati_shekhawat_';

const apis = [
  // Most popular ones
  { name: 'instagram-scraper-api2', url: `https://instagram-scraper-api2.p.rapidapi.com/v1/post_info?code_or_id_or_url=${shortcode}`, host: 'instagram-scraper-api2.p.rapidapi.com' },
  { name: 'instagram-scraper-api2 profile', url: `https://instagram-scraper-api2.p.rapidapi.com/v1/info?username_or_id_or_url=${username}`, host: 'instagram-scraper-api2.p.rapidapi.com' },
  { name: 'instagram-looter2', url: `https://instagram-looter2.p.rapidapi.com/post/?shortcode=${shortcode}`, host: 'instagram-looter2.p.rapidapi.com' },
  { name: 'instagram-looter2 profile', url: `https://instagram-looter2.p.rapidapi.com/profile/?username=${username}`, host: 'instagram-looter2.p.rapidapi.com' },
  { name: 'instagram-statistics-api', url: `https://instagram-statistics-api.p.rapidapi.com/community?url=https://www.instagram.com/${username}/`, host: 'instagram-statistics-api.p.rapidapi.com' },
  { name: 'instagram-data1', url: `https://instagram-data1.p.rapidapi.com/user/feed?username=${username}`, host: 'instagram-data1.p.rapidapi.com' },
  { name: 'rocketapi-for-instagram', url: `https://rocketapi-for-instagram.p.rapidapi.com/instagram/user/get_info`, host: 'rocketapi-for-instagram.p.rapidapi.com' },
  { name: 'instagram-social-api', url: `https://instagram-social-api.p.rapidapi.com/v1/user?username=${username}`, host: 'instagram-social-api.p.rapidapi.com' },
  { name: 'instagram-api-2022', url: `https://instagram-api-2022.p.rapidapi.com/ig/info_user/?username=${username}`, host: 'instagram-api-2022.p.rapidapi.com' },
  { name: 'instagram207', url: `https://instagram207.p.rapidapi.com/profile?username=${username}`, host: 'instagram207.p.rapidapi.com' },
  { name: 'instagram-media-downloader', url: `https://instagram-media-downloader.p.rapidapi.com/rapid/post?url=https://www.instagram.com/reel/${shortcode}/`, host: 'instagram-media-downloader.p.rapidapi.com' },
  { name: 'all-in-one-social-scraper', url: `https://all-in-one-social-scraper.p.rapidapi.com/scrape/instagram/user/${username}`, host: 'all-in-one-social-scraper.p.rapidapi.com' },
  { name: 'social-media-data', url: `https://social-media-data.p.rapidapi.com/social/instagram/user/?username=${username}`, host: 'social-media-data.p.rapidapi.com' },
  { name: 'instagram-pro1', url: `https://instagram-pro1.p.rapidapi.com/v2/profile?username=${username}`, host: 'instagram-pro1.p.rapidapi.com' },
];

console.log('Testing RapidAPI key on', apis.length, 'Instagram APIs...\n');

for (const api of apis) {
  try {
    const res = await fetch(api.url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': key,
        'x-rapidapi-host': api.host,
        'Content-Type': 'application/json'
      }
    });
    const text = await res.text();
    const notSubscribed = text.includes('not subscribed') || text.includes("doesn't exist");
    const status = notSubscribed ? '❌ NOT SUBSCRIBED' : `✅ WORKS! Status:${res.status}`;
    console.log(`[${api.name}] ${status}`);
    if (!notSubscribed) {
      console.log('  Response:', text.slice(0, 300));
    }
  } catch(e) {
    console.log(`[${api.name}] ERROR:`, e.message);
  }
}
