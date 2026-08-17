import * as cheerio from 'cheerio';

async function fetchGraphqlShortcode(shortcode) {
  // Instagram public graphql query hash for post details
  const queryHash = 'b308d084b7a733453535d30d70d4f514';
  const variables = JSON.stringify({ shortcode });
  const url = `https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=${encodeURIComponent(variables)}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*'
      }
    });

    console.log('Status:', res.status);
    const json = await res.json();
    console.log('GraphQL Response:', JSON.stringify(json).slice(0, 300));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fetchGraphqlShortcode('DcEPyJ5ucTF');
