
const { Storage } = require('@google-cloud/storage');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkBuckets() {
  let storageConfig = {};
  const saJson = process.env.GCP_SERVICE_ACCOUNT;

  if (saJson) {
    const credentials = JSON.parse(saJson);
    storageConfig = {
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key?.replace(/\\n/g, '\n'),
      },
    };
  }

  const storage = new Storage(storageConfig);
  const buckets = ['official-registry', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET];

  for (const b of buckets) {
    if (!b) continue;
    try {
      const [exists] = await storage.bucket(b).exists();
      console.log(`Bucket ${b}: ${exists ? 'EXISTS' : 'DOES NOT EXIST'}`);
      if (exists) {
        const [files] = await storage.bucket(b).getFiles({ maxResults: 1 });
        console.log(`  Can list files: Yes`);
      }
    } catch (err) {
      console.log(`Bucket ${b}: ERROR - ${err.message}`);
    }
  }
}

checkBuckets();
