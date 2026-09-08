/**
 * Push a notification to a user via the server's WebSocket.
 * This calls the internal endpoint on the custom server which then
 * emits to the user's personal socket room.
 *
 * Should be called from API routes after creating a notification in the DB.
 */
export async function emitNotificationToUser(
  userId: string,
  notification: any,
) {
  try {
    const port = process.env.PORT || "3000";
    const baseUrl = `http://localhost:${port}`;

    await fetch(`${baseUrl}/__internal/push-notification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, notification }),
    });
  } catch (error) {
    // Non-critical: if WebSocket push fails, client will still get data on next fetch
    console.error("[emitNotificationToUser] Failed to push via socket:", error);
  }
}

/**
 * Push notifications to multiple users at once.
 */
export async function emitNotificationsToUsers(
  items: { userId: string; notification: any }[],
) {
  await Promise.allSettled(
    items.map(({ userId, notification }) =>
      emitNotificationToUser(userId, notification),
    ),
  );
}

/**
 * Broadcast an avatar update to all connected clients via WebSocket.
 */
export async function emitAvatarUpdate(userId: string, avatarUrl: string) {
  try {
    const port = process.env.PORT || "3000";
    const baseUrl = `http://localhost:${port}`;

    await fetch(`${baseUrl}/__internal/update-avatar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, avatarUrl }),
    });
  } catch (error) {
    console.error("[emitAvatarUpdate] Failed to push avatar update via socket:", error);
  }
}
