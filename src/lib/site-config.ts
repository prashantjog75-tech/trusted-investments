/**
 * Central place for brand details and placeholders.
 * Replace the bracketed values when real details are available.
 */
export const site = {
  // TODO: replace with the distributor's real name
  name: "[Your Name]",
  tagline: "Mutual Fund Distributor",
  brand: "[Your Name] | Mutual Fund Distributor",
  arn: "ARN-83625",
  arnNumber: "83625",
  yearsExperience: "15+",
  familiesServed: "500+",
  coverage: "Across India",

  // TODO: replace placeholders below with real contact details
  phoneDisplay: "+91 XXXXX XXXXX",
  phoneHref: "tel:+91XXXXXXXXXX",
  whatsappNumber: "91XXXXXXXXXX", // digits only, with country code
  email: "hello@yourdomain.in",
  address: "[Office address to be added], India",
  hours: "Mon – Sat, 10:00 AM – 6:00 PM IST",

  disclaimerShort: "Mutual fund investments are subject to market risks, read all scheme related documents carefully.",
  disclaimerLong:
    "Mutual fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns. The information on this website is for general educational purposes only and does not constitute personalised investment advice, an offer or a solicitation. We act as an AMFI Registered Mutual Fund Distributor (ARN-83625) and may receive commission from Asset Management Companies on investments made through us. Please consider your goals, risk appetite and time horizon, and consult a qualified professional where appropriate, before investing.",
} as const;

export const whatsappLink = (message = "Hello, I would like to book a consultation about mutual fund investing.") =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const nav = [
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/process", label: "Process" },
  { to: "/goals", label: "Goals" },
  { to: "/learn", label: "Learn" },
  { to: "/faq", label: "FAQ" },
] as const;

export const trustStats = [
  { value: "15+", label: "Years of experience" },
  { value: "500+", label: "Families served" },
  { value: "Across", label: "India" },
  { value: "ARN", label: "83625 · AMFI Registered" },
] as const;
