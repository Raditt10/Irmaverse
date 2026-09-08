"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/lib/socket";

// ==========================================
// Types
// ==========================================

export interface NotificationData {
  id: string;
  userId: string;
  type: "basic" | "invitation";
  status: "unread" | "read" | "accepted" | "rejected" | "expired";
  title: string;
  message: string;
  icon?: string | null;
  resourceType?: string | null;
  resourceId?: string | null;
  actionUrl?: string | null;
  inviteToken?: string | null;
  senderId?: string | null;
  sender?: {
    id: string;
    name: string | null;
    email: string;
    avatar?: string | null;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  loading: boolean;
  /** Refresh notifications from server */
  refresh: () => Promise<void>;
  /** Mark a single notification as read */
  markAsRead: (id: string) => Promise<void>;
  /** Mark all notifications as read */
  markAllAsRead: () => Promise<void>;
  /** Respond to an invitation notification (accept/reject) */
  respondToInvitation: (
    id: string,
    action: "accepted" | "rejected",
    reason?: string,
  ) => Promise<void>;
  /** Remove a notification from local state (optimistic) */
  dismiss: (id: string) => void;
  /** Delete a single notification from database & state */
  deleteNotification: (id: string) => Promise<boolean>;
  /** Delete multiple notifications from database & state */
  deleteNotifications: (ids: string[]) => Promise<boolean>;
  /** Delete all notifications from database & state */
  deleteAllNotifications: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}

// ==========================================
// Provider
// ==========================================

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { data: session, status: sessionStatus } = useSession();
  const { socket } = useSocket();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ------------------------------------------
  // Fetch all notifications on mount
  // ------------------------------------------
  const fetchNotifications = useCallback(async () => {
    if (sessionStatus !== "authenticated") return;

    try {
      const res = await fetch("/api/notifications?limit=100");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("[NotificationProvider] Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [sessionStatus]);

  // Initial fetch when authenticated
  useEffect(() => {
    if (sessionStatus === "authenticated") {
      fetchNotifications();
    } else if (sessionStatus === "unauthenticated") {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
    }
  }, [sessionStatus, fetchNotifications]);

  // ------------------------------------------
  // Listen for real-time notifications via WebSocket
  // ------------------------------------------
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: NotificationData) => {
      console.log(
        "[NotificationProvider] New notification via socket:",
        notification,
      );
      setNotifications((prev) => [notification, ...prev]);
      if (notification.status === "unread") {
        setUnreadCount((prev) => prev + 1);
      }
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket]);

  // ------------------------------------------
  // Sync with external updates (e.g. Invitation popups)
  // ------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleSync = () => {
      console.log("[NotificationProvider] Sync event detected, refreshing...");
      fetchNotifications();
    };

    window.addEventListener("invitationCountUpdate", handleSync);
    window.addEventListener("materialAction", handleSync);

    return () => {
      window.removeEventListener("invitationCountUpdate", handleSync);
      window.removeEventListener("materialAction", handleSync);
    };
  }, [fetchNotifications]);

  // ------------------------------------------
  // Actions
  // ------------------------------------------
  const markAsRead = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "read" }),
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, status: "read" as const } : n,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("[NotificationProvider] markAsRead error:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST", // mark-all-read
      });

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.status === "unread" ? { ...n, status: "read" as const } : n,
          ),
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("[NotificationProvider] markAllAsRead error:", error);
    }
  }, []);

  const respondToInvitation = useCallback(
    async (id: string, action: "accepted" | "rejected", reason?: string) => {
      try {
        const res = await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, status: action, reason }),
        });

        if (res.ok) {
          // Update local state immediately and atomically
          setNotifications((prev) => {
            const wasUnread = prev.find((n) => n.id === id)?.status === "unread";
            if (wasUnread) {
              setUnreadCount((count) => Math.max(0, count - 1));
            }
            
            return prev.map((n) => 
              n.id === id 
                ? { ...n, status: action as any, updatedAt: new Date().toISOString() } 
                : n
            );
          });

          // Refresh invitation count for other observers
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("invitationCountUpdate"));
          }
          // Trigger refresh jadwal kajian
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("materialAction"));
          }
        }
      } catch (error) {
        console.error(
          "[NotificationProvider] respondToInvitation error:",
          error,
        );
      }
    },
    [], // Removed notifications dependency as we use functional updates
  );

  const dismiss = useCallback((id: string) => {
    setNotifications((prev) => {
      const target = prev.find((n) => n.id === id);
      if (target?.status === "unread") {
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      // Optimistic update
      setNotifications((prev) => {
        const target = prev.find((n) => n.id === id);
        if (target?.status === "unread") {
          setUnreadCount((c) => Math.max(0, c - 1));
        }
        return prev.filter((n) => n.id !== id);
      });

      const res = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      return res.ok;
    } catch (error) {
      console.error("[NotificationProvider] deleteNotification error:", error);
      return false;
    }
  }, []);

  const deleteNotifications = useCallback(async (ids: string[]) => {
    if (!ids || ids.length === 0) return false;
    try {
      // Optimistic update
      setNotifications((prev) => {
        const unreadDeleted = prev.filter(
          (n) => ids.includes(n.id) && n.status === "unread",
        ).length;
        if (unreadDeleted > 0) {
          setUnreadCount((c) => Math.max(0, c - unreadDeleted));
        }
        return prev.filter((n) => !ids.includes(n.id));
      });

      const res = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      return res.ok;
    } catch (error) {
      console.error("[NotificationProvider] deleteNotifications error:", error);
      return false;
    }
  }, []);

  const deleteAllNotifications = useCallback(async () => {
    try {
      // Optimistic update
      setNotifications([]);
      setUnreadCount(0);

      const res = await fetch("/api/notifications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      return res.ok;
    } catch (error) {
      console.error("[NotificationProvider] deleteAllNotifications error:", error);
      return false;
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refresh: fetchNotifications,
        markAsRead,
        markAllAsRead,
        respondToInvitation,
        dismiss,
        deleteNotification,
        deleteNotifications,
        deleteAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
