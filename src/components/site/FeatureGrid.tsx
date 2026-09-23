import type { Item } from "@/lib/content";
import { cn } from "@/lib/utils";

export function FeatureGrid({ items, columns = 3, className }: { items: Item[]; columns?: 2 | 3; className?: string }) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2", columns === 3 && "lg:grid-cols-3", className)}>
      {items.map((item) => (
        <article key={item.title} className="card-premium p-7">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-soft text-navy">
            <item.icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <h3 className="mt-5 text-xl font-medium">{item.title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
