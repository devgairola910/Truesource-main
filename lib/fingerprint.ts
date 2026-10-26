import sharp from "sharp";

/**
 * Media Fingerprinting Service
 * 
 * Provides tools to embed and extract invisible fingerprints (steganography)
 * into media pixels for provenance tracking.
 */

const FINGERPRINT_PREFIX = "TS-"; // Truesource Prefix
const HEADER_SIZE = 32; // Number of pixels to store the payload length

/**
 * Generates a resilient perceptual hash (aHash) for an image.
 * This helps match media even if the invisible watermark is stripped.
 */
export async function generatePerceptualHash(buffer: Buffer): Promise<string> {
  const size = 8;
  const { data } = await sharp(buffer)
    .resize(size, size, { fit: "fill" })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let total = 0;
  for (let i = 0; i < data.length; i++) {
    total += data[i];
  }
  const avg = total / data.length;

  let hash = "";
  for (let i = 0; i < data.length; i++) {
    hash += data[i] >= avg ? "1" : "0";
  }

  // Convert binary string to hex for storage
  return BigInt("0b" + hash).toString(16).padStart(16, "0");
}

/**
 * Embeds a string payload into an image buffer.
 * Uses LSB (Least Significant Bit) steganography on the blue channel.
 */
export async function embedFingerprint(buffer: Buffer, payload: string): Promise<Buffer> {
  const fullPayload = FINGERPRINT_PREFIX + payload;
  const bits = stringToBits(fullPayload);
  
  // Get raw pixels
  const { data, info } = await sharp(buffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  
  // We use the Blue channel (usually index 2 in RGB/RGBA)
  // Blue is less sensitive to human eyes
  if (bits.length > data.length / channels) {
    throw new Error("Payload too large for this image");
  }

  // Clone the data to avoid mutation
  const modifiedData = Buffer.from(data);

  for (let i = 0; i < bits.length; i++) {
    const pixelIndex = i * channels;
    const blueIndex = pixelIndex + 2; // R=0, G=1, B=2
    
    // Clear the LSB and set it to our bit
    modifiedData[blueIndex] = (modifiedData[blueIndex] & 0xFE) | bits[i];
  }

  // Convert back to original format (or PNG for lossless)
  return await sharp(modifiedData, {
    raw: {
      width,
      height,
      channels
    }
  })
  .png() // Force PNG for lossless storage of bits
  .toBuffer();
}

/**
 * Extracts a string payload from an image buffer.
 */
export async function extractFingerprint(buffer: Buffer): Promise<string | null> {
  try {
    const { data, info } = await sharp(buffer)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { channels } = info;
    const bits: number[] = [];

    // Extract LSBs from the blue channel
    // We read enough pixels to potentially find our prefix and a reasonable ID
    const maxRead = Math.min(data.length / channels, 2000); 
    for (let i = 0; i < maxRead; i++) {
      const blueIndex = i * channels + 2;
      bits.push(data[blueIndex] & 1);
    }

    const fullString = bitsToString(bits);
    
    if (fullString.includes(FINGERPRINT_PREFIX)) {
      const parts = fullString.split(FINGERPRINT_PREFIX);
      // Return the part after the last prefix occurrence
      const payload = parts[parts.length - 1].replace(/\0/g, "");
      return payload.length > 0 ? payload : null;
    }

    return null;
  } catch (error) {
    console.error("Fingerprint extraction error:", error);
    return null;
  }
}

// ─── Utilities ──────────────────────────────────────────────────────

function stringToBits(s: string): number[] {
  const bits: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const charCode = s.charCodeAt(i);
    for (let j = 7; j >= 0; j--) {
      bits.push((charCode >> j) & 1);
    }
  }
  return bits;
}

function bitsToString(bits: number[]): string {
  let s = "";
  for (let i = 0; i < bits.length; i += 8) {
    let charCode = 0;
    for (let j = 0; j < 8; j++) {
      if (bits[i + j] === undefined) break;
      charCode = (charCode << 1) | bits[i + j];
    }
    s += String.fromCharCode(charCode);
  }
  return s;
}

/**
 * Calculates the Hamming distance between two hex strings (64-bit hashes).
 * Returns the number of differing bits.
 */
export function getHammingDistance(hex1: string, hex2: string): number {
  if (!hex1 || !hex2) return 64;
  let xor;
  try {
    xor = BigInt("0x" + hex1) ^ BigInt("0x" + hex2);
  } catch {
    return 64;
  }
  let distance = 0;
  while (xor > 0n) {
    distance += Number(xor & 1n);
    xor >>= 1n;
  }
  return distance;
}
