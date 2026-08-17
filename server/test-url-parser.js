import { extractUsernameOrShortcode } from './services/realTimeInstagramScraper.js';

const testUrls = [
  'https://www.instagram.com/_yati_shekhawat_/reels/?hl=en',
  'https://www.instagram.com/_yati_shekhawat_/',
  'https://www.instagram.com/_yati_shekhawat_',
  '@_yati_shekhawat_',
  '_yati_shekhawat_',
  'https://www.instagram.com/reel/Dbsj2NqIybS/?hl=en',
  'https://www.instagram.com/p/Dbsj2NqIybS/'
];

testUrls.forEach(url => {
  console.log(url, '=>', extractUsernameOrShortcode(url));
});
