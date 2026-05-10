import { Wifi, WifiOff, LoaderCircle } from "lucide-react";
import { useMeetingCaptions, type CaptionConnectionStatus } from "../hooks/useMeetingCaptions";
import { Panel } from "./ui/Panel";

function ConnectionIndicator({ status }: { status: CaptionConnectionStatus }) {
  if (status === "connected") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-600">
        <Wifi size={13} />
        연결됨
      </span>
    );
  }
  if (status === "connecting") {
    return (
      <span className="flex items-center gap-1.5 text-xs text-amber-500">
        <LoaderCircle size={13} className="animate-spin" />
        연결 중
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-xs text-slate-400">
      <WifiOff size={13} />
      끊김
    </span>
  );
}

export function CaptionOverlay({ meetingId }: { meetingId: number }) {
  const { captions, currentPartials, connectionStatus } = useMeetingCaptions(meetingId);
  const partialList = Array.from(currentPartials.values());

  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-800">실시간 자막</span>
        <ConnectionIndicator status={connectionStatus} />
      </div>

      <div className="max-h-64 space-y-1 overflow-y-auto">
        {captions.map((caption, i) => (
          <div key={i} className="flex gap-2 rounded px-2 py-1 text-sm text-slate-700">
            <span className="shrink-0 font-medium text-slate-900">{caption.speakerName}</span>
            <span>{caption.text}</span>
          </div>
        ))}
        {partialList.map((partial) => (
          <div
            key={partial.speakerDiscordId}
            className="flex gap-2 rounded bg-slate-50 px-2 py-1 text-sm italic text-slate-400"
          >
            <span className="shrink-0 font-medium not-italic text-slate-500">{partial.speakerName}</span>
            <span>{partial.text}</span>
          </div>
        ))}
      </div>

      {captions.length === 0 && partialList.length === 0 && (
        <p className="text-sm text-slate-400">발화를 기다리는 중입니다...</p>
      )}
    </Panel>
  );
}
