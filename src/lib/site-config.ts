/** Central place for brand and contact details. */
export const site = {
  name: "Prashant Jog",
  tagline: "AMFI Registered Mutual Fund Distributor",
  brand: "Prashant Jog | AMFI Registered Mutual Fund Distributor",
  arn: "ARN-83625",
  arnNumber: "83625",
  yearsExperience: "15+",
  familiesServed: "500+",
  coverage: "Across India",

  phoneDisplay: "+91 9822223949",
  phoneHref: "tel:+919822223949",
  whatsappNumber: "919822223949",
  email: "prashant_jog@hotmail.com",
  address: "Plot No. 5-A, Chitale Marg, Dhantoli, Nagpur - 440012, India",
  hours: "Mon – Sat, 10:00 AM – 6:00 PM IST",

  disclaimerShort: "Mutual fund investments are subject to market risks, read all scheme related documents carefully.",
  disclaimerLong:
    "Mutual fund investments are subject to market risks, read all scheme related documents carefully. Past performance is not indicative of future returns. The information on this website is for general educational purposes only and does not constitute an offer or a solicitation. We act only as an AMFI Registered Mutual Fund Distributor (ARN-83625) and may receive commission from Asset Management Companies on investments made through us. Please consider your goals, risk appetite and time horizon before investing.",
} as const;

export const whatsappLink = (message = "Hello, I would like to discuss mutual fund investing.") =>
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
