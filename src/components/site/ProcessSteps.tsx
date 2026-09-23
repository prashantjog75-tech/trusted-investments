import { processSteps } from "@/lib/content";

export function ProcessSteps({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {processSteps.map((s) => (
        <li
          key={s.step}
          className={
            dark
              ? "rounded-2xl border border-navy-foreground/10 bg-navy-deep/50 p-7"
              : "card-premium p-7"
          }
        >
          <div className="flex items-center justify-between">
            <span className={dark ? "font-display text-4xl text-gold/60" : "font-display text-4xl text-gold"}>{s.step}</span>
            <s.icon className={dark ? "h-6 w-6 text-gold" : "h-6 w-6 text-navy"} strokeWidth={1.5} />
          </div>
          <h3 className="mt-6 text-2xl font-medium">{s.title}</h3>
          <p className={dark ? "mt-2.5 text-sm leading-relaxed text-navy-foreground/70" : "mt-2.5 text-sm leading-relaxed text-muted-foreground"}>
            {s.body}
          </p>
        </li>
      ))}
    </ol>
  );
}
