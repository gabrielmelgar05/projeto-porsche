import { cn } from "@/lib/cn";

/** Section label above a headline. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("t-label", className)}>{children}</p>;
}
