const fs = require('fs');
const content = fs.readFileSync('.env.local', 'utf-8');

// Find FIREBASE_SERVICE_ACCOUNT and COMPUTE_SERVICE_ACCOUNT
const firebaseMatch = content.match(/FIREBASE_SERVICE_ACCOUNT=({[\s\S]*?\n})/);
const computeMatch = content.match(/COMPUTE_SERVICE_ACCOUNT=({[\s\S]*?\n})/);

let newContent = content;

if (firebaseMatch) {
  const jsonStr = firebaseMatch[1];
  const obj = JSON.parse(jsonStr);
  newContent = newContent.replace(firebaseMatch[0], `FIREBASE_SERVICE_ACCOUNT='${JSON.stringify(obj)}'`);
}

if (computeMatch) {
  const jsonStr = computeMatch[1];
  const obj = JSON.parse(jsonStr);
  newContent = newContent.replace(computeMatch[0], `COMPUTE_SERVICE_ACCOUNT='${JSON.stringify(obj)}'`);
}

fs.writeFileSync('.env.local', newContent);
console.log('Fixed .env.local');
