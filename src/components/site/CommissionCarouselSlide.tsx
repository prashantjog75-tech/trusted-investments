import { site } from "@/lib/site-config";

const trailCommissionRanges = [
  ["Fixed Maturity Plans", "0.50%–1.50%"],
  ["Equity / Hybrid Equity / Balance Funds", "0.50%–1.50%"],
  ["Index Funds", "0.30%–0.70%"],
  ["ELSS (Equity Linked Saving Scheme)", "0.55%–0.70%"],
  ["Fund of Funds", "0.25%–0.50%"],
  ["Arbitrage Funds", "0.50%–1.50%"],
  ["Hybrid Debt / Monthly Income Plans", "0.75%–0.76%"],
  ["Gift Funds", "0.15%–0.79%"],
  ["Income Funds", "0.30%–0.30%"],
  ["Short Term & Monthly Income Funds", "0.20%–0.75%"],
  ["Liquid / Ultra Short Term Schemes", "0.50%–1.50%"],
] as const;

export function CommissionCarouselSlide() {
  return (
    <article className="grid h-full grid-rows-[22rem_minmax(0,1fr)] bg-ivory sm:grid-cols-[0.92fr_1.08fr] sm:grid-rows-1">
      <section className="bg-navy-gradient flex min-w-0 flex-col justify-center px-6 pt-16 pb-7 text-navy-foreground sm:px-5 sm:pt-16 sm:pb-7 lg:px-7">
        <div className="mb-7 flex min-w-0 items-center gap-3 sm:mb-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center border border-gold/70 font-display text-xl font-semibold text-gold">
            P
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold sm:text-sm lg:text-base">{site.name}</p>
            <p className="mt-0.5 text-[9px] font-semibold tracking-[0.08em] text-navy-foreground/65 uppercase sm:text-[7px] lg:text-[8px]">
              {site.tagline}
            </p>
            <p className="mt-0.5 text-[9px] font-semibold text-gold sm:text-[8px]">{site.arn}</p>
          </div>
        </div>

        <p className="text-[10px] font-semibold tracking-[0.18em] text-gold uppercase sm:text-[8px] lg:text-[9px]">
          Our commitment
        </p>
        <span className="mt-2 h-0.5 w-10 bg-gold" aria-hidden="true" />
        <h2 className="mt-4 text-2xl leading-tight font-medium sm:text-xl lg:text-2xl">
          We don&apos;t charge any separate fees
        </h2>
        <p className="mt-4 max-w-md text-xs leading-relaxed text-navy-foreground/80 sm:text-[9px] lg:text-[11px]">
          We receive commissions from mutual fund companies for distribution. You do not separately pay us a
          distributor service fee for that service.
        </p>
        <div className="mt-5 border-t border-navy-foreground/15 pt-4 sm:mt-3 sm:pt-3">
          <p className="text-[10px] leading-relaxed text-navy-foreground/60 sm:text-[7px] lg:text-[8px]">
            Scheme expenses and applicable transaction, statutory or tax charges may still apply.
          </p>
        </div>
      </section>

      <section className="flex min-w-0 flex-col px-5 pt-7 pb-5 text-navy sm:px-4 sm:pt-14 sm:pb-3 lg:px-5">
        <p className="text-[10px] font-semibold tracking-[0.17em] text-gold uppercase sm:text-[8px] lg:text-[9px]">
          Transparent commissions
        </p>
        <h2 className="mt-2 text-xl leading-tight font-semibold sm:text-lg lg:text-xl">Trail commission structure</h2>
        <p className="mt-2 text-[10px] leading-relaxed text-muted-foreground sm:text-[7px] lg:text-[8px]">
          Commission may be received over time for mutual fund distribution and varies across schemes and fund
          houses.
        </p>

        <div className="mt-3 min-w-0 border border-gold/45">
          <table className="w-full table-fixed border-collapse text-left" aria-label="Illustrative trail commission ranges">
            <thead className="bg-navy text-navy-foreground">
              <tr>
                <th scope="col" className="w-[62%] px-2 py-2 text-[8px] font-semibold tracking-[0.08em] uppercase sm:px-1.5 sm:py-1.5 sm:text-[6px] lg:text-[7px]">
                  Scheme type
                </th>
                <th scope="col" className="px-2 py-2 text-right text-[8px] font-semibold tracking-[0.05em] uppercase sm:px-1.5 sm:py-1.5 sm:text-[6px] lg:text-[7px]">
                  Trail – 1st year onwards
                </th>
              </tr>
            </thead>
            <tbody>
              {trailCommissionRanges.map(([schemeType, range], index) => (
                <tr key={schemeType} className={index % 2 === 0 ? "bg-card/70" : "bg-gold-soft/45"}>
                  <th scope="row" className="border-t border-gold/25 px-2 py-1.5 text-[9px] leading-tight font-medium sm:px-1.5 sm:py-1 sm:text-[6px] lg:text-[7px]">
                    {schemeType}
                  </th>
                  <td className="border-t border-gold/25 px-2 py-1.5 text-right text-[9px] leading-tight font-semibold whitespace-nowrap text-navy sm:px-1.5 sm:py-1 sm:text-[6px] lg:text-[7px]">
                    {range}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-[9px] leading-relaxed text-muted-foreground sm:mt-2 sm:text-[6px] lg:text-[7px]">
          Illustrative trail commission ranges. Actual rates vary by scheme and AMC; please refer to current
          scheme/AMC disclosures for applicable rates.
        </p>
        <div className="mt-auto border-t border-border pt-3 sm:pt-2">
          <p className="text-[8px] leading-relaxed text-muted-foreground sm:text-[5px] lg:text-[6px]">
            {site.disclaimerShort}
          </p>
        </div>
      </section>
    </article>
  );
}