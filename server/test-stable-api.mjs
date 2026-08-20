
// Test EVERY possible endpoint on instagram-scraper-stable-api
const key = '5ca54dcc04msh8f71e095b1153d0p1e6deajsn4dcd2ca05787';
const host = 'instagram-scraper-stable-api.p.rapidapi.com';
const username = '_yati_shekhawat_';
const profileUrl = `https://www.instagram.com/${username}/`;
const reelUrl = 'https://www.instagram.com/reel/D7HR_3_NcCr/';

const postHeaders = {
  'x-rapidapi-key': key,
  'x-rapidapi-host': host,
  'Content-Type': 'application/x-www-form-urlencoded'
};

// All possible endpoints for "Instagram Scraper Stable API" - from RapidAPI listings
const endpoints = [
  // Profile/User endpoints
  { ep: 'get_ig_profile_v2.php', body: `username_or_url=${username}` },
  { ep: 'get_ig_user_v2.php', body: `username_or_url=${username}` },
  { ep: 'get_user_info_v2.php', body: `username_or_url=${username}` },
  { ep: 'get_ig_profile.php', body: `username_or_url=${profileUrl}` },
  { ep: 'ig_profile.php', body: `username_or_url=${username}` },
  { ep: 'profile.php', body: `username_or_url=${username}` },
  { ep: 'user.php', body: `username_or_url=${username}` },
  // Post/Media endpoints
  { ep: 'get_ig_media_v2.php', body: `url_or_shortcode=${reelUrl}` },
  { ep: 'get_ig_post_v2.php', body: `url_or_shortcode=${reelUrl}` },
  { ep: 'get_ig_reel_v2.php', body: `url_or_shortcode=${reelUrl}` },
  { ep: 'get_post.php', body: `url_or_shortcode=${reelUrl}` },
  { ep: 'get_media.php', body: `url_or_shortcode=${reelUrl}` },
  { ep: 'media.php', body: `url_or_shortcode=${reelUrl}` },
  // Followers/Following (we know this one works structure-wise)
  { ep: 'get_ig_user_followers_v2.php', body: `username_or_url=${profileUrl}&data=follower&amount=1` },
  { ep: 'get_ig_user_following_v2.php', body: `username_or_url=${profileUrl}&data=following&amount=1` },
  // Search
  { ep: 'search.php', body: `query=${username}` },
  { ep: 'get_ig_search.php', body: `query=${username}` },
];

console.log('Testing all endpoints on instagram-scraper-stable-api...\n');

for (const { ep, body } of endpoints) {
  try {
    const res = await fetch(`https://${host}/${ep}`, {
      method: 'POST',
      headers: postHeaders,
      body
    });
    const text = await res.text();
    
    if (res.status === 404 && text.includes("does not exist")) {
      console.log(`❌ [/${ep}] 404 - Not found`);
    } else if (text.includes("try again later")) {
      console.log(`⏳ [/${ep}] HTTP ${res.status} - Server busy (endpoint EXISTS)`);
    } else if (text.includes("not subscribed")) {
      console.log(`🔒 [/${ep}] Not subscribed`);
    } else {
      console.log(`\n✅ [/${ep}] HTTP ${res.status} - WORKING!`);
      console.log('Response:', text.slice(0, 600));
    }
  } catch(e) {
    console.log(`❌ [/${ep}] ERROR:`, e.message);
  }
}
