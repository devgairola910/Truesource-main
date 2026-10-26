import { listUsers } from "@/lib/backend/store";
import { jsonOk, requireAuth } from "@/lib/backend/http";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  const users = await listUsers();
  return jsonOk({ members: users });
}
