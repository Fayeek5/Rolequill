export const storageKeys = {
  authUsers: "rolequill:authUsers",
  authSession: "rolequill:authSession",
  savedJobs: "savedJobs",
  applications: "rolequill:applications",
  settings: "rolequill:settings",
  atsCache: "rolequill:atsCache",
  resumeVersions: "rolequill:resumeVersions",
  profile: "rolequill:profile",
  notifications: "rolequill:notifications",
} as const;

const userScopedKeys = new Set<string>([
  storageKeys.savedJobs,
  storageKeys.applications,
  storageKeys.settings,
  storageKeys.atsCache,
  storageKeys.resumeVersions,
  storageKeys.profile,
  storageKeys.notifications,
]);

export function scopedStorageKey(key: string) {
  if (!userScopedKeys.has(key)) return key;

  const session = readLocal<{ userId: string } | null>(
    storageKeys.authSession,
    null
  );

  return session?.userId ? `rolequill:user:${session.userId}:${key}` : key;
}

export function readLocal<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(scopedStorageKey(key));
    return value ? (JSON.parse(value) as T) : fallback;
  } catch (error) {
    console.error(`Could not read ${key}`, error);
    return fallback;
  }
}

export function writeLocal<T>(key: string, value: T) {
  try {
    localStorage.setItem(scopedStorageKey(key), JSON.stringify(value));
  } catch (error) {
    console.error(`Could not write ${key}`, error);
  }
}

export async function sha256(input: string) {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
