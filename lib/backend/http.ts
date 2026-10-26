import { NextResponse } from "next/server";
import { auth as adminAuth } from "@/lib/firebase-admin";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    ...init,
  });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function extractBearerToken(request: Request) {
  const header = request.headers.get("authorization");
  if (!header) return null;

  const [scheme, token] = header.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;

  return token.trim();
}

export async function requireAuth(request: Request) {
  const token = extractBearerToken(request);
  
  if (!token || token === "null" || token === "undefined") {
    return {
      ok: false as const,
      response: jsonError("Authorization token is invalid or missing.", 401),
    };
  }

  try {
    // Verify the Firebase ID Token
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    return {
      ok: true as const,
      user: {
        id: decodedToken.uid,
        email: decodedToken.email || "",
        name: (decodedToken.name as string) || (decodedToken.email?.split("@")[0] as string) || "User",
      },
      decodedToken,
      token,
    };
  } catch (err: any) {
    console.error("requireAuth: Token verification failed:", err.code, err.message);
    return {
      ok: false as const,
      response: jsonError(`Authentication failed: ${err.message}`, 401),
    };
  }
}
