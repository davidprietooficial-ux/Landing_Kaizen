// ─────────────────────────────────────────────────────────────────────────────
// Kaizen Studios — English content
// Mirrors src/lib/config.ts export-for-export. Keep both files in sync: if a
// field is added/renamed in config.ts, mirror it here. Locale-agnostic values
// (links, contact info, asset flags, client logos) are re-exported straight
// from config.ts — no point duplicating a phone number or a boolean.
// ─────────────────────────────────────────────────────────────────────────────

export {
  CONTACT,
  SOCIAL,
  DAVID_LINKS,
  ASSETS,
  WORK_MARQUEE,
  ACCESS_TIERS, // English copy for these lands when /services goes live
} from './config'

export const SITE = {
  name: 'Kaizen Studios',
  founder: 'David Seiko',
  tagline: 'The definitive system. Not just another website.',
  description:
    "We don't sell loose services: we sell a system. Meta Ads that bring in the right people, a website that's 100% yours and converts, and organic content that grows your brand. Quality video production in every piece.",
  descriptionMobile:
    'A system that attracts, converts, and grows your brand — with quality video production in every piece.',
  url: 'https://kaizenstudios.co',
}

export const PAIN_POINTS = [
  {
    title: "You depend on an algorithm you don't control",
    text: 'The day the rules change — or your account goes down — your business disappears from the internet. None of what you built there is actually yours.',
  },
  {
    title: 'Without your own site, you have no authority',
    text: "You're one account among thousands, not an established brand. Meanwhile, you waste time re-explaining the same thing to every unfiltered lead who shows up.",
  },
]

export const SYSTEM_PHASES: { cap: string; art?: string; t: string; d: string }[] = [
  {
    cap: 'Attract',
    art: '/stages/07-trafico.webp',
    t: 'Attract',
    d: 'Meta Ads that use your own channels to bring the right people to you — not to fill your feed, to fill your calendar.',
  },
  {
    cap: 'Convert',
    art: '/stages/06-web.webp',
    t: 'Convert',
    d: 'A website that is 100% yours, with strategic copy and quality video production. The click stops getting lost: it becomes a customer.',
  },
  {
    cap: 'Grow',
    art: '/stages/08-gestion.png',
    t: 'Grow',
    d: 'Organic content that builds brand and trust before the click — the layer that raises lead quality and conversion.',
  },
]

export const DIFFERENTIATOR = {
  eyebrow: 'What sets us apart',
  title: 'Quality video production. No templates, no generic renders.',
  text: "It's the hook that builds authority — and what opens the door to the tech and automation side. Every piece you see here is real: ours, shot and edited to a cinematic standard.",
}

export const CONVERSION_POINTS = [
  {
    title: 'Copy that persuades',
    text: 'Every line is written from marketing experience — to move people to act, not to decorate the page.',
  },
  {
    title: 'Structure built around the customer',
    text: 'The order of every section follows the user experience, not chance.',
  },
  {
    title: 'Aesthetic judgment in every decision',
    text: "Nothing is left to luck: there's a reason behind every color, space, and visual hierarchy.",
  },
] as const

// Anti-positioning — used if/when "How we work" ships in English.
export const HOW_WE_WORK = [
  "We're not a 50-person agency. We're a group of independents who teamed up to take on better clients and better projects.",
  'We take on few projects at a time. Each one gets 100% of our attention — we never spread it across twenty accounts.',
  "Everything is handcrafted, down to the detail. We're obsessive about the result, not the template.",
  "We're not the cheapest option. We're the best. The promise was never speed — it's quality.",
] as const

export const TEAM: { name: string; role: string; bio: string; photo?: string; pos?: string; social?: string }[] = [
  {
    name: 'Juan C. Moreno',
    role: 'Editor, partner & marketer',
    bio: 'An expert in marketing, content systems, and launches. He was marketing director for Julián Otálora, featured in Forbes Argentina and Forbes Ecuador, for several years. He\'s the person who makes an idea reach millions.',
    photo: '/img/team-1.webp',
    social: 'https://www.instagram.com/juan.edita/',
  },
  {
    name: 'Jennifer Correa',
    role: 'Community Manager',
    bio: "An expert in human response and community interaction. She's also a model and works as one on various projects. Attentive, helpful, and warm — the one who makes sure no message goes unanswered.",
    photo: '/img/jennifer-retrato.webp',
    social: 'https://www.instagram.com/jennifercs07/',
  },
  {
    name: 'Juan Guzmán',
    role: 'Filmmaker & editor',
    bio: "Over 4 years filming everything from press to a creative tattoo studio. His focus is on quality, not quantity of projects — committed to every single one, no matter the size of the client.",
    photo: '/img/team-2.webp',
    pos: '50% 26%',
    social: 'https://www.instagram.com/juanfilmmaker377/',
  },
]

export const METRICS: { value: number | null; suffix: string; label: string }[] = [
  { value: 15, suffix: '+', label: 'Projects delivered' },
  { value: 8, suffix: '+', label: 'Clients served' },
  { value: 4, suffix: '+', label: 'Years in video production' },
  { value: 70, suffix: '+', label: 'Pieces delivered' },
]

export const CLIENTS: { name: string; src: string; h?: number; w?: number; iw: number; ih: number }[] = [
  { name: 'Harumi', src: '/logos-clientes/harumi.webp', h: 70, iw: 280, ih: 280 },
  { name: 'Neuropúblico', src: '/logos-clientes/neuro.webp', iw: 640, ih: 98 },
  { name: 'Trifactor', src: '/logos-clientes/trifactor.webp', h: 66, iw: 300, ih: 234 },
  { name: 'Atlax 360', src: '/logos-clientes/atlax.webp', iw: 520, ih: 175 },
  { name: 'Bogotá Department of Education', src: '/logos-clientes/sed.webp', h: 90, w: 350, iw: 700, ih: 179 },
]

export const TESTIMONIALS_BADGE = { label: 'Rating' }
export const TESTIMONIALS: { name: string; role?: string; company?: string; photo: string; quote: string; stars: number }[] = [
  {
    name: 'Ricardo Reyes', role: 'General Manager', company: 'Atlax Colombia', photo: '/testimonials/ricardo-96.webp', stars: 5,
    quote: "Working with Kaizen has been an experience that exceeds any expectation: they build trust from the start through the quality of their team and their professionalism, and their real value is turning an initial idea into a clear, emotional, high-impact message. More than producing videos, they turn ideas into stories that truly connect — the final result is always better than you imagined.",
  },
  {
    name: 'Diana Castillo Hernández', role: 'Independent Accountant', photo: '/testimonials/diana.jpg', stars: 5,
    quote: "Before, I had to re-explain to every client what services I offered and how to book an appointment — I wasted time with people who weren't even going to hire me. Kaizen built me a page where I explain my accounting services and book appointments directly from it. Now the website does that filtering for me: by the time someone messages me, they already know what they want and are ready to move forward. The calls I get today are much more effective.",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Qualification form → src/components/QualifyForm.tsx
// ─────────────────────────────────────────────────────────────────────────────

export const FORM_INTEREST_OPTIONS = [
  { value: 'clientes', label: "I don't get enough new clients" },
  { value: 'conversion', label: "My website doesn't convert, I lose clients" },
  { value: 'seguimiento', label: 'Leads slip through, no follow-up' },
  { value: 'no-seguro', label: "I'm not sure" },
  { value: 'otro', label: 'Other' },
] as const

export const FORM_TIMELINE_OPTIONS = [
  { value: 'ya', label: 'Now, this month' },
  { value: '1-3-meses', label: 'In 1–3 months' },
  { value: 'explorando', label: 'Just exploring' },
] as const

export const FORM_REVENUE_BUCKETS = {
  COP: ['Less than $10,000,000', '$10,000,000 – $30,000,000', '$30,000,000 – $100,000,000', 'More than $100,000,000', "I'd rather not say"],
  USD: ['Less than $3,000', '$3,000 – $9,000', '$9,000 – $30,000', 'More than $30,000', "I'd rather not say"],
} as const

export const FORM_BUDGET_BUCKETS = {
  COP: ['Less than $2,000,000', '$2,000,000 – $5,000,000', '$5,000,000 – $10,000,000', 'More than $10,000,000'],
  USD: ['Less than $650', '$650 – $1,500', '$1,500 – $3,000', 'More than $3,000'],
} as const

export const COUNTRIES = [
  { name: 'Colombia', code: '+57' },
  { name: 'Mexico', code: '+52' },
  { name: 'United States', code: '+1' },
  { name: 'Argentina', code: '+54' },
  { name: 'Chile', code: '+56' },
  { name: 'Peru', code: '+51' },
  { name: 'Ecuador', code: '+593' },
  { name: 'Venezuela', code: '+58' },
  { name: 'Spain', code: '+34' },
  { name: 'Panama', code: '+507' },
  { name: 'Costa Rica', code: '+506' },
  { name: 'Uruguay', code: '+598' },
  { name: 'Paraguay', code: '+595' },
  { name: 'Bolivia', code: '+591' },
  { name: 'Guatemala', code: '+502' },
  { name: 'Honduras', code: '+504' },
  { name: 'El Salvador', code: '+503' },
  { name: 'Nicaragua', code: '+505' },
  { name: 'Dominican Republic', code: '+1' },
  { name: 'Puerto Rico', code: '+1' },
  { name: 'Cuba', code: '+53' },
  { name: 'Brazil', code: '+55' },
  { name: 'Canada', code: '+1' },
  { name: 'United Kingdom', code: '+44' },
  { name: 'France', code: '+33' },
  { name: 'Germany', code: '+49' },
  { name: 'Italy', code: '+39' },
  { name: 'Portugal', code: '+351' },
  { name: 'Other', code: '' },
] as const
