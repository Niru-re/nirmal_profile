/**
 * Supabase Storage URL helpers.
 * Converts a storage path like "analytics-demo.mp4" into a full public URL.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";

/**
 * Returns the public URL for a file in a Supabase Storage bucket.
 * If the value is already an absolute URL (http/https), returns it unchanged —
 * so local /public paths still work as fallbacks.
 */
export function storageUrl(bucket: string, path: string): string {
  if (!path) return "";

  const normalizedPath = path.trim();

  // Already a full URL, a signed URL, or a local /public path — return as-is.
  if (
    normalizedPath.startsWith("http://") ||
    normalizedPath.startsWith("https://") ||
    normalizedPath.startsWith("/") ||
    normalizedPath.startsWith("data:")
  ) {
    return normalizedPath;
  }

  // If the value already points at the public storage endpoint, preserve it.
  if (normalizedPath.includes("/storage/v1/object/public/")) {
    return normalizedPath;
  }

  const cleanBucket = bucket.trim();
  const cleanPath = normalizedPath.replace(/^\/+/, "");

  // If the bucket is not configured, fall back to a public path under /public.
  if (!SUPABASE_URL) {
    return `/${cleanBucket}/${cleanPath}`;
  }

  // Avoid duplicating the bucket prefix if the incoming path already includes it.
  if (cleanPath === cleanBucket || cleanPath.startsWith(`${cleanBucket}/`)) {
    return `${SUPABASE_URL}/storage/v1/object/public/${cleanPath}`;
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${cleanBucket}/${cleanPath}`;
}

export const videoUrl = (path: string) => storageUrl("videos", path);
export const thumbnailUrl = (path: string) => storageUrl("thumbnails", path);
export const projectImageUrl = (path: string) => storageUrl("projects", path);
export const certificateImageUrl = (path: string) => storageUrl("certificates", path);
