import { clsx } from "clsx";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function EmptyState({ title, description, className, ...props }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-800/30 dark:text-slate-300",
        className,
      )}
      {...props}
    >
      <p className="text-sm font-semibold">{title}</p>
      {description ? <p className="max-w-md text-xs text-slate-500">{description}</p> : null}
    </div>
  );
}
