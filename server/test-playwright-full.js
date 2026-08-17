import { fetchLiveInstagramData } from './services/realTimeInstagramScraper.js';

async function testFull() {
  console.log('--- TESTING REEL DAE2FIXZR1G FULL AUTOMATED EXTRACT ---');
  const result = await fetchLiveInstagramData('https://www.instagram.com/reel/Dae2FIxzr1g/');
  console.log('RESULT:', JSON.stringify(result, null, 2));
}

testFull();
