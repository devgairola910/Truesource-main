import { listAlerts } from "@/lib/backend/store";
import { jsonOk, requireAuth } from "@/lib/backend/http";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status");

  const alerts = (await listAlerts()).filter((alert) => {
    if (!statusFilter) {
      return true;
    }

    return alert.status === statusFilter;
  });

  return jsonOk({ alerts });
}
