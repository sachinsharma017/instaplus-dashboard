import fs from 'fs';

async function dumpWorkingEmbed() {
  const url = 'https://www.instagram.com/p/Dbsj2NqIybS/embed/captioned/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  });
  const html = await res.text();
  console.log('Working Reel Embed Length:', html.length);
  const userMatches = html.match(/\\?"username\\?":\\?"([^\\"]+)\\?"/g) || html.match(/"username":"([^"]+)"/g);
  console.log('Working Reel User matches:', userMatches);
  const countMatches = html.match(/"count":(\d+)/g);
  console.log('Working Reel Count matches:', countMatches ? countMatches.slice(0, 5) : null);
}

dumpWorkingEmbed();
