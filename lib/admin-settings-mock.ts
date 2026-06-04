export type AdminRole =
  | "super_admin"
  | "content_manager"
  | "support_agent"
  | "city_manager";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  city: string | null;
  lastLogin: string;
  status: "active" | "invited" | "suspended";
};

export type AdminActivity = {
  id: string;
  adminName: string;
  action: string;
  detail: string;
  timestamp: string;
};

export type SmsLog = {
  id: string;
  sentAt: string;
  target: string;
  messagePreview: string;
  countSent: number;
  status: "delivered" | "failed" | "scheduled" | "pending";
  cost: number;
};

export type NotificationLog = {
  id: string;
  title: string;
  type: "push" | "in_app";
  sentAt: string;
  recipientCount: number;
  readCount: number;
};

export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  content_manager: "Content Manager",
  support_agent: "Support Agent",
  city_manager: "City Manager",
};

export const ROLE_DESCRIPTIONS: Record<AdminRole, string> = {
  super_admin: "Full access to all admin features",
  content_manager: "Training, podcast, and blog content only",
  support_agent: "Support tickets and plumber queries only",
  city_manager: "Plumbers and jobs in assigned city only",
};

export const DEFAULT_SITE_SETTINGS = {
  siteName: "Plumber Guru",
  tagline: "भारत का नंबर 1 प्लंबर प्लेटफॉर्म",
  contactPhone: "+91 1800-123-4567",
  contactEmail: "hello@plumber-guru.com",
  whatsapp: "+91 98765 43210",
  youtube: "https://youtube.com/@plumberguru",
  instagram: "https://instagram.com/plumberguru",
  whatsappChannel: "https://whatsapp.com/channel/plumberguru",
  maintenanceMode: false,
};

export const NOTIFICATION_EVENTS = [
  {
    id: "new_plumber",
    label: "New plumber registered",
    channel: "SMS to admin",
    defaultEnabled: true,
    templateKey: "new_plumber",
    defaultTemplate:
      "New plumber {plumber_name} registered from {city}. Review: plumber-guru.com/admin",
    variables: ["{plumber_name}", "{city}", "{phone}"],
  },
  {
    id: "verification",
    label: "Verification request",
    channel: "Email to admin",
    defaultEnabled: true,
    templateKey: "verification",
    defaultTemplate:
      "Verification pending for {plumber_name} ({city}). Documents submitted.",
    variables: ["{plumber_name}", "{city}", "{document_count}"],
  },
  {
    id: "new_job",
    label: "New job posted",
    channel: "Notify nearby plumbers",
    defaultEnabled: true,
    templateKey: "new_job",
    defaultTemplate:
      "New job in {city}: {job_title}. Salary ₹{salary}. Apply on Plumber Guru app.",
    variables: ["{job_title}", "{city}", "{salary}", "{posted_by}"],
  },
  {
    id: "support_ticket",
    label: "New support ticket",
    channel: "SMS to admin",
    defaultEnabled: true,
    templateKey: "support_ticket",
    defaultTemplate:
      "New support ticket #{ticket_id} from {customer_name}. Subject: {subject}",
    variables: ["{ticket_id}", "{customer_name}", "{subject}"],
  },
] as const;

export const DEFAULT_HOMEPAGE = {
  statPlumbers: "50,000+",
  statJobs: "12,000+",
  statCities: "200+",
  statTraining: "500+",
  showPodcast: true,
  showTestimonials: true,
  showLanguageBanner: true,
  featuredCities: ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai"],
};

export const DEFAULT_PAYMENT = {
  razorpayKey: "rzp_test_xxxxxxxx",
  leadCommission: "8",
  brandBasic: "4999",
  brandPro: "14999",
  brandEnterprise: "49999",
};

export const MOCK_ADMINS: AdminUser[] = [
  {
    id: "adm-1",
    name: "Rajesh Admin",
    email: "rajesh@plumber-guru.com",
    role: "super_admin",
    city: null,
    lastLogin: "3 Jun 2025, 9:30 AM",
    status: "active",
  },
  {
    id: "adm-2",
    name: "Priya Content",
    email: "priya@plumber-guru.com",
    role: "content_manager",
    city: null,
    lastLogin: "2 Jun 2025, 4:15 PM",
    status: "active",
  },
  {
    id: "adm-3",
    name: "Amit Support",
    email: "amit@plumber-guru.com",
    role: "support_agent",
    city: null,
    lastLogin: "3 Jun 2025, 8:00 AM",
    status: "active",
  },
  {
    id: "adm-4",
    name: "Suresh Mumbai",
    email: "suresh.mumbai@plumber-guru.com",
    role: "city_manager",
    city: "Mumbai",
    lastLogin: "1 Jun 2025, 11:20 AM",
    status: "active",
  },
  {
    id: "adm-5",
    name: "Neha Delhi",
    email: "neha.delhi@plumber-guru.com",
    role: "city_manager",
    city: "Delhi",
    lastLogin: "—",
    status: "invited",
  },
];

export const MOCK_ADMIN_ACTIVITY: AdminActivity[] = [
  {
    id: "aa-1",
    adminName: "Rajesh Admin",
    action: "Verified plumber",
    detail: "Approved Suresh Patel (Ahmedabad)",
    timestamp: "3 Jun 2025, 10:24 AM",
  },
  {
    id: "aa-2",
    adminName: "Priya Content",
    action: "Published video",
    detail: "Pipe Leak Fix — Hindi training video",
    timestamp: "3 Jun 2025, 9:45 AM",
  },
  {
    id: "aa-3",
    adminName: "Amit Support",
    action: "Resolved ticket",
    detail: "Ticket #ST-4421 — Payment issue",
    timestamp: "3 Jun 2025, 9:12 AM",
  },
  {
    id: "aa-4",
    adminName: "Rajesh Admin",
    action: "Updated settings",
    detail: "Changed homepage plumber stat to 50,000+",
    timestamp: "2 Jun 2025, 6:30 PM",
  },
  {
    id: "aa-5",
    adminName: "Suresh Mumbai",
    action: "Assigned lead",
    detail: "Lead #L-882 to Ramesh Kumar",
    timestamp: "2 Jun 2025, 3:00 PM",
  },
  {
    id: "aa-6",
    adminName: "Priya Content",
    action: "Published podcast",
    detail: "Episode 48 — Mumbai plumbing business",
    timestamp: "1 Jun 2025, 2:15 PM",
  },
  {
    id: "aa-7",
    adminName: "Rajesh Admin",
    action: "Invited admin",
    detail: "Sent invite to neha.delhi@plumber-guru.com",
    timestamp: "1 Jun 2025, 10:00 AM",
  },
  {
    id: "aa-8",
    adminName: "Amit Support",
    action: "Sent bulk SMS",
    detail: "Monsoon safety tips — 2,450 plumbers",
    timestamp: "31 May 2025, 5:45 PM",
  },
];

export const MOCK_SMS_LOGS: SmsLog[] = [
  {
    id: "sms-1",
    sentAt: "3 Jun 2025, 9:00 AM",
    target: "All Plumbers",
    messagePreview: "Monsoon pipe care tips from Plumber Guru…",
    countSent: 12450,
    status: "delivered",
    cost: 6225,
  },
  {
    id: "sms-2",
    sentAt: "2 Jun 2025, 2:30 PM",
    target: "Mumbai plumbers",
    messagePreview: "New jobs posted in Mumbai — apply now!",
    countSent: 2310,
    status: "delivered",
    cost: 1155,
  },
  {
    id: "sms-3",
    sentAt: "1 Jun 2025, 11:00 AM",
    target: "Pipe fitting skill",
    messagePreview: "Certification exam dates announced…",
    countSent: 890,
    status: "delivered",
    cost: 445,
  },
  {
    id: "sms-4",
    sentAt: "31 May 2025, 4:00 PM",
    target: "Custom list (CSV)",
    messagePreview: "Welcome to Plumber Guru verified network!",
    countSent: 45,
    status: "failed",
    cost: 0,
  },
  {
    id: "sms-5",
    sentAt: "5 Jun 2025, 8:00 AM",
    target: "Delhi plumbers",
    messagePreview: "Plumber Guru app update — new invoice tool",
    countSent: 2840,
    status: "scheduled",
    cost: 1420,
  },
];

export const MOCK_NOTIFICATION_LOGS: NotificationLog[] = [
  {
    id: "nl-1",
    title: "New training video available",
    type: "push",
    sentAt: "3 Jun 2025, 8:00 AM",
    recipientCount: 12847,
    readCount: 8420,
  },
  {
    id: "nl-2",
    title: "Job match near you",
    type: "push",
    sentAt: "2 Jun 2025, 6:00 PM",
    recipientCount: 450,
    readCount: 312,
  },
  {
    id: "nl-3",
    title: "Verification approved",
    type: "in_app",
    sentAt: "2 Jun 2025, 10:30 AM",
    recipientCount: 1,
    readCount: 1,
  },
  {
    id: "nl-4",
    title: "Platform maintenance notice",
    type: "in_app",
    sentAt: "1 Jun 2025, 9:00 AM",
    recipientCount: 15000,
    readCount: 9200,
  },
];

export const CITY_OPTIONS = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
  "Jaipur",
  "Lucknow",
];

export const SKILL_OPTIONS = [
  "Pipe fitting",
  "Water heater",
  "Drain cleaning",
  "Bathroom renovation",
  "Gas line",
];
