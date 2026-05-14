import type { AuthUser, StoredAuthUser } from "../types";
import { readLocal, sha256, storageKeys, writeLocal } from "./localStore";

type AuthSession = {
  userId: string;
  signedInAt: string;
};

const demoOtp = "246810";

export function getAuthUsers() {
  return readLocal<StoredAuthUser[]>(storageKeys.authUsers, []);
}

export function getCurrentUser(): AuthUser | null {
  const session = readLocal<AuthSession | null>(storageKeys.authSession, null);
  if (!session) return null;

  const user = getAuthUsers().find((candidate) => candidate.id === session.userId);
  return user ? sanitizeUser(user) : null;
}

export async function signUpWithEmail({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getAuthUsers();

  if (!normalizedEmail || !password || password.length < 8) {
    throw new Error("Use a valid email and a password with at least 8 characters.");
  }

  if (users.some((user) => user.email?.toLowerCase() === normalizedEmail)) {
    throw new Error("An account with this email already exists.");
  }

  const passwordSalt = crypto.randomUUID();
  const passwordHash = await sha256(`${passwordSalt}:${password}`);
  const user: StoredAuthUser = {
    id: crypto.randomUUID(),
    name: name.trim() || normalizedEmail.split("@")[0],
    email: normalizedEmail,
    provider: "email",
    passwordSalt,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  writeLocal(storageKeys.authUsers, [...users, user]);
  setSession(user.id);

  return sanitizeUser(user);
}

export async function loginWithEmail(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = getAuthUsers().find(
    (candidate) => candidate.email?.toLowerCase() === normalizedEmail
  );

  if (!user?.passwordSalt || !user.passwordHash) {
    throw new Error("No password account found for this email.");
  }

  const passwordHash = await sha256(`${user.passwordSalt}:${password}`);
  if (passwordHash !== user.passwordHash) {
    throw new Error("Email or password is incorrect.");
  }

  setSession(user.id);
  return sanitizeUser(user);
}

export function requestPhoneOtp(phone: string) {
  const normalizedPhone = normalizePhone(phone);
  if (normalizedPhone.length < 8) {
    throw new Error("Enter a valid phone number.");
  }

  localStorage.setItem(
    "rolequill:pendingPhoneOtp",
    JSON.stringify({ phone: normalizedPhone, code: demoOtp })
  );

  return demoOtp;
}

export function loginWithPhone(phone: string, code: string) {
  const normalizedPhone = normalizePhone(phone);
  const pending = readLocal<{ phone: string; code: string } | null>(
    "rolequill:pendingPhoneOtp",
    null
  );

  if (!pending || pending.phone !== normalizedPhone || pending.code !== code.trim()) {
    throw new Error("OTP is incorrect. Use the code shown after requesting OTP.");
  }

  const users = getAuthUsers();
  let user = users.find((candidate) => candidate.phone === normalizedPhone);

  if (!user) {
    user = {
      id: crypto.randomUUID(),
      name: `Candidate ${normalizedPhone.slice(-4)}`,
      phone: normalizedPhone,
      provider: "phone",
      createdAt: new Date().toISOString(),
    };
    writeLocal(storageKeys.authUsers, [...users, user]);
  }

  setSession(user.id);
  return sanitizeUser(user);
}

export function loginWithGoogleDemo() {
  const users = getAuthUsers();
  const email = "candidate.google@rolequill.local";
  let user = users.find((candidate) => candidate.email === email);

  if (!user) {
    user = {
      id: crypto.randomUUID(),
      name: "Google Candidate",
      email,
      provider: "google",
      createdAt: new Date().toISOString(),
    };
    writeLocal(storageKeys.authUsers, [...users, user]);
  }

  setSession(user.id);
  return sanitizeUser(user);
}

export function signOut() {
  localStorage.removeItem(storageKeys.authSession);
  window.dispatchEvent(new Event("rolequill:auth"));
}

function setSession(userId: string) {
  writeLocal<AuthSession>(storageKeys.authSession, {
    userId,
    signedInAt: new Date().toISOString(),
  });
  window.dispatchEvent(new Event("rolequill:auth"));
}

function sanitizeUser(user: StoredAuthUser): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    provider: user.provider,
    createdAt: user.createdAt,
  };
}

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}
