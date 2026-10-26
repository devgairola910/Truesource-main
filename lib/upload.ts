/**
 * Upload configuration, validation, and API helpers.
 */
import { getSession } from "@/lib/auth-client";

async function getAuthToken() {
  try {
    const { auth } = await import("@/lib/firebase");
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken(true);
    }
  } catch (e) {
    console.warn("Failed to get fresh Firebase token", e);
  }
  const session = getSession();
  return session?.idToken || session?.sessionToken;
}

// ─── Accepted file types ────────────────────────────────────────────
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/quicktime", // .mov
  "video/webm",
] as const;

export const ACCEPTED_TYPES = [
  ...ACCEPTED_IMAGE_TYPES,
  ...ACCEPTED_VIDEO_TYPES,
] as const;

/** Human-readable accept string for <input accept="…"> */
export const ACCEPT_STRING = ACCEPTED_TYPES.join(",");

/** Friendly labels for the drop-zone hint */
export const ACCEPTED_EXTENSIONS_LABEL = "JPG, PNG, WebP, GIF, MP4, MOV, WebM";

// ─── Size limits ────────────────────────────────────────────────────
export const MAX_FILE_SIZE = 50 * 1024 * 1024 * 1024; // 50 GB
export const MAX_FILE_SIZE_LABEL = "Unlimited";
export const MAX_FILES = 20;

// ─── Validation ─────────────────────────────────────────────────────
export type ValidationError = {
  file: File;
  reason: "type" | "size";
  message: string;
};

/**
 * Validates an array of `File` objects against the allowed types & size.
 * Returns `{ valid, errors }`.
 */
export function validateFiles(files: File[]): {
  valid: File[];
  errors: ValidationError[];
} {
  const valid: File[] = [];
  const errors: ValidationError[] = [];

  for (const file of files) {
    if (!(ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
      errors.push({
        file,
        reason: "type",
        message: `"${file.name}" is not a supported file type. Accepted: ${ACCEPTED_EXTENSIONS_LABEL}`,
      });
    } else if (file.size > MAX_FILE_SIZE) {
      errors.push({
        file,
        reason: "size",
        message: `"${file.name}" exceeds the ${MAX_FILE_SIZE_LABEL} limit.`,
      });
    } else {
      valid.push(file);
    }
  }

  return { valid, errors };
}

// ─── Upload item state ──────────────────────────────────────────────
export type UploadStatus = "queued" | "uploading" | "processing" | "done" | "error";

export type UploadFileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  mediaType: "image" | "video";
  progress: number; // 0-100
  status: UploadStatus;
  url?: string;
  error?: string;
  fingerprintId?: string | null;
  pHash?: string | null;
};


/** Derive media type from MIME */
export function getMediaType(file: File): "image" | "video" {
  return file.type.startsWith("video/") ? "video" : "image";
}

// ─── Simulated upload (mock backend) ────────────────────────────────
/**
 * Simulates uploading a file to the server with realistic progress ticks.
 * Calls `onProgress(0-100)` during the upload.
 *
 * In production, replace the body with a real `fetch`/`XMLHttpRequest`
 * upload to `/api/upload`.
 */
export function uploadFile(
  file: File,
  onProgress: (pct: number) => void,
  signal?: AbortSignal
): Promise<{ assetId: string }> {
  return new Promise((resolve, reject) => {
    let progress = 0;

    // Speed is proportional to file size (bigger = more ticks)
    const totalTicks = 15 + Math.floor(Math.random() * 10);
    const tickMs = 120 + Math.floor(Math.random() * 80);

    const timer = setInterval(() => {
      if (signal?.aborted) {
        clearInterval(timer);
        reject(new DOMException("Upload cancelled", "AbortError"));
        return;
      }

      const increment = Math.ceil(
        ((100 - progress) / (totalTicks - Math.floor(progress / (100 / totalTicks)))) *
          (0.7 + Math.random() * 0.6)
      );
      progress = Math.min(progress + increment, 100);
      onProgress(progress);

      if (progress >= 100) {
        clearInterval(timer);
        // Simulate a short "server processing" phase
        setTimeout(() => {
          // 5% chance of simulated failure for demo purposes
          if (Math.random() < 0.05) {
            reject(new Error("Server processing failed. Please retry."));
          } else {
            const assetId = `AST-${1000 + Math.floor(Math.random() * 9000)}`;
            resolve({ assetId });
          }
        }, 400);
      }
    }, tickMs);
  });
}

/**
 * Upload a file to the real API endpoint.
 * Uses XMLHttpRequest for native progress events.
 */
/**
 * Upload a file to the real API endpoint.
 * Automatically switches to Signed URL upload for videos or large files.
 */
export async function uploadFileToAPI(
  file: File,
  onProgress: (pct: number) => void,
  signal?: AbortSignal
): Promise<{ assetId: string; fileName: string; url?: string }> {
  // Use direct POST only for tiny files (under 1MB).
  // Everything else goes via Signed URL to bypass server limits and ensure reliability.
  const isLarge = file.size > 1 * 1024 * 1024; // 1MB

  if (isLarge) {
    return uploadViaSignedUrl(file, onProgress, signal);
  }

  return uploadViaDirectPost(file, onProgress, signal);
}

/**
 * Strategy 1: Direct POST to /api/upload
 * (Best for small images, limited by Next.js body limits)
 */
async function uploadViaDirectPost(
  file: File,
  onProgress: (pct: number) => void,
  signal?: AbortSignal
): Promise<{ assetId: string; fileName: string; url?: string }> {
  const token = await getAuthToken();

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        onProgress(pct);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch {
          resolve({ assetId: `AST-${Date.now()}`, fileName: file.name });
        }
      } else {
        let errorMessage = `Upload failed (HTTP ${xhr.status})`;
        try {
          const errorData = JSON.parse(xhr.responseText);
          if (errorData.details) {
            errorMessage = errorData.details;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // Fallback to default
        }
        reject(new Error(errorMessage));
      }
    });

    xhr.addEventListener("error", () => {
      console.error("Direct upload network error", xhr);
      reject(new Error("Network error during upload"));
    });
    xhr.addEventListener("abort", () => {
      console.warn("Upload aborted");
      reject(new DOMException("Upload cancelled", "AbortError"));
    });

    if (signal) {
      signal.addEventListener("abort", () => xhr.abort());
    }

    xhr.open("POST", "/api/upload");
    if (token) {
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    }
    xhr.send(formData);
  });
}

/**
 * Strategy 2: Get Signed URL from API, then PUT directly to GCS
 * (Required for large videos to bypass server limits)
 */
async function uploadViaSignedUrl(
  file: File,
  onProgress: (pct: number) => void,
  signal?: AbortSignal
): Promise<{ assetId: string; fileName: string; url?: string }> {
  try {
    const token = await getAuthToken();
    // 1. Get signed URL
    const signRes = await fetch(
      `/api/upload?fileName=${encodeURIComponent(file.name)}&contentType=${encodeURIComponent(file.type)}`,
      { 
        signal,
        headers: {
          "Authorization": `Bearer ${token || ""}`
        }
      }
    );
    
    if (!signRes.ok) {
      const err = await signRes.json();
      throw new Error(err.error || "Failed to get signed upload URL");
    }

    const { uploadUrl, publicUrl } = await signRes.json();

    // 2. Upload directly to GCS using PUT
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100);
          onProgress(pct);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            assetId: `AST-${Date.now()}`,
            fileName: file.name,
            url: publicUrl,
          });
        } else {
          reject(new Error(`GCS upload failed (HTTP ${xhr.status})`));
        }
      });

      xhr.addEventListener("error", (e) => {
        console.error("Signed URL upload network error:", e);
        reject(new Error("Network error during direct upload. This usually indicates a CORS issue on the GCS bucket."));
      });
      xhr.addEventListener("abort", () => {
        console.warn("Signed URL upload aborted");
        reject(new DOMException("Upload cancelled", "AbortError"));
      });

      if (signal) {
        signal.addEventListener("abort", () => xhr.abort());
      }

      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", file.type);
      xhr.send(file);
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw err;
    }
    throw new Error(err instanceof Error ? err.message : "Signed upload failed");
  }
}

