import { ScrollText } from "lucide-react";
import type { ContextProgressEvent } from "../api/types";
import { cn } from "../lib/utils";
import { Panel } from "./ui/Panel";

interface ContextSummaryPanelProps {
  summary: string | null;
  version: number;
  progress?: ContextProgressEvent | null;
}

function ContextProgressRing({ progress }: { progress: ContextProgressEvent }) {
  const radius = 6;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = Math.max(0, Math.min(100, progress.progressPercent));
  const strokeDashoffset = circumference * (1 - progressPercent / 100);
  const title = progress.compressionTriggered ? "요약 갱신 중" : `요약까지 ${progress.remainingPercent}% 남음`;
  const strokeClass = progress.compressionTriggered ? "stroke-[#F8DCA5]" : "stroke-[#F2C98B]";

  return (
    <span
      className={cn("inline-flex h-4 w-4 items-center justify-center", progress.compressionTriggered && "animate-pulse")}
      title={title}
      aria-label={title}
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4 -rotate-90" aria-hidden="true">
        <circle cx="8" cy="8" r={radius} fill="none" strokeWidth="2" className="stroke-[#475569]/70" />
        <circle
          cx="8"
          cy="8"
          r={radius}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className={strokeClass}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
    </span>
  );
}

export function ContextSummaryPanel({ summary, version, progress }: ContextSummaryPanelProps) {
  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText size={15} className="text-[#D7A86E]" />
          <span className="text-sm font-semibold text-[#F8FAFC]">진행 맥락</span>
        </div>
        <div className="flex items-center gap-2">
          {progress && <ContextProgressRing progress={progress} />}
          {version > 0 && <span className="text-xs text-[#F2C98B]">업데이트 {version}</span>}
        </div>
      </div>

      {summary ? (
        <p className="whitespace-pre-wrap text-sm leading-6 text-[#F8FAFC]">{summary}</p>
      ) : (
        <p className="text-sm leading-6 text-[#CBD5E1]">아직 요약이 생성되지 않았습니다. 대화가 쌓이면 자동으로 표시됩니다.</p>
      )}
    </Panel>
  );
}
