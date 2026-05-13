import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Panel({ children, className, title, action }: PropsWithChildren<{ className?: string; title?: string; action?: ReactNode }>) {
  return (
    <section className={cn("rounded-lg border border-[#303049] bg-[#12121C] shadow-[0_16px_40px_rgba(0,0,0,0.36),0_0_0_1px_rgba(167,139,250,0.04)]", className)}>
      {(title || action) && (
        <div className="flex min-h-12 items-center justify-between gap-3 border-b border-[#303049]/70 px-4 py-3">
          {title && <h2 className="text-sm font-semibold text-[#F8FAFC]">{title}</h2>}
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
