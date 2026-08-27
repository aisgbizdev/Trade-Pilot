// Store-readiness (P2-B3): native push (FCM HTTP v1) delivery, kept
// entirely separate from — and independent of — the existing Web Push
// (VAPID) implementation in `lib/webpush.ts`. Mirrors that file's shape
// deliberately: same "load device rows -> send -> clean up dead tokens on
// error" structure, so the two channels stay easy to reason about side by
// side.
//
// Auth: `google-auth-library`'s `GoogleAuth` + Application Default
// Credentials (ADC) — NOT the Firebase Admin SDK (not a dependency here,
// and not needed just to call the plain HTTP v1 REST endpoint with an
// OAuth2 bearer token). In production this means a service-account
// attached to the runtime environment; for local development, point
// `GOOGLE_APPLICATION_CREDENTIALS` at a service-account JSON file that is
// NOT committed to this repo.
import { GoogleAuth } from "google-auth-library";
import { db } from "./db";
import { nativePushDevices } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

const FCM_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const FCM_SEND_TIMEOUT_MS = 8_000;
const ANDROID_CHANNEL_ID = "trade_pilot_alerts";

const projectId = process.env["FIREBASE_PROJECT_ID"] || "";
const nativePushConfigured = Boolean(projectId);

if (!nativePushConfigured) {
  logger.warn(
    "FIREBASE_PROJECT_ID is missing. Native push (FCM) notifications are disabled. " +
      "Set it (and configure Application Default Credentials) to enable delivery.",
  );
}

// `GoogleAuth` caches/refreshes the ADC token internally — one instance is
// reused across every send rather than re-discovering credentials per call.
const auth = nativePushConfigured
  ? new GoogleAuth({ scopes: [FCM_SCOPE] })
  : null;

export interface NativePushPayload {
  title: string;
  body: string;
  /** Allowlisted tap-target — mirrors `NotificationActionType`. Sent as a
   * string in the FCM `data` payload (FCM data values must all be strings). */
  actionType?: string | null;
  actionId?: string | null;
  notificationId?: number | null;
}

/** Last 8 chars only — enough to correlate a log line with a DB row during
 * an incident without ever writing a usable token to the logs. */
function tokenSuffix(token: string): string {
  return token.length > 8 ? token.slice(-8) : token;
}

async function sendToDevice(
  token: string,
  platform: string,
  payload: NativePushPayload,
): Promise<void> {
  if (!auth) return;

  const data: Record<string, string> = {};
  if (payload.actionType) data["actionType"] = payload.actionType;
  if (payload.actionId) data["actionId"] = payload.actionId;
  if (payload.notificationId != null) data["notificationId"] = String(payload.notificationId);

  const message = {
    message: {
      token,
      notification: { title: payload.title, body: payload.body },
      data,
      android: {
        notification: { channel_id: ANDROID_CHANNEL_ID },
      },
      apns: {
        payload: {
          aps: { sound: "default", "content-available": 1 },
        },
      },
    },
  };

  const client = await auth.getClient();
  try {
    await client.request({
      url: `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      method: "POST",
      data: message,
      timeout: FCM_SEND_TIMEOUT_MS,
    });
  } catch (err: unknown) {
    const status = (err as { response?: { status?: number; data?: unknown } }).response?.status;
    // FCM reports an unregistered/invalid token via 404 (NOT_FOUND) or a
    // 400 UNREGISTERED error detail — either way the device is gone for
    // good, so we clean it up the same way `webpush.ts` retires dead Web
    // Push subscriptions on 410/404.
    if (status === 404 || status === 400) {
      await db.delete(nativePushDevices).where(eq(nativePushDevices.token, token));
      logger.info(
        { tokenSuffix: tokenSuffix(token), platform },
        "Removed invalid native push device token",
      );
      return;
    }
    logger.warn(
      { status, tokenSuffix: tokenSuffix(token), platform },
      "Failed to send native push notification",
    );
  }
}

/**
 * Send to every enabled device the user has registered. Best-effort and
 * silent on individual device failures (handled per-device above) — never
 * throws, so a caller doing `void sendNativePushToUser(...).catch(...)`
 * only ever observes a rejection for a truly unexpected error (e.g. the DB
 * query itself failing), matching `sendPushToUser`'s contract.
 */
export async function sendNativePushToUser(
  userId: number,
  payload: NativePushPayload,
): Promise<void> {
  if (!nativePushConfigured) return;

  const devices = await db
    .select()
    .from(nativePushDevices)
    .where(eq(nativePushDevices.userId, userId));

  const enabled = devices.filter((d) => d.enabled);
  for (const device of enabled) {
    await sendToDevice(device.token, device.platform, payload);
  }
}

export async function sendNativePushToUsers(
  userIds: number[],
  payload: NativePushPayload,
): Promise<void> {
  await Promise.all(userIds.map((id) => sendNativePushToUser(id, payload)));
}
