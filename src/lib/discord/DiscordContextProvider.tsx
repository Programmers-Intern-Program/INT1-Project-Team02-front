import { useMemo, type PropsWithChildren } from "react";
import { DiscordContext, type DiscordContextValue } from "./DiscordContext";

function getSearchValue(name: string) {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

export function DiscordContextProvider({ children }: PropsWithChildren) {
  const value = useMemo<DiscordContextValue>(() => {
    const mode = getSearchValue("discord_activity") === "1" ? "activity" : "web";

    return {
      mode,
      serverId: getSearchValue("server_id") ?? getSearchValue("guild_id"),
      channelId: getSearchValue("channel_id"),
      userId: getSearchValue("user_id"),
      isEmbedded: mode === "activity",
    };
  }, []);

  return <DiscordContext.Provider value={value}>{children}</DiscordContext.Provider>;
}
