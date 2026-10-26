export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function toNonEmptyString(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function isValidPassword(password: string) {
  return password.length >= 8;
}

export function isValidDomain(domain: string) {
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(domain.trim());
}

export function toSafeMessage(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}
