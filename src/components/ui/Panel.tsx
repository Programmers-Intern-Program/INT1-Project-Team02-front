import type { PropsWithChildren, ReactNode } from "react";
import { cn } from "../../lib/utils";

export function Panel({ children, className, title, action }: PropsWithChildren<{ className?: string; title?: string; action?: ReactNode }>) {
  return (
    <section className={cn("rounded-lg border border-slate-200 bg-white shadow-sm", className)}>
      {(title || action) && (
        <div className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          {title && <h2 className="text-sm font-semibold text-slate-900">{title}</h2>}
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}
