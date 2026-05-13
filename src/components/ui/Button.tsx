import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variants: Record<ButtonVariant, string> = {
  primary: "border-[#3B82F6] bg-[#3B82F6] text-white shadow-[0_0_24px_rgba(59,130,246,0.28)] hover:border-[#60A5FA] hover:bg-[#60A5FA]",
  secondary: "border-[#303049] bg-[#1B1B2A] text-[#F8FAFC] hover:border-[#A78BFA]/50 hover:bg-[#24243A]",
  ghost: "border-transparent bg-transparent text-[#CBD5E1] hover:bg-[#1B1B2A] hover:text-[#F8FAFC]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex h-9 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
