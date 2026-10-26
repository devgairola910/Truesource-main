import { jsonOk } from "@/lib/backend/http";

export async function GET() {
  return jsonOk({
    status: "ok",
    service: "truesource-backend",
    timestamp: new Date().toISOString(),
  });
}
