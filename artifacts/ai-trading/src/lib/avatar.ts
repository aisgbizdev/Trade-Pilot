/**
 * Convert a stored avatar object path (e.g. "/objects/uploads/uuid") into
 * a fetchable URL routed through the artifact's API base path.
 */
export function avatarSrc(objectPath: string | null | undefined): string | null {
  if (!objectPath) return null;
  const base = (import.meta.env["BASE_URL"] || "/").replace(/\/$/, "");
  // Stored as "/objects/uploads/uuid" — served via /api/storage/objects/...
  const cleaned = objectPath.startsWith("/") ? objectPath.slice(1) : objectPath;
  return `${base}/api/storage/${cleaned}`;
}

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export type AvatarValidationError = "too_large" | "invalid_type";

export function validateAvatarFile(file: File): AvatarValidationError | null {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) return "invalid_type";
  if (file.size > MAX_AVATAR_BYTES) return "too_large";
  return null;
}

interface UploadResponse {
  uploadURL: string;
  objectPath: string;
}

/**
 * Two-step presigned upload: ask the server for a URL, then PUT the file
 * directly to GCS. Returns the canonical objectPath to store on the user.
 */
export async function uploadAvatar(file: File): Promise<string> {
  const base = (import.meta.env["BASE_URL"] || "/").replace(/\/$/, "");
  const res = await fetch(`${base}/api/storage/uploads/request-url`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      contentType: file.type || "application/octet-stream",
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error ?? "Failed to get upload URL");
  }
  const data = (await res.json()) as UploadResponse;

  const put = await fetch(data.uploadURL, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!put.ok) {
    throw new Error(`Upload failed (HTTP ${put.status})`);
  }
  return data.objectPath;
}
