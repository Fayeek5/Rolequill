import { useEffect, useState } from "react";
import AppShell from "../components/AppShell";
import { readLocal, storageKeys, writeLocal } from "../services/localStore";
import type { NotificationItem } from "../types";

function Notifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    readLocal(storageKeys.notifications, [])
  );

  useEffect(() => {
    writeLocal(storageKeys.notifications, notifications);
  }, [notifications]);

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <AppShell>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-200">
            Notifications
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-normal">
            Matching and application alerts
          </h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Local notification center for matching jobs, saved job changes, and
            application follow-ups before email delivery is connected.
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="rounded-md border border-white/10 px-4 py-2 text-sm font-black text-slate-200 hover:bg-white/10"
        >
          Mark All Read
        </button>
      </section>

      <section className="grid gap-3">
        {notifications.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-8 text-center text-slate-400">
            No notifications yet. Matching jobs will appear here after Home
            loads.
          </div>
        ) : (
          notifications.map((notification) => (
            <article
              key={notification.id}
              className={`rounded-lg border p-4 ${
                notification.read
                  ? "border-white/10 bg-white/[0.03]"
                  : "border-amber-300/40 bg-amber-300/10"
              }`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-200">
                    {notification.type}
                  </p>
                  <h2 className="mt-2 text-lg font-black">{notification.title}</h2>
                  <p className="mt-1 text-slate-300">{notification.message}</p>
                </div>
                <span className="text-sm text-slate-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
            </article>
          ))
        )}
      </section>
    </AppShell>
  );
}

export default Notifications;
