import { clsx } from "clsx";

type AlertVariant = "default" | "success" | "danger";

const variants: Record<AlertVariant, string> = {
  default: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
  success: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100",
  danger: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-100",
};

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
};

export function Alert({ className, variant = "default", ...props }: AlertProps) {
  return (
    <div
      role="status"
      className={clsx("rounded-lg p-4 text-sm", variants[variant], className)}
      {...props}
    />
  );
}
