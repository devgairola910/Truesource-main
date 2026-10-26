import { addAsset, listAssets } from "@/lib/backend/store";
import { jsonError, jsonOk, requireAuth } from "@/lib/backend/http";
import { toNonEmptyString } from "@/lib/backend/validators";

type AssetPayload = {
  title?: unknown;
  kind?: unknown;
  rightsOwner?: unknown;
  distributedTo?: unknown;
  url?: unknown;
  fingerprintId?: unknown;
  pHash?: unknown;
};

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  return jsonOk({ assets: await listAssets(auth.user.id) });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  let body: AssetPayload;
  try {
    body = (await request.json()) as AssetPayload;
  } catch {
    return jsonError("Invalid request payload.", 400);
  }

  const title = toNonEmptyString(body.title);
  const kind = toNonEmptyString(body.kind);
  const rightsOwner = toNonEmptyString(body.rightsOwner);
  const distributedTo = toNonEmptyString(body.distributedTo);
  const url = typeof body.url === "string" ? body.url : undefined;
  const fingerprintId = typeof body.fingerprintId === "string" ? body.fingerprintId : undefined;
  const pHash = typeof body.pHash === "string" ? body.pHash : undefined;

  if (!title || !kind || !rightsOwner) {
    return jsonError("title, kind, and rightsOwner are required.", 400);
  }

  if (kind !== "image" && kind !== "video") {
    return jsonError("kind must be either image or video.", 400);
  }

  const asset = await addAsset({
    title,
    kind,
    rightsOwner,
    distributedTo,
    url,
    fingerprintId,
    pHash,
    userId: auth.user.id,
  });

  return jsonOk({ asset }, { status: 201 });
}
