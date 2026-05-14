import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateTime(value?: string | null) {
  if (!value) return "-";
  // 백엔드가 Z 없이 UTC 시간을 내려줄 경우 Z를 붙여 올바른 KST로 변환
  const normalized = /[Zz]|[+-]\d{2}:\d{2}$/.test(value) ? value : value + "Z";
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeStr = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  if (diffDays === 0) return `오늘 ${timeStr}`;
  if (diffDays === 1) return `어제 ${timeStr}`;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function asArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

// "Discord 입코더 2026-05-14T02:26:22.909345438" 같은 제목에서
// ISO 타임스탬프를 제거하고 읽기 좋은 형식으로 변환
export function formatMeetingTitle(title: string | null | undefined, startedAt?: string | null): string {
  if (!title) return "회의";
  const isoMatch = title.match(/(\d{4}-\d{2}-\d{2}T[\d:.]+)/);
  if (!isoMatch) return title;
  const prefix = title.replace(isoMatch[0], "").trim();
  const dateStr = formatDateTime(startedAt ?? isoMatch[0]);
  return prefix ? `${prefix} · ${dateStr}` : dateStr;
}
