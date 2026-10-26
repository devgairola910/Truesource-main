import * as admin from "firebase-admin";

const saJson = process.env.FIREBASE_SERVICE_ACCOUNT;

let app: admin.app.App;

if (admin.apps.length === 0) {
  let credentials;
  if (saJson) {
    try {
      credentials = JSON.parse(saJson);
      // Ensure private_key handle newlines correctly if passed as env var
      if (credentials.private_key) {
        credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
      }
    } catch (err) {
      console.error("Firebase Admin SDK: Failed to parse Service Account JSON", err);
    }
  }

  app = admin.initializeApp({
    credential: credentials ? admin.credential.cert(credentials) : admin.credential.applicationDefault(),
    // Database URL is often required for some Firebase features, but not for Firestore.
    // However, it's good practice to provide it if available.
    databaseURL: `https://${credentials?.project_id || "truesource-application"}.firebaseio.com`,
  });
} else {
  app = admin.app();
}

export const db = admin.firestore();
export const auth = admin.auth();
export { app as firebaseAdmin };
