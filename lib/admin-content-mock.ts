export type ContentStatus = "published" | "draft";

export type TrainingVideo = {
  id: string;
  titleHi: string;
  titleEn: string;
  language: string;
  category: string;
  level: string;
  views: number;
  status: ContentStatus;
  thumbnailColor: string;
  youtubeUrl?: string;
};

export type PodcastEpisode = {
  id: string;
  episodeNumber: number;
  title: string;
  guest: string | null;
  duration: string;
  plays: number;
  publishedDate: string;
  status: ContentStatus;
  featured: boolean;
  coverColor: string;
  language: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  language: string;
  status: ContentStatus | "scheduled";
  views: number;
  publishedDate: string;
  category: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  hasFeaturedImage: boolean;
  hasImageAlt: boolean;
};

export const VIDEO_LANGUAGES = [
  "Hindi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Marathi",
  "Bengali",
];

export const VIDEO_CATEGORIES = [
  "Leak Fix",
  "Pipe Fitting",
  "Bathroom",
  "Bore Well",
  "Safety",
];

export const VIDEO_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export const BLOG_CATEGORIES = [
  "Tips",
  "News",
  "Product Review",
  "Success Story",
];

export const MOCK_TRAINING_VIDEOS: TrainingVideo[] = [
  {
    id: "tv-1",
    titleHi: "पाइप लीक कैसे ठीक करें",
    titleEn: "How to Fix Pipe Leaks",
    language: "Hindi",
    category: "Leak Fix",
    level: "Beginner",
    views: 12450,
    status: "published",
    thumbnailColor: "#f97316",
    youtubeUrl: "https://youtube.com/watch?v=example1",
  },
  {
    id: "tv-2",
    titleHi: "PVC पाइप फिटिंग गाइड",
    titleEn: "PVC Pipe Fitting Guide",
    language: "Telugu",
    category: "Pipe Fitting",
    level: "Intermediate",
    views: 8920,
    status: "published",
    thumbnailColor: "#3b82f6",
  },
  {
    id: "tv-3",
    titleHi: "बाथरूम प्लंबिंग बेसिक्स",
    titleEn: "Bathroom Plumbing Basics",
    language: "Tamil",
    category: "Bathroom",
    level: "Beginner",
    views: 6340,
    status: "draft",
    thumbnailColor: "#22c55e",
  },
  {
    id: "tv-4",
    titleHi: "बोरवेल पंप इंस्टॉलेशन",
    titleEn: "Borewell Pump Installation",
    language: "Kannada",
    category: "Bore Well",
    level: "Advanced",
    views: 4210,
    status: "published",
    thumbnailColor: "#a855f7",
  },
  {
    id: "tv-5",
    titleHi: "साइट सेफ्टी नियम",
    titleEn: "On-Site Safety Rules",
    language: "Marathi",
    category: "Safety",
    level: "Beginner",
    views: 9870,
    status: "published",
    thumbnailColor: "#ef4444",
  },
  {
    id: "tv-6",
    titleHi: "गैस लाइन चेकलिस्ट",
    titleEn: "Gas Line Safety Checklist",
    language: "Bengali",
    category: "Safety",
    level: "Intermediate",
    views: 2150,
    status: "draft",
    thumbnailColor: "#64748b",
  },
];

export const PODCAST_STATS = {
  totalEpisodes: 48,
  totalPlays: 284500,
  mostPlayedTitle: "Episode 42: Delhi Plumber Success Story",
  avgDuration: "38 min",
};

export const MOCK_PODCAST_EPISODES: PodcastEpisode[] = [
  {
    id: "pe-1",
    episodeNumber: 48,
    title: "मुंबई में प्लंबिंग बिज़नेस कैसे बढ़ाएं",
    guest: "Rajesh Kumar",
    duration: "42:18",
    plays: 18420,
    publishedDate: "1 Jun 2025",
    status: "published",
    featured: true,
    coverColor: "#f97316",
    language: "Hindi",
  },
  {
    id: "pe-2",
    episodeNumber: 47,
    title: "Customer Trust और Online Reviews",
    guest: "Priya Sharma",
    duration: "35:05",
    plays: 15230,
    publishedDate: "25 May 2025",
    status: "published",
    featured: false,
    coverColor: "#3b82f6",
    language: "Hindi",
  },
  {
    id: "pe-3",
    episodeNumber: 46,
    title: "GST और Invoice Tips for Plumbers",
    guest: null,
    duration: "28:44",
    plays: 12890,
    publishedDate: "18 May 2025",
    status: "published",
    featured: false,
    coverColor: "#22c55e",
    language: "Hindi",
  },
  {
    id: "pe-4",
    episodeNumber: 45,
    title: "Telugu Plumbers Community Roundtable",
    guest: "Suresh Reddy",
    duration: "51:12",
    plays: 9650,
    publishedDate: "11 May 2025",
    status: "draft",
    featured: false,
    coverColor: "#a855f7",
    language: "Telugu",
  },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "bp-1",
    title: "10 Pipe Leak Fixes Every Plumber Should Know",
    slug: "10-pipe-leak-fixes-every-plumber-should-know",
    language: "English",
    status: "published",
    views: 8420,
    publishedDate: "28 May 2025",
    category: "Tips",
    metaTitle: "10 Pipe Leak Fixes | Plumber Guru Blog",
    metaDescription:
      "Essential pipe leak repair techniques for Indian plumbers. Step-by-step tips in Hindi and English.",
    focusKeyword: "pipe leak fix",
    hasFeaturedImage: true,
    hasImageAlt: true,
  },
  {
    id: "bp-2",
    title: "Jaipur Plumber Earns ₹50,000/Month Using Plumber Guru",
    slug: "jaipur-plumber-success-story",
    language: "Hindi",
    status: "published",
    views: 12340,
    publishedDate: "20 May 2025",
    category: "Success Story",
    metaTitle: "Plumber Success Story Jaipur",
    metaDescription: "How a Jaipur plumber grew his business with Plumber Guru tools and training.",
    focusKeyword: "plumber success",
    hasFeaturedImage: true,
    hasImageAlt: false,
  },
  {
    id: "bp-3",
    title: "Best Water Heater Brands in India 2025",
    slug: "best-water-heater-brands-india-2025",
    language: "English",
    status: "draft",
    views: 0,
    publishedDate: "—",
    category: "Product Review",
    metaTitle: "Water Heater",
    metaDescription: "Review.",
    focusKeyword: "water heater",
    hasFeaturedImage: false,
    hasImageAlt: false,
  },
  {
    id: "bp-4",
    title: "Plumber Guru Launches Kannada Training Videos",
    slug: "plumber-guru-kannada-training-launch",
    language: "English",
    status: "scheduled",
    views: 0,
    publishedDate: "5 Jun 2025",
    category: "News",
    metaTitle: "Kannada Training Videos Launch | Plumber Guru",
    metaDescription:
      "Plumber Guru expands training content with Kannada-language plumbing tutorials for South India.",
    focusKeyword: "kannada training",
    hasFeaturedImage: true,
    hasImageAlt: true,
  },
];

export const CSV_VIDEO_TEMPLATE = `title_hi,title_en,youtube_url,language,category,level,status
पाइप लीक,Pipe Leak Fix,https://youtube.com/watch?v=xxx,Hindi,Leak Fix,Beginner,draft
`;

export type SeoHealth = "good" | "warning" | "poor";

export function computeSeoHealth(fields: {
  title: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  content: string;
  imageAlt: string;
}): { score: SeoHealth; checks: { label: string; status: SeoHealth }[] } {
  const checks = [
    {
      label: "Title length (50–60 chars ideal)",
      status: seoCheck(
        fields.metaTitle.length >= 50 && fields.metaTitle.length <= 60,
        fields.metaTitle.length >= 40 && fields.metaTitle.length <= 70
      ),
    },
    {
      label: "Meta description (150–160 chars ideal)",
      status: seoCheck(
        fields.metaDescription.length >= 150 && fields.metaDescription.length <= 160,
        fields.metaDescription.length >= 120 && fields.metaDescription.length <= 180
      ),
    },
    {
      label: "Focus keyword in content",
      status: seoCheck(
        fields.focusKeyword.length > 0 &&
          fields.content.toLowerCase().includes(fields.focusKeyword.toLowerCase()),
        fields.focusKeyword.length > 0 &&
          fields.content.toLowerCase().includes(fields.focusKeyword.toLowerCase().split(" ")[0])
      ),
    },
    {
      label: "Featured image alt text",
      status: seoCheck(fields.imageAlt.trim().length >= 10, fields.imageAlt.trim().length >= 3),
    },
  ];

  const poor = checks.filter((c) => c.status === "poor").length;
  const warning = checks.filter((c) => c.status === "warning").length;
  const score: SeoHealth =
    poor > 0 ? "poor" : warning > 1 ? "warning" : warning === 1 ? "warning" : "good";

  return { score, checks };
}

function seoCheck(good: boolean, ok: boolean): SeoHealth {
  if (good) return "good";
  if (ok) return "warning";
  return "poor";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
