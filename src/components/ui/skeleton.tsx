import { clsx } from "clsx";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return <div className={clsx("animate-pulse rounded-md bg-slate-200 dark:bg-slate-700", className)} {...props} />;
}
