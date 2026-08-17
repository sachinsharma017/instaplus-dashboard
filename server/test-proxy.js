async function testProxies() {
  const targetUrl = 'https://www.instagram.com/reel/C3x9Z12yAB_/';
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`
  ];

  for (const proxy of proxies) {
    try {
      console.log('Testing proxy:', proxy);
      const res = await fetch(proxy, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
      });
      const html = await res.text();
      const metaTitle = html.match(/<meta property="og:title" content="([^"]+)"/i);
      const metaDesc = html.match(/<meta property="og:description" content="([^"]+)"/i);
      console.log('Title:', metaTitle ? metaTitle[1] : 'None');
      console.log('Desc:', metaDesc ? metaDesc[1] : 'None');
      if (metaDesc) break;
    } catch (err) {
      console.log('Proxy error:', err.message);
    }
  }
}

testProxies();
