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
    <div className="max-h-64 space-y-3 overflow-y-auto" onWheel={handleWheel}>
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm border border-[#303049] bg-[#1B1B2A] px-3 py-2">
          <p className="text-xs leading-5 text-[#CBD5E1]">{event.question}</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#A78BFA]/18">
          <Bot size={12} className="text-[#C4B5FD]" />
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-[#4B3F72] bg-[#1A1830] px-3 py-2">
          {event.status === "PENDING" && (
            <p className="flex items-center gap-1.5 text-sm italic text-[#CBD5E1]">
              <LoaderCircle size={13} className="shrink-0 animate-spin text-[#A78BFA]" />
              {event.answer}
            </p>
          )}

          {event.status === "COMPLETED" && (
            <div>
              <p className="text-sm leading-6 text-[#F8FAFC]">{event.answer}</p>
              <p className="mt-1 text-xs text-[#94A3B8]">{event.elapsedMs}ms</p>
            </div>
          )}

          {event.status === "FALLBACK" && (
            <p className="flex items-center gap-1.5 text-sm text-[#FBBF24]">
              <AlertTriangle size={13} className="shrink-0" />
              {event.answer}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface AiAnswerPanelProps {
  answers: AiAnswerEvent[];
}

export function AiAnswerPanel({ answers }: AiAnswerPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
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
          <Bot size={15} className="text-[#A78BFA]" />
          <span className="text-sm font-semibold text-[#F8FAFC]">AI 응답</span>
        </div>

        {total > 1 && (
          <div className="flex items-center gap-1">
            <button aria-label="최신 응답으로 이동" onClick={goNewer} disabled={safeIndex === 0} className="rounded p-0.5 text-[#CBD5E1] hover:text-[#F8FAFC] disabled:opacity-30">
              <ChevronLeft size={15} />
            </button>
            <span className="min-w-10 text-center text-xs text-[#CBD5E1]">{safeIndex + 1} / {total}</span>
            <button aria-label="이전 응답으로 이동" onClick={goOlder} disabled={safeIndex === total - 1} className="rounded p-0.5 text-[#CBD5E1] hover:text-[#F8FAFC] disabled:opacity-30">
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      <div onWheel={handleWheel}>
        {total === 0 ? <p className="text-sm leading-6 text-[#CBD5E1]">회의 중 AI에게 질문하면 여기에 답변이 표시됩니다.</p> : <AiAnswerCard event={reversed[safeIndex]} />}
      </div>
    </Panel>
  );
}
