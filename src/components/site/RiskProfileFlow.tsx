import { useMemo, useRef, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ArrowLeft, ArrowRight, Check, Clipboard, Pencil, Printer, RotateCcw, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { calculatePersonalizedProjection, personalizedProjectionSchema, type PersonalizedProjectionInputs } from "@/lib/risk/projection";
import { buildProjectionReport } from "@/lib/risk/report";
import { riskQuestions, scoreRiskProfile, type RiskAnswers, type RiskResult } from "@/lib/risk/questionnaire";
import { formatInr } from "@/lib/calculators/sip";
import { site } from "@/lib/site-config";

const chartConfig = {
  invested: { label: "Amount invested", color: "var(--color-chart-3)" },
  estimatedValue: { label: "Estimated value", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

type Stage = "questions" | "result" | "projection" | "report";
type FormValues = Record<keyof PersonalizedProjectionInputs, string>;

const projectionDefaults: FormValues = {
  initialInvestment: "100000",
  monthlySip: "10000",
  years: "10",
  annualRate: "12",
  targetAmount: "2500000",
};

function toNumber(value: string) {
  if (value.trim() === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function RiskProfileFlow() {
  const [stage, setStage] = useState<Stage>("questions");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<RiskAnswers>({});
  const [showQuestionError, setShowQuestionError] = useState(false);
  const [values, setValues] = useState<FormValues>(projectionDefaults);
  const [shareMessage, setShareMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  const result = useMemo(() => scoreRiskProfile(answers), [answers]);
  const numericValues = useMemo(() => ({
    initialInvestment: toNumber(values.initialInvestment),
    monthlySip: toNumber(values.monthlySip),
    years: toNumber(values.years),
    annualRate: toNumber(values.annualRate),
    targetAmount: toNumber(values.targetAmount),
  }), [values]);
  const projectionValidation = useMemo(() => personalizedProjectionSchema.safeParse(numericValues), [numericValues]);
  const projection = useMemo(() => calculatePersonalizedProjection(numericValues), [numericValues]);

  function moveTo(nextStage: Stage) {
    setStage(nextStage);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function nextQuestion() {
    const question = riskQuestions[questionIndex];
    if (!answers[question.id]) {
      setShowQuestionError(true);
      return;
    }
    setShowQuestionError(false);
    if (questionIndex === riskQuestions.length - 1) moveTo("result");
    else {
      setQuestionIndex((current) => current + 1);
      requestAnimationFrame(() => headingRef.current?.focus());
    }
  }

  function restart() {
    setAnswers({});
    setQuestionIndex(0);
    setShowQuestionError(false);
    setValues(projectionDefaults);
    moveTo("questions");
  }

  if (stage === "questions") {
    const question = riskQuestions[questionIndex];
    const progress = ((questionIndex + 1) / riskQuestions.length) * 100;
    return (
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>Question {questionIndex + 1} of {riskQuestions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} aria-label={`Question ${questionIndex + 1} of ${riskQuestions.length}`} />
        <section className="mt-8 rounded-lg border border-border bg-card p-5 shadow-soft sm:p-8" aria-labelledby="question-heading">
          <p className="eyebrow">{question.title}</p>
          <h2 ref={headingRef} tabIndex={-1} id="question-heading" className="mt-3 text-2xl font-medium outline-none sm:text-3xl">{question.prompt}</h2>
          <RadioGroup
            className="mt-7 gap-3"
            value={answers[question.id] ?? ""}
            onValueChange={(value) => {
              setAnswers((current) => ({ ...current, [question.id]: value }));
              setShowQuestionError(false);
            }}
            aria-label={question.prompt}
          >
            {question.options.map((option) => {
              const selected = answers[question.id] === option.id;
              return (
                <Label key={option.id} htmlFor={`${question.id}-${option.id}`} className={`flex min-h-20 cursor-pointer items-start gap-4 rounded-lg border p-4 transition-colors sm:p-5 ${selected ? "border-gold bg-gold-soft/40" : "border-border bg-background hover:border-gold/60"}`}>
                  <RadioGroupItem id={`${question.id}-${option.id}`} value={option.id} className="mt-1 shrink-0" />
                  <span className="min-w-0"><span className="block text-base font-semibold text-foreground">{option.label}</span><span className="mt-1 block text-sm font-normal leading-relaxed text-muted-foreground">{option.detail}</span></span>
                </Label>
              );
            })}
          </RadioGroup>
          {showQuestionError && <p role="alert" className="mt-4 text-sm text-destructive">Select one answer to continue.</p>}
          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <Button type="button" variant="outline" disabled={questionIndex === 0} onClick={() => setQuestionIndex((current) => Math.max(0, current - 1))}><ArrowLeft /> Back</Button>
            <Button type="button" variant="gold" onClick={nextQuestion}>{questionIndex === riskQuestions.length - 1 ? "View result" : "Next"} <ArrowRight /></Button>
          </div>
        </section>
        <ComplianceNote />
      </div>
    );
  }

  if (!result) {
    restart();
    return null;
  }

  if (stage === "result") {
    return <RiskResultView result={result} headingRef={headingRef} onEdit={() => { setQuestionIndex(0); moveTo("questions"); }} onRestart={restart} onContinue={() => moveTo("projection")} />;
  }

  if (stage === "report") {
    return <ReportView result={result} inputs={numericValues} headingRef={headingRef} onBack={() => moveTo("projection")} onRestart={restart} shareMessage={shareMessage} setShareMessage={setShareMessage} />;
  }

  return (
    <ProjectionView
      result={result}
      values={values}
      numericValues={numericValues}
      projection={projection}
      validationSuccess={projectionValidation.success}
      errors={projectionValidation.success ? [] : [...new Set(projectionValidation.error.issues.map((issue) => issue.message))]}
      headingRef={headingRef}
      onChange={(field, value) => setValues((current) => ({ ...current, [field]: value }))}
      onBack={() => moveTo("result")}
      onReport={() => moveTo("report")}
    />
  );
}

function RiskResultView({ result, headingRef, onEdit, onRestart, onContinue }: { result: RiskResult; headingRef: React.RefObject<HTMLHeadingElement | null>; onEdit: () => void; onRestart: () => void; onContinue: () => void }) {
  return (
    <div className="mx-auto max-w-5xl">
      <section className="overflow-hidden rounded-lg border border-border bg-card shadow-soft" aria-labelledby="result-heading">
        <div className="bg-navy-gradient p-6 text-navy-foreground sm:p-9">
          <Badge variant="secondary">Educational self-assessment</Badge>
          <h2 ref={headingRef} tabIndex={-1} id="result-heading" className="mt-5 text-3xl font-medium outline-none sm:text-4xl">Your profile: <span className="text-gold">{result.profile}</span></h2>
          <p className="mt-3 text-lg">Total score: {result.score} of {result.maximumScore}</p>
          <p className="mt-5 max-w-3xl leading-relaxed text-navy-foreground/75">{result.description}</p>
        </div>
        <div className="p-5 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="eyebrow">Transparent scoring</p><h3 className="mt-2 text-2xl font-medium">How your score was calculated</h3></div><Badge variant="outline">1–3 points per answer</Badge></div>
          <div className="mt-6 divide-y divide-border rounded-lg border border-border">
            {result.breakdown.map((item) => <div key={item.questionId} className="grid gap-2 p-4 sm:grid-cols-[1fr_1.4fr_auto] sm:items-center"><span className="text-sm font-medium">{item.question}</span><span className="text-sm text-muted-foreground">{item.answer}</span><span className="text-sm font-semibold text-gold">{item.points} pts</span></div>)}
          </div>
          <div className="mt-8 flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={onEdit}><Pencil /> Edit answers</Button><Button type="button" variant="ghost" onClick={onRestart}><RotateCcw /> Restart</Button><Button type="button" variant="gold" className="sm:ml-auto" onClick={onContinue}>Continue to projection <ArrowRight /></Button></div>
        </div>
      </section>
      <ComplianceNote />
    </div>
  );
}

function ProjectionView({ result, values, numericValues, projection, validationSuccess, errors, headingRef, onChange, onBack, onReport }: { result: RiskResult; values: FormValues; numericValues: PersonalizedProjectionInputs; projection: ReturnType<typeof calculatePersonalizedProjection>; validationSuccess: boolean; errors: string[]; headingRef: React.RefObject<HTMLHeadingElement | null>; onChange: (field: keyof FormValues, value: string) => void; onBack: () => void; onReport: () => void }) {
  return (
    <div>
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="eyebrow">Personalized projection</p><h2 ref={headingRef} tabIndex={-1} className="mt-2 text-3xl font-medium outline-none">Explore your assumptions</h2><p className="mt-2 text-sm text-muted-foreground">Risk profile: <strong className="text-foreground">{result.profile}</strong> · score {result.score}/{result.maximumScore}</p></div><Badge variant="secondary">Illustration only</Badge></div>
      <div className="grid gap-7 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-start">
        <section className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7" aria-label="Projection assumptions">
          <div className="grid gap-5">
            <NumberField id="risk-initial" label="Initial / lump-sum investment" prefix="₹" value={values.initialInvestment} onChange={(value) => onChange("initialInvestment", value)} min={0} max={1_000_000_000} step={1000} />
            <NumberField id="risk-monthly" label="Monthly SIP amount" prefix="₹" value={values.monthlySip} onChange={(value) => onChange("monthlySip", value)} min={0} max={10_000_000} step={500} />
            <NumberField id="risk-years" label="Investment duration" suffix="years" value={values.years} onChange={(value) => onChange("years", value)} min={1} max={50} step={1} />
            <NumberField id="risk-rate" label="Assumed annual return" suffix="%" value={values.annualRate} onChange={(value) => onChange("annualRate", value)} min={0} max={100} step={0.1} />
            <NumberField id="risk-target" label="Goal / target amount (optional)" prefix="₹" value={values.targetAmount} onChange={(value) => onChange("targetAmount", value)} min={0} max={1_000_000_000} step={10000} />
          </div>
          <p className="mt-6 rounded-md bg-muted p-4 text-xs leading-relaxed text-muted-foreground">Monthly compounding is used. SIP instalments are assumed to be invested at the <strong className="text-foreground">beginning of each month</strong>. The entered return is an assumption only.</p>
          {!validationSuccess && <p role="alert" className="mt-4 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">Enter values within the displayed limits. {errors.join(" ")}</p>}
        </section>
        <div className="min-w-0 space-y-6" aria-live="polite">
          <section className="rounded-lg border border-border bg-card p-5 shadow-soft sm:p-7" aria-labelledby="projection-summary">
            <div className="flex flex-wrap items-center justify-between gap-3"><h3 id="projection-summary" className="text-2xl font-medium">Estimated projection</h3><Badge variant="outline">Assumption-based</Badge></div>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><ResultItem label="Total investment" value={formatInr(projection.totalContributions)} /><ResultItem label="Estimated growth" value={formatInr(projection.estimatedGrowth)} /><ResultItem label="Projected value" value={formatInr(projection.estimatedValue)} emphasis /><ResultItem label="Goal progress" value={projection.goalProgressPercent === null ? "No target entered" : `${projection.goalProgressPercent.toFixed(1)}%`} /></dl>
            {projection.targetAmount !== null && <div className="mt-5"><div className="flex justify-between gap-3 text-sm"><span>{projection.goalReached ? "Illustrative target reached" : `${formatInr(projection.goalRemaining ?? 0)} remaining`}</span><span>{formatInr(projection.targetAmount)} target</span></div><Progress className="mt-2" value={Math.min(100, projection.goalProgressPercent ?? 0)} aria-label={`Goal progress ${projection.goalProgressPercent?.toFixed(1) ?? 0} percent`} /></div>}
          </section>
          <section className="rounded-lg border border-border bg-card p-4 shadow-soft sm:p-7" aria-labelledby="risk-chart-heading"><h3 id="risk-chart-heading" className="text-2xl font-medium">Projection over time</h3><ChartContainer config={chartConfig} className="mt-6 h-64 w-full min-w-0 sm:h-80" role="img" aria-label={`Assumption-based projection from ${formatInr(projection.chartData[0]?.estimatedValue ?? 0)} to ${formatInr(projection.estimatedValue)} over ${numericValues.years || 0} years.`}><AreaChart data={projection.chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}><CartesianGrid vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} /><YAxis width={58} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Math.round(Number(value) / 100_000)}L`} /><ChartTooltip content={<ChartTooltipContent indicator="line" formatter={(value, name) => <div className="flex min-w-40 items-center justify-between gap-4"><span className="text-muted-foreground">{chartConfig[name as keyof typeof chartConfig]?.label}</span><span className="font-medium tabular-nums text-foreground">{formatInr(Number(value))}</span></div>} />} /><ChartLegend content={<ChartLegendContent />} /><Area type="monotone" dataKey="estimatedValue" stroke="var(--color-estimatedValue)" fill="var(--color-estimatedValue)" fillOpacity={0.18} strokeWidth={2} /><Area type="monotone" dataKey="invested" stroke="var(--color-invested)" fill="var(--color-invested)" fillOpacity={0.08} strokeWidth={2} /></AreaChart></ChartContainer><p className="sr-only">The chart compares cumulative contributions and estimated value at yearly intervals.</p></section>
        </div>
      </div>
      <ComplianceNote />
      <div className="mt-6 flex flex-wrap justify-between gap-3"><Button type="button" variant="outline" onClick={onBack}><ArrowLeft /> Back to result</Button><Button type="button" variant="gold" disabled={!validationSuccess} onClick={onReport}>Create report <ArrowRight /></Button></div>
    </div>
  );
}

function ReportView({ result, inputs, headingRef, onBack, onRestart, shareMessage, setShareMessage }: { result: RiskResult; inputs: PersonalizedProjectionInputs; headingRef: React.RefObject<HTMLHeadingElement | null>; onBack: () => void; onRestart: () => void; shareMessage: string; setShareMessage: (message: string) => void }) {
  const projection = calculatePersonalizedProjection(inputs);
  const report = buildProjectionReport(result, inputs, projection);

  async function share() {
    const text = `${report.title}\n${report.profile} · ${report.scoreLabel}\nProjected value: ${report.outputs.find((item) => item.label === "Projected value")?.value ?? ""}\nIllustration based on user-entered assumptions.`;
    try {
      if (navigator.share) await navigator.share({ title: report.title, text, url: window.location.href });
      else {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        setShareMessage("Report summary and link copied.");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") setShareMessage("Sharing is unavailable in this browser. You can print the report instead.");
    }
  }

  return (
    <div>
      <div className="print:hidden mb-6 flex flex-wrap justify-between gap-3"><Button type="button" variant="outline" onClick={onBack}><ArrowLeft /> Edit projection</Button><div className="flex flex-wrap gap-3"><Button type="button" variant="outline" onClick={share}><Share2 /> Share</Button><Button type="button" variant="gold" onClick={() => window.print()}><Printer /> Print / Save PDF</Button></div></div>
      {shareMessage && <p role="status" className="print:hidden mb-4 text-sm text-muted-foreground"><Clipboard className="mr-2 inline h-4 w-4" />{shareMessage}</p>}
      <article className="rounded-lg border border-border bg-card shadow-soft print:border-0 print:shadow-none" aria-labelledby="report-title">
        <header className="bg-navy-gradient p-6 text-navy-foreground print:bg-none print:text-foreground sm:p-9"><p className="eyebrow">Prashant Jog · {site.arn}</p><h2 ref={headingRef} tabIndex={-1} id="report-title" className="mt-3 text-3xl font-medium outline-none sm:text-4xl">{report.title}</h2><p className="mt-3 text-sm text-navy-foreground/70 print:text-muted-foreground">Prepared {report.date} · Illustration based on user-entered assumptions</p></header>
        <div className="space-y-9 p-5 sm:p-9">
          <section><p className="eyebrow">Risk profile</p><div className="mt-4 grid gap-5 rounded-lg border border-border bg-muted/30 p-5 md:grid-cols-[0.6fr_1.4fr]"><div><p className="text-2xl font-medium">{report.profile}</p><p className="mt-1 text-sm text-muted-foreground">Score {report.scoreLabel}</p></div><p className="text-sm leading-relaxed text-muted-foreground">{report.profileExplanation}</p></div></section>
          <section><h3 className="text-2xl font-medium">Score breakdown</h3><div className="mt-4 grid gap-3 sm:grid-cols-2">{report.breakdown.map((item) => <div key={item.questionId} className="rounded-lg border border-border p-4"><p className="text-sm font-medium">{item.question}</p><p className="mt-1 text-sm text-muted-foreground">{item.answer} · {item.points} points</p></div>)}</div></section>
          <section className="grid gap-7 lg:grid-cols-2"><div><h3 className="text-2xl font-medium">Projection inputs</h3><dl className="mt-4 divide-y divide-border rounded-lg border border-border">{report.inputs.map((item) => <div key={item.label} className="flex justify-between gap-4 p-4 text-sm"><dt className="text-muted-foreground">{item.label}</dt><dd className="text-right font-medium">{item.value}</dd></div>)}</dl></div><div><h3 className="text-2xl font-medium">Estimated results</h3><dl className="mt-4 divide-y divide-border rounded-lg border border-border">{report.outputs.map((item) => <div key={item.label} className="flex justify-between gap-4 p-4 text-sm"><dt className="text-muted-foreground">{item.label}</dt><dd className="text-right font-medium">{item.value}</dd></div>)}</dl></div></section>
          <section className="rounded-lg bg-muted p-5"><h3 className="text-lg font-medium">Calculation assumptions</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{report.assumptions}</p></section>
          <section className="border-t border-border pt-6 text-xs leading-relaxed text-muted-foreground"><p><strong className="text-foreground">Important:</strong> This risk profile is an educational self-assessment only and does not constitute financial advice or investment advice. No mutual fund has been recommended, ranked, selected, or mapped from these answers. Projected values are estimates based only on the assumptions entered. Market-linked mutual fund returns are not guaranteed. Prashant Jog operates only as an AMFI Registered Mutual Fund Distributor ({site.arn}). {site.disclaimerShort}</p></section>
        </div>
      </article>
      <div className="print:hidden mt-6"><Button type="button" variant="ghost" onClick={onRestart}><RotateCcw /> Start again</Button></div>
    </div>
  );
}

function NumberField({ id, label, prefix, suffix, value, onChange, min, max, step }: { id: string; label: string; prefix?: string; suffix?: string; value: string; onChange: (value: string) => void; min: number; max: number; step: number }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><div className="relative">{prefix && <span aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{prefix}</span>}<Input id={id} type="number" inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} min={min} max={max} step={step} aria-describedby={`${id}-limit`} className={`${prefix ? "pl-8" : ""} ${suffix ? "pr-16" : ""} h-11`} />{suffix && <span aria-hidden="true" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{suffix}</span>}</div><p id={`${id}-limit`} className="text-xs text-muted-foreground">Allowed range: {min.toLocaleString("en-IN")} to {max.toLocaleString("en-IN")}.</p></div>;
}

function ResultItem({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={`rounded-lg border p-4 ${emphasis ? "border-gold/40 bg-gold-soft/30" : "border-border bg-muted/30"}`}><dt className="text-xs leading-relaxed text-muted-foreground">{label}</dt><dd className="mt-2 break-words font-display text-xl font-medium tabular-nums">{value}</dd></div>;
}

function ComplianceNote() {
  return <div className="mt-6 rounded-lg border border-gold/30 bg-gold-soft/40 p-5 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Educational self-assessment only.</strong> This tool does not constitute financial advice or investment advice and does not recommend any mutual fund. Results and projections are illustrations based on your answers and assumptions. Market-linked mutual fund returns are not guaranteed. Prashant Jog operates only as an AMFI Registered Mutual Fund Distributor ({site.arn}). {site.disclaimerShort}</div>;
}
