import { Link, useRouterState } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/site-config";

export function StickyCta() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname === "/contact") return null;

  return (
    <>
      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:hidden">
        <div className="flex gap-2">
          <Button asChild variant="whatsapp" size="lg" className="flex-1">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
          </Button>
          <Button asChild variant="gold" size="lg" className="flex-[1.4]">
            <Link to="/contact">Book a Consultation</Link>
          </Button>
        </div>
      </div>

      {/* Desktop floating WhatsApp */}
      <a
        href={whatsappLink()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed right-6 bottom-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-elevated transition-transform hover:scale-105 lg:grid"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </>
  );
}
