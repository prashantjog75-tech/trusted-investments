import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  tone = "default",
  id,
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "ivory" | "navy";
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "section-pad",
        tone === "ivory" && "bg-ivory-gradient",
        tone === "navy" && "bg-navy-gradient text-navy-foreground",
        className,
      )}
    >
      <div className="container-site">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-3xl font-medium sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">{title}</h2>
      <span className={cn("gold-rule mt-5", align === "center" && "mx-auto")} />
      {lead && <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">{lead}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return (
    <section className="bg-navy-gradient grain text-navy-foreground">
      <div className="container-site relative z-10 py-20 md:py-28">
        <p className="eyebrow animate-fade-up">{eyebrow}</p>
        <h1 className="animate-fade-up delay-100 mt-4 max-w-3xl text-4xl font-medium sm:text-5xl md:text-6xl md:leading-[1.05]">
          {title}
        </h1>
        <p className="animate-fade-up delay-200 mt-6 max-w-2xl text-lg leading-relaxed text-navy-foreground/75">
          {lead}
        </p>
      </div>
    </section>
  );
}
