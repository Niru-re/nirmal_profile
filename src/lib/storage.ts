/**
 * Supabase Storage URL helpers.
 * Converts a storage path like "analytics-demo.mp4" into a full public URL.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/**
 * Returns the public URL for a file in a Supabase Storage bucket.
 * If the value is already an absolute URL (http/https), returns it unchanged —
 * so local /public paths still work as fallbacks.
 */
export function storageUrl(bucket: string, path: string): string {
  if (!path) return "";
  // Already a full URL or a local /public path — return as-is
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export const videoUrl = (path: string) => storageUrl("videos", path);
export const thumbnailUrl = (path: string) => storageUrl("thumbnails", path);
export const projectImageUrl = (path: string) => storageUrl("projects", path);
export const certificateImageUrl = (path: string) => storageUrl("certificates", path);
