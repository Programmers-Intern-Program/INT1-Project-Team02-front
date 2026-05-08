import { createContext, useContext } from "react";

export type DiscordMode = "web" | "activity";

export type DiscordContextValue = {
  mode: DiscordMode;
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
