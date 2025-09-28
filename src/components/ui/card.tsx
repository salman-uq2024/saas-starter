import { clsx } from "clsx";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={clsx(
        "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={clsx("flex flex-col gap-1 border-b border-slate-200 p-6 dark:border-slate-800", className)} {...props} />;
}

export function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={clsx("text-base font-semibold text-slate-900 dark:text-slate-50", className)} {...props} />;
}

export function CardContent({ className, ...props }: CardContentProps) {
  return <div className={clsx("p-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardFooterProps) {
  return <div className={clsx("border-t border-slate-200 p-6 dark:border-slate-800", className)} {...props} />;
}
