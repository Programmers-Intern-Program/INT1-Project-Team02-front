import { createContext, useContext } from "react";
import type { DiscordSDK } from "@discord/embedded-app-sdk";

export type DiscordMode = "web" | "activity";
export type DiscordSdkStatus = "idle" | "loading" | "ready" | "error";

export type DiscordContextValue = {
  mode: DiscordMode;
  sdkStatus: DiscordSdkStatus;
  sdkError: string | null;
  sdk: DiscordSDK | null;
  serverId: string | null;
  channelId: string | null;
  userId: string | null;
  isEmbedded: boolean;
};

export const DiscordContext = createContext<DiscordContextValue | null>(null);

export function useDiscordContext() {
  const context = useContext(DiscordContext);
  if (!context) {
    throw new Error("useDiscordContext must be used within DiscordContextProvider");
  }
  return context;
}
