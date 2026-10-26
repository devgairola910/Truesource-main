import {
  addWhitelistDomain,
  listWhitelistDomains,
  removeWhitelistDomain,
} from "@/lib/backend/store";
import { jsonError, jsonOk, requireAuth } from "@/lib/backend/http";
import { isValidDomain, toNonEmptyString } from "@/lib/backend/validators";

type WhitelistPayload = {
  domain?: unknown;
  owner?: unknown;
  reason?: unknown;
};

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  return jsonOk({ domains: await listWhitelistDomains() });
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  let body: WhitelistPayload;
  try {
    body = (await request.json()) as WhitelistPayload;
  } catch {
    return jsonError("Invalid request payload.", 400);
  }

  const domain = toNonEmptyString(body.domain).toLowerCase();
  const owner = toNonEmptyString(body.owner);
  const reason = toNonEmptyString(body.reason);

  if (!domain || !owner || !reason) {
    return jsonError("domain, owner, and reason are required.", 400);
  }

  if (!isValidDomain(domain)) {
    return jsonError("Please provide a valid domain.", 400);
  }

  const created = await addWhitelistDomain({ domain, owner, reason });
  if (!created.ok) {
    return jsonError("Domain already exists in whitelist.", 409);
  }

  return jsonOk({ domain: created.record }, { status: 201 });
}

export async function DELETE(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  const url = new URL(request.url);
  const domain = toNonEmptyString(url.searchParams.get("domain"));

  if (!domain) {
    return jsonError("domain query parameter is required.", 400);
  }

  const removed = await removeWhitelistDomain(domain);
  if (!removed) {
    return jsonError("Domain not found.", 404);
  }

  return jsonOk({ message: "Domain removed from whitelist." });
}
