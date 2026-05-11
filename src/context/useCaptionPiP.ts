import { createContext, useContext } from "react";
import type { AiAnswerEvent, CaptionEvent } from "../api/types";
import type { CaptionConnectionStatus } from "../hooks/useMeetingCaptions";

export type CaptionPiPContextValue = {
  meetingId: number | null;
  endedMeetingId: number | null;
  isCaptionsVisible: boolean;
  isPiPOpen: boolean;
  isPiPSupported: boolean;
  captions: CaptionEvent[];
  currentPartials: Map<string, CaptionEvent>;
  connectionStatus: CaptionConnectionStatus;
  answers: AiAnswerEvent[];
  showCaptions: (meetingId: number) => void;
  hideCaptions: () => void;
  markMeetingEnded: (meetingId: number) => void;
  openPiP: () => Promise<void>;
  closePiP: () => void;
};

export const CaptionPiPContext = createContext<CaptionPiPContextValue | null>(null);

export function useCaptionPiP() {
  const ctx = useContext(CaptionPiPContext);
  if (!ctx) throw new Error("useCaptionPiP must be used within CaptionPiPProvider");
  return ctx;
}
