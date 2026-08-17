async function testReelUrl(shortcode) {
  const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;
  const postUrl = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'X-IG-App-ID': '936619743392459',
    'Accept': '*/*'
  };

  try {
    console.log('Testing Embed URL for Reel:', shortcode);
    const res = await fetch(embedUrl, { headers });
    const html = await res.text();

    // Parse caption, username, likes from embed page
    const usernameMatch = html.match(/class="UsernameText">([^<]+)<\/span>/i) || html.match(/"username":"([^"]+)"/i);
    const captionMatch = html.match(/class="CaptionText">([\s\S]*?)<\/div>/i) || html.match(/"caption":"([^"]+)"/i);
    const likesMatch = html.match(/class="SocialProof">([\s\S]*?)<\/div>/i) || html.match(/([0-9,kM]+)\s+likes/i);

    console.log('--- Embed Scraped Output ---');
    console.log('Username:', usernameMatch ? usernameMatch[1] : 'Not found in HTML');
    console.log('Caption snippet:', captionMatch ? captionMatch[1].slice(0, 100) : 'Not found');
    console.log('Likes text:', likesMatch ? likesMatch[1] : 'Not found');

    if (!usernameMatch) {
      console.log('\nHTML Length:', html.length);
      // Find any handle or title tag
      const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
      console.log('Page Title:', titleMatch ? titleMatch[1] : 'None');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

testReelUrl('Dae2FIxzr1g');
