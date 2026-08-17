import fs from 'fs';

async function dumpEmbed() {
  const url = 'https://www.instagram.com/p/Da5MBxWvQ50/embed/captioned/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  const html = await res.text();
  fs.writeFileSync('server/embed_dump.html', html);
  console.log('Saved dump to server/embed_dump.html. Length:', html.length);

  // Search for any username pattern
  const userMatches = html.match(/\\?"username\\?":\\?"([^\\"]+)\\?"/g) || html.match(/"username":"([^"]+)"/g);
  console.log('User matches:', userMatches);

  // Search for any follower count / like count
  const countMatches = html.match(/"count":(\d+)/g);
  console.log('Count matches count:', countMatches ? countMatches.length : 0);
  if (countMatches) {
    console.log('First 10 count matches:', countMatches.slice(0, 10));
  }
}

dumpEmbed();
