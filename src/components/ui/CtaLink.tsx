import { ArrowRight } from "lucide-react";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface CtaLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  tone?: "light" | "dark";
}

/** Primary action: a squared bar; red fills in from the left on hover / focus. */
export function CtaLink({ href, tone = "dark", className, children, ...rest }: CtaLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex min-h-13 items-center gap-6 overflow-hidden rounded-[2px] px-6 font-display text-[0.9375rem] font-semibold tracking-[0.02em] [font-stretch:110%]",
        tone === "dark" ? "bg-ink text-white" : "bg-white text-ink",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 origin-left scale-x-0 bg-red transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
      <span className="relative transition-colors duration-300 group-hover:text-white group-focus-visible:text-white">
        {children}
      </span>
      <ArrowRight
        aria-hidden="true"
        className="relative size-4 transition-[translate,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1 group-hover:text-white"
        strokeWidth={1.75}
      />
    </a>
  );
}
