import type { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

type BadgeTone = "neutral" | "green" | "amber" | "red" | "blue";

const tones: Record<BadgeTone, string> = {
  neutral: "border-[#303049] bg-[#1B1B2A] text-[#CBD5E1]",
  green: "border-[#10B981]/60 bg-[#10B981]/10 text-[#34D399]",
  amber: "border-[#D7A86E]/70 bg-[#D7A86E]/14 text-[#F2C98B]",
  red: "border-[#F9A8D4]/60 bg-[#F9A8D4]/12 text-[#FBCFE8]",
  blue: "border-[#3B82F6]/60 bg-[#3B82F6]/14 text-[#BFDBFE]",
};

export function Badge({ children, tone = "neutral", className }: PropsWithChildren<{ tone?: BadgeTone; className?: string }>) {
  return <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium", tones[tone], className)}>{children}</span>;
}
