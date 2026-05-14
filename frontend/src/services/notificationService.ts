import { readLocal, storageKeys, writeLocal } from "./localStore";
import type { Job, NotificationItem } from "../types";

export function readNotifications() {
  return readLocal<NotificationItem[]>(storageKeys.notifications, []);
}

export function pushNotification(
  notification: Omit<NotificationItem, "id" | "createdAt" | "read">
) {
  const notifications = readNotifications();
  const nextNotification: NotificationItem = {
    ...notification,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString(),
  };

  writeLocal(storageKeys.notifications, [nextNotification, ...notifications].slice(0, 50));
  window.dispatchEvent(new Event("rolequill:notifications"));

  return nextNotification;
}

export function createJobMatchNotifications(jobs: Job[]) {
  const existing = readNotifications();
  const existingKeys = new Set(existing.map((item) => item.message));
  const additions = jobs
    .slice(0, 3)
    .filter((job) => !existingKeys.has(`${job.title} at ${job.company}`))
    .map<NotificationItem>((job) => ({
      id: crypto.randomUUID(),
      title: "New matching role",
      message: `${job.title} at ${job.company}`,
      type: "Job Match",
      read: false,
      createdAt: new Date().toISOString(),
    }));

  if (additions.length > 0) {
    writeLocal(storageKeys.notifications, [...additions, ...existing].slice(0, 50));
    window.dispatchEvent(new Event("rolequill:notifications"));
  }
}
