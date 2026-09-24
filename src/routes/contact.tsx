import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHero, Section } from "@/components/site/Section";
import { site, whatsappLink } from "@/lib/site-config";
import { pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageMeta({
      title: "Book a Meeting",
      description:
        "Request a complimentary, no-obligation meeting with Prashant Jog, AMFI Registered Mutual Fund Distributor, ARN 83625. Serving families across India.",
      path: "/contact",
    }),
  component: ContactPage,
});

const goalOptions = ["Retirement", "Child's education", "Wealth creation", "Home / other life goal", "Emergency fund", "Portfolio review", "Not sure yet"];
const horizonOptions = ["Under 3 years", "3 – 5 years", "5 – 10 years", "10+ years"];
const amountOptions = ["Prefer not to say", "Under ₹5,000 / month", "₹5,000 – ₹25,000 / month", "₹25,000+ / month", "Lump sum"];

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // TODO: connect to your preferred email / CRM service.
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <PageHero
        eyebrow="Book a meeting"
        title="Let's talk about your goals."
        lead="Share a few details and we'll get back to you within one working day to arrange a convenient time — in person, on a call, or over video."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="card-premium p-7 hover:translate-y-0 md:p-10">
            {submitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-gold" strokeWidth={1.5} />
                <h2 className="mt-5 text-3xl font-medium">Thank you.</h2>
                <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                  We've received your request and will be in touch within one working day. In the meantime, feel free
                  to reach us on WhatsApp.
                </p>
                <Button asChild variant="whatsapp" size="lg" className="mt-6">
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                  </a>
                </Button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
                <Field id="name" label="Full name" required>
                  <Input id="name" name="name" required autoComplete="name" placeholder="Your name" />
                </Field>
                <Field id="phone" label="Phone" required>
                  <Input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="+91" />
                </Field>
                <Field id="email" label="Email" required>
                  <Input id="email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
                </Field>
                <Field id="city" label="City" required>
                  <Input id="city" name="city" required autoComplete="address-level2" placeholder="Your city" />
                </Field>
                <Field id="goal" label="Primary goal" required>
                  <Select name="goal" required>
                    <SelectTrigger id="goal" className="h-11 rounded-lg">
                      <SelectValue placeholder="Select a goal" />
                    </SelectTrigger>
                    <SelectContent>
                      {goalOptions.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="horizon" label="Investment horizon" required>
                  <Select name="horizon" required>
                    <SelectTrigger id="horizon" className="h-11 rounded-lg">
                      <SelectValue placeholder="Select a horizon" />
                    </SelectTrigger>
                    <SelectContent>
                      {horizonOptions.map((h) => (
                        <SelectItem key={h} value={h}>
                          {h}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="amount" label="Approximate investment amount" hint="Optional" className="sm:col-span-2">
                  <Select name="amount">
                    <SelectTrigger id="amount" className="h-11 rounded-lg">
                      <SelectValue placeholder="Select a range" />
                    </SelectTrigger>
                    <SelectContent>
                      {amountOptions.map((a) => (
                        <SelectItem key={a} value={a}>
                          {a}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field id="message" label="Message" className="sm:col-span-2">
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us a little about what you'd like to discuss."
                    className="rounded-lg"
                  />
                </Field>
                <label className="flex items-start gap-3 text-sm text-muted-foreground sm:col-span-2">
                  <Checkbox
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    className="mt-0.5"
                    aria-label="Consent to be contacted"
                  />
                  <span>
                    I consent to being contacted by phone, WhatsApp or email regarding my enquiry, and I understand
                    that mutual fund investments are subject to market risks.
                  </span>
                </label>
                <div className="sm:col-span-2">
                  <Button type="submit" variant="gold" size="xl" disabled={!consent} className="w-full sm:w-auto">
                    Request a Meeting
                  </Button>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Complimentary and without obligation. We never share your details.
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-navy-gradient p-7 text-navy-foreground">
              <p className="eyebrow">Reach us directly</p>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <a href={site.phoneHref} className="hover:text-gold">
                    {site.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    Message on WhatsApp
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <a href={`mailto:${site.email}`} className="hover:text-gold">
                    {site.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>
                    {site.address}
                    <br />
                    <span className="text-navy-foreground/60">{site.hours}</span>
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-7 text-sm leading-relaxed text-muted-foreground">
              <p className="font-display text-lg font-medium text-foreground">What happens next</p>
              <ol className="mt-3 list-decimal space-y-2 pl-4">
                <li>We call or message to fix a convenient time.</li>
                <li>A relaxed 45-minute conversation about your goals and mutual fund investing.</li>
                <li>If it feels right, we discuss suitable mutual fund categories — no pressure.</li>
              </ol>
            </div>
            <p className="text-xs text-muted-foreground">
              AMFI Registered Mutual Fund Distributor · {site.arn}. {site.disclaimerShort}
            </p>
          </aside>
        </div>
      </Section>
    </>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-medium">
        <span>
          {label}
          {required && <span className="text-gold"> *</span>}
        </span>
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </Label>
      {children}
    </div>
  );
}
