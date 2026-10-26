import { getAssetById, listAlerts } from "@/lib/backend/store";
import { jsonError, jsonOk, requireAuth } from "@/lib/backend/http";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { id } = await context.params;

  try {
    const asset = await getAssetById(id);
    if (!asset) {
      return jsonError("Asset not found", 404);
    }
    
    // Also fetch linked alerts for this asset
    const allAlerts = await listAlerts();
    const linkedAlerts = allAlerts.filter(a => a.matchedAssetId === id);

    return jsonOk({ asset, linkedAlerts });
  } catch (error) {
    console.error("Failed to fetch asset:", error);
    return jsonError("Internal server error", 500);
  }
}
