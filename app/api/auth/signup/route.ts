import { createSession, createUser } from "@/lib/backend/store";
import { jsonError, jsonOk } from "@/lib/backend/http";
import {
  isValidEmail,
  isValidPassword,
  toNonEmptyString,
} from "@/lib/backend/validators";

type SignupPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  password?: unknown;
};

export async function POST(request: Request) {
  let body: SignupPayload;

  try {
    body = (await request.json()) as SignupPayload;
  } catch {
    return jsonError("Invalid request payload.", 400);
  }

  const name = toNonEmptyString(body.name);
  const email = toNonEmptyString(body.email);
  const company = toNonEmptyString(body.company);
  const password = toNonEmptyString(body.password);

  if (!name || !email || !company || !password) {
    return jsonError("All fields are required.", 400);
  }

  if (!isValidEmail(email)) {
    return jsonError("Please provide a valid work email.", 400);
  }

  if (!isValidPassword(password)) {
    return jsonError("Password must be at least 8 characters.", 400);
  }

  const created = await createUser({ name, email, company, password });
  if (!created.ok) {
    return jsonError(
      "An account with this email already exists. Please log in instead.",
      409,
    );
  }

  const session = await createSession(created.user.id);

  return jsonOk(
    {
      message: "Account created successfully.",
      user: {
        name: created.user.name,
        email: created.user.email,
        company: created.user.company,
      },
      sessionToken: session.token,
    },
    { status: 201 },
  );
}
