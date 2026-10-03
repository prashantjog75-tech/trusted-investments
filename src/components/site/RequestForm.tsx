import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { makeReference, sendForm } from "@/lib/forms/web3forms";
import { site, whatsappLink } from "@/lib/site-config";

export type FieldDef = {
  id: string; label: string; required?: boolean;
  type?: "text" | "tel" | "email" | "textarea" | "select" | "rating";
  options?: string[];
};

const PHONE = /^(\+?\d[\d\s-]{8,15}\d)$/;

export function RequestForm({ fields, prefix, subject, kind }: { fields: FieldDef[]; prefix: "GRV" | "FBK"; subject: string; kind: string }) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "not_configured">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const set = (id: string, v: string) => setValues((s) => ({ ...s, [id]: v }));

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    for (const f of fields) {
      const v = (values[f.id] ?? "").trim();
      if (f.required && !v) errs[f.id] = `${f.label} is required.`;
      else if (v && f.type === "tel" && !PHONE.test(v)) errs[f.id] = "Enter a valid phone number.";
      else if (v && f.type === "email" && !/^\S+@\S+\.\S+$/.test(v)) errs[f.id] = "Enter a valid email address.";
      else if (v.length > 2000) errs[f.id] = "Please keep this under 2000 characters.";
    }
    if (!consent) errs.consent = "Please confirm the acknowledgement.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending");
    const ref = makeReference(prefix);
    const payload: Record<string, string> = { "Reference number": ref, Timestamp: new Date().toISOString(), Type: kind };
    for (const f of fields) payload[f.label] = (values[f.id] ?? "").trim();
    payload["Consent"] = "Yes";
    const out = await sendForm(`${subject} ${ref}`, payload, values.email?.trim() || undefined);
    if (out.ok) { setReference(ref); setStatus("idle"); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else setStatus(out.reason === "not_configured" ? "not_configured" : "error");
  }

  if (reference) return (
    <div className="py-10 text-center" role="status">
      <CheckCircle2 className="mx-auto h-12 w-12 text-gold" strokeWidth={1.5} />
      <h2 className="mt-5 text-3xl font-medium">Thank you — received.</h2>
      <p className="mt-3 text-muted-foreground">Your reference number</p>
      <p className="mt-1 font-display text-2xl text-foreground">{reference}</p>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">Please quote this reference in any follow-up. We will contact you using the details you provided.</p>
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => {
        const err = errors[f.id];
        const wide = f.type === "textarea" || f.type === "rating";
        const common = { id: f.id, "aria-invalid": !!err, "aria-describedby": err ? `${f.id}-err` : undefined };
        return (
          <div key={f.id} className={wide ? "sm:col-span-2" : ""}>
            <Label htmlFor={f.id} className="mb-2 block text-sm font-medium">{f.label}{f.required ? <span className="text-gold"> *</span> : <span className="text-xs font-normal text-muted-foreground"> (optional)</span>}</Label>
            {f.type === "textarea" ? <Textarea {...common} rows={4} className="rounded-lg" value={values[f.id] ?? ""} onChange={(e) => set(f.id, e.target.value)} />
            : f.type === "select" ? (
              <select {...common} className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm" value={values[f.id] ?? ""} onChange={(e) => set(f.id, e.target.value)}>
                <option value="">Select…</option>
                {f.options!.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            ) : f.type === "rating" ? (
              <div role="radiogroup" aria-labelledby={f.id} className="flex flex-wrap gap-2" id={f.id}>
                {["1", "2", "3", "4", "5"].map((r) => (
                  <button key={r} type="button" role="radio" aria-checked={values[f.id] === r} aria-label={`${r} out of 5`} onClick={() => set(f.id, r)}
                    className={`h-11 w-11 rounded-lg border text-sm font-medium ${values[f.id] === r ? "border-gold bg-gold text-gold-foreground" : "border-input bg-background"}`}>{r}</button>
                ))}
                <span className="self-center text-xs text-muted-foreground">1 = poor · 5 = excellent</span>
              </div>
            ) : <Input {...common} type={f.type ?? "text"} className="h-11 rounded-lg" value={values[f.id] ?? ""} onChange={(e) => set(f.id, e.target.value)} />}
            {err && <p id={`${f.id}-err`} className="mt-1 text-xs text-destructive">{err}</p>}
          </div>
        );
      })}
      <div className="sm:col-span-2 rounded-lg border border-border bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
        <strong className="text-foreground">Privacy notice:</strong> The contact details and responses you submit are collected only to respond to your {kind.toLowerCase()} and are sent by email to {site.name} through a form-delivery service. They are not published.
      </div>
      <label className="flex items-start gap-3 text-sm text-muted-foreground sm:col-span-2">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--gold)]" aria-label="Consent acknowledgement" />
        <span>I agree that my details and responses may be used to contact me about this {kind.toLowerCase()}. <span className="text-gold">*</span></span>
      </label>
      {errors.consent && <p className="-mt-3 text-xs text-destructive sm:col-span-2">{errors.consent}</p>}
      {(status === "error" || status === "not_configured") && (
        <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive sm:col-span-2">
          We couldn't send your {kind.toLowerCase()} right now. Your entries are kept — please try again, or contact us directly on <a className="underline" href={site.phoneHref}>{site.phoneDisplay}</a> or <a className="underline" href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
        </p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" variant="gold" size="xl" disabled={status === "sending"} className="w-full sm:w-auto">
          {status === "sending" ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : status === "idle" ? `Submit ${kind}` : "Try again"}
        </Button>
      </div>
    </form>
  );
}
