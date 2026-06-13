const urlLikePattern =
  /^(https?:\/\/)?((localhost|127\.0\.0\.1)|([a-z0-9-]+\.)+[a-z]{2,})(:\d+)?(\/[^\s]*)?$/i;

export function extractInspectableUrl(rawValue: string): string | null {
  const trimmed = rawValue.trim();

  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^www\./i.test(trimmed) || urlLikePattern.test(trimmed)) {
    return `https://${trimmed.replace(/^\/+/, "")}`;
  }

  return null;
}

export function safeUrlHostname(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname;
  } catch {
    return "";
  }
}
