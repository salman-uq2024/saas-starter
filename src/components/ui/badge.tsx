import { clsx } from "clsx";

type BadgeVariant = "default" | "success" | "danger" | "muted";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variants: Record<BadgeVariant, string> = {
  default: "bg-slate-900 text-white",
  success: "bg-emerald-500/10 text-emerald-600 ring-1 ring-inset ring-emerald-500/30",
  danger: "bg-red-500/10 text-red-600 ring-1 ring-inset ring-red-500/30",
  muted: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
