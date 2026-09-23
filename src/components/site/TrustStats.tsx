import { trustStats } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function TrustStats({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <dl className={cn("grid grid-cols-2 gap-px overflow-hidden rounded-2xl border md:grid-cols-4", tone === "dark" ? "border-navy-foreground/10 bg-navy-foreground/10" : "border-border bg-border", className)}>
      {trustStats.map((s) => (
        <div
          key={s.label}
          className={cn("px-6 py-7 text-center", tone === "dark" ? "bg-navy-deep/60" : "bg-card")}
        >
          <dt className="sr-only">{s.label}</dt>
          <dd className={cn("font-display text-3xl font-semibold md:text-4xl", tone === "dark" ? "text-gold" : "text-navy")}>
            {s.value}
          </dd>
          <dd className={cn("mt-1 text-xs font-medium tracking-wide uppercase", tone === "dark" ? "text-navy-foreground/65" : "text-muted-foreground")}>
            {s.label}
          </dd>
        </div>
      ))}
    </dl>
  );
}
