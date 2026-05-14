export function isSafeRedirectPath(value: string | null): value is string {
  if (!value) return false;
  if (!value.startsWith("/") || value.startsWith("//")) return false;
  if (/^https?:\/\//i.test(value)) return false;
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    if (code < 0x20 || code === 0x7f) return false;
  }
  return true;
}

export function getCurrentRedirectPath() {
  return `${window.location.pathname}${window.location.search}`;
}

export function buildLoginPath(redirectPath = getCurrentRedirectPath()) {
  if (!isSafeRedirectPath(redirectPath) || redirectPath === "/login" || redirectPath.startsWith("/login?")) {
    return "/login";
  }

  const params = new URLSearchParams({ redirect: redirectPath });
  return `/login?${params.toString()}`;
}
