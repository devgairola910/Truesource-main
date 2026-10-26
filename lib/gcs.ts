import { Storage } from "@google-cloud/storage";

// Initialize GCS storage client using the unified Service Account
let storageConfig = {};
const saJson = process.env.GCP_SERVICE_ACCOUNT || process.env.COMPUTE_SERVICE_ACCOUNT;

if (saJson) {
  try {
    const credentials = JSON.parse(saJson);
    storageConfig = {
      projectId: credentials.project_id,
      credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key?.replace(/\\n/g, "\n"),
      },
    };
  } catch (err) {
    console.error("Critical: Failed to parse Service Account JSON. Falling back to default credentials.", err);
  }
}

export const storage = new Storage(storageConfig);

export const BUCKET_NAME = "official-registry";

/**
 * Uploads a file buffer to a specific GCS bucket and path.
 */
export async function uploadToGCS(
  buffer: Buffer,
  destination: string,
  contentType: string
) {
  try {
    const bucket = storage.bucket(BUCKET_NAME);
    const file = bucket.file(destination);

    console.log(`Uploading to bucket: ${BUCKET_NAME}, path: ${destination}, type: ${contentType}`);

    await file.save(buffer, {
      metadata: {
        contentType: contentType,
      },
      resumable: buffer.length > 5 * 1024 * 1024, // Enable resumable for files > 5MB
    });

    return `https://storage.googleapis.com/${BUCKET_NAME}/${destination}`;
  } catch (error) {
    console.error("GCS Save Error:", error);
    throw error;
  }
}

/**
 * Generates a signed URL for direct client-side upload to GCS.
 * This bypasses the Next.js API body size limits.
 */
export async function getSignedUploadUrl(
  destination: string,
  contentType: string
) {
  const bucket = storage.bucket(BUCKET_NAME);
  const file = bucket.file(destination);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType: contentType,
  });

  return url;
}

