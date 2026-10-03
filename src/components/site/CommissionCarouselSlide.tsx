import { Eye, HandCoins, ShieldCheck } from "lucide-react";
import { site } from "@/lib/site-config";

const commitments = [
  { icon: HandCoins, label: "No separate distributor service fee" },
  { icon: Eye, label: "Commission information shared clearly" },
  { icon: ShieldCheck, label: "Service centred on your goals" },
] as const;

export function CommissionCarouselSlide() {
  return (
    <article className="grid h-full grid-rows-[1fr_1fr] bg-ivory sm:grid-cols-[1.02fr_0.98fr] sm:grid-rows-1">
      <section className="bg-navy-gradient flex min-w-0 flex-col justify-center px-6 pt-10 pb-5 text-navy-foreground sm:px-6 sm:py-8 lg:px-7">
        <p className="text-[9px] font-semibold tracking-[0.18em] text-gold uppercase">Our commitment</p>
        <span className="mt-2 h-0.5 w-9 bg-gold" aria-hidden="true" />
        <h2 className="mt-3 text-xl leading-tight font-medium sm:text-2xl">
          We don&apos;t charge any separate fees
        </h2>
        <p className="mt-3 max-w-md text-[10px] leading-relaxed text-navy-foreground/75 sm:text-[11px] lg:text-xs">
          We receive commissions from mutual fund companies for distribution. You do not separately pay us a
          distributor service fee for that service.
        </p>
        <p className="mt-2 max-w-md text-[8px] leading-relaxed text-navy-foreground/55 sm:text-[9px]">
          Scheme expenses and applicable transaction, statutory or tax charges may still apply.
        </p>
      </section>

      <section className="flex min-w-0 flex-col justify-center px-6 py-4 text-navy sm:px-5 sm:py-6 lg:px-6">
        <p className="text-center text-[8px] font-semibold tracking-[0.16em] text-gold uppercase sm:text-[9px]">
          Transparent commissions
        </p>
        <h2 className="mx-auto mt-1 max-w-sm text-center text-lg leading-tight font-semibold sm:text-xl lg:text-2xl">
          We don&apos;t charge any fees
        </h2>

        <ul className="mt-3 grid gap-1.5 sm:mt-4">
          {commitments.map((item) => (
            <li key={item.label} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 border-b border-border pb-1.5 last:border-0 last:pb-0">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold-soft text-navy">
                <item.icon className="h-3 w-3" aria-hidden="true" />
              </span>
              <span className="min-w-0 text-[9px] leading-snug font-semibold sm:text-[10px] lg:text-[11px]">{item.label}</span>
            </li>
          ))}
        </ul>

        <p className="mt-2.5 text-center text-[8px] font-bold tracking-[0.12em] text-gold uppercase">
          Transparency <span aria-hidden="true">|</span> Trust <span aria-hidden="true">|</span> Service
        </p>
        <div className="mt-2 border-t border-border pt-2 text-center">
          <p className="font-display text-xs font-semibold sm:text-sm">{site.name}</p>
          <p className="mt-0.5 text-[7px] font-semibold tracking-[0.06em] uppercase sm:text-[8px]">
            AMFI Registered Mutual Fund Distributor · {site.arn}
          </p>
          <p className="mt-1 text-[7px] leading-snug text-muted-foreground sm:text-[8px]">{site.disclaimerShort}</p>
        </div>
      </section>
    </article>
  );
}