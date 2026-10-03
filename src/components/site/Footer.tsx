import { Link } from "@tanstack/react-router";
import { nav, site } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-navy-gradient text-navy-foreground">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-semibold">{site.name}</p>
          <p className="mt-1 text-sm tracking-[0.14em] text-gold uppercase">
            AMFI Registered Mutual Fund Distributor · {site.arn}
          </p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-navy-foreground/75">
            Serving families across India and globally through disciplined, goal-based mutual fund investing — for
            over 15 years.
          </p>
        </div>

        <div>
          <p className="eyebrow">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-navy-foreground/80 transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
            <li><Link to="/services" className="text-navy-foreground/80 transition-colors hover:text-gold">Investment Assistance</Link></li>
            <li><Link to="/contact" className="text-navy-foreground/80 transition-colors hover:text-gold">Book a Meeting</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Contact</p>
          <ul className="mt-4 space-y-2.5 text-sm text-navy-foreground/80">
            <li>
              <a href={site.phoneHref} className="hover:text-gold">
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-gold">
                {site.email}
              </a>
            </li>
            <li>{site.address}</li>
            <li>{site.hours}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-foreground/10">
        <div className="container-site py-8">
          <p className="text-xs leading-relaxed text-navy-foreground/60">{site.disclaimerLong}</p>
          <div className="mt-6 flex flex-col gap-3 text-xs text-navy-foreground/60 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {site.name}. {site.arn}. All rights reserved.
            </p>
            <div className="flex gap-5">
              <Link to="/privacy" className="hover:text-gold">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-gold">
                Terms of Use
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
