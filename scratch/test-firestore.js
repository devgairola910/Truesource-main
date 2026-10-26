const admin = require("firebase-admin");
const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
if (sa.private_key) sa.private_key = sa.private_key.replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert(sa)
});

const db = admin.firestore();

async function test() {
  try {
    console.log("Testing Firestore connectivity...");
    const snapshot = await db.collection("assets").limit(1).get();
    console.log("Success! Found", snapshot.size, "assets.");
    
    console.log("Testing getSession with empty string...");
    try {
      await db.collection("sessions").doc("").get();
    } catch (err) {
      console.log("Error caught for empty doc ID:", err.message);
    }
  } catch (err) {
    console.error("Connectivity failed:", err);
  }
}

test();
