import { authenticateUser, createSession } from "@/lib/backend/store";
import { jsonError, jsonOk } from "@/lib/backend/http";
import { isValidEmail, toNonEmptyString } from "@/lib/backend/validators";

type LoginPayload = {
  email?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let body: LoginPayload;

  try {
    body = (await request.json()) as LoginPayload;
  } catch {
    return jsonError("Invalid request payload.", 400);
  }

  const email = toNonEmptyString(body.email);
  const password = toNonEmptyString(body.password);

  if (!email || !password) {
    return jsonError("Email and password are required.", 400);
  }

  if (!isValidEmail(email)) {
    return jsonError("Please provide a valid email address.", 400);
  }

  const authenticated = await authenticateUser({ email, password });
  if (!authenticated.ok) {
    return jsonError("Invalid email or password.", 401);
  }

  const session = await createSession(authenticated.user.id);

  return jsonOk({
    message: "Logged in successfully.",
    user: {
      name: authenticated.user.name,
      email: authenticated.user.email,
      company: authenticated.user.company,
    },
    sessionToken: session.token,
  });
}
