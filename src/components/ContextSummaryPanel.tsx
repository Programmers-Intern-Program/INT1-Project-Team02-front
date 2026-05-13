import { ScrollText } from "lucide-react";
import { Panel } from "./ui/Panel";

interface ContextSummaryPanelProps {
  summary: string | null;
  version: number;
}

export function ContextSummaryPanel({ summary, version }: ContextSummaryPanelProps) {
  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ScrollText size={15} className="text-[#D7A86E]" />
          <span className="text-sm font-semibold text-[#F8FAFC]">진행 맥락</span>
        </div>
        {version > 0 && <span className="text-xs text-[#F2C98B]">업데이트 {version}</span>}
      </div>

      {summary ? (
        <p className="whitespace-pre-wrap text-sm leading-6 text-[#F8FAFC]">{summary}</p>
      ) : (
        <p className="text-sm leading-6 text-[#CBD5E1]">아직 요약이 생성되지 않았습니다. 대화가 쌓이면 자동으로 표시됩니다.</p>
      )}
    </Panel>
  );
}
