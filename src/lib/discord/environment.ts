export function getSearchValue(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

export function isEmbeddedInIframe() {
  if (typeof window === "undefined") return false;

  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function isDiscordActivityEnvironment() {
  return isEmbeddedInIframe() || getSearchValue("discord_activity") === "1";
}
