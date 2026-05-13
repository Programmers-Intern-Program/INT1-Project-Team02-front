import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "../../lib/utils";

export function EmptyState({ title, description, icon, className }: { title: string; description?: string; icon?: ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-h-36 flex-col items-center justify-center rounded-md border border-dashed border-[#303049] bg-[#1B1B2A]/72 px-4 py-8 text-center", className)}>
      <div className="mb-3 flex size-10 items-center justify-center rounded-md border border-[#A78BFA]/30 bg-[#12121C] text-[#C4B5FD]">
        {icon ?? <Inbox size={18} />}
      </div>
      <p className="text-sm font-medium text-[#F8FAFC]">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm leading-6 text-[#CBD5E1]">{description}</p>}
    </div>
  );
}
