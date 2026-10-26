import { updateAlertStatus, getAlertById } from "@/lib/backend/store";
import { jsonError, jsonOk, requireAuth } from "@/lib/backend/http";
import { toNonEmptyString } from "@/lib/backend/validators";

type AlertPatchPayload = {
  status?: unknown;
};

type RouteParams = {
  params: Promise<{
    alertId: string;
  }>;
};

const validStatuses = new Set(["new", "confirmed", "dismissed", "whitelisted"]);

export async function GET(request: Request, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  const { alertId } = await params;
  const alert = await getAlertById(alertId);

  if (!alert) {
    return jsonError("Alert not found.", 404);
  }

  return jsonOk({ alert });
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  let body: AlertPatchPayload;
  try {
    body = (await request.json()) as AlertPatchPayload;
  } catch {
    return jsonError("Invalid request payload.", 400);
  }

  const status = toNonEmptyString(body.status);
  if (!validStatuses.has(status)) {
    return jsonError("status must be one of new, confirmed, dismissed, whitelisted.", 400);
  }

  const { alertId } = await params;
  const updated = await updateAlertStatus(alertId, {
    status: status as "new" | "confirmed" | "dismissed" | "whitelisted",
    auditEntry: {
      action: "Status updated",
      user: auth.user.email || "Unknown User",
      time: new Date().toISOString(),
      detail: `Status changed to ${status}`
    }
  });

  if (!updated) {
    return jsonError("Alert not found.", 404);
  }

  return jsonOk({ alert: updated });
}
