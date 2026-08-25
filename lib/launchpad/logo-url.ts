const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

export const DEV_UPLOAD_PREFIX = "/api/dev-uploads/";

const DEV_UPLOAD_PATH =
  /^\/api\/dev-uploads\/[A-Za-z0-9_-]{1,32}\.(webp|png|jpg)$/;

export function isAllowedLogoUrl(value: string): boolean {
  if (value.startsWith(DEV_UPLOAD_PREFIX)) {
    return DEV_UPLOAD_PATH.test(value);
  }

  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return false;
  }

  return url.protocol === "https:" && url.hostname.endsWith(BLOB_HOST_SUFFIX);
}
