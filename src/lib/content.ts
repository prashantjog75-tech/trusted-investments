import {
  Compass,
  Landmark,
  LineChart,
  Repeat,
  Users,
  PiggyBank,
  GraduationCap,
  TrendingUp,
  Home,
  ShieldCheck,
  Heart,
  Target,
  Clock,
  MessageSquare,
  Search,
  ClipboardList,
  Wallet,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";

export type Item = { icon: LucideIcon; title: string; body: string };

export const services: Item[] = [
  {
    icon: Compass,
    title: "Goal-based mutual fund investing",
    body: "We start with what matters to your family — a home, education, retirement — and map suitable mutual fund solutions to each goal and its timeline.",
  },
  {
    icon: Landmark,
    title: "Mutual fund distribution",
    body: "As an AMFI Registered Mutual Fund Distributor (ARN-83625), we help you select, invest in and manage schemes across leading fund houses — with paperwork handled end to end.",
  },
  {
    icon: Repeat,
    title: "SIP investing assistance",
    body: "Systematic Investment Plans make investing a monthly habit. We help you size SIPs to your goals and income, and step them up as life moves forward.",
  },
  {
    icon: PiggyBank,
    title: "Retirement & goal-based investing",
    body: "A clear picture of what retirement could cost, how much to set aside, and which fund categories may suit your horizon — reviewed as circumstances change.",
  },
  {
    icon: LineChart,
    title: "Portfolio review & rebalancing guidance",
    body: "Periodic reviews of your existing mutual fund holdings to check alignment with goals, asset allocation and risk comfort, with suggestions to rebalance where useful.",
  },
  {
    icon: Users,
    title: "Family mutual fund services",
    body: "Bringing the whole family's investments into one coherent plan — nominations, joint goals, and a simple structure the next generation can understand.",
  },
];

export const processSteps = [
  {
    icon: Search,
    step: "01",
    title: "Discover",
    body: "We listen. Your family, your dreams, your worries, your current investments and commitments — everything that shapes a plan that truly fits.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Assess",
    body: "We assess your risk comfort and time horizon for each goal, then recommend suitable mutual fund categories and a sensible asset allocation.",
  },
  {
    icon: Wallet,
    step: "03",
    title: "Invest",
    body: "We set up SIPs and lump-sum investments with clear documentation, so getting started is simple and every rupee has a purpose.",
  },
  {
    icon: RefreshCw,
    step: "04",
    title: "Review",
    body: "Life changes, markets move. We review periodically, keep you informed in plain language, and discuss suitable portfolio changes as your goals evolve.",
  },
];

export const whyUs: Item[] = [
  {
    icon: Heart,
    title: "A relationship, not a transaction",
    body: "Many families we work with have been with us for years. You speak to the same person who knows your story — not a call centre.",
  },
  {
    icon: Target,
    title: "Goal focus above everything",
    body: "We measure progress against your goals, not against yesterday's headlines. That keeps decisions calm and purposeful.",
  },
  {
    icon: ShieldCheck,
    title: "A disciplined approach",
    body: "Suitable asset allocation, regular investing, patience through cycles — simple principles applied consistently over 15+ years.",
  },
  {
    icon: Clock,
    title: "Long-term support",
    body: "From your first SIP to your child's admission and your own retirement, we stay alongside you for the long journey.",
  },
  {
    icon: MessageSquare,
    title: "Transparent communication",
    body: "Clear explanations, honest conversations about risk, and no jargon. You always know what you own and why.",
  },
];

export const goals: Item[] = [
  {
    icon: PiggyBank,
    title: "Retirement",
    body: "Build a corpus that can support the lifestyle you want after work, with a plan that respects inflation and your time horizon.",
  },
  {
    icon: GraduationCap,
    title: "Child's education",
    body: "Higher education costs rise steadily. Starting early and investing regularly can make the milestone far less stressful.",
  },
  {
    icon: TrendingUp,
    title: "Wealth creation",
    body: "Long-term, diversified investing aimed at growing your family's wealth patiently, with risk you are comfortable carrying.",
  },
  {
    icon: Home,
    title: "Home & other life goals",
    body: "A down payment, a wedding, a sabbatical, a family trip — medium-term goals deserve their own suitable investment approach.",
  },
  {
    icon: ShieldCheck,
    title: "Emergency & financial resilience",
    body: "An accessible cushion for the unexpected, so long-term investments are never disturbed when life throws a surprise.",
  },
];

export const learnTopics = [
  {
    title: "What is a mutual fund?",
    body: "A mutual fund pools money from many investors and is managed by a professional fund manager who invests it in equities, bonds or other assets according to the scheme's stated objective. You own units of the fund, and their value moves with the underlying investments. Mutual funds in India are regulated by SEBI.",
  },
  {
    title: "What is a SIP?",
    body: "A Systematic Investment Plan lets you invest a fixed amount at regular intervals — usually monthly — into a mutual fund scheme. It builds a saving habit, removes the need to time the market, and averages your purchase cost over time (rupee-cost averaging).",
  },
  {
    title: "Risk profiling",
    body: "Risk profiling is an honest look at how much fluctuation you can afford (capacity) and how much you can tolerate emotionally (attitude), alongside your goals and time horizon. It helps match you with fund categories whose behaviour you can live with through market cycles.",
  },
  {
    title: "Asset allocation",
    body: "Asset allocation is how your money is divided between equity, debt, gold and other asset classes. Different assets behave differently at different times; a thoughtful mix, matched to each goal's timeline, is one of the most important decisions in a portfolio.",
  },
  {
    title: "The power of compounding",
    body: "Compounding is earning returns on your earlier returns. Over long periods it can have a meaningful effect on the growth of an investment — which is why starting early and staying invested matter more than finding the 'perfect' moment. Returns are not guaranteed and may vary.",
  },
  {
    title: "Long-term investing",
    body: "Markets rise and fall in the short run. Historically, longer holding periods have tended to smooth out volatility, though past performance is no assurance of future results. A long-term mindset, linked to real goals, helps investors stay the course.",
  },
];

export const faqs = [
  {
    q: "What does a Mutual Fund Distributor do?",
    a: "An AMFI Registered Mutual Fund Distributor helps investors understand, select and invest in mutual fund schemes, and supports them with transactions, documentation and ongoing service. We are registered under ARN-83625.",
  },
  {
    q: "Is there a fee for the initial meeting?",
    a: "The initial meeting is complimentary. As a distributor, we may receive commission from Asset Management Companies on investments made through us; we are happy to explain this transparently.",
  },
  {
    q: "How much do I need to start investing?",
    a: "Many mutual fund schemes allow SIPs starting from a few hundred rupees a month. The right amount depends on your goals and comfort — we'll work it out together.",
  },
  {
    q: "Are returns guaranteed?",
    a: "No. Mutual fund investments are subject to market risks and returns are not guaranteed. We focus on suitability, discipline and long-term goal alignment rather than predictions.",
  },
  {
    q: "Do you serve clients outside your city?",
    a: "Yes. We serve families across India through calls, video meetings and digital onboarding, alongside in-person meetings where possible.",
  },
  {
    q: "Can you review my existing mutual fund portfolio?",
    a: "Yes. We review existing holdings for alignment with your goals, asset allocation and risk comfort, and suggest changes where they may be useful.",
  },
  {
    q: "How often will we review my mutual fund portfolio?",
    a: "Typically once or twice a year, and whenever a significant life event occurs — a new child, a job change, an inheritance or a new goal.",
  },
  {
    q: "Are you an investment adviser?",
    a: "No. Prashant Jog operates only as an AMFI Registered Mutual Fund Distributor under ARN-83625. The information shared is general or incidental to mutual fund distribution and does not constitute personalised investment advice.",
  },
];
