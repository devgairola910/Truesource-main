import { NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { extractFingerprint, generatePerceptualHash, getHammingDistance } from "@/lib/fingerprint";
import { requireAuth } from "@/lib/backend/http";

const ASSETS_COL = "assets";



export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 1. Try to extract invisible fingerprint
    const fingerprintId = await extractFingerprint(buffer);
    console.log(`Scan: Extracted fingerprint: ${fingerprintId}`);

    // 2. Generate perceptual hash for backup matching
    const pHash = await generatePerceptualHash(buffer);
    console.log(`Scan: Generated pHash: ${pHash}`);

    let match: any = null;
    let bestMatch: any = null;
    let lowestDistance = 64;

    // Search in Firestore
    if (fingerprintId) {
      const snapshot = await db.collection(ASSETS_COL)
        .where("fingerprintId", "==", fingerprintId)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        match = snapshot.docs[0].data();
        console.log(`Scan: Matched by fingerprint: ${match.id}`);
      }
    }

    let assetsSearched = 0;

    if (!match) {
      // Fetch assets for the user OR assets with no userId (legacy assets)
      const [userSnapshot, legacySnapshot] = await Promise.all([
        db.collection(ASSETS_COL).where("userId", "==", auth.user.id).get(),
        db.collection(ASSETS_COL).where("userId", "==", null).get()
      ]);
      
      const allDocs = [...userSnapshot.docs, ...legacySnapshot.docs];
      assetsSearched = allDocs.length;

      allDocs.forEach((doc) => {
        const asset = doc.data();
        if (asset.pHash) {
          const distance = getHammingDistance(pHash, asset.pHash);
          if (distance < lowestDistance) {
            lowestDistance = distance;
            bestMatch = asset;
          }
        }
      });

      const matchPercentage = Math.round(((64 - lowestDistance) / 64) * 100);

      if (bestMatch && matchPercentage > 65) {
        match = bestMatch;
        console.log(`Scan: Matched by fuzzy pHash (distance: ${lowestDistance}, ${matchPercentage}%): ${match.id}`);
      }
    }

    // Determine the final percentage to return
    let finalPercentage = 0;
    if (match) {
      if (fingerprintId) {
        finalPercentage = 100; // Exact fingerprint match is 100%
      } else {
        // Find distance for the match we found
        const dist = getHammingDistance(pHash, match.pHash);
        finalPercentage = Math.round(((64 - dist) / 64) * 100);
      }
    } else if (bestMatch) {
      // Even if it didn't pass the >65% threshold, return the highest similarity found
      finalPercentage = Math.round(((64 - lowestDistance) / 64) * 100);
    }

    return NextResponse.json({
      success: true,
      found: !!match,
      match: match || null,
      matchPercentage: finalPercentage,
      details: {
        extractedFingerprint: fingerprintId,
        generatedPHash: pHash,
        assetsSearched: assetsSearched,
      }
    });

  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json({ error: "Scan failed", details: String(error) }, { status: 500 });
  }
}
