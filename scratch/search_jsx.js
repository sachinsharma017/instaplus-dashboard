import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

walkDir('C:\\Users\\HP\\.gemini\\antigravity-ide\\scratch\\instagram-analytics-dashboard\\client\\src', (filePath) => {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.toLowerCase().includes('spotlight')) {
      console.log('MATCH IN:', filePath);
    }
  }
});
