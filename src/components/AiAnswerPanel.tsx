import { AlertTriangle, Bot, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import { useState } from "react";
import type { AiAnswerEvent } from "../api/types";
import { Panel } from "./ui/Panel";

function AiAnswerCard({ event }: { event: AiAnswerEvent }) {
  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 1;
    const atTop = el.scrollTop < 1;
    const movingDown = e.deltaY > 0;
    if ((movingDown && !atBottom) || (!movingDown && !atTop)) {
      e.stopPropagation();
    }
  }

  return (
    <div className="max-h-48 space-y-2 overflow-y-auto" onWheel={handleWheel}>
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

export function AiAnswerPanel({ answers }: AiAnswerPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // react-hooks/refs가 render 중 ref 접근을 막으므로 state로 이전 길이를 추적
  // (render 중 setState는 React 공식 "adjusting state when props change" 패턴)
  const [prevLength, setPrevLength] = useState(answers.length);
  if (answers.length !== prevLength) {
    setPrevLength(answers.length);
    if (answers.length > prevLength) setCurrentIndex(0);
  }

  const reversed = [...answers].reverse();
  const total = reversed.length;
  const safeIndex = Math.min(currentIndex, Math.max(0, total - 1));

  const goNewer = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goOlder = () => setCurrentIndex((prev) => Math.min(prev + 1, total - 1));

  const handleWheel = (e: React.WheelEvent) => {
    const movingDown = e.deltaY > 0;
    const canMove = movingDown ? safeIndex < total - 1 : safeIndex > 0;
    if (!canMove) return;
    e.preventDefault();
    if (movingDown) goOlder();
    else goNewer();
  };

  return (
    <Panel>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot size={15} className="text-slate-500" />
          <span className="text-sm font-medium text-slate-800">AI 답변</span>
        </div>

        {total > 1 && (
          <div className="flex items-center gap-1">
            <button
              aria-label="최신 답변으로 이동"
              onClick={goNewer}
              disabled={safeIndex === 0}
              className="rounded p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="min-w-10 text-center text-xs text-slate-400">
              {safeIndex + 1} / {total}
            </span>
            <button
              aria-label="이전 답변으로 이동"
              onClick={goOlder}
              disabled={safeIndex === total - 1}
              className="rounded p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      <div onWheel={handleWheel}>
        {total === 0 ? (
          <p className="text-sm text-slate-400">회의 중 AI에게 질문하면 여기에 답변이 표시됩니다.</p>
        ) : (
          <AiAnswerCard event={reversed[safeIndex]} />
        )}
      </div>
    </Panel>
  );
}
