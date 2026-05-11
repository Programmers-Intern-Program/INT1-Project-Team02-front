import { AlertTriangle, Bot, LoaderCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import type { AiAnswerEvent } from "../api/types";
import { Panel } from "./ui/Panel";

function AiAnswerRow({ event }: { event: AiAnswerEvent }) {
  return (
    <div className="space-y-1.5 border-b border-slate-100 py-3 last:border-0 last:pb-0 first:pt-0">
      <p className="text-xs text-slate-400">{event.question}</p>

      {event.status === "PENDING" && (
        <p className="flex items-center gap-1.5 text-sm italic text-slate-400">
          <LoaderCircle size={13} className="animate-spin shrink-0" />
          {event.answer}
        </p>
      )}

      {event.status === "COMPLETED" && (
        <div className="space-y-0.5">
          <p className="text-sm text-slate-800">{event.answer}</p>
          <p className="text-xs text-slate-400">{event.elapsedMs}ms</p>
        </div>
      )}

      {event.status === "FALLBACK" && (
        <p className="flex items-center gap-1.5 text-sm text-amber-600">
          <AlertTriangle size={13} className="shrink-0" />
          {event.answer}
        </p>
      )}
    </div>
  );
}

interface AiAnswerPanelProps {
  answers: AiAnswerEvent[];
}

const SCROLL_THRESHOLD = 80;

export function AiAnswerPanel({ answers }: AiAnswerPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < SCROLL_THRESHOLD;
    if (isNearBottom) {
      el.scrollTop = el.scrollHeight;
    }
  }, [answers]);

  return (
    <Panel>
      <div className="mb-3 flex items-center gap-2">
        <Bot size={15} className="text-slate-500" />
        <span className="text-sm font-medium text-slate-800">AI 답변</span>
      </div>

      <div ref={scrollRef} className="max-h-72 overflow-y-auto">
        {answers.length === 0 ? (
          <p className="text-sm text-slate-400">회의 중 AI에게 질문하면 여기에 답변이 표시됩니다.</p>
        ) : (
          answers.map((event) => <AiAnswerRow key={event.utteranceId} event={event} />)
        )}
      </div>
    </Panel>
  );
}
