export type ReportedPlumber = {
  id: string;
  name: string;
  city: string;
  phone: string;
  reports: number;
  reason: string;
  lastReported: string;
  status: "open" | "reviewed" | "suspended";
};

export type ForumPost = {
  id: string;
  author: string;
  title: string;
  replies: number;
  likes: number;
  status: "published" | "flagged" | "hidden";
  createdAt: string;
};

export type ReportedContent = {
  id: string;
  type: "forum" | "comment" | "profile";
  reportedBy: string;
  target: string;
  reason: string;
  createdAt: string;
  status: "pending" | "removed" | "dismissed";
};

export type InvoiceLog = {
  id: string;
  plumber: string;
  customer: string;
  amount: string;
  gst: string;
  date: string;
  status: "paid" | "pending" | "overdue";
};

export type GstReportRow = {
  month: string;
  taxable: string;
  cgst: string;
  sgst: string;
  total: string;
};

export const MOCK_REPORTED_PLUMBERS: ReportedPlumber[] = [
  {
    id: "rp-1",
    name: "Ravi Kumar",
    city: "Delhi",
    phone: "9876543210",
    reports: 3,
    reason: "No-show after accepting job",
    lastReported: "2h ago",
    status: "open",
  },
  {
    id: "rp-2",
    name: "Suresh Patel",
    city: "Ahmedabad",
    phone: "9123456780",
    reports: 2,
    reason: "Rude behaviour with customer",
    lastReported: "1d ago",
    status: "reviewed",
  },
  {
    id: "rp-3",
    name: "Amit Singh",
    city: "Lucknow",
    phone: "9988776655",
    reports: 5,
    reason: "Fake certification uploaded",
    lastReported: "3d ago",
    status: "open",
  },
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: "fp-1",
    author: "Rajesh M.",
    title: "PVC pipe size for 2BHK bathroom?",
    replies: 24,
    likes: 89,
    status: "published",
    createdAt: "4 Jun",
  },
  {
    id: "fp-2",
    author: "Priya S.",
    title: "Best tap brand under ₹2000",
    replies: 18,
    likes: 56,
    status: "published",
    createdAt: "3 Jun",
  },
  {
    id: "fp-3",
    author: "Unknown",
    title: "Spam link post — removed",
    replies: 0,
    likes: 2,
    status: "flagged",
    createdAt: "2 Jun",
  },
];

export const MOCK_REPORTED_CONTENT: ReportedContent[] = [
  {
    id: "rc-1",
    type: "forum",
    reportedBy: "Customer #4421",
    target: "Post: Unfair pricing tips",
    reason: "Misleading advice",
    createdAt: "4 Jun",
    status: "pending",
  },
  {
    id: "rc-2",
    type: "comment",
    reportedBy: "Plumber #882",
    target: "Comment on leak fix thread",
    reason: "Abusive language",
    createdAt: "3 Jun",
    status: "pending",
  },
  {
    id: "rc-3",
    type: "profile",
    reportedBy: "Admin auto-flag",
    target: "Profile photo",
    reason: "Inappropriate image",
    createdAt: "1 Jun",
    status: "removed",
  },
];

export const MOCK_INVOICE_LOGS: InvoiceLog[] = [
  {
    id: "INV-2041",
    plumber: "Ramesh K.",
    customer: "Sunita M.",
    amount: "₹4,200",
    gst: "₹756",
    date: "4 Jun 2026",
    status: "paid",
  },
  {
    id: "INV-2038",
    plumber: "Vikram S.",
    customer: "Amit P.",
    amount: "₹2,800",
    gst: "₹504",
    date: "3 Jun 2026",
    status: "pending",
  },
  {
    id: "INV-2035",
    plumber: "Deepak R.",
    customer: "Neha G.",
    amount: "₹6,100",
    gst: "₹1,098",
    date: "1 Jun 2026",
    status: "overdue",
  },
];

export const MOCK_GST_REPORTS: GstReportRow[] = [
  { month: "Jun 2026", taxable: "₹2,45,000", cgst: "₹22,050", sgst: "₹22,050", total: "₹2,89,100" },
  { month: "May 2026", taxable: "₹2,18,400", cgst: "₹19,656", sgst: "₹19,656", total: "₹2,57,712" },
  { month: "Apr 2026", taxable: "₹1,92,300", cgst: "₹17,307", sgst: "₹17,307", total: "₹2,26,914" },
];

export const ANALYTICS_SUMMARY = {
  pageViews: 284500,
  uniqueVisitors: 42100,
  signups: 892,
  jobApplications: 6340,
  conversionRate: 3.2,
};

export const ANALYTICS_TRAFFIC = [
  { date: "28 May", views: 8200, signups: 24 },
  { date: "29 May", views: 9100, signups: 31 },
  { date: "30 May", views: 8800, signups: 28 },
  { date: "31 May", views: 9500, signups: 35 },
  { date: "1 Jun", views: 10200, signups: 42 },
  { date: "2 Jun", views: 9800, signups: 38 },
  { date: "3 Jun", views: 11100, signups: 45 },
  { date: "4 Jun", views: 10800, signups: 41 },
];
