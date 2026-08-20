
const shortcode = 'D7HR_3_NcCr';

const res = await fetch('https://www.instagram.com/p/' + shortcode + '/embed/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
  }
});

const html = await res.text();

// Try JSON data embedded in script tags
const jsonMatch = html.match(/window\.__additionalData\s*=\s*(\{.+?\});/s) ||
                  html.match(/window\._sharedData\s*=\s*(\{.+?\});/s) ||
                  html.match(/"owner":\{"id":"[^"]+","username":"([^"]+)"/);

console.log('Status:', res.status);
console.log('JSON match:', jsonMatch ? jsonMatch[1]?.slice(0, 200) : 'none');

// Extract username
const usernameMatch = html.match(/"username":"([a-z0-9_.]+)"/i);
const playCount = html.match(/"play_count":(\d+)/);
const likeCount = html.match(/"like_count":(\d+)/);
const commentCount = html.match(/"comment_count":(\d+)/);
const fullName = html.match(/"full_name":"([^"]+)"/);
const followerCount = html.match(/"follower_count":(\d+)/);

console.log('username:', usernameMatch?.[1]);
console.log('full_name:', fullName?.[1]);
console.log('play_count:', playCount?.[1]);
console.log('like_count:', likeCount?.[1]);
console.log('comment_count:', commentCount?.[1]);
console.log('follower_count:', followerCount?.[1]);

// Show HTML sample
console.log('\n--- HTML SAMPLE (first 3000 chars) ---\n', html.slice(0, 3000));
