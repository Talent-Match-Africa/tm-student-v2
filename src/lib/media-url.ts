const DEFAULT_MEDIA_PUBLIC_BASE_URL =
  "https://res.cloudinary.com/talent-match/image/upload";
const URL_SCHEME_PATTERN = /^[a-z][a-z\d+.-]*:/i;

export function normalizeMediaUrl(value: string | null | undefined): string | null {
  const mediaPath = value?.trim();

  if (!mediaPath) {
    return null;
  }

  if (mediaPath.startsWith("//")) {
    return `https:${mediaPath}`;
  }

  if (URL_SCHEME_PATTERN.test(mediaPath)) {
    return isHttpUrl(mediaPath) ? mediaPath : null;
  }

  if (mediaPath.startsWith("/") && !mediaPath.startsWith("/media/")) {
    return mediaPath;
  }

  const mediaBaseUrl =
    process.env.NEXT_PUBLIC_MEDIA_PUBLIC_BASE_URL?.trim() ||
    DEFAULT_MEDIA_PUBLIC_BASE_URL;

  return `${mediaBaseUrl.replace(/\/+$/, "")}/${mediaPath.replace(/^\/+/, "")}`;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
