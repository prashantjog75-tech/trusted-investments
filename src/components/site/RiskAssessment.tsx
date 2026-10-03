import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Lock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { dimensions, profileThresholds, profilerQuestions } from "@/lib/risk-profiler/config";
import { buildSubmissionMessage, contactSchema, scoreProfiler, type ProfilerAnswers, type ProfilerResult } from "@/lib/risk-profiler/scoring";
import { submitAssessment } from "@/lib/risk-profiler/submission";
import { site, whatsappLink } from "@/lib/site-config";

type Stage = "intro" | "questions" | "contact" | "result";

export function RiskAssessment() {
  const [stage, setStage] = useState<Stage>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<ProfilerAnswers>({});
  const [missing, setMissing] = useState(false);
  const [contact, setContact] = useState({ name: "", phone: "", email: "", consent: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [result, setResult] = useState<{ r: ProfilerResult; date: string } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const focus = () => requestAnimationFrame(() => headingRef.current?.focus());
  const go = (s: Stage) => { setStage(s); focus(); };

  if (stage === "intro") {
    return <div className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-6 shadow-soft sm:p-9">
      <p className="eyebrow">Before you begin</p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-3 text-3xl font-medium outline-none">About this assessment</h2>
      <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
        <li>{profilerQuestions.length} short questions covering your risk capacity, risk tolerance and time horizon.</li>
        <li>Your mobile number is required before the result is shown, so Prashant Jog can discuss it with you. Email and name are optional.</li>
        <li>This is an assessment aid only. It is not investment advice, not a guarantee, and does not recommend any mutual fund.</li>
        <li>Scoring bands are provisional website settings, not an official SEBI or AMFI methodology.</li>
      </ul>
      <Button className="mt-7" variant="gold" onClick={() => go("questions")}>Start assessment <ArrowRight /></Button>
    </div>;
  }

  if (stage === "questions") {
    const q = profilerQuestions[index]!;
    const pct = ((index + 1) / profilerQuestions.length) * 100;
    const next = () => {
      if (!answers[q.id]) { setMissing(true); return; }
      setMissing(false);
      if (index === profilerQuestions.length - 1) go("contact"); else { setIndex(index + 1); focus(); }
    };
    return <div className="mx-auto max-w-3xl">
      <div className="mb-3 flex justify-between gap-4 text-sm text-muted-foreground"><span>Question {index + 1} of {profilerQuestions.length}</span><span>{dimensions[q.dimension].label}</span></div>
      <Progress value={pct} aria-label={`Question ${index + 1} of ${profilerQuestions.length}`} />
      <section className="mt-6 rounded-lg border border-border bg-card p-5 shadow-soft sm:p-8">
        <h2 ref={headingRef} tabIndex={-1} id="rq" className="text-2xl font-medium outline-none sm:text-3xl">{q.prompt}</h2>
        <RadioGroup className="mt-6 gap-3" aria-labelledby="rq" value={answers[q.id] ?? ""} onValueChange={(v) => { setAnswers((a) => ({ ...a, [q.id]: v })); setMissing(false); }}>
          {q.options.map((o) => {
            const sel = answers[q.id] === o.id;
            return <Label key={o.id} htmlFor={`${q.id}-${o.id}`} className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 text-base font-normal transition-colors ${sel ? "border-gold bg-gold-soft/40" : "border-border bg-background hover:border-gold/60"}`}>
              <RadioGroupItem id={`${q.id}-${o.id}`} value={o.id} className="shrink-0" /><span className="min-w-0">{o.label}</span>
            </Label>;
          })}
        </RadioGroup>
        {missing && <p role="alert" className="mt-4 text-sm text-destructive">Select one answer to continue.</p>}
        <div className="mt-8 flex justify-between gap-3">
          <Button variant="outline" onClick={() => index === 0 ? go("intro") : (setIndex(index - 1), focus())}><ArrowLeft /> Back</Button>
          <Button variant="gold" onClick={next}>{index === profilerQuestions.length - 1 ? "Continue" : "Next"} <ArrowRight /></Button>
        </div>
      </section>
    </div>;
  }

  if (stage === "contact") {
    const submit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitError("");
      const parsed = contactSchema.safeParse(contact);
      if (!parsed.success) {
        setErrors(Object.fromEntries(parsed.error.issues.map((i) => [String(i.path[0]), i.message])));
        return;
      }
      setErrors({});
      const r = scoreProfiler(answers);
      if (!r) { setIndex(0); go("questions"); return; }
      setSubmitting(true);
      const { date, text } = buildSubmissionMessage(parsed.data, r);
      const outcome = await submitAssessment({ name: parsed.data.name ?? "", phone: parsed.data.phone, email: parsed.data.email ?? "", message: text, answers: r.breakdown });
      setSubmitting(false);
      if (outcome.ok) { setResult({ r, date }); go("result"); }
      else setSubmitError(outcome.reason === "not_configured"
        ? "Online submission is not yet set up on this website, so your result cannot be shown right now. Please contact us directly by phone or WhatsApp."
        : "We couldn't send your assessment right now. Please try again or contact us directly by phone or WhatsApp.");
    };
    return <form noValidate onSubmit={submit} className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-6 shadow-soft sm:p-9">
      <p className="eyebrow flex items-center gap-2"><Lock className="h-4 w-4" /> Result locked</p>
      <h2 ref={headingRef} tabIndex={-1} className="mt-3 text-3xl font-medium outline-none">Your details to view the result</h2>
      <p className="mt-2 text-sm text-muted-foreground">All {profilerQuestions.length} questions answered. Your result appears once your details are submitted successfully.</p>
      <div className="mt-6 grid gap-5">
        <Field id="ra-name" label="Name (optional)" error={errors.name}><Input id="ra-name" autoComplete="name" maxLength={100} value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} /></Field>
        <Field id="ra-phone" label="Mobile number (required)" error={errors.phone}><Input id="ra-phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={16} aria-invalid={!!errors.phone} value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} /></Field>
        <Field id="ra-email" label="Email (optional)" error={errors.email}><Input id="ra-email" type="email" autoComplete="email" maxLength={255} value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></Field>
        <div className="rounded-md bg-muted p-4 text-xs leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Privacy notice.</strong> Your mobile number, optional name/email and assessment answers are sent to Prashant Jog ({site.email}) only to respond to you and to manage your assessment. They are not used for unrelated marketing or sold to anyone.
        </div>
        <div className="flex items-start gap-3">
          <Checkbox id="ra-consent" checked={contact.consent} onCheckedChange={(v) => setContact({ ...contact, consent: v === true })} aria-invalid={!!errors.consent} />
          <Label htmlFor="ra-consent" className="text-sm font-normal leading-relaxed">I agree to share these details and my answers for this purpose, and to be contacted about my assessment.</Label>
        </div>
        {errors.consent && <p role="alert" className="-mt-3 text-sm text-destructive">{errors.consent}</p>}
      </div>
      {submitError && <div role="alert" className="mt-5 rounded-md border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{submitError} <a className="underline" href={site.phoneHref}>{site.phoneDisplay}</a> · <a className="underline" href={whatsappLink("Hello, I would like to discuss my risk profile assessment.")} target="_blank" rel="noreferrer">WhatsApp</a></div>}
      <div className="mt-7 flex flex-wrap justify-between gap-3">
        <Button type="button" variant="outline" onClick={() => { setIndex(profilerQuestions.length - 1); go("questions"); }}><ArrowLeft /> Back</Button>
        <Button type="submit" variant="gold" disabled={submitting}>{submitting ? "Submitting…" : "Submit and view result"}</Button>
      </div>
    </form>;
  }

  if (!result) return null;
  const { r, date } = result;
  return <div className="mx-auto max-w-4xl">
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
      <div className="bg-navy-gradient p-6 text-navy-foreground sm:p-9">
        <p className="eyebrow">Your assessment result · {date}</p>
        <h2 ref={headingRef} tabIndex={-1} className="mt-3 text-3xl font-medium outline-none sm:text-4xl">Profile: <span className="text-gold">{r.profile}</span></h2>
        <p className="mt-2">Score {r.score} of {r.maxScore}</p>
      </div>
      <div className="space-y-8 p-5 sm:p-9">
        <div>
          <p className="sr-only">Personal assessment meter: {r.profile}, level {r.profileIndex + 1} of {profileThresholds.length}.</p>
          <div className="grid grid-cols-5 gap-1" aria-hidden="true">
            {profileThresholds.map((t, i) => <div key={t.name} className={`h-4 rounded-sm ${i === r.profileIndex ? "bg-gold ring-2 ring-navy ring-offset-2 ring-offset-card" : i < r.profileIndex ? "bg-navy/60" : "bg-muted"}`} />)}
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1 text-center text-[11px] leading-tight text-muted-foreground sm:text-xs" aria-hidden="true">
            {profileThresholds.map((t, i) => <span key={t.name} className={i === r.profileIndex ? "font-semibold text-foreground" : ""}>{t.name}</span>)}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Personal assessment meter — not the SEBI/AMFI mutual fund Risk-o-meter.</p>
        </div>
        <p className="leading-relaxed text-muted-foreground">{r.explanation}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {r.dimensions.map((d) => <div key={d.id} className="rounded-lg border border-border bg-muted/30 p-4"><p className="text-xs text-muted-foreground">{d.label}</p><p className="mt-1 font-display text-xl">{d.level}</p><p className="text-xs text-muted-foreground">{d.score} of {d.max} points</p></div>)}
        </div>
        <p className="border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">Important:</strong> This is an assessment aid only, using provisional website scoring bands. It is not an official SEBI/AMFI methodology, not investment advice and not a guarantee of any outcome. No mutual fund has been recommended. Prashant Jog operates as an AMFI Registered Mutual Fund Distributor ({site.arn}). {site.disclaimerShort}</p>
        <Button variant="ghost" onClick={() => { setAnswers({}); setIndex(0); setResult(null); go("intro"); }}><RotateCcw /> Start again</Button>
      </div>
    </section>
  </div>;
}

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label>{children}{error && <p role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}
