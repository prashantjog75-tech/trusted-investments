import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site-config";

export function CtaBand({
  title = "Let's talk about the goals you're investing toward.",
  lead = "A relaxed, no-obligation conversation about your goals, your timelines, and how disciplined investing could help you get there.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section className="container-site pb-20 md:pb-28">
      <div className="bg-navy-gradient grain relative overflow-hidden rounded-3xl px-6 py-14 text-navy-foreground md:px-14 md:py-20">
        <div className="relative z-10 grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
          <div>
            <p className="eyebrow">Mutual fund discussion</p>
            <h2 className="mt-3 text-3xl font-medium md:text-4xl">{title}</h2>
            <p className="mt-4 max-w-xl text-navy-foreground/75">{lead}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
            <Button asChild variant="gold" size="xl">
              <Link to="/contact">Book a Meeting</Link>
            </Button>
            <Button asChild variant="outlineLight" size="xl">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
