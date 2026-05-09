import { DiscordSDK } from "@discord/embedded-app-sdk";
import { useEffect, useState, type PropsWithChildren } from "react";
import { DiscordContext, type DiscordContextValue } from "./DiscordContext";
import { getSearchValue, isDiscordActivityEnvironment, isEmbeddedInIframe } from "./environment";

function getDiscordClientId() {
  return import.meta.env.VITE_DISCORD_CLIENT_ID?.trim() ?? "";
}

function getInitialValue(): DiscordContextValue {
  const activityMode = isDiscordActivityEnvironment();
  const hasClientId = Boolean(getDiscordClientId());

  return {
    mode: activityMode ? "activity" : "web",
    sdkStatus: activityMode ? (hasClientId ? "loading" : "error") : "idle",
    sdkError: activityMode && !hasClientId ? "VITE_DISCORD_CLIENT_ID is not configured." : null,
    sdk: null,
    serverId: getSearchValue("server_id") ?? getSearchValue("guild_id"),
    channelId: getSearchValue("channel_id"),
    userId: getSearchValue("user_id"),
    isEmbedded: isEmbeddedInIframe(),
  };
}

export function DiscordContextProvider({ children }: PropsWithChildren) {
  const [value, setValue] = useState<DiscordContextValue>(() => getInitialValue());

  useEffect(() => {
    if (!isDiscordActivityEnvironment()) {
      return;
    }

    const clientId = getDiscordClientId();
    if (!clientId) {
      return;
    }

    let cancelled = false;
    const sdk = new DiscordSDK(clientId, { disableConsoleLogOverride: true });

    sdk
      .ready()
      .then(() => {
        if (cancelled) return;
        setValue((current) => ({
          ...current,
          mode: "activity",
          sdkStatus: "ready",
          sdkError: null,
          sdk,
          serverId: sdk.guildId ?? current.serverId,
          channelId: sdk.channelId ?? current.channelId,
          userId: current.userId,
          isEmbedded: isEmbeddedInIframe(),
        }));
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setValue((current) => ({
          ...current,
          mode: "activity",
          sdkStatus: "error",
          sdkError: error instanceof Error ? error.message : "Discord SDK failed to initialize.",
          sdk,
          serverId: sdk.guildId ?? current.serverId,
          channelId: sdk.channelId ?? current.channelId,
          isEmbedded: isEmbeddedInIframe(),
        }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <DiscordContext.Provider value={value}>{children}</DiscordContext.Provider>;
}
