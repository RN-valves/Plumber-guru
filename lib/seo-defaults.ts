import type { Locale } from "@/lib/locale";
import type { LocaleHomeKey, PublicPageSeoKey } from "@/types/site-settings";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://plumber-guru.com";

export const SITE = {
  name: "Plumber Guru",
  tagline: "India's #1 Plumber Platform",
  taglineHi: "भारत का नंबर 1 प्लंबर प्लेटफॉर्म",
  description:
    "Plumber Guru — भारत का नंबर 1 प्लंबर प्लेटफॉर्म। Find certified plumbers, get training, jobs, and tools. भारत के प्लंबरों के लिए बनाया गया।",
  email: "hello@plumber-guru.com",
  supportEmail: "support@plumber-guru.com",
  phone: "+91-XXXXXXXXXX",
  twitterHandle: "@plumberguru",
  locale: "en_IN",
  defaultKeywords: [
    "plumber",
    "plumbing",
    "India",
    "प्लंबर",
    "प्लंबिंग",
    "plumber training",
    "plumber jobs",
    "find plumber",
    "certified plumber India",
    "plumber near me",
  ],
} as const;

export type PageSeoKey =
  | "home"
  | "about"
  | "training"
  | "jobs"
  | "tools"
  | "findPlumber"
  | "support"
  | "community"
  | "healthSafety"
  | "brands"
  | "login"
  | "register"
  | "dashboard"
  | "admin"
  | "notFound";

type PageSeoEntry = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  priority?: number;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  localeTitles?: Partial<Record<Locale, { title: string; description: string }>>;
};

export const PAGE_SEO: Record<PageSeoKey, PageSeoEntry> = {
  home: {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    path: "/",
    priority: 1,
    changeFrequency: "daily",
    localeTitles: {
      hi: {
        title: `${SITE.name} — ${SITE.taglineHi}`,
        description:
          "प्रमाणित प्लंबर खोजें, प्रशिक्षण लें, नौकरियां पाएं और टूल्स इस्तेमाल करें। भारत के प्लंबरों के लिए बनाया गया प्लेटफॉर्म।",
      },
      te: {
        title: `${SITE.name} — భారతదేశం యొక్క #1 ప్లంబర్ ప్లాట్‌ఫారమ్`,
        description:
          "ధృవీకరించబడిన ప్లంబర్లను కనుగొనండి, శిక్షణ పొందండి, ఉద్యోగాలు మరియు టూల్స్ పొందండి.",
      },
      ta: {
        title: `${SITE.name} — இந்தியாவின் #1 பிளம்பர் தளம்`,
        description:
          "சான்றளிக்கப்பட்ட பிளம்பர்களைக் கண்டறியுங்கள், பயிற்சி, வேலைகள் மற்றும் கருவிகளைப் பெறுங்கள்.",
      },
      kn: {
        title: `${SITE.name} — ಭಾರತದ #1 ಪ್ಲಂಬರ್ ವೇದಿಕೆ`,
        description:
          "ಪ್ರಮಾಣೀಕೃತ ಪ್ಲಂಬರ್‌ಗಳನ್ನು ಹುಡುಕಿ, ತರಬೇತಿ, ಉದ್ಯೋಗಗಳು ಮತ್ತು ಟೂಲ್‌ಗಳನ್ನು ಪಡೆಯಿರಿ.",
      },
    },
  },
  about: {
    title: `About Us — ${SITE.name}`,
    description:
      "Learn about Plumber Guru's mission to empower Indian plumbers with training, verified profiles, jobs, and fair pay across 500+ cities.",
    path: "/about",
    keywords: [
      "about plumber guru",
      "plumber platform India",
      "plumber mission",
    ],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  training: {
    title: `Plumber Training Videos — ${SITE.name}`,
    description:
      "Free and premium plumbing training in Hindi, Telugu, Tamil & more. Learn pipe fitting, leak fixes, bathroom work, and safety from certified experts.",
    path: "/training",
    keywords: [
      "plumber training",
      "plumbing course India",
      "pipe fitting tutorial",
      "plumber certification",
      "प्लंबर प्रशिक्षण",
    ],
    priority: 0.9,
    changeFrequency: "weekly",
  },
  jobs: {
    title: `Plumber Jobs in India — ${SITE.name}`,
    description:
      "Find daily plumber jobs across Delhi, Mumbai, Bangalore, Pune and 500+ cities. Apply to verified leads with fair pay and customer ratings.",
    path: "/jobs",
    keywords: [
      "plumber jobs India",
      "plumbing work near me",
      "daily wage plumber jobs",
      "plumber vacancy",
      "प्लंबर नौकरी",
    ],
    priority: 0.9,
    changeFrequency: "daily",
  },
  tools: {
    title: `Plumber Tools & Invoice Generator — ${SITE.name}`,
    description:
      "Free GST invoice generator, material cost calculator, and plumbing tools for Indian plumbers. Create bills, estimate pipe costs, and manage work.",
    path: "/tools",
    keywords: [
      "plumber invoice generator",
      "GST bill plumber",
      "plumbing material calculator",
      "plumber tools India",
    ],
    priority: 0.8,
    changeFrequency: "weekly",
  },
  findPlumber: {
    title: `Find a Certified Plumber Near You — ${SITE.name}`,
    description:
      "Search verified plumbers by city and skill. Book trusted plumbing experts for leaks, fittings, bathroom work, and emergency repairs across India.",
    path: "/find-plumber",
    keywords: [
      "find plumber near me",
      "certified plumber India",
      "book plumber online",
      "plumber directory",
      "प्लंबर खोजें",
    ],
    priority: 0.9,
    changeFrequency: "daily",
  },
  support: {
    title: `Help & Support — ${SITE.name}`,
    description:
      "Get help with your Plumber Guru account, jobs, payments, and training. Contact our 24×7 support team for plumbers and customers across India.",
    path: "/support",
    keywords: [
      "plumber guru support",
      "plumber help",
      "customer support plumbing",
    ],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  community: {
    title: `Plumber Community Forum — ${SITE.name}`,
    description:
      "Join India's plumber community. Share tips, ask questions, discuss jobs, products, and techniques with fellow plumbers in your language.",
    path: "/community",
    keywords: [
      "plumber forum India",
      "plumbing community",
      "plumber discussion",
    ],
    priority: 0.7,
    changeFrequency: "weekly",
  },
  healthSafety: {
    title: `Plumber Health & Safety Guide — ${SITE.name}`,
    description:
      "Essential health and safety guidelines for Indian plumbers. PPE, chemical handling, electrical safety, and worksite best practices.",
    path: "/health-safety",
    keywords: [
      "plumber safety India",
      "plumbing PPE",
      "worksite safety plumber",
      "plumber health guide",
    ],
    priority: 0.7,
    changeFrequency: "monthly",
  },
  brands: {
    title: `Trusted Plumbing Brands — ${SITE.name}`,
    description:
      "Explore trusted plumbing brands, pipes, fittings, and tools recommended for Indian plumbers. Compare quality, pricing, and availability.",
    path: "/brands",
    keywords: [
      "plumbing brands India",
      "pipe brands",
      "plumber fittings brands",
      "plumbing products India",
    ],
    priority: 0.6,
    changeFrequency: "monthly",
  },
  login: {
    title: `Login — ${SITE.name}`,
    description: "Sign in to your Plumber Guru account.",
    path: "/auth/login",
  },
  register: {
    title: `Register — ${SITE.name}`,
    description: "Create your Plumber Guru plumber or customer account.",
    path: "/auth/register",
  },
  dashboard: {
    title: `Dashboard — ${SITE.name}`,
    description: "Your Plumber Guru dashboard.",
    path: "/dashboard",
  },
  admin: {
    title: `Admin — ${SITE.name}`,
    description: "Plumber Guru admin panel.",
    path: "/admin",
  },
  notFound: {
    title: `Page Not Found — ${SITE.name}`,
    description: "The page you are looking for does not exist.",
    path: "/404",
  },
};

export const PUBLIC_SITEMAP_PAGES: PublicPageSeoKey[] = [
  "home",
  "about",
  "training",
  "jobs",
  "tools",
  "findPlumber",
  "support",
  "community",
  "healthSafety",
  "brands",
];

export const LOCALE_HOME_PREFIXES: LocaleHomeKey[] = [
  "hi",
  "te",
  "ta",
  "kn",
];
