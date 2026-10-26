import { createDashboardSnapshot } from "@/lib/backend/store";
import { jsonOk, requireAuth } from "@/lib/backend/http";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  return jsonOk({ snapshot: await createDashboardSnapshot(auth.user.id) });
}
