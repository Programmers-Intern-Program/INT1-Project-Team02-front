import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { AiAnswerPanel } from "../components/AiAnswerPanel";
import { CaptionOverlay } from "../components/CaptionOverlay";
import { useAiAnswers } from "../hooks/useAiAnswers";
import { useDocumentPiP } from "../hooks/useDocumentPiP";
import { useMeetingCaptions } from "../hooks/useMeetingCaptions";
import { CaptionPiPContext } from "./useCaptionPiP";

export function CaptionPiPProvider({ children }: { children: React.ReactNode }) {
  const [meetingId, setMeetingId] = useState<number | null>(null);
  const [isCaptionsVisible, setIsCaptionsVisible] = useState(false);
  const [endedMeetingId, setEndedMeetingId] = useState<number | null>(null);

  const { openPiP: _openPiP, closePiP, pipWindow, isOpen: isPiPOpen, isSupported: isPiPSupported } = useDocumentPiP();

  const hideCaptions = useCallback(() => {
    setIsCaptionsVisible(false);
    closePiP();
  }, [closePiP]);

  const markMeetingEnded = useCallback(
    (endedId: number) => {
      setEndedMeetingId(endedId);
      setIsCaptionsVisible(false);
      closePiP();
    },
    [closePiP],
  );

  const captionMeetingId = isCaptionsVisible ? meetingId : null;
  const { captions, currentPartials, connectionStatus } = useMeetingCaptions(captionMeetingId, markMeetingEnded);
  // 자막 visibility와 무관하게 meetingId 기준으로 구독 — 자막 숨겨도 AI 답변 유지
  const { answers } = useAiAnswers(meetingId);

  const showCaptions = useCallback((id: number) => {
    setMeetingId(id);
    setEndedMeetingId((prev) => (prev === id ? null : prev));
    setIsCaptionsVisible(true);
  }, []);

  const openPiP = useCallback(() => _openPiP(), [_openPiP]);

  return (
    <CaptionPiPContext.Provider
      value={{
        meetingId,
        endedMeetingId,
        isCaptionsVisible,
        isPiPOpen,
        isPiPSupported,
        captions,
        currentPartials,
        connectionStatus,
        answers,
        showCaptions,
        hideCaptions,
        markMeetingEnded,
        openPiP,
        closePiP,
      }}
    >
      {children}
      {isPiPOpen &&
        pipWindow &&
        createPortal(
          <div className="space-y-3">
            <CaptionOverlay
              captions={captions}
              currentPartials={currentPartials}
              connectionStatus={connectionStatus}
            />
            {answers.length > 0 && <AiAnswerPanel answers={answers} />}
          </div>,
          pipWindow.document.body,
        )}
    </CaptionPiPContext.Provider>
  );
}
