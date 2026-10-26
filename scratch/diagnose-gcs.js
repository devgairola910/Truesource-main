const { Storage } = require("@google-cloud/storage");
require('dotenv').config({ path: '.env.local' });

async function diagnose() {
  const BUCKET_NAME = "official-registry";
  const saJson = process.env.COMPUTE_SERVICE_ACCOUNT;
  
  console.log("--- GCS Diagnosis Start ---");
  console.log(`Target Bucket: ${BUCKET_NAME}`);
  
  if (!saJson) {
    console.error("Error: No Service Account JSON found in environment (checked GCP_SERVICE_ACCOUNT and FIREBASE_SERVICE_ACCOUNT)");
    return;
  }

  let config = {};
  try {
    const credentials = JSON.parse(saJson);
    config = {
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key?.replace(/\\n/g, "\n"),
      },
    };
    console.log("JSON Parsing: SUCCESS");
    console.log(`Project ID: ${credentials.project_id}`);
    console.log(`Client Email: ${credentials.client_email}`);
  } catch (err) {
    console.error("JSON Parsing: FAILED");
    console.error("Error Message:", err.message);
    console.log("\n[ADVICE] Ensure your Service Account JSON is a single-line string wrapped in single quotes in .env.local.");
    return;
  }

  const storage = new Storage(config);
  
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const [exists] = await bucket.exists();
    console.log(`Bucket '${BUCKET_NAME}' exists: ${exists}`);
    
    if (exists) {
      console.log("Connection: VERIFIED");
    } else {
      console.error("Error: Bucket not found. Check if the bucket name is correct and the account has access.");
    }
  } catch (err) {
    console.error("Connection: FAILED");
    console.error("Error Code:", err.code);
    console.error("Error Message:", err.message);
  }
  console.log("--- GCS Diagnosis End ---");
}

diagnose();
