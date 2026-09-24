import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  calculateGoalProjection,
  calculateSipProjection,
  formatInr,
  goalInputSchema,
  sipInputSchema,
} from "@/lib/calculators/sip";
import { site } from "@/lib/site-config";

type Mode = "sip" | "goal";

type FormValues = {
  monthlySip: string;
  targetAmount: string;
  years: string;
  annualRate: string;
  initialInvestment: string;
};

const defaults: FormValues = {
  monthlySip: "10000",
  targetAmount: "5000000",
  years: "10",
  annualRate: "12",
  initialInvestment: "0",
};

const chartConfig = {
  invested: { label: "Amount invested", color: "var(--color-chart-3)" },
  estimatedValue: { label: "Estimated value", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

function toNumber(value: string) {
  if (value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function SipCalculator() {
  const [mode, setMode] = useState<Mode>("sip");
  const [values, setValues] = useState<FormValues>(defaults);

  const numericValues = useMemo(
    () => ({
      monthlySip: toNumber(values.monthlySip),
      targetAmount: toNumber(values.targetAmount),
      years: toNumber(values.years),
      annualRate: toNumber(values.annualRate),
      initialInvestment: toNumber(values.initialInvestment),
    }),
    [values],
  );

  const validation = useMemo(
    () =>
      mode === "sip"
        ? sipInputSchema.safeParse(numericValues)
        : goalInputSchema.safeParse(numericValues),
    [mode, numericValues],
  );

  const result = useMemo(
    () =>
      mode === "sip"
        ? calculateSipProjection(numericValues)
        : calculateGoalProjection(numericValues),
    [mode, numericValues],
  );

  const requiredSip = "requiredMonthlySip" in result ? result.requiredMonthlySip : null;
  const initialMeetsGoal = "initialInvestmentMeetsTarget" in result && result.initialInvestmentMeetsTarget;
  const errorMessages = validation.success
    ? []
    : [...new Set(validation.error.issues.map((issue) => issue.message))];

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start">
      <div className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Choose a mode</p>
            <h2 className="mt-2 text-2xl font-medium">Set your assumptions</h2>
          </div>
          <Badge variant="secondary">Illustration</Badge>
        </div>

        <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)} className="mt-6">
          <TabsList className="grid h-auto w-full grid-cols-2">
            <TabsTrigger value="sip" className="min-h-10 whitespace-normal text-center">SIP Calculator</TabsTrigger>
            <TabsTrigger value="goal" className="min-h-10 whitespace-normal text-center">Goal Projection</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-7 grid gap-5">
          {mode === "sip" ? (
            <NumberField
              id="monthly-sip"
              label="Monthly SIP amount"
              prefix="₹"
              value={values.monthlySip}
              onChange={(value) => update("monthlySip", value)}
              min={0}
              max={10_000_000}
              step={500}
            />
          ) : (
            <NumberField
              id="target-amount"
              label="Target amount"
              prefix="₹"
              value={values.targetAmount}
              onChange={(value) => update("targetAmount", value)}
              min={1}
              max={1_000_000_000}
              step={10_000}
            />
          )}
          <NumberField
            id="investment-period"
            label="Investment period"
            suffix="years"
            value={values.years}
            onChange={(value) => update("years", value)}
            min={1}
            max={50}
            step={1}
          />
          <NumberField
            id="annual-return"
            label="Expected annual return"
            suffix="%"
            value={values.annualRate}
            onChange={(value) => update("annualRate", value)}
            min={0}
            max={100}
            step={0.1}
          />
          <NumberField
            id="initial-investment"
            label="Initial investment (optional)"
            prefix="₹"
            value={values.initialInvestment}
            onChange={(value) => update("initialInvestment", value)}
            min={0}
            max={1_000_000_000}
            step={1_000}
          />
        </div>

        <p className="mt-6 rounded-md bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
          SIP instalments are assumed to be invested at the <strong className="text-foreground">beginning of each month</strong>, with monthly compounding. The entered return is an assumption only.
        </p>
        {errorMessages.length > 0 && (
          <div role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            Please enter values within the displayed limits. {errorMessages.join(" ")}
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-6" aria-live="polite">
        <section aria-labelledby="result-heading" className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Assumption-based result</p>
              <h2 id="result-heading" className="mt-2 text-2xl font-medium">
                {mode === "sip" ? "Estimated projection" : "Illustrative monthly requirement"}
              </h2>
            </div>
            <Badge variant="outline">Estimated</Badge>
          </div>

          {mode === "goal" && requiredSip !== null && (
            <div className="mt-6 rounded-lg bg-navy-gradient p-6 text-navy-foreground">
              <p className="text-sm text-navy-foreground/70">Required monthly SIP</p>
              <p className="mt-2 font-display text-4xl font-medium text-gold">{formatInr(requiredSip)}</p>
              <p className="mt-2 text-xs leading-relaxed text-navy-foreground/70">
                {initialMeetsGoal
                  ? "Under these assumptions, the initial investment alone projects to meet or exceed the target."
                  : "Illustrative amount needed at the beginning of each month under the selected assumptions."}
              </p>
            </div>
          )}

          <dl className="mt-6 grid gap-3 sm:grid-cols-3">
            <ResultItem
              label={mode === "sip" ? "Total amount invested" : "Projected contributions"}
              value={formatInr(result.totalContributions)}
            />
            <ResultItem label="Estimated growth" value={formatInr(result.estimatedGrowth)} />
            <ResultItem
              label={mode === "sip" ? "Final estimated value" : "Projected value"}
              value={formatInr(result.estimatedValue)}
              emphasis
            />
          </dl>

          <div className="mt-4 border-t border-border pt-4 text-sm text-muted-foreground">
            {result.meaningfulCagr !== null ? (
              <p><strong className="text-foreground">Illustrative CAGR:</strong> {result.meaningfulCagr.toFixed(2)}% for this lump-sum-only projection.</p>
            ) : (
              <p><strong className="text-foreground">Assumed annual return:</strong> {result.assumedAnnualRate.toFixed(1)}%. CAGR is not shown because recurring contributions do not have one single starting value.</p>
            )}
          </div>
        </section>

        <section aria-labelledby="chart-heading" className="rounded-lg border border-border bg-card p-4 shadow-soft sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Estimated over time</p>
              <h2 id="chart-heading" className="mt-2 text-2xl font-medium">Projection chart</h2>
            </div>
            <Badge variant="secondary">Illustration</Badge>
          </div>
          <ChartContainer config={chartConfig} className="mt-6 h-64 w-full min-w-0 sm:h-80" role="img" aria-label={`Assumption-based projection from ${formatInr(result.chartData[0]?.estimatedValue ?? 0)} to ${formatInr(result.estimatedValue)} over ${numericValues.years || 0} years.`}>
            <AreaChart data={result.chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis
                width={58}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${Math.round(Number(value) / 100_000)}L`}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="line" formatter={(value, name) => (
                  <div className="flex min-w-40 items-center justify-between gap-4">
                    <span className="text-muted-foreground">{chartConfig[name as keyof typeof chartConfig]?.label}</span>
                    <span className="font-medium tabular-nums text-foreground">{formatInr(Number(value))}</span>
                  </div>
                )} />}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="estimatedValue" stroke="var(--color-estimatedValue)" fill="var(--color-estimatedValue)" fillOpacity={0.18} strokeWidth={2} />
              <Area type="monotone" dataKey="invested" stroke="var(--color-invested)" fill="var(--color-invested)" fillOpacity={0.08} strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
          <p className="sr-only">The chart compares cumulative contributions with the estimated value at yearly intervals.</p>
        </section>
      </div>

      <div className="lg:col-span-2 rounded-lg border border-gold/30 bg-gold-soft/40 p-5 text-sm leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Illustration only.</strong> Projected values are based solely on the assumptions entered and are not a promise or forecast of actual fund performance. Mutual fund returns are market-linked and not guaranteed. Prashant Jog operates only as an AMFI Registered Mutual Fund Distributor ({site.arn}). {site.disclaimerShort}
      </div>
    </div>
  );
}

function NumberField({
  id,
  label,
  prefix,
  suffix,
  value,
  onChange,
  min,
  max,
  step,
}: {
  id: string;
  label: string;
  prefix?: string;
  suffix?: string;
  value: string;
  onChange: (value: string) => void;
  min: number;
  max: number;
  step: number;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        {prefix && <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}
        <Input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          min={min}
          max={max}
          step={step}
          aria-describedby={`${id}-limit`}
          className={`${prefix ? "pl-8" : ""} ${suffix ? "pr-16" : ""} h-11`}
        />
        {suffix && <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}
      </div>
      <p id={`${id}-limit`} className="text-xs text-muted-foreground">Allowed range: {min.toLocaleString("en-IN")} to {max.toLocaleString("en-IN")}.</p>
    </div>
  );
}

function ResultItem({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`rounded-lg border p-4 ${emphasis ? "border-gold/40 bg-gold-soft/30" : "border-border bg-muted/30"}`}>
      <dt className="text-xs leading-relaxed text-muted-foreground">{label}</dt>
      <dd className="mt-2 break-words font-display text-xl font-medium tabular-nums sm:text-2xl">{value}</dd>
    </div>
  );
}