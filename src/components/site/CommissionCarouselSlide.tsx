import { Eye, HandCoins, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site-config";

const commitments = [
  { icon: HandCoins, label: "No separate distributor service fee" },
  { icon: Eye, label: "Commission information shared clearly" },
  { icon: ShieldCheck, label: "Service centred on your goals" },
] as const;

export function CommissionCarouselSlide() {
  return (
    <article className="grid h-full grid-rows-[1fr_1.08fr] bg-ivory sm:grid-cols-[1.02fr_0.98fr] sm:grid-rows-1">
      <section className="bg-navy-gradient flex min-w-0 flex-col justify-center px-6 py-8 text-navy-foreground sm:px-8 sm:py-10 lg:px-10">
        <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase sm:text-xs">Our commitment</p>
        <span className="mt-3 h-0.5 w-10 bg-gold" aria-hidden="true" />
        <h2 className="mt-4 text-2xl leading-tight font-medium sm:text-3xl lg:text-4xl">
          We don&apos;t charge any separate fees
        </h2>
        <p className="mt-4 max-w-md text-xs leading-relaxed text-navy-foreground/75 sm:text-sm lg:text-base">
          We receive commissions from mutual fund companies for distribution. You do not separately pay us a
          distributor service fee for that service.
        </p>
        <p className="mt-3 max-w-md text-[10px] leading-relaxed text-navy-foreground/55 sm:text-xs">
          Scheme expenses and applicable transaction, statutory or tax charges may still apply.
        </p>
      </section>

      <section className="flex min-w-0 flex-col justify-center px-6 py-6 text-navy sm:px-7 sm:py-8 lg:px-9">
        <p className="text-center text-[10px] font-semibold tracking-[0.16em] text-gold uppercase sm:text-xs">
          Transparent commissions
        </p>
        <h2 className="mx-auto mt-2 max-w-sm text-center text-xl leading-tight font-semibold sm:text-2xl lg:text-3xl">
          We don&apos;t charge any fees
        </h2>

        <ul className="mt-4 grid gap-2 sm:mt-5">
          {commitments.map((item) => (
            <li key={item.label} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b border-border pb-2 last:border-0 last:pb-0">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-soft text-navy">
                <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 text-[11px] leading-snug font-semibold sm:text-xs lg:text-sm">{item.label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-center text-[9px] font-bold tracking-[0.14em] text-gold uppercase sm:text-[10px]">
          Transparency <span aria-hidden="true">|</span> Trust <span aria-hidden="true">|</span> Service
        </p>
        <div className="mt-3 border-t border-border pt-3 text-center">
          <p className="font-display text-sm font-semibold sm:text-base">{site.name}</p>
          <p className="mt-0.5 text-[9px] font-semibold tracking-[0.08em] uppercase sm:text-[10px]">
            AMFI Registered Mutual Fund Distributor · {site.arn}
          </p>
          <p className="mt-2 text-[8px] leading-snug text-muted-foreground sm:text-[9px]">{site.disclaimerShort}</p>
        </div>
      </section>
    </article>
  );
}