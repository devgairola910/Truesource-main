import { NextResponse } from "next/server";
import { uploadToGCS, getSignedUploadUrl } from "@/lib/gcs";
import { embedFingerprint, generatePerceptualHash } from "@/lib/fingerprint";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/backend/http";

/**
 * GET /api/upload?fileName=...&contentType=...
 * Returns a signed URL for direct client-to-GCS upload.
 */
export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("fileName");
    const contentType = searchParams.get("contentType");

    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "fileName and contentType are required" },
        { status: 400 }
      );
    }

    const isImage = contentType.startsWith("image/");
    const isVideo = contentType.startsWith("video/");
    
    let prefix = "";
    if (isImage) prefix = "images/";
    else if (isVideo) prefix = "videos/";
    else prefix = "others/";

    const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const destination = `${prefix}${safeName}`;

    const signedUrl = await getSignedUploadUrl(destination, contentType);
    const publicUrl = `https://storage.googleapis.com/official-registry/${destination}`;

    return NextResponse.json({
      uploadUrl: signedUrl,
      publicUrl: publicUrl,
      fileName: fileName,
      destination: destination,
    });
  } catch (error) {
    console.error("Signed URL generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate signed upload URL" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log("POST /api/upload: Received request");
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Determine destination path based on media type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    
    let prefix = "";
    if (isImage) prefix = "images/";
    else if (isVideo) prefix = "videos/";
    else prefix = "others/";

    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const destination = `${prefix}${fileName}`;

    // Read file into buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let processedBuffer: Buffer = buffer;

    // Process media (Fingerprinting & Hashing)
    let fingerprintId = null;
    let pHash = null;

    if (isImage) {
      try {
        fingerprintId = `FP-${randomUUID().slice(0, 8)}`;
        pHash = await generatePerceptualHash(buffer);
        
        console.log(`Server: Embedding fingerprint ${fingerprintId} and generating pHash ${pHash}`);
        processedBuffer = await embedFingerprint(buffer, fingerprintId);
      } catch (err) {
        console.error("Fingerprinting failed, uploading original:", err);
      }
    }

    // Upload to GCS bucket: official-registry
    console.log(`Server: Uploading ${file.name} (${processedBuffer.length} bytes) to ${destination}`);
    const publicUrl = await uploadToGCS(processedBuffer, destination, file.type);
    console.log(`Server: Upload successful: ${publicUrl}`);

    return NextResponse.json({
      assetId: `AST-${Date.now()}`,
      fingerprintId,
      pHash,
      fileName: file.name,
      url: publicUrl,
      size: processedBuffer.length,
      success: true,
    });
  } catch (error) {
    console.error("Cloud Storage upload error:", error);
    
    // Check if it's a size limit issue
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("too large") || errorMessage.includes("limit")) {
      return NextResponse.json(
        { error: "File too large for direct upload. Using signed URLs is recommended for videos." },
        { status: 413 }
      );
    }

    return NextResponse.json(
      { 
        error: "Failed to upload file to cloud storage",
        details: errorMessage,
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    );
  }
}

