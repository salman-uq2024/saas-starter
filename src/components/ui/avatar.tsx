import { clsx } from "clsx";

interface AvatarProps {
  name: string;
  src?: string | null;
  className?: string;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ name, src, className }: AvatarProps) {
  if (src) {
    return (
      <span className={clsx("inline-flex h-9 w-9 overflow-hidden rounded-full", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} className="h-full w-full object-cover" />
      </span>
    );
  }

  return (
    <span
      className={clsx(
        "inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/10 text-sm font-medium text-slate-700 dark:bg-white/10 dark:text-white",
        className,
      )}
      aria-hidden
    >
      {getInitials(name || "User")}
    </span>
  );
}
