import { deleteSession } from "@/lib/backend/store";
import { jsonError, jsonOk, requireAuth } from "@/lib/backend/http";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  return jsonOk({
    user: {
      name: auth.user.name,
      email: auth.user.email,
      company: "Company", // Placeholder
    },
  });
}

export async function DELETE(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return jsonError("Session is already invalid.", 200);
  }

  // deleteSession is Firestore-based, we can keep it as a cleanup if needed
  // but with ID Tokens, logout is primarily client-side.
  await deleteSession(auth.token);
  return jsonOk({ message: "Logged out successfully." });
}
