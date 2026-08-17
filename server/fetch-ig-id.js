const TOKEN = process.env.META_ACCESS_TOKEN || 'LLM_2327021124790681_1zoTZy_KnjjOjdNRtE1tGRHTT7s';

async function getInstagramAccountId() {
  console.log('Step 1: Fetching linked Facebook Pages...');
  
  try {
    const pagesRes = await fetch(`https://graph.facebook.com/v19.0/me/accounts?access_token=${TOKEN}`);
    const pagesData = await pagesRes.json();
    
    console.log('Pages API Response:', JSON.stringify(pagesData, null, 2));
    
    if (pagesData.error) {
      console.error('ERROR:', pagesData.error.message);
      console.log('\nPossible issues:');
      console.log('1. Token expired - generate a new one at developers.facebook.com');
      console.log('2. Token does not have pages_show_list permission');
      return;
    }
    
    if (!pagesData.data || pagesData.data.length === 0) {
      console.log('No Facebook Pages found linked to this token.');
      console.log('Make sure your Instagram Business account is linked to a Facebook Page.');
      return;
    }
    
    // Try each page to find Instagram Business Account
    for (const page of pagesData.data) {
      console.log(`\nStep 2: Checking Page "${page.name}" (ID: ${page.id})...`);
      
      const igRes = await fetch(`https://graph.facebook.com/v19.0/${page.id}?fields=instagram_business_account&access_token=${TOKEN}`);
      const igData = await igRes.json();
      
      console.log('Instagram Account Response:', JSON.stringify(igData, null, 2));
      
      if (igData.instagram_business_account) {
        const igId = igData.instagram_business_account.id;
        console.log('\n========================================');
        console.log('SUCCESS! Your Instagram Business Account ID:');
        console.log(igId);
        console.log('========================================');
        console.log(`\nPaste this in your .env file:`);
        console.log(`INSTAGRAM_BUSINESS_ACCOUNT_ID=${igId}`);
        return igId;
      }
    }
    
    console.log('\nNo Instagram Business Account found on any linked Facebook Page.');
    console.log('Make sure your Instagram account is set to Business/Creator and linked to a Facebook Page.');
    
  } catch (err) {
    console.error('Network Error:', err.message);
  }
}

getInstagramAccountId();
