import { LoaderCircle, Mic2, WifiOff } from "lucide-react";
import { useEffect, useRef } from "react";
import type { CaptionEvent } from "../api/types";
import type { CaptionConnectionStatus } from "../hooks/useMeetingCaptions";
import { Panel } from "./ui/Panel";

function ConnectionIndicator({ status }: { status: CaptionConnectionStatus }) {
  if (status === "connected") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-[#34D399]">
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-60" />
          <span className="relative inline-flex size-2 rounded-full bg-[#10B981]" />
        </span>
        LIVE
      </span>
    );
  }
  if (status === "connecting") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-[#FBBF24]">
        <LoaderCircle size={13} className="animate-spin" />
        연결 중
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
      <WifiOff size={13} />
      대기
    </span>
  );
}

interface CaptionOverlayProps {
  captions: CaptionEvent[];
  currentPartials: Map<string, CaptionEvent>;
  connectionStatus: CaptionConnectionStatus;
}

const SCROLL_THRESHOLD = 80;

export function CaptionOverlay({ captions, currentPartials, connectionStatus }: CaptionOverlayProps) {
  const partialList = Array.from(currentPartials.values());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [captions, currentPartials]);

  return (
    <Panel className={connectionStatus === "connected" ? "border-[#10B981]/35 shadow-[0_0_32px_rgba(16,185,129,0.12)]" : ""}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic2 size={16} className="text-[#34D399]" />
          <span className="text-sm font-semibold text-[#F8FAFC]">실시간 자막</span>
        </div>
        <ConnectionIndicator status={connectionStatus} />
      </div>

      <div ref={scrollRef} className="max-h-64 min-h-32 space-y-2 overflow-y-auto pr-1">
        {captions.map((caption, i) => (
          <div key={`${caption.sequence}-${i}`} className="rounded-md px-2 py-1.5 text-sm text-[#F8FAFC]">
            <span className="mr-2 inline-flex rounded border border-[#34D399]/30 bg-[#10B981]/10 px-1.5 py-0.5 text-xs font-medium text-[#A7F3D0]">
              {caption.speakerName}
            </span>
            <span className="leading-6">{caption.text}</span>
          </div>
        ))}
        {partialList.map((partial) => (
          <div key={partial.speakerDiscordId} className="rounded-md border border-[#A78BFA]/24 bg-[#A78BFA]/10 px-2 py-1.5 text-sm italic text-[#CBD5E1]">
            <span className="mr-2 inline-flex rounded border border-[#A78BFA]/35 bg-[#12121C] px-1.5 py-0.5 text-xs font-medium not-italic text-[#F8FAFC]">
              {partial.speakerName}
            </span>
            <span className="leading-6">{partial.text}</span>
          </div>
        ))}
      </div>

      {captions.length === 0 && partialList.length === 0 && <p className="text-sm text-[#CBD5E1]">발화를 기다리는 중입니다.</p>}
    </Panel>
  );
}
