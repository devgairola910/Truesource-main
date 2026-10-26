import { createHash, randomUUID } from "node:crypto";
import { db } from "@/lib/firebase-admin";
import {
  type AlertRecord,
} from "@/lib/types";
import type {
  AuthUser,
  ContactInquiry,
  CreateAssetInput,
  CreateUserInput,
  CreateWhitelistInput,
  DashboardSnapshot,
  LoginInput,
  SessionRecord,
  UpdateAlertStatusInput,
} from "@/lib/backend/types";
import { normalizeEmail } from "@/lib/backend/validators";

// ─── Collections ────────────────────────────────────────────────────
const USERS_COL = "users";
const SESSIONS_COL = "sessions";
const ASSETS_COL = "assets";
const ALERTS_COL = "alerts";
const KPIS_COL = "kpis";
const WHITELIST_COL = "whitelist";
const CONTACT_COL = "contact_inquiries";
const CANDIDATES_COL = "candidates";

function hashPassword(password: string) {
  return createHash("sha256").update(password).digest("hex");
}

// ─── Store Functions ────────────────────────────────────────────────

export async function createUser(input: CreateUserInput) {
  const email = normalizeEmail(input.email);
  const userRef = db.collection(USERS_COL).doc(email);
  const existing = await userRef.get();

  if (existing.exists) {
    return {
      ok: false as const,
      reason: "EMAIL_EXISTS" as const,
    };
  }

  const user: AuthUser = {
    id: randomUUID(),
    name: input.name.trim(),
    email,
    company: input.company.trim(),
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  await userRef.set(user);

  return {
    ok: true as const,
    user,
  };
}

export async function listUsers() {
  const snapshot = await db.collection(USERS_COL).get();
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => {
    const data = doc.data();
    // Don't leak passwords
    const { passwordHash, ...safeUser } = data;
    return safeUser;
  });
}

export async function authenticateUser(input: LoginInput) {
  const email = normalizeEmail(input.email);
  const userRef = db.collection(USERS_COL).doc(email);
  const doc = await userRef.get();

  if (!doc.exists) {
    return {
      ok: false as const,
      reason: "INVALID_CREDENTIALS" as const,
    };
  }

  const user = doc.data() as AuthUser;
  const matches = hashPassword(input.password) === user.passwordHash;
  
  if (!matches) {
    return {
      ok: false as const,
      reason: "INVALID_CREDENTIALS" as const,
    };
  }

  return {
    ok: true as const,
    user,
  };
}

export async function createSession(userId: string) {
  const token = randomUUID();
  const session: SessionRecord = {
    token,
    userId,
    createdAt: new Date().toISOString(),
  };

  await db.collection(SESSIONS_COL).doc(token).set(session);
  return session;
}

export async function getSession(token: string) {
  const doc = await db.collection(SESSIONS_COL).doc(token).get();
  if (!doc.exists) return undefined;
  return doc.data() as SessionRecord;
}

export async function deleteSession(token: string) {
  await db.collection(SESSIONS_COL).doc(token).delete();
  return true;
}

export async function getUserById(id: string) {
  const query = await db.collection(USERS_COL).where("id", "==", id).limit(1).get();
  if (query.empty) return undefined;
  return query.docs[0].data() as AuthUser;
}

export async function listAssets(userId: string) {
  const snapshot = await db.collection(ASSETS_COL).where("userId", "==", userId).get();
  if (snapshot.empty) {
    return [];
  }
  const assets = snapshot.docs.map(doc => doc.data() as any);
  return assets.sort((a, b) => b.id.localeCompare(a.id));
}

export async function addAsset(input: CreateAssetInput) {
  const id = `AST-${Math.floor(Math.random() * 9000) + 1000}`;
  const asset = {
    id,
    title: input.title.trim(),
    kind: input.kind,
    rightsOwner: input.rightsOwner.trim(),
    distributedTo: input.distributedTo.trim(),
    url: input.url ?? null,
    fingerprintId: input.fingerprintId ?? null,
    pHash: input.pHash ?? null,
    status: (input.fingerprintId || input.pHash) ? "protected" : ("fingerprinting" as const),
    lastUpdated: "just now",
    userId: input.userId,
  };

  await db.collection(ASSETS_COL).doc(id).set(asset);
  return asset;
}

export async function listCandidates() {
  const snapshot = await db.collection(CANDIDATES_COL).get();
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => doc.data());
}

export async function listAlerts() {
  const snapshot = await db.collection(ALERTS_COL).orderBy("id", "desc").get();
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => doc.data());
}

export async function getAlertById(alertId: string) {
  const doc = await db.collection(ALERTS_COL).doc(alertId).get();
  if (!doc.exists) return undefined;
  return doc.data();
}

export async function createAlert(input: Omit<AlertRecord, "id" | "detectedAt">) {
  const id = `INC-${Math.floor(Math.random() * 900000) + 100000}`;
  const alert: AlertRecord = {
    ...input,
    id,
    detectedAt: new Date().toISOString(),
  };
  await db.collection(ALERTS_COL).doc(id).set(alert);
  return alert;
}

export async function getAllAssets() {
  const snapshot = await db.collection(ASSETS_COL).get();
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => doc.data() as any);
}

export async function getAssetById(id: string) {
  const doc = await db.collection(ASSETS_COL).doc(id).get();
  if (!doc.exists) return undefined;
  return doc.data();
}

export async function updateAlertStatus(alertId: string, input: UpdateAlertStatusInput & { auditEntry?: any }) {
  const ref = db.collection(ALERTS_COL).doc(alertId);
  const doc = await ref.get();
  
  if (!doc.exists) return null;

  const updateData: any = { status: input.status };
  if (input.auditEntry) {
    const currentLog = (doc.data() as any).auditLog || [];
    updateData.auditLog = [...currentLog, input.auditEntry];
  }

  await ref.update(updateData);
  return { ...(doc.data() as any), ...updateData };
}

export async function listWhitelistDomains() {
  const snapshot = await db.collection(WHITELIST_COL).get();
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => doc.data());
}

export async function addWhitelistDomain(input: CreateWhitelistInput) {
  const domain = input.domain.trim().toLowerCase();
  const ref = db.collection(WHITELIST_COL).doc(domain);
  const existing = await ref.get();

  if (existing.exists) {
    return {
      ok: false as const,
      reason: "DOMAIN_EXISTS" as const,
    };
  }

  const record = {
    domain,
    owner: input.owner.trim(),
    reason: input.reason.trim(),
  };

  await ref.set(record);

  return {
    ok: true as const,
    record,
  };
}

export async function removeWhitelistDomain(domain: string) {
  const normalized = domain.trim().toLowerCase();
  const ref = db.collection(WHITELIST_COL).doc(normalized);
  const existing = await ref.get();
  if (!existing.exists) return false;
  
  await ref.delete();
  return true;
}

export async function listKpis() {
  const snapshot = await db.collection(KPIS_COL).get();
  if (snapshot.empty) return [];
  return snapshot.docs.map(doc => doc.data());
}

export async function createDashboardSnapshot(userId?: string): Promise<any> {
  const alerts = await listAlerts();
  const whitelist = await listWhitelistDomains();
  const candidates = await listCandidates();
  const assets = userId ? await listAssets(userId) : [];

  const openAlerts = alerts.filter((alert: any) => alert.status === "new").length;
  const confirmedToday = alerts.filter(
    (alert: any) => alert.status === "confirmed",
  ).length;

  return {
    metrics: [
      { label: "Open Alerts", value: String(openAlerts) },
      { label: "Confirmed Today", value: String(confirmedToday) },
      { label: "Suppressed Sources", value: String(whitelist.length) },
      {
        label: "Monitored Candidates",
        value: String(candidates.length),
      },
    ],
    assetStats: {
      total: assets.length,
      images: assets.filter(a => a.kind === "image").length,
      videos: assets.filter(a => a.kind === "video").length,
    },
    recentAlerts: alerts.slice(0, 5) as any[],
    recentAssets: assets.slice(0, 4) as any[],
  };
}

export async function saveContactInquiry(inquiry: Omit<ContactInquiry, "id" | "createdAt">) {
  const id = randomUUID();
  const record: ContactInquiry = {
    id,
    createdAt: new Date().toISOString(),
    ...inquiry,
  } as any;

  await db.collection(CONTACT_COL).doc(id).set(record);
  return record;
}

export async function listContactInquiries() {
  const snapshot = await db.collection(CONTACT_COL).get();
  return snapshot.docs.map(doc => doc.data());
}
