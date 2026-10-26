export type AuthSession = {
  name: string;
  email: string;
  company: string;
  createdAt: string;
  sessionToken: string;
  idToken?: string;
};

const SESSION_KEY = "truesource.auth.session";
const LAST_VISITED_KEY = "truesource.last.visited";
const AUTH_EVENT = "truesource-auth-changed";

function isBrowser() {
  return typeof window !== "undefined";
}

let cachedRaw: string | null = null;
let cachedSession: AuthSession | null = null;

export function getSession() {
  if (!isBrowser()) {
    return null;
  }

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw === cachedRaw) {
    return cachedSession;
  }
  
  cachedRaw = raw;
  if (!raw) {
    cachedSession = null;
    return null;
  }

  try {
    cachedSession = JSON.parse(raw) as AuthSession;
    return cachedSession;
  } catch {
    cachedSession = null;
    return null;
  }
}

export function setSession(session: AuthSession) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearSession() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function onAuthChange(callback: () => void) {
  if (!isBrowser()) {
    return () => undefined;
  }

  window.addEventListener(AUTH_EVENT, callback);
  return () => window.removeEventListener(AUTH_EVENT, callback);
}

export function setLastVisitedPath(path: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(LAST_VISITED_KEY, path);
}

export function getLastVisitedPath() {
  if (!isBrowser()) {
    return null;
  }

  return window.localStorage.getItem(LAST_VISITED_KEY);
}
