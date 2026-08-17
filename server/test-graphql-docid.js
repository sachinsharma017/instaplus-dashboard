async function testDirectGraphqlDocId() {
  const shortcode = 'Dae2FIxzr1g';
  
  // Instagram public doc_id for reel details query
  const docIds = [
    '8845758582119845',
    '10015901848480474',
    '5285215731539264'
  ];

  for (const id of docIds) {
    try {
      const url = `https://www.instagram.com/graphql/query/?doc_id=${id}&variables=${encodeURIComponent(JSON.stringify({ shortcode }))}`;
      console.log('Testing doc_id:', id);
      const res = await fetch(url, {
        headers: {
          'X-IG-App-ID': '936619743392459',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      const text = await res.text();
      console.log(`Status (${id}):`, res.status);
      console.log(`Snippet (${id}):`, text.slice(0, 300));
      if (text.includes('play_count') || text.includes('video_view_count') || text.includes('view_count')) {
        console.log('✅✅ MATCHED EXACT VIEWS IN GRAPHQL DOC_ID:', id);
      }
    } catch (e) {
      console.log('Err:', e.message);
    }
  }
}

testDirectGraphqlDocId();
