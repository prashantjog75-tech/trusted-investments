import { Gauge } from "lucide-react";
import { RISK_LEVELS, formatAsOf, getRiskometer } from "@/lib/fund-data/riskometer";

/** SEBI-prescribed six-level Risk-o-meter. Colours are regulatory and intentionally not theme tokens. */
export function RiskOMeter({ amc, fund }: { amc: string; fund: string }) {
  const entry = getRiskometer(amc, fund);
  const activeIndex = entry ? RISK_LEVELS.findIndex((l) => l.level === entry.level) : -1;
  return (
    <div className="mt-5 border-t border-border pt-4" data-riskometer={entry?.level ?? "unavailable"}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase text-gold"><Gauge className="h-4 w-4" aria-hidden="true" /> Risk-o-meter</div>
      <div className="mt-3 grid grid-cols-6 gap-0.5" role="img" aria-label={entry ? `Risk-o-meter: ${entry.level} risk` : "Risk-o-meter: official data not yet available"}>
        {RISK_LEVELS.map((l, i) => {
          const active = i === activeIndex;
          return (
            <div key={l.level} className="relative" title={`${l.level} Risk`}>
              <div
                data-segment={l.level}
                className={`h-3 ${active ? "ring-2 ring-foreground ring-offset-1 ring-offset-card" : ""}`}
                style={{ backgroundColor: l.color, opacity: entry && !active ? 0.45 : entry ? 1 : 0.3 }}
              />
              {active && <div className="mx-auto mt-0.5 h-0 w-0 border-x-[5px] border-b-[6px] border-x-transparent border-b-foreground" aria-hidden="true" />}
            </div>
          );
        })}
      </div>
      {entry ? (
        <p className="mt-2 text-sm text-foreground">
          The risk of the scheme is <strong>{entry.level}</strong>.
          <span className="mt-0.5 block text-xs text-muted-foreground">
            As of: {formatAsOf(entry.asOf)} ·{" "}
            <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">Official source</a>
          </span>
        </p>
      ) : (
        <p className="mt-2 text-xs text-muted-foreground">Verified official riskometer data is not yet available for this scheme. Please refer to the latest scheme documents.</p>
      )}
    </div>
  );
}
