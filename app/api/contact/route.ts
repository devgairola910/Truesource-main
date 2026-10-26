import { listContactInquiries, saveContactInquiry } from "@/lib/backend/store";
import { jsonError, jsonOk, requireAuth } from "@/lib/backend/http";
import { isValidEmail, toSafeMessage } from "@/lib/backend/validators";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
};

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (!auth.ok) {
    return auth.response;
  }

  return jsonOk({ inquiries: listContactInquiries() });
}

export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return jsonError("Invalid JSON payload.", 400);
  }

  const name = toSafeMessage(body.name);
  const email = toSafeMessage(body.email);
  const company = toSafeMessage(body.company);
  const message = toSafeMessage(body.message);

  if (!name || !email || !company || !message) {
    return jsonError("All fields are required.", 400);
  }

  if (!isValidEmail(email)) {
    return jsonError("Please enter a valid email address.", 400);
  }

  if (message.length < 20) {
    return jsonError("Message should be at least 20 characters.", 400);
  }

  saveContactInquiry({
    name,
    email,
    company,
    message,
  });

  return jsonOk(
    {
      message:
        "Thanks for reaching out. Our team will contact you within one business day.",
    },
  );
}
