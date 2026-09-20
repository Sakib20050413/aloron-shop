const windows = new Map<string, number[]>();

export function rateLimit(key: string, limit = 15, windowMs = 60_000) {
  const now = Date.now();
  const recent = (windows.get(key) ?? []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= limit) {
    windows.set(key, recent);
    return false;
  }

  recent.push(now);
  windows.set(key, recent);
  return true;
}

export function resetRateLimits() {
  windows.clear();
}
